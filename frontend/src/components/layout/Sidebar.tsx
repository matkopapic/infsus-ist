import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink
          to="/trainings"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Treninzi
        </NavLink>
        <NavLink
          to="/memberships"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Članstva
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;