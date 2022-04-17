
import styles from './Container.module.css'
export default function Container(props){
    return (
        <main className={styles.container}>
            {props.children}
        </main>
    )
}