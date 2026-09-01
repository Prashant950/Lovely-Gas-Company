// seed/seed.js - wipe and re-populate the database with demo data.
require('dotenv').config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Service = require('../models/Service');
const Inquiry = require('../models/Inquiry');

// ---- Services (order 1..7, all active) -------------------------------------
const services = [
  {
    title: 'Gas Stove (Chulha) Repair & Service',
    shortDescription:
      'Doorstep repair for gas stoves, burners and chulhas with genuine spare parts.',
    description:
      'Our trained technicians repair single, double and multi-burner gas stoves right at your doorstep. We fix low flame, gas leakage, ignition failure and clogged burners using genuine spare parts. Same-day service is available and every repair carries a service warranty.',
    category: 'Gas Appliances',
    icon: '🔥',
    imageUrl: '/images/hero-gas-stove.jpg',
    features: [
      'Burner & ignition repair',
      'Gas leakage check & fix',
      'Genuine spare parts',
      'Doorstep same-day service',
      'Warranty on repair',
    ],
    isActive: true,
    order: 1,
  },
  {
    title: 'AC Repair & Installation',
    shortDescription:
      'Split & window AC repair, gas refilling, installation and uninstallation.',
    description:
      'We service and repair all brands of split and window air conditioners, including poor cooling, gas refilling, water leakage and noisy operation. Our experts also handle professional installation and uninstallation. Enjoy reliable doorstep service from trained technicians with a warranty on every repair.',
    category: 'Air Conditioning',
    icon: '❄️',
    imageUrl: '/images/hero-ac-service.jpg',
    features: [
      'Split & window AC repair',
      'Gas refilling & top-up',
      'Installation & uninstallation',
      'Deep cooling coil cleaning',
      'Warranty on repair',
    ],
    isActive: true,
    order: 2,
  },
  {
    title: 'Refrigerator (Fridge) Repair',
    shortDescription:
      'Single & double door fridge repair for cooling, compressor and gas issues.',
    description:
      'From single-door to double-door and side-by-side refrigerators, we fix cooling problems, compressor faults, gas leakage and thermostat issues. All repairs use genuine spare parts and are handled by experienced technicians at your home. Book same-day doorstep service backed by a repair warranty.',
    category: 'Refrigeration',
    icon: '🧊',
    imageUrl: '/images/service-fridge.jpg',
    features: [
      'Cooling & compressor repair',
      'Gas charging',
      'Thermostat & sensor fix',
      'All brands supported',
      'Doorstep service with warranty',
    ],
    isActive: true,
    order: 3,
  },
  {
    title: 'Geyser Repair & Installation',
    shortDescription:
      'Instant & storage geyser repair, element replacement and installation.',
    description:
      'We repair and install instant and storage water geysers, fixing heating elements, thermostats, leakage and no-heating faults. Our technicians ensure safe electrical connections and use only genuine parts. Same-day doorstep service is available with a warranty on all repairs.',
    category: 'Water Heating',
    icon: '🚿',
    imageUrl: '/images/service-geyser.jpg',
    features: [
      'Heating element replacement',
      'Thermostat repair',
      'Leakage & wiring fix',
      'New geyser installation',
      'Warranty on repair',
    ],
    isActive: true,
    order: 4,
  },
  {
    title: 'RO / Water Purifier (Aaro) Service',
    shortDescription:
      'RO water purifier service, filter & membrane replacement, AMC available.',
    description:
      'Keep your drinking water safe with our RO and water purifier servicing, covering filter and membrane replacement, TDS adjustment and leakage repair. We service all major RO brands at your doorstep using genuine spare parts. Annual Maintenance Contracts (AMC) are also available for worry-free upkeep.',
    category: 'Water Purifier',
    icon: '💧',
    imageUrl: '/images/service-ro.jpg',
    features: [
      'Filter & membrane replacement',
      'TDS check & adjustment',
      'Leakage repair',
      'All RO brands',
      'AMC plans available',
    ],
    isActive: true,
    order: 5,
  },
  {
    title: 'Washing Machine Repair',
    shortDescription:
      'Front & top load washing machine repair for all brands at your doorstep.',
    description:
      'We repair fully-automatic, semi-automatic, front-load and top-load washing machines, fixing drainage, spinning, motor and drum issues. Our trained technicians use genuine spare parts and offer same-day doorstep service. Every repair comes with a service warranty for your peace of mind.',
    category: 'Laundry',
    icon: '🌀',
    imageUrl: '/images/hero-washing-machine.jpg',
    features: [
      'Front & top load repair',
      'Motor & drum repair',
      'Drainage & spin fix',
      'Genuine spare parts',
      'Same-day doorstep service',
    ],
    isActive: true,
    order: 6,
  },
  {
    title: 'All Electronics & Home Appliance Work',
    shortDescription:
      'Repair for microwaves, chimneys, coolers, induction and other home appliances.',
    description:
      'Beyond our core services, we repair a wide range of home electronics and appliances including microwaves, kitchen chimneys, air coolers, induction cooktops and mixer grinders. Our multi-skilled technicians diagnose and fix issues at your doorstep using genuine parts. Reliable same-day service with a warranty on repairs.',
    category: 'Electronics',
    icon: '🔧',
    imageUrl: '/images/service-microwave-electronics.jpg',
    features: [
      'Microwave & chimney repair',
      'Cooler & induction repair',
      'Multi-appliance support',
      'Genuine spare parts',
      'Doorstep service with warranty',
    ],
    isActive: true,
    order: 7,
  },
];

// ---- Sample inquiries ------------------------------------------------------
const inquiries = [
  {
    name: 'Rahul Sharma',
    phone: '+91-9812345678',
    email: 'rahul.sharma@example.com',
    serviceName: 'AC Repair & Installation',
    message: 'My split AC is not cooling properly. Please send a technician today.',
    status: 'new',
    source: 'contact-form',
  },
  {
    name: 'Priya Verma',
    phone: '+91-9723456781',
    email: 'priya.verma@example.com',
    serviceName: 'RO / Water Purifier (Aaro) Service',
    message: 'Need RO filter replacement and a general service for my purifier.',
    status: 'contacted',
    source: 'whatsapp',
  },
];

// ---- Seed runner -----------------------------------------------------------
const seed = async () => {
  try {
    await connectDB();

    // Wipe existing data.
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Inquiry.deleteMany({}),
    ]);

    // Create users via User.create so the pre-save hook hashes passwords.
    // (insertMany would SKIP the hook and store raw passwords.)
    const createdUsers = await User.create([
      {
        name: 'Lovely Gas Admin',
        email: 'admin@lovelygas.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '+919905969905',
      },
      {
        name: 'Demo User',
        email: 'user@lovelygas.com',
        password: 'User@123',
        role: 'user',
        phone: '+91-9000000000',
      },
    ]);

    // create() also runs the slug pre-save hook for services.
    const createdServices = await Service.create(services);
    const createdInquiries = await Inquiry.create(inquiries);

    console.log('--- Seed complete ---');
    console.log(`Users created:     ${createdUsers.length}`);
    console.log(`Services created:  ${createdServices.length}`);
    console.log(`Inquiries created: ${createdInquiries.length}`);
    console.log('');
    console.log('Admin login -> admin@lovelygas.com / Admin@123');
    console.log('User  login -> user@lovelygas.com / User@123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();

