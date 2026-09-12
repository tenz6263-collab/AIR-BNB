import { useEffect, useMemo, useRef } from 'react';
import { Back, Heart, Share } from '../icons';
import { IconButton } from '../ui/IconButton';
import { useBodyLock } from '../../hooks/useBodyLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './PhotoTour.module.css';

/**
 * Splits a room's photos into rows: a full-width photo followed by a pair,
 * repeating, but never leaving a lone photo when exactly two remain.
 */
export function chunkPhotos(count) {
  const rows = [];
  let remaining = count;
  let single = true;
  while (remaining > 0) {
    let size = remaining === 2 ? 2 : single ? 1 : 2;
    size = Math.min(size, remaining);
    rows.push(size);
    remaining -= size;
    single = !single;
  }
  return rows;
}

/**
 * Full-screen scrollable photo tour. `scrollTarget` is a room index (or the
 * src of a photo) the body should scroll to right after opening.
 */
export function PhotoTour({
  open,
  rooms,
  photos,
  title,
  saved,
  scrollTarget,
  onClose,
  onOpenPhoto,
  onShare,
  onSave,
  lightboxOpen,
}) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const backRef = useRef(null);
  const thumbRefs = useRef([]);

  useBodyLock(open);
  useFocusTrap(panelRef, open && !lightboxOpen, { initialFocus: () => backRef.current });

  // Global index of each room's first photo, used for lightbox deep links.
  const roomOffsets = useMemo(() => {
    let acc = 0;
    return rooms.map((room) => {
      const start = acc;
      acc += room.photos.length;
      return start;
    });
  }, [rooms]);

  const scrollToRoom = (roomIndex, behavior = 'smooth') => {
    const el = document.getElementById(`tour-room-${roomIndex}`);
    const body = scrollRef.current;
    if (!el || !body) return;
    body.scrollTo({ top: el.offsetTop - 8, behavior });
  };

  // Scroll to the requested room after the open transition starts.
  useEffect(() => {
    if (!open) return undefined;
    const body = scrollRef.current;
    if (!body) return undefined;
    if (scrollTarget === null || scrollTarget === undefined) {
      body.scrollTop = 0;
      return undefined;
    }
    let roomIndex = scrollTarget;
    if (typeof scrollTarget === 'string') {
      const hit = photos.find((p) => p.src === scrollTarget);
      roomIndex = hit ? hit.roomIndex : 0;
    }
    body.scrollTop = 0;
    const id = setTimeout(() => scrollToRoom(roomIndex), 30);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, scrollTarget]);

  useEffect(() => {
    if (!open || lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lightboxOpen, onClose]);

  // When the lightbox closes, return focus to the photo that opened it.
  const focusPhoto = (globalIndex) => {
    const el = thumbRefs.current[globalIndex];
    if (el) el.focus({ preventScroll: true });
  };

  return (
    <div
      className={`${styles.panel} ${open ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Photo tour"
      aria-hidden={!open}
      ref={panelRef}
    >
      <header className={styles.bar}>
        <IconButton ref={backRef} icon={Back} label="Back" className={styles.back} onClick={onClose} />
        <h2 className={styles.title}>Photo tour</h2>
        <div className={styles.actions}>
          <IconButton icon={Share} label="Share" onClick={onShare} />
          <IconButton
            icon={(p) => <Heart {...p} style={saved ? { fill: 'currentColor', color: '#ff385c' } : undefined} />}
            label={saved ? 'Saved' : 'Save'}
            onClick={onSave}
            aria-pressed={saved}
          />
        </div>
      </header>

      <div className={styles.scroll} ref={scrollRef}>
        <div className={styles.content}>
          <nav className={styles.categories} aria-label="Photo categories">
            {rooms.map((room, i) => (
              <button key={room.name} type="button" className={styles.category} aria-label={room.name} onClick={() => scrollToRoom(i)}>
                <img loading="lazy" alt="" src={room.photos[0]} />
                <span className={styles.categoryLabel}>{room.name}</span>
              </button>
            ))}
          </nav>

          <div>
            {rooms.map((room, roomIndex) => {
              const rows = chunkPhotos(room.photos.length);
              let cursor = 0;
              return (
                <section className={styles.room} id={`tour-room-${roomIndex}`} key={room.name}>
                  <div className={styles.roomInfo}>
                    <div className={styles.roomName}>{room.name}</div>
                    {room.features.length > 0 && (
                      <div className={styles.roomFeatures}>{room.features.join('  ·  ')}</div>
                    )}
                  </div>
                  <div className={styles.roomPhotos}>
                    {rows.map((size, rowIndex) => {
                      const slice = room.photos.slice(cursor, cursor + size);
                      const startIndex = cursor;
                      cursor += size;
                      return (
                        <div className={`${styles.row} ${size === 1 ? styles.rowSingle : styles.rowPair}`} key={rowIndex}>
                          {slice.map((src, j) => {
                            const globalIndex = roomOffsets[roomIndex] + startIndex + j;
                            return (
                              <button
                                key={src + globalIndex}
                                type="button"
                                className={styles.photo}
                                aria-label={`${title} image ${globalIndex + 1}`}
                                ref={(el) => {
                                  thumbRefs.current[globalIndex] = el;
                                }}
                                onClick={() => onOpenPhoto(globalIndex, () => focusPhoto(globalIndex))}
                              >
                                <img loading="lazy" alt={room.name} src={src} />
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
