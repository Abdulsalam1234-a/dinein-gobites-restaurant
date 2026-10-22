import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BookTableBar } from './components/BookTableBar';
import { PopularDishesSection } from './components/PopularDishesSection';
import { RegularMenuSection } from './components/RegularMenuSection';
import { MobileAppPromo } from './components/MobileAppPromo';
import { OutletsSection } from './components/OutletsSection';
import { FAQSection } from './components/FAQSection';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Footer } from './components/Footer';

import { 
  loadMenuFromStorage, 
  saveMenuToStorage, 
  loadSettingsFromStorage, 
  saveSettingsToStorage, 
  resetStorageToDefaults 
} from './utils/storage';
import { compileWhatsAppOrder } from './utils/whatsapp';

export default function App() {
  // 1. Persistent State: Menu & Settings
  const [menuItems, setMenuItems] = useState(loadMenuFromStorage);
  const [settings, setSettings] = useState(loadSettingsFromStorage);

  // 2. Active Mode: 'dinein' | 'gobites'
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

  // 5. Search
  const [searchQuery, setSearchQuery] = useState('');

  // Mode change handler
  const handleModeChange = (mode, shouldScroll = true) => {
    setActiveMode(mode);
    if (shouldScroll) {
      scrollToSection('regular-menu');
    }
  };

  // Navigation helper
  const scrollToSection = (sectionId) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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

  const handleResetDefaults = () => {
    const { menu: defaultMenu, settings: defaultSettings } = resetStorageToDefaults();
    setMenuItems(defaultMenu);
    setSettings(defaultSettings);
  };

  // Filtered Items for search if applicable
  const displayItems = searchQuery.trim()
    ? menuItems.filter((item) => {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || 
               item.description.toLowerCase().includes(q) || 
               item.category.toLowerCase().includes(q);
      })
    : menuItems;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex flex-col font-sans selection:bg-mustard selection:text-petrol-950">
      
      {/* 1. Header Navigation - Matching top of reference image */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={handleModeChange}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currency={settings.currency}
        whatsappNumber={settings.whatsappNumber}
        onNavigateSection={scrollToSection}
      />

      <main className="flex-1">
        
        {/* 2. Hero Section: "We serve the taste you love" with curved bottom & concentric halo circular plate */}
        <HeroSection
          onExploreFood={() => scrollToSection('regular-menu')}
          onOpenWhatsAppGuide={() => scrollToSection('mobile-promo')}
        />

        {/* 3. Floating Overlapping "Book A Table & Seated Orders" card */}
        <BookTableBar
          activeMode={activeMode}
          setActiveMode={handleModeChange}
          onSelectTable={(table) => setPrefilledTable(table)}
          onExploreMenu={() => scrollToSection('regular-menu')}
        />

        {/* 4. "Our Popular Dishes" - 3 Circular plate cards with carousel arrows */}
        <PopularDishesSection
          items={displayItems}
          onAddToCart={handleAddToCart}
          currency={settings.currency}
        />

        {/* 5. "Our Regular Menu" - Two panoramic photos & two-column dotted leader menu list */}
        <RegularMenuSection
          menuItems={displayItems}
          activeMode={activeMode}
          setActiveMode={handleModeChange}
          onAddToCart={handleAddToCart}
          currency={settings.currency}
        />

        {/* 6. "Download Our Mobile App / Order on WhatsApp" Yellow Promo Card & Smartphone Mockup */}
        <div id="mobile-promo">
          <MobileAppPromo 
            whatsappNumber={settings.whatsappNumber} 
          />
        </div>

        {/* 7. Outlets & Physical Branches Section */}
        <OutletsSection 
          whatsappNumber={settings.whatsappNumber} 
        />

        {/* 8. Frequently Asked Questions Section */}
        <FAQSection 
          whatsappNumber={settings.whatsappNumber} 
        />

      </main>

      {/* 9. Dark Slate/Navy Footer with Newsletter & Instagram Photos Grid */}
      <Footer
        onNavigateSection={scrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        activeMode={activeMode}
        setActiveMode={(m) => handleModeChange(m, false)}
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
      />

      {/* Floating Interactive Concierge Bot */}
      <ChatbotWidget
        _activeMode={activeMode}
        setActiveMode={handleModeChange}
        onOpenCart={() => setIsCartOpen(true)}
        whatsappNumber={settings.whatsappNumber}
      />

    </div>
  );
}
