import FirebirdContext from "./FirebirdContext/FirebirdContext";
import { useContext, useEffect } from "react";
import Login from "./Components/Login/Login";
import Messenger from "./Components/Messenger/Messenger";
import M from "materialize-css";

const App = (): JSX.Element => {
  const { state } = useContext(FirebirdContext);

  useEffect(() => {
    M.AutoInit();
  });

  return <>{state.auth.sessionKey ? <Messenger /> : <Login />}</>;
};

export default App;
