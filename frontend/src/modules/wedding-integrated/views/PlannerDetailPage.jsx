import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Briefcase, Loader2 } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import PackageCard from "../components/PackageCard";
import QuoteRequestModal from "../components/QuoteRequestModal";
import { weddingVendorService, weddingReviewService } from "../../../services/apiService";

const PlannerDetailPage = () => {
  const { id } = useParams();
  const [planner, setPlanner] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await weddingVendorService.getPublicVendorDetail(id);
        setPlanner(data);
        const revs = await weddingReviewService.getPublicReviews(id);
        setReviews(revs);
      } catch (err) {
        console.error("Failed to fetch planner details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!planner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Planner not found
          </h2>
          <Link to="/wedding/planners" className="text-primary hover:underline">
            Back to Planners
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <section className="pt-8 md:pt-10 pb-8 md:pb-10 px-4 wedding-gradient-soft">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <img
                src={planner.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + planner.name}
                alt={planner.name}
                className="w-32 h-32 rounded-full bg-muted border-4 border-background wedding-shadow object-cover"
              />
              <div className="text-center md:text-left flex-1">
                <h1
                  className="text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {planner.name}
                </h1>
                <p className="text-lg text-muted-foreground mt-1 uppercase tracking-widest text-xs font-bold">
                  {planner.category}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="font-semibold">{planner.rating || "5.0"}</span>
                    <span className="text-sm text-muted-foreground">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" /> {planner.experience || "5+"} years
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {planner.location || "Multiple Cities"}
                  </div>
                </div>

                <p className="mt-4 text-muted-foreground max-w-2xl">
                  {planner.about || "Premium wedding planner dedicated to making your dream wedding a reality."}
                </p>

                <div className="mt-6">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-8 py-3 rounded-full text-sm font-medium wedding-gradient text-background transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Request Proposal
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Portfolio / Projects */}
      {(planner.portfolio?.length > 0 || planner.projects?.length > 0) && (
        <section className="pt-2 pb-4 md:py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2
                className="text-3xl font-bold mb-6 md:mb-6 text-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Portfolio
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(planner.portfolio || []).map((img, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                    <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="pt-2 pb-8 md:py-10 px-4 wedding-gradient-soft">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2
                className="text-3xl font-bold mb-6 md:mb-6 text-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Reviews
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {reviews.map((review, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      {Array.from({ length: review.rating || 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 text-primary fill-primary"
                        />
                      ))}
                    </div>
                    <p className="text-foreground italic">"{review.comment || review.text}"</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-semibold">{review.user?.name || "Verified Client"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuoteRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        plannerName={planner.name}
        targetId={planner._id}
        targetType="Vendor"
      />
    </div>
  );
};

export default PlannerDetailPage;
