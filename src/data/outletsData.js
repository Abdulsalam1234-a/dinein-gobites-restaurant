export const OUTLETS_DATA = [
  {
    id: 'branch-main',
    name: 'Main Culinary Hub (Branch 1)',
    badge: 'Dual Outlet Center',
    tagline: 'Home to both our Dine-In Lounge & Go Bites Express Counter',
    address: '14 Admiralty Way, Victoria Island / Lekki Phase 1, Lagos',
    phone: '07068371295',
    hours: 'Monday – Sunday: 8:00 AM – 10:30 PM',
    outlets: [
      {
        name: 'Dine-In Lounge & VIP Terrace',
        type: 'dinein',
        description: 'Seated luxury dining hall. Savor steaming hot swallows (Amala, Semo, Eba), fresh grilled catfish, native soups, and plated delicacies served to your table.',
        features: ['Full Table Service', 'Air Conditioned & VIP Booths', 'Steaming Hot Swallows', 'Fresh Grilled Catfish'],
      },
      {
        name: 'Go Bites Express Counter',
        type: 'gobites',
        description: 'Dedicated rapid-order pickup counter. Designed for commuters, lunch breaks, and takeaway. Strictly rice boxes, combos, moi moi, and snacks. Zero wait time.',
        features: ['Express Pack-and-Go (under 5 mins)', 'Combo Meals & Snacks', 'Leak-proof Packaging', 'Dedicated Pickup Window'],
      }
    ],
    payments: ['Mastercard / Visa POS', 'Instant Bank Transfer', 'Cash Accepted'],
  },
  {
    id: 'branch-annex',
    name: 'Express Depot (Branch 2)',
    badge: 'Express Outlet',
    tagline: 'Fast takeaway & delivery hub for busy professionals',
    address: '28 Allen Avenue, Ikeja, Lagos',
    phone: '+234 809 876 5432',
    hours: 'Monday – Saturday: 7:30 AM – 9:00 PM',
    outlets: [
      {
        name: 'Go Bites Express Depot',
        type: 'gobites',
        description: 'Rapid-serve takeaway kitchen serving our full lineup of rice combos, jollof spaghetti, moi moi, meat pies, and drinks.',
        features: ['Takeaway & Rapid Dispatch', 'Office Bulk Catering', 'Pre-order Collection'],
      }
    ],
    payments: ['POS Terminal', 'Instant Bank Transfer'],
  }
];
