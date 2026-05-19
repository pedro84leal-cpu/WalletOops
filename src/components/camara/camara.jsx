import styles from '../camara/camara.module.css'
import { FiCamera } from "react-icons/fi"
import { useRef, useState } from 'react'
import Tesseract from 'tesseract.js'

function Camara({ onValorDetectado }) {

    const inputRef = useRef(null)
    const [loading, setLoading] = useState(false)

    function abrirCamera() {
        inputRef.current.click()
    }

    async function processarImagem(e) {
        const file = e.target.files[0]
        if (!file) return

        setLoading(true)

        const { data: { text } } = await Tesseract.recognize(file, 'por', {
            logger: m => console.log(m)
        })

        const valor = extrairValor(text)

        if (valor) {
            onValorDetectado(valor)
        } else {
            alert('Não foi possível detetar o valor no talão.')
        }

        setLoading(false)
    }

    function extrairValor(text) {
        // Procura padrões como "TOTAL 12,50" ou "12.50"
        const padroes = [
            /total[:\s]+(\d+[.,]\d{2})/i,
            /a pagar[:\s]+(\d+[.,]\d{2})/i,
            /(\d+[.,]\d{2})\s*€/i,
            /€\s*(\d+[.,]\d{2})/i,
        ]

        for (const padrao of padroes) {
            const match = text.match(padrao)
            if (match) {
                return parseFloat(match[1].replace(',', '.'))
            }
        }
        return null
    }

    return (
        <>
            <div className={styles.content} onClick={abrirCamera}>
                <div className={styles.moduleCamara}>
                    {loading
                        ? <span className={styles.icone}>...</span>
                        : <FiCamera className={styles.icone} />
                    }
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={processarImagem}
                    style={{ display: 'none' }}
                />
            </div>
        </>
    )
}

export default Camara