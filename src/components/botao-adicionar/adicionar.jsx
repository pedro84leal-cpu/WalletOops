import styles from '../botao-adicionar/adicionar.module.css'
import { GoPlusCircle } from "react-icons/go";
import { useState } from 'react';
import Modal from '../modal/modal.jsx'
import NovoMovimento from '../novoMovimento/form.jsx';

function Adicionar({ onRefetch }){
    
    console.log('onRefetch:', onRefetch)

    const [formAberto, setformAberto] = useState(false);
    const abrirForm = () => {
        setformAberto(true);    
    }   


    return(
        <>
        <div className={styles.content}>
            <div className={styles.moduleCamara}>
                <GoPlusCircle className={styles.icone} onClick={abrirForm} />
            </div>
        </div>
        {formAberto && (
            <Modal onClose={() => setformAberto(false)}>
                <NovoMovimento buscarDados={onRefetch} />   
            </Modal>            
        )}
        </>
    )
}

export default Adicionar