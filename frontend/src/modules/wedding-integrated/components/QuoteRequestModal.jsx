import { useState } from "react";
import { X, Send } from "lucide-react";
import { saveEnquiry } from "../data/weddingData";

const QuoteRequestModal = ({ isOpen, onClose, plannerName }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    saveEnquiry({ ...form, plannerName, type: "quote_request" });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-2xl p-8 w-full max-w-md animate-wedding-scale-in wedding-shadow">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 animate-wedding-fade-up">
            <div className="w-16 h-16 rounded-full wedding-gradient flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7 text-background" />
            </div>
            <h3
              className="text-2xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Request Sent!
            </h3>
            <p className="text-muted-foreground mt-2">
              We'll get back to you shortly.
            </p>
          </div>
        ) : (
          <>
            <h3
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Request a Proposal
            </h3>
            {plannerName && (
              <p className="text-sm text-muted-foreground mb-6">
                From {plannerName}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "name", label: "Your Name", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Phone", type: "tel" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full font-medium wedding-gradient text-background transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                Send Request
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default QuoteRequestModal;
