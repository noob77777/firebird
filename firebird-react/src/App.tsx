import FirebirdContext from "./FirebirdContext/FirebirdContext";
import { useContext, useEffect } from "react";
import styles from "./App.module.scss";
import ActionTypes from "./FirebirdContext/ActionTypes";

const App = (): JSX.Element => {
  const { state, dispatch } = useContext(FirebirdContext);
  console.log(state);

  useEffect(() => {
    dispatch({ type: ActionTypes.DISPATCH_TEST, payload: null });
  }, [dispatch]);

  return (
    <div className={styles.App}>
      <h1>Hi</h1>
    </div>
  );
};

export default App;
