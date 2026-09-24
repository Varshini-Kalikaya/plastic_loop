const mongoose = require('mongoose');

const recyclingRecordSchema = new mongoose.Schema(
  {
    pickupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      required: true,
      unique: true,
    },
    recyclerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plasticTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlasticType',
      required: true,
    },
    receivedWeight: {
      type: Number,
      required: true,
      min: 0,
    },
    processedWeight: {
      type: Number,
      default: 0,
      min: 0,
    },
    recycledWeight: {
      type: Number,
      default: 0,
      min: 0,
    },
    rejectedWeight: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['RECEIVED', 'PROCESSING', 'COMPLETED', 'REJECTED'],
      default: 'RECEIVED',
    },
    processingDate: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

recyclingRecordSchema.index({ recyclerId: 1 });
recyclingRecordSchema.index({ status: 1 });

module.exports = mongoose.model('RecyclingRecord', recyclingRecordSchema);
