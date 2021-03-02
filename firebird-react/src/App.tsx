import FirebirdContext from "./FirebirdContext/FirebirdContext";
import { useContext } from "react";
import Login from "./Components/Login/Login";
import Messenger from "./Components/Messenger/Messenger";

const App = (): JSX.Element => {
  const { state } = useContext(FirebirdContext);
  return <>{state.auth.sessionKey ? <Messenger /> : <Login />}</>;
};

export default App;
