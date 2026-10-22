import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCcw, 
  Settings, 
  DollarSign, 
  UtensilsCrossed, 
  Save,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

export const AdminDashboard = ({
  isOpen,
  onClose,
  menuItems,
  onUpdateMenuItems,
  settings,
  onUpdateSettings,
  onResetDefaults,
  currency = '₦',
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'pricing' | 'settings'

  // Product Filter
  const [filterChannel, setFilterChannel] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Editing / Adding Product Modal
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Image upload vs URL state
  const [imageSourceMode, setImageSourceMode] = useState('upload'); // 'upload' | 'url'
  const [currentImageValue, setCurrentImageValue] = useState('');

  // Quick Price Editor state
  const [priceFormState, setPriceFormState] = useState({});
  const [priceSaveNotice, setPriceSaveNotice] = useState(false);

  // Settings State
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAddingNew(true);
    setCurrentImageValue('');
    setImageSourceMode('upload');
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setCurrentImageValue(item.image || '');
    setImageSourceMode(item.image?.startsWith('data:') ? 'upload' : 'url');
  };

  // Handle Image File Upload with client-side canvas compression
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-quality compressed Base64 JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setCurrentImageValue(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Toggle item in-stock status
  const handleToggleStock = (itemId) => {
    const updated = menuItems.map((item) => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    onUpdateMenuItems(updated);
  };

  // Delete product
  const handleDeleteProduct = (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      const updated = menuItems.filter((i) => i.id !== itemId);
      onUpdateMenuItems(updated);
    }
  };

  // Save product changes (Edit or New)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Choose image: either currentImageValue (uploaded or edited), or input field, or default
    const finalImage = currentImageValue || 
                       formData.get('image') || 
                       'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

    const productData = {
      id: editingItem?.id || `custom-${Date.now()}`,
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      category: formData.get('category'),
      channel: formData.get('channel'),
      image: finalImage,
      isAvailable: formData.get('isAvailable') === 'on',
      isSpicy: formData.get('isSpicy') === 'on',
      prepTime: formData.get('prepTime') || '15 mins',
      badge: formData.get('badge') || '',
    };

    let updated;
    if (isAddingNew) {
      updated = [productData, ...menuItems];
    } else {
      updated = menuItems.map((item) => (item.id === productData.id ? productData : item));
    }

    onUpdateMenuItems(updated);
    setEditingItem(null);
    setIsAddingNew(false);
  };

  // Quick price save
  const handleSaveQuickPrices = () => {
    const updated = menuItems.map((item) => {
      if (priceFormState[item.id] !== undefined) {
        return { ...item, price: Number(priceFormState[item.id]) };
      }
      return item;
    });
    onUpdateMenuItems(updated);
    setPriceSaveNotice(true);
    setTimeout(() => setPriceSaveNotice(false), 2500);
  };

  // Save settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 2500);
  };

  // Filtered Items for product list
  const filteredItems = menuItems.filter((item) => {
    const matchesChannel = 
      filterChannel === 'all' 
        ? true 
        : filterChannel === 'both'
        ? item.channel === 'both'
        : item.channel === filterChannel || item.channel === 'both';
    
    const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-navy-950/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-navy-900 border border-gold/40 rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-gold/20 flex items-center justify-between bg-navy-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
              {isAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                ROMEE Go-Bite Admin Portal
              </h2>
              <p className="text-xs text-gold">
                Product Catalog, Image Upload, Stock Toggles & Live Pricing Controls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        {!isAuthenticated ? (
          /* Authentication Form */
          <div className="p-8 sm:p-12 text-center max-w-sm mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-navy-950 border border-gold/30 flex items-center justify-center mx-auto text-gold">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-white mb-1">
                Manager Passcode Required
              </h3>
              <p className="text-xs text-slate-400">
                Enter your admin PIN to manage menu products, upload food photos, or adjust prices. (Default PIN: <strong className="text-gold">1234</strong>)
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={8}
                placeholder="Enter PIN (e.g. 1234)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full bg-navy-950 border border-gold/40 rounded-2xl py-3 px-4 text-center text-xl font-bold tracking-widest text-gold focus:outline-none focus:border-gold"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-red-400">
                  Incorrect PIN. Please try again or use default: 1234
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-full gold-gradient-btn font-bold text-xs uppercase tracking-wider"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-gold/15 bg-navy-950/40">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'products'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Product Catalog ({menuItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'pricing'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Quick Price Editor</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>WhatsApp & Settings</span>
              </button>
            </div>

            {/* TAB 1: PRODUCT CATALOG */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      placeholder="Search items or category..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="bg-navy-950 border border-gold/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 w-48 sm:w-60 focus:outline-none"
                    />

                    <select
                      value={filterChannel}
                      onChange={(e) => setFilterChannel(e.target.value)}
                      className="bg-navy-950 border border-gold/25 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="all">All Channels</option>
                      <option value="dinein">Dine-In Lounge Only</option>
                      <option value="gobites">Go Bites Express Only</option>
                      <option value="both">Both Channels</option>
                    </select>
                  </div>

                  <button
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full gold-gradient-btn text-xs font-bold self-start sm:self-auto shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Dish</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-2.5">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-navy-950/70 border border-gold/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gold/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gold/20"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 capitalize">
                              {item.channel}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize">
                              • {item.category}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gold-200 mt-0.5">
                            {currency}{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Controls: Stock Toggle, Edit, Delete */}
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <button
                          onClick={() => handleToggleStock(item.id)}
                          className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                            item.isAvailable
                              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                              : 'bg-red-950 border border-red-500/40 text-red-300'
                          }`}
                          title="Click to toggle available vs sold-out"
                        >
                          {item.isAvailable ? 'In Stock ✓' : 'Sold Out ✕'}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-300 hover:text-gold rounded-lg hover:bg-navy-800"
                          title="Edit details & photo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-navy-800"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 2: QUICK PRICE EDITOR */}
            {activeTab === 'pricing' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gold/15">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Bulk Menu Price Editor
                    </h3>
                    <p className="text-xs text-slate-400">
                      Update prices directly. Changes will reflect instantly on customer plates.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleSaveQuickPrices}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full gold-gradient-btn text-xs font-bold shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save All Prices</span>
                  </button>
                </div>

                {priceSaveNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
                    ✓ All menu prices have been updated and saved!
                  </div>
                )}

                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-navy-950/70 border border-gold/15 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <span className="text-[10px] text-slate-400 capitalize">{item.channel} • {item.category}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gold font-bold">{currency}</span>
                        <input
                          type="number"
                          defaultValue={item.price}
                          onChange={(e) => {
                            setPriceFormState((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }));
                          }}
                          className="w-28 bg-navy-900 border border-gold/30 rounded-lg px-2.5 py-1 text-xs text-white font-bold text-right focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SETTINGS & WHATSAPP */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-5 max-w-xl mx-auto w-full space-y-6">
                
                {settingsSavedNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
                    ✓ Settings saved successfully!
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Kitchen WhatsApp Phone Number (Receives Compiled Orders)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                      placeholder="07068371295"
                      required
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Currently set to: <strong className="text-gold">{settingsForm.whatsappNumber}</strong> (Order messages will redirect directly here).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Dine-In Service Charge ({currency})
                      </label>
                      <input
                        type="number"
                        value={settingsForm.serviceChargeDineIn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, serviceChargeDineIn: Number(e.target.value) })}
                        className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Go Bites Packaging Fee ({currency})
                      </label>
                      <input
                        type="number"
                        value={settingsForm.packagingFeeGoBites}
                        onChange={(e) => setSettingsForm({ ...settingsForm, packagingFeeGoBites: Number(e.target.value) })}
                        className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Admin Passcode (PIN)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.adminPin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                      className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full gold-gradient-btn font-bold text-xs uppercase tracking-wider"
                  >
                    Save All Settings
                  </button>
                </form>

                {/* Reset to defaults */}
                <div className="pt-6 border-t border-gold/15 text-center">
                  <p className="text-xs text-slate-400 mb-3">
                    Need to restore the initial dishes, combos, and preset pricing?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset all menu items and settings to factory defaults?')) {
                        onResetDefaults();
                        alert('Reset complete!');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-bold hover:bg-red-900/60 transition-colors"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Reset Database to Defaults</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* MODAL: ADD / EDIT PRODUCT WITH DUAL IMAGE OPTIONS */}
        {(isAddingNew || editingItem) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md">
            <div className="bg-navy-900 border border-gold/40 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gold/20">
                <h3 className="font-serif text-lg font-bold text-white">
                  {isAddingNew ? 'Add New Dish to Menu' : `Edit: ${editingItem.name}`}
                </h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingNew(false);
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dish Name *</label>
                  <input
                    name="name"
                    defaultValue={editingItem?.name || ''}
                    required
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={editingItem?.description || ''}
                    required
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Price ({currency}) *</label>
                    <input
                      name="price"
                      type="number"
                      defaultValue={editingItem?.price || 4000}
                      required
                      className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category || 'rice'}
                      className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                    >
                      <option value="swallow">Swallow</option>
                      <option value="rice">Rice Plates / Boxes</option>
                      <option value="spaghetti">Spaghetti</option>
                      <option value="catfish">Catfish</option>
                      <option value="panla">Panla Fish</option>
                      <option value="protein">Proteins</option>
                      <option value="plantain">Plantain & Sides</option>
                      <option value="combo">Combo Box (Go Bites)</option>
                      <option value="moimoi">Moi Moi</option>
                      <option value="snack">Snacks</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Channel Outlet *</label>
                    <select
                      name="channel"
                      defaultValue={editingItem?.channel || 'both'}
                      className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                    >
                      <option value="both">Both (Dine-In & Go Bites)</option>
                      <option value="dinein">Dine-In Lounge Only</option>
                      <option value="gobites">Go Bites Express Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Badge (e.g. Top Seller)</label>
                    <input
                      name="badge"
                      defaultValue={editingItem?.badge || ''}
                      placeholder="Chef's Special"
                      className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* DUAL FOOD IMAGE CONTROLS: FILE UPLOAD + URL */}
                <div className="pt-2 border-t border-gold/15">
                  <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                    <span>Food Dish Image *</span>
                    <div className="flex items-center gap-1 bg-navy-950 p-0.5 rounded-lg border border-gold/30">
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('upload')}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                          imageSourceMode === 'upload' 
                            ? 'bg-gold text-navy-950' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Upload className="w-2.5 h-2.5" />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('url')}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                          imageSourceMode === 'url' 
                            ? 'bg-gold text-navy-950' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <LinkIcon className="w-2.5 h-2.5" />
                        <span>Web URL</span>
                      </button>
                    </div>
                  </label>

                  {imageSourceMode === 'upload' ? (
                    <div className="space-y-2">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gold/30 hover:border-gold/60 rounded-2xl p-4 cursor-pointer bg-navy-950/70 transition-colors">
                        <Upload className="w-6 h-6 text-gold mb-1" />
                        <span className="text-xs font-bold text-white">Click to Select Dish Photo</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, WEBP (Auto-compressed)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <input
                        name="image"
                        value={currentImageValue.startsWith('data:') ? '' : currentImageValue}
                        onChange={(e) => setCurrentImageValue(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                  )}

                  {/* Image Live Preview */}
                  {currentImageValue && (
                    <div className="mt-2.5 p-2 rounded-xl bg-navy-950 border border-gold/25 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentImageValue}
                          alt="Preview"
                          className="w-12 h-12 rounded-lg object-cover border border-gold/40"
                        />
                        <div>
                          <span className="text-[11px] font-bold text-white block">Active Dish Photo</span>
                          <span className="text-[9px] text-emerald-400">
                            {currentImageValue.startsWith('data:') ? 'Uploaded from device ✓' : 'External Web URL ✓'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentImageValue('')}
                        className="text-[10px] text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/60"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      defaultChecked={editingItem ? editingItem.isAvailable : true}
                      className="rounded text-gold focus:ring-gold"
                    />
                    <span className="text-white font-medium">In Stock / Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isSpicy"
                      defaultChecked={editingItem ? editingItem.isSpicy : false}
                      className="rounded text-gold focus:ring-gold"
                    />
                    <span className="text-white font-medium">Spicy (Hot Pepper)</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-gold/20 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full gold-gradient-btn font-bold text-xs"
                  >
                    Save Dish
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setIsAddingNew(false);
                    }}
                    className="px-4 py-2.5 rounded-full bg-navy-950 text-slate-300 hover:text-white text-xs border border-gold/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
