import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useListing } from './hooks/useListing';
import { useKeyboardMode } from './hooks/useKeyboardMode';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useOverlays } from './hooks/useOverlays';
import { useBooking } from './hooks/useBooking';
import { useWishlist } from './hooks/useWishlist';
import { useToast } from './hooks/useToast';
import { Header } from './components/Header/Header';
import { StickyNav } from './components/StickyNav/StickyNav';
import { TitleBar } from './components/TitleBar/TitleBar';
import { HeroGallery } from './components/HeroGallery/HeroGallery';
import { Overview } from './components/Overview/Overview';
import { Sleeping } from './components/Sleeping/Sleeping';
import { Amenities } from './components/Amenities/Amenities';
import { AmenitiesModal } from './components/Amenities/AmenitiesModal';
import { ReserveModal } from './components/Modals/ReserveModal';
import { MessageHostModal, ReportModal } from './components/Modals/FormModals';
import { HowReviewsWorkModal, PolicyModal, ReviewsModal } from './components/Modals/InfoModals';
import { formatInr } from './utils/dates';
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
import { Button } from './components/ui/Button';
import styles from './App.module.css';

const SLUG = 'romantic-jacuzzi-1bhk-candolim-mirashya-ug10';
const SECTIONS = ['photos', 'amenities', 'reviews', 'location'];

export default function App() {
  useKeyboardMode();
  const { listing, loading, error, retry } = useListing(SLUG);
  const { message, show: toast } = useToast();
  const overlays = useOverlays();

  const heroRef = useRef(null);
  const { active, showNav } = useScrollSpy(SECTIONS, { heroRef });

  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  // Which secondary dialog is open: reserve | message | report | reviews | how | policy
  const [dialog, setDialog] = useState(null);
  const [reviewTopic, setReviewTopic] = useState(null);
  const [policyTopic, setPolicyTopic] = useState(null);
  const closeDialog = useCallback(() => setDialog(null), []);
  const booking = useBooking(SLUG, listing);

  useEffect(() => {
    if (listing) document.title = listing.pageTitle;
  }, [listing]);

  const onSaveChange = useCallback(
    (next) => toast(next ? 'Saved to wishlist' : 'Removed from wishlist'),
    [toast],
  );
  const { saved, toggle: toggleSave } = useWishlist(SLUG, onSaveChange);

  // Mirrors the reference: the toast reads "Share options"; the link is also
  // copied to the clipboard when the browser allows it.
  const share = useCallback(() => {
    navigator.clipboard?.writeText(window.location.origin + window.location.pathname).catch(() => {});
    toast('Share options');
  }, [toast]);

  const reserve = useCallback(() => {
    if (booking.price.nights === 0) {
      toast('Select your dates first');
      return;
    }
    setDialog('reserve');
  }, [booking.price.nights, toast]);

  const cancelReservation = useCallback(
    async (id) => {
      try {
        await booking.cancel(id);
        toast('Reservation cancelled');
      } catch (err) {
        toast(err.message);
      }
    },
    [booking, toast],
  );

  const photos = useMemo(() => listing?.photos ?? [], [listing]);
  const overlayOpen = overlays.tourOpen || amenitiesOpen || dialog !== null;

  if (loading) return <PageSkeleton />;
  if (error || !listing) {
    return (
      <div className={styles.error} role="alert">
        <h1>We couldn&apos;t load this listing.</h1>
        <p>{error?.message || 'Please try again.'}</p>
        <Button variant="outline" className={styles.retry} onClick={retry}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Everything behind an overlay is made inert so assistive tech and Tab
          cannot reach it while a dialog is open. */}
      <div inert={overlayOpen ? '' : undefined}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <StickyNav
          visible={showNav && !overlays.tourOpen}
          active={active}
          priceLabel={booking.price.nights ? formatInr(booking.price.total) : 'Add dates'}
          nightsLabel={
            booking.price.nights
              ? `for ${booking.price.nights} night${booking.price.nights === 1 ? '' : 's'}`
              : ''
          }
          rating={listing.rating}
          onReserve={reserve}
        />

        <main id="main">
          <div className="container">
            <TitleBar title={listing.title} saved={saved} onShare={share} onSave={toggleSave} />

            <HeroGallery
              ref={heroRef}
              photos={listing.heroPhotos}
              title={listing.title}
              onOpen={(src) => overlays.openTour(src)}
              onShowAll={() => overlays.openTour(null)}
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
                <Calendar
                  booking={listing.booking}
                  checkIn={booking.dates.checkIn}
                  checkOut={booking.dates.checkOut}
                  onChange={booking.setDates}
                  blockedDates={booking.blockedDates}
                />
              </div>
              <aside className={styles.right}>
                <BookingCard
                  promoConfig={listing.booking.promo}
                  booking={booking}
                  onReserve={reserve}
                  onReport={() => setDialog('report')}
                  onCancel={cancelReservation}
                />
              </aside>
            </div>

            <div className={styles.wide}>
              <Reviews
                summary={listing.reviewsSummary}
                reviews={listing.reviews}
                guestFavourite={listing.guestFavourite}
                onShowAll={(topic) => {
                  setReviewTopic(topic);
                  setDialog('reviews');
                }}
                onHowReviewsWork={() => setDialog('how')}
              />
              <LocationMap location={listing.location} />
              <HostSection host={listing.host} onMessage={() => setDialog('message')} />
              <ThingsToKnow
                items={listing.thingsToKnow}
                onLearnMore={(topic) => {
                  setPolicyTopic(topic);
                  setDialog('policy');
                }}
              />
              <SimilarStays items={listing.similar} />
            </div>
          </div>
        </main>
      </div>

      <PhotoTour
        open={overlays.tourOpen}
        rooms={listing.rooms}
        photos={photos}
        title={listing.title}
        saved={saved}
        scrollTarget={overlays.tourScrollTarget}
        lightboxOpen={overlays.lightboxIndex !== null}
        onClose={overlays.closeTour}
        onOpenPhoto={overlays.openLightbox}
        onShare={share}
        onSave={toggleSave}
      />

      <Lightbox
        photos={photos}
        index={overlays.lightboxIndex}
        onChange={overlays.setLightboxIndex}
        onClose={overlays.closeLightbox}
      />

      <AmenitiesModal
        open={amenitiesOpen}
        groups={listing.amenityGroups}
        onClose={() => setAmenitiesOpen(false)}
      />

      <ReserveModal
        open={dialog === 'reserve'}
        listing={listing}
        booking={booking}
        onClose={closeDialog}
        onConfirmed={() => toast('Reservation confirmed')}
      />
      <MessageHostModal
        open={dialog === 'message'}
        slug={SLUG}
        host={listing.host}
        onClose={closeDialog}
        onSent={() => toast(`Message sent to ${listing.host.name}`)}
      />
      <ReportModal
        open={dialog === 'report'}
        slug={SLUG}
        onClose={closeDialog}
        onSent={() => toast('Thanks for letting us know')}
      />
      <ReviewsModal
        key={reviewTopic || 'all'}
        open={dialog === 'reviews'}
        summary={listing.reviewsSummary}
        reviews={listing.reviews}
        initialTopic={reviewTopic}
        onClose={closeDialog}
      />
      <HowReviewsWorkModal open={dialog === 'how'} onClose={closeDialog} />
      <PolicyModal open={dialog === 'policy'} topic={policyTopic} onClose={closeDialog} />

      <Toast message={message} />
    </>
  );
}
