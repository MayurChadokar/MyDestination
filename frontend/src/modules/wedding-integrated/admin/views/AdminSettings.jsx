import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppearanceSettings from './settings/AppearanceSettings';

const AdminSettings = () => {
  return (
    <div className="p-4 md:p-8">
      <Routes>
        <Route index element={<Navigate to="appearance" replace />} />
        <Route path="appearance" element={<AppearanceSettings />} />
        {/* Placeholder for future sections */}
        <Route path="general" element={<div className="p-12 text-center text-slate-400 font-medium bg-white/50 rounded-3xl border border-dashed">General settings are coming soon.</div>} />
        <Route path="security" element={<div className="p-12 text-center text-slate-400 font-medium bg-white/50 rounded-3xl border border-dashed">Security controls are coming soon.</div>} />
      </Routes>
    </div>
  );
};

export default AdminSettings;
