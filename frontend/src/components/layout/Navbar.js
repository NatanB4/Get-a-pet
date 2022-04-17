import {Link} from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar(){
    return (
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <Link to="/">Adota</Link>
                </li>
                <li>
                    <Link to="/login">Entrar</Link>
                </li>
                <li>
                    <Link to="/register">Cadastrar</Link>
                </li>
            </ul>
        </nav>
        )
}