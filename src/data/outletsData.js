export const OUTLETS_DATA = [
  {
    id: 'branch-main',
    name: 'Adebayo Flagship Outlet (Branch 1)',
    badge: 'Dual Outlet Center',
    tagline: 'Home to both our Dine-In Lounge & Go Bites Express Counter',
    address: 'Adebayo Area, Along Iworoko Road, Ado-Ekiti, Ekiti State, Nigeria',
    phone: '07068371295',
    hours: 'Monday – Sunday: 8:00 AM – 10:30 PM',
    outlets: [
      {
        name: 'Dine-In Lounge & VIP Terrace',
        type: 'dinein',
        description: 'Seated luxury dining hall in Adebayo. Savor steaming hot swallows (Amala with Gbegiri & Ewedu, Semo, Pounded Yam, Eba), fresh grilled catfish, native soups, and plated delicacies served right to your table.',
        features: ['Full Table Service', 'Air Conditioned Seated Lounge', 'Steaming Hot Swallows', 'Fresh Catfish Pepper Soup'],
      },
      {
        name: 'Go Bites Express Counter',
        type: 'gobites',
        description: 'Dedicated rapid-order pickup counter. Designed for students, civil servants, and takeaway food lovers. Strictly party jollof, fried rice, combos, moi moi, and snacks. Ready in under 3 minutes.',
        features: ['Express Pack-and-Go (under 3 mins)', 'Student & Office Combo Meals', 'Insulated Microwave-safe Packaging', 'Dedicated Takeaway Window'],
      }
    ],
    payments: ['Mastercard / Visa POS', 'Instant Bank Transfer', 'Cash Accepted'],
  },
  {
    id: 'branch-annex',
    name: 'Ado-Ekiti Express Dispatch Depot (Branch 2)',
    badge: 'Express Outlet',
    tagline: 'Fast takeaway & delivery hub for students and professionals',
    address: 'Opposite EKSU Junction / Adebayo Commercial Axis, Ado-Ekiti, Ekiti State',
    phone: '07068371295',
    hours: 'Monday – Saturday: 7:30 AM – 9:30 PM (Sundays: 12 PM - 8 PM)',
    outlets: [
      {
        name: 'Go Bites Express Depot',
        type: 'gobites',
        description: 'Rapid-serve takeaway kitchen serving our full lineup of rice combos, jollof spaghetti, moi moi, meat pies, and chilled drinks.',
        features: ['Takeaway & Rapid Courier Dispatch', 'EKSU & Campus Bulk Catering', 'Pre-order Collection'],
      }
    ],
    payments: ['POS Terminal', 'Instant Bank Transfer'],
  }
];
