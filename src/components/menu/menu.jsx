import styles from "./menu.module.css"
import { NavLink } from 'react-router-dom'
import Adicionar from '../botao-adicionar/adicionar';
import Modal from '../modal/modal.jsx'
import Grupo from '../grupo/grupo.jsx'
import { useState } from 'react';
import list from '../../images/list.png'
import group from '../../images/group.png'



function Menu({ onRefetch }){

   const [grupoAberto, setGrupoAberto] = useState(false)

    return(
    <>
    <div className={styles.container}>
        <nav className={styles.nav}>
            <NavLink to='/movimentos' className={({ isActive }) => isActive ? styles.linkAtivo : styles.link}>
               <img src={list} alt="Movimentos" className={styles.icone} />
               <span className={styles.span} >
                    Movimentos
               </span>
            </NavLink>

            <Adicionar onRefetch={onRefetch} />

            <div className={styles.link} onClick={() => setGrupoAberto(true)}>
                    <img src={group} alt="Grupo" className={styles.icone} />
                <span className={styles.span}>Grupo</span>
            </div>
        </nav>
    </div>
      {grupoAberto && (
                <Modal onClose={() => setGrupoAberto(false)}>
                    <Grupo />
                </Modal>
            )}
    </>

    )
}

export default Menu