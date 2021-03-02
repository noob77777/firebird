import { useContext, useEffect } from "react";
import { CONTACTS_SUFFIX } from "../../constants";
import ActionTypes from "../../FirebirdContext/ActionTypes";
import FirebirdContext from "../../FirebirdContext/FirebirdContext";
import Contacts from "./Contacts/Contacts";
import styles from "./Messenger.module.scss";

const Messenger = (): JSX.Element => {
  const { state, dispatch } = useContext(FirebirdContext);

  useEffect(() => {
    if (state.auth.userName) {
      const data = localStorage.getItem(state.auth.userName + CONTACTS_SUFFIX);
      if (data) {
        const contacts = JSON.parse(data);
        dispatch({
          type: ActionTypes.LOAD_USER_LOCAL_STATE,
          payload: contacts,
        });
      }
    }
  }, [dispatch, state.auth.userName]);

  return (
    <div className={styles.Messenger}>
      <Contacts />
    </div>
  );
};

export default Messenger;
