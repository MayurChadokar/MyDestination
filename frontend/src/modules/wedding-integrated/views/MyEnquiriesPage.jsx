import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ArrowLeft, Calendar, Mail, Phone, MapPin } from "lucide-react";
import { getEnquiries } from "../data/weddingData";
import ScrollReveal from "../components/ScrollReveal";

const MyEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    let localData = getEnquiries();
    if (localData.length === 0) {
      // Dummy data for premium UI demonstration
      localData = [
        {
          id: 1,
          destination: "Udaipur",
          date: "Oct 2026",
          guests: "250",
          name: "Sagar Chouhan",
          email: "sagar@example.com",
          phone: "+91 9876543210",
          questions: "I would like to know the cost of the royal lakeside venue with full catering and decor for a 2-day wedding.",
          createdAt: new Date().toISOString(),
          status: "Under Review"
        },
        {
          id: 2,
          destination: "Goa",
          date: "Jan 2027",
          guests: "150",
          name: "Sagar Chouhan",
          email: "sagar@example.com",
          phone: "+91 9876543210",
          questions: "Looking for a quiet beach wedding, mostly intimate. What packages start from ₹15L?",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          status: "Replied"
        }
      ];
    }
    setEnquiries(localData);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Replied":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafb] pb-20 pt-8 md:pt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <Link 
            to="/wedding" 
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4 md:mb-6 group"
          >
            <div className="p-2 rounded-full border border-slate-200 group-hover:border-primary transition-colors bg-white shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </Link>

          <ScrollReveal>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl font-black text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                My Enquiries
              </h1>
              <p className="text-muted-foreground font-medium">
                Keep track of your conversations with destination planners.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* List of Enquiries */}
        {enquiries.length > 0 ? (
          <div className="space-y-6">
            {enquiries.map((enq, index) => (
              <ScrollReveal key={enq.id} delay={index * 100}>
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 overflow-hidden relative group hover:shadow-xl transition-shadow duration-500">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-primary mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                          {enq.destination} Destination
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Enquiry for {enq.date}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Submitted on {new Date(enq.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className={`self-start md:self-auto px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusBadge(enq.status || "Under Review")}`}>
                      {enq.status || "Under Review"}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg"><Calendar className="w-4 h-4"/></div>
                        <span>Date: <span className="text-slate-900 font-semibold">{enq.date}</span></span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg"><Mail className="w-4 h-4"/></div>
                        <span>{enq.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg"><Phone className="w-4 h-4"/></div>
                        <span>{enq.phone}</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 h-full">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                        <MessageSquare className="w-4 h-4" /> Message
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-primary/20 pl-3">
                        "{enq.questions}"
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <p className="text-xl text-foreground font-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No enquiries sent
            </p>
            <p className="text-muted-foreground font-medium mb-6">
              Didn't find what you need? Reach out to plan your dream wedding.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnquiriesPage;
