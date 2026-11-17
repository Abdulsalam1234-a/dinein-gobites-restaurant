import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  Repeat, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Edit2,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  loadCustomerOrdersFromStorage, 
  saveCurrentCustomer, 
  updateCustomerProfile 
} from '../utils/storage';
import { 
  isFirebaseConfigured, 
  subscribeToCustomerOrders, 
  signOutCustomerFromFirebase,
  saveCustomerProfileToCloud 
} from '../utils/firebase';

export const CustomerAccountDrawer = ({
  isOpen,
  onClose,
  customer,
  onLogout,
  onReOrder, // function(itemsArray)
  currency = '₦',
  onNavigateMenu,
}) => {
  const [orders, setOrders] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [profileNotice, setProfileNotice] = useState('');

  // Load customer orders from storage and Firebase Firestore
  useEffect(() => {
    if (!customer || !customer.uid) return;

    setProfileForm({
      name: customer.name || '',
      phone: customer.phone || '',
      address: customer.address || 'Adebayo, Ado-Ekiti',
    });

    // 1. Initial load from local storage
    const storedOrders = loadCustomerOrdersFromStorage(customer.uid);
    setOrders(storedOrders);

    // 2. Real-time Cloud subscription if Firebase is configured
    if (isFirebaseConfigured()) {
      const unsub = subscribeToCustomerOrders(customer.uid, (cloudOrders) => {
        if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
          setOrders(cloudOrders);
        }
      });
      return () => unsub();
    }
  }, [customer, isOpen]);

  if (!isOpen || !customer) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = updateCustomerProfile(customer.uid, {
      name: profileForm.name,
      phone: profileForm.phone,
      address: profileForm.address,
    });

    if (isFirebaseConfigured() && updated) {
      saveCustomerProfileToCloud(updated);
    }

    setIsEditingProfile(false);
    setProfileNotice('Profile updated successfully!');
    setTimeout(() => setProfileNotice(''), 3000);
  };

  const handleSignOut = async () => {
    saveCurrentCustomer(null);
    if (isFirebaseConfigured()) {
      await signOutCustomerFromFirebase();
    }
    onLogout();
    onClose();
  };

  const totalSpent = orders.reduce((acc, o) => acc + (o.totals?.total || o.total || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-petrol-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-petrol-900 border-l border-mustard/30 shadow-2xl h-full flex flex-col z-10 text-white animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-petrol-800 bg-petrol-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-mustard/20 border border-mustard/40 flex items-center justify-center text-mustard font-black text-lg shadow-inner">
              {customer.avatar ? (
                <img src={customer.avatar} alt={customer.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                customer.name ? customer.name.charAt(0).toUpperCase() : 'C'
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-base text-white">
                  {customer.name}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {customer.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-petrol-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-petrol-950/70 p-3.5 rounded-2xl border border-petrol-800 text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Completed Orders
              </span>
              <span className="text-xl font-black text-mustard font-mono mt-0.5 block">
                {orders.length}
              </span>
            </div>

            <div className="bg-petrol-950/70 p-3.5 rounded-2xl border border-petrol-800 text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Total Dining Spend
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
                {currency}{totalSpent.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Customer Personal Details Card */}
          <div className="bg-petrol-950/60 p-4 rounded-2xl border border-petrol-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-mustard flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>My Delivery & Contact Details</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-[11px] text-slate-300 hover:text-mustard flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {profileNotice && (
              <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{profileNotice}</span>
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-2.5 pt-1">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-petrol-900 border border-petrol-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-mustard"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">WhatsApp Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-petrol-900 border border-petrol-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-mustard"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Delivery Address</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full bg-petrol-900 border border-petrol-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-mustard"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-mustard text-petrol-950 font-bold text-xs uppercase tracking-wider shadow"
                >
                  Save Profile Changes
                </button>
              </form>
            ) : (
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-mustard shrink-0" />
                  <span>{customer.phone || 'No phone number provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-mustard shrink-0" />
                  <span>{customer.address || 'Adebayo, Ado-Ekiti'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-mustard shrink-0" />
                  <span>{customer.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Order History Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-mustard" />
                <span>My Past Orders & Receipts</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-petrol-950/60 p-6 rounded-2xl border border-petrol-800 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-petrol-900 border border-petrol-700 flex items-center justify-center text-slate-400 mx-auto">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-semibold">No orders recorded yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Explore our authentic swallows, jollof combos, and grill specials!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigateMenu) onNavigateMenu();
                  }}
                  className="px-4 py-2 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Explore Master Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const itemsList = order.cart || order.items || [];
                  const orderTotal = order.totals?.total || order.total || 0;

                  return (
                    <div 
                      key={order.id}
                      className="bg-petrol-950/70 p-4 rounded-2xl border border-petrol-800 space-y-3 hover:border-mustard/40 transition-colors"
                    >
                      {/* Top Bar: Order ID + Status */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-mustard">
                            {order.id}
                          </span>
                          <span className="block text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {orderDate}
                          </span>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>WhatsApp Confirmed</span>
                        </span>
                      </div>

                      {/* Mode & Table/Address */}
                      <div className="text-[11px] text-slate-300 bg-petrol-900/60 p-2 rounded-xl border border-petrol-800 flex items-center justify-between">
                        <span className="font-semibold text-white uppercase text-[10px]">
                          {order.mode === 'dinein' ? '🍽️ Dine-In Lounge' : '📦 Go Bites Express'}
                        </span>
                        <span className="text-slate-400 truncate max-w-[160px]">
                          {order.customerInfo?.tableNumber 
                            ? `Table: ${order.customerInfo.tableNumber}` 
                            : (order.customerInfo?.location || 'Adebayo, Ado-Ekiti')}
                        </span>
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-1 text-xs">
                        {itemsList.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300">
                            <span>
                              {item.quantity}x {item.title || item.name}
                              {item.selectedOption && (
                                <span className="text-[10px] text-slate-400 block ml-4">
                                  ({item.selectedOption})
                                </span>
                              )}
                            </span>
                            <span className="text-slate-400 font-mono">
                              {currency}{((item.price || 0) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Re-Order Action */}
                      <div className="pt-2 border-t border-petrol-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Total Paid</span>
                          <span className="font-serif font-bold text-sm text-mustard">
                            {currency}{orderTotal.toLocaleString()}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (onReOrder) {
                              onReOrder(itemsList);
                              onClose();
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-mustard/20 hover:bg-mustard text-mustard hover:text-petrol-950 font-bold text-[11px] uppercase tracking-wider border border-mustard/40 transition-all flex items-center gap-1.5"
                          title="Add these dishes back into your cart"
                        >
                          <Repeat className="w-3 h-3" />
                          <span>Re-Order</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer with Sign Out */}
        <div className="p-4 border-t border-petrol-800 bg-petrol-950/90 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-mustard" />
            <span>Romee Gobites Club Member</span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-semibold border border-red-500/30 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
