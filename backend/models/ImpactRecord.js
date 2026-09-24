const mongoose = require('mongoose');

const impactRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      required: true,
    },
    plasticWeight: {
      type: Number,
      required: true,
      min: 0,
    },
    co2AvoidedKg: {
      type: Number,
      default: 0,
    },
    energySavedKwh: {
      type: Number,
      default: 0,
    },
    landfillSavedM3: {
      type: Number,
      default: 0,
    },
    treesEquivalent: {
      type: Number,
      default: 0,
    },
    calculationMethod: {
      type: String,
      default: 'USEPA WARM v15 & EcoInvent v3.8 Environmental Baseline Data (1 kg plastic recycled ≈ 1.5 kg CO2 avoided, 5.77 kWh energy saved, 0.002 m3 landfill volume saved)',
    },
  },
  {
    timestamps: true,
  }
);

impactRecordSchema.index({ userId: 1 });

module.exports = mongoose.model('ImpactRecord', impactRecordSchema);
