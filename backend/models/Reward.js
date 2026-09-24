const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Reward name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Reward description is required'],
    },
    pointsRequired: {
      type: Number,
      required: [true, 'Points required is mandatory'],
      min: [1, 'Points must be at least 1'],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 100,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
    },
    category: {
      type: String,
      enum: ['E-Voucher', 'Eco Product', 'Tree Planting', 'Discount Card', 'Merchandise'],
      default: 'E-Voucher',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reward', rewardSchema);
