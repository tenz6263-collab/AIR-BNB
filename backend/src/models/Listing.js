import mongoose from 'mongoose';

const { Schema } = mongoose;

const AmenitySchema = new Schema(
  { icon: String, label: String, unavailable: { type: Boolean, default: false } },
  { _id: false },
);

const RoomSchema = new Schema(
  { name: String, features: [String], photos: [String] },
  { _id: false },
);

const ReviewSchema = new Schema(
  {
    name: String,
    tenure: String,
    avatar: String,
    initial: String,
    bg: String,
    fg: String,
    stars: Number,
    date: String,
    clamp: Boolean,
    text: String,
  },
  { _id: false },
);

/**
 * A listing document holds everything the detail page renders. Nested,
 * loosely-typed sub documents (Schema.Types.Mixed) are used for the sections
 * whose shape is purely presentational so the seed JSON maps 1:1.
 */
const ListingSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    pageTitle: String,
    summary: { heading: String, facts: [String] },
    rating: { value: Number, count: Number },
    guestFavourite: Schema.Types.Mixed,
    host: Schema.Types.Mixed,
    highlights: [Schema.Types.Mixed],
    translationNotice: String,
    description: String,
    sleeping: [Schema.Types.Mixed],
    amenityPreview: [AmenitySchema],
    amenityCount: Number,
    amenityGroups: [{ title: String, items: [AmenitySchema] }],
    booking: Schema.Types.Mixed,
    reviewsSummary: Schema.Types.Mixed,
    reviews: [ReviewSchema],
    location: Schema.Types.Mixed,
    thingsToKnow: [Schema.Types.Mixed],
    similar: [Schema.Types.Mixed],
    heroPhotos: [String],
    rooms: [RoomSchema],
  },
  { timestamps: true, versionKey: false },
);

export const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
