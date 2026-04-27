import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { formatPrice } from "../data/weddingData";

const PlannerCard = ({ planner }) => {
  return (
    <Link
      to={`/wedding/planners/${planner.id}`}
      className="group block h-full rounded-[2rem] overflow-hidden bg-white border-primary/20 md:bg-white/40 md:border-pink-100/30 p-6 sm:p-7 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(157,49,61,0.15)] hover:-translate-y-2 md:hover:bg-white md:hover:border-primary/20"
    >
      <div className="flex items-start gap-4">
        <img
          src={planner.avatar}
          alt={planner.name}
          className="w-16 h-16 rounded-full bg-muted"
          loading="lazy"
        />

        <div className="flex-1 min-w-0">
          <h3
            className="text-lg font-semibold truncate"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {planner.name}
          </h3>
          <p className="text-sm text-muted-foreground">{planner.company}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium">{planner.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({planner.reviewCount})
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="w-3.5 h-3.5" />
        {planner.cities.join(", ")}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {planner.specialties.map((s) => (
          <span
            key={s}
            className="px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="text-base font-semibold text-primary">
            {formatPrice(planner.startingPrice)}
          </p>
        </div>
        <span className="px-4 py-2 rounded-full text-xs font-medium wedding-gradient text-background transition-all duration-300 group-hover:shadow-md">
          View Profile
        </span>
      </div>
    </Link>
  );
};

export default PlannerCard;
