const mongoose = require('mongoose');

const plasticTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plastic name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Plastic code is required'],
      unique: true,
      uppercase: true,
      enum: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER'],
    },
    description: {
      type: String,
      default: '',
    },
    pointsPerKg: {
      type: Number,
      required: [true, 'Points per kg is required'],
      min: 0,
      default: 10,
    },
    recyclable: {
      type: Boolean,
      default: true,
    },
    accepted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PlasticType', plasticTypeSchema);
