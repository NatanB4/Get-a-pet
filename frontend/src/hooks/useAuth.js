// api

import api from '../utils/api'
import useFlashMessage from './useFlashMessage'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';


// const [state, setstate] = useState();

export default function useAuth(){
    const [authenticated, setAuthenticated] = useState(false)
    const {setFlashMessage} = useFlashMessage()
   
    const navigate = useNavigate();
    
    useEffect(() => {

        const token = localStorage.getItem('token')

        if(token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }

    }, [])
    
    async function register(user){
    let msgText = 'Cadastro realizado com sucesso!'
    let msgType = 'success'
    
        try {
            const data = await api.post('/users/register', user).then((response) => {
                return response.data
            })

            await authUser(data)
        }catch(err){
            console.log(err)
             msgText = err.response.data.message
             msgType = 'error'
        }

        setFlashMessage(msgText, msgType)
    }


    async function authUser(data) {

        setAuthenticated(true)

        localStorage.setItem('token', JSON.stringify(data.token))
        navigate('/')

    }


    return { register, authenticated }
}
