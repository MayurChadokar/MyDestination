import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Loader2,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { getVendor, updateVendor } from "../../data/vendorApi";

const VendorServices = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetch = async () => {
      const result = await getVendor();
      setVendor(result.vendor);
      setLoading(false);
    };
    fetch();
  }, []);

  const saveServices = async (services) => {
    setSaving(true);
    const result = await updateVendor(vendor.id, { services });
    setVendor(result.vendor);
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!newService.name.trim()) return;
    const services = [...(vendor.services || []), { ...newService }];
    await saveServices(services);
    setNewService({ name: "", description: "" });
    setShowAdd(false);
  };

  const handleDelete = async (index) => {
    const services = vendor.services.filter((_, i) => i !== index);
    await saveServices(services);
  };

  const handleEditSave = async () => {
    if (!editData.name.trim()) return;
    const services = vendor.services.map((s, i) =>
      i === editIndex ? { ...editData } : s
    );
    await saveServices(services);
    setEditIndex(null);
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...vendor.services[index] });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const services = vendor?.services?.filter((s) => s.name) || [];

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

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
            Manage Services
          </h1>
          <p className="text-background/70 text-sm mt-1">
            Add, edit, or remove the services you offer
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-4">
        {/* Add Service Button */}
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2 bg-card"
          >
            <Plus className="w-4 h-4" /> Add New Service
          </button>
        )}

        {/* Add Form */}
        {showAdd && (
          <div className="p-5 rounded-2xl bg-card border border-primary/20 wedding-shadow animate-wedding-fade-up space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                New Service
              </h3>
              <button
                onClick={() => { setShowAdd(false); setNewService({ name: "", description: "" }); }}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Service name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className={inputClass}
            />
            <textarea
              rows={2}
              placeholder="Service description"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className={`${inputClass} resize-none`}
            />
            <button
              onClick={handleAdd}
              disabled={saving || !newService.name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium wedding-gradient text-background transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Service
            </button>
          </div>
        )}

        {/* Services List */}
        {services.length > 0 ? (
          services.map((service, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-card border border-border wedding-shadow animate-wedding-fade-up"
            >
              {editIndex === index ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className={inputClass}
                  />
                  <textarea
                    rows={2}
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium wedding-gradient text-background hover:shadow-lg"
                    >
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Save
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="px-4 py-2 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-primary/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold">{service.name}</h3>
                      {service.description && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(index)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      disabled={saving}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 rounded-2xl bg-card border border-border text-center">
            <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No services added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorServices;
