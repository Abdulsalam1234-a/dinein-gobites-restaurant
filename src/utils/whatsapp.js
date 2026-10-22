/**
 * WhatsApp Order Compilation Utility for ROMEE Go-Bite Eatery
 */

export const normalizeWhatsAppPhone = (phone = '07068371295') => {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.slice(1);
  } else if (!cleaned.startsWith('234') && cleaned.length === 10) {
    cleaned = '234' + cleaned;
  }
  return cleaned || '2347068371295';
};

export const compileWhatsAppOrder = ({
  cart,
  mode, // 'dinein' | 'gobites'
  customerInfo,
  totals,
  whatsappNumber = '07068371295',
  currency = '₦',
}) => {
  const isDineIn = mode === 'dinein';
  const cleanPhone = normalizeWhatsAppPhone(whatsappNumber);

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━';

  let message = `🍽️ *NEW ORDER - ROMEE GO-BITE EATERY*\n`;
  message += `${divider}\n`;
  
  if (isDineIn) {
    message += `📍 *DINING MODE:* 🟢 DINE-IN (Lounge)\n`;
    message += `🪑 *Table / Section:* ${customerInfo.tableNumber || 'Walk-in Table'}\n`;
    message += `👤 *Guest Name:* ${customerInfo.name || 'Valued Guest'}\n`;
  } else {
    message += `⚡ *DINING MODE:* 🟡 GO BITES (Express Takeaway)\n`;
    message += `👤 *Customer Name:* ${customerInfo.name || 'Valued Customer'}\n`;
    message += `📞 *Phone:* ${customerInfo.phone || 'N/A'}\n`;
    message += `📍 *Delivery / Pickup:* ${customerInfo.location || 'Express Counter Pickup'}\n`;
  }

  message += `⏱️ *Order Time:* ${dateStr}\n`;
  message += `${divider}\n\n`;

  message += `📦 *ORDER ITEMS:*\n`;
  cart.forEach((item, index) => {
    const itemTotal = (item.price * item.quantity).toLocaleString();
    message += `${index + 1}. *${item.name}* x${item.quantity} — ${currency}${itemTotal}\n`;
    
    if (item.selectedOption) {
      message += `   ↳ Choice: ${item.selectedOption}\n`;
    }
    if (item.notes && item.notes.trim()) {
      message += `   ↳ Note: _${item.notes.trim()}_\n`;
    }
  });

  message += `\n${divider}\n`;
  message += `💰 *Items Subtotal:* ${currency}${totals.subtotal.toLocaleString()}\n`;
  
  if (isDineIn && totals.serviceCharge > 0) {
    message += `🛎️ *Service & Hospitality:* ${currency}${totals.serviceCharge.toLocaleString()}\n`;
  } else if (!isDineIn && totals.packagingFee > 0) {
    message += `🛍️ *Pack & Delivery Fee:* ${currency}${totals.packagingFee.toLocaleString()}\n`;
  }

  message += `🔥 *TOTAL AMOUNT:* ${currency}${totals.total.toLocaleString()}\n`;
  message += `${divider}\n`;

  if (customerInfo.specialInstructions && customerInfo.specialInstructions.trim()) {
    message += `📝 *Special Instructions:*\n_${customerInfo.specialInstructions.trim()}_\n\n`;
  }

  message += `_Please confirm order availability and prep time!_`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return {
    rawMessage: message,
    whatsappUrl,
  };
};

export const getWhatsAppInquiryUrl = (whatsappNumber = '07068371295', customText = '') => {
  const cleanPhone = normalizeWhatsAppPhone(whatsappNumber);
  const text = customText || "Hello ROMEE Go-Bite Eatery! I would like to make an inquiry about your menu and orders.";
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};
