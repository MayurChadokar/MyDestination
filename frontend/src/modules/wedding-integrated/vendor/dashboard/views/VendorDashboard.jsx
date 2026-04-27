import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Camera,
  Briefcase,
  IndianRupee,
  MapPin,
  Clock,
  Mail,
  Phone,
  Loader2,
  Inbox,
  Edit3,
  ChevronRight,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { getVendor } from "../../data/vendorApi";

const quickActions = [
  {
    to: "/vendor/onboarding/step-1",
    icon: Edit3,
    title: "Edit Profile",
    desc: "Update your business details",
  },
  {
    to: "/vendor/services",
    icon: Briefcase,
    title: "Manage Services",
    desc: "Add, edit, or remove services",
  },
  {
    to: "/vendor/portfolio",
    icon: Camera,
    title: "Manage Portfolio",
    desc: "Upload and manage your work",
  },
  {
    to: "/vendor/leads",
    icon: Inbox,
    title: "View Leads",
    desc: "See couple enquiries & respond",
  },
];

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      const result = await getVendor();
      setVendor(result.vendor);
      setLoading(false);
    };
    fetchVendor();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            No vendor profile found
          </h2>
          <Link
            to="/vendor/onboarding/step-1"
            className="text-primary hover:underline font-medium"
          >
            Start Onboarding
          </Link>
        </div>
      </div>
    );
  }

  const { basicInfo, portfolio = [], services = [], pricing = {}, status } = vendor;

  const formatPrice = (val) => {
    if (!val) return "—";
    return `₹${Number(val).toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <section className="wedding-gradient py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <StatusBadge status={status} />
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold text-background mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {basicInfo?.name || "Vendor"}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-background/80 text-sm">
            {basicInfo?.category && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> {basicInfo.category}
              </span>
            )}
            {basicInfo?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {basicInfo.location}
              </span>
            )}
            {basicInfo?.experience && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {basicInfo.experience} yrs experience
              </span>
            )}
          </div>
          {(basicInfo?.email || basicInfo?.phone) && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-background/60 text-xs mt-3">
              {basicInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {basicInfo.email}
                </span>
              )}
              {basicInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {basicInfo.phone}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className="p-4 rounded-2xl bg-card border border-border wedding-shadow hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 group animate-wedding-fade-up"
              >
                <div className="w-10 h-10 rounded-xl wedding-gradient flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                  <Icon className="w-5 h-5 text-background" />
                </div>
                <h3 className="text-sm font-bold mb-0.5">{action.title}</h3>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  {action.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Portfolio */}
        <div className="p-6 md:p-8 rounded-2xl bg-card border border-border wedding-shadow animate-wedding-fade-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Camera className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Portfolio
            </h2>
          </div>
          {portfolio.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {portfolio.map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border group">
                  <img
                    src={src}
                    alt={`Work ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic text-center py-6">
              No portfolio images uploaded yet.
            </p>
          )}
        </div>

        {/* Services */}
        <div className="p-6 md:p-8 rounded-2xl bg-card border border-border wedding-shadow animate-wedding-fade-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Services Offered
            </h2>
          </div>
          {services.filter(s => s.name).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.filter(s => s.name).map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm font-bold">{s.name}</p>
                  {s.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic text-center py-6">
              No services listed.
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="p-6 md:p-8 rounded-2xl bg-card border border-border wedding-shadow animate-wedding-fade-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pricing
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                Base Package
              </p>
              <p className="text-2xl font-black text-primary">
                {formatPrice(pricing.basePrice)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                Premium Package
              </p>
              <p className="text-2xl font-black">
                {formatPrice(pricing.premiumPrice)}
              </p>
            </div>
          </div>
          {pricing.description && (
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              {pricing.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
