import styles from './modal.module.css'
import close from '../../images/close.png'

function Modal({ children, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.fechar} onClick={onClose}>
          <img src={close} alt="Fechar" className={styles.closeIcon} />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal