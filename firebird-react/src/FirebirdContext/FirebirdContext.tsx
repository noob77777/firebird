import { createContext, Dispatch, useReducer } from "react";
import { addMessages } from "../Components/Messenger/MessengerMain/MessengerMain";
import {
  CONTACTS_SUFFIX,
  MESSAGE_FAILED,
  MESSAGE_SENT,
  PRIVATE_KEY_SUFFIX,
  PUBLIC_KEY_SUFFIX,
  SESSION_KEY,
} from "../constants";
import ActionTypes from "./ActionTypes";

export interface User {
  userName: string;
  publicKey: string | null;
  active: boolean;
}

export const isUser = (o: any): o is User => {
  return o && "userName" in o && "publicKey" in o && "active" in o;
};

export interface Group {
  groupName: string;
  members: string[];
}

export const isGroup = (o: any): o is Group => {
  return o && "groupName" in o && "members" in o;
};

export interface Message {
  timestamp: number;
  id: string;
  type: string;
  sender: string;
  receiver: string;
  body: any;
  status?: string;
}

export const isMessage = (o: any): o is Message => {
  return (
    o &&
    "timestamp" in o &&
    "id" in o &&
    "type" in o &&
    "sender" in o &&
    "receiver" in o &&
    "body" in o
  );
};

export interface Contact {
  user: User | Group;
  messages: Message[];
  unread: boolean;
}

export const isContact = (o: any): o is Contact => {
  return o && "user" in o && "messages" in o;
};

export interface FirebirdState {
  auth: {
    userName: string | null;
    sessionKey: string | null;
    privateKey: string | null;
    publicKey: string | null;
    hash: string | null;
  };
  contacts: Contact[];
  currentReceiver: string | null;
}

export const isFirebirdState = (o: any): o is FirebirdState => {
  return (
    "auth" in o &&
    "sessionKey" in o.auth &&
    "privateKey" in o.auth &&
    "publicKey" in o.auth &&
    "hash" in o.auth &&
    "contacts" in o &&
    "currentReceiver" in o
  );
};

export interface FirebirdContextAction {
  type: string;
  payload: any;
}

const initState: FirebirdState = {
  auth: {
    userName: null,
    sessionKey: null,
    privateKey: null,
    publicKey: null,
    hash: null,
  },
  contacts: [],
  currentReceiver: null,
};

const FirebirdContext = createContext<{
  state: FirebirdState;
  dispatch: Dispatch<FirebirdContextAction>;
}>({ state: initState, dispatch: () => null });

export const FirebirdContextReducer = (
  state: FirebirdState,
  action: FirebirdContextAction
): FirebirdState => {
  switch (action.type) {
    case ActionTypes.SIGN_UP:
      localStorage.setItem(
        action.payload.userName + PRIVATE_KEY_SUFFIX,
        action.payload.privateKey
      );
      localStorage.setItem(
        action.payload.userName + PUBLIC_KEY_SUFFIX,
        action.payload.publicKey
      );
      return { ...state, auth: { ...state.auth, ...action.payload } };
    case ActionTypes.LOAD_RSA_KEYS:
      return { ...state, auth: { ...state.auth, ...action.payload } };
    case ActionTypes.SIGN_IN:
      return { ...state, auth: { ...state.auth, ...action.payload } };
    case ActionTypes.LOAD_USER_LOCAL_STATE:
      return { ...state, contacts: [...action.payload] };
    case ActionTypes.UPDATE_CONTACTS:
      localStorage.setItem(
        state.auth.userName + CONTACTS_SUFFIX,
        JSON.stringify(action.payload)
      );
      return { ...state, contacts: [...action.payload] };
    case ActionTypes.SET_RECEIVER:
      const contacts = state.contacts.map((contact) => {
        if (
          isUser(contact.user) &&
          contact.user.userName === action.payload.currentReceiver
        ) {
          return {
            ...contact,
            user: {
              ...contact.user,
              publicKey: action.payload.publicKey
                ? action.payload.publicKey
                : contact.user.publicKey,
              active: action.payload.active,
            },
            unread: false,
          };
        } else if (
          isGroup(contact.user) &&
          contact.user.groupName === action.payload.currentReceiver
        ) {
          return {
            ...contact,
            user: {
              ...contact.user,
              members: [...action.payload.members],
            },
            unread: false,
          };
        } else {
          return contact;
        }
      });
      localStorage.setItem(
        state.auth.userName + CONTACTS_SUFFIX,
        JSON.stringify(contacts)
      );
      return {
        ...state,
        currentReceiver: action.payload.currentReceiver,
        contacts: contacts,
      };
    case ActionTypes.NEW_MESSAGE:
      const contactsNM = addMessages(
        state.contacts,
        [action.payload],
        state.auth.privateKey,
        false
      );
      localStorage.setItem(
        state.auth.userName + CONTACTS_SUFFIX,
        JSON.stringify(contactsNM)
      );
      return { ...state, contacts: [...contactsNM] };
    case ActionTypes.SEND_NEW_MESSAGE:
      const contactsSNM = addMessages(
        state.contacts,
        [action.payload],
        null,
        true
      );
      localStorage.setItem(
        state.auth.userName + CONTACTS_SUFFIX,
        JSON.stringify(contactsSNM)
      );
      return { ...state, contacts: [...contactsSNM] };
    case ActionTypes.SET_ACK_FLAG:
      const contactsSAF = state.contacts.map((contact: Contact) => {
        return {
          ...contact,
          messages: contact.messages.map((message: Message) => {
            if (message.id === action.payload.id) {
              return {
                ...message,
                status: action.payload.body ? MESSAGE_SENT : MESSAGE_FAILED,
              };
            } else {
              return message;
            }
          }),
        };
      });
      localStorage.setItem(
        state.auth.userName + CONTACTS_SUFFIX,
        JSON.stringify(contactsSAF)
      );
      return { ...state, contacts: [...contactsSAF] };
    case ActionTypes.LOGOUT:
      sessionStorage.removeItem(SESSION_KEY);
      return { ...state, auth: { ...state.auth, sessionKey: action.payload } };
    default:
      return state;
  }
};

export const FirebirdContextProvider = (props: any): JSX.Element => {
  const [state, dispatch] = useReducer(FirebirdContextReducer, initState);
  return (
    <FirebirdContext.Provider value={{ state, dispatch }}>
      {props.children}
    </FirebirdContext.Provider>
  );
};

export default FirebirdContext;
