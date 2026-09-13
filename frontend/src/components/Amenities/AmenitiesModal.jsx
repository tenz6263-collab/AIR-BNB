import { Modal } from '../ui/Modal';
import { AmenityRow } from './Amenities';
import styles from './AmenitiesModal.module.css';

/** Centered dialog listing every amenity grouped by category. */
export function AmenitiesModal({ open, groups, onClose }) {
  return (
    <Modal open={open} onClose={onClose} label="What this place offers">
      <h2 className={styles.title}>What this place offers</h2>
      {groups.map((group) => (
        <div className={styles.group} key={group.title}>
          <h3>{group.title}</h3>
          {group.items.map((item) => (
            <AmenityRow key={group.title + item.label} item={item} className={styles.item} />
          ))}
        </div>
      ))}
    </Modal>
  );
}
