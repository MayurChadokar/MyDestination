import { useVendorContext } from "../context/VendorContext";
import { createVendor } from "../data/vendorApi";

const useVendorForm = () => {
  const ctx = useVendorContext();

  /**
   * Validate whether a given step has all required fields filled.
   */
  const isStepValid = (step) => {
    switch (step) {
      case 1: {
        const { name, category, location, experience, phone, email } = ctx.basicInfo;
        return !!(name.trim() && category && location && experience && phone.trim() && email.trim());
      }
      case 2:
        // Portfolio is optional
        return true;
      case 3:
        return (
          ctx.services.length > 0 &&
          ctx.services.some((s) => s.name.trim() !== "")
        );
      case 4:
        return !!ctx.pricing.basePrice;
      case 5:
        return true;
      default:
        return false;
    }
  };

  /**
   * Submit the full form via the fake API.
   */
  const submitForm = async () => {
    const payload = {
      basicInfo: ctx.basicInfo,
      portfolio: ctx.portfolio,
      services: ctx.services.filter((s) => s.name.trim()),
      pricing: ctx.pricing,
      kyc: ctx.kyc,
    };
    const result = await createVendor(payload);
    if (result.success) {
      ctx.setStatus("pending");
    }
    return result;
  };

  return {
    basicInfo: ctx.basicInfo,
    portfolio: ctx.portfolio,
    services: ctx.services,
    pricing: ctx.pricing,
    kyc: ctx.kyc,
    status: ctx.status,
    updateBasicInfo: ctx.updateBasicInfo,
    updatePortfolio: ctx.updatePortfolio,
    addService: ctx.addService,
    removeService: ctx.removeService,
    updateService: ctx.updateService,
    updatePricing: ctx.updatePricing,
    updateKYC: ctx.updateKYC,
    setStatus: ctx.setStatus,
    resetForm: ctx.resetForm,
    isStepValid,
    submitForm,
  };
};

export default useVendorForm;
