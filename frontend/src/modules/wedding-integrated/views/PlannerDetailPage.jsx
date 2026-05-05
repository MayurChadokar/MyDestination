import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Briefcase } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import PackageCard from "../components/PackageCard";
import QuoteRequestModal from "../components/QuoteRequestModal";
import { planners } from "../data/weddingData";
import { useState } from "react";

const PlannerDetailPage = () => {
  const { id } = useParams();
  const planner = planners.find((p) => p.id === id);
  const [modalOpen, setModalOpen] = useState(false);

  if (!planner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
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
                src={planner.avatar}
                alt={planner.name}
                className="w-32 h-32 rounded-full bg-muted border-4 border-background wedding-shadow"
              />
              <div className="text-center md:text-left flex-1">
                <h1
                  className="text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {planner.name}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  {planner.company}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="font-semibold">{planner.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({planner.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" /> {planner.experience} years
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {planner.cities.join(", ")}
                  </div>
                </div>

                <p className="mt-4 text-muted-foreground max-w-2xl">
                  {planner.bio}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {planner.services.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>

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

      {/* Packages */}
      <section className="pt-2 pb-4 md:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2
              className="text-3xl font-bold mb-6 md:mb-6 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Packages
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {planner.packages.map((pkg, i) => (
              <ScrollReveal key={pkg.id} delay={i * 100}>
                <PackageCard pkg={pkg} onSelect={() => setModalOpen(true)} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
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
            {planner.reviews.map((review, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-primary fill-primary"
                      />
                    ))}
                  </div>
                  <p className="text-foreground italic">"{review.text}"</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">{review.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        plannerName={planner.name}
        targetId={planner.id}
        targetType="Vendor"
      />
    </div>
  );
};

export default PlannerDetailPage;
