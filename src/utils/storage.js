import { INITIAL_MENU_ITEMS } from '../data/initialMenu';

const STORAGE_KEYS = {
  MENU: 'romee_gobite_menu_items_v2',
  SETTINGS: 'romee_gobite_settings_v2',
};

export const DEFAULT_SETTINGS = {
  whatsappNumber: '07068371295',
  currency: '₦',
  serviceChargeDineIn: 500,
  packagingFeeGoBites: 300,
  adminPin: '1234',
  restaurantName: 'ROMEE Go-Bite Eatery',
};

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

export const resetStorageToDefaults = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (e) {
    console.error('Failed to reset storage:', e);
  }
  return {
    menu: INITIAL_MENU_ITEMS,
    settings: DEFAULT_SETTINGS,
  };
};
