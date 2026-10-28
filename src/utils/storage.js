import { INITIAL_MENU_ITEMS } from '../data/initialMenu';
import { INITIAL_STAFF_MEMBERS } from '../data/initialStaff';
import { INITIAL_AMBIENCE_MEDIA } from '../data/initialAmbience';

const STORAGE_KEYS = {
  MENU: 'romee_gobite_menu_items_v2',
  SETTINGS: 'romee_gobite_settings_v2',
  STAFF: 'romee_gobite_staff_v2',
  AMBIENCE: 'romee_gobite_ambience_v2',
};

export const DEFAULT_SETTINGS = {
  whatsappNumber: '07068371295',
  currency: '₦',
  serviceChargeDineIn: 500,
  packagingFeeGoBites: 300,
  adminPin: '1234',
  restaurantName: 'ROMEE Go-Bite Eatery',
};

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

// 5. Reset All
export const resetStorageToDefaults = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.AMBIENCE);
  } catch (e) {
    console.error('Failed to reset storage:', e);
  }
  return {
    menu: INITIAL_MENU_ITEMS,
    settings: DEFAULT_SETTINGS,
    staff: INITIAL_STAFF_MEMBERS,
    ambience: INITIAL_AMBIENCE_MEDIA,
  };
};
