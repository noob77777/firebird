import { useContext, useEffect, useState } from "react";
import FirebirdContext from "../../FirebirdContext/FirebirdContext";
import NodeRsa from "node-rsa";
import crypto from "crypto";
import styles from "./Login.module.scss";
import API from "../../API/API";
import ActionTypes from "../../FirebirdContext/ActionTypes";
import {
  PRIVATE_KEY_SUFFIX,
  PUBLIC_KEY_SUFFIX,
  USER_PREFIX,
} from "../../constants";

const Login = (): JSX.Element => {
  const { state, dispatch } = useContext(FirebirdContext);
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const privateKey = localStorage.getItem(
      USER_PREFIX + userName + PRIVATE_KEY_SUFFIX
    );
    const publicKey = localStorage.getItem(
      USER_PREFIX + userName + PUBLIC_KEY_SUFFIX
    );
    if (privateKey && publicKey) {
      const hash = crypto.createHash("sha256").update(privateKey).digest("hex");
      dispatch({
        type: ActionTypes.LOAD_RSA_KEYS,
        payload: { privateKey, publicKey, hash },
      });
    } else {
      dispatch({
        type: ActionTypes.LOAD_RSA_KEYS,
        payload: { privateKey: null, publicKey: null, hash: null },
      });
    }
  }, [dispatch, userName]);

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const hash = state.auth.hash;
    if (hash) {
      try {
        const res = await API.post("/api/validateUser", {
          userName: USER_PREFIX + userName,
          hash: hash,
        });
        dispatch({
          type: ActionTypes.SIGN_IN,
          payload: {
            userName: res.data.userName,
            sessionKey: res.data.sessionKey,
          },
        });
      } catch (err) {
        switch (err.response.status) {
          case 401:
            setErrorMessage("Authentication failed");
            break;
          default:
            setErrorMessage("Cannot contact server. Try again");
        }
      }
    } else {
      setErrorMessage("RSA credentials not found in local storage");
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const key = new NodeRsa({ b: 512 });
    const publicKey = key.exportKey("public");
    const privateKey = key.exportKey("private");
    const hash = crypto.createHash("sha256").update(privateKey).digest("hex");
    try {
      const res = await API.post("/api/createUser", {
        userName: USER_PREFIX + userName,
        hash: hash,
        publicKey: publicKey,
      });
      dispatch({
        type: ActionTypes.SIGN_UP,
        payload: {
          auth: {
            privateKey: privateKey,
            publicKey: publicKey,
            hash: hash,
          },
          userName: res.data.userName,
        },
      });
    } catch (err) {
      switch (err.response.status) {
        case 401:
          setErrorMessage("User already exists");
          break;
        default:
          setErrorMessage("Cannot contact server. Try again");
      }
    }
  };

  return (
    <div className={styles.Login}>
      <form>
        <input
          id="user"
          type="text"
          className="validate"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          value={userName}
        />
        <label htmlFor="user">Username: </label>
        <button onClick={onSignIn}>Sign In</button>
        <button onClick={onSignUp}>Sign Up</button>
        {errorMessage}
      </form>
    </div>
  );
};

export default Login;
