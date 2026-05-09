import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown, Loader2, ArrowRight } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import useVendorForm from "../../hooks/useVendorForm";
import { useAuth } from "../../context/AuthContext";
import { getCategories } from "../../data/categoryApi";
import { weddingService } from "../../../../../services/weddingService";
import { getAdminVendors } from "../../../services/storage";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const Step1BasicInfo = () => {
  const navigate = useNavigate();
  const { basicInfo, updateBasicInfo, submitForm } = useVendorForm();
  const { user } = useAuth();
  const [errors, setErrors] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingLocs, setLoadingLocs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.success) {
          let cats = [...res.categories];
          
          try {
            const adminVendors = getAdminVendors() || [];
            const adminCats = [...new Set(adminVendors.map(v => v.category).filter(Boolean))];
            
            adminCats.forEach(ac => {
               if(!cats.find(c => c.name.toLowerCase() === ac.toLowerCase())) {
                   cats.push({ id: `custom-cat-${Date.now()}-${Math.random()}`, name: ac });
               }
            });
          } catch(e) {}
          
          setAvailableCategories(cats);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  // Fetch locations
  useEffect(() => {
    const fetchLocs = async () => {
      const defaultLocs = ["Goa", "Jaipur", "Udaipur", "Mumbai", "Delhi", "Jodhpur", "Kerala", "Mussoorie", "Jim Corbett"];
      try {
        const data = await weddingService.getDestinations();
        const apiLocs = data.map(d => d.name);
        // Combine API locations with defaults and remove duplicates
        const combined = [...new Set([...apiLocs, ...defaultLocs])];
        setAvailableLocations(combined);
      } catch (error) {
        console.error("Failed to load locations", error);
        setAvailableLocations(defaultLocs);
      } finally {
        setLoadingLocs(false);
      }
    };
    fetchLocs();
  }, []);

  // Auto-fill from Auth if vendor basicInfo is empty
  useEffect(() => {
    if (user && !basicInfo.name && !basicInfo.email) {
      updateBasicInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        category: user.category || "",
      });
    }
  }, [user, basicInfo.name, basicInfo.email, updateBasicInfo]);

  const handleNext = async () => {
    const newErrors = {};
    if (!basicInfo.name.trim()) newErrors.name = "Business name is required";
    if (!basicInfo.category) newErrors.category = "Please select a category";
    if (!basicInfo.location) newErrors.location = "Please select a location";
    if (!basicInfo.experience) newErrors.experience = "Experience is required";
    if (!basicInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!basicInfo.email.trim()) newErrors.email = "Email is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      // Save progress to backend so Admin can see the request immediately
      await submitForm();
      navigate("/wedding/vendor/onboarding/step-2");
    } catch (error) {
      toast.error("Failed to save progress. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 md:py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-4 md:pt-12 pb-4 px-4 text-center">
        <h1
          className="text-2xl md:text-4xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Vendor Registration
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Tell us about your business
        </p>
      </section>

      <ProgressBar currentStep={1} />

      <div className="max-w-2xl mx-auto px-4 pb-16 md:pb-24">
        <div className="p-5 md:p-8 rounded-2xl bg-card border border-border wedding-shadow animate-wedding-fade-up">
          <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Basic Information
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">
                Business Name *
              </label>
              <input
                type="text"
                value={basicInfo.name}
                onChange={(e) => updateBasicInfo({ name: e.target.value })}
                placeholder="e.g. Royal Lens Photography"
                className={inputClass}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">
                  Category *
                </label>
                 <Select
                  value={basicInfo.category}
                  onValueChange={(val) => updateBasicInfo({ category: val })}
                  disabled={loadingCats}
                >
                  <SelectTrigger className={`${inputClass} h-[50px] md:h-[52px]`}>
                    <SelectValue placeholder={loadingCats ? "Loading..." : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" avoidCollisions={false} className="max-h-[200px] overflow-y-auto">
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">
                  Location *
                </label>
                <Select
                  value={basicInfo.location}
                  onValueChange={(val) => updateBasicInfo({ location: val })}
                  disabled={loadingLocs}
                >
                  <SelectTrigger className={`${inputClass} h-[50px] md:h-[52px]`}>
                    <SelectValue placeholder={loadingLocs ? "Loading..." : "Select Location"} />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" avoidCollisions={false} className="max-h-[200px] overflow-y-auto">
                    {availableLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">
                Years of Experience *
              </label>
              <input
                type="number"
                min="0"
                value={basicInfo.experience}
                onChange={(e) => updateBasicInfo({ experience: e.target.value })}
                placeholder="e.g. 5"
                className={inputClass}
              />
              {errors.experience && <p className="text-xs text-destructive mt-1">{errors.experience}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={basicInfo.phone}
                  onChange={(e) => updateBasicInfo({ phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">
                  Email *
                </label>
                <input
                  type="email"
                  value={basicInfo.email}
                  onChange={(e) => updateBasicInfo({ email: e.target.value })}
                  placeholder="you@business.com"
                  className={inputClass}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next Step <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
