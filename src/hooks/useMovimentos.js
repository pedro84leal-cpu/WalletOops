import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export function useMovimentos(mes, ano, refresh = 0) {
    const [movimentos, setMovimentos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    async function buscarDados() {
        const mesFormatado = String(mes).padStart(2, '0')
        const { data: { user } } = await supabase.auth.getUser()

        const { data: grupoDados } = await supabase
            .from('grupo_membros')
            .select('grupo_id')
            .eq('user_id', user.id)
            .maybeSingle()

        let query = supabase
            .from('movimentos')
            .select('*')
            .gte('data', `${ano}-${mesFormatado}-01`)
            .lte('data', `${ano}-${mesFormatado}-31`)
            .order('created_at', { ascending: false })

        // Se tiver grupo filtra por grupo, senão filtra por user
        if (grupoDados) {
            query = query.eq('grupo_id', grupoDados.grupo_id)
        } else {
            query = query.eq('user_id', user.id)
        }

        const { data, error } = await query

        if (error) {
            console.error(error)
        } else {
            setMovimentos(data)
        }
        setLoading(false)
    }

    buscarDados()
}, [mes, ano, refresh])

    const entradas = movimentos
        .filter(m => m.tipo === 'entrada')
        .reduce((acc, m) => acc + Number(m.valor), 0)

    const despesas = movimentos
        .filter(m => m.tipo === 'despesa')
        .reduce((acc, m) => acc + Number(m.valor), 0)

    const saldo = entradas - despesas

    return { movimentos, entradas, despesas, saldo, loading }
}