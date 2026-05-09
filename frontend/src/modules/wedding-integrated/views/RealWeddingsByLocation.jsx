import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { weddingService } from "../../../services/weddingService";
import RealWeddingCardDetailed from "../components/RealWeddingCardDetailed";
import ScrollReveal from "../components/ScrollReveal";

const RealWeddingsByLocation = () => {
  const { destinationId } = useParams();
  const [filteredWeddings, setFilteredWeddings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        setLoading(true);
        const data = await weddingService.getRealWeddings();
        const filtered = data.filter(
          (w) => (w.destinationId?.toLowerCase() === destinationId?.toLowerCase() || w.location?.toLowerCase() === destinationId?.toLowerCase())
        );
        setFilteredWeddings(filtered);
      } catch (error) {
        console.error("Failed to fetch real weddings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeddings();
  }, [destinationId]);

  const destinationName = filteredWeddings.length > 0 ? filteredWeddings[0].location : destinationId;

  return (
    <div className="min-h-screen bg-[#fafafb] pb-20 pt-6 md:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/wedding" 
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4 group"
          >
            <div className="p-2 rounded-full border border-slate-200 group-hover:border-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </Link>
          
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 inline-block">
                  Wedding Stories
                </span>
                <h1 className="text-3xl md:text-6xl font-black text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  A legacy of love
                </h1>
                <p className="text-base md:text-xl text-muted-foreground mt-4 max-w-2xl font-normal md:font-medium">
                  Discover how couples celebrated their dream union in {destinationName}. 
                  Each story is a unique masterpiece of planning and emotion.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWeddings.length > 0 ? (
              filteredWeddings.map((wedding, i) => (
                <ScrollReveal key={wedding.id || wedding._id} delay={i * 100}>
                  <RealWeddingCardDetailed wedding={wedding} />
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-lg text-muted-foreground font-medium">
                  No real wedding stories found for this location yet. 
                  Stay tuned for upcoming inspirations!
                </p>
                <Link to="/wedding" className="inline-block mt-6 text-primary font-bold hover:underline">
                  Explore other destinations
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealWeddingsByLocation;
