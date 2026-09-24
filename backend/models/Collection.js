const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
  {
    pickupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      required: true,
      unique: true,
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
      required: true,
    },
    actualWeight: {
      type: Number,
      required: true,
      min: 0,
    },
    proofImages: [
      {
        type: String,
      },
    ],
    collectedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['COLLECTED', 'VERIFIED', 'TRANSIT_TO_RECYCLER'],
      default: 'COLLECTED',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Collection', collectionSchema);
