import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../components/AdminDashboard';
import { ArrowLeft, Home } from 'lucide-react';

export const AdminPage = ({
  menuItems,
  onUpdateMenuItems,
  settings,
  onUpdateSettings,
  onResetDefaults,
  currency,
  staffMembers,
  onUpdateStaff,
  ambienceMedia,
  onUpdateAmbience,
  users,
  onUpdateUsers,
  auditLogs,
  onAddAuditLog,
  onClearAuditLogs,
}) => {
  const navigate = useNavigate();

  // Update document title for Admin Portal
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'ROMEE Admin & Executive Management Portal';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleReturnToSite = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-petrol-950 text-white flex flex-col relative">
      {/* Fallback top bar for mobile desktop view */}
      <div className="bg-petrol-950 border-b border-petrol-800 px-4 py-2.5 flex items-center justify-between text-xs z-30">
        <button
          onClick={handleReturnToSite}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-petrol-900 hover:bg-petrol-800 text-slate-200 hover:text-white border border-petrol-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-mustard" />
          <span>Exit to Public Website</span>
        </button>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          URL: /admin • Secure Staff & Superuser Portal
        </span>
      </div>

      <div className="flex-1 relative">
        <AdminDashboard
          isOpen={true}
          onClose={handleReturnToSite}
          menuItems={menuItems}
          onUpdateMenuItems={onUpdateMenuItems}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onResetDefaults={onResetDefaults}
          currency={currency}
          staffMembers={staffMembers}
          onUpdateStaff={onUpdateStaff}
          ambienceMedia={ambienceMedia}
          onUpdateAmbience={onUpdateAmbience}
          users={users}
          onUpdateUsers={onUpdateUsers}
          auditLogs={auditLogs}
          onAddAuditLog={onAddAuditLog}
          onClearAuditLogs={onClearAuditLogs}
        />
      </div>
    </div>
  );
};
