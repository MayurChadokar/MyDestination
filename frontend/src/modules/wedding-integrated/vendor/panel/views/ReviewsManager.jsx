import React, { useState, useEffect } from "react";
import { 
  Star, 
  MessageSquare, 
  Send, 
  User, 
  Calendar, 
  Filter,
  CheckCircle,
  TrendingUp,
  ThumbsUp,
  Inbox
} from "lucide-react";
import VendorLayout from "../layouts/VendorLayout";
import { weddingVendorService } from "../../../../../services/apiService";
import { format } from "date-fns";
import toast from "react-hot-toast";

const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await weddingVendorService.getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    const reply = replies[reviewId];
    if (!reply?.trim()) return;

    try {
      await weddingVendorService.replyToReview(reviewId, reply);
      toast.success("Reply posted successfully!");
      
      // Update local state
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, reply } : r));
      setReplies(prev => ({ ...prev, [reviewId]: "" }));
    } catch (error) {
      toast.error(error.message || "Failed to post reply");
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return format(new Date(date), "dd MMM yyyy");
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <VendorLayout title="Reviews">
      <div className="space-y-8 animate-wedding-fade-up">
        
        {/* Rating Summary Row */}
        <div className="flex justify-start">
           <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 border border-[#F3E9E2] flex items-center gap-6 md:gap-10 shadow-sm">
              <div className="space-y-0.5">
                 <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-4xl font-black text-[#4A3730]">{averageRating}</span>
                    <Star className="w-5 h-5 md:w-6 md:h-6 fill-amber-400 text-amber-400" />
                 </div>
                 <p className="text-[10px] md:text-[11px] font-bold text-[#8E7E77] uppercase tracking-widest">Global Rating</p>
              </div>
              <div className="h-10 md:h-12 w-[1px] bg-slate-100" />
              <div className="text-right">
                 <p className="text-lg md:text-xl font-black text-[#B06A6C]">{reviews.length}</p>
                 <p className="text-[9px] md:text-[10px] font-bold text-[#8E7E77]">Total Reviews</p>
              </div>
           </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 pb-20">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-[#4A3730] " >Latest Reviews</h3>
              <button className="flex items-center gap-2 text-[11px] font-black text-[#8E7E77] uppercase tracking-widest bg-white border border-[#F3E9E2] px-4 py-2 rounded-xl">
                 <Filter className="w-3.5 h-3.5" /> Latest
              </button>
           </div>

           <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                   <div className="w-8 h-8 border-4 border-[#B06A6C] border-t-transparent rounded-full animate-spin" />
                   <p className="text-[10px] font-bold text-[#8E7E77] uppercase tracking-widest">Loading Reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-[2rem] border border-[#F3E9E2] border-dashed">
                  <div className="w-16 h-16 rounded-full bg-[#F3E9E2]/50 flex items-center justify-center">
                    <Inbox className="w-8 h-8 text-[#B06A6C]/30" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-black text-[#4A3730]">No reviews yet</h4>
                    <p className="text-[10px] font-bold text-[#8E7E77] uppercase tracking-widest mt-1">Customer reviews will appear here</p>
                  </div>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="bg-white rounded-[1.75rem] md:rounded-[2.5rem] border border-[#F3E9E2] p-4 md:p-6 shadow-sm space-y-3.5 md:space-y-4 group">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5 md:gap-4 text-left">
                          <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#F3E9E2]/50 flex items-center justify-center shadow-sm border border-[#F3E9E2] shrink-0">
                              <User className="w-6 h-6 text-[#B06A6C]/30" />
                          </div>
                          <div className="min-w-0">
                              <h4 className="font-black text-[#4A3730] text-sm md:text-lg truncate" >{rev.name}</h4>
                              <div className="flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold text-[#8E7E77] uppercase tracking-widest leading-none">
                                <div className="flex items-center gap-0.5">
                                    {[1,2,3,4,5].map(s => (
                                      <Star key={s} className={`w-2.5 h-2.5 md:w-3 md:h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                                    ))}
                                </div>
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#B06A6C]" /> {formatDate(rev.createdAt)}</span>
                              </div>
                          </div>
                        </div>
                    </div>

                    <div className="bg-[#F3E9E2]/30 p-3.5 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] border border-[#F3E9E2]/50">
                        <p className="text-[12.5px] md:text-[13px] text-[#4A3730] font-medium leading-relaxed">
                          "{rev.comment}"
                        </p>
                    </div>

                    {/* Vendor Reply */}
                    {rev.reply ? (
                      <div className="ml-6 md:ml-10 bg-slate-50 p-3.5 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] border border-slate-100 relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#B06A6C]/30 rounded-full" />
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-5 h-5 rounded-md bg-[#B06A6C] flex items-center justify-center text-white">
                              <MessageSquare className="w-3 h-3" />
                           </div>
                           <span className="text-[9px] font-black text-[#B06A6C] uppercase tracking-widest">Your Reply</span>
                        </div>
                        <p className="text-[12px] text-slate-600 font-medium italic">
                          "{rev.reply}"
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 md:gap-4 pt-1">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-[#B06A6C] border border-[#F3E9E2] shrink-0">
                            <User className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                        </div>
                        <div className="flex-1 relative">
                            <input 
                              placeholder="Write a reply..."
                              className="w-full pl-5 pr-11 py-2.5 md:py-4 bg-white border border-[#F3E9E2] rounded-xl text-[10px] font-bold text-slate-800 outline-none focus:border-[#B06A6C]/20 transition-all shadow-inner"
                              value={replies[rev._id] || ""}
                              onChange={(e) => setReplies(prev => ({ ...prev, [rev._id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleReply(rev._id)}
                            />
                            <button 
                              onClick={() => handleReply(rev._id)}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-[#B06A6C] text-white rounded-lg md:rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#B06A6C]/20"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </VendorLayout>
  );
};

export default ReviewsManager;
