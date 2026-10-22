import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  ExternalLink,
  ChevronRight,
  Bot
} from 'lucide-react';

const QUICK_PROMPTS = [
  "Dine-In vs Go Bites?",
  "What swallows do you have?",
  "Why no swallow in Go Bites?",
  "Recommend a fish dish",
  "Show me combos",
  "Where are your branches?",
  "How to order on WhatsApp?"
];

export const ChatbotWidget = ({
  _activeMode,
  setActiveMode,
  onOpenCart,
  whatsappNumber = '2348012345678',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Warm greetings! 👑 I am Chef Romee, your personal dining concierge at ROMEE Go-Bite Eatery. Whether you are craving hot traditional swallows in our Dine-In Lounge or quick combos from Go Bites Express, I am here to guide you. What can I help you with?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const generateBotReply = (query) => {
    const q = query.toLowerCase();

    // 1. Dine-In vs Go Bites
    if (q.includes('difference') || q.includes('vs') || q.includes('compare') || q.includes('dine-in vs')) {
      return {
        text: "Here is the key distinction:\n\n• 🍽️ **Dine-In Lounge:** A seated luxury experience where we serve hot swallows (Amala, Semo, Eba), rich native soups, whole grilled catfish, and plated rice dishes right to your table.\n\n• ⚡ **Go Bites Express:** Our rapid-order takeaway counter. Dedicated strictly to rice boxes, value combos, jollof spaghetti, gourmet moi moi, and hot snacks with zero delay. (Note: Swallows are strictly dine-in only!)",
        actions: [
          { label: 'Switch to Dine-In', handler: () => setActiveMode('dinein') },
          { label: 'Switch to Go Bites', handler: () => setActiveMode('gobites') }
        ]
      };
    }

    // 2. Swallows
    if (q.includes('swallow') || q.includes('amala') || q.includes('semo') || q.includes('eba') || q.includes('pounded yam') || q.includes('iyan') || q.includes('soup')) {
      if (q.includes('why') && (q.includes('no swallow') || q.includes('go bite') || q.includes('bites'))) {
        return {
          text: "Swallows (Amala, Semovita, Eba, Pounded Yam) and steaming native soups (Egusi, Efo Riro, Ogbono) require optimal serving heat and seated enjoyment. To maintain 5-star quality and avoid soggy packaging, they are served exclusively in our Dine-In Lounge!",
          actions: [{ label: 'Explore Swallows in Dine-In', handler: () => setActiveMode('dinein') }]
        };
      }
      return {
        text: "In our Dine-In Lounge, we serve:\n• Authentic Pounded Yam with Egusi or Efo Riro\n• Velvety Amala with Gbegiri, Ewedu & Buka Stew\n• Golden Semovita with Stockfish Egusi\n• Yellow Garri Eba with Locust-bean Efo Riro\n\nAll prepared hot and fresh to order!",
        actions: [{ label: 'View Dine-In Menu', handler: () => setActiveMode('dinein') }]
      };
    }

    // 3. Fish
    if (q.includes('fish') || q.includes('catfish') || q.includes('panla') || q.includes('pepper soup')) {
      return {
        text: "Our fish specialties are customer favorites in the Dine-In Lounge! 🐟\n\n1. **Whole Charcoal-Grilled Catfish (₦8,500)** — Roasted live with habanero spices & dodo.\n2. **Point & Kill Catfish Pepper Soup (₦6,500)** — Aromatic herbal broth with scent leaves.\n3. **Crispy Peppered Panla Fish (₦3,200)** — Flash-fried hake fish in fiery sweet pepper sauce.\n4. **Smoked Panla in Village Stew (₦3,400)**.",
        actions: [{ label: 'Order Fish (Dine-In)', handler: () => setActiveMode('dinein') }]
      };
    }

    // 4. Combos & Go Bites
    if (q.includes('combo') || q.includes('go bite') || q.includes('takeaway') || q.includes('express') || q.includes('pack')) {
      return {
        text: "Our Go Bites combos are prepped in 3-5 minutes:\n\n• 🍗 **Royal Chicken Combo (₦5,500):** Rice Box + Crispy Quarter Chicken + Dodo + Drink.\n• 🥩 **Tender Beef Combo (₦4,800):** Rice Box + 2 Chunky Beef Cuts + Dodo + Drink.\n• 🍛 **Express Ofada Combo (₦5,200):** Ofada Rice Bowl + Ayamase Sauce + Boiled Egg + Drink.\n• 🍝 **Spag Combo (₦5,000):** Jollof Spaghetti + Fried Chicken + Drink.",
        actions: [{ label: 'Switch to Go Bites Menu', handler: () => setActiveMode('gobites') }]
      };
    }

    // 5. Snacks / Moi Moi
    if (q.includes('snack') || q.includes('moi moi') || q.includes('pie') || q.includes('egg') || q.includes('sausage')) {
      return {
        text: "Looking for quick snacks? We offer:\n• Gourmet Leaf-Wrapped Moi Moi (₦1,800) with flaked fish & egg\n• Flaky Golden Meat Pies (₦1,200)\n• Savory Nigerian Scotch Eggs (₦1,200)\n• Crispy Sausage Rolls (₦1,000)\n• Peppered Chicken Wings (₦3,200)",
        actions: [{ label: 'View Go Bites Snacks', handler: () => setActiveMode('gobites') }]
      };
    }

    // 6. WhatsApp Ordering Flow
    if (q.includes('whatsapp') || q.includes('order') || q.includes('how to order') || q.includes('place order')) {
      return {
        text: "Ordering is seamless! Here is how it works:\n1. Add your favorite dishes or combos to your plate/bag.\n2. Open your plate, then input your **Table Number** (if dining in) or **Delivery/Pickup Location** (for Go Bites).\n3. Tap **'Place Order on WhatsApp'**.\n4. The system automatically formats your items, quantities, and instructions into a WhatsApp message and opens the chat with our kitchen for instant confirmation!",
        actions: [{ label: 'Open Your Cart', handler: () => onOpenCart() }]
      };
    }

    // 7. Locations / Outlets / Branches
    if (q.includes('location') || q.includes('where') || q.includes('branch') || q.includes('address') || q.includes('outlet')) {
      return {
        text: "We operate two branches:\n\n📍 **Main Branch (Dual Outlets):** 14 Admiralty Way, Victoria Island / Lekki, Lagos.\n(Features both our Dine-In Lounge & Go Bites Express pickup counter!)\n\n📍 **Express Depot (Branch 2):** 28 Allen Avenue, Ikeja, Lagos.\n(Dedicated to fast takeaway & office delivery).\n\nOpen 7 days a week from 8:00 AM to 10:30 PM."
      };
    }

    // 8. Payment
    if (q.includes('payment') || q.includes('pay') || q.includes('transfer') || q.includes('pos') || q.includes('cash')) {
      return {
        text: "We accept:\n• Debit Cards on POS (Mastercard, Visa, Verve)\n• Instant Nigerian Bank Transfers (verified on the spot)\n• Cash at our counters."
      };
    }

    // Default Fallback
    return {
      text: "I would love to help you with that! ROMEE Go-Bite Eatery offers exquisite Dine-In dining (swallows, catfish, plated feasts) and fast Go Bites combos (rice, spaghetti, moi moi, snacks). Would you like to check the menu, learn about our locations, or speak to someone on WhatsApp?",
      actions: [
        { label: 'View Dine-In Menu', handler: () => setActiveMode('dinein') },
        { label: 'View Go Bites Combos', handler: () => setActiveMode('gobites') },
        { 
          label: 'Chat with Staff on WhatsApp', 
          externalUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(query)}` 
        }
      ]
    };
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateBotReply(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply.text,
        actions: reply.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold to-gold-600 text-navy-950 font-extrabold shadow-gold-md hover:shadow-gold-lg transition-all transform hover:scale-105"
        >
          {/* Subtle pulsating outer ring */}
          <span className="absolute -inset-1 rounded-full bg-gold/40 animate-ping opacity-60 pointer-events-none" />

          <Bot className="w-5 h-5 text-navy-950" />
          <span className="text-xs tracking-wider uppercase hidden sm:inline font-bold">
            Ask Chef Romee
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-w-md bg-navy-900 border border-gold/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[82vh] animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-navy-950 border-b border-gold/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Chef Romee</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-gold-300">ROMEE Go-Bite Dining Concierge</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-navy-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-gold to-gold-600 text-navy-950 font-medium rounded-br-none shadow-sm'
                      : 'bg-navy-950/90 border border-gold/20 text-slate-200 rounded-bl-none shadow-gold-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Actions inside bot reply */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.actions.map((act, aIdx) => (
                      act.externalUrl ? (
                        <a
                          key={aIdx}
                          href={act.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-800 flex items-center gap-1 transition-all"
                        >
                          <span>{act.label}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <button
                          key={aIdx}
                          onClick={() => {
                            act.handler();
                            setIsOpen(false);
                          }}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-200 hover:bg-gold hover:text-navy-950 flex items-center gap-1 transition-all"
                        >
                          <span>{act.label}</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      )
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-500 mt-0.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 p-2 bg-navy-950 rounded-2xl border border-gold/10 w-16 text-gold">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-navy-950/60 border-t border-gold/10 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-navy-900 hover:bg-gold hover:text-navy-950 text-slate-300 border border-gold/20 transition-all shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-navy-950 border-t border-gold/20 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about swallows, combos, catfish..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-navy-900 border border-gold/25 rounded-full px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2 rounded-full gold-gradient-btn text-navy-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
