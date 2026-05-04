import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <a href="#" className={`${styles.navItem} ${styles.active}`}>
          Treninzi
        </a>
        <a href="#" className={styles.navItem}>
          Članstva
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;