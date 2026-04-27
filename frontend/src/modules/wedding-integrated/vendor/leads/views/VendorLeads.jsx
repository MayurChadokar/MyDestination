import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  IndianRupee,
  ChevronRight,
  Inbox,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { getLeads } from "../../data/leadsApi";

const statusFilters = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "closed", label: "Closed" },
];

const VendorLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      const result = await getLeads();
      setLeads(result.leads);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredLeads =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const getCount = (key) =>
    key === "all" ? leads.length : leads.filter((l) => l.status === key).length;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
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

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <section className="wedding-gradient py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/vendor/dashboard"
            className="inline-flex items-center gap-1.5 text-background/70 hover:text-background text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1
            className="text-2xl md:text-4xl font-bold text-background"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Leads & Enquiries
          </h1>
          <p className="text-background/70 text-sm mt-1">
            {leads.length} total enquiries from couples
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === f.key
                  ? "wedding-gradient text-background shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {f.label} ({getCount(f.key)})
            </button>
          ))}
        </div>

        {/* Leads List */}
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <Link
              key={lead.id}
              to={`/vendor/leads/${lead.id}`}
              className="block p-5 rounded-2xl bg-card border border-border wedding-shadow hover:-translate-y-0.5 transition-all duration-300 group animate-wedding-fade-up"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-sm font-bold">{lead.name}</h3>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(lead.eventDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {lead.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" /> {lead.budget}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                    {lead.requirement}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-1 transition-colors" />
              </div>
            </Link>
          ))
        ) : (
          <div className="p-12 rounded-2xl bg-card border border-border text-center">
            <Inbox className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No leads found for this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorLeads;
