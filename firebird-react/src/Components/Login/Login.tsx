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
  SESSION_KEY,
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
        setErrorMessage("Signing you in...");
        const res = await API.post("/api/validateUser", {
          userName: USER_PREFIX + userName,
          hash: hash,
        });
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            ...state.auth,
            sessionKey: res.data.sessionKey,
            userName: res.data.userName,
          })
        );
        dispatch({
          type: ActionTypes.SIGN_IN,
          payload: {
            userName: res.data.userName,
            sessionKey: res.data.sessionKey,
          },
        });
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 401:
              setErrorMessage("Authentication failed.");
              break;
            default:
              setErrorMessage("Something went wrong. Try again.");
          }
        } else {
          setErrorMessage("Could not contact server. Try again.");
        }
      }
    } else {
      setErrorMessage("RSA credentials not found in local storage.");
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
      setErrorMessage("Creating new user...");
      const res = await API.post("/api/createUser", {
        userName: USER_PREFIX + userName,
        hash: hash,
        publicKey: publicKey,
      });
      localStorage.setItem(res.data.userName + PRIVATE_KEY_SUFFIX, privateKey);
      localStorage.setItem(res.data.userName + PUBLIC_KEY_SUFFIX, publicKey);
      dispatch({
        type: ActionTypes.SIGN_UP,
        payload: {
          privateKey: privateKey,
          publicKey: publicKey,
          hash: hash,
        },
      });
      setErrorMessage("User created.");
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setErrorMessage("User already exists.");
            break;
          default:
            setErrorMessage("Something went wrong. Try again.");
        }
      } else {
        setErrorMessage("Could not contact server. Try again.");
      }
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.loginContainer + " row"}>
        <div
          className={
            styles.banner + " col l8 m6 hide-on-small-only valign-wrapper"
          }
        >
          <div className="col m11 offset-m1">
            <h1>Introducing firebird.</h1>
            <h5>A Fast end-to-end Encrypted Messenger</h5>
            <p>
              No more remembering passwords. <br />
              Password-less authentication using asymmetric key pairs for one
              tap <br />
              login and signing up. <br />
            </p>
            <p>
              All user information is persisted client-side. <br />
            </p>
          </div>
        </div>
        <div className={styles.loginForm + " col l4 m6 s12 valign-wrapper"}>
          <form className={styles.formMain}>
            <div className={styles.loginHeader + " row"}>
              <h1>firebird</h1>
              <h6>Secured by RSA end-to-end Encryption</h6>
            </div>
            <div className="row">
              <div className="input-field col s8 offset-s2">
                <input
                  id="user"
                  type="text"
                  className="validate"
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setErrorMessage("");
                  }}
                  value={userName}
                />
                <label htmlFor="user">Username: </label>
                <span className={styles.error + " helper-text"}>
                  {errorMessage}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col s3 offset-s3 center">
                <button
                  className={styles.submitbtn + " btn"}
                  onClick={onSignIn}
                >
                  Sign In
                </button>
              </div>
              <div className="col s3 center">
                <button
                  className={styles.submitbtn + " btn"}
                  onClick={onSignUp}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
