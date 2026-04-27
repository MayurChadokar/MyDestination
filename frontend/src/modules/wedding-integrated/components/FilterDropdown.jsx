import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

const FilterDropdown = ({ label, options, value, onChange, multiSelect = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = multiSelect
    ? Array.isArray(value) && value.length > 0
    : value !== null && value !== undefined && value !== "";

  const handleOptionClick = (option) => {
    if (multiSelect) {
      const arr = Array.isArray(value) ? value : [];
      if (arr.includes(option)) {
        onChange(arr.filter((v) => v !== option));
      } else {
        onChange([...arr, option]);
      }
    } else {
      onChange(value === option ? null : option);
      setOpen(false);
    }
  };

  const getLabel = () => {
    if (!isActive) return label;
    if (multiSelect && Array.isArray(value)) {
      if (value.length === 1) return value[0];
      return `${label} (${value.length})`;
    }
    return value;
  };

  const reset = (e) => {
    e.stopPropagation();
    onChange(multiSelect ? [] : null);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold border transition-all whitespace-nowrap
          ${isActive
            ? "bg-[#9d313d] text-white border-[#9d313d] shadow-sm"
            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
          }`}
      >
        <span>{getLabel()}</span>
        {isActive ? (
          <X className="w-3.5 h-3.5 cursor-pointer" onClick={reset} />
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-slate-100 z-50 min-w-[180px] py-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((option) => {
            const selected = multiSelect
              ? Array.isArray(value) && value.includes(option)
              : value === option;
            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors flex items-center gap-2
                  ${selected ? "text-[#9d313d] font-bold bg-[#9d313d]/5" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {multiSelect && (
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${selected ? "bg-[#9d313d] border-[#9d313d]" : "border-slate-300"}`}>
                    {selected && <svg viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="2"><polyline points="1,4 4,7 9,1"/></svg>}
                  </div>
                )}
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
