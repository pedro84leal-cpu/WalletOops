import styles from '../Login/login.module.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import logo from '../../images/logo.png'
import Modal from '../../components/modal/modal';
import Registo from '../../components/registo/registo';

function Login(){

    const [registoAberto, setRegistoAberto] = useState(false);

    const abrirRegisto = () => {
        setRegistoAberto(true);
    }

    const [erro, setErro] = useState('');
    const navigate = useNavigate();
    const [email, setemail] = useState('');
    const [passWord, setpassword] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const enviar = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: passWord,
    });

    if (error) {
        setErro('Email ou password incorretos.');
    } else {
        // Verifica se há convites para este email
        const { data: convites } = await supabase
            .from('convites')
            .select('*')
            .eq('email', email)
            .eq('aceite', false)

        if (convites && convites.length > 0) {
            // Aceita o primeiro convite
            const convite = convites[0]

            // Adiciona o utilizador ao grupo
            await supabase
                .from('grupo_membros')
                .insert([{
                    grupo_id: convite.grupo_id,
                    user_id: data.user.id
                }])

            // Marca o convite como aceite
            await supabase
                .from('convites')
                .update({ aceite: true })
                .eq('id', convite.id)
        }

        setSucesso(true);
        navigate('/home');
    }
};

    return(
       <>
        <div className={styles.container}>
        <div className={`${styles.content} ${pageLoaded ? styles.fadeIn : ''}`}>
            <div className={styles.logoContent}>
                <img src={logo} alt='Logo' className={styles.logo} />
            </div>


            <input type="text" 
                    placeholder="Email" 
                    className={styles.input}
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
            />

            <input type="password" 
                    placeholder="Password" 
                    className={styles.input}
                    value={passWord}
                    onChange={(e) => setpassword(e.target.value)}
            />


            {erro && <p className={styles.erro}>❌ {erro}</p>}

            <button className={styles.btn} onClick={enviar}>
                Entrar
            </button>

            <button className={styles.btn_1} onClick={abrirRegisto}>
                Novo registo
            </button>

            {sucesso && (
                <div className={styles.sucesso}>
                    Login efetuado!
                </div>
            )}
        </div>
        </div>
        {registoAberto && (
            <Modal onClose={() => setRegistoAberto(false)}>
                <Registo />
            </Modal>
        )}
    </>
    )
}

export default Login