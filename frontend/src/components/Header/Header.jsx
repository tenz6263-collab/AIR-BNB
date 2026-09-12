import { AirbnbLogo, Globe, Menu } from '../icons';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header} id="siteHeader">
      <div className={styles.inner}>
        <a className={styles.logo} href="/" aria-label="Airbnb homepage">
          <span className={styles.logoMark}>
            <AirbnbLogo />
          </span>
        </a>

        <div className={styles.search} role="search">
          <button className={styles.searchItem} type="button">
            <img className={styles.searchHouse} src="/assets/images/ui/searchbar-house.png" alt="" aria-hidden="true" />
            Anywhere
          </button>
          <span className={styles.divider} />
          <button className={styles.searchItem} type="button">
            Anytime
          </button>
          <span className={styles.divider} />
          <button className={`${styles.searchItem} ${styles.searchPlaceholder}`} type="button">
            Add guests
          </button>
          <button className={styles.searchGo} type="button" aria-label="Search" />
        </div>

        <nav className={styles.nav}>
          <a className={styles.host} href="#">
            Become a host
          </a>
          <button className={styles.round} type="button" aria-label="Choose a language and currency">
            <span>
              <Globe />
            </span>
          </button>
          <button className={styles.round} type="button" aria-label="Main navigation menu">
            <span>
              <Menu />
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
