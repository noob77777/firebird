import styles from "./Modal.module.scss";

const Modal = (): JSX.Element => {
  return (
    <div id="modal1" className={styles.Modal + " modal"}>
      <div className="modal-content">
        <h4>{"Something went wrong! :("}</h4>
        <h6 id="text-inject">A bunch of text</h6>
      </div>
      <div className="modal-footer">
        <a href="#react" className="modal-close btn-flat">
          Close
        </a>
      </div>
    </div>
  );
};

export const modalNotify = (text: string): void => {
  const elem = document.getElementById("modal1");
  const p = document.getElementById("text-inject");
  if (p) {
    p.innerText = text;
  }
  if (elem) {
    const instance = M.Modal.getInstance(elem);
    instance.open();
  }
};

export default Modal;
