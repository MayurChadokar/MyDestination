import React, { useState, useEffect } from 'react';
import { Palette, Share2, RotateCcw, CheckCircle, Globe, ShieldCheck, User } from 'lucide-react';
import { adminStyles } from '../../theme/themeConfig';

const AppearanceSettings = () => {
  const [targetPanel, setTargetPanel] = useState('global');
  const [hexColor, setHexColor] = useState('#B06A6C');
  const [recentColors, setRecentColors] = useState(['#B06A6C', '#2A5D67', '#6C5B7B', '#C06C84']);
  const [isSuccessfullySaved, setIsSuccessfullySaved] = useState(false);

  useEffect(() => {
     // Load existing if current target changes
     const key = `theme_${targetPanel}_primary`;
     const saved = localStorage.getItem(key) || localStorage.getItem('theme_global_primary') || '#B06A6C';
     setHexColor(saved);
  }, [targetPanel]);

  const handleSave = () => {
    const key = targetPanel === 'global' ? 'theme_global_primary' : `theme_${targetPanel}_primary`;
    localStorage.setItem(key, hexColor);
    
    // Broadcast for same-window updates
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { panel: targetPanel, color: hexColor } }));
    
    setIsSuccessfullySaved(true);
    setTimeout(() => setIsSuccessfullySaved(false), 2000);
  };

  const handleReset = () => {
    const key = targetPanel === 'global' ? 'theme_global_primary' : `theme_${targetPanel}_primary`;
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('themeChanged'));
    setHexColor('#B06A6C');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-serif text-[hsl(353,45%,35%)]">Platform Aesthetics</h2>
           <p className="text-slate-500 mt-2 font-medium">Control the visual identity and branding of your entire ecosystem.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleReset}
             className="px-6 py-4 border border-slate-200 text-slate-400 rounded-[2rem] font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
           >
              <RotateCcw size={16} /> Reset
           </button>
           <button 
             onClick={handleSave}
             className="px-10 py-4 bg-[hsl(353,45%,35%)] text-white rounded-[2rem] font-bold shadow-xl shadow-[hsl(353,45%,35%)]/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3"
           >
              {isSuccessfullySaved ? <CheckCircle size={20} /> : <Palette size={20} />}
              {isSuccessfullySaved ? 'Applied' : 'Save Theme'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Configuration Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white p-6 md:p-8 shadow-2xl space-y-6">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Panel</label>
              <div className="grid grid-cols-2 gap-2">
                 {[
                   { id: 'global', label: 'Global', icon: Globe },
                   { id: 'admin', label: 'Admin', icon: ShieldCheck },
                   { id: 'vendor', label: 'Vendor', icon: Share2 },
                   { id: 'user', label: 'User', icon: User }
                 ].map(panel => (
                    <button
                      key={panel.id}
                      onClick={() => setTargetPanel(panel.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                         targetPanel === panel.id 
                           ? 'bg-[hsl(353,45%,35%)]/5 border-[hsl(353,45%,35%)]/40 text-[hsl(353,45%,35%)] shadow-inner font-bold'
                           : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                       <panel.icon size={16} />
                       <span className="text-xs">{panel.label}</span>
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Hex Code</label>
              <div className="flex items-center gap-4">
                 <div 
                   className="h-14 w-14 rounded-[1.5rem] shadow-xl border-4 border-white shrink-0" 
                   style={{ backgroundColor: hexColor }}
                 />
                 <input 
                   type="text" 
                   value={hexColor}
                   onChange={(e) => setHexColor(e.target.value)}
                   className="flex-1 px-8 h-14 bg-white/50 border border-slate-100 rounded-[1.5rem] text-xl font-black uppercase tracking-widest focus:outline-none focus:border-[hsl(353,45%,35%)] transition-all"
                   placeholder="#FFFFFF"
                 />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recently Used</label>
              <div className="flex gap-3">
                 {recentColors.map(c => (
                    <button 
                      key={c}
                      onClick={() => setHexColor(c)}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-125 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                 ))}
              </div>
           </div>
        </div>

        {/* Live Preview Console */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
           
           <div className="relative z-10 space-y-6">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest opacity-60">Live Preview Console</p>
              <div className="space-y-2">
                 <div className="h-4 w-3/4 rounded-full bg-white/10" />
                 <div className="h-4 w-1/2 rounded-full bg-white/10" />
              </div>
              
              <div className="pt-8 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: hexColor }}>
                       <CheckCircle size={20} className="text-white" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-sm font-bold">Primary Action State</p>
                       <p className="text-[10px] text-slate-400">Buttons and focus rings</p>
                    </div>
                 </div>

                 <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold uppercase tracking-widest opacity-60">Active Menu</span>
                       <div className="h-6 w-12 rounded-full" style={{ backgroundColor: hexColor }} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="relative z-10 pt-10 border-t border-white/5 flex items-center justify-between">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="h-8 w-8 rounded-full bg-white/20 border-2 border-slate-900" />)}
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-[#B06A6C]">Elite Density UI</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
