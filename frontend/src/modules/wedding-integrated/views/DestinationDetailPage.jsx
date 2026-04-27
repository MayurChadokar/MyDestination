import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Building2,
  Users,
  Star,
  Heart,
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import PlannerCard from "../components/PlannerCard";
import {
  destinations,
  planners,
  formatPrice,
  saveFavourite,
  removeFavourite,
  getFavourites,
} from "../data/weddingData";
import { getAllDestinations, getApprovedVenuesByDestination } from "../services/storage";
import { useState, useEffect } from "react";

const DestinationDetailPage = () => {
  const { id } = useParams();
  const [dest, setDest] = useState(null);
  const [favs, setFavs] = useState(getFavourites());
  const [selectedImg, setSelectedImg] = useState(null);
  const [dynamicVenues, setDynamicVenues] = useState([]);

  useEffect(() => {
    const allDests = getAllDestinations();
    const found = allDests.find((d) => d.id === id);
    setDest(found);
    if (found) {
      setDynamicVenues(getApprovedVenuesByDestination(id));
    }
  }, [id]);

  if (!dest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Destination not found
          </h2>
          <Link
            to="/wedding/destinations"
            className="text-primary hover:underline"
          >
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  const destPlanners = planners.filter((p) => dest.plannerIds.includes(p.id));
  const isFav = favs.includes(dest.id);

  const toggleFav = () => {
    if (isFav) {
      removeFavourite(dest.id);
    } else {
      saveFavourite(dest.id);
    }
    setFavs(getFavourites());
  };

  return (
    <div>
      {/* Gallery Hero */}
      <section className="relative h-[45vh] md:h-[60vh] min-h-[300px] md:min-h-[400px] overflow-hidden">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="max-w-6xl mx-auto flex items-end justify-between">
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold text-background"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {dest.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-background/80">
                <MapPin className="w-4 h-4" /> {dest.location}
              </div>
            </div>
            <button
              onClick={toggleFav}
              className="p-3 rounded-full bg-background/20 backdrop-blur-sm transition-all hover:bg-background/40"
            >
              <Heart
                className={`w-6 h-6 ${isFav ? "text-destructive fill-destructive" : "text-background"}`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 md:py-12 px-4 border-b border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: IndianRupee, label: "Avg Cost", value: dest.avgCost || (dest.startingPrice ? `₹${(dest.startingPrice / 100000).toFixed(1)}L+` : "Varies") },
            { icon: Calendar, label: "Best Season", value: dest.bestSeason || "Oct - Mar" },
            {
              icon: Building2,
              label: "Venues",
              value: `${dest.venueCount || dynamicVenues.length || 5}+ Venues`,
            },
            { icon: Star, label: "Category", value: dest.category || "Heritage" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-lg font-semibold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="pt-6 pb-6 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <p className="text-sm md:text-lg leading-relaxed text-muted-foreground">
              {dest.description}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Venues */}
      <section className="pt-6 pb-8 md:py-16 px-4 wedding-gradient-soft">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2
              className="text-3xl font-bold mb-6 md:mb-10 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Recommended Venues
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...dest.venues, ...dynamicVenues].map((venue, i) => (
              <ScrollReveal key={venue.id} delay={i * 100}>
                <Link to={`/wedding/vendors/${venue.id}`} className="block h-full group">
                  <div className="p-6 rounded-2xl bg-card border border-border h-full transition-all duration-300 group-hover:wedding-shadow group-hover:-translate-y-1">
                    <h3
                      className="text-xl font-semibold"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {venue.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {venue.type}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <Users className="w-4 h-4 text-primary" /> Up to{" "}
                        {venue.capacity} guests
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <IndianRupee className="w-4 h-4 text-primary" />{" "}
                        {formatPrice(venue.pricePerDay)}/day
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Planners for this destination */}
      <section className="pt-4 pb-16 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2
              className="text-3xl font-bold mb-6 md:mb-10 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Recommended Planners
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destPlanners.map((planner, i) => (
              <ScrollReveal key={planner.id} delay={i * 100}>
                <PlannerCard planner={planner} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-16 pb-40 md:pb-32 px-4 wedding-gradient -mb-24 md:-mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl font-bold text-background mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Plan Your {dest.name} Wedding
          </h2>
          <Link
            to="/wedding/enquiry"
            className="inline-block mt-4 px-10 py-4 rounded-full text-base font-medium bg-background text-foreground transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Start Enquiry
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80"
          onClick={() => setSelectedImg(null)}
        >
          <img
            src={selectedImg}
            alt=""
            className="max-w-[90vw] max-h-[90vh] rounded-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default DestinationDetailPage;
