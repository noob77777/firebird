import styles from "./Notifier.module.scss";
import { useState } from "react";
import Modal from "react-modal";

const modal = { open: () => {}, set: (text: string) => {} };

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const Notifier = (): JSX.Element => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  function openModal() {
    setIsOpen(true);
  }

  modal.open = openModal;
  modal.set = setText;

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="firebird: notification"
    >
      <div className={styles.Notifier}>
        <div className="modal-content">
          <h3>{"Something went wrong :("}</h3>
          <h6>{text}</h6>
        </div>
      </div>
    </Modal>
  );
};

export const modalNotify = (text: string): void => {
  modal.set(text);
  modal.open();
};

export default Notifier;
