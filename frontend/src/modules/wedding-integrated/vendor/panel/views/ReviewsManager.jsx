import React from "react";
import { 
  Star, 
  MessageSquare, 
  Send, 
  User, 
  Calendar, 
  Filter,
  CheckCircle,
  TrendingUp,
  ThumbsUp
} from "lucide-react";
import VendorLayout from "../layouts/VendorLayout";

const reviews = [
  { id: 1, user: "Neha Goyal", rating: 5, date: "12 Mar 2026", comment: "Zoya is absolutely amazing! She made us feel so comfortable during the shoot and the photos are beyond beautiful. Highly recommend her for weddings!", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" },
  { id: 2, user: "Rahul Sharma", rating: 4, date: "05 Mar 2026", comment: "The cinematic film was great, but delivery was delayed by a week. Overall good work.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
];

const ReviewsManager = () => {
  return (
    <VendorLayout title="Reviews">
      <div className="space-y-8 animate-wedding-fade-up">
        
        {/* Rating Summary Row */}
        <div className="flex justify-start">
           <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 border border-[#F3E9E2] flex items-center gap-6 md:gap-10 shadow-sm">
              <div className="space-y-0.5">
                 <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-4xl font-black text-[#4A3730]">4.8</span>
                    <Star className="w-5 h-5 md:w-6 md:h-6 fill-amber-400 text-amber-400" />
                 </div>
                 <p className="text-[10px] md:text-[11px] font-bold text-[#8E7E77] uppercase tracking-widest">Global Rating</p>
              </div>
              <div className="h-10 md:h-12 w-[1px] bg-slate-100" />
              <div className="text-right">
                 <p className="text-lg md:text-xl font-black text-emerald-500">98%</p>
                 <p className="text-[9px] md:text-[10px] font-bold text-[#8E7E77]">Sentiment</p>
              </div>
           </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-[#4A3730] " >Latest Reviews</h3>
              <button className="flex items-center gap-2 text-[11px] font-black text-[#8E7E77] uppercase tracking-widest bg-white border border-[#F3E9E2] px-4 py-2 rounded-xl">
                 <Filter className="w-3.5 h-3.5" /> Latest
              </button>
           </div>

           <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-[1.75rem] md:rounded-[2.5rem] border border-[#F3E9E2] p-4 md:p-6 shadow-sm space-y-3.5 md:space-y-4 group">
                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5 md:gap-4 text-left">
                         <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-[#F3E9E2] shrink-0">
                            <img src={rev.image} alt={rev.user} className="w-full h-full object-cover" />
                         </div>
                         <div className="min-w-0">
                            <h4 className="font-black text-[#4A3730] text-sm md:text-lg truncate" >{rev.user}</h4>
                            <div className="flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold text-[#8E7E77] uppercase tracking-widest leading-none">
                               <div className="flex items-center gap-0.5">
                                  {[1,2,3,4,5].map(s => (
                                    <Star key={s} className={`w-2.5 h-2.5 md:w-3 md:h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                                  ))}
                               </div>
                               <span className="flex items-center gap-1"><Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#B06A6C]" /> {rev.date}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="bg-[#F3E9E2]/30 p-3.5 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] border border-[#F3E9E2]/50">
                      <p className="text-[12.5px] md:text-[13px] text-[#4A3730] font-medium leading-relaxed">
                         "{rev.comment}"
                      </p>
                   </div>


                   {/* Reply Input */}
                   <div className="flex items-center gap-3 md:gap-4 pt-1">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-[#B06A6C] border border-[#F3E9E2] shrink-0">
                         <User className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex-1 relative">
                         <input 
                            placeholder="Write a reply..."
                            className="w-full pl-5 pr-11 py-2.5 md:py-4 bg-white border border-[#F3E9E2] rounded-xl text-[10px] font-bold text-slate-800 outline-none focus:border-[#B06A6C]/20 transition-all shadow-inner"
                         />
                         <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-[#B06A6C] text-white rounded-lg md:rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#B06A6C]/20">
                            <Send className="w-3.5 h-3.5" />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </VendorLayout>
  );
};

export default ReviewsManager;
