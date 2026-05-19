import styles from './movimentos.module.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMovimentos } from '../../hooks/useMovimentos'
import { MdArrowDropDown } from "react-icons/md"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { IoEllipsisHorizontal } from 'react-icons/io5'
import supermarket from '../../images/Basket.png'
import transporte from '../../images/school-bus.png'
import restuarante from '../../images/restuarante.png'
import home from '../../images/home.png'
import ellepsis from '../../images/ellipsis.png'
import salario from '../../images/money-bag.png'
import educacao from '../../images/education.png'
import roupas from '../../images/clouthing.png'
import services from '../../images/services.png'
import desporto from '../../images/desporto.png'
import hobbies from '../../images/hobbies.png'
import online from '../../images/shopping.png'
import compras from '../../images/shopping_1.png'

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

const CORES = {
    'Supermercado': '#d21144',
    'Restaurantes': '#e74c3c',
    'Transporte':   '#9b59b6',
    'Casa':         '#3498db',
    'Salário':      '#27ae60',
    'Educação':     '#2980b9',
    'Vestuário':    '#8e44ad',
    'Serviços':     '#f39c12',
    'Desporto':     '#c0392b',
    'Hobbies':      '#34495e',
    'Compras':      '#d35400',
    'Compras Online': '#a08b16',
    'Outros':       '#95a5a6',
}

const iconesPorCategoria = {
    'Supermercado':         <img src={supermarket} className={styles.icone} />,
    'Restaurantes':         <img src={restuarante} className={styles.icone} />,
    'Transporte':           <img src={transporte} className={styles.icone} />,
    'Casa':                 <img src={home} className={styles.icone} />,
    'Salário':              <img src={salario} className={styles.icone} />,
    'Educação':             <img src={educacao} className={styles.icone} />,
    'Vestuário':            <img src={roupas} className={styles.icone} />,
    'Serviços':             <img src={services} className={styles.icone} />,
    'Outros':               <img src={ellepsis} className={styles.icone} />,
    'Desporto':             <img src={desporto} className={styles.icone} />,
    'Hobbies':              <img src={hobbies} className={styles.icone} />,
    'Compras Online':       <img src={online} className={styles.icone} />,
    'Compras':              <img src={compras} className={styles.icone} />,

}

function MovimentosPage() {

    const anoAtual = new Date().getFullYear()
    const mesAtual = new Date().getMonth() + 1

    const [mesAtivo, setMesAtivo] = useState(mesAtual)
    const [dropdownAberto, setDropdownAberto] = useState(false)

    const { movimentos, entradas, despesas, loading } = useMovimentos(mesAtivo, anoAtual)

    const mesLabel = meses.find(m => m.value === mesAtivo)?.label

    // Dados para o gráfico
    const gastosPorCategoria = movimentos
        .filter(m => m.tipo === 'despesa')
        .reduce((acc, m) => {
            acc[m.categoria] = (acc[m.categoria] || 0) + Number(m.valor)
            return acc
        }, {})

    const totalDespesas = Object.values(gastosPorCategoria).reduce((a, b) => a + b, 0)

    const dadosGrafico = Object.entries(gastosPorCategoria).map(([categoria, valor]) => ({
        categoria,
        valor,
        percentagem: Math.round((valor / totalDespesas) * 100)
    }))

    const navigate = useNavigate()

    return (
        <div className={styles.content}>
            
            <button className={styles.btnVoltar} onClick={() => navigate(-1)}>
                ← Voltar
            </button>

            {/* HEADER */}
            <div className={styles.header}>
                <span
                    className={styles.mesSeletor}
                    onClick={() => setDropdownAberto(!dropdownAberto)}
                >
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

                <div className={styles.totais}>
                    <div>
                        <p className={styles.totaisLabel}>Total entradas</p>
                        <p className={styles.positivo}>€{entradas.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className={styles.totaisLabel}>Total despesas</p>
                        <p className={styles.negativo}>-€{despesas.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* CARD MOVIMENTOS */}
            <div className={styles.cardMovimentos}>
                <h1 className={styles.titulo}>Total de movimentos</h1>

                {loading && <p>A carregar...</p>}

                {movimentos.map(movimento => (
                    <div key={movimento.id} className={styles.cardMovimento}>
                        <div className={styles.icone_categ}>
                            <div className={styles.containerIcone}>
                                {iconesPorCategoria[movimento.categoria] ||
                                    <IoEllipsisHorizontal size={25} />}
                            </div>
                            <h1 className={styles.subTitulo}>{movimento.descricao}</h1>
                        </div>
                        <h1 className={movimento.tipo === 'entrada' ? styles.positivo : styles.negativo}>
                            {movimento.tipo === 'entrada' ? '+' : '-'}€{Number(movimento.valor).toFixed(2)}
                        </h1>
                    </div>
                ))}
            </div>

            {/* CARD GASTOS POR CATEGORIA */}
            <div className={styles.card}>
                <h1 className={styles.titulo}>Gastos por categoria</h1>

                {!loading && dadosGrafico.length > 0 && (
                    <div className={styles.graficoCont}>
                        <ResponsiveContainer width="45%" height={130}>
                            <PieChart>
                                <Pie
                                    data={dadosGrafico}
                                    dataKey="valor"
                                    cx="45%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={60}
                                >
                                    {dadosGrafico.map((entry) => (
                                        <Cell
                                            key={entry.categoria}
                                            fill={CORES[entry.categoria] || '#95a5a6'}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className={styles.legenda}>
                            {dadosGrafico.map(item => (
                                <div key={item.categoria} className={styles.legendaItem}>
                                    <span className={styles.legendaCor} style={{ backgroundColor: CORES[item.categoria] || '#95a5a6' }} />
                                    <span className={styles.legendaNome}>{item.categoria}</span>
                                    <span className={styles.legendaValor}>€{item.valor.toFixed(2)}</span>
                                    <span className={styles.legendaPerc}>{item.percentagem}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default MovimentosPage