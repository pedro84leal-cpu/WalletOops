import styles from '../movimentosCard/movimentos.module.css'
import { IoEllipsisHorizontal } from 'react-icons/io5'
import { useMovimentos } from '../../hooks/useMovimentos'
import { supabase } from '../../supabase/client'
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
import trash from '../../images/trash.png'

const iconesPorCategoria = {
    'Supermercado':   <img src={supermarket} className={styles.icone} />,
    'Restaurantes':   <img src={restuarante} className={styles.icone} />,
    'Transporte':     <img src={transporte} className={styles.icone} />,
    'Casa':           <img src={home} className={styles.icone} />,
    'Salário':        <img src={salario} className={styles.icone} />,
    'Educação':       <img src={educacao} className={styles.icone} />,
    'Vestuário':      <img src={roupas} className={styles.icone} />,
    'Serviços':       <img src={services} className={styles.icone} />,
    'Outros':         <img src={ellepsis} className={styles.icone} />,
    'Desporto':       <img src={desporto} className={styles.icone} />,
    'Hobbies':        <img src={hobbies} className={styles.icone} />,
    'Compras Online': <img src={online} className={styles.icone} />,
    'Compras':        <img src={compras} className={styles.icone} />,
}

function Movimentos({ mesAtivo, anoAtual, refresh, onRefetch }) {

    const { movimentos, loading } = useMovimentos(mesAtivo, anoAtual, refresh)

    const eliminar = async (id) => {
        const { error } = await supabase
            .from('movimentos')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao eliminar:', error)
        } else {
            onRefetch()
        }
    }

    return (
        <>
            <div className={styles.content}>
                <div className={styles.container}>
                    <h1 className={styles.titulo}>Movimentos recentes</h1>

                    {loading && <p>A carregar...</p>}

                    {movimentos.slice(0, 4).map(movimento => (
                        <div key={movimento.id} className={styles.cardsMovimentos}>
                            <div className={styles.icone_categ}>
                                <div className={styles.containerIcone}>
                                    {iconesPorCategoria[movimento.categoria] ||
                                        <IoEllipsisHorizontal size={20} />}
                                </div>
                                <h1 className={styles.subTitulo}>
                                    {movimento.descricao}
                                </h1>
                            </div>
                            <div className={styles.valor}>
                                <h1 className={movimento.tipo === 'entrada' ? styles.positivo : styles.negativo}>
                                    {movimento.tipo === 'entrada' ? '+' : '-'}€{Number(movimento.valor).toFixed(2)}
                                </h1>
                                <img src={trash} alt="Eliminar"
                                    className={styles.delete}
                                    onClick={() => eliminar(movimento.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Movimentos