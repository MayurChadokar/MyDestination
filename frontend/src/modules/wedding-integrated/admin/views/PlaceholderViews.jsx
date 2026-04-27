import React from 'react';

const PlaceholderView = ({ name }) => (
  <div className="p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-white/30 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
    <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)] mb-4">{name}</h2>
    <p className="text-gray-600">This module is currently under development. Detailed management tools for {name.toLowerCase()} will appear here.</p>
  </div>
);

export const ManageDestinations = () => <PlaceholderView name="Destination Management" />;
export const AdminSettings = () => <PlaceholderView name="Admin Settings" />;

export const ManageCustomers = () => <PlaceholderView name="Customer Management" />;
export const ManageFinancials = () => <PlaceholderView name="Financials & Commissions" />;
export const ManageMarketing = () => <PlaceholderView name="Marketing & Banners" />;
export const ManageNotifications = () => <PlaceholderView name="Notification Center" />;
export const ManageSupport = () => <PlaceholderView name="Support & Complaints" />;
