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
    </>
  );
};

export default App;
