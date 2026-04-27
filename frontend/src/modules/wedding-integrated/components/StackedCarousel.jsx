import React, { useState, useEffect } from "react";
import { cn } from './utils';

const StackedCarousel = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div
      className="relative w-full max-w-[340px] h-[450px] md:max-w-[360px] md:h-[460px] mx-auto flex items-center justify-center"
    >
      {items.map((item, i) => {
        const diff = (i - activeIndex + items.length) % items.length;

        let scale = 1;
        let translateY = 0;
        let translateX = '0px';
        let rotateZ = 0;
        let zIndex = 40;
        let opacity = 1;

        if (diff === 1) {
          scale = 0.94;
          translateY = 30;
          rotateZ = -4;
          zIndex = 30;
          opacity = 1;
        } else if (diff === 2) {
          scale = 0.88;
          translateY = 60;
          rotateZ = 4;
          zIndex = 20;
          opacity = 1;
        } else if (diff >= 3) {
          // Outgoing card (slides right, rotates to simulate a shuffle "taash ke patte" effect)
          scale = 0.9;
          translateY = -20;
          translateX = '130%';
          rotateZ = 15;
          zIndex = 10;
          opacity = 0;
        }

        return (
          <div
            key={item.title}
            className="absolute top-0 left-0 right-0 w-full transition-all duration-700 ease-in-out origin-center cursor-pointer will-change-transform"
            style={{
              transform: `translateX(${translateX}) translateY(${translateY}px) scale(${scale}) rotateZ(${rotateZ}deg)`,
              opacity: opacity,
              zIndex: zIndex,
            }}
          >
            {/* Card Match: DestinationCard Aesthetics */}
            <div className="bg-white rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden h-full flex flex-col border border-gray-100/60 transition-all duration-500 ease-in-out">

              {/* Top Image Area */}
              <div className="relative h-[220px] md:h-[240px] w-full shrink-0 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    {item.icon && <item.icon className="w-16 h-16 text-primary/30" />}
                  </div>
                )}

                {/* Very subtle bottom gradient melting into white */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />

                {/* Pill Top Right */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-primary shadow-sm flex items-center gap-1.5 border border-primary/10 tracking-wide uppercase">
                  Step {i + 1}
                </div>
              </div>

              {/* Lower Content Body */}
              <div className="px-6 pb-7 pt-2 flex flex-col text-left flex-grow">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4">
                  {item.title}
                </h3>

                <div className="w-full border-t border-slate-100 mb-4" />

                <div className="flex items-start gap-3 text-sm text-slate-500 font-medium">
                  {item.icon && (
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-[-2px]">
                      <item.icon className="w-4 h-4" />
                    </div>
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap">{item.desc}</p>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StackedCarousel;

