import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from './api/client';
import { useListing } from './hooks/useListing';
import { useKeyboardMode } from './hooks/useKeyboardMode';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useModalParams } from './hooks/useModalParams';
import { useToast } from './hooks/useToast';
import { Header } from './components/Header/Header';
import { StickyNav } from './components/StickyNav/StickyNav';
import { TitleBar } from './components/TitleBar/TitleBar';
import { HeroGallery } from './components/HeroGallery/HeroGallery';
import { Overview } from './components/Overview/Overview';
import { Sleeping } from './components/Sleeping/Sleeping';
import { Amenities } from './components/Amenities/Amenities';
import { AmenitiesModal } from './components/Amenities/AmenitiesModal';
import { Calendar } from './components/Calendar/Calendar';
import { BookingCard } from './components/BookingCard/BookingCard';
import { Reviews } from './components/Reviews/Reviews';
import { LocationMap } from './components/LocationMap/LocationMap';
import { HostSection } from './components/HostSection/HostSection';
import { ThingsToKnow } from './components/ThingsToKnow/ThingsToKnow';
import { SimilarStays } from './components/SimilarStays/SimilarStays';
import { PhotoTour } from './components/PhotoTour/PhotoTour';
import { Lightbox } from './components/Lightbox/Lightbox';
import { Toast } from './components/Toast/Toast';
import { PageSkeleton } from './components/ui/PageSkeleton';
import styles from './App.module.css';

const SLUG = 'romantic-jacuzzi-1bhk-candolim-mirashya-ug10';
const SECTIONS = ['photos', 'amenities', 'reviews', 'location'];

export default function App() {
  useKeyboardMode();
  const { listing, loading, error } = useListing(SLUG);
  const { message, show: toast } = useToast();
  const modal = useModalParams();

  const heroRef = useRef(null);
  const tourOpenerRef = useRef(null);
  const lightboxReturnFocus = useRef(null);
  const { active, showNav } = useScrollSpy(SECTIONS, { heroRef });

  const [saved, setSaved] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [tourScrollTarget, setTourScrollTarget] = useState(null);
  const [dates, setDates] = useState({ checkIn: null, checkOut: null });

  useEffect(() => {
    if (listing) {
      document.title = listing.pageTitle;
      setDates({ checkIn: listing.booking.checkIn, checkOut: listing.booking.checkOut });
    }
  }, [listing]);

  useEffect(() => {
    api.getWishlist(SLUG).then((r) => setSaved(r.saved)).catch(() => {});
  }, []);

  const toggleSave = useCallback(async () => {
    const next = !saved;
    setSaved(next);
    toast(next ? 'Saved to wishlist' : 'Removed from wishlist');
    try {
      const r = await api.toggleWishlist(SLUG);
      setSaved(r.saved);
    } catch {
      setSaved(!next);
    }
  }, [saved, toast]);

  const share = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + window.location.pathname);
      toast('Link copied');
    } catch {
      toast('Share options');
    }
  }, [toast]);

  const openTour = useCallback(
    (target, opener) => {
      tourOpenerRef.current = opener || document.activeElement;
      setTourScrollTarget(target ?? null);
      modal.openTour();
    },
    [modal],
  );

  const closeTour = useCallback(() => {
    modal.closeTour();
    const opener = tourOpenerRef.current;
    if (opener && typeof opener.focus === 'function') {
      requestAnimationFrame(() => opener.focus({ preventScroll: true }));
    }
  }, [modal]);

  const openLightbox = useCallback(
    (index, returnFocus) => {
      lightboxReturnFocus.current = returnFocus;
      modal.openLightbox(index);
    },
    [modal],
  );

  const closeLightbox = useCallback(() => {
    modal.closeLightbox();
    const fn = lightboxReturnFocus.current;
    if (fn) requestAnimationFrame(fn);
  }, [modal]);

  const photos = useMemo(() => listing?.photos ?? [], [listing]);

  if (loading) return <PageSkeleton />;
  if (error || !listing) {
    return (
      <div className={styles.error}>
        <h1>We couldn&apos;t load this listing.</h1>
        <p>{error?.message || 'Please try again.'}</p>
      </div>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <StickyNav
        visible={showNav && !modal.tourOpen}
        active={active}
        booking={listing.booking}
        rating={listing.rating}
        onReserve={() => toast('Reserve is not available in this demo')}
      />

      <main id="main">
        <div className="container">
          <TitleBar title={listing.title} saved={saved} onShare={share} onSave={toggleSave} />

          <HeroGallery
            ref={heroRef}
            photos={listing.heroPhotos}
            title={listing.title}
            onOpen={(src) => openTour(src)}
            onShowAll={() => openTour(null)}
          />

          <div className={styles.columns}>
            <div className={styles.left}>
              <Overview listing={listing} />
              <Sleeping items={listing.sleeping} />
              <Amenities
                items={listing.amenityPreview}
                total={listing.amenityCount}
                onShowAll={() => setAmenitiesOpen(true)}
              />
              <Calendar booking={listing.booking} checkIn={dates.checkIn} checkOut={dates.checkOut} onChange={setDates} />
            </div>
            <aside className={styles.right}>
              <BookingCard
                booking={listing.booking}
                checkIn={dates.checkIn}
                checkOut={dates.checkOut}
                onReserve={() => toast('Reserve is not available in this demo')}
                onClaim={() => toast('Discount applied to your next stay')}
                onReport={() => toast('Thanks, we will review this listing')}
              />
            </aside>
          </div>

          <div className={styles.wide}>
            <Reviews
              summary={listing.reviewsSummary}
              reviews={listing.reviews}
              guestFavourite={listing.guestFavourite}
              onShowAll={() => toast('All 19 reviews are shown on this page')}
            />
            <LocationMap location={listing.location} />
            <HostSection host={listing.host} onMessage={() => toast('Messaging is not available in this demo')} />
            <ThingsToKnow items={listing.thingsToKnow} />
            <SimilarStays items={listing.similar} />
          </div>
        </div>
      </main>

      <PhotoTour
        open={modal.tourOpen}
        rooms={listing.rooms}
        photos={photos}
        title={listing.title}
        saved={saved}
        scrollTarget={tourScrollTarget}
        lightboxOpen={modal.lightboxIndex !== null}
        onClose={closeTour}
        onOpenPhoto={openLightbox}
        onShare={share}
        onSave={toggleSave}
      />

      <Lightbox photos={photos} index={modal.lightboxIndex} onChange={modal.setLightboxIndex} onClose={closeLightbox} />

      <AmenitiesModal open={amenitiesOpen} groups={listing.amenityGroups} onClose={() => setAmenitiesOpen(false)} />

      <Toast message={message} />
    </>
  );
}
