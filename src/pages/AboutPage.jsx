import React from 'react';
import { 
  Sparkles, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  Users, 
  UtensilsCrossed, 
  Flame, 
  Clock, 
  Quote,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = ({ staffMembers = [] }) => {
  // Sort staff by priority
  const sortedStaff = [...staffMembers].sort((a, b) => (a.priority || 99) - (b.priority || 99));
  
  // Managing Director is usually the first member
  const managingDirector = sortedStaff.find(s => s.role.toLowerCase().includes('managing director') || s.role.toLowerCase().includes('ceo')) || sortedStaff[0];
  const otherStaff = sortedStaff.filter(s => s.id !== managingDirector?.id);

  return (
    <div className="bg-[#F4F6F9] text-slate-800 pb-20">
      
      {/* 1. Curved Hero Header */}
      <section className="bg-petrol-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 hero-curved-bottom relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-petrol-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-petrol-950/70 border border-mustard/30 text-mustard text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Heritage & Vision</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Authentic Taste, <br />
            <span className="text-mustard">Modern Hospitality</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Welcome to ROMEE Go-Bite Eatery. We bring authentic Nigerian swallow feasts and fast gourmet rice combos together under one brand, operated with world-class kitchen hygiene.
          </p>
        </div>
      </section>

      {/* 2. Story Section with Dual Outlets Philosophy */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card-elevated border border-slate-100 text-left grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-mustard">
              The ROMEE Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-snug">
              Why We Separated Our Seated Lounge From Express Takeout
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              When dining in Nigeria, people have two distinctly different rhythms. Some guests desire a tranquil, unhurried atmosphere to savor steaming <strong>hot Amala, Semo, or Pounded Yam</strong> with rich soups, fresh catfish, and assorted meats.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Others are busy executives, students, and workers who need a rapid <strong>firewood Jollof, spicy spaghetti, or combo pack</strong> handed over in 3 minutes without waiting in long dining queues.
            </p>
            <p className="text-slate-700 text-xs sm:text-sm font-semibold">
              ROMEE solved this by engineering two dedicated wings: the seated <strong>Dine-In Lounge</strong> and the high-speed <strong>Go Bites Express Counter</strong>.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80"
                alt="Swallows & Soups"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 aspect-[4/5] mt-6">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                alt="Express Takeaway Counter"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Managing Director Spotlight */}
      {managingDirector && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-left">
          <div className="bg-gradient-to-br from-petrol-900 to-petrol-950 text-white rounded-3xl p-8 sm:p-12 shadow-card-elevated border border-mustard/30 relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* MD Photo */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-4 border-mustard/40 shadow-2xl group">
                  <img
                    src={managingDirector.image}
                    alt={managingDirector.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-mustard text-petrol-950 text-[10px] font-black uppercase tracking-wider">
                      Executive Leadership
                    </span>
                  </div>
                </div>
              </div>

              {/* MD Words & Bio */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-mustard text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>A Message from Our Managing Director</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
                  {managingDirector.name}
                </h2>

                <p className="text-mustard font-semibold text-xs sm:text-sm">
                  {managingDirector.role} • {managingDirector.department}
                </p>

                {/* Quote Box */}
                {managingDirector.quote && (
                  <div className="relative pl-6 py-2 border-l-2 border-mustard italic text-slate-200 text-xs sm:text-sm leading-relaxed bg-white/5 rounded-r-xl pr-4">
                    <Quote className="w-5 h-5 text-mustard/40 absolute -top-2 left-1" />
                    "{managingDirector.quote}"
                  </div>
                )}

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pt-2">
                  {managingDirector.bio}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-petrol-800 text-left">
                  <div>
                    <span className="block text-xl font-black text-mustard">18+</span>
                    <span className="text-[11px] text-slate-400">Years Culinary Mastery</span>
                  </div>
                  <div>
                    <span className="block text-xl font-black text-mustard">2 Outlets</span>
                    <span className="text-[11px] text-slate-400">Lagos Island & Mainland</span>
                  </div>
                  <div>
                    <span className="block text-xl font-black text-mustard">100%</span>
                    <span className="text-[11px] text-slate-400">Fresh Daily Farm Sourcing</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* 4. Managing Staff & Executive Team Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-left">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-petrol-900/10 text-petrol-900 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>The Faces Behind Your Meals</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
            Meet Our Managing Staff & Chefs
          </h2>

          <p className="text-slate-500 text-xs sm:text-sm">
            Our experienced team of culinary artisans, kitchen managers, and hospitality supervisors dedicated to giving you an unforgettable dining experience.
          </p>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card-soft hover:shadow-card-elevated transition-all duration-300 flex flex-col group"
            >
              {/* Photo */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                <img
                  src={staff.image}
                  alt={staff.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/70 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-petrol-950/80 text-mustard border border-mustard/30 backdrop-blur-sm">
                    {staff.department}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-petrol-900 transition-colors">
                    {staff.name}
                  </h3>
                  <p className="text-mustard text-xs font-semibold mb-2">
                    {staff.role}
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                    {staff.bio}
                  </p>
                </div>

                {staff.quote && (
                  <div className="pt-3 mt-3 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 italic">
                      "{staff.quote}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Core Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-left">
        <div className="bg-petrol-900 text-white rounded-3xl p-8 sm:p-12 border border-petrol-800 shadow-card-elevated">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
              Our 4 Pillars of Excellence
            </h2>
            <p className="text-slate-300 text-xs">
              What sets ROMEE Go-Bite Eatery apart from ordinary restaurants in Lagos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-petrol-950/60 border border-petrol-800 space-y-2">
              <ShieldCheck className="w-8 h-8 text-sage" />
              <h4 className="font-serif font-bold text-white text-sm">Hospital-Grade Hygiene</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Sanitized prep stations, temperature-controlled meats, and uncompromised food safety.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-petrol-950/60 border border-petrol-800 space-y-2">
              <Flame className="w-8 h-8 text-mustard" />
              <h4 className="font-serif font-bold text-white text-sm">Authentic Afro Heritage</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Genuine iru, scotch bonnets, palm oils, and slow-braised cuts without MSG shortcuts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-petrol-950/60 border border-petrol-800 space-y-2">
              <Clock className="w-8 h-8 text-amber-400" />
              <h4 className="font-serif font-bold text-white text-sm">Lightning 3-Min Dispatch</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Go Bites combos are pre-portioned and thermal-packed for minimal waiting.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-petrol-950/60 border border-petrol-800 space-y-2">
              <HeartHandshake className="w-8 h-8 text-emerald-400" />
              <h4 className="font-serif font-bold text-white text-sm">Warm Nigerian Hospitality</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                You are not just a customer; in our dining room, you are a respected family guest.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105"
            >
              <span>Explore Our Menu Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
