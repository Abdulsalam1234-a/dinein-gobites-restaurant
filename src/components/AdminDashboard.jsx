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
  ExternalLink,
  Download,
  Copy,
  Check,
  ShieldAlert,
  MapPin,
  Palette,
  Megaphone
} from 'lucide-react';
import { 
  createSuperuserWhatsAppUrl, 
  createSuperuserMailtoUrl,
  exportAllRestaurantData,
  importAllRestaurantData
} from '../utils/storage';
import { SEASONAL_THEMES } from '../utils/theme';
import {
  detectSqlInjection,
  detectXss,
  sanitizeInput,
  validateAndSanitizeFormData,
  hashPassword,
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  createSecureSession,
  validateSession
} from '../utils/security';

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
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.user || parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'staff' | 'ambience' | 'users' | 'audit' | 'pricing' | 'settings'

  // Security & Threat Alerts
  const [securityThreatAlert, setSecurityThreatAlert] = useState(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  // Confirmation Delete Modal
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { type, id, title, action }

  // Password Change Modal
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // Production Code Export Modal
  const [showCodeExportModal, setShowCodeExportModal] = useState(false);
  const [copiedCodeNotice, setCopiedCodeNotice] = useState(false);

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

  // Session Inactivity Verification Loop
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        const validation = validateSession();
        if (validation && validation.expired) {
          setCurrentUser(null);
          showToast('Session expired after 30 minutes of inactivity for security.');
        }
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const isSuperuser = currentUser?.role === 'superuser';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const triggerAudit = (action, details) => {
    onAddAuditLog(action, details, currentUser);
  };

  // ================= SECURE AUTHENTICATION HANDLER =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    try {
      // 1. Check rate-limit / brute-force lockout
      const rateCheck = checkRateLimit(cleanEmail);
      if (!rateCheck.allowed) {
        setAuthError(`Account temporarily locked due to 5 consecutive failed attempts. Please wait ${Math.ceil(rateCheck.remainingSeconds / 60)} minutes.`);
        setIsLoggingIn(false);
        return;
      }

      // 2. Scan input for SQL injection patterns
      const sqliCheck = detectSqlInjection(cleanEmail) || detectSqlInjection(cleanPassword);
      if (sqliCheck.isSuspicious) {
        triggerAudit('SECURITY_THREAT_BLOCKED', `SQL Injection pattern blocked on admin login: ${sqliCheck.offendingSnippet}`);
        setAuthError('Access Denied: Malicious pattern detected in login credentials.');
        setIsLoggingIn(false);
        return;
      }

      // 3. Locate user
      const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!found) {
        const failRecord = recordFailedAttempt(cleanEmail);
        triggerAudit('LOGIN_FAILED', `Failed login attempt for unknown email: ${cleanEmail}`);
        setAuthError(`Invalid credentials. ${Math.max(0, 5 - failRecord.attempts)} attempt(s) remaining before temporary lockout.`);
        setIsLoggingIn(false);
        return;
      }

      if (found.status === 'disabled') {
        setAuthError('This account has been disabled by the Superuser.');
        setIsLoggingIn(false);
        return;
      }

      // 4. Verify password with Salted Hash / Legacy plaintext support
      const isMatch = await verifyPassword(cleanPassword, found.password);
      if (!isMatch) {
        const failRecord = recordFailedAttempt(cleanEmail);
        triggerAudit('LOGIN_FAILED', `Failed password attempt for user: ${cleanEmail}`);
        if (failRecord.isLocked) {
          triggerAudit('ACCOUNT_LOCKED', `Account ${cleanEmail} locked out due to brute force limits`);
          setAuthError('Security Alert: Account has been temporarily locked for 10 minutes due to 5 failed attempts.');
        } else {
          setAuthError(`Invalid credentials. ${Math.max(0, 5 - failRecord.attempts)} attempt(s) remaining before temporary lockout.`);
        }
        setIsLoggingIn(false);
        return;
      }

      // 5. Success! Clear brute-force records
      clearRateLimit(cleanEmail);

      // Auto-upgrade legacy plaintext password to salted SHA-256 hash if needed
      if (!found.password.includes(':')) {
        const upgradedHash = await hashPassword(cleanPassword);
        const updatedUsers = users.map((u) => (u.id === found.id ? { ...u, password: upgradedHash } : u));
        onUpdateUsers(updatedUsers);
        found.password = upgradedHash;
      }

      // 6. Create secure session token
      const session = createSecureSession(found);
      setCurrentUser(session.user);
      triggerAudit('LOGIN_SUCCESSFUL', `${found.name} signed into Admin Portal as ${found.role.toUpperCase()}`);
      showToast(`Welcome back, ${found.name}! Session authenticated.`);
    } catch (err) {
      console.error(err);
      setAuthError('An authentication error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('romee_current_admin_user');
    setEmailInput('salamiabdullahi247@gmail.com');
    setPasswordInput('1234');
    showToast('You have been logged out securely.');
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
    setSecurityThreatAlert(null);
  };

  const handleOpenEditProduct = (item) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setCurrentImageValue(item.image || '');
    setImageSourceMode(item.image?.startsWith('data:') ? 'upload' : 'url');
    setSecurityThreatAlert(null);
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
                       formData.get('image')?.toString() || 
                       'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

    // Anti-SQLi & Anti-XSS validation
    const validation = validateAndSanitizeFormData({
      name: formData.get('name')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      channel: formData.get('channel')?.toString() || '',
      prepTime: formData.get('prepTime')?.toString() || '',
      badge: formData.get('badge')?.toString() || '',
      options: formData.get('options')?.toString() || '',
      image: finalImage,
    });

    if (!validation.valid) {
      setSecurityThreatAlert(validation);
      triggerAudit('SECURITY_THREAT_BLOCKED', validation.error);
      return;
    }

    const { sanitized } = validation;
    const rawOptions = sanitized.options || '';
    const parsedOptions = rawOptions
      ? rawOptions.split(',').map((o) => o.trim()).filter(Boolean)
      : (editingItem?.options || []);

    const productData = {
      id: editingItem?.id || `custom-${Date.now()}`,
      name: sanitized.name,
      description: sanitized.description,
      price: Math.max(100, Number(formData.get('price')) || 1000),
      category: sanitized.category || 'Combos',
      channel: sanitized.channel || 'gobites',
      image: sanitized.image,
      isAvailable: formData.get('isAvailable') === 'on',
      isSpicy: formData.get('isSpicy') === 'on',
      prepTime: sanitized.prepTime || '15 mins',
      badge: sanitized.badge || '',
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
    setSecurityThreatAlert(null);
  };

  // ================= 2. STAFF LEADERSHIP CRUD =================
  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setIsAddingStaff(true);
    setStaffImageValue('');
    setStaffImageMode('upload');
    setSecurityThreatAlert(null);
  };

  const handleOpenEditStaff = (staff) => {
    setEditingStaff(staff);
    setIsAddingStaff(false);
    setStaffImageValue(staff.image || '');
    setStaffImageMode(staff.image?.startsWith('data:') ? 'upload' : 'url');
    setSecurityThreatAlert(null);
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
                       formData.get('image')?.toString() || 
                       'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80';

    // Anti-SQLi & Anti-XSS validation
    const validation = validateAndSanitizeFormData({
      name: formData.get('name')?.toString() || '',
      role: formData.get('role')?.toString() || '',
      department: formData.get('department')?.toString() || '',
      bio: formData.get('bio')?.toString() || '',
      quote: formData.get('quote')?.toString() || '',
      image: finalImage,
    });

    if (!validation.valid) {
      setSecurityThreatAlert(validation);
      triggerAudit('SECURITY_THREAT_BLOCKED', validation.error);
      return;
    }

    const { sanitized } = validation;
    const staffData = {
      id: editingStaff?.id || `staff-${Date.now()}`,
      name: sanitized.name,
      role: sanitized.role,
      department: sanitized.department || 'Leadership',
      bio: sanitized.bio,
      quote: sanitized.quote,
      priority: Number(formData.get('priority')) || 99,
      image: sanitized.image,
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
    setSecurityThreatAlert(null);
  };

  // ================= 3. AMBIENCE & MEDIA CRUD =================
  const handleOpenAddMedia = () => {
    setEditingMedia(null);
    setIsAddingMedia(true);
    setMediaTypeMode('image');
    setMediaImageMode('upload');
    setMediaImageValue('');
    setMediaVideoUrl('');
    setSecurityThreatAlert(null);
  };

  const handleOpenEditMedia = (media) => {
    setEditingMedia(media);
    setIsAddingMedia(false);
    setMediaTypeMode(media.type || 'image');
    setMediaImageValue(media.url || '');
    setMediaVideoUrl(media.type === 'video' ? media.url : '');
    setMediaImageMode(media.url?.startsWith('data:') ? 'upload' : 'url');
    setSecurityThreatAlert(null);
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
      finalThumbnail = mediaImageValue || formData.get('thumbnailUrl')?.toString() || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80';
    } else {
      finalUrl = mediaImageValue || formData.get('imageUrl')?.toString().trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80';
    }

    // Anti-SQLi & Anti-XSS validation
    const validation = validateAndSanitizeFormData({
      title: formData.get('title')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      caption: formData.get('caption')?.toString() || '',
      url: finalUrl,
      thumbnail: finalThumbnail,
    });

    if (!validation.valid) {
      setSecurityThreatAlert(validation);
      triggerAudit('SECURITY_THREAT_BLOCKED', validation.error);
      return;
    }

    const { sanitized } = validation;
    const mediaData = {
      id: editingMedia?.id || `amb-${Date.now()}`,
      type: mediaTypeMode,
      title: sanitized.title,
      category: sanitized.category || 'kitchen',
      caption: sanitized.caption,
      url: sanitized.url,
      thumbnail: sanitized.thumbnail,
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
    setSecurityThreatAlert(null);
  };

  // ================= 4. USER ACCESS MANAGEMENT =================
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setIsAddingUser(true);
    setSecurityThreatAlert(null);
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setIsAddingUser(false);
    setSecurityThreatAlert(null);
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

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rawEmail = formData.get('email')?.toString().trim().toLowerCase();
    const rawPassword = formData.get('password')?.toString().trim();
    const rawName = formData.get('name')?.toString().trim();
    const rawRole = formData.get('role')?.toString().trim() || 'manager';
    const rawTitle = formData.get('title')?.toString().trim() || 'Management Staff';
    const rawStatus = formData.get('status')?.toString().trim() || 'active';

    // Anti-SQLi & Anti-XSS validation
    const validation = validateAndSanitizeFormData({
      email: rawEmail,
      name: rawName,
      title: rawTitle,
    });

    if (!validation.valid) {
      setSecurityThreatAlert(validation);
      triggerAudit('SECURITY_THREAT_BLOCKED', validation.error);
      return;
    }

    const { sanitized } = validation;

    const permissions = [];
    if (formData.get('perm_menu') === 'on') permissions.push('menu');
    if (formData.get('perm_pricing') === 'on') permissions.push('pricing');
    if (formData.get('perm_staff') === 'on') permissions.push('staff');
    if (formData.get('perm_ambience') === 'on') permissions.push('ambience');
    if (formData.get('perm_audit') === 'on') permissions.push('audit');
    if (rawRole === 'superuser') permissions.push('all');

    // Securely hash password if newly provided
    let finalPassword = editingUser?.password || '1234';
    if (rawPassword) {
      finalPassword = await hashPassword(rawPassword);
    }

    const userData = {
      id: editingUser?.id || `user-${Date.now()}`,
      email: sanitized.email,
      password: finalPassword,
      name: sanitized.name,
      role: rawRole,
      title: sanitized.title,
      permissions,
      status: rawStatus,
      createdAt: editingUser?.createdAt || new Date().toISOString().split('T')[0],
    };

    let updated;
    if (isAddingUser) {
      if (users.some((u) => u.email.toLowerCase() === userData.email)) {
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
    setSecurityThreatAlert(null);
  };

  // ================= 5. SECURE PASSWORD CHANGE =================
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordChangeError('');

    const { currentPassword, newPassword, confirmPassword } = changePasswordForm;

    if (!newPassword || newPassword.length < 6) {
      setPasswordChangeError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError('New passwords do not match. Please retype carefully.');
      return;
    }

    // Find current user object
    const userInDb = users.find((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());
    if (!userInDb) {
      setPasswordChangeError('User account not found.');
      return;
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, userInDb.password);
    if (!isCurrentValid) {
      setPasswordChangeError('Current password is incorrect.');
      triggerAudit('SECURITY_PASSWORD_CHANGE_FAILED', `Failed attempt to change password for ${currentUser.email}`);
      return;
    }

    // Hash and save new password
    const newHash = await hashPassword(newPassword);
    const updatedUsers = users.map((u) => (u.id === userInDb.id ? { ...u, password: newHash } : u));
    onUpdateUsers(updatedUsers);

    triggerAudit('SECURITY_PASSWORD_CHANGED', `Password successfully updated and hashed for ${currentUser.email}`);
    setIsChangingPassword(false);
    setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password changed successfully! Next login will require your new password.');
  };

  // ================= 6. BULK PRICING =================
  const handleSaveQuickPrices = () => {
    const updated = menuItems.map((item) => {
      if (priceFormState[item.id] !== undefined) {
        return { ...item, price: Math.max(100, Number(priceFormState[item.id])) };
      }
      return item;
    });
    onUpdateMenuItems(updated);
    triggerAudit('BULK_PRICE_UPDATE', `Updated prices across ${Object.keys(priceFormState).length} dish(es)`);
    setPriceSaveNotice(true);
    showToast('All prices updated and saved live!');
    setTimeout(() => setPriceSaveNotice(false), 2500);
  };

  // ================= 7. SETTINGS =================
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const validation = validateAndSanitizeFormData({
      restaurantName: settingsForm.restaurantName,
      superuserEmail: settingsForm.superuserEmail,
      whatsappNumber: settingsForm.whatsappNumber,
      dineInAddress: settingsForm.dineInAddress,
      dineInHours: settingsForm.dineInHours,
      goBitesAddress: settingsForm.goBitesAddress,
      goBitesHours: settingsForm.goBitesHours,
      welcomeHeadline: settingsForm.welcomeHeadline,
      welcomeSubtitle: settingsForm.welcomeSubtitle,
      welcomePromoText: settingsForm.welcomePromoText,
    });

    if (!validation.valid) {
      setSecurityThreatAlert(validation);
      triggerAudit('SECURITY_THREAT_BLOCKED', validation.error);
      return;
    }

    onUpdateSettings(settingsForm);
    triggerAudit('UPDATE_SETTINGS', `Updated restaurant settings: theme=${settingsForm.theme || 'classic'}, outlets & business info`);
    setSettingsSavedNotice(true);
    showToast('Restaurant settings, theme & outlet info saved live!');
    setTimeout(() => setSettingsSavedNotice(false), 2500);
  };

  // ================= 8. PRODUCTION CONFIG EXPORT / IMPORT =================
  const handleDownloadBackupJson = () => {
    const data = exportAllRestaurantData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `romee-restaurant-production-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerAudit('BACKUP_EXPORTED', 'Superuser downloaded full production JSON config backup.');
    showToast('Production backup downloaded!');
  };

  const handleImportBackupJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const result = importAllRestaurantData(parsed);
        if (result.success) {
          onUpdateMenuItems(result.menu);
          onUpdateSettings(result.settings);
          onUpdateStaff(result.staff);
          onUpdateAmbience(result.ambience);
          onUpdateUsers(result.users);
          triggerAudit('BACKUP_RESTORED', 'Superuser restored restaurant configuration from file.');
          showToast('Data imported and restored successfully!');
        } else {
          alert('Failed to import backup: ' + result.error);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
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
                  Production Hardened
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                SQLi & XSS Shield Active • Salted SHA-256 Auth • Live Role Access & Audit
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

        {/* Security Threat Alert Banner (If SQLi / XSS was caught and blocked) */}
        {securityThreatAlert && (
          <div className="bg-red-950 border-b border-red-500 px-4 py-3 shrink-0 flex items-start justify-between gap-3 text-xs text-red-200">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-300 block font-bold">{securityThreatAlert.error}</strong>
                <p className="text-[11px] text-red-400 mt-0.5 font-mono">
                  Offending sequence blocked: "{securityThreatAlert.threatDetails?.offendingSnippet}"
                </p>
              </div>
            </div>
            <button
              onClick={() => setSecurityThreatAlert(null)}
              className="text-red-400 hover:text-white font-bold p-1"
            >
              ✕
            </button>
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
                <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold mt-2 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Brute-force protection & Anti-injection shield active</span>
                </div>
              </div>

              {/* Quick Fill Preset Pills */}
              <div className="bg-petrol-900/80 p-3 rounded-2xl border border-petrol-800 text-left space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Verified Administrator Credentials:
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
                    Superuser Email Address
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
                    Superuser Password / PIN
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
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.01] disabled:opacity-50"
                >
                  {isLoggingIn ? 'Verifying Credentials...' : 'Sign In to Management Portal'}
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
                    <span>User Roles ({users.length})</span>
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
                  <span>Production Settings</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-xs text-mustard hover:text-white py-1.5 px-3 rounded-lg hover:bg-petrol-800 transition-colors flex items-center gap-1.5 whitespace-nowrap border border-mustard/30"
                  title="Change Password"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Change Password</span>
                </button>

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

              {/* TAB 4: USER ACCESS CONTROL */}
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

              {/* TAB 5: AUDIT TRAIL */}
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
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider font-mono ${
                                log.action.includes('SECURITY') || log.action.includes('LOCKED')
                                  ? 'bg-red-950 text-red-300 border border-red-700'
                                  : 'bg-mustard/20 text-mustard border border-mustard/40'
                              }`}>
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

              {/* TAB 7: PRODUCTION SETTINGS & SYNC TOOLS */}
              {activeTab === 'settings' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  
                  {/* Settings Form */}
                  <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">

                    {/* SECTION A: SEASONAL AESTHETIC & FESTIVE THEMES */}
                    <div className="bg-petrol-950/70 p-6 rounded-2xl border border-petrol-800 space-y-4">
                      <div className="flex items-center gap-2 text-mustard">
                        <Palette className="w-5 h-5" />
                        <h3 className="font-serif font-bold text-base text-white">Seasonal Aesthetic & Festive Themes</h3>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Select a seasonal theme to instantly update the entire website's visual atmosphere, banner announcements, and celebration badges across all visitor screens.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                        {Object.values(SEASONAL_THEMES).map((th) => {
                          const isSelected = (settingsForm.theme || 'classic') === th.id;
                          return (
                            <div
                              key={th.id}
                              onClick={() => setSettingsForm({ ...settingsForm, theme: th.id })}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-left select-none ${
                                isSelected
                                  ? 'bg-petrol-900 border-mustard shadow-md ring-2 ring-mustard/40'
                                  : 'bg-petrol-950/90 border-petrol-800 hover:border-slate-600 hover:bg-petrol-900/60'
                              }`}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-xl">{th.icon}</span>
                                  {isSelected && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-mustard text-petrol-950">
                                      Active Theme
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-serif font-bold text-sm text-white">{th.name}</h4>
                                <p className="text-[11px] text-slate-400 line-clamp-2">{th.tagline}</p>
                              </div>

                              <div className="pt-3 border-t border-petrol-800/80 mt-2 flex items-center justify-between text-[10px]">
                                <span className={`px-2 py-0.5 rounded-md border ${th.accentBadge}`}>
                                  Preview Accent
                                </span>
                                <span className="text-slate-400 font-mono text-[9px]">{th.accentColor}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SECTION B: PHYSICAL OUTLETS & GOOGLE BUSINESS MAPPING */}
                    <div className="bg-petrol-950/70 p-6 rounded-2xl border border-petrol-800 space-y-5">
                      <div className="flex items-center gap-2 text-mustard">
                        <MapPin className="w-5 h-5" />
                        <h3 className="font-serif font-bold text-base text-white">Physical Outlets & Google Business Mapping</h3>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Customize the exact physical addresses, opening hours, Google Maps direction links, and interactive embed maps for both of your restaurant branches without writing code.
                      </p>

                      {/* Outlet 1: Dine-In Hub */}
                      <div className="p-4 rounded-xl bg-petrol-900/80 border border-petrol-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-mustard uppercase tracking-wider flex items-center gap-1.5">
                            <UtensilsCrossed className="w-4 h-4" />
                            <span>Outlet 1: Dine-In Lounge (Swallows & Seating)</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Branch Display Name</label>
                            <input
                              type="text"
                              value={settingsForm.dineInName || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, dineInName: e.target.value })}
                              placeholder="Victoria Island / Lekki Flagship Hub"
                              className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Operating Hours</label>
                            <input
                              type="text"
                              value={settingsForm.dineInHours || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, dineInHours: e.target.value })}
                              placeholder="Monday - Sunday: 8:00 AM – 10:30 PM"
                              className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Full Physical Street Address</label>
                          <input
                            type="text"
                            value={settingsForm.dineInAddress || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, dineInAddress: e.target.value })}
                            placeholder="Plot 14B, Admiralty Way / Adeola Odeku Corridor, Victoria Island, Lagos"
                            className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Google Maps Directions URL</label>
                            <input
                              type="text"
                              value={settingsForm.dineInGoogleMapsUrl || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, dineInGoogleMapsUrl: e.target.value })}
                              placeholder="https://maps.google.com/?q=Victoria+Island+Lagos"
                              className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Google Maps Embed Iframe URL</label>
                            <input
                              type="text"
                              value={settingsForm.dineInEmbedMap || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, dineInEmbedMap: e.target.value })}
                              placeholder="https://www.google.com/maps/embed?pb=..."
                              className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Outlet 2: Go-Bites Express Hub */}
                      <div className="p-4 rounded-xl bg-petrol-900/80 border border-petrol-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>Outlet 2: Go-Bites Express Takeaway Depot</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Branch Display Name</label>
                            <input
                              type="text"
                              value={settingsForm.goBitesName || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, goBitesName: e.target.value })}
                              placeholder="Mainland Express Dispatch Depot"
                              className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Operating Hours</label>
                            <input
                              type="text"
                              value={settingsForm.goBitesHours || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, goBitesHours: e.target.value })}
                              placeholder="Mon - Sat: 7:30 AM – 9:00 PM (Sundays: 12 PM - 8 PM)"
                              className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Full Physical Street Address</label>
                          <input
                            type="text"
                            value={settingsForm.goBitesAddress || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, goBitesAddress: e.target.value })}
                            placeholder="42 Allen Avenue (Opposite Oshopey Plaza), Ikeja, Lagos"
                            className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Google Maps Directions URL</label>
                            <input
                              type="text"
                              value={settingsForm.goBitesGoogleMapsUrl || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, goBitesGoogleMapsUrl: e.target.value })}
                              placeholder="https://maps.google.com/?q=Allen+Avenue+Ikeja+Lagos"
                              className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Google Maps Embed Iframe URL</label>
                            <input
                              type="text"
                              value={settingsForm.goBitesEmbedMap || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, goBitesEmbedMap: e.target.value })}
                              placeholder="https://www.google.com/maps/embed?pb=..."
                              className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* SECTION C: WELCOME ANNOUNCEMENT POP-UP MODAL */}
                    <div className="bg-petrol-950/70 p-6 rounded-2xl border border-petrol-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-mustard">
                          <Megaphone className="w-5 h-5" />
                          <h3 className="font-serif font-bold text-base text-white">Visitor Welcome Pop-up Modal</h3>
                        </div>

                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={settingsForm.welcomePopupEnabled !== false}
                            onChange={(e) => setSettingsForm({ ...settingsForm, welcomePopupEnabled: e.target.checked })}
                            className="w-4 h-4 rounded text-mustard focus:ring-mustard border-petrol-700 bg-petrol-900"
                          />
                          <span className={settingsForm.welcomePopupEnabled !== false ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                            {settingsForm.welcomePopupEnabled !== false ? 'Popup Active' : 'Popup Disabled'}
                          </span>
                        </label>
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed">
                        Greet visitors immediately with a personalized greeting, special seasonal promotion, or meal discount when they arrive at the website.
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Welcome Headline</label>
                          <input
                            type="text"
                            value={settingsForm.welcomeHeadline || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, welcomeHeadline: e.target.value })}
                            placeholder="Welcome to ROMEE Go-Bite Eatery! 🍲"
                            className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Welcome Subtitle Description</label>
                          <input
                            type="text"
                            value={settingsForm.welcomeSubtitle || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, welcomeSubtitle: e.target.value })}
                            placeholder="Home of authentic swallows & rapid express takeaway favorites."
                            className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Promotion Tag Badge</label>
                            <input
                              type="text"
                              value={settingsForm.welcomePromoBadge || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, welcomePromoBadge: e.target.value })}
                              placeholder="🔥 Special Welcome Offer"
                              className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Call to Action Button Label</label>
                            <input
                              type="text"
                              value={settingsForm.welcomeButtonText || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, welcomeButtonText: e.target.value })}
                              placeholder="Explore Menu & Order Now"
                              className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Promotional Text / Discount Details</label>
                          <textarea
                            rows={2}
                            value={settingsForm.welcomePromoText || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, welcomePromoText: e.target.value })}
                            placeholder="Enjoy complimentary packaging on takeaway orders above ₦10,000!"
                            className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION D: GENERAL RESTAURANT DETAILS & PRICING POLICIES */}
                    <div className="bg-petrol-950/70 p-6 rounded-2xl border border-petrol-800 space-y-4">
                      <h3 className="font-serif font-bold text-base text-white">General Restaurant Details & Ordering Policies</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Restaurant Legal Name</label>
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
                          <p className="text-[10px] text-slate-400 mt-1">Audit log reports and security threat alerts will be routed here.</p>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">WhatsApp Orders & Notifications Hotline</label>
                          <input
                            type="text"
                            value={settingsForm.whatsappNumber}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                            className="w-full bg-petrol-900 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">Client cart orders compile directly to this phone number.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Dine-In Service Charge ({currency})</label>
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
                      </div>
                    </div>

                    {settingsSavedNotice && (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center text-xs">
                        ✓ All settings, seasonal theme, physical addresses, and popup configs saved successfully!
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold uppercase tracking-wider text-xs shadow-lg transition-transform hover:scale-[1.01]"
                      >
                        Save All Settings & Themes
                      </button>
                    </div>

                  </form>

                  {/* Production Deployment & Data Backup Tools */}
                  <div className="bg-petrol-950/70 p-6 rounded-2xl border border-mustard/30 space-y-4">
                    <div className="flex items-center gap-2 text-mustard">
                      <Download className="w-5 h-5" />
                      <h3 className="font-serif font-bold text-base text-white">Production Data Backup & Multi-Device Sync</h3>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Download your entire customized restaurant configuration (dishes, prices, staff, media, settings) as a verified JSON file, or restore it on any other phone, tablet, or browser.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={handleDownloadBackupJson}
                        className="px-4 py-2.5 rounded-xl bg-petrol-900 hover:bg-petrol-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-petrol-700 shadow-sm"
                      >
                        <Download className="w-4 h-4 text-mustard" />
                        <span>Download Production Backup (.json)</span>
                      </button>

                      <label className="px-4 py-2.5 rounded-xl bg-petrol-900 hover:bg-petrol-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-petrol-700 shadow-sm cursor-pointer">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>Restore Data from Backup</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackupJson}
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={() => setShowCodeExportModal(true)}
                        className="px-4 py-2.5 rounded-xl bg-petrol-900 hover:bg-petrol-800 text-mustard font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-mustard/40 shadow-sm"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Export Live Code Snippet</span>
                      </button>
                    </div>
                  </div>

                  {/* Factory Reset */}
                  <div className="bg-red-950/30 p-6 rounded-2xl border border-red-900/40 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-red-300">Reset System to Defaults</h4>
                      <p className="text-xs text-slate-400">Restores all original menu items, default staff, and baseline settings.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('WARNING: Reset all menu items, staff profiles, and settings back to factory defaults?')) {
                          onResetDefaults();
                          onClose();
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 font-bold text-xs uppercase tracking-wider border border-red-800 flex items-center gap-1.5 shrink-0"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>Factory Reset</span>
                    </button>
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
                    placeholder={editingUser ? "Leave blank to keep unchanged" : "Set password"}
                    className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                    required={!editingUser}
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

      {/* ================= MODAL 6: CHANGE PASSWORD MODAL ================= */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div 
            onClick={() => setIsChangingPassword(false)} 
            className="fixed inset-0 bg-petrol-950/90 backdrop-blur-md" 
          />
          <div className="relative w-full max-w-md bg-petrol-900 border border-mustard/40 rounded-3xl p-6 z-10 text-white space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-petrol-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-mustard" />
                <h3 className="font-serif font-bold text-lg text-white">Update Password</h3>
              </div>
              <button
                onClick={() => setIsChangingPassword(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Password *</label>
                <input
                  type="password"
                  value={changePasswordForm.currentPassword}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Secure Password *</label>
                <input
                  type="password"
                  value={changePasswordForm.newPassword}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  value={changePasswordForm.confirmPassword}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-mustard"
                  required
                />
              </div>

              {passwordChangeError && (
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs">
                  {passwordChangeError}
                </div>
              )}

              <div className="pt-3 border-t border-petrol-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 7: CODE EXPORT FOR PERMANENT PRODUCTION BUILD ================= */}
      {showCodeExportModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div 
            onClick={() => setShowCodeExportModal(false)} 
            className="fixed inset-0 bg-petrol-950/90 backdrop-blur-md" 
          />
          <div className="relative w-full max-w-3xl bg-petrol-900 border border-mustard/40 rounded-3xl p-6 z-10 text-white space-y-4 shadow-2xl text-left max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-petrol-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-mustard" />
                <h3 className="font-serif font-bold text-lg text-white">Permanent Production Code Export</h3>
              </div>
              <button
                onClick={() => setShowCodeExportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 shrink-0">
              To bake your customized dishes directly into the website's source code for every visitor across the internet (even without browser local storage), copy the code below into <code className="text-mustard font-mono">src/data/initialMenu.js</code>:
            </p>

            <div className="flex-1 overflow-y-auto bg-petrol-950 p-4 rounded-2xl border border-petrol-800 font-mono text-[11px] text-slate-300 select-all">
              <pre>{`export const INITIAL_MENU_ITEMS = ${JSON.stringify(menuItems, null, 2)};`}</pre>
            </div>

            <div className="pt-3 border-t border-petrol-800 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                {menuItems.length} active dishes ready for permanent production deployment
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`export const INITIAL_MENU_ITEMS = ${JSON.stringify(menuItems, null, 2)};`);
                    setCopiedCodeNotice(true);
                    setTimeout(() => setCopiedCodeNotice(false), 2500);
                  }}
                  className="px-4 py-2 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  {copiedCodeNotice ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCodeNotice ? 'Copied to Clipboard!' : 'Copy Code Snippet'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
