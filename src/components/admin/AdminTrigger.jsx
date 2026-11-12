import React, { useEffect } from 'react';
import { Shield, Settings } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export default function AdminTrigger() {
  const { openAdmin, isAdminOpen } = usePortfolioData();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shortcut: Ctrl+Shift+A or Alt+A
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        openAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAdmin]);

  if (isAdminOpen) return null;

  return (
    <div className="admin-floating-trigger">
      <button
        type="button"
        onClick={openAdmin}
        className="admin-trigger-pill"
        title="Open Admin CMS (or press Ctrl+Shift+A)"
        aria-label="Admin CMS"
      >
        <Shield size={14} />
        <span className="trigger-text">Admin CMS</span>
      </button>
    </div>
  );
}

