import { useContext, useEffect } from "react";
import { CONTACTS_SUFFIX } from "../../constants";
import ActionTypes from "../../FirebirdContext/ActionTypes";
import FirebirdContext from "../../FirebirdContext/FirebirdContext";
import Contacts from "./Contacts/Contacts";
import MessengerMain from "./MessengerMain/MessengerMain";
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
      <div className="hide-on-med-and-up">
        <div id="slide-out" className="sidenav">
          <div className={styles.header + " row"}>
            <div className="col s12">
              <h2>firebird</h2>
            </div>
          </div>
          <Contacts />
        </div>
      </div>
      <div className={styles.messengerContainer + " row"}>
        <div className={styles.cborder + " col l4 m6 hide-on-small-only"}>
          <div className={styles.header + " row"}>
            <div className="col s12">
              <h2>firebird</h2>
            </div>
          </div>
          <Contacts />
        </div>
        <div className="col l8 m6 s12">
          <div className={styles.sidenavIcon + " row hide-on-med-and-up"}>
            <a
              href="#react"
              data-target="slide-out"
              className="sidenav-trigger"
            >
              <i className="material-icons">menu</i>
            </a>
          </div>
          <MessengerMain />
        </div>
      </div>
    </div>
  );
};

export default Messenger;
