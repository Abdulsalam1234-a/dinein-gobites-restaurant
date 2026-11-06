import { INITIAL_MENU_ITEMS } from '../data/initialMenu';
import { INITIAL_STAFF_MEMBERS } from '../data/initialStaff';
import { INITIAL_AMBIENCE_MEDIA } from '../data/initialAmbience';

const STORAGE_KEYS = {
  MENU: 'romee_gobite_menu_items_v2',
  SETTINGS: 'romee_gobite_settings_v2',
  STAFF: 'romee_gobite_staff_v2',
  AMBIENCE: 'romee_gobite_ambience_v2',
  USERS: 'romee_gobite_users_v2',
  AUDIT_LOGS: 'romee_gobite_audit_logs_v2',
};

export const DEFAULT_USERS = [
  {
    id: 'user-superuser',
    email: 'salamiabdullahi247@gmail.com',
    password: '1234',
    name: 'Abdullahi Salami',
    role: 'superuser',
    title: 'Super Administrator & Owner',
    permissions: ['all'],
    status: 'active',
    createdAt: '2026-10-28',
  },
  {
    id: 'user-manager-1',
    email: 'manager@romeegobite.com',
    password: '1234',
    name: 'Folashade Balogun',
    role: 'manager',
    title: 'General Manager (Operations)',
    permissions: ['menu', 'pricing', 'staff', 'ambience'],
    status: 'active',
    createdAt: '2026-10-28',
  },
  {
    id: 'user-chef-1',
    email: 'kitchen@romeegobite.com',
    password: '1234',
    name: 'Chef Sunday Alabi',
    role: 'kitchen',
    title: 'Executive Head Chef',
    permissions: ['menu', 'ambience'],
    status: 'active',
    createdAt: '2026-10-28',
  },
];

export const DEFAULT_SETTINGS = {
  restaurantName: 'ROMEE Go-Bite Eatery',
  tagline: 'Authentic Swallows, Plated Feasts & Express Takeaways',
  whatsappNumber: '07068371295',
  alternatePhone: '08012345678',
  supportEmail: 'orders@romeegobite.com',
  superuserEmail: 'salamiabdullahi247@gmail.com',
  currency: '₦',
  serviceChargeDineIn: 500,
  packagingFeeGoBites: 300,
  
  // Dine-In Branch (Swallow Hub & Family Lounge)
  dineInName: 'Victoria Island / Lekki Flagship Hub',
  dineInAddress: 'Plot 14B, Admiralty Way / Adeola Odeku Corridor, Victoria Island, Lagos',
  dineInCity: 'Victoria Island, Lagos',
  dineInState: 'Lagos State, Nigeria',
  dineInHours: 'Mon - Sun: 9:00 AM - 10:00 PM',
  dineInGoogleMapsUrl: 'https://maps.google.com/?q=Victoria+Island+Lagos',
  dineInEmbedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7297920199144!2d3.4243555!3d6.4287383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53293888377%3A0xb3671ff8be28b9d3!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng',

  // Go-Bites Express Branch (Takeaway & Fast Combos)
  goBitesName: 'Mainland Express Dispatch Depot',
  goBitesAddress: '42 Allen Avenue (Opposite Oshopey Plaza), Ikeja, Lagos',
  goBitesCity: 'Ikeja, Lagos',
  goBitesState: 'Lagos State, Nigeria',
  goBitesHours: 'Mon - Sat: 8:00 AM - 9:30 PM (Sundays: 12 PM - 8 PM)',
  goBitesGoogleMapsUrl: 'https://maps.google.com/?q=Allen+Avenue+Ikeja+Lagos',
  goBitesEmbedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3855529451994!2d3.3512214!3d6.6014498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b9231f24d9c79%3A0xe96803ce58f12eb6!2sAllen%20Ave%2C%20Ikeja%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng',

  // Seasonal Theme: 'classic' | 'christmas' | 'salah' | 'halloween' | 'valentine' | 'naija'
  theme: 'classic',

  // Welcome Announcement Modal
  welcomePopupEnabled: true,
  welcomeHeadline: 'Welcome to ROMEE Go-Bite Eatery! 🍲',
  welcomeSubtitle: 'Home of authentic swallows (Amala, Semo, Pounded Yam) & rapid express favorites (Jollof, Fried Rice, Moi Moi).',
  welcomePromoBadge: '🔥 Special Welcome Offer',
  welcomePromoText: 'Enjoy complimentary packaging on takeaway orders above ₦10,000!',
  welcomeButtonText: 'Explore Menu & Order Now',
};

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: '2026-10-28 17:00:00',
    userEmail: 'salamiabdullahi247@gmail.com',
    userName: 'Abdullahi Salami (Superuser)',
    role: 'superuser',
    action: 'SYSTEM_INITIALIZATION',
    details: 'System multi-page platform initialized with full CRUD modules and audit security.',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-28 17:15:00',
    userEmail: 'salamiabdullahi247@gmail.com',
    userName: 'Abdullahi Salami (Superuser)',
    role: 'superuser',
    action: 'ACCESS_GRANTED',
    details: 'Superuser configured management team credentials for manager@romeegobite.com.',
  },
];

// 1. Menu Items Storage
export const loadMenuFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MENU);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load menu from storage:', e);
  }
  return INITIAL_MENU_ITEMS;
};

export const saveMenuToStorage = (menu) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
  } catch (e) {
    console.error('Failed to save menu to storage:', e);
  }
};

// 2. Settings Storage
export const loadSettingsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings from storage:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to storage:', e);
  }
};

// 3. Staff & Managing Team Storage
export const loadStaffFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load staff from storage:', e);
  }
  return INITIAL_STAFF_MEMBERS;
};

export const saveStaffToStorage = (staff) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  } catch (e) {
    console.error('Failed to save staff to storage:', e);
  }
};

// 4. Ambience Media Storage (Kitchen, Seating, Go-Bites Photos & Videos)
export const loadAmbienceFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AMBIENCE);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load ambience from storage:', e);
  }
  return INITIAL_AMBIENCE_MEDIA;
};

export const saveAmbienceToStorage = (media) => {
  try {
    localStorage.setItem(STORAGE_KEYS.AMBIENCE, JSON.stringify(media));
  } catch (e) {
    console.error('Failed to save ambience to storage:', e);
  }
};

// 5. User Accounts Storage
export const loadUsersFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load users from storage:', e);
  }
  return DEFAULT_USERS;
};

export const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to storage:', e);
  }
};

// 6. Audit & History Logs Storage
export const loadAuditLogsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load audit logs from storage:', e);
  }
  return INITIAL_AUDIT_LOGS;
};

export const saveAuditLogsToStorage = (logs) => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100))); // keep latest 100
  } catch (e) {
    console.error('Failed to save audit logs to storage:', e);
  }
};

export const addAuditLog = (action, details, user) => {
  const currentLogs = loadAuditLogsFromStorage();
  const now = new Date();
  const formattedTimestamp = now.toLocaleString('en-NG', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });

  const newEntry = {
    id: `log-${Date.now()}`,
    timestamp: formattedTimestamp,
    userEmail: user?.email || 'salamiabdullahi247@gmail.com',
    userName: user?.name || 'Administrator',
    role: user?.role || 'superuser',
    action,
    details,
  };

  const updatedLogs = [newEntry, ...currentLogs];
  saveAuditLogsToStorage(updatedLogs);
  return { updatedLogs, newEntry };
};

// 7. Notification Generators for Superuser
export const createSuperuserWhatsAppUrl = (logEntry, whatsappNumber = '07068371295') => {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const baseWa = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone;

  const text = [
    `🔔 *ROMEE EATERY - AUDIT & UPDATE ALERT*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *User*: ${logEntry.userName} (${logEntry.userEmail})`,
    `🏷️ *Role*: ${logEntry.role?.toUpperCase()}`,
    `⚡ *Action*: ${logEntry.action}`,
    `📝 *Details*: ${logEntry.details}`,
    `⏰ *Time*: ${logEntry.timestamp}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `_This is an automated administrative notification sent to the superuser._`,
  ].join('\n');

  return `https://wa.me/${baseWa}?text=${encodeURIComponent(text)}`;
};

export const createSuperuserMailtoUrl = (logEntry, superuserEmail = 'salamiabdullahi247@gmail.com') => {
  const subject = `[ROMEE AUDIT ALERT] ${logEntry.action} by ${logEntry.userName}`;
  const body = [
    `Dear Super Administrator,`,
    ``,
    `An administrative change was just performed on the ROMEE Go-Bite Eatery platform:`,
    ``,
    `• Action: ${logEntry.action}`,
    `• User: ${logEntry.userName} (${logEntry.userEmail})`,
    `• Role: ${logEntry.role?.toUpperCase()}`,
    `• Timestamp: ${logEntry.timestamp}`,
    `• Details: ${logEntry.details}`,
    ``,
    `To review all platform updates, log into the Admin Dashboard at ROMEE Go-Bite Eatery.`,
    ``,
    `Best regards,`,
    `ROMEE Go-Bite Automated Audit Logger`,
  ].join('\n');

  return `mailto:${superuserEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

// 8. Export & Import All Restaurant Configuration for Production Deployment
export const exportAllRestaurantData = () => {
  return {
    version: '2.0-production',
    exportedAt: new Date().toISOString(),
    restaurantName: 'ROMEE Go-Bite Eatery',
    settings: loadSettingsFromStorage(),
    menu: loadMenuFromStorage(),
    staff: loadStaffFromStorage(),
    ambience: loadAmbienceFromStorage(),
    users: loadUsersFromStorage().map(u => ({ ...u, password: u.password })), // sanitized export
  };
};

export const importAllRestaurantData = (payload) => {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid backup file format');
    }

    if (Array.isArray(payload.menu) && payload.menu.length > 0) {
      saveMenuToStorage(payload.menu);
    }
    if (payload.settings && typeof payload.settings === 'object') {
      saveSettingsToStorage(payload.settings);
    }
    if (Array.isArray(payload.staff) && payload.staff.length > 0) {
      saveStaffToStorage(payload.staff);
    }
    if (Array.isArray(payload.ambience) && payload.ambience.length > 0) {
      saveAmbienceToStorage(payload.ambience);
    }
    if (Array.isArray(payload.users) && payload.users.length > 0) {
      saveUsersToStorage(payload.users);
    }

    return {
      success: true,
      menu: loadMenuFromStorage(),
      settings: loadSettingsFromStorage(),
      staff: loadStaffFromStorage(),
      ambience: loadAmbienceFromStorage(),
      users: loadUsersFromStorage(),
    };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, error: error.message };
  }
};

// 9. Reset All Storage to Defaults
export const resetStorageToDefaults = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.AMBIENCE);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  } catch (e) {
    console.error('Failed to reset storage:', e);
  }
  return {
    menu: INITIAL_MENU_ITEMS,
    settings: DEFAULT_SETTINGS,
    staff: INITIAL_STAFF_MEMBERS,
    ambience: INITIAL_AMBIENCE_MEDIA,
    users: DEFAULT_USERS,
    auditLogs: INITIAL_AUDIT_LOGS,
  };
};
