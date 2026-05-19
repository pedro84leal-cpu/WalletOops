import styles from './grupo.module.css'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabase/client'

function Grupo() {

    const [email, setEmail] = useState('')
    const [sucesso, setSucesso] = useState(false)
    const [erro, setErro] = useState('')
    const [membros, setMembros] = useState([])

    useEffect(() => {
        async function buscarMembros() {
            const { data: { user } } = await supabase.auth.getUser()

            const { data: grupoDados } = await supabase
                .from('grupo_membros')
                .select('grupo_id')
                .eq('user_id', user.id)
                .single()

            if (grupoDados) {
                const { data } = await supabase
                    .from('grupo_membros')
                    .select('user_id')
                    .eq('grupo_id', grupoDados.grupo_id)

                setMembros(data || [])
            }
        }

        buscarMembros()
    }, [])

    const convidar = async () => {
        setErro('')
        const { data: { user } } = await supabase.auth.getUser()

        // Busca o grupo do utilizador
        const { data: grupoDados } = await supabase
            .from('grupo_membros')
            .select('grupo_id')
            .eq('user_id', user.id)
            .single()

        if (!grupoDados) {
            setErro('Não foi possível encontrar o teu grupo.')
            return
        }

        // Cria o convite
        const { error } = await supabase
            .from('convites')
            .insert([{
                grupo_id: grupoDados.grupo_id,
                email: email
            }])

        if (error) {
            setErro('Erro ao enviar convite.')
        } else {
            setSucesso(true)
            setEmail('')
            setTimeout(() => setSucesso(false), 3000)
        }
    }

    return (
        <div className={styles.card}>
            <h2 className={styles.titulo}>
                Adicionar elementos ao grupo
            </h2>

            <p className={styles.sub}>
                Membros do grupo: {membros.length}</p>

            <div className={styles.formGroup}>
                <input
                    type="email"
                    placeholder="Email do convidado"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            {erro && <p className={styles.erro}>❌ {erro}</p>}

            <button className={styles.btn} onClick={convidar}>
                Convidar
            </button>

            {sucesso && (
                <div className={styles.sucesso}>
                    ✅ Convite enviado!
                </div>
            )}
        </div>
    )
}

export default Grupo