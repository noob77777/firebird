import { createContext, Dispatch, useReducer } from "react";
import { PRIVATE_KEY_SUFFIX, PUBLIC_KEY_SUFFIX } from "../constants";
import ActionTypes from "./ActionTypes";

export interface User {
  userName: string;
  publicKey: string | null;
  active: boolean;
}

export const isUser = (o: any): o is User => {
  return "userName" in o && "publicKey" in o && "active" in o;
};

export interface Group {
  groupName: string;
  members: string[];
}

export const isGroup = (o: any): o is Group => {
  return "groupName" in o && "members" in o;
};

export interface Message {
  timestamp: number;
  id: string;
  type: string;
  sender: string;
  receiver: string;
  body: any;
}

export const isMessage = (o: any): o is Message => {
  return (
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
}

export const isContact = (o: any): o is Contact => {
  return "user" in o && "messages" in o;
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
        action.payload.auth.privateKey
      );
      localStorage.setItem(
        action.payload.userName + PUBLIC_KEY_SUFFIX,
        action.payload.auth.publicKey
      );
      return { ...state, auth: { ...state.auth, ...action.payload.auth } };
    case ActionTypes.LOAD_RSA_KEYS:
      return { ...state, auth: { ...state.auth, ...action.payload } };
    case ActionTypes.SIGN_IN:
      return { ...state, auth: { ...state.auth, ...action.payload } };
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
