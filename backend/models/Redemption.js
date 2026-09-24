const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
      required: true,
    },
    pointsUsed: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'FULFILLED', 'CANCELLED'],
      default: 'PENDING',
    },
    redeemedAt: {
      type: Date,
      default: Date.now,
    },
    redemptionCode: {
      type: String,
      default: () => 'PL-RED-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    },
  },
  {
    timestamps: true,
  }
);

redemptionSchema.index({ userId: 1 });
redemptionSchema.index({ status: 1 });

module.exports = mongoose.model('Redemption', redemptionSchema);
