import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, index: true },
    listingSlug: { type: String, required: true, index: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
      pets: { type: Number, default: 0 },
    },
    nights: Number,
    subtotal: Number,
    discount: Number,
    total: Number,
    status: { type: String, default: 'confirmed' },
  },
  { timestamps: true, versionKey: false },
);

export const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
