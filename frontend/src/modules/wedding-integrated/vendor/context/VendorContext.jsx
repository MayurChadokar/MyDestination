import { createContext, useContext, useState, useEffect } from "react";

const DRAFT_KEY = "vendor_onboarding_draft";

const defaultState = {
  basicInfo: {
    name: "",
    category: "",
    location: "",
    experience: "",
    phone: "",
    email: "",
  },
  portfolio: [],
  services: [{ name: "", description: "" }],
  pricing: {
    premiumPrice: "",
    description: "",
  },
  kyc: {
    aadhar: null,
    pan: null,
    photo: null,
  },
  status: "draft",
};

const VendorContext = createContext(null);

export const VendorProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore all fields, but keep portfolio as URLs (blobs don't survive refresh)
        return { ...defaultState, ...parsed, portfolio: parsed.portfolio || [] };
      }
    } catch (e) {
      // Ignore parse errors
    }
    return { ...defaultState };
  });

  // Persist on every change
  useEffect(() => {
    if (state.status === "draft") {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    }
  }, [state]);

  const updateBasicInfo = (info) =>
    setState((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, ...info } }));

  const updatePortfolio = (files) =>
    setState((prev) => ({ ...prev, portfolio: files }));

  const addService = () =>
    setState((prev) => ({
      ...prev,
      services: [...prev.services, { name: "", description: "" }],
    }));

  const removeService = (index) =>
    setState((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));

  const updateService = (index, field, value) =>
    setState((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));

  const updatePricing = (pricing) =>
    setState((prev) => ({ ...prev, pricing: { ...prev.pricing, ...pricing } }));

  const updateKYC = (data) => 
    setState((prev) => ({ ...prev, kyc: { ...prev.kyc, ...data } }));

  const setStatus = (status) =>
    setState((prev) => ({ ...prev, status }));

  const resetForm = () => {
    localStorage.removeItem(DRAFT_KEY);
    setState({ ...defaultState });
  };

  return (
    <VendorContext.Provider
      value={{
        ...state,
        updateBasicInfo,
        updatePortfolio,
        addService,
        removeService,
        updateService,
        updatePricing,
        updateKYC,
        setStatus,
        resetForm,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendorContext = () => {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error("useVendorContext must be used within VendorProvider");
  return ctx;
};

export default VendorContext;
