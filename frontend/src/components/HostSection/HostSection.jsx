import * as Icons from '../icons';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import styles from './HostSection.module.css';

export function HostSection({ host }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Meet your host</h2>
      <div className={styles.layout}>
        <div>
          <div className={styles.card}>
            <div className={styles.identity}>
              <div className={styles.avatarWrap}>
                <img src={host.avatar} alt="" />
                <span className={styles.verified}>
                  <Icons.CheckCircle />
                </span>
              </div>
              <div className={styles.name}>{host.name}</div>
              <div className={styles.role}>{host.role}</div>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{host.totalReviews}</div>
                <div className={styles.statLabel}>Reviews</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{host.rating}★</div>
                <div className={styles.statLabel}>Rating</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{host.yearsHosting}</div>
                <div className={styles.statLabel}>Years hosting</div>
              </div>
            </div>
          </div>
          <div className={styles.facts}>
            {host.facts.map((fact) => {
              const Icon = Icons[fact.icon];
              return (
                <div className={styles.fact} key={fact.text}>
                  <span className={styles.factIcon}>{Icon && <Icon />}</span>
                  {fact.text}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className={styles.subheading}>Co-Hosts</div>
          <div className={styles.coHosts}>
            {host.coHosts.map((person) => (
              <div className={styles.coHost} key={person.name}>
                <Avatar
                  src={person.avatar}
                  initial={person.initial}
                  bg={person.bg}
                  fg={person.fg}
                  name={person.name}
                  size={34}
                  fontSize={13}
                />
                <span>{person.name}</span>
              </div>
            ))}
          </div>
          <div className={styles.subheading}>Host details</div>
          <div className={styles.details}>
            {host.details.map((line, i) => (
              <span key={line}>
                {line}
                {i < host.details.length - 1 && <br />}
              </span>
            ))}
          </div>
          <Button variant="soft" className={styles.message}>
            Message host
          </Button>
          <div className={styles.protect}>
            <span className={styles.protectIcon}>
              <Icons.Shield />
            </span>
            <span>{host.paymentNotice}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
