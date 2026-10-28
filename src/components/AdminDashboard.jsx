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
  Link as LinkIcon,
  Users,
  Video,
  Image as ImageIcon,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard = ({
  isOpen,
  onClose,
  menuItems = [],
  onUpdateMenuItems,
  settings,
  onUpdateSettings,
  onResetDefaults,
  currency = '₦',
  staffMembers = [],
  onUpdateStaff,
  ambienceMedia = [],
  onUpdateAmbience,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'pricing' | 'staff' | 'ambience' | 'settings'

  // Product Filter
  const [filterChannel, setFilterChannel] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Editing / Adding Product Modal
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Image upload vs URL state for Product
  const [imageSourceMode, setImageSourceMode] = useState('upload'); // 'upload' | 'url'
  const [currentImageValue, setCurrentImageValue] = useState('');

  // Staff State
  const [editingStaff, setEditingStaff] = useState(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [staffImageMode, setStaffImageMode] = useState('upload');
  const [staffImageValue, setStaffImageValue] = useState('');

  // Ambience / Media State
  const [editingMedia, setEditingMedia] = useState(null);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaTypeMode, setMediaTypeMode] = useState('image'); // 'image' | 'video'
  const [mediaImageMode, setMediaImageMode] = useState('upload');
  const [mediaImageValue, setMediaImageValue] = useState('');
  const [mediaVideoUrl, setMediaVideoUrl] = useState('');
  const [mediaFilterCategory, setMediaFilterCategory] = useState('all');

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

  // Generic Client-Side Canvas Image Compression
  const compressImageFile = (file, callback) => {
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

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        callback(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // 1. PRODUCT ACTIONS
  const handleOpenAddProduct = () => {
    setEditingItem(null);
    setIsAddingNew(true);
    setCurrentImageValue('');
    setImageSourceMode('upload');
  };

  const handleOpenEditProduct = (item) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setCurrentImageValue(item.image || '');
    setImageSourceMode(item.image?.startsWith('data:') ? 'upload' : 'url');
  };

  const handleToggleStock = (itemId) => {
    const updated = menuItems.map((item) => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    onUpdateMenuItems(updated);
  };

  const handleDeleteProduct = (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      const updated = menuItems.filter((i) => i.id !== itemId);
      onUpdateMenuItems(updated);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
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

  // 2. STAFF ACTIONS
  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setIsAddingStaff(true);
    setStaffImageValue('');
    setStaffImageMode('upload');
  };

  const handleOpenEditStaff = (staff) => {
    setEditingStaff(staff);
    setIsAddingStaff(false);
    setStaffImageValue(staff.image || '');
    setStaffImageMode(staff.image?.startsWith('data:') ? 'upload' : 'url');
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      const updated = staffMembers.filter((s) => s.id !== staffId);
      onUpdateStaff(updated);
    }
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const finalImage = staffImageValue || 
                       formData.get('image') || 
                       'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80';

    const staffData = {
      id: editingStaff?.id || `staff-${Date.now()}`,
      name: formData.get('name'),
      role: formData.get('role'),
      department: formData.get('department'),
      bio: formData.get('bio'),
      quote: formData.get('quote'),
      priority: Number(formData.get('priority')) || 99,
      image: finalImage,
    };

    let updated;
    if (isAddingStaff) {
      updated = [...staffMembers, staffData];
    } else {
      updated = staffMembers.map((s) => (s.id === staffData.id ? staffData : s));
    }

    onUpdateStaff(updated);
    setEditingStaff(null);
    setIsAddingStaff(false);
  };

  // 3. AMBIENCE & MEDIA ACTIONS
  const handleOpenAddMedia = () => {
    setEditingMedia(null);
    setIsAddingMedia(true);
    setMediaTypeMode('image');
    setMediaImageMode('upload');
    setMediaImageValue('');
    setMediaVideoUrl('');
  };

  const handleOpenEditMedia = (media) => {
    setEditingMedia(media);
    setIsAddingMedia(false);
    setMediaTypeMode(media.type || 'image');
    setMediaImageValue(media.url || '');
    setMediaVideoUrl(media.type === 'video' ? media.url : '');
    setMediaImageMode(media.url?.startsWith('data:') ? 'upload' : 'url');
  };

  const handleDeleteMedia = (mediaId) => {
    if (window.confirm('Are you sure you want to delete this photo/video?')) {
      const updated = ambienceMedia.filter((m) => m.id !== mediaId);
      onUpdateAmbience(updated);
    }
  };

  const handleToggleMediaFeatured = (mediaId) => {
    const updated = ambienceMedia.map((m) => 
      m.id === mediaId ? { ...m, featuredOnHome: !m.featuredOnHome } : m
    );
    onUpdateAmbience(updated);
  };

  const handleSaveMedia = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    let finalUrl = '';
    let finalThumbnail = '';

    if (mediaTypeMode === 'video') {
      finalUrl = formData.get('videoUrl') || mediaVideoUrl;
      finalThumbnail = mediaImageValue || formData.get('thumbnailUrl') || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80';
    } else {
      finalUrl = mediaImageValue || formData.get('imageUrl') || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80';
    }

    const mediaData = {
      id: editingMedia?.id || `amb-${Date.now()}`,
      type: mediaTypeMode,
      title: formData.get('title'),
      category: formData.get('category'),
      caption: formData.get('caption'),
      url: finalUrl,
      thumbnail: finalThumbnail,
      featuredOnHome: formData.get('featuredOnHome') === 'on',
    };

    let updated;
    if (isAddingMedia) {
      updated = [mediaData, ...ambienceMedia];
    } else {
      updated = ambienceMedia.map((m) => (m.id === mediaData.id ? mediaData : m));
    }

    onUpdateAmbience(updated);
    setEditingMedia(null);
    setIsAddingMedia(false);
  };

  // 4. QUICK PRICES & SETTINGS ACTIONS
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

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-petrol-950/85 backdrop-blur-md animate-in fade-in"
      />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl bg-petrol-900 border border-mustard/40 rounded-3xl shadow-2xl h-[92vh] flex flex-col z-10 overflow-hidden text-left text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-petrol-800 flex items-center justify-between bg-petrol-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-mustard flex items-center justify-center text-petrol-950 font-black shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>ROMEE Administration Portal</span>
                <span className="text-[10px] uppercase font-bold bg-mustard text-petrol-950 px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Manage Menu, Staff Leadership, Kitchen & Ambience Media, and System Config
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-petrol-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PIN Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-petrol-950/90 border border-petrol-700 rounded-3xl p-8 text-center space-y-6 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-mustard/20 text-mustard flex items-center justify-center mx-auto border border-mustard/40">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-white">Enter Manager PIN</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Default access PIN is <strong className="text-mustard">1234</strong>
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full text-center tracking-widest text-2xl font-mono bg-petrol-900 border border-petrol-700 rounded-2xl py-3 text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                  autoFocus
                />

                {pinError && (
                  <p className="text-red-400 text-xs font-semibold">
                    Incorrect PIN. Try 1234.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Unlock Management Dashboard
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="px-6 py-3 border-b border-petrol-800 bg-petrol-950/60 flex items-center justify-between gap-4 overflow-x-auto shrink-0 scrollbar-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'products'
                      ? 'bg-mustard text-petrol-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-petrol-800'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Menu & Dishes ({menuItems.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('staff')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'staff'
                      ? 'bg-mustard text-petrol-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-petrol-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Staff & Leadership ({staffMembers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('ambience')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'ambience'
                      ? 'bg-mustard text-petrol-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-petrol-800'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Kitchen & Ambience Media ({ambienceMedia.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'pricing'
                      ? 'bg-mustard text-petrol-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-petrol-800'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Bulk Pricing</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-mustard text-petrol-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-petrol-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Outlet Settings</span>
                </button>
              </div>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-slate-400 hover:text-red-400 py-1 px-3 rounded-lg hover:bg-petrol-800 transition-colors whitespace-nowrap"
              >
                Lock Session
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              
              {/* TAB 1: PRODUCTS / MENU */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  {/* Controls Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleOpenAddProduct}
                        className="px-4 py-2 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all hover:scale-105 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Dish</span>
                      </button>

                      <select
                        value={filterChannel}
                        onChange={(e) => setFilterChannel(e.target.value)}
                        className="bg-petrol-900 border border-petrol-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-mustard"
                      >
                        <option value="all">All Channels (Dine-In & Go Bites)</option>
                        <option value="dinein">🍽️ Dine-In Only (Swallows)</option>
                        <option value="gobites">⚡ Go Bites Only (Combos)</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Filter dishes..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full sm:w-64 bg-petrol-900 border border-petrol-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-mustard"
                    />
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems
                      .filter((item) => {
                        const channelMatch = filterChannel === 'all' || item.channel === filterChannel || item.channel === 'both';
                        const searchMatch = !searchFilter.trim() || item.name.toLowerCase().includes(searchFilter.toLowerCase());
                        return channelMatch && searchMatch;
                      })
                      .map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-petrol-950/80 border border-petrol-800 flex items-start gap-3.5 hover:border-petrol-700 transition-colors"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-petrol-700"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-serif font-bold text-sm text-white truncate">
                                {item.name}
                              </h4>
                              <span className="text-xs font-bold text-mustard">
                                {currency}{item.price.toLocaleString()}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-petrol-900 text-slate-300 border border-petrol-700 uppercase">
                                {item.channel}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                item.isAvailable ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                              }`}>
                                {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-petrol-800/80">
                              <button
                                onClick={() => handleToggleStock(item.id)}
                                className="text-[10px] text-slate-400 hover:text-white"
                              >
                                Toggle Stock
                              </button>
                              <span className="text-slate-600">•</span>
                              <button
                                onClick={() => handleOpenEditProduct(item)}
                                className="text-[10px] text-mustard hover:underline flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                              <span className="text-slate-600">•</span>
                              <button
                                onClick={() => handleDeleteProduct(item.id)}
                                className="text-[10px] text-red-400 hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 2: STAFF & LEADERSHIP MANAGEMENT */}
              {activeTab === 'staff' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800">
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">
                        Managing Staff & Leadership Team
                      </h3>
                      <p className="text-xs text-slate-400">
                        Introduce your Managing Director, Operations Director, Executive Chefs, and front-line staff on the About page.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddStaff}
                      className="px-4 py-2 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all hover:scale-105 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Staff / Leader</span>
                    </button>
                  </div>

                  {/* Staff Members List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staffMembers.map((staff) => (
                      <div
                        key={staff.id}
                        className="p-5 rounded-2xl bg-petrol-950/80 border border-petrol-800 flex flex-col justify-between hover:border-petrol-700 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={staff.image}
                            alt={staff.name}
                            className="w-16 h-20 rounded-xl object-cover shrink-0 border border-petrol-700"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-petrol-900 text-mustard border border-mustard/30 uppercase inline-block mb-1">
                              {staff.department}
                            </span>
                            <h4 className="font-serif font-bold text-base text-white truncate">
                              {staff.name}
                            </h4>
                            <p className="text-xs text-mustard font-semibold">
                              {staff.role}
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                              {staff.bio}
                            </p>
                          </div>
                        </div>

                        {staff.quote && (
                          <div className="mt-3 p-2.5 rounded-xl bg-petrol-900/60 border border-petrol-800/80 text-[10px] text-slate-300 italic">
                            "{staff.quote}"
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-petrol-800 text-xs">
                          <span className="text-[10px] text-slate-500">
                            Priority: {staff.priority || 99}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleOpenEditStaff(staff)}
                              className="text-mustard hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <Edit2 className="w-3 h-3" /> Edit Profile
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff.id)}
                              className="text-red-400 hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: KITCHEN & AMBIENCE MEDIA MANAGEMENT */}
              {activeTab === 'ambience' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800">
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">
                        Kitchen, Seating & Ambience Media
                      </h3>
                      <p className="text-xs text-slate-400">
                        Upload live photos and video clips of your kitchens, seated lounges, and express counters. Select which appear on the homepage live banner.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <select
                        value={mediaFilterCategory}
                        onChange={(e) => setMediaFilterCategory(e.target.value)}
                        className="bg-petrol-900 border border-petrol-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-mustard"
                      >
                        <option value="all">All Categories</option>
                        <option value="kitchen">🔥 Kitchen & Prep</option>
                        <option value="dinein">🍽️ Dine-In Seating</option>
                        <option value="gobites">⚡ Go-Bites Counter</option>
                        <option value="ambience">🌿 Atmosphere & Terrace</option>
                      </select>

                      <button
                        onClick={handleOpenAddMedia}
                        className="px-4 py-2 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all hover:scale-105 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Photo / Video</span>
                      </button>
                    </div>
                  </div>

                  {/* Media Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ambienceMedia
                      .filter(m => mediaFilterCategory === 'all' || m.category === mediaFilterCategory)
                      .map((media) => {
                        const isVideo = media.type === 'video';

                        return (
                          <div
                            key={media.id}
                            className="p-4 rounded-2xl bg-petrol-950/80 border border-petrol-800 flex flex-col justify-between hover:border-petrol-700 transition-colors"
                          >
                            <div className="space-y-3">
                              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-petrol-700">
                                <img
                                  src={isVideo ? (media.thumbnail || media.url) : media.url}
                                  alt={media.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 flex gap-1">
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-petrol-950/80 text-mustard border border-mustard/30">
                                    {media.category}
                                  </span>
                                  {isVideo && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-mustard text-petrol-950 flex items-center gap-1">
                                      <Play className="w-2.5 h-2.5 fill-current" /> Video
                                    </span>
                                  )}
                                </div>

                                {media.featuredOnHome && (
                                  <div className="absolute bottom-2 left-2">
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                                      ★ Featured on Home Banner
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <h4 className="font-serif font-bold text-sm text-white line-clamp-1">
                                  {media.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                                  {media.caption}
                                </p>
                              </div>
                            </div>

                            <div className="pt-3 mt-3 border-t border-petrol-800 flex items-center justify-between text-xs">
                              <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(media.featuredOnHome)}
                                  onChange={() => handleToggleMediaFeatured(media.id)}
                                  className="rounded border-slate-700 text-mustard focus:ring-0"
                                />
                                <span>Show on Home</span>
                              </label>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleOpenEditMedia(media)}
                                  className="text-mustard hover:underline flex items-center gap-1 text-[11px]"
                                >
                                  <Edit2 className="w-3 h-3" /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMedia(media.id)}
                                  className="text-red-400 hover:underline flex items-center gap-1 text-[11px]"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* TAB 4: BULK PRICING */}
              {activeTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800">
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">Bulk Price Adjustments</h3>
                      <p className="text-xs text-slate-400">
                        Rapidly change dish prices across your menu. Click Save when finished.
                      </p>
                    </div>

                    <button
                      onClick={handleSaveQuickPrices}
                      className="px-5 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Prices</span>
                    </button>
                  </div>

                  {priceSaveNotice && (
                    <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
                      ✓ All prices updated and saved successfully!
                    </div>
                  )}

                  <div className="bg-petrol-950/80 rounded-2xl border border-petrol-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-petrol-900 border-b border-petrol-800 text-slate-400 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3.5">Dish</th>
                          <th className="p-3.5">Channel</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Current Price</th>
                          <th className="p-3.5">New Price ({currency})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-petrol-800/60">
                        {menuItems.map((item) => (
                          <tr key={item.id} className="hover:bg-petrol-900/40">
                            <td className="p-3.5 font-bold text-white flex items-center gap-2">
                              <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                              <span>{item.name}</span>
                            </td>
                            <td className="p-3.5 text-slate-300 capitalize">{item.channel}</td>
                            <td className="p-3.5 text-slate-300">{item.category}</td>
                            <td className="p-3.5 font-bold text-slate-400">{currency}{item.price.toLocaleString()}</td>
                            <td className="p-3.5">
                              <input
                                type="number"
                                defaultValue={item.price}
                                onChange={(e) => setPriceFormState((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                className="w-28 bg-petrol-900 border border-petrol-700 rounded-lg px-2.5 py-1 text-white font-bold text-xs focus:outline-none focus:border-mustard"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: GENERAL SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-petrol-950/70 p-6 rounded-2xl border border-petrol-800 space-y-4">
                    <h3 className="font-serif font-bold text-lg text-white">Restaurant & WhatsApp Settings</h3>

                    <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Restaurant Name</label>
                        <input
                          type="text"
                          value={settingsForm.restaurantName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, restaurantName: e.target.value })}
                          className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">WhatsApp Order Number</label>
                        <input
                          type="text"
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Orders from the cart compile directly to this phone number.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Dine-In Service Fee ({currency})</label>
                          <input
                            type="number"
                            value={settingsForm.serviceChargeDineIn}
                            onChange={(e) => setSettingsForm({ ...settingsForm, serviceChargeDineIn: Number(e.target.value) })}
                            className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Go Bites Packaging Fee ({currency})</label>
                          <input
                            type="number"
                            value={settingsForm.packagingFeeGoBites}
                            onChange={(e) => setSettingsForm({ ...settingsForm, packagingFeeGoBites: Number(e.target.value) })}
                            className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Admin Portal PIN</label>
                        <input
                          type="password"
                          value={settingsForm.adminPin}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                          className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                        />
                      </div>

                      {settingsSavedNotice && (
                        <p className="text-emerald-400 font-bold text-center">✓ Settings saved successfully!</p>
                      )}

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold uppercase tracking-wider text-xs shadow-md"
                        >
                          Save Settings
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Reset all menu items, staff, and settings back to factory defaults?')) {
                              onResetDefaults();
                              onClose();
                            }
                          }}
                          className="text-xs text-red-400 hover:underline flex items-center gap-1"
                        >
                          <RefreshCcw className="w-3.5 h-3.5" />
                          <span>Reset to Factory Defaults</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {(isAddingNew || editingItem) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div onClick={() => { setIsAddingNew(false); setEditingItem(null); }} className="fixed inset-0 bg-petrol-950/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-petrol-900 border border-mustard/40 rounded-3xl p-6 z-10 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-petrol-800 pb-3">
              <h3 className="font-serif font-bold text-lg">
                {isAddingNew ? 'Add New Menu Item' : `Edit: ${editingItem.name}`}
              </h3>
              <button onClick={() => { setIsAddingNew(false); setEditingItem(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dish Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name || ''}
                  placeholder="e.g. Special Ofada Combo or Steaming Amala Dudu"
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ({currency})</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingItem?.price || 2500}
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={editingItem?.category || 'Combos'}
                    placeholder="e.g. Swallows, Combos, Rice"
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dining Channel</label>
                <select
                  name="channel"
                  defaultValue={editingItem?.channel || 'gobites'}
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                >
                  <option value="dinein">🍽️ Dine-In Lounge Only (Swallows & Fish)</option>
                  <option value="gobites">⚡ Go Bites Express Only (Combos & Fast)</option>
                  <option value="both">🌟 Available in Both Channels</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingItem?.description || ''}
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard resize-none"
                  required
                />
              </div>

              {/* Dual Image Input */}
              <div className="space-y-2 pt-1 border-t border-petrol-800">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">Dish Image</label>
                  <div className="flex items-center gap-1 bg-petrol-950 p-0.5 rounded-lg border border-petrol-700">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('upload')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        imageSourceMode === 'upload' ? 'bg-mustard text-petrol-950' : 'text-slate-400'
                      }`}
                    >
                      📁 Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('url')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        imageSourceMode === 'url' ? 'bg-mustard text-petrol-950' : 'text-slate-400'
                      }`}
                    >
                      🔗 Paste URL
                    </button>
                  </div>
                </div>

                {imageSourceMode === 'upload' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => compressImageFile(e.target.files?.[0], setCurrentImageValue)}
                      className="w-full text-[11px] text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-mustard file:text-petrol-950 hover:file:bg-mustard-hover cursor-pointer"
                    />
                  </div>
                ) : (
                  <input
                    type="url"
                    name="image"
                    value={currentImageValue}
                    onChange={(e) => setCurrentImageValue(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-mustard"
                  />
                )}

                {currentImageValue && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-mustard/40 mt-1">
                    <img src={currentImageValue} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCurrentImageValue('')}
                      className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded-bl text-[9px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    defaultChecked={editingItem ? editingItem.isAvailable : true}
                    className="rounded text-mustard focus:ring-0"
                  />
                  <span className="text-slate-300">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isSpicy"
                    defaultChecked={editingItem?.isSpicy || false}
                    className="rounded text-mustard focus:ring-0"
                  />
                  <span className="text-slate-300">Spicy</span>
                </label>
              </div>

              <div className="pt-3 border-t border-petrol-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingItem(null); }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT STAFF MEMBER */}
      {(isAddingStaff || editingStaff) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div onClick={() => { setIsAddingStaff(false); setEditingStaff(null); }} className="fixed inset-0 bg-petrol-950/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-petrol-900 border border-mustard/40 rounded-3xl p-6 z-10 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-petrol-800 pb-3">
              <h3 className="font-serif font-bold text-lg">
                {isAddingStaff ? 'Add Staff / Leader Profile' : `Edit: ${editingStaff.name}`}
              </h3>
              <button onClick={() => { setIsAddingStaff(false); setEditingStaff(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingStaff?.name || ''}
                    placeholder="e.g. Dr. Romee Babatunde"
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Priority (1 = Top)</label>
                  <input
                    type="number"
                    name="priority"
                    defaultValue={editingStaff?.priority || 1}
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role / Designation</label>
                  <input
                    type="text"
                    name="role"
                    defaultValue={editingStaff?.role || ''}
                    placeholder="e.g. Managing Director & CEO"
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={editingStaff?.department || 'Executive Leadership'}
                    placeholder="e.g. Culinary, Operations, Leadership"
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Personal Statement / Leadership Quote</label>
                <input
                  type="text"
                  name="quote"
                  defaultValue={editingStaff?.quote || ''}
                  placeholder="e.g. At ROMEE, food is an authentic cultural heritage..."
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Biography / Experience</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={editingStaff?.bio || ''}
                  placeholder="Professional background, years of experience, and role in ROMEE..."
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard resize-none"
                  required
                />
              </div>

              {/* Dual Staff Photo Input */}
              <div className="space-y-2 pt-1 border-t border-petrol-800">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">Staff Portrait Photo</label>
                  <div className="flex items-center gap-1 bg-petrol-950 p-0.5 rounded-lg border border-petrol-700">
                    <button
                      type="button"
                      onClick={() => setStaffImageMode('upload')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        staffImageMode === 'upload' ? 'bg-mustard text-petrol-950' : 'text-slate-400'
                      }`}
                    >
                      📁 Upload Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffImageMode('url')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        staffImageMode === 'url' ? 'bg-mustard text-petrol-950' : 'text-slate-400'
                      }`}
                    >
                      🔗 Paste URL
                    </button>
                  </div>
                </div>

                {staffImageMode === 'upload' ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => compressImageFile(e.target.files?.[0], setStaffImageValue)}
                    className="w-full text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-mustard file:text-petrol-950 cursor-pointer"
                  />
                ) : (
                  <input
                    type="url"
                    name="image"
                    value={staffImageValue}
                    onChange={(e) => setStaffImageValue(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-mustard"
                  />
                )}

                {staffImageValue && (
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-mustard/40 mt-1">
                    <img src={staffImageValue} alt="Staff Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setStaffImageValue('')}
                      className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded-bl text-[9px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-petrol-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddingStaff(false); setEditingStaff(null); }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT KITCHEN & AMBIENCE MEDIA */}
      {(isAddingMedia || editingMedia) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div onClick={() => { setIsAddingMedia(false); setEditingMedia(null); }} className="fixed inset-0 bg-petrol-950/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-petrol-900 border border-mustard/40 rounded-3xl p-6 z-10 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-petrol-800 pb-3">
              <h3 className="font-serif font-bold text-lg">
                {isAddingMedia ? 'Add Kitchen / Ambience Media' : `Edit Media: ${editingMedia.title}`}
              </h3>
              <button onClick={() => { setIsAddingMedia(false); setEditingMedia(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-3.5 text-xs">
              
              {/* Type Selection */}
              <div className="flex items-center gap-3">
                <label className="text-slate-300 font-semibold">Media Type:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaTypeMode('image')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      mediaTypeMode === 'image' ? 'bg-mustard text-petrol-950' : 'bg-petrol-950 text-slate-300 border border-petrol-700'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaTypeMode('video')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      mediaTypeMode === 'video' ? 'bg-mustard text-petrol-950' : 'bg-petrol-950 text-slate-300 border border-petrol-700'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Clip</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Headline / Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingMedia?.title || ''}
                  placeholder="e.g. Master Soup Cauldrons or VIP Lounge Seating"
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={editingMedia?.category || 'kitchen'}
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                >
                  <option value="kitchen">🔥 Master Kitchen & Cooking Stations</option>
                  <option value="dinein">🍽️ Dine-In Seating Arrangements</option>
                  <option value="gobites">⚡ Go-Bites Express Counter & Dispatch</option>
                  <option value="ambience">🌿 Restaurant Atmosphere & Terrace</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Caption / Description</label>
                <textarea
                  name="caption"
                  rows={2}
                  defaultValue={editingMedia?.caption || ''}
                  placeholder="Describe this kitchen station or dining room setup..."
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard resize-none"
                  required
                />
              </div>

              {/* Source Inputs: Video vs Photo */}
              {mediaTypeMode === 'video' ? (
                <div className="space-y-3 pt-2 border-t border-petrol-800">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Video URL (MP4 or YouTube link)</label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={mediaVideoUrl}
                      onChange={(e) => setMediaVideoUrl(e.target.value)}
                      placeholder="https://assets.mixkit.co/videos/...mp4 or https://youtube.com/..."
                      className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Video Thumbnail Cover (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => compressImageFile(e.target.files?.[0], setMediaImageValue)}
                      className="w-full text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-mustard file:text-petrol-950 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-petrol-800">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-semibold">Image Source</label>
                    <div className="flex items-center gap-1 bg-petrol-950 p-0.5 rounded-lg border border-petrol-700">
                      <button
                        type="button"
                        onClick={() => setMediaImageMode('upload')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          mediaImageMode === 'upload' ? 'bg-mustard text-petrol-950' : 'text-slate-400'
                        }`}
                      >
                        📁 Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaImageMode('url')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          mediaImageMode === 'url' ? 'bg-mustard text-petrol-950' : 'text-slate-400'
                        }`}
                      >
                        🔗 URL
                      </button>
                    </div>
                  </div>

                  {mediaImageMode === 'upload' ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => compressImageFile(e.target.files?.[0], setMediaImageValue)}
                      className="w-full text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-mustard file:text-petrol-950 cursor-pointer"
                    />
                  ) : (
                    <input
                      type="url"
                      name="imageUrl"
                      value={mediaImageValue}
                      onChange={(e) => setMediaImageValue(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-mustard"
                    />
                  )}

                  {mediaImageValue && (
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-mustard/40 mt-1">
                      <img src={mediaImageValue} alt="Media Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setMediaImageValue('')}
                        className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded-bl text-[9px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Homepage Feature Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-petrol-950 p-2.5 rounded-xl border border-petrol-700">
                  <input
                    type="checkbox"
                    name="featuredOnHome"
                    defaultChecked={editingMedia ? editingMedia.featuredOnHome : true}
                    className="rounded text-mustard focus:ring-0"
                  />
                  <div>
                    <span className="text-white font-bold block text-xs">🌟 Feature on Homepage Live Banner</span>
                    <span className="text-[10px] text-slate-400">Shows in the "A Glimpse of ROMEE" showcase on the home page.</span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-petrol-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddingMedia(false); setEditingMedia(null); }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
