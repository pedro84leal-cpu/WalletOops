import Menu from '../../components/menu/menu'
import styles from '../home/home.module.css'
import logo from '../../images/logo.png'
import SaldoCard from '../../components/saldoCard/saldoCard'
import Movimentos from '../../components/movimentosCard/movimentos'
import Gastos from '../../components/gastosCard/gastos'
import { useState } from 'react'


function Home() {

    const anoAtual = new Date().getFullYear()
    const mesAtual = new Date().getMonth() + 1

    const [mesAtivo, setMesAtivo] = useState(mesAtual)

    const [refresh, setRefresh] = useState(0)
    const refetch = () => {
        console.log('refetch chamado!')
        setRefresh(r => r + 1)
    }   

    console.log('refetch:', refetch)
   

    return (
        <>
            
            <Menu onRefetch={refetch} />
            <div className={styles.content}>
                <div className={styles.header}>
                    <img src={logo} alt='Logo' className={styles.logo} />
                    
                </div>
                <div className={styles.cards}>
                    <SaldoCard mesAtivo={mesAtivo} anoAtual={anoAtual} setMesAtivo={setMesAtivo} refresh={refresh} onRefetch={refetch} />
                    <Movimentos mesAtivo={mesAtivo} anoAtual={anoAtual} refresh={refresh} onRefetch={refetch} />
                    <Gastos mesAtivo={mesAtivo} anoAtual={anoAtual} refresh={refresh} />
                </div>
            </div>
        </>
    )
}

export default Home