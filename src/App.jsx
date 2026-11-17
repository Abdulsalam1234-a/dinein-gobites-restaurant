import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Global Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ChatbotWidget } from './components/ChatbotWidget';
import { WelcomeModal } from './components/WelcomeModal';
import { ThemeAmbientEffects } from './components/ThemeAmbientEffects';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerAccountDrawer } from './components/CustomerAccountDrawer';
import { getActiveTheme } from './utils/theme';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MenuPage } from './pages/MenuPage';
import { GalleryPage } from './pages/GalleryPage';
import { OutletsPage } from './pages/OutletsPage';
import { FAQPage } from './pages/FAQPage';

// Data & Storage
import { 
  loadMenuFromStorage, 
  saveMenuToStorage, 
  loadSettingsFromStorage, 
  saveSettingsToStorage, 
  loadStaffFromStorage,
  saveStaffToStorage,
  loadAmbienceFromStorage,
  saveAmbienceToStorage,
  loadUsersFromStorage,
  saveUsersToStorage,
  loadAuditLogsFromStorage,
  saveAuditLogsToStorage,
  addAuditLog,
  resetStorageToDefaults,
  loadCurrentCustomer,
  saveCustomerOrderToStorage
} from './utils/storage';
import { 
  isFirebaseConfigured, 
  saveToCloudFirestore, 
  subscribeToCloudSection, 
  pullAllDataFromCloud,
  saveCustomerOrderToCloud
} from './utils/firebase';
import { compileWhatsAppOrder } from './utils/whatsapp';

export default function App() {
  // 1. Persistent State: Menu, Staff, Ambience Media, Settings, Users, Audit Logs
  const [menuItems, setMenuItems] = useState(loadMenuFromStorage);
  const [settings, setSettings] = useState(loadSettingsFromStorage);
  const [staffMembers, setStaffMembers] = useState(loadStaffFromStorage);
  const [ambienceMedia, setAmbienceMedia] = useState(loadAmbienceFromStorage);
  const [users, setUsers] = useState(loadUsersFromStorage);
  const [auditLogs, setAuditLogs] = useState(loadAuditLogsFromStorage);

  // 2. Active Dining Mode: 'dinein' | 'gobites'
  const [activeMode, setActiveMode] = useState('dinein');

  // Pre-selected table state from booking bar
  const [prefilledTable, setPrefilledTable] = useState('Table 1');

  // 3. Cart State: Array of items
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('romee_gobite_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('romee_gobite_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Global Real-time Cloud Database Synchronization
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    // 1. Initial Pull from Cloud
    pullAllDataFromCloud().then((cloudData) => {
      if (!cloudData) return;
      if (Array.isArray(cloudData.menu) && cloudData.menu.length > 0) {
        setMenuItems(cloudData.menu);
        saveMenuToStorage(cloudData.menu);
      }
      if (cloudData.settings && typeof cloudData.settings === 'object') {
        setSettings((prev) => {
          const merged = { ...prev, ...cloudData.settings };
          saveSettingsToStorage(merged);
          return merged;
        });
      }
      if (Array.isArray(cloudData.staff) && cloudData.staff.length > 0) {
        setStaffMembers(cloudData.staff);
        saveStaffToStorage(cloudData.staff);
      }
      if (Array.isArray(cloudData.ambience) && cloudData.ambience.length > 0) {
        setAmbienceMedia(cloudData.ambience);
        saveAmbienceToStorage(cloudData.ambience);
      }
      if (Array.isArray(cloudData.users) && cloudData.users.length > 0) {
        setUsers(cloudData.users);
        saveUsersToStorage(cloudData.users);
      }
    });

    // 2. Real-time Live Subscriptions (changes on mobile immediately reflect on laptop)
    const unsubMenu = subscribeToCloudSection('menu', (cloudMenu) => {
      if (Array.isArray(cloudMenu) && cloudMenu.length > 0) {
        setMenuItems(cloudMenu);
        saveMenuToStorage(cloudMenu);
      }
    });

    const unsubSettings = subscribeToCloudSection('settings', (cloudSettings) => {
      if (cloudSettings && typeof cloudSettings === 'object') {
        setSettings((prev) => {
          const merged = { ...prev, ...cloudSettings };
          saveSettingsToStorage(merged);
          return merged;
        });
      }
    });

    const unsubStaff = subscribeToCloudSection('staff', (cloudStaff) => {
      if (Array.isArray(cloudStaff) && cloudStaff.length > 0) {
        setStaffMembers(cloudStaff);
        saveStaffToStorage(cloudStaff);
      }
    });

    const unsubAmbience = subscribeToCloudSection('ambience', (cloudAmbience) => {
      if (Array.isArray(cloudAmbience) && cloudAmbience.length > 0) {
        setAmbienceMedia(cloudAmbience);
        saveAmbienceToStorage(cloudAmbience);
      }
    });

    const unsubUsers = subscribeToCloudSection('users', (cloudUsers) => {
      if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
        setUsers(cloudUsers);
        saveUsersToStorage(cloudUsers);
      }
    });

    return () => {
      unsubMenu();
      unsubSettings();
      unsubStaff();
      unsubAmbience();
      unsubUsers();
    };
  }, []);

  // 4. Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [orderModalData, setOrderModalData] = useState(null);

  // 4B. Customer Account & Authentication State
  const [currentCustomer, setCurrentCustomer] = useState(loadCurrentCustomer);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCustomerAccountOpen, setIsCustomerAccountOpen] = useState(false);

  // 5. Global Search
  const [searchQuery, setSearchQuery] = useState('');

  // 6. Cart Actions
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.selectedOption === item.selectedOption
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveCartItem = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // 1-Click Re-Order from Customer Account History
  const handleReOrder = (itemsToReOrder) => {
    if (!Array.isArray(itemsToReOrder)) return;
    itemsToReOrder.forEach((item) => {
      handleAddToCart(item);
    });
    setIsCartOpen(true);
  };

  // Cart Metrics
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 7. WhatsApp Checkout Action (with automatic customer order logging & cloud sync)
  const handleProceedToWhatsApp = ({ cart, mode, customerInfo, customer, totals }) => {
    const compiled = compileWhatsAppOrder({
      cart,
      mode,
      customerInfo,
      totals,
      whatsappNumber: settings.whatsappNumber,
      currency: settings.currency,
    });

    const activeUser = customer || currentCustomer;
    const orderRecord = {
      id: compiled.orderNumber || ('#ROM-' + Math.floor(10000 + Math.random() * 90000)),
      customerUid: activeUser ? activeUser.uid : 'guest',
      customer: activeUser ? {
        uid: activeUser.uid,
        name: activeUser.name,
        email: activeUser.email,
        phone: activeUser.phone,
      } : {
        uid: 'guest',
        name: customerInfo.name || 'Guest Customer',
        phone: customerInfo.phone || '',
        location: customerInfo.location || customerInfo.tableNumber || '',
      },
      mode,
      cart,
      customerInfo,
      totals,
      createdAt: new Date().toISOString(),
      status: 'whatsapp_confirmed',
    };

    // Save order to customer's order history in local storage
    saveCustomerOrderToStorage(orderRecord);

    // If Cloud Database is connected, automatically sync order to Cloud Firestore
    if (isFirebaseConfigured()) {
      saveCustomerOrderToCloud(orderRecord);
    }

    setOrderModalData({
      ...compiled,
      mode,
    });
    setIsCartOpen(false);
  };

  // 8. Admin Updates (Local Storage + Global Cloud Database Sync)
  const handleUpdateMenuItems = (newItems) => {
    setMenuItems(newItems);
    saveMenuToStorage(newItems);
    if (isFirebaseConfigured()) {
      saveToCloudFirestore('menu', newItems);
    }
  };

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
    if (isFirebaseConfigured()) {
      saveToCloudFirestore('settings', newSettings);
    }
  };

  const handleUpdateStaff = (newStaff) => {
    setStaffMembers(newStaff);
    saveStaffToStorage(newStaff);
    if (isFirebaseConfigured()) {
      saveToCloudFirestore('staff', newStaff);
    }
  };

  const handleUpdateAmbience = (newAmbience) => {
    setAmbienceMedia(newAmbience);
    saveAmbienceToStorage(newAmbience);
    if (isFirebaseConfigured()) {
      saveToCloudFirestore('ambience', newAmbience);
    }
  };

  const handleUpdateUsers = (newUsers) => {
    setUsers(newUsers);
    saveUsersToStorage(newUsers);
    if (isFirebaseConfigured()) {
      saveToCloudFirestore('users', newUsers);
    }
  };

  const handleAddAuditLog = (action, details, user) => {
    const { updatedLogs, newEntry } = addAuditLog(action, details, user);
    setAuditLogs(updatedLogs);
    return newEntry;
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    saveAuditLogsToStorage([]);
  };

  const handleResetDefaults = () => {
    const { 
      menu: defaultMenu, 
      settings: defaultSettings, 
      staff: defaultStaff, 
      ambience: defaultAmbience,
      users: defaultUsers,
      auditLogs: defaultLogs
    } = resetStorageToDefaults();
    setMenuItems(defaultMenu);
    setSettings(defaultSettings);
    setStaffMembers(defaultStaff);
    setAmbienceMedia(defaultAmbience);
    setUsers(defaultUsers);
    setAuditLogs(defaultLogs);
  };

  const activeThemeId = settings.theme || 'classic';
  const currentTheme = getActiveTheme(activeThemeId);

  // Synchronize active theme attribute to HTML and BODY elements
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeThemeId);
    document.body.setAttribute('data-theme', activeThemeId);
  }, [activeThemeId]);

  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* Floating Theme Particle Effects (Bats for Halloween, Snow for Christmas, Hearts for Valentine, etc.) */}
      <ThemeAmbientEffects themeId={activeThemeId} />

      <div 
        className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-mustard selection:text-petrol-950 transition-colors duration-500 relative"
        data-theme={activeThemeId}
      >
        
        {/* Seasonal Theme Celebration Banner */}
        {currentTheme.bannerText && (
          <div 
            className="py-2 px-4 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 select-none shadow-sm transition-colors duration-500"
            style={{
              backgroundColor: 'var(--theme-banner-bg)',
              color: 'var(--theme-banner-text)',
              borderBottom: '1px solid var(--color-card-border)',
            }}
          >
            <span className="text-base">{currentTheme.icon}</span>
            <span>{currentTheme.bannerText}</span>
          </div>
        )}

        {/* Navigation Bar across all pages */}
        <Navbar
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currency={settings.currency}
          whatsappNumber={settings.whatsappNumber}
          currentCustomer={currentCustomer}
          onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
          onOpenCustomerAccount={() => setIsCustomerAccountOpen(true)}
        />

        {/* Dynamic Multi-Page Routes */}
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage
                  menuItems={menuItems}
                  onAddToCart={handleAddToCart}
                  currency={settings.currency}
                  activeMode={activeMode}
                  setActiveMode={setActiveMode}
                  onSelectTable={(table) => setPrefilledTable(table)}
                  whatsappNumber={settings.whatsappNumber}
                  ambienceMedia={ambienceMedia}
                  settings={settings}
                />
              } 
            />

            <Route 
              path="/about" 
              element={
                <AboutPage 
                  staffMembers={staffMembers}
                />
              } 
            />

            <Route 
              path="/menu" 
              element={
                <MenuPage
                  menuItems={menuItems}
                  activeMode={activeMode}
                  setActiveMode={setActiveMode}
                  onAddToCart={handleAddToCart}
                  currency={settings.currency}
                  cartCount={cartCount}
                  cartTotal={cartTotal}
                  onOpenCart={() => setIsCartOpen(true)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              } 
            />

            <Route 
              path="/gallery" 
              element={
                <GalleryPage 
                  ambienceMedia={ambienceMedia}
                />
              } 
            />

            <Route 
              path="/outlets" 
              element={
                <OutletsPage 
                  settings={settings}
                />
              } 
            />

            <Route 
              path="/faqs" 
              element={
                <FAQPage 
                  whatsappNumber={settings.whatsappNumber}
                />
              } 
            />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer
          onOpenAdmin={() => setIsAdminOpen(true)}
          settings={settings}
        />

        {/* Welcome Announcement Pop-up Modal */}
        <WelcomeModal settings={settings} />

        {/* Slide-over Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onProceedToWhatsApp={handleProceedToWhatsApp}
          currency={settings.currency}
          serviceChargeDineIn={settings.serviceChargeDineIn}
          packagingFeeGoBites={settings.packagingFeeGoBites}
          prefilledTable={prefilledTable}
          currentCustomer={currentCustomer}
          onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
        />

        {/* Public Customer Authentication Modal (Google 1-Click + Email & 6-Digit OTP) */}
        <CustomerAuthModal
          isOpen={isCustomerAuthOpen}
          onClose={() => setIsCustomerAuthOpen(false)}
          onSuccess={(cust) => {
            setCurrentCustomer(cust);
            setIsCustomerAuthOpen(false);
          }}
          whatsappNumber={settings.whatsappNumber}
        />

        {/* Customer Account & Order History Drawer */}
        <CustomerAccountDrawer
          isOpen={isCustomerAccountOpen}
          onClose={() => setIsCustomerAccountOpen(false)}
          customer={currentCustomer}
          onLogout={() => setCurrentCustomer(null)}
          onReOrder={handleReOrder}
          currency={settings.currency}
          onNavigateMenu={() => {
            window.location.href = '/menu';
          }}
        />

        {/* WhatsApp Order Confirmation Modal */}
        <WhatsAppOrderModal
          isOpen={Boolean(orderModalData)}
          onClose={() => setOrderModalData(null)}
          orderDetails={orderModalData}
        />

        {/* Admin Dashboard Modal */}
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          menuItems={menuItems}
          onUpdateMenuItems={handleUpdateMenuItems}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetDefaults={handleResetDefaults}
          currency={settings.currency}
          staffMembers={staffMembers}
          onUpdateStaff={handleUpdateStaff}
          ambienceMedia={ambienceMedia}
          onUpdateAmbience={handleUpdateAmbience}
          users={users}
          onUpdateUsers={handleUpdateUsers}
          auditLogs={auditLogs}
          onAddAuditLog={handleAddAuditLog}
          onClearAuditLogs={handleClearAuditLogs}
        />

        {/* Floating Concierge Chatbot */}
        <ChatbotWidget
          _activeMode={activeMode}
          setActiveMode={setActiveMode}
          onOpenCart={() => setIsCartOpen(true)}
          whatsappNumber={settings.whatsappNumber}
          settings={settings}
        />

      </div>
    </BrowserRouter>
  );
}
