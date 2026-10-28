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
  resetStorageToDefaults 
} from './utils/storage';
import { compileWhatsAppOrder } from './utils/whatsapp';

export default function App() {
  // 1. Persistent State: Menu, Staff, Ambience Media, Settings
  const [menuItems, setMenuItems] = useState(loadMenuFromStorage);
  const [settings, setSettings] = useState(loadSettingsFromStorage);
  const [staffMembers, setStaffMembers] = useState(loadStaffFromStorage);
  const [ambienceMedia, setAmbienceMedia] = useState(loadAmbienceFromStorage);

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

  // 4. Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [orderModalData, setOrderModalData] = useState(null);

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

  // Cart Metrics
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 7. WhatsApp Checkout Action
  const handleProceedToWhatsApp = ({ cart, mode, customerInfo, totals }) => {
    const compiled = compileWhatsAppOrder({
      cart,
      mode,
      customerInfo,
      totals,
      whatsappNumber: settings.whatsappNumber,
      currency: settings.currency,
    });

    setOrderModalData({
      ...compiled,
      mode,
    });
    setIsCartOpen(false);
  };

  // 8. Admin Updates
  const handleUpdateMenuItems = (newItems) => {
    setMenuItems(newItems);
    saveMenuToStorage(newItems);
  };

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
  };

  const handleUpdateStaff = (newStaff) => {
    setStaffMembers(newStaff);
    saveStaffToStorage(newStaff);
  };

  const handleUpdateAmbience = (newAmbience) => {
    setAmbienceMedia(newAmbience);
    saveAmbienceToStorage(newAmbience);
  };

  const handleResetDefaults = () => {
    const { menu: defaultMenu, settings: defaultSettings, staff: defaultStaff, ambience: defaultAmbience } = resetStorageToDefaults();
    setMenuItems(defaultMenu);
    setSettings(defaultSettings);
    setStaffMembers(defaultStaff);
    setAmbienceMedia(defaultAmbience);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex flex-col font-sans selection:bg-mustard selection:text-petrol-950">
        
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
                  whatsappNumber={settings.whatsappNumber}
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
          whatsappNumber={settings.whatsappNumber}
        />

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
        />

        {/* Floating Concierge Chatbot */}
        <ChatbotWidget
          _activeMode={activeMode}
          setActiveMode={setActiveMode}
          onOpenCart={() => setIsCartOpen(true)}
          whatsappNumber={settings.whatsappNumber}
        />

      </div>
    </BrowserRouter>
  );
}
