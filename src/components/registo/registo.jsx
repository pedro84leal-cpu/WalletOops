import styles from './registo.module.css'
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

function Registo() {

    const [email, setEmail] = useState('');
    const [passWord, setPassWord] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);


    const enviar = async () => {
    setErro('');

    if (passWord !== confirmar) {
        setErro('As passwords não coincidem.');
        return;
    }

    if (passWord.length < 6) {
        setErro('A password deve ter pelo menos 6 caracteres.');
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: passWord,
    });

    if (error) {
        setErro('Erro ao criar conta. Tenta novamente.');
    } else {
        // Cria um grupo para o novo utilizador
        const { data: grupo, error: grupoError } = await supabase
            .from('grupos')
            .insert([{
                nome: `Grupo de ${email}`,
                criado_por: data.user.id
            }])
            .select()
            .single()

        if (!grupoError) {
            // Adiciona o utilizador ao grupo
            await supabase
                .from('grupo_membros')
                .insert([{
                    grupo_id: grupo.id,
                    user_id: data.user.id
                }])
        }

        setSucesso(true);
    }
};

    return (
        <>
        <div className={`${styles.content} ${pageLoaded ? styles.fadeIn : ''}`}>
            <h2 className={styles.titulo}>Registo</h2>
            <input
                type="text"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                className={styles.input}
                value={passWord}
                onChange={(e) => setPassWord(e.target.value)}
            />

            <input
                type="password"
                placeholder="Confirmar password"
                className={styles.input}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
            />

            {erro && <p className={styles.erro}>❌ {erro}</p>}

            <button className={styles.btn} onClick={enviar}>
                Registar
            </button>

            {sucesso && (
                <div className={styles.sucesso}>
                    ✅ Conta criada! Verifica o teu email.
                </div>
            )}
        </div>
        </>

    );
}

export default Registo;
