import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star, Shield, Clock, TrendingUp } from "lucide-react";
import { weddingDestinationService } from "../../../services/apiService";

const VendorHubPage = () => {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await weddingDestinationService.getCategories();
        setCategories(Array.isArray(data) ? data : (data?.categories || []));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const trustPoints = [
    { icon: Shield, title: "Verified Vendors", desc: "Every vendor is personally verified by our team before listing." },
    { icon: Star, title: "5000+ Reviews", desc: "Real reviews from real couples who have used these vendors." },
    { icon: Clock, title: "Quick Response", desc: "Most vendors respond within 24 hours of your enquiry." },
    { icon: TrendingUp, title: "Best Prices", desc: "Competitive pricing with no hidden charges, guaranteed." },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F6]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FFF5F6] min-h-screen">
      {/* Wedding Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h2 className="text-xl font-bold text-slate-800 mb-5">
          Wedding Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/wedding/vendors?category=${encodeURIComponent(cat.name)}`}
              className="group relative block overflow-hidden transition-all duration-300 hover:shadow-md"
              style={{ height: "140px", backgroundColor: cat.bgColor || "#F5F0EB" }}
            >
              {/* Text content */}
              <div className="absolute inset-0 flex flex-col justify-center pl-8 pr-[160px] z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3
                    className="text-[17px] font-bold tracking-tight"
                    style={{ color: cat.textColor || "#333", fontFamily: "'Playfair Display', serif" }}
                  >
                    {cat.name}
                  </h3>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 mt-[2px] opacity-70 transition-transform group-hover:translate-x-1"
                    style={{ color: cat.textColor || "#666" }}
                  />
                </div>
                <p
                  className="text-[13px] font-medium leading-relaxed opacity-70 line-clamp-2 pr-4"
                  style={{ color: cat.textColor || "#666" }}
                >
                  {cat.subcategories}
                </p>
              </div>

              {/* Large circular image intersecting the card to create a gentle arc with sharp angles */}
              <div
                className="absolute overflow-hidden rounded-full"
                style={{
                  width: "280px",
                  height: "280px",
                  right: "-100px",  // Adjust to control the size of the arc
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>


    </div>
  );
};

export default VendorHubPage;
