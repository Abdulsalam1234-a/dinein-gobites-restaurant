import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SplashScreen } from './components/SplashScreen';
import { HeroBanner } from './components/HeroBanner';
import { DineInMenu } from './components/DineInMenu';
import { GoBitesMenu } from './components/GoBitesMenu';
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

  // 5. Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mode change handler that safely resets category
  const handleModeChange = (mode, shouldScroll = true) => {
    setActiveMode(mode);
    setSelectedCategory('all');
    if (shouldScroll) {
      scrollToSection('menu');
    }
  };

  // 6. Navigation helper
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

  // 7. Categories for Active Mode
  const categories = useMemo(() => {
    if (activeMode === 'dinein') {
      return [
        { id: 'all', name: 'All Dine-In Dishes', icon: '🍽️' },
        { id: 'swallow', name: 'Swallows & Soups', icon: '🥣' },
        { id: 'rice', name: 'Plates of Jollof & Ofada', icon: '🍛' },
        { id: 'spaghetti', name: 'Spaghetti & Pastas', icon: '🍝' },
        { id: 'catfish', name: 'Fresh Catfish Specials', icon: '🐟' },
        { id: 'panla', name: 'Crispy Panla Fish', icon: '🎣' },
        { id: 'protein', name: 'Beef, Chicken & Asun', icon: '🥩' },
        { id: 'plantain', name: 'Sweet Dodo & Gizdodo', icon: '🍌' },
      ];
    } else {
      // Go Bites Mode: STRICTLY NO SWALLOWS
      return [
        { id: 'all', name: 'All Go Bites', icon: '⚡' },
        { id: 'combo', name: 'Value Combos', icon: '📦' },
        { id: 'rice', name: 'Express Rice Boxes', icon: '🍛' },
        { id: 'spaghetti', name: 'Jollof Spaghetti', icon: '🍝' },
        { id: 'moimoi', name: 'Gourmet Moi Moi', icon: '🫔' },
        { id: 'snack', name: 'Pastries & Snacks', icon: '🥟' },
      ];
    }
  }, [activeMode]);

  // 8. Filtered Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Mode Check:
      // DineIn accepts 'dinein' and 'both'
      // Go Bites accepts 'gobites' and 'both' BUT STRICTLY EXCLUDES 'swallow'!
      if (activeMode === 'dinein') {
        if (item.channel !== 'dinein' && item.channel !== 'both') return false;
      } else {
        if (item.category === 'swallow') return false; // Rule: strictly NO swallows in Go Bites
        if (item.channel !== 'gobites' && item.channel !== 'both') return false;
      }

      // Category Filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'catfish') {
          if (item.category !== 'catfish') return false;
        } else if (selectedCategory === 'panla') {
          if (item.category !== 'panla') return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesCategory;
      }

      return true;
    });
  }, [menuItems, activeMode, selectedCategory, searchQuery]);

  // 9. Cart Actions
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

  // 10. WhatsApp Checkout Action
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

  // 11. Admin Updates
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

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-gold selection:text-navy-950">
      
      {/* 1. Header Navigation */}
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

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 2. Welcome Splash Screen */}
        <SplashScreen
          onSelectMode={handleModeChange}
          onExploreOverview={() => scrollToSection('outlets')}
        />

        {/* 3. Menu Section with Interactive Hero Banner */}
        <div id="menu" className="scroll-mt-20">
          <HeroBanner
            activeMode={activeMode}
            setActiveMode={handleModeChange}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            itemCount={filteredItems.length}
          />

          {/* Conditional Menu Rendering based on Mode */}
          {activeMode === 'dinein' ? (
            <DineInMenu
              items={filteredItems}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              currency={settings.currency}
            />
          ) : (
            <GoBitesMenu
              items={filteredItems}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              currency={settings.currency}
            />
          )}
        </div>

        {/* 4. Branches & Outlets Section */}
        <OutletsSection 
          whatsappNumber={settings.whatsappNumber} 
        />

        {/* 5. Frequently Asked Questions Section */}
        <FAQSection 
          whatsappNumber={settings.whatsappNumber} 
        />

      </main>

      {/* 6. Footer */}
      <Footer
        onNavigateSection={scrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* 7. Slide-over Cart Drawer */}
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
      />

      {/* 8. WhatsApp Order Confirmation Modal */}
      <WhatsAppOrderModal
        isOpen={Boolean(orderModalData)}
        onClose={() => setOrderModalData(null)}
        orderDetails={orderModalData}
      />

      {/* 9. Admin Dashboard Modal */}
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

      {/* 10. Floating Interactive Concierge Bot */}
      <ChatbotWidget
        _activeMode={activeMode}
        setActiveMode={handleModeChange}
        onOpenCart={() => setIsCartOpen(true)}
        whatsappNumber={settings.whatsappNumber}
      />

    </div>
  );
}
