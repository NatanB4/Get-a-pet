import {createContext} from 'react'

import useAuth from '../hooks/useAuth'

const Context = createContext()

function UserProvider({children}) {

    const {register, authenticated} = useAuth()

    return (
        <Context.Provider value={{authenticated, register}}>
            {children}
        </Context.Provider>
    )
}

export {Context, UserProvider} 