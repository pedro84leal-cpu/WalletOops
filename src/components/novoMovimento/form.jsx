import styles from './form.module.css'
import { useState } from 'react'
import { supabase } from '../../supabase/client';

function NovoMovimento({ buscarDados }){

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoria, setcategoria] = useState('');
  const [data, setData] = useState('');
  const [sucesso, setSucesso] = useState(false);

 const enviar = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const valorConvertido = parseFloat(valor.replace(',', '.'))

    const { data: grupoDados } = await supabase
      .from('grupo_membros')
      .select('grupo_id')
      .eq('user_id', user.id)
      .maybeSingle()  // retorna null em vez de erro

    const { error } = await supabase
      .from('movimentos')
      .insert([{
          descricao,
          valor: valorConvertido,
          tipo,
          categoria,
          data,
          user_id: user.id,
          grupo_id: grupoDados?.grupo_id || null  // null se não tiver grupo
      }])

    if (error) {
        console.error('Erro ao guardar movimento:', error)
    } else {
        setSucesso(true)
        setTimeout(() => {
            buscarDados()
        }, 500)
        setTimeout(() => setSucesso(false), 3000)
        setDescricao('')
        setValor('')
        setTipo('')
        setcategoria('')
        setData('')
    }
}


  return (
    <div className={styles.card}>
      <h2 className={styles.titulo}>Novo movimento</h2>

      <div className={styles.formGroup}>
        <input 
          type="text" 
          placeholder="Descrição" 
          className={styles.input}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <textarea 
          placeholder="Valor (€)" 
          className={styles.textarea}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </div>

      <div className={styles.campo}>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={styles.option}
        >
          <option value="">Selecione o tipo...</option>
          <option value="entrada">Entrada</option>
          <option value="despesa">Despesa</option>
        </select>
      </div>

      <div className={styles.campo}>
        <select
          value={categoria}
          onChange={(e) => setcategoria(e.target.value)}
          className={styles.option}
        >
          <option value="">Selecionar categoria...</option>
          <option value="Supermercado">Supermercado</option>
          <option value="Restaurantes">Restaurantes</option>
          <option value="Transporte">Transporte</option>
          <option value="Casa">Casa</option>
          <option value="Salário">Salário</option>
          <option value="Educação">Educação</option>
          <option value="Vestuário">Vestuário</option>
          <option value="Serviços">Serviços</option>
          <option value="Desporto">Desporto</option>
          <option value="Hobbies">Hobbies</option>
          <option value="Compras">Compras</option>
          <option value="Compras Online">Compras Online</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <div className={styles.campoData}>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>
      <button className={styles.btn} onClick={enviar}>
        Guardar movimento
      </button>

      {sucesso && (
        <div className={styles.sucesso}>
          Movimento guardado com sucesso!
        </div>
      )}
    </div>
  )
}

export default NovoMovimento