import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const CONFIG_STORAGE_KEY = 'romee_firebase_config_v2';
const RESTAURANT_DOC_ID = 'romee_eatery_main';

/**
 * Retrieves Firebase configuration from environment variables (Vercel/Vite) or local storage
 */
export const getFirebaseConfig = () => {
  // 1. Check environment variables (Vite / Vercel)
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  // 2. Check in-app local storage config set by Admin in Dashboard
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse stored Firebase config:', err);
  }

  return null;
};

/**
 * Saves in-app Firebase configuration
 */
export const saveFirebaseConfig = (config) => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (err) {
    console.error('Error saving Firebase config:', err);
    return false;
  }
};

/**
 * Clears stored in-app Firebase configuration
 */
export const clearFirebaseConfig = () => {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
};

/**
 * Checks if Firebase is currently configured with valid credentials
 */
export const isFirebaseConfigured = () => {
  const config = getFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
};

/**
 * Initializes and returns the Firebase Firestore DB instance (or null)
 */
let dbInstance = null;

export const getFirestoreDb = () => {
  if (dbInstance) return dbInstance;

  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.error('Failed to initialize Firebase App:', err);
    return null;
  }
};

/**
 * Saves a restaurant document to Cloud Firestore
 * @param {'settings' | 'menu' | 'staff' | 'ambience' | 'users' | 'audit_logs'} sectionKey
 * @param {any} data
 */
export const saveToCloudFirestore = async (sectionKey, data) => {
  const db = getFirestoreDb();
  if (!db) {
    return { success: false, error: 'Firebase is not configured.' };
  }

  try {
    const docRef = doc(db, 'restaurants', RESTAURANT_DOC_ID, 'sections', sectionKey);
    await setDoc(docRef, {
      data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return { success: true };
  } catch (err) {
    console.error(`Firestore save error for section [${sectionKey}]:`, err);
    return { success: false, error: err.message };
  }
};

/**
 * Loads a restaurant document from Cloud Firestore once
 * @param {'settings' | 'menu' | 'staff' | 'ambience' | 'users' | 'audit_logs'} sectionKey
 */
export const loadFromCloudFirestore = async (sectionKey) => {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const docRef = doc(db, 'restaurants', RESTAURANT_DOC_ID, 'sections', sectionKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().data || null;
    }
    return null;
  } catch (err) {
    console.error(`Firestore load error for section [${sectionKey}]:`, err);
    return null;
  }
};

/**
 * Subscribes to real-time updates for a section
 * Whenever another device (e.g. mobile admin) modifies data, this callback fires on all active laptops/phones.
 */
export const subscribeToCloudSection = (sectionKey, onUpdate) => {
  const db = getFirestoreDb();
  if (!db) return () => {};

  try {
    const docRef = doc(db, 'restaurants', RESTAURANT_DOC_ID, 'sections', sectionKey);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const payload = docSnap.data();
        if (payload && payload.data) {
          onUpdate(payload.data);
        }
      }
    }, (error) => {
      console.warn(`Firestore real-time subscription error [${sectionKey}]:`, error);
    });

    return unsubscribe;
  } catch (err) {
    console.error(`Failed to setup subscription for [${sectionKey}]:`, err);
    return () => {};
  }
};

/**
 * Pushes all current local application state into Cloud Firestore
 */
export const pushAllDataToCloud = async ({ menu, settings, staff, ambience, users }) => {
  const db = getFirestoreDb();
  if (!db) {
    return { success: false, error: 'Cloud Database credentials are not configured.' };
  }

  try {
    const tasks = [];
    if (menu) tasks.push(saveToCloudFirestore('menu', menu));
    if (settings) tasks.push(saveToCloudFirestore('settings', settings));
    if (staff) tasks.push(saveToCloudFirestore('staff', staff));
    if (ambience) tasks.push(saveToCloudFirestore('ambience', ambience));
    if (users) tasks.push(saveToCloudFirestore('users', users));

    await Promise.all(tasks);
    return { success: true };
  } catch (err) {
    console.error('Failed to push all data to Firestore:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Pulls all sections from Cloud Firestore
 */
export const pullAllDataFromCloud = async () => {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const [menu, settings, staff, ambience, users] = await Promise.all([
      loadFromCloudFirestore('menu'),
      loadFromCloudFirestore('settings'),
      loadFromCloudFirestore('staff'),
      loadFromCloudFirestore('ambience'),
      loadFromCloudFirestore('users'),
    ]);

    return { menu, settings, staff, ambience, users };
  } catch (err) {
    console.error('Failed to pull all data from Firestore:', err);
    return null;
  }
};

/**
 * Initializes and returns Firebase Auth instance (or null)
 */
let authInstance = null;

export const getFirebaseAuth = () => {
  if (authInstance) return authInstance;

  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    authInstance = getAuth(app);
    return authInstance;
  } catch (err) {
    console.error('Failed to initialize Firebase Auth:', err);
    return null;
  }
};

/**
 * 1-Click Google Authentication for Customers
 */
export const signInWithGooglePopup = async () => {
  const auth = getFirebaseAuth();
  if (!auth) {
    return { success: false, error: 'Firebase is not configured yet. You can sign up using email & OTP verification.' };
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const customerProfile = {
      uid: user.uid,
      name: user.displayName || 'Customer',
      email: (user.email || '').toLowerCase(),
      phone: user.phoneNumber || '',
      avatar: user.photoURL || null,
      provider: 'google',
      isVerified: true,
      lastLoginAt: new Date().toISOString(),
    };

    // Save profile to Cloud Firestore
    await saveCustomerProfileToCloud(customerProfile);

    return { success: true, customer: customerProfile };
  } catch (err) {
    console.error('Google Sign-in error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Signs out customer from Firebase Auth
 */
export const signOutCustomerFromFirebase = async () => {
  const auth = getFirebaseAuth();
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (e) {
    console.error('Error signing out customer:', e);
  }
};

/**
 * Saves or updates customer profile in Cloud Firestore
 */
export const saveCustomerProfileToCloud = async (customer) => {
  const db = getFirestoreDb();
  if (!db || !customer || !customer.uid) return { success: false };

  try {
    const custRef = doc(db, 'customers', customer.uid);
    await setDoc(custRef, {
      ...customer,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('Error saving customer profile to cloud:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Saves a customer order to Cloud Firestore
 */
export const saveCustomerOrderToCloud = async (order) => {
  const db = getFirestoreDb();
  if (!db || !order || !order.id) return { success: false };

  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('Error saving customer order to cloud:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Subscribes to real-time orders for a customer
 */
export const subscribeToCustomerOrders = (customerUid, onUpdate) => {
  const db = getFirestoreDb();
  if (!db || !customerUid) return () => {};

  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef, 
      where('customerUid', '==', customerUid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = [];
      snapshot.forEach((docSnap) => {
        orders.push({ id: docSnap.id, ...docSnap.data() });
      });
      onUpdate(orders);
    }, (err) => {
      console.warn('Customer orders subscription warning:', err);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to setup customer orders subscription:', err);
    return () => {};
  }
};

