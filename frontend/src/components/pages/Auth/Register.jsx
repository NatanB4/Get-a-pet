import Input from '../../form/Input'
import {Link} from 'react-router-dom'

import styles from '../../../components/form/Form.module.css'
import { useState, useContext } from 'react'

import {Context} from '../../../context/UserContext'
export default function Register(){
    const [user, setUser] = useState({})
    const { register } = useContext(Context)


    function handleOnChange(e){
        setUser({ ...user, [e.target.name]: e.target.value})

    }

    function handleSubmit(e){
        e.preventDefault()

        register(user)
    }

    return (
        <section className={styles.form_container}>
            <h1>Registrar</h1>
            <form onSubmit={handleSubmit}>
                <Input text="Nome" type="text" name="name" placeholder="Digite o seu nome" handleOnChange={handleOnChange}/>
                <Input text="Telefone" type="text" name="phone" placeholder="Digite o seu Telefone" handleOnChange={handleOnChange}/>
                <Input text="E-mail" type="email" name="email" placeholder="Digite o seu e-mail" handleOnChange={handleOnChange}/>
                <Input text="Password" type="password" name="password" placeholder="Digite o sua Senha" handleOnChange={handleOnChange}/>
                <Input text="Confirme sua senha" type="password" name="confirmpassword" placeholder="Confirme sua senha" handleOnChange={handleOnChange}/>
                <input type="submit" value="cadastrar" />
            </form>
            <p>
                Já tem conta? <Link to="/login">login</Link>
            </p>
        </section>
    )
}