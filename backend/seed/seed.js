const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const PlasticType = require('../models/PlasticType');
const PickupRequest = require('../models/PickupRequest');
const Collection = require('../models/Collection');
const RecyclingRecord = require('../models/RecyclingRecord');
const Reward = require('../models/Reward');
const Redemption = require('../models/Redemption');
const Notification = require('../models/Notification');
const ImpactRecord = require('../models/ImpactRecord');

const seedData = async () => {
  try {
    console.log('[Seed Script]: Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed Script]: Connected to MongoDB!');

    // Clear existing collections
    console.log('[Seed Script]: Clearing old database collections...');
    await User.deleteMany();
    await PlasticType.deleteMany();
    await PickupRequest.deleteMany();
    await Collection.deleteMany();
    await RecyclingRecord.deleteMany();
    await Reward.deleteMany();
    await Redemption.deleteMany();
    await Notification.deleteMany();
    await ImpactRecord.deleteMany();

    console.log('[Seed Script]: Seeding Plastic Types...');
    const plasticTypes = await PlasticType.create([
      { name: 'Polyethylene Terephthalate (PET)', code: 'PET', pointsPerKg: 10, description: 'Beverage bottles, water bottles, food containers', recyclable: true, accepted: true },
      { name: 'High-Density Polyethylene (HDPE)', code: 'HDPE', pointsPerKg: 12, description: 'Milk jugs, shampoo bottles, detergent bottles', recyclable: true, accepted: true },
      { name: 'Polyvinyl Chloride (PVC)', code: 'PVC', pointsPerKg: 6, description: 'Pipes, packaging films, cable insulation', recyclable: true, accepted: true },
      { name: 'Low-Density Polyethylene (LDPE)', code: 'LDPE', pointsPerKg: 8, description: 'Grocery bags, squeeze bottles, flexible packaging', recyclable: true, accepted: true },
      { name: 'Polypropylene (PP)', code: 'PP', pointsPerKg: 10, description: 'Yogurt cups, bottle caps, medicine bottles', recyclable: true, accepted: true },
      { name: 'Polystyrene (PS)', code: 'PS', pointsPerKg: 5, description: 'Disposable cups, takeaway containers, foam packaging', recyclable: true, accepted: true },
      { name: 'Other Mixed Plastics', code: 'OTHER', pointsPerKg: 4, description: 'Multi-layer packaging, polycarbonate, miscellaneous plastic items', recyclable: true, accepted: true },
    ]);

    const pet = plasticTypes.find((p) => p.code === 'PET');
    const hdpe = plasticTypes.find((p) => p.code === 'HDPE');
    const pp = plasticTypes.find((p) => p.code === 'PP');

    console.log('[Seed Script]: Seeding System Users (Admin, Collectors, Recyclers, Citizens)...');

    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@plasticloop.com',
      password: 'password123',
      role: 'ADMIN',
      phone: '+91 9876543210',
      address: { street: 'Green Tech Hub, Tech Park', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001' },
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    });

    const collector1 = await User.create({
      name: 'Vikram Singh (Collector)',
      email: 'collector@plasticloop.com',
      password: 'password123',
      role: 'COLLECTOR',
      phone: '+91 9876500001',
      address: { street: 'Eco Depot 4, Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600040' },
      totalPlasticCollected: 145.5,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    });

    const recycler1 = await User.create({
      name: 'GreenCycle Recycling Center',
      email: 'recycler@plasticloop.com',
      password: 'password123',
      role: 'RECYCLER',
      phone: '+91 9876500002',
      address: { street: 'Industrial Estate Phase 2', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600058' },
      profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300',
    });

    const citizen1 = await User.create({
      name: 'Rahul Sharma',
      email: 'user@plasticloop.com',
      password: 'password123',
      role: 'USER',
      phone: '+91 9123456789',
      address: { street: 'Flat 302, Sunrise Apartments, Velachery', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600042' },
      points: 240,
      totalPlasticCollected: 25.0,
      totalPlasticRecycled: 22.5,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    });

    const citizen2 = await User.create({
      name: 'Ananya Verma',
      email: 'ananya@plasticloop.com',
      password: 'password123',
      role: 'USER',
      phone: '+91 9876512345',
      address: { street: '45 Lake View Road, Adyar', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600020' },
      points: 180,
      totalPlasticCollected: 18.0,
      totalPlasticRecycled: 15.0,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    });

    const citizen3 = await User.create({
      name: 'Priya Nair',
      email: 'priya@plasticloop.com',
      password: 'password123',
      role: 'USER',
      phone: '+91 9988776655',
      address: { street: '12 Palm Grove Avenue, T. Nagar', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600017' },
      points: 350,
      totalPlasticCollected: 35.0,
      totalPlasticRecycled: 32.0,
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    });

    console.log('[Seed Script]: Seeding Rewards Catalog...');
    const rewards = await Reward.create([
      {
        name: '₹250 Amazon Shopping Gift Card',
        description: 'Instant e-voucher redeemable on Amazon India for all products.',
        pointsRequired: 200,
        quantity: 50,
        category: 'E-Voucher',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Eco-Friendly Stainless Steel Water Bottle (750ml)',
        description: 'BPA-free vacuum insulated double-wall stainless steel flask.',
        pointsRequired: 300,
        quantity: 25,
        category: 'Eco Product',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Plant 5 Native Trees in Your Name',
        description: 'Digital certificate + geolocation tag of 5 saplings planted in urban forests.',
        pointsRequired: 150,
        quantity: 100,
        category: 'Tree Planting',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: '₹500 Organic Grocery Discount Voucher',
        description: 'Valid at partnering organic superstores & online farm produce apps.',
        pointsRequired: 400,
        quantity: 30,
        category: 'Discount Card',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'PlasticLoop Organic Cotton Tote Bag',
        description: 'Durable heavy-duty 100% organic cotton reusable tote shopping bag.',
        pointsRequired: 100,
        quantity: 60,
        category: 'Merchandise',
        image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=400',
      },
    ]);

    console.log('[Seed Script]: Seeding Pickup Requests & Workflow Data...');

    // 1. Completed & Recycled Pickup for Rahul Sharma
    const pickup1 = await PickupRequest.create({
      userId: citizen1._id,
      plasticTypeId: pet._id,
      estimatedWeight: 12.0,
      actualWeight: 12.5,
      images: ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400'],
      address: citizen1.address,
      preferredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      preferredTimeSlot: 'Morning (8AM - 12PM)',
      description: 'Used PET water bottles and clear soft drink containers from housing society drive.',
      collectorId: collector1._id,
      status: 'RECYCLED',
    });

    await Collection.create({
      pickupId: pickup1._id,
      collectorId: collector1._id,
      userId: citizen1._id,
      plasticTypeId: pet._id,
      estimatedWeight: 12.0,
      actualWeight: 12.5,
      collectedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      verifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      status: 'VERIFIED',
    });

    await RecyclingRecord.create({
      pickupId: pickup1._id,
      recyclerId: recycler1._id,
      plasticTypeId: pet._id,
      receivedWeight: 12.5,
      processedWeight: 12.5,
      recycledWeight: 12.0,
      rejectedWeight: 0.5,
      status: 'COMPLETED',
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      notes: 'High purity PET grade A pellets manufactured.',
    });

    await ImpactRecord.create({
      userId: citizen1._id,
      pickupId: pickup1._id,
      plasticWeight: 12.0,
      co2AvoidedKg: 18.0,
      energySavedKwh: 69.24,
      landfillSavedM3: 0.024,
      treesEquivalent: 0.36,
    });

    // 2. Active Pickup (ASSIGNED to Collector) for Rahul Sharma
    const pickup2 = await PickupRequest.create({
      userId: citizen1._id,
      plasticTypeId: hdpe._id,
      estimatedWeight: 8.5,
      images: ['https://images.unsplash.com/photo-1604186837056-8e7c286756f2?auto=format&fit=crop&q=80&w=400'],
      address: citizen1.address,
      preferredDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      preferredTimeSlot: 'Afternoon (12PM - 4PM)',
      description: 'Clean HDPE detergent and milk bottles ready for pickup.',
      collectorId: collector1._id,
      status: 'ASSIGNED',
    });

    // 3. Pending Pickup (Unassigned) for Ananya Verma
    const pickup3 = await PickupRequest.create({
      userId: citizen2._id,
      plasticTypeId: pp._id,
      estimatedWeight: 15.0,
      images: ['https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&q=80&w=400'],
      address: citizen2.address,
      preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      preferredTimeSlot: 'Morning (8AM - 12PM)',
      description: 'Clean PP food containers from kitchen cleanup.',
      status: 'PENDING',
    });

    console.log('[Seed Script]: Seeding Sample Notifications...');
    await Notification.create([
      {
        userId: citizen1._id,
        title: '🎉 Recycling Completed & Points Credited!',
        message: 'Your 12.0 kg PET plastic waste was recycled! +120 reward points credited to your wallet.',
        type: 'SUCCESS',
        read: false,
      },
      {
        userId: citizen1._id,
        title: 'Collector Assigned',
        message: 'Collector Vikram Singh has been assigned for your HDPE pickup request.',
        type: 'INFO',
        read: true,
      },
      {
        userId: collector1._id,
        title: 'New Pickup Assignment',
        message: 'You have been assigned to pickup request #HDPE-8.5KG in Velachery.',
        type: 'INFO',
        read: false,
      },
    ]);

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS READY FOR TESTING:');
    console.log('🔑 ADMIN:      email: admin@plasticloop.com     | pass: password123');
    console.log('🔑 COLLECTOR:  email: collector@plasticloop.com | pass: password123');
    console.log('🔑 RECYCLER:   email: recycler@plasticloop.com  | pass: password123');
    console.log('🔑 USER/CITIZEN: email: user@plasticloop.com   | pass: password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
