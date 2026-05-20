import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, Info, MessageCircle, Star, X } from "lucide-react";
import { api } from "../../../../../services/apiService";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'enquiry': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'review': return <Star className="w-4 h-4 text-amber-500" />;
      case 'booking': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShow(!show)}
        className="relative w-10 h-10 rounded-xl bg-white border border-[#F3E9E2] text-[#8E7E77] flex items-center justify-center hover:bg-[#F3E9E2] transition-colors group"
      >
        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {show && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />
          <div className="absolute top-full right-0 mt-3 w-[320px] md:w-[380px] bg-white rounded-2xl shadow-2xl border border-[#F3E9E2] z-50 overflow-hidden animate-wedding-slide-down">
            <div className="px-5 py-4 border-b border-[#F3E9E2] flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-black text-[#4A3730]">Notifications</h3>
                <p className="text-[10px] font-bold text-[#8E7E77] uppercase tracking-widest">{unreadCount} Unread</p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-[10px] font-black text-[#B06A6C] uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#B06A6C] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-bold text-[#8E7E77] uppercase tracking-widest">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-10 text-center text-[#8E7E77]">
                  <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif._id}
                    onClick={() => markRead(notif._id)}
                    className={`px-5 py-4 border-b border-[#F3E9E2] hover:bg-[#F3E9E2]/20 transition-colors cursor-pointer flex gap-3 relative ${!notif.isRead ? 'bg-[#B06A6C]/5' : ''}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#F3E9E2] flex items-center justify-center shrink-0 shadow-sm">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-black text-[#4A3730] mb-0.5">{notif.title}</h4>
                      <p className="text-[11px] text-[#7B6A62] font-medium leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[9px] font-bold text-[#8E7E77] uppercase tracking-widest mt-2">
                        {formatDistanceToNow(new Date(notif.createdAt))} ago
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#B06A6C] mt-2 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#F7F1ED]/50 text-center border-t border-[#F3E9E2]">
              <button className="text-[10px] font-black text-[#4A3730] uppercase tracking-widest hover:text-[#B06A6C] transition-colors">
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
