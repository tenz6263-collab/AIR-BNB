import mongoose from 'mongoose';

/** Host messages and listing reports share one shape. */
const SubmissionSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ['message', 'report'], required: true, index: true },
    visitorId: { type: String, required: true },
    listingSlug: { type: String, required: true },
    body: { type: String, required: true, maxlength: 2000 },
    reason: String,
  },
  { timestamps: true, versionKey: false },
);

export const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
