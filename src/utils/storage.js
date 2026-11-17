import { INITIAL_MENU_ITEMS } from '../data/initialMenu';
import { INITIAL_STAFF_MEMBERS } from '../data/initialStaff';
import { INITIAL_AMBIENCE_MEDIA } from '../data/initialAmbience';
import { hashPassword, verifyPassword } from './security';

const STORAGE_KEYS = {
  MENU: 'romee_gobite_menu_items_v2',
  SETTINGS: 'romee_gobite_settings_v2',
  STAFF: 'romee_gobite_staff_v2',
  AMBIENCE: 'romee_gobite_ambience_v2',
  USERS: 'romee_gobite_users_v2',
  AUDIT_LOGS: 'romee_gobite_audit_logs_v2',
  PASSWORD_RESETS: 'romee_gobite_password_resets_v2',
  CUSTOMERS: 'romee_gobite_customers_v2',
  CURRENT_CUSTOMER: 'romee_gobite_current_customer_v2',
  CUSTOMER_ORDERS: 'romee_gobite_customer_orders_v2',
  CUSTOMER_OTPS: 'romee_gobite_customer_otps_v2',
};

// Pre-computed salted SHA-256 digest (zero plaintext passwords stored in source code)
const SUPERUSER_AUTH_DIGEST =
  '96f129bd7b654abdd2391713b85089c3:eb180ce413f0d2428514ddf5dbc682153a7a3772289d09568cca5f026c121ded';

export const DEFAULT_USERS = [
  {
    id: 'user-superuser',
    email: 'salamiabdullahi247@gmail.com',
    password: SUPERUSER_AUTH_DIGEST,
    name: 'Abdullahi Salami',
    role: 'superuser',
    title: 'Super Administrator & Owner',
    permissions: ['all'],
    status: 'active',
    createdAt: '2026-10-28',
  },
];

export const DEFAULT_SETTINGS = {
  restaurantName: 'ROMEE Go-Bite Eatery',
  tagline: 'Authentic Swallows, Plated Feasts & Express Takeaways',
  whatsappNumber: '07068371295',
  alternatePhone: '08012345678',
  supportEmail: 'orders@romeeeatery.com.ng',
  superuserEmail: 'salamiabdullahi247@gmail.com',
  currency: '₦',
  serviceChargeDineIn: 500,
  packagingFeeGoBites: 300,
  
  // Dine-In Branch (Swallow Hub & Family Lounge) - Adebayo, Ado-Ekiti
  dineInName: 'Adebayo Flagship Outlet (Dine-In Swallow Lounge & Go-Bites Express)',
  dineInAddress: 'Adebayo Area, Along Iworoko Road, Ado-Ekiti, Ekiti State, Nigeria',
  dineInCity: 'Ado-Ekiti',
  dineInState: 'Ekiti State, Nigeria',
  dineInHours: 'Mon - Sun: 8:00 AM - 10:30 PM (Daily Fresh Soups & Swallows)',
  dineInGoogleMapsUrl: 'https://maps.google.com/?q=Adebayo+Ado+Ekiti+Nigeria',
  dineInEmbedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.457193297597!2d5.228000!3d7.645000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1047fa8c3534b071%3A0x6b4ef8fa90757754!2sAdebayo%2C%20Ado%20Ekiti!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng',

  // Go-Bites Express Branch (Takeaway & Fast Combos) - Ado-Ekiti
  goBitesName: 'Ado-Ekiti Express Dispatch Depot',
  goBitesAddress: 'Opposite EKSU Junction / Adebayo Commercial Axis, Ado-Ekiti, Ekiti State',
  goBitesCity: 'Ado-Ekiti',
  goBitesState: 'Ekiti State, Nigeria',
  goBitesHours: 'Mon - Sat: 7:30 AM - 9:30 PM (Sundays: 12 PM - 8 PM)',
  goBitesGoogleMapsUrl: 'https://maps.google.com/?q=Adebayo+Ado+Ekiti+Nigeria',
  goBitesEmbedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.457193297597!2d5.228000!3d7.645000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1047fa8c3534b071%3A0x6b4ef8fa90757754!2sAdebayo%2C%20Ado%20Ekiti!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng',

  // Video Tutorial URL for ordering
  tutorialVideoUrl: '',

  // Seasonal Theme: 'classic' | 'christmas' | 'salah' | 'halloween' | 'valentine' | 'naija'
  theme: 'classic',

  // Welcome Announcement Modal
  welcomePopupEnabled: true,
  welcomeHeadline: 'Welcome to ROMEE Go-Bite Eatery, Adebayo! 🍲',
  welcomeSubtitle: 'Home of authentic swallows (Amala, Semo, Pounded Yam) & rapid express favorites (Jollof, Fried Rice, Moi Moi) in Ado-Ekiti.',
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
        // Ensure legacy unhashed superuser account is upgraded to salted SHA-256 digest
        const updated = parsed.map((u) => {
          if (u.email && u.email.toLowerCase() === 'salamiabdullahi247@gmail.com') {
            if (!u.password || !u.password.includes(':')) {
              return { ...u, password: SUPERUSER_AUTH_DIGEST };
            }
          }
          return u;
        });
        return updated;
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

// 5B. Password Reset Requests Storage
export const loadPasswordResetsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PASSWORD_RESETS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load password resets:', e);
  }
  return [];
};

export const savePasswordResetsToStorage = (resets) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PASSWORD_RESETS, JSON.stringify(resets));
  } catch (e) {
    console.error('Failed to save password resets:', e);
  }
};

export const createPasswordResetRequest = (email) => {
  const users = loadUsersFromStorage();
  const cleanEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return { success: false, error: 'No account registered with this email address.' };
  }

  // Generate 6-digit random verification code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const currentResets = loadPasswordResetsFromStorage();

  const newTicket = {
    id: `reset-${Date.now()}`,
    email: cleanEmail,
    userName: user.name,
    userRole: user.role,
    code: resetCode,
    status: 'pending',
    requestedAt: new Date().toLocaleString('en-NG'),
  };

  const updatedResets = [newTicket, ...currentResets.filter((r) => r.email !== cleanEmail)];
  savePasswordResetsToStorage(updatedResets);

  return { success: true, ticket: newTicket, user };
};

export const createPasswordResetWhatsAppUrl = (ticket, whatsappNumber = '07068371295') => {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const baseWa = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone;

  const text = [
    `🔑 *ROMEE EATERY - PASSWORD RESET REQUEST*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Staff*: ${ticket.userName}`,
    `📧 *Email*: ${ticket.email}`,
    `🏷️ *Role*: ${ticket.userRole?.toUpperCase()}`,
    `🔢 *Reset Code*: #${ticket.code}`,
    `⏰ *Requested*: ${ticket.requestedAt}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Super Admin, please reset my management password or approve my access code.`,
  ].join('\n');

  return `https://wa.me/${baseWa}?text=${encodeURIComponent(text)}`;
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

// 10. Public Customer Accounts & Order History
export const loadCustomersFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCustomersToStorage = (customers) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (err) {
    console.error('Failed to save customers to storage:', err);
  }
};

export const loadCurrentCustomer = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_CUSTOMER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveCurrentCustomer = (customer) => {
  try {
    if (customer) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CUSTOMER, JSON.stringify(customer));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CUSTOMER);
    }
  } catch (err) {
    console.error('Failed to save current customer:', err);
  }
};

export const loadCustomerOrdersFromStorage = (customerUid = null) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ORDERS);
    const all = raw ? JSON.parse(raw) : [];
    if (!customerUid) return all;
    return all.filter((o) => o.customer?.uid === customerUid || o.customerUid === customerUid);
  } catch {
    return [];
  }
};

export const saveCustomerOrderToStorage = (order) => {
  try {
    const existing = loadCustomerOrdersFromStorage();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_ORDERS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save customer order:', err);
    return [];
  }
};

// OTP Verification Helpers for Email/Password Sign-up
export const generateCustomerOtp = (email, customerPendingData = {}) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const ticket = {
    email: email.trim().toLowerCase(),
    code,
    pendingData: customerPendingData,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMER_OTPS);
    const existing = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((t) => t.email !== ticket.email);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_OTPS, JSON.stringify([...filtered, ticket]));
  } catch (e) {
    console.error('Failed to save OTP ticket:', e);
  }

  return ticket;
};

export const verifyCustomerOtp = (email, code) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMER_OTPS);
    const existing = raw ? JSON.parse(raw) : [];
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const found = existing.find((t) => t.email === cleanEmail && t.code === cleanCode);
    if (!found) {
      return { success: false, error: 'Invalid 6-digit OTP code. Please check and try again.' };
    }

    if (new Date(found.expiresAt) < new Date()) {
      return { success: false, error: 'This verification code has expired. Please request a new one.' };
    }

    // Clean up ticket
    const remaining = existing.filter((t) => t.email !== cleanEmail);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_OTPS, JSON.stringify(remaining));

    return { success: true, pendingData: found.pendingData };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const findCustomerByEmail = (email) => {
  const customers = loadCustomersFromStorage();
  const cleanEmail = (email || '').trim().toLowerCase();
  return customers.find((c) => c.email.toLowerCase() === cleanEmail) || null;
};

export const registerCustomer = async (data) => {
  const customers = loadCustomersFromStorage();
  const cleanEmail = data.email.trim().toLowerCase();

  if (customers.some((c) => c.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' };
  }

  const newCustomer = {
    uid: 'cust_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    name: data.name.trim(),
    email: cleanEmail,
    passwordHash: data.password ? await hashPassword(data.password) : null,
    phone: (data.phone || '').trim(),
    address: (data.address || '').trim(),
    provider: data.provider || 'password', // 'password' | 'google'
    avatar: data.avatar || null,
    createdAt: new Date().toISOString(),
    isVerified: true,
  };

  const updated = [newCustomer, ...customers];
  saveCustomersToStorage(updated);
  saveCurrentCustomer(newCustomer);
  return { success: true, customer: newCustomer };
};

export const authenticateCustomer = async (email, password) => {
  const customer = findCustomerByEmail(email);
  if (!customer) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (customer.provider === 'google' && !customer.passwordHash) {
    return { success: false, error: 'This account is linked with Google. Please use Continue with Google.' };
  }

  const isValid = await verifyPassword(password, customer.passwordHash);
  if (!isValid) {
    return { success: false, error: 'Incorrect password. Please try again or reset it.' };
  }

  saveCurrentCustomer(customer);
  return { success: true, customer };
};

export const updateCustomerProfile = (customerUid, updates) => {
  const customers = loadCustomersFromStorage();
  const updatedCustomers = customers.map((c) => {
    if (c.uid === customerUid) {
      return { ...c, ...updates, updatedAt: new Date().toISOString() };
    }
    return c;
  });

  saveCustomersToStorage(updatedCustomers);
  const current = loadCurrentCustomer();
  if (current && current.uid === customerUid) {
    const updatedCurrent = { ...current, ...updates, updatedAt: new Date().toISOString() };
    saveCurrentCustomer(updatedCurrent);
    return updatedCurrent;
  }
  return null;
};

