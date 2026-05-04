import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>IST</span>
        <span className={styles.title}>Informacijski sustav teretane</span>
      </div>
    </header>
  );
}

export default Header;