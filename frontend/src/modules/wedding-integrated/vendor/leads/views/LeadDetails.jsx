import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  IndianRupee,
  Users,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { getLeadById, updateLeadStatus } from "../../data/leadsApi";

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const result = await getLeadById(id);
      setLead(result.lead);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    const result = await updateLeadStatus(id, newStatus);
    setLead(result.lead);
    setUpdating(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Lead not found
          </h2>
          <Link to="/vendor/leads" className="text-primary hover:underline font-medium">
            Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <section className="wedding-gradient py-8 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/vendor/leads"
            className="inline-flex items-center gap-1.5 text-background/70 hover:text-background text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Leads
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="text-2xl md:text-4xl font-bold text-background"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {lead.name}
            </h1>
            <StatusBadge status={lead.status} />
          </div>
          <p className="text-background/70 text-sm mt-1">
            Enquiry received on {formatDate(lead.createdAt)}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 -mt-4 space-y-4">
        {/* Details Card */}
        <div className="p-5 md:p-6 rounded-2xl bg-card border border-border wedding-shadow animate-wedding-fade-up">
          <h2
            className="text-base font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Enquiry Details
          </h2>
          <InfoRow icon={Calendar} label="Event Date" value={formatDate(lead.eventDate)} />
          <InfoRow icon={MapPin} label="Location" value={lead.location} />
          <InfoRow icon={IndianRupee} label="Budget" value={lead.budget} />
          <InfoRow icon={Users} label="Guest Count" value={lead.guestCount} />
        </div>

        {/* Contact Card */}
        <div className="p-5 md:p-6 rounded-2xl bg-card border border-border wedding-shadow animate-wedding-fade-up">
          <h2
            className="text-base font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact Information
          </h2>
          <InfoRow icon={Mail} label="Email" value={lead.email} />
          <InfoRow icon={Phone} label="Phone" value={lead.phone} />
        </div>

        {/* Requirement Card */}
        <div className="p-5 md:p-6 rounded-2xl bg-card border border-border wedding-shadow animate-wedding-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <h2
              className="text-base font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Requirement
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-11">
            {lead.requirement}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-5 md:p-6 rounded-2xl bg-card border border-border wedding-shadow animate-wedding-fade-up">
          <h2
            className="text-base font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {lead.status === "new" && (
              <button
                onClick={() => handleStatusUpdate("contacted")}
                disabled={updating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-all disabled:opacity-50"
              >
                {updating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Mark as Contacted
              </button>
            )}
            {lead.status === "contacted" && (
              <button
                onClick={() => handleStatusUpdate("closed")}
                disabled={updating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-all disabled:opacity-50"
              >
                {updating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Mark as Closed
              </button>
            )}
            {lead.status === "closed" && (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                <XCircle className="w-4 h-4" />
                This lead is closed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
