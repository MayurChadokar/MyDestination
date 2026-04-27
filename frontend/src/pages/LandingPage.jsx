import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, DollarSign, Info, Navigation, CheckCircle, Car, Activity, Hotel, Umbrella, HandCoins, Briefcase } from 'lucide-react';
import logo from '../assets/rokologin-removebg-preview.png';
import heroBg from '../assets/landing/hero_travel1.png';
import coupleImg from '../assets/landing/landingPageImage.png';
import destAmsterdam from '../assets/landing/dest_amsterdam.png';
import destLisbon from '../assets/landing/dest_lisbon.png';
import destDublin from '../assets/landing/dest_dublin.png';
import destExuma from '../assets/landing/dest_exuma.png';
import latestTourBg from '../assets/landing/latest_tour_bg.png';
import airplane from '../assets/landing/airplane.jpg';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col bg-[#0a0a0a] overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Travel Hero" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
        </div>
        
        {/* Navbar */}
        <nav className="relative z-50 flex items-center justify-between px-8 md:px-20 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MyDestionation" className="h-12 w-auto object-contain" />
            <span className="text-white font-bold text-2xl tracking-tight">MyDestionation</span>
          </div>
          <div className="hidden lg:flex gap-10 text-white/90 text-sm font-bold tracking-wide">
            <a href="#" className="text-emerald-400 transition">Home</a>
            <Link to="/blogs" className="hover:text-emerald-400 transition">Tours</Link>
            <a href="#about" className="hover:text-emerald-400 transition">Destination</a>
            <Link to="/contact" className="hover:text-emerald-400 transition">Hotel</Link>
            <a href="#about" className="hover:text-emerald-400 transition">About us</a>
            <Link to="/privacy" className="hover:text-emerald-400 transition">Contact</Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-between px-8 md:px-20 pt-10 pb-32">
          {/* Main Title Left */}
          <div className="flex-1 flex flex-col items-start gap-4 z-10">
            <div className="relative">
              <h1 className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black text-white leading-[0.8] uppercase tracking-tighter opacity-10 absolute -left-2 -top-2 select-none">
                Experience
              </h1>
              <h1 className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black text-white leading-[0.8] uppercase tracking-tighter">
                Unforgettable
              </h1>
              <div className="flex items-center gap-4 mt-2">
                 <span className="text-4xl md:text-5xl lg:text-7xl font-['Dancing_Script',cursive] text-emerald-400 -rotate-6">
                    travel
                 </span>
                 <h1 className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black text-white leading-[0.8] uppercase tracking-tighter">
                    Experiences
                 </h1>
              </div>
            </div>
          </div>

          {/* Couple Image Center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-full h-full max-w-5xl flex items-end justify-center">
                <img 
                    src={coupleImg} 
                    alt="Couple Trekking" 
                    className="w-auto h-[80%] md:h-[95%] object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                />
            </div>
          </div>

          {/* Info & Button Right */}
          <div className="flex-1 flex flex-col items-end text-right gap-8 z-30 mt-auto md:mt-0">
            <div className="max-w-xs space-y-4">
                <p className="text-white text-lg md:text-xl font-medium leading-relaxed">
                    Find amazing things to do. Anytime, anywhere.
                </p>
                <button className="bg-emerald-600 text-white px-10 py-4 rounded-sm text-sm font-black uppercase tracking-widest hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 ml-auto group pointer-events-auto">
                    Explore Our Tours 
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Features */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-sm p-4 flex flex-col md:flex-row gap-4 mb-16 border border-gray-100">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="border border-gray-200 p-3 text-sm text-gray-600 focus:outline-none"><option>Destinations</option></select>
            <select className="border border-gray-200 p-3 text-sm text-gray-600 focus:outline-none"><option>Month</option></select>
            <select className="border border-gray-200 p-3 text-sm text-gray-600 focus:outline-none"><option>Travel Type</option></select>
          </div>
          <button className="bg-emerald-600 text-white px-8 py-3 text-sm font-medium hover:bg-emerald-700 transition">Search</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center pb-20 border-b border-emerald-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="https://cdn-icons-gif.flaticon.com/6844/6844422.gif" alt="Location Icon" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-sm font-bold text-gray-800 leading-tight">Travel without<br/>hassle</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="https://cdn-icons-gif.flaticon.com/17093/17093492.gif" alt="Reviews Icon" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-sm font-bold text-gray-800 leading-tight">Millions of<br/>reviews</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="https://cdn-icons-gif.flaticon.com/19028/19028843.gif" alt="Budget Icon" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-sm font-bold text-gray-800 leading-tight">Perfect for your<br/>budget</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="https://cdn-icons-gif.flaticon.com/9284/9284550.gif" alt="Travel Tips Icon" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-sm font-bold text-gray-800 leading-tight">Best travel<br/>tips</span>
          </div>
        </div>
      </section>

      {/* 3. Top Destinations */}
      <section className="pt-8 pb-20 max-w-6xl mx-auto px-4 text-center">
        <p className="text-emerald-700 text-sm mb-2">Select your perfect trips</p>
        <h2 className="text-3xl font-bold tracking-wider text-gray-900 mb-12">TOP DESTINATION</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { img: destAmsterdam, title: 'Amsterdam, Netherland' },
            { img: destLisbon, title: 'Lisbon, Portugal' },
            { img: destDublin, title: 'Dublin, Ireland' },
            { img: destExuma, title: 'Exuma, Bahamas' }
          ].map((dest, i) => (
            <div key={i} className="text-center group cursor-pointer">
              <div className="overflow-hidden mb-4 aspect-square">
                <img src={dest.img} alt={dest.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-3">{dest.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed px-2">
                Discover the charm of historic canals and vibrant culture in the heart of the Netherlands.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Latest Tour */}
      <section className="relative py-32 bg-emerald-900 text-center text-white my-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={latestTourBg} alt="City Night" className="w-full h-full object-cover opacity-80" />
        </div>
        
        {/* Floating Images (Polaroid Style) */}
        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 hidden lg:block z-10">
          <div className="bg-white p-1 pb-2 transform -rotate-12 border-2 border-white shadow-lg">
            <img src={destAmsterdam} alt="Tour Left" className="w-64 h-80 object-cover" />
          </div>
        </div>
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden lg:block z-10">
          <div className="bg-white p-1 pb-2 transform rotate-12 border-2 border-white shadow-lg">
            <img src={destLisbon} alt="Tour Right" className="w-64 h-80 object-cover" />
          </div>
        </div>

        <div className="relative z-20 max-w-lg mx-auto">
          <p className="text-sm mb-2 font-medium tracking-wide">Last minute trip</p>
          <h2 className="text-5xl font-black tracking-widest mb-8">OUR LATEST TOUR</h2>
          <p className="text-sm mb-2 opacity-80">Fri 15 March to Sun 17 March</p>
          <p className="text-xl font-bold mb-10">$125 per person</p>
          <Link to="/home" className="inline-block bg-white text-emerald-950 px-12 py-4 text-sm font-black tracking-widest hover:bg-emerald-50 transition shadow-xl uppercase">
            BOOK NOW
          </Link>
        </div>
      </section>

      {/* 5. Travel Tips / Flight Search (New Section) */}
      <section className="pt-8 pb-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-emerald-700 text-sm mb-2 font-medium">Book your categories</p>
          <div className="relative inline-block">
            <h2 className="text-4xl font-black tracking-widest text-gray-900">TRAVEL TIPS</h2>
            <div className="absolute -left-12 top-1/2 w-10 h-[2px] bg-gray-200"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Text */}
          <div className="lg:w-1/3">
            <p className="text-gray-500 text-sm leading-relaxed">
              At MyDestionation, we believe that every journey should be as unique as the traveler. 
              Our expert travel tips and curated categories help you plan the perfect escape, 
              from budget-friendly flights to luxury stays. Explore with confidence and ease.
            </p>
          </div>

          {/* Right Card with Form */}
          <div className="lg:w-2/3 w-full bg-white border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row gap-8 items-center rounded-sm">
            {/* Circular Image */}
            <div className="w-64 h-64 flex-shrink-0 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
               <img src={airplane} alt="Flight View" className="w-full h-full object-cover" />
            </div>

            {/* Form Fields */}
            <div className="flex-1 w-full space-y-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Flights</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">City / Destination</label>
                  <select className="w-full border border-gray-200 p-2 text-sm focus:outline-none bg-gray-50/50"><option>---</option></select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Date from</label>
                  <input type="text" className="w-full border border-gray-200 p-2 text-sm focus:outline-none" placeholder="" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">No. of person</label>
                  <select className="w-full border border-gray-200 p-2 text-sm focus:outline-none bg-gray-50/50"><option>---</option></select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Date To</label>
                  <input type="text" className="w-full border border-gray-200 p-2 text-sm focus:outline-none" placeholder="" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button className="bg-emerald-700 text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition shadow-lg">
                   Search Flight
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Categories */}
      <section className="pt-4 pb-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Hotels', icon: <Hotel />, img: destExuma },
            { title: 'Cars', icon: <Car />, img: destLisbon },
            { title: 'Activities', icon: <Activity />, img: destDublin }
          ].map((cat, i) => (
            <div key={i} className="text-center flex flex-col items-center">
              <div className="w-full h-48 mb-6 overflow-hidden">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-medium mb-4">{cat.title}</h3>
              <Link to="/home" className="bg-emerald-600 text-white px-8 py-2 text-sm hover:bg-emerald-700 transition">
                Search
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Services Section */}
      <section className="pt-4 pb-20 max-w-6xl mx-auto px-4 text-center">
        <p className="text-emerald-700 text-sm mb-2 font-medium">We fulfill your needs</p>
        <div className="relative inline-block mb-16">
          <h2 className="text-4xl font-black tracking-widest text-gray-900">SERVICES</h2>
          <div className="absolute -left-12 top-1/2 w-10 h-[2px] bg-gray-200"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-6">
              <img src="https://cdn-icons-gif.flaticon.com/15576/15576191.gif" alt="Transport Icon" className="w-16 h-16 object-contain" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Small transport</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Reliable and comfortable transportation services for your local tours and transfers.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-6">
              <img src="https://cdn-icons-gif.flaticon.com/8701/8701055.gif" alt="Events Icon" className="w-16 h-16 object-contain" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Events</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Plan and execute unforgettable events and gatherings with our expert coordination.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-6">
              <img src="https://cdn-icons-gif.flaticon.com/19034/19034819.gif" alt="Vacation Icon" className="w-16 h-16 object-contain" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Vacation package</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tailor-made vacation packages designed to give you the ultimate travel experience.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-6">
              <img src="https://cdn-icons-gif.flaticon.com/19008/19008727.gif" alt="Resorts Icon" className="w-16 h-16 object-contain" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Resorts stay</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Handpicked luxury resorts and stays for your perfect relaxation and comfort.
            </p>
          </div>
        </div>
      </section>

      {/* 8. About Us Section */}
      <section id="about" className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-emerald-700 text-sm mb-2 font-medium">Our featured story</p>
          <div className="relative inline-block">
            <h2 className="text-4xl font-black tracking-widest text-gray-900">ABOUT US</h2>
            <div className="absolute -left-12 top-1/2 w-10 h-[2px] bg-gray-200"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Image */}
          <div className="lg:w-1/2 relative">
            <img src={destExuma} alt="About Us" className="w-full h-[500px] object-cover shadow-2xl rounded-sm" />
            <div className="absolute -right-8 bottom-8 hidden lg:block">
               <div className="bg-emerald-600 p-6 rounded-sm shadow-xl text-white">
                  <Navigation size={48} />
               </div>
            </div>
          </div>

          {/* Right Content - Milestones */}
          <div className="lg:w-1/2 space-y-10">
            {[
              { title: "Our never ending footsteps", desc: "Since our inception, we have been dedicated to exploring the uncharted and bringing the best stories to you." },
              { title: "Our total trips till now", desc: "Over 500+ successful group tours and thousands of happy individual travelers across the globe." },
              { title: "Our most incredible moments to share", desc: "Every journey is a story. We cherish the smiles and memories we've created with our community." },
              { title: "Our travel book released on 1991 year", desc: "A legacy of travel excellence that started decades ago, now evolved into a modern travel partner." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="bg-white border-2 border-emerald-100 p-3 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <div className="space-y-2 border-b border-gray-100 pb-6 w-full">
                  <h4 className="text-lg font-bold text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-md">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Our Staff Section */}
      <section className="relative mt-20">
        {/* Staff Banner */}
        <div className="relative h-[400px] flex flex-col items-center justify-center text-center text-white px-4">
          <div className="absolute inset-0 z-0">
            <img src={heroBg} alt="Staff Banner" className="w-full h-full object-cover brightness-[0.4]" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-4xl font-black tracking-widest">OUR STAFF</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Our team of dedicated travel experts is here to ensure your journey is smooth, safe, and unforgettable. 
              Meet the people who make MyDestionation the best in the business.
            </p>
            <button className="bg-white text-emerald-950 px-10 py-3 rounded-sm text-xs font-black tracking-widest hover:bg-emerald-50 transition uppercase">
              JOIN NOW
            </button>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: "Elly Spitch", role: "CUSTOMER CARE", img: destAmsterdam },
              { name: "Hannah Zafron", role: "SPECIALIST", img: destLisbon },
              { name: "Janne Dcosta", role: "FOUNDER", img: destDublin },
              { name: "Adam Johnson", role: "PRESIDENT", img: destExuma }
            ].map((staff, i) => (
              <div key={i} className="bg-white p-2 shadow-xl text-center group">
                <div className="aspect-square overflow-hidden mb-6">
                  <img src={staff.img} alt={staff.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">{staff.name}</h4>
                <p className="text-xs text-emerald-600 font-bold tracking-widest mb-4 uppercase">{staff.role}</p>
                <p className="text-xs text-gray-500 mb-6 px-4">
                  Expert in providing personalized travel solutions and ensuring customer satisfaction.
                </p>
                <button className="border-2 border-gray-200 px-6 py-2 rounded-full text-[10px] font-bold text-gray-400 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all uppercase mb-4">
                  Contact Me
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Footer (Minimal) */}
      <footer className="bg-emerald-950 text-white pt-16 pb-8 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="MyDestionation" className="h-10 w-auto brightness-0 invert" />
              <span className="font-bold text-xl">MyDestionation</span>
            </div>
            <p className="text-xs text-gray-400">
              Your ultimate companion for unforgettable journeys. We provide premium travel services, 
              personalized itineraries, and the best deals for your next adventure.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#about">About us</a></li>
              <li><Link to="/home">Services</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2"><MapPin size={16} className="mt-1 flex-shrink-0" /> 1 My Address, My Street, New York City, NY, USA</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Pay safely with us</h4>
            <p className="text-xs text-gray-400">The payment is encrypted and transmitted securely with an SSL protocol.</p>
          </div>
        </div>
        <div className="text-center border-t border-gray-800 pt-8 text-xs text-gray-500">
          © {new Date().getFullYear()} MyDestionation. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
