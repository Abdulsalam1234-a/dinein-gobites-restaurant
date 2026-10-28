import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Key,
  Mail,
  MessageCircle,
  FileText,
  Clock,
  Eye,
  LogOut,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { 
  createSuperuserWhatsAppUrl, 
  createSuperuserMailtoUrl 
} from '../utils/storage';

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
  users = [],
  onUpdateUsers,
  auditLogs = [],
  onAddAuditLog,
  onClearAuditLogs,
}) => {
  // Login credentials state
  const [emailInput, setEmailInput] = useState('salamiabdullahi247@gmail.com');
  const [passwordInput, setPasswordInput] = useState('1234');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('romee_current_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'staff' | 'ambience' | 'users' | 'audit' | 'pricing' | 'settings'

  // Notification Banner for recent audit action
  const [recentNotification, setRecentNotification] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Confirmation Delete Modal
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { type, id, title, action }

  // 1. Products Tab State
  const [filterChannel, setFilterChannel] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [imageSourceMode, setImageSourceMode] = useState('upload'); // 'upload' | 'url'
  const [currentImageValue, setCurrentImageValue] = useState('');

  // 2. Staff Tab State
  const [editingStaff, setEditingStaff] = useState(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [staffImageMode, setStaffImageMode] = useState('upload');
  const [staffImageValue, setStaffImageValue] = useState('');

  // 3. Ambience Tab State
  const [editingMedia, setEditingMedia] = useState(null);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaTypeMode, setMediaTypeMode] = useState('image'); // 'image' | 'video'
  const [mediaImageMode, setMediaImageMode] = useState('upload');
  const [mediaImageValue, setMediaImageValue] = useState('');
  const [mediaVideoUrl, setMediaVideoUrl] = useState('');
  const [mediaFilterCategory, setMediaFilterCategory] = useState('all');

  // 4. User Management Tab State
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // 5. Bulk Pricing State
  const [priceFormState, setPriceFormState] = useState({});
  const [priceSaveNotice, setPriceSaveNotice] = useState(false);

  // 6. Settings State
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  if (!isOpen) return null;

  const isSuperuser = currentUser?.role === 'superuser';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const triggerAudit = (action, details) => {
    const logItem = onAddAuditLog(action, details, currentUser);
    if (logItem) {
      setRecentNotification(logItem);
    }
  };

  // Login handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // Check against users list
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (found) {
      if (found.status === 'disabled') {
        setAuthError('This account has been disabled by the Superuser.');
        return;
      }
      setCurrentUser(found);
      sessionStorage.setItem('romee_current_admin_user', JSON.stringify(found));
      setAuthError('');
      showToast(`Welcome back, ${found.name}!`);
    } else {
      setAuthError('Invalid email or password. Default superuser is salamiabdullahi247@gmail.com with password 1234');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('romee_current_admin_user');
    setEmailInput('salamiabdullahi247@gmail.com');
    setPasswordInput('1234');
  };

  // Image compression
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

  // ================= 1. DISH / PRODUCT CRUD =================
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

  const handleToggleStock = (item) => {
    const nextStock = !item.isAvailable;
    const updated = menuItems.map((i) => 
      i.id === item.id ? { ...i, isAvailable: nextStock } : i
    );
    onUpdateMenuItems(updated);
    triggerAudit(
      'STOCK_TOGGLE',
      `Marked dish "${item.name}" as ${nextStock ? 'In Stock (Available)' : 'Out of Stock'}`
    );
    showToast(`"${item.name}" is now ${nextStock ? 'In Stock' : 'Out of Stock'}.`);
  };

  const handleDeleteProduct = (item) => {
    setDeleteConfirmation({
      type: 'dish',
      id: item.id,
      title: item.name,
      message: `Are you sure you want to delete "${item.name}" from the menu? This action cannot be undone.`,
      onConfirm: () => {
        const updated = menuItems.filter((i) => i.id !== item.id);
        onUpdateMenuItems(updated);
        triggerAudit('DELETE_DISH', `Deleted menu item "${item.name}"`);
        showToast(`"${item.name}" removed from menu.`);
        setDeleteConfirmation(null);
      },
    });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const finalImage = currentImageValue || 
                       formData.get('image') || 
                       'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

    const rawOptions = formData.get('options') || '';
    const parsedOptions = rawOptions
      ? rawOptions.split(',').map((o) => o.trim()).filter(Boolean)
      : (editingItem?.options || []);

    const productData = {
      id: editingItem?.id || `custom-${Date.now()}`,
      name: formData.get('name')?.toString().trim(),
      description: formData.get('description')?.toString().trim(),
      price: Number(formData.get('price')) || 1000,
      category: formData.get('category')?.toString().trim() || 'Combos',
      channel: formData.get('channel')?.toString().trim() || 'gobites',
      image: finalImage,
      isAvailable: formData.get('isAvailable') === 'on',
      isSpicy: formData.get('isSpicy') === 'on',
      prepTime: formData.get('prepTime')?.toString().trim() || '15 mins',
      badge: formData.get('badge')?.toString().trim() || '',
      options: parsedOptions,
    };

    let updated;
    if (isAddingNew) {
      updated = [productData, ...menuItems];
      triggerAudit(
        'ADD_DISH',
        `Added new dish "${productData.name}" (${currency}${productData.price.toLocaleString()}) for ${productData.channel.toUpperCase()}`
      );
      showToast(`Dish "${productData.name}" added successfully!`);
    } else {
      updated = menuItems.map((item) => (item.id === productData.id ? productData : item));
      triggerAudit(
        'EDIT_DISH',
        `Updated dish "${productData.name}" (${currency}${productData.price.toLocaleString()})`
      );
      showToast(`Dish "${productData.name}" updated successfully!`);
    }

    onUpdateMenuItems(updated);
    setEditingItem(null);
    setIsAddingNew(false);
  };

  // ================= 2. STAFF LEADERSHIP CRUD =================
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

  const handleDeleteStaff = (staff) => {
    setDeleteConfirmation({
      type: 'staff',
      id: staff.id,
      title: staff.name,
      message: `Delete ${staff.name} (${staff.role}) from the staff introductions page?`,
      onConfirm: () => {
        const updated = staffMembers.filter((s) => s.id !== staff.id);
        onUpdateStaff(updated);
        triggerAudit('DELETE_STAFF', `Removed staff member ${staff.name} (${staff.role})`);
        showToast(`Staff member "${staff.name}" removed.`);
        setDeleteConfirmation(null);
      },
    });
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const finalImage = staffImageValue || 
                       formData.get('image') || 
                       'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80';

    const staffData = {
      id: editingStaff?.id || `staff-${Date.now()}`,
      name: formData.get('name')?.toString().trim(),
      role: formData.get('role')?.toString().trim(),
      department: formData.get('department')?.toString().trim() || 'Leadership',
      bio: formData.get('bio')?.toString().trim(),
      quote: formData.get('quote')?.toString().trim(),
      priority: Number(formData.get('priority')) || 99,
      image: finalImage,
    };

    let updated;
    if (isAddingStaff) {
      updated = [...staffMembers, staffData];
      triggerAudit('ADD_STAFF', `Added staff leader ${staffData.name} as ${staffData.role}`);
      showToast(`Staff leader "${staffData.name}" created!`);
    } else {
      updated = staffMembers.map((s) => (s.id === staffData.id ? staffData : s));
      triggerAudit('EDIT_STAFF', `Updated staff leader ${staffData.name} profile`);
      showToast(`Staff profile for "${staffData.name}" updated!`);
    }

    onUpdateStaff(updated);
    setEditingStaff(null);
    setIsAddingStaff(false);
  };

  // ================= 3. AMBIENCE & MEDIA CRUD =================
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

  const handleDeleteMedia = (media) => {
    setDeleteConfirmation({
      type: 'media',
      id: media.id,
      title: media.title,
      message: `Delete photo/video "${media.title}" from the facility gallery?`,
      onConfirm: () => {
        const updated = ambienceMedia.filter((m) => m.id !== media.id);
        onUpdateAmbience(updated);
        triggerAudit('DELETE_MEDIA', `Deleted ${media.type} "${media.title}"`);
        showToast(`Media "${media.title}" deleted.`);
        setDeleteConfirmation(null);
      },
    });
  };

  const handleToggleMediaFeatured = (media) => {
    const nextVal = !media.featuredOnHome;
    const updated = ambienceMedia.map((m) => 
      m.id === media.id ? { ...m, featuredOnHome: nextVal } : m
    );
    onUpdateAmbience(updated);
    triggerAudit(
      'UPDATE_MEDIA_FEATURED',
      `${nextVal ? 'Featured' : 'Removed'} "${media.title}" on homepage live banner`
    );
    showToast(`Homepage banner status updated for "${media.title}".`);
  };

  const handleSaveMedia = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    let finalUrl = '';
    let finalThumbnail = '';

    if (mediaTypeMode === 'video') {
      finalUrl = formData.get('videoUrl')?.toString().trim() || mediaVideoUrl;
      finalThumbnail = mediaImageValue || formData.get('thumbnailUrl') || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80';
    } else {
      finalUrl = mediaImageValue || formData.get('imageUrl')?.toString().trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80';
    }

    const mediaData = {
      id: editingMedia?.id || `amb-${Date.now()}`,
      type: mediaTypeMode,
      title: formData.get('title')?.toString().trim(),
      category: formData.get('category')?.toString().trim() || 'kitchen',
      caption: formData.get('caption')?.toString().trim(),
      url: finalUrl,
      thumbnail: finalThumbnail,
      featuredOnHome: formData.get('featuredOnHome') === 'on',
    };

    let updated;
    if (isAddingMedia) {
      updated = [mediaData, ...ambienceMedia];
      triggerAudit('ADD_MEDIA', `Added ${mediaData.type.toUpperCase()}: "${mediaData.title}" in ${mediaData.category}`);
      showToast(`Media "${mediaData.title}" added to gallery!`);
    } else {
      updated = ambienceMedia.map((m) => (m.id === mediaData.id ? mediaData : m));
      triggerAudit('EDIT_MEDIA', `Updated ${mediaData.type.toUpperCase()}: "${mediaData.title}"`);
      showToast(`Media "${mediaData.title}" updated!`);
    }

    onUpdateAmbience(updated);
    setEditingMedia(null);
    setIsAddingMedia(false);
  };

  // ================= 4. USER ACCESS MANAGEMENT (Superuser) =================
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setIsAddingUser(true);
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setIsAddingUser(false);
  };

  const handleDeleteUser = (user) => {
    if (user.role === 'superuser') {
      alert('The superuser account cannot be deleted.');
      return;
    }
    setDeleteConfirmation({
      type: 'user',
      id: user.id,
      title: user.name,
      message: `Revoke system access for ${user.name} (${user.email})?`,
      onConfirm: () => {
        const updated = users.filter((u) => u.id !== user.id);
        onUpdateUsers(updated);
        triggerAudit('DELETE_USER', `Revoked access for user ${user.name} (${user.email})`);
        showToast(`User ${user.name} removed.`);
        setDeleteConfirmation(null);
      },
    });
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const password = formData.get('password')?.toString().trim();
    const name = formData.get('name')?.toString().trim();
    const role = formData.get('role')?.toString().trim() || 'manager';
    const status = formData.get('status')?.toString().trim() || 'active';

    const permissions = [];
    if (formData.get('perm_menu') === 'on') permissions.push('menu');
    if (formData.get('perm_pricing') === 'on') permissions.push('pricing');
    if (formData.get('perm_staff') === 'on') permissions.push('staff');
    if (formData.get('perm_ambience') === 'on') permissions.push('ambience');
    if (formData.get('perm_audit') === 'on') permissions.push('audit');
    if (role === 'superuser') permissions.push('all');

    const userData = {
      id: editingUser?.id || `user-${Date.now()}`,
      email,
      password: password || editingUser?.password || '1234',
      name,
      role,
      title: formData.get('title')?.toString().trim() || 'Management Staff',
      permissions,
      status,
      createdAt: editingUser?.createdAt || new Date().toISOString().split('T')[0],
    };

    let updated;
    if (isAddingUser) {
      // Check for duplicate email
      if (users.some((u) => u.email.toLowerCase() === email)) {
        alert('A user with this email already exists.');
        return;
      }
      updated = [...users, userData];
      triggerAudit('ADD_USER', `Superuser granted access to ${userData.name} (${userData.email}) as ${userData.role}`);
      showToast(`User account created for ${userData.name}!`);
    } else {
      updated = users.map((u) => (u.id === userData.id ? userData : u));
      triggerAudit('EDIT_USER', `Superuser updated access for ${userData.name} (${userData.email})`);
      showToast(`User account for ${userData.name} updated!`);
    }

    onUpdateUsers(updated);
    setEditingUser(null);
    setIsAddingUser(false);
  };

  // ================= 5. BULK PRICING =================
  const handleSaveQuickPrices = () => {
    const updated = menuItems.map((item) => {
      if (priceFormState[item.id] !== undefined) {
        return { ...item, price: Number(priceFormState[item.id]) };
      }
      return item;
    });
    onUpdateMenuItems(updated);
    triggerAudit('BULK_PRICE_UPDATE', `Updated prices across ${Object.keys(priceFormState).length} dish(es)`);
    setPriceSaveNotice(true);
    showToast('All prices updated and saved live!');
    setTimeout(() => setPriceSaveNotice(false), 2500);
  };

  // ================= 6. SETTINGS =================
  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    triggerAudit('UPDATE_SETTINGS', 'Updated restaurant hotline, fees, or superuser email');
    setSettingsSavedNotice(true);
    showToast('Restaurant settings saved!');
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
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-petrol-800 flex items-center justify-between bg-petrol-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-mustard flex items-center justify-center text-petrol-950 font-black shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>ROMEE Executive Management Portal</span>
                <span className="text-[10px] uppercase font-bold bg-mustard text-petrol-950 px-2 py-0.5 rounded-full">
                  Live CRUD & Audit
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Authorized control center for Menu, Staff, Ambience Media, User Roles, and Audit Trail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 bg-petrol-900 border border-petrol-700 px-3 py-1.5 rounded-full text-xs">
                <span className={`w-2 h-2 rounded-full ${isSuperuser ? 'bg-mustard animate-pulse' : 'bg-emerald-400'}`} />
                <span className="font-bold text-white">{currentUser.name}</span>
                <span className="text-[10px] text-mustard uppercase font-black px-1.5 py-0.5 rounded bg-petrol-950">
                  {currentUser.role}
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-petrol-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-500 text-petrol-950 font-black text-xs py-2 px-4 text-center shrink-0 animate-in fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Superuser Notification Ribbon (Whenever an update is logged) */}
        {recentNotification && (
          <div className="bg-petrol-950 border-b border-mustard/40 px-4 py-2.5 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-mustard animate-ping shrink-0" />
              <span>
                <strong>Action Logged:</strong> {recentNotification.action} by <em>{recentNotification.userName}</em> ({recentNotification.details})
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={createSuperuserWhatsAppUrl(recentNotification, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                title="Send update alert to Superuser WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Notify WhatsApp (07068371295)</span>
              </a>

              <a
                href={createSuperuserMailtoUrl(recentNotification, settings.superuserEmail || 'salamiabdullahi247@gmail.com')}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                title="Send update alert to Superuser Email"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Notify Email</span>
              </a>

              <button
                onClick={() => setRecentNotification(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* AUTHENTICATION SCREEN: Email & Password */}
        {!currentUser ? (
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-md w-full bg-petrol-950/90 border border-mustard/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
              
              <div className="w-16 h-16 rounded-full bg-mustard/20 text-mustard flex items-center justify-center mx-auto border border-mustard/40">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Administrator Sign In</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Superuser and Management Access Portal
                </p>
              </div>

              {/* Quick Fill Pills */}
              <div className="bg-petrol-900/80 p-3 rounded-2xl border border-petrol-800 text-left space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Quick Sign-In Presets:
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput('salamiabdullahi247@gmail.com');
                      setPasswordInput('1234');
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-petrol-950 hover:bg-mustard/20 text-slate-200 hover:text-mustard text-xs font-semibold flex items-center justify-between border border-petrol-700 transition-colors"
                  >
                    <span>👑 Superuser (Abdullahi Salami)</span>
                    <span className="text-[10px] text-mustard font-mono">1234</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput('manager@romeegobite.com');
                      setPasswordInput('1234');
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-petrol-950 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400 text-xs font-semibold flex items-center justify-between border border-petrol-700 transition-colors"
                  >
                    <span>👔 General Manager (Folashade)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">1234</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. salamiabdullahi247@gmail.com"
                      className="w-full bg-petrol-900 border border-petrol-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1">
                    Password / PIN
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-petrol-900 border border-petrol-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                      required
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.01]"
                >
                  Sign In to Management Portal
                </button>
              </form>

            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="px-6 py-3 border-b border-petrol-800 bg-petrol-950/70 flex items-center justify-between gap-4 overflow-x-auto shrink-0 scrollbar-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'ambience'
                      ? 'bg-mustard text-petrol-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-petrol-800'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Ambience Media ({ambienceMedia.length})</span>
                </button>

                {isSuperuser && (
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === 'users'
                        ? 'bg-mustard text-petrol-950 shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-petrol-800'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>User Access Control ({users.length})</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'audit'
                      ? 'bg-mustard text-petrol-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-petrol-800'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Audit Trail ({auditLogs.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-mustard text-petrol-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-petrol-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-400 hover:text-white py-1.5 px-3 rounded-lg hover:bg-red-950/60 transition-colors flex items-center gap-1.5 whitespace-nowrap border border-red-900/60"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              
              {/* TAB 1: PRODUCTS / MENU CRUD */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  {/* Controls Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleOpenAddProduct}
                        className="px-4 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all hover:scale-105 shrink-0"
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
                      placeholder="Search and filter dishes..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full sm:w-72 bg-petrol-900 border border-petrol-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-mustard"
                    />
                  </div>

                  {/* Dishes Grid */}
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

                            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-petrol-800/80">
                              <button
                                onClick={() => handleToggleStock(item)}
                                className="text-[10px] text-slate-300 hover:text-white underline"
                              >
                                {item.isAvailable ? 'Set Out of Stock' : 'Set In Stock'}
                              </button>
                              <button
                                onClick={() => handleOpenEditProduct(item)}
                                className="text-[10px] text-mustard hover:underline flex items-center gap-1 font-bold"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(item)}
                                className="text-[10px] text-red-400 hover:underline flex items-center gap-1 font-bold"
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

              {/* TAB 2: STAFF & LEADERSHIP CRUD */}
              {activeTab === 'staff' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800">
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">
                        Staff & Leadership Profiles
                      </h3>
                      <p className="text-xs text-slate-400">
                        Introduce the Managing Director, General Manager, and Executive Chefs on the About page.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddStaff}
                      className="px-4 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all hover:scale-105 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Staff Leader</span>
                    </button>
                  </div>

                  {/* Staff List */}
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
                              className="text-mustard hover:underline flex items-center gap-1 text-[11px] font-bold"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff)}
                              className="text-red-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
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

              {/* TAB 3: KITCHEN & AMBIENCE MEDIA CRUD */}
              {activeTab === 'ambience' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800">
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">
                        Kitchen & Seating Ambience Gallery
                      </h3>
                      <p className="text-xs text-slate-400">
                        Upload photos and video reels of your boiling pots, seated lounges, and express counters.
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
                        className="px-4 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all hover:scale-105 shrink-0"
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
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-petrol-950/80 text-mustard border border-mustard/30 uppercase">
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
                                  onChange={() => handleToggleMediaFeatured(media)}
                                  className="rounded border-slate-700 text-mustard focus:ring-0"
                                />
                                <span>Show on Home Banner</span>
                              </label>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleOpenEditMedia(media)}
                                  className="text-mustard hover:underline flex items-center gap-1 text-[11px] font-bold"
                                >
                                  <Edit2 className="w-3 h-3" /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMedia(media)}
                                  className="text-red-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
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

              {/* TAB 4: USER ACCESS CONTROL (Superuser Only) */}
              {activeTab === 'users' && isSuperuser && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800">
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">
                        Management Team & Role Access Control
                      </h3>
                      <p className="text-xs text-slate-400">
                        Create and manage staff accounts. All actions performed by other managers are tracked and sent to your email & WhatsApp.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddUser}
                      className="px-4 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all hover:scale-105 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Grant New User Access</span>
                    </button>
                  </div>

                  {/* Users Table */}
                  <div className="bg-petrol-950/80 rounded-2xl border border-petrol-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-petrol-900 border-b border-petrol-800 text-slate-400 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3.5">User</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">Role</th>
                          <th className="p-3.5">Permissions</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-petrol-800/60">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-petrol-900/40">
                            <td className="p-3.5 font-bold text-white flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-petrol-900 flex items-center justify-center font-bold text-mustard border border-mustard/30">
                                {u.name.charAt(0)}
                              </span>
                              <div>
                                <span className="block">{u.name}</span>
                                <span className="text-[10px] text-slate-400 font-normal">{u.title}</span>
                              </div>
                            </td>
                            <td className="p-3.5 text-slate-300 font-mono text-[11px]">{u.email}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                u.role === 'superuser' ? 'bg-mustard text-petrol-950' : 'bg-petrol-900 text-slate-300 border border-petrol-700'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-300">
                              <div className="flex flex-wrap gap-1">
                                {u.permissions.map((p) => (
                                  <span key={p} className="px-1.5 py-0.5 rounded bg-petrol-900 text-[10px] font-mono text-slate-400 border border-petrol-800">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                              }`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditUser(u)}
                                  className="text-mustard hover:underline text-[11px] font-bold"
                                >
                                  Edit
                                </button>
                                {u.role !== 'superuser' && (
                                  <button
                                    onClick={() => handleDeleteUser(u)}
                                    className="text-red-400 hover:underline text-[11px] font-bold"
                                  >
                                    Revoke
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: AUDIT TRAIL & HISTORY LOGS */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800">
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">
                        System Activity & Audit Trail
                      </h3>
                      <p className="text-xs text-slate-400">
                        Live chronological history of every CRUD operation. Notifications are automatically preformatted for WhatsApp and Email.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {auditLogs.length > 0 && (
                        <>
                          <a
                            href={createSuperuserWhatsAppUrl(auditLogs[0], settings.whatsappNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Report</span>
                          </a>

                          <a
                            href={createSuperuserMailtoUrl(auditLogs[0], settings.superuserEmail || 'salamiabdullahi247@gmail.com')}
                            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email Superuser</span>
                          </a>

                          {isSuperuser && (
                            <button
                              onClick={() => {
                                if (window.confirm('Clear all audit logs history?')) {
                                  onClearAuditLogs();
                                  showToast('Audit trail cleared.');
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-petrol-900 border border-petrol-800 transition-colors"
                              title="Clear Audit History"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Audit Logs Feed */}
                  <div className="bg-petrol-950/80 rounded-2xl border border-petrol-800 overflow-hidden divide-y divide-petrol-800/60">
                    {auditLogs.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No audit logs recorded yet.
                      </div>
                    ) : (
                      auditLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-petrol-900/30 flex items-start justify-between gap-4 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-mustard/20 text-mustard border border-mustard/40 font-mono">
                                {log.action}
                              </span>
                              <span className="font-bold text-white">
                                {log.userName}
                              </span>
                              <span className="text-slate-400 text-[11px]">
                                ({log.userEmail})
                              </span>
                            </div>
                            <p className="text-slate-300 text-xs">
                              {log.details}
                            </p>
                          </div>

                          <div className="text-right shrink-0 space-y-1">
                            <span className="text-[10px] text-slate-500 block font-mono">
                              {log.timestamp}
                            </span>
                            <div className="flex items-center gap-2 justify-end">
                              <a
                                href={createSuperuserWhatsAppUrl(log, settings.whatsappNumber)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                                title="Forward via WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" /> WhatsApp
                              </a>
                              <span className="text-slate-700">•</span>
                              <a
                                href={createSuperuserMailtoUrl(log, settings.superuserEmail || 'salamiabdullahi247@gmail.com')}
                                className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
                                title="Forward via Email"
                              >
                                <Mail className="w-3 h-3" /> Email
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: BULK PRICING */}
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

              {/* TAB 7: OUTLET SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-petrol-950/70 p-6 rounded-2xl border border-petrol-800 space-y-4">
                    <h3 className="font-serif font-bold text-lg text-white">Restaurant & Notification Settings</h3>

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
                        <label className="block text-slate-300 font-semibold mb-1">Superuser Alert Email</label>
                        <input
                          type="email"
                          value={settingsForm.superuserEmail || 'salamiabdullahi247@gmail.com'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, superuserEmail: e.target.value })}
                          className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Audit log reports and manager activity alerts will be sent here.</p>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">WhatsApp Order & Alert Number</label>
                        <input
                          type="text"
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Orders from the cart and emergency alerts compile directly to this phone number.</p>
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
                            if (window.confirm('Reset all menu items, staff, users, and settings back to factory defaults?')) {
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

      {/* ================= MODAL 1: ADD / EDIT PRODUCT ================= */}
      {(isAddingNew || editingItem) && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            onClick={() => { setIsAddingNew(false); setEditingItem(null); }} 
            className="fixed inset-0 bg-petrol-950/85 backdrop-blur-md" 
          />
          <div className="relative w-full max-w-lg bg-petrol-900 border border-mustard/40 rounded-3xl p-6 z-10 text-white space-y-4 my-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-petrol-800 pb-3">
              <h3 className="font-serif font-bold text-lg">
                {isAddingNew ? 'Add New Menu Item' : `Edit: ${editingItem.name}`}
              </h3>
              <button 
                type="button"
                onClick={() => { setIsAddingNew(false); setEditingItem(null); }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dish Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name || ''}
                  placeholder="e.g. Special Ofada Rice Combo or Steaming Amala Dudu"
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ({currency}) *</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingItem?.price || 2500}
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dining Channel *</label>
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
                  <label className="block text-slate-300 font-semibold mb-1">Preparation Time</label>
                  <input
                    type="text"
                    name="prepTime"
                    defaultValue={editingItem?.prepTime || '12-15 mins'}
                    placeholder="e.g. 5 mins or 15 mins"
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dish Description *</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingItem?.description || ''}
                  placeholder="Ingredients, preparation style, and accompaniments..."
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dish Options / Accompaniments (Comma-separated)</label>
                <input
                  type="text"
                  name="options"
                  defaultValue={editingItem?.options ? editingItem.options.join(', ') : ''}
                  placeholder="e.g. Egusi Soup, Efo Riro, Ogbono Soup"
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
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
                  <span className="text-slate-300">In Stock (Available for ordering)</span>
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
                  className="px-5 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD / EDIT STAFF ================= */}
      {(isAddingStaff || editingStaff) && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            onClick={() => { setIsAddingStaff(false); setEditingStaff(null); }} 
            className="fixed inset-0 bg-petrol-950/85 backdrop-blur-md" 
          />
          <div className="relative w-full max-w-lg bg-petrol-900 border border-mustard/40 rounded-3xl p-6 z-10 text-white space-y-4 my-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-petrol-800 pb-3">
              <h3 className="font-serif font-bold text-lg">
                {isAddingStaff ? 'Add Staff Leader Profile' : `Edit: ${editingStaff.name}`}
              </h3>
              <button 
                type="button"
                onClick={() => { setIsAddingStaff(false); setEditingStaff(null); }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
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
                  <label className="block text-slate-300 font-semibold mb-1">Role / Designation *</label>
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
                <label className="block text-slate-300 font-semibold mb-1">Biography / Experience *</label>
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
                  className="px-5 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: ADD / EDIT AMBIENCE MEDIA ================= */}
      {(isAddingMedia || editingMedia) && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            onClick={() => { setIsAddingMedia(false); setEditingMedia(null); }} 
            className="fixed inset-0 bg-petrol-950/85 backdrop-blur-md" 
          />
          <div className="relative w-full max-w-lg bg-petrol-900 border border-mustard/40 rounded-3xl p-6 z-10 text-white space-y-4 my-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-petrol-800 pb-3">
              <h3 className="font-serif font-bold text-lg">
                {isAddingMedia ? 'Add Kitchen / Ambience Media' : `Edit: ${editingMedia.title}`}
              </h3>
              <button 
                type="button"
                onClick={() => { setIsAddingMedia(false); setEditingMedia(null); }} 
                className="text-slate-400 hover:text-white"
              >
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
                <label className="block text-slate-300 font-semibold mb-1">Headline / Title *</label>
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
                <label className="block text-slate-300 font-semibold mb-1">Category *</label>
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
                <label className="block text-slate-300 font-semibold mb-1">Caption / Description *</label>
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
                    <label className="block text-slate-300 font-semibold mb-1">Video URL (MP4 link or YouTube URL) *</label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={mediaVideoUrl}
                      onChange={(e) => setMediaVideoUrl(e.target.value)}
                      placeholder="https://assets.mixkit.co/videos/...mp4"
                      className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Video Thumbnail Cover</label>
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
                  className="px-5 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: ADD / EDIT USER ACCESS ================= */}
      {(isAddingUser || editingUser) && isSuperuser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            onClick={() => { setIsAddingUser(false); setEditingUser(null); }} 
            className="fixed inset-0 bg-petrol-950/85 backdrop-blur-md" 
          />
          <div className="relative w-full max-w-lg bg-petrol-900 border border-mustard/40 rounded-3xl p-6 z-10 text-white space-y-4 my-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-petrol-800 pb-3">
              <h3 className="font-serif font-bold text-lg">
                {isAddingUser ? 'Grant User Access' : `Edit User: ${editingUser.name}`}
              </h3>
              <button 
                type="button"
                onClick={() => { setIsAddingUser(false); setEditingUser(null); }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">User Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingUser?.name || ''}
                    placeholder="e.g. John Adeola"
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingUser?.title || 'Branch Operations Manager'}
                    placeholder="e.g. Restaurant Manager"
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Login Email *</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser?.email || ''}
                    placeholder="manager@romeegobite.com"
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Login Password / PIN *</label>
                  <input
                    type="text"
                    name="password"
                    defaultValue={editingUser?.password || '1234'}
                    placeholder="Set password"
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Access Role</label>
                  <select
                    name="role"
                    defaultValue={editingUser?.role || 'manager'}
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  >
                    <option value="manager">👔 General Manager</option>
                    <option value="kitchen">🍳 Kitchen Supervisor</option>
                    <option value="cashier">💼 Cashier & Orders</option>
                    <option value="superuser">👑 Superuser</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Account Status</label>
                  <select
                    name="status"
                    defaultValue={editingUser?.status || 'active'}
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  >
                    <option value="active">Active (Permitted)</option>
                    <option value="disabled">Disabled (Blocked)</option>
                  </select>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="pt-2 border-t border-petrol-800 space-y-2">
                <label className="text-slate-300 font-semibold block">Authorized Permissions:</label>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="perm_menu"
                      defaultChecked={editingUser?.permissions.includes('menu') || editingUser?.permissions.includes('all') || true}
                      className="rounded text-mustard focus:ring-0"
                    />
                    <span>Manage Menu Dishes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="perm_pricing"
                      defaultChecked={editingUser?.permissions.includes('pricing') || editingUser?.permissions.includes('all') || true}
                      className="rounded text-mustard focus:ring-0"
                    />
                    <span>Update Prices</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="perm_staff"
                      defaultChecked={editingUser?.permissions.includes('staff') || editingUser?.permissions.includes('all') || true}
                      className="rounded text-mustard focus:ring-0"
                    />
                    <span>Edit Staff Profiles</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="perm_ambience"
                      defaultChecked={editingUser?.permissions.includes('ambience') || editingUser?.permissions.includes('all') || true}
                      className="rounded text-mustard focus:ring-0"
                    />
                    <span>Upload Ambience Media</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-petrol-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddingUser(false); setEditingUser(null); }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Save Access Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: CUSTOM CONFIRM DELETE MODAL ================= */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div 
            onClick={() => setDeleteConfirmation(null)} 
            className="fixed inset-0 bg-petrol-950/90 backdrop-blur-md" 
          />
          <div className="relative w-full max-w-sm bg-petrol-900 border border-red-500/50 rounded-3xl p-6 z-10 text-white space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-white">Confirm Delete</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {deleteConfirmation.message}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-xl bg-petrol-950 text-slate-300 hover:text-white text-xs font-bold border border-petrol-800"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={deleteConfirmation.onConfirm}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-md"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
