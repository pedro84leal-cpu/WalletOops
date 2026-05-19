import styles from '../gastosCard/gastos.module.css'
import { useMovimentos } from '../../hooks/useMovimentos'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

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

function Gastos({ mesAtivo, anoAtual, refresh }) {

    const { movimentos, loading } = useMovimentos(mesAtivo, anoAtual, refresh)

    // Agrupa despesas por categoria
    const gastosPorCategoria = movimentos
        .filter(m => m.tipo === 'despesa')
        .reduce((acc, m) => {
            const cat = m.categoria
            acc[cat] = (acc[cat] || 0) + Number(m.valor)
            return acc
        }, {})

    const totalDespesas = Object.values(gastosPorCategoria).reduce((a, b) => a + b, 0)

    const dadosGrafico = Object.entries(gastosPorCategoria).map(([categoria, valor]) => ({
        categoria,
        valor,
        percentagem: Math.round((valor / totalDespesas) * 100)
    }))

    return (
        <>
            <div className={styles.content}>
                <div className={styles.container}>
                    <h1 className={styles.titulo}>Gastos por categoria</h1>

                    {loading && <p>A carregar...</p>}

                    {!loading && dadosGrafico.length === 0 && (
                        <p className={styles.semDados}>Sem despesas este mês</p>
                    )}

                    {!loading && dadosGrafico.length > 0 && (
                        <div className={styles.graficoCont}>
                            <ResponsiveContainer width="45%" height={160}>
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
                                        <span
                                            className={styles.legendaCor}
                                            style={{ backgroundColor: CORES[item.categoria] || '#95a5a6' }}
                                        />
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
        </>
    )
}

export default Gastos