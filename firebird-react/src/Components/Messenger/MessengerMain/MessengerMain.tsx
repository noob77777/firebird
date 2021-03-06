import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import FirebirdContext, {
  Message,
  Contact,
  isGroup,
  Group,
  isUser,
  User,
} from "../../../FirebirdContext/FirebirdContext";
import API from "../../../API/API";
import { modalNotify } from "../../Notifier/Notifier";
import styles from "./MessengerMain.module.scss";
import {
  ACK_MESSAGE,
  CONTACTS_SUFFIX,
  FIREBIRD_SERVER,
  GROUP_PREFIX,
  MESSAGE_FAILED,
  MESSAGE_PENDING,
  MESSAGE_SENT,
  RECV_MESSAGE,
  SEND_MESSAGE,
  TYPE_IMAGE,
  TYPE_TEXT,
  USER_PREFIX,
  USER_SERVER,
  USER_STATE_CHANGE,
} from "../../../constants";
import ActionTypes from "../../../FirebirdContext/ActionTypes";
import crypto from "crypto";
import NodeRSA from "node-rsa";

const socket = io(FIREBIRD_SERVER);

const decrypt = (message: Message, privateKey: string | null): Message => {
  if (message.receiver.startsWith(GROUP_PREFIX) || message.type !== TYPE_TEXT) {
    return { ...message };
  }
  if (!privateKey) {
    return { ...message };
  }
  try {
    const key = new NodeRSA().importKey(privateKey, "private");
    const res: Message = { ...message };
    res.body = key.decrypt(res.body, "utf8");
    return res;
  } catch (err) {
    modalNotify("Invalid private key.");
    return { ...message };
  }
};

const encrypt = (message: Message, publicKey: string | null): Message => {
  if (message.receiver.startsWith(GROUP_PREFIX) || message.type !== TYPE_TEXT) {
    return { ...message };
  }
  if (!publicKey) {
    modalNotify("Invalid public key from sender.");
    return { ...message };
  }
  try {
    const key = new NodeRSA().importKey(publicKey, "public");
    const res: Message = { ...message };
    res.body = key.encrypt(res.body, "base64");
    return res;
  } catch (err) {
    modalNotify("Invalid public key from sender.");
    return { ...message };
  }
};

// top ten bruh moment functions.
export const addMessages = (
  contacts: Contact[],
  messages: Message[],
  privateKey: string | null,
  sent: boolean
): Contact[] => {
  const res = [...contacts];
  messages.forEach((message) => {
    if (message.receiver && message.receiver.startsWith(GROUP_PREFIX)) {
      const idx = res.findIndex((contact) => {
        return (
          isGroup(contact.user) && contact.user.groupName === message.receiver
        );
      });
      if (idx === -1) {
        const newGroup: Group = { groupName: message.receiver, members: [] };
        res.push({ user: newGroup, messages: [{ ...message }] });
      } else {
        res[idx].messages.push(message);
      }
    } else if (message.receiver && message.receiver === USER_SERVER) {
    } else {
      message = decrypt(message, privateKey);
      const idx = res.findIndex((contact) => {
        return (
          isUser(contact.user) &&
          contact.user.userName === (sent ? message.receiver : message.sender)
        );
      });
      if (idx === -1) {
        const newUser: User = {
          userName: sent ? message.receiver : message.sender,
          publicKey: null,
          active: false,
        };
        res.push({ user: newUser, messages: [{ ...message }] });
      } else {
        res[idx].messages.push(message);
      }
    }
  });
  return res;
};

const updateScroll = (): void => {
  const element = document.getElementById("scrolldiv");
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
};

const MessengerMain = (): JSX.Element => {
  const { state, dispatch } = useContext(FirebirdContext);
  const [text, setText] = useState("");
  const [file, setFile] = useState<string | null>(null);

  useEffect(() => {
    updateScroll();
  }, [state.contacts]);

  const userPresent =
    state.currentReceiver &&
    state.contacts.filter((contact) => {
      if (
        isUser(contact.user) &&
        contact.user.userName === state.currentReceiver
      ) {
        return true;
      }
      if (
        isGroup(contact.user) &&
        contact.user.groupName === state.currentReceiver
      ) {
        return true;
      }
      return false;
    }).length !== 0;

  const sendMessage = (data: string | FormData, type: string): void => {
    console.log(data);
    const timestamp = Date.now();
    const message: Message = {
      timestamp: Date.now(),
      id: crypto
        .createHash("sha256")
        .update(timestamp + "." + state.auth.userName)
        .digest("hex"),
      type: type,
      sender: state.auth.userName ? state.auth.userName : "",
      receiver: state.currentReceiver ? state.currentReceiver : "",
      body: data,
      status: MESSAGE_PENDING,
    };
    let publicKey = null;
    const contact = state.contacts.filter((contact) => {
      if (
        isUser(contact.user) &&
        contact.user.userName === state.currentReceiver
      ) {
        return true;
      }
      return false;
    });
    if (contact.length && isUser(contact[0].user)) {
      publicKey = contact[0].user.publicKey;
    }
    socket.emit(
      SEND_MESSAGE,
      JSON.stringify({
        userName: state.auth.userName,
        sessionKey: state.auth.sessionKey,
        message: { ...encrypt(message, publicKey), status: undefined },
      })
    );
    dispatch({
      type: ActionTypes.SEND_NEW_MESSAGE,
      payload: message,
    });
    setText("");
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit(
      "new_connection",
      JSON.stringify({
        userName: state.auth.userName,
        sessionKey: state.auth.sessionKey,
      })
    );

    socket.on(RECV_MESSAGE, (data: any) => {
      const message: Message = JSON.parse(data);
      dispatch({ type: ActionTypes.NEW_MESSAGE, payload: message });
    });

    socket.on(ACK_MESSAGE, (data: any) => {
      const message: Message = JSON.parse(data);
      dispatch({ type: ActionTypes.SET_ACK_FLAG, payload: message });
    });

    socket.on(USER_STATE_CHANGE, (data: any) => {
      console.log("user_state_change: " + data);
    });

    return () => {
      socket.close();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getPendingMessages = async () => {
      if (state.auth.userName && state.auth.sessionKey) {
        try {
          const res = await API.get(
            `/api/pendingMessages?userName=${state.auth.userName}&sessionKey=${state.auth.sessionKey}`
          );
          const messages: Message[] = res.data.messageList;
          const data = localStorage.getItem(
            state.auth.userName + CONTACTS_SUFFIX
          );
          const contacts = data ? JSON.parse(data) : [];
          const updatedContacts = addMessages(
            contacts,
            messages,
            state.auth.privateKey,
            false
          );
          dispatch({
            type: ActionTypes.UPDATE_CONTACTS,
            payload: updatedContacts,
          });
        } catch (err) {
          if (err.response) {
            switch (err.response.status) {
              case 401:
                modalNotify(
                  "Session key may have expired, please login again."
                );
                break;
              default:
                modalNotify("Something went wrong. Try again.");
                break;
            }
          } else {
            modalNotify("Could not contact contact server.");
          }
        }
      }
    };
    getPendingMessages();
  }, [
    dispatch,
    state.auth.sessionKey,
    state.auth.userName,
    state.auth.privateKey,
  ]);

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    if (reader.result) {
      setFile(reader.result.toString());
    }
  });

  useEffect(() => {
    if (file) {
      sendMessage(file, TYPE_IMAGE);
      setFile(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const MessageView = (message: Message, key: number): JSX.Element => {
    const MessageViewInner = (): JSX.Element => {
      var icon: JSX.Element = <></>;
      switch (message.status) {
        case MESSAGE_PENDING:
          icon = <i className="material-icons">access_time</i>;
          break;
        case MESSAGE_FAILED:
          icon = <i className="material-icons">error</i>;
          break;
        case MESSAGE_SENT:
          icon = <i className="material-icons">check_circle</i>;
          break;
      }
      var body: JSX.Element = <></>;
      if (message.type === TYPE_TEXT && typeof message.body === "string") {
        body = <>{message.body}</>;
      } else if (
        message.type === TYPE_IMAGE &&
        typeof message.body === "string"
      ) {
        body = (
          <>
            <img
              className={styles.image + " materialboxed"}
              src={message.body}
              alt="<>img data not loaded</>"
            />
          </>
        );
      }

      return (
        <>
          <p>
            <i className="material-icons">account_circle</i>
            <small>{message.sender.replace(USER_PREFIX, "")}</small>
          </p>
          <p>{body}</p>
          <p>
            <small>{new Date(message.timestamp).toISOString()}</small>
            <small className="right">{icon}</small>
          </p>
        </>
      );
    };

    return (
      <div key={key} className={styles.MessageView}>
        <div className="row">
          {message.sender !== state.auth.userName ? (
            <div
              className={
                styles.receiver +
                " " +
                (message.type === TYPE_IMAGE ? styles.reimage : "") +
                " col l5 s8"
              }
            >
              <MessageViewInner />
            </div>
          ) : (
            <div className={styles.sender + " col l5 s8 offset-l7  offset-s4"}>
              <MessageViewInner />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.MessengerMain}>
      {userPresent ? (
        <div className={styles.header + " row"}>
          <div className="col s12">
            <h5>{state.currentReceiver}</h5>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="row">
        {userPresent ? (
          <div id="scrolldiv" className={styles.scroll + " col s12"}>
            {state.contacts
              .filter((contact) => {
                if (
                  isUser(contact.user) &&
                  contact.user.userName === state.currentReceiver
                ) {
                  return true;
                }
                if (
                  isGroup(contact.user) &&
                  contact.user.groupName === state.currentReceiver
                ) {
                  return true;
                }
                return false;
              })[0]
              .messages.map(MessageView)}
          </div>
        ) : (
          <div
            className={styles.empty + " col s12 valign-wrapper center-align"}
          >
            <div className={styles.ncscenter}>
              <h6>No contact selected.</h6>
            </div>
          </div>
        )}
      </div>
      {userPresent ? (
        <div className={styles.input + " row"}>
          <div className="col s12">
            <div className="row">
              <div className="col s8 l10 input-field">
                <input
                  id="main-text-send"
                  type="text"
                  className="validate"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />
                <label htmlFor="main-text-send">Type a message</label>
              </div>
              <div className="col l1 s2 center">
                <button
                  className="btn"
                  onClick={() => {
                    if (state.currentReceiver) {
                      sendMessage(text, TYPE_TEXT);
                    }
                  }}
                >
                  <i className="material-icons">send</i>
                </button>
              </div>
              <div className="col l1 s2 center">
                <input
                  id="imgupload"
                  type="file"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length) {
                      reader.readAsDataURL(e.target.files[0]);
                    } else {
                      setFile(null);
                    }
                  }}
                />
                <button
                  className="btn"
                  onClick={() => {
                    const btn = document.getElementById("imgupload");
                    if (btn) {
                      btn.click();
                    }
                  }}
                >
                  <i className="material-icons">add_a_photo</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MessengerMain;
