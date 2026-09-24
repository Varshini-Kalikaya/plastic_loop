const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plasticTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlasticType',
      required: true,
    },
    estimatedWeight: {
      type: Number,
      required: [true, 'Estimated weight is required'],
      min: [0.1, 'Weight must be greater than 0'],
    },
    actualWeight: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTimeSlot: {
      type: String,
      required: true,
      enum: ['Morning (8AM - 12PM)', 'Afternoon (12PM - 4PM)', 'Evening (4PM - 8PM)'],
    },
    description: {
      type: String,
      default: '',
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: [
        'PENDING',
        'ASSIGNED',
        'ACCEPTED',
        'PICKED_UP',
        'VERIFIED',
        'SENT_TO_RECYCLER',
        'PROCESSING',
        'RECYCLED',
        'CANCELLED',
      ],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

pickupRequestSchema.index({ status: 1 });
pickupRequestSchema.index({ userId: 1 });
pickupRequestSchema.index({ collectorId: 1 });
pickupRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);
