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
import { modalNotify } from "../../Modal/Modal";
import styles from "./MessengerMain.module.scss";
import {
  ACK_MESSAGE,
  CONTACTS_SUFFIX,
  FIREBIRD_SERVER,
  GROUP_PREFIX,
  RECV_MESSAGE,
  SEND_MESSAGE,
  TYPE_TEXT,
  USER_SERVER,
  USER_STATE_CHANGE,
} from "../../../constants";
import ActionTypes from "../../../FirebirdContext/ActionTypes";
import crypto from "crypto";

const socket = io(FIREBIRD_SERVER);

const MessengerMain = (): JSX.Element => {
  const { state, dispatch } = useContext(FirebirdContext);
  const [text, setText] = useState("");

  const sendMessage = (data: string, type: string): void => {
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
    };
    socket.emit(
      SEND_MESSAGE,
      JSON.stringify({
        userName: state.auth.userName,
        sessionKey: state.auth.sessionKey,
        message: message,
      })
    );
  };

  const addMessages = (contacts: Contact[], messages: Message[]): Contact[] => {
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
        const idx = res.findIndex((contact) => {
          return (
            isUser(contact.user) && contact.user.userName === message.sender
          );
        });
        if (idx === -1) {
          const newUser: User = {
            userName: message.sender,
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

  useEffect(() => {
    socket.emit(
      "new_connection",
      JSON.stringify({
        userName: state.auth.userName,
        sessionKey: state.auth.sessionKey,
      })
    );
    socket.on(RECV_MESSAGE, (data: any) => {
      const message: Message = JSON.parse(data);
      const newState: Contact[] = addMessages(state.contacts, [message]);
      dispatch({ type: ActionTypes.UPDATE_CONTACTS, payload: newState });
    });
    socket.on(ACK_MESSAGE, (data: any) => {
      console.log("ack_message: " + data);
    });
    socket.on(USER_STATE_CHANGE, (data: any) => {
      console.log("user_state_change: " + data);
    });

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
          const updatedContacts = addMessages(contacts, messages);
          dispatch({
            type: ActionTypes.UPDATE_CONTACTS,
            payload: updatedContacts,
          });
        } catch (err) {
          if (err.response) {
            switch (err.response) {
              case 401:
                modalNotify(
                  "Session key may have expired, please login again."
                );
                break;
            }
          } else {
            modalNotify("Could not contact contact server.");
          }
        }
      }
    };
    getPendingMessages();
  }, [dispatch, state.auth.sessionKey, state.auth.userName]);

  return (
    <div className={styles.MessengerMain}>
      <div>{state.currentReceiver};</div>
      <div>
        {state.currentReceiver
          ? JSON.stringify(
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
              })[0].messages
            )
          : null}
      </div>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button
          onClick={() => {
            if (state.currentReceiver) {
              sendMessage(text, TYPE_TEXT);
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessengerMain;