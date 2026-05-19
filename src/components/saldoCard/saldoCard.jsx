import styles from '../saldoCard/saldoCard.module.css'
import { MdArrowDropDown, MdRefresh } from "react-icons/md";
import { useState } from 'react';
import { useMovimentos } from '../../hooks/useMovimentos';

const meses = [
    { label: 'Janeiro', value: 1 },
    { label: 'Fevereiro', value: 2 },
    { label: 'Março', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Maio', value: 5 },
    { label: 'Junho', value: 6 },
    { label: 'Julho', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Setembro', value: 9 },
    { label: 'Outubro', value: 10 },
    { label: 'Novembro', value: 11 },
    { label: 'Dezembro', value: 12 },
]

function SaldoCard({ mesAtivo, anoAtual, setMesAtivo, refresh, onRefetch }) {

    const [dropdownAberto, setDropdownAberto] = useState(false)

    const { entradas, despesas, saldo, loading } = useMovimentos(mesAtivo, anoAtual, refresh)

    const mesLabel = meses.find(m => m.value === mesAtivo)?.label

    return (
        <>
            <div className={styles.content}>
                <div className={styles.grids}>
                    <div className={styles.grid1}>
                        <div className={styles.saldo}>
                            <h1 className={styles.titulo}>Saldo actual</h1>
                                <p className={saldo >= 0 ? styles.positivo : styles.negativo}>
                                    {loading ? '...' : `€${saldo.toFixed(2)}`}
                                </p>
                            <span
                                className={styles.span}
                                onClick={() => setDropdownAberto(!dropdownAberto)}
                                style={{ cursor: 'pointer', position: 'relative' }}>
                                {mesLabel} <MdArrowDropDown size={22} />

                                {dropdownAberto && (
                                    <div className={styles.dropdown}>
                                        {meses.map(m => (
                                            <div
                                                key={m.value}
                                                className={styles.dropdownItem}
                                                onClick={() => {
                                                    setMesAtivo(m.value)
                                                    setDropdownAberto(false)
                                                }}
                                            >
                                                {m.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </span>
                        </div>
                        <div className={styles.refreshCont}>
                            <MdRefresh 
                                size={50} 
                                className={styles.refresh}
                                onClick={onRefetch}
                                tabIndex={-1}
                            />
                        </div>
                    </div>
                    <div className={styles.grid2}>
                        <div className={styles.grid2_1}>
                            <h1 className={styles.titulo}>Entradas</h1>
                            <p className={styles.positivo}>
                                {loading ? '...' : `€${entradas.toFixed(2)}`}
                            </p>
                        </div>
                        <div className={styles.grid2_2}>
                            <h1 className={styles.titulo}>Despesas</h1>
                            <p className={styles.negativo}>
                                {loading ? '...' : `€${despesas.toFixed(2)}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SaldoCard