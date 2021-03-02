import { useContext, useEffect, useState } from "react";
import API from "../../../API/API";
import { CONTACTS_SUFFIX, GROUP_PREFIX, USER_PREFIX } from "../../../constants";
import ActionTypes from "../../../FirebirdContext/ActionTypes";
import FirebirdContext, {
  Contact,
  Group,
  isGroup,
  isUser,
} from "../../../FirebirdContext/FirebirdContext";
import styles from "./Contacts.module.scss";

const Contacts = (): JSX.Element => {
  const { state, dispatch } = useContext(FirebirdContext);
  const [search, setSearch] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(state.contacts);

  useEffect(() => {
    const newFilteredContacts = state.contacts.filter((contact) => {
      if (
        isUser(contact.user) &&
        contact.user.userName.startsWith(USER_PREFIX + search)
      ) {
        return true;
      }
      if (
        isGroup(contact.user) &&
        contact.user.groupName.startsWith(GROUP_PREFIX + search)
      ) {
        return true;
      }
      return false;
    });
    setFilteredContacts(newFilteredContacts);
  }, [state.contacts, search]);

  const addContact = async (user: string) => {
    user = USER_PREFIX + user;
    const alreadyExists = state.contacts.filter(
      (x) => isUser(x.user) && x.user.userName === user
    );
    if (alreadyExists.length) {
      return;
    }
    try {
      const res = await API.get(
        `/api/publicKey?userName=${state.auth.userName}&sessionKey=${state.auth.sessionKey}&user=${user}`
      );
      const contact: Contact = {
        user: {
          userName: user,
          publicKey: res.data.publicKey,
          active: false,
        },
        messages: [],
      };
      const contacts = state.contacts;
      contacts.push(contact);
      localStorage.setItem(
        state.auth.userName + CONTACTS_SUFFIX,
        JSON.stringify(contacts)
      );
      dispatch({ type: ActionTypes.UPDATE_CONTACTS, payload: contacts });
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            console.log("Invalid username");
            break;
          default:
            console.log("Something went wrong. Try again");
        }
      } else {
        console.log("Could not contact server. Try again");
      }
    }
  };

  const removeContact = (user: string) => {
    const contacts = state.contacts.filter((x) => {
      if (isUser(x.user) && x.user.userName === user) {
        return false;
      } else if (isGroup(x.user) && x.user.groupName === user) {
        return false;
      }
      return true;
    });
    localStorage.setItem(
      state.auth.userName + CONTACTS_SUFFIX,
      JSON.stringify(contacts)
    );
    dispatch({ type: ActionTypes.UPDATE_CONTACTS, payload: contacts });
  };

  const setCurrentReceiver = (user: string) => {
    dispatch({ type: ActionTypes.SET_RECEIVER, payload: user });
  };

  const createGroup = async (group: string) => {
    group = GROUP_PREFIX + group;
    try {
      const res = await API.post("/api/createGroup", {
        userName: state.auth.userName,
        sessionKey: state.auth.sessionKey,
        groupName: group,
      });
      const newGroup: Group = { groupName: res.data.groupName, members: [] };
      if (state.auth.userName) {
        newGroup.members.push(state.auth.userName);
      }
      const contacts = state.contacts;
      contacts.push({ user: newGroup, messages: [] });
      localStorage.setItem(
        state.auth.userName + CONTACTS_SUFFIX,
        JSON.stringify(contacts)
      );
      dispatch({ type: ActionTypes.UPDATE_CONTACTS, payload: contacts });
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            console.log("Group already exists");
            break;
          default:
            console.log("Something went wrong. Try again");
        }
      } else {
        console.log("Could not contact server. Try again");
      }
    }
  };

  const joinGroup = async (group: string) => {
    group = GROUP_PREFIX + group;
    const alreadyExists = state.contacts.filter(
      (x) => isGroup(x.user) && x.user.groupName === group
    );
    if (alreadyExists.length) {
      return;
    }
    try {
      const resJoin = await API.post("/api/joinGroup", {
        userName: state.auth.userName,
        sessionKey: state.auth.sessionKey,
        groupName: group,
      });
      const resMembers = await API.get(
        `/api/groupMembers?userName=${state.auth.userName}&groupName=${group}&sessionKey=${state.auth.sessionKey}`
      );
      const newGroup: Group = {
        groupName: resJoin.data.groupName,
        members: resMembers.data.groupMembers,
      };
      const contacts = state.contacts;
      contacts.push({ user: newGroup, messages: [] });
      localStorage.setItem(
        state.auth.userName + CONTACTS_SUFFIX,
        JSON.stringify(contacts)
      );
      dispatch({ type: ActionTypes.UPDATE_CONTACTS, payload: contacts });
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            console.log("Group does not exist");
            break;
          default:
            console.log("Something went wrong. Try again");
        }
      } else {
        console.log("Could not contact server. Try again");
      }
    }
  };

  const ContactView = (contact: Contact, index: number): JSX.Element => {
    return (
      <li key={index} className={styles.ContactView}>
        <div>
          <button
            className="btn"
            onClick={() => {
              setCurrentReceiver(
                isUser(contact.user)
                  ? contact.user.userName
                  : contact.user.groupName
              );
            }}
          >
            <i className="large material-icons left">
              {isUser(contact.user) ? "account_circle" : "group"}
            </i>
            {isUser(contact.user)
              ? contact.user.userName
              : contact.user.groupName}
            <a
              className="right"
              href="#react"
              onClick={() =>
                removeContact(
                  isUser(contact.user)
                    ? contact.user.userName
                    : contact.user.groupName
                )
              }
            >
              <i className="material-icons">close</i>
            </a>
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className={styles.Contacts}>
      <div className="row">
        <div className="col s12">
          <div className={styles.btngrp}>
            <div className={styles.search + " row"}>
              <div className="col s10 offset-s1">
                <div className="input-field">
                  <i className="material-icons prefix">search</i>
                  <input
                    id="search"
                    type="text"
                    className="validate"
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    value={search}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col s4 center">
                <button
                  type="button"
                  className={styles.btn + " btn"}
                  onClick={() => {
                    addContact(search);
                  }}
                >
                  Add Contact
                </button>
              </div>
              <div className="col s4 center">
                <button
                  type="button"
                  className={styles.btn + " btn"}
                  onClick={() => createGroup(search)}
                >
                  Create Group
                </button>
              </div>
              <div className="col s4 center">
                <button
                  type="button"
                  className={styles.btn + " btn"}
                  onClick={() => joinGroup(search)}
                >
                  Join Group
                </button>
              </div>
            </div>
          </div>
          <ul className={styles.list}>
            {filteredContacts.length ? (
              filteredContacts.map((contact, index) =>
                ContactView(contact, index)
              )
            ) : (
              <div className={styles.vh60 + " valign-wrapper center-align"}>
                <div className={styles.ncpfcenter}>
                  <h6>No contacts for applied filter</h6>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
