import FirebirdContext from "./FirebirdContext/FirebirdContext";
import { useContext } from "react";
import Login from "./Components/Login/Login";

const App = (): JSX.Element => {
  const { state } = useContext(FirebirdContext);

  return (
    <>
      <Login />
    </>
  );
};

export default App;
