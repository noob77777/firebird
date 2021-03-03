import FirebirdContext from "./FirebirdContext/FirebirdContext";
import { useContext, useEffect } from "react";
import Login from "./Components/Login/Login";
import Messenger from "./Components/Messenger/Messenger";
import M from "materialize-css";
import Modal from "./Components/Modal/Modal";
import { SESSION_KEY } from "./constants";
import ActionTypes from "./FirebirdContext/ActionTypes";

const App = (): JSX.Element => {
  const { state, dispatch } = useContext(FirebirdContext);

  useEffect(() => {
    M.AutoInit();
  });

  useEffect(() => {
    const data = sessionStorage.getItem(SESSION_KEY);
    if (data) {
      const auth = JSON.parse(data);
      dispatch({ type: ActionTypes.SIGN_IN, payload: auth });
    }
  }, [dispatch]);

  return (
    <>
      {state.auth.sessionKey ? <Messenger /> : <Login />}
      <Modal />
      {/* <a className="waves-effect waves-light btn modal-trigger" href="#modal1">
        Modal
      </a>
      <div id="modal1" className="modal">
        <div className="modal-content">
          <h4>Modal Header</h4>
          <p>A bunch of text</p>
        </div>
        <div className="modal-footer">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn-flat"
          >
            Agree
          </a>
        </div>
      </div> */}
    </>
  );
};

export default App;
