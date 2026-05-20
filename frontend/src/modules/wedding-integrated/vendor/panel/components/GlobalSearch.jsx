import React, { useState, useEffect, useRef } from "react";
import { Search, User, Calendar, MessageCircle, X, ArrowRight } from "lucide-react";
import { weddingVendorService } from "../../../../../services/apiService";
import { useNavigate } from "react-router-dom";

const GlobalSearch = ({ query, setQuery, onCloseMobile }) => {
  const [results, setResults] = useState({ leads: [], venues: [] });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        handleSearch();
      } else {
        setResults({ leads: [], venues: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setShowResults(true);
      // For now, we search within leads as it's the primary vendor data
      const allLeads = await weddingVendorService.getLeads();
      const filtered = allLeads.filter(l => 
        l.name.toLowerCase().includes(query.toLowerCase()) || 
        l.email.toLowerCase().includes(query.toLowerCase()) ||
        (l.message && l.message.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);
      
      setResults({ leads: filtered, venues: [] });
    } catch (error) {
      console.error("Global search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (lead) => {
    setShowResults(false);
    setQuery("");
    if (onCloseMobile) onCloseMobile();
    navigate("/wedding/vendor/leads", { state: { selectedId: lead._id } });
  };

  return (
    <div className="relative flex-1 max-w-xl" ref={searchRef}>
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors group-focus-within:text-[#B06A6C]" />
        <input 
          type="text" 
          placeholder="Search leads, inquiries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-[#F3E9E2]/50 border border-transparent focus:border-[#B06A6C]/20 focus:bg-white rounded-xl text-[13px] font-medium transition-all outline-none"
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setShowResults(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showResults && query.trim().length > 1 && (
        <>
          <div className="fixed inset-0 z-40 hidden md:block" onClick={() => setShowResults(false)} />
          <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-[#F3E9E2] z-50 overflow-hidden animate-wedding-slide-down max-h-[480px] overflow-y-auto no-scrollbar">
            <div className="p-4 border-b border-[#F3E9E2] bg-[#F7F1ED]/30">
              <p className="text-[10px] font-black text-[#8E7E77] uppercase tracking-[0.2em]">Search Results</p>
            </div>

            {loading ? (
              <div className="p-8 text-center flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-[#B06A6C] border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-[#8E7E77] uppercase tracking-widest">Searching...</p>
              </div>
            ) : results.leads.length === 0 ? (
              <div className="p-8 text-center text-[#8E7E77]">
                <p className="text-xs font-bold uppercase tracking-widest">No matching results</p>
              </div>
            ) : (
              <div className="p-2">
                <p className="px-3 py-2 text-[9px] font-black text-[#B06A6C] uppercase tracking-widest">Leads & Enquiries</p>
                {results.leads.map((lead) => (
                  <button
                    key={lead._id}
                    onClick={() => handleSelect(lead)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F3E9E2]/40 transition-colors group text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#F3E9E2] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[#B06A6C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-black text-[#4A3730] truncate group-hover:text-[#B06A6C] transition-colors">{lead.name}</h4>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-[#8E7E77] uppercase tracking-widest mt-0.5">
                        <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {new Date(lead.weddingDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-2.5 h-2.5" /> {lead.status}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 bg-[#F7F1ED]/50 text-center border-t border-[#F3E9E2]">
              <button 
                onClick={() => { setShowResults(false); navigate("/wedding/vendor/leads"); }}
                className="text-[10px] font-black text-[#4A3730] uppercase tracking-widest hover:text-[#B06A6C] transition-colors"
              >
                Go to Leads Inbox
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalSearch;
