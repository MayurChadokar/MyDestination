import goaImg from "../assets/wedding-goa.jpg";
import jaipurImg from "../assets/wedding-jaipur.jpg";
import udaipurImg from "../assets/wedding-udaipur.jpg";
import keralaImg from "../assets/wedding-kerala.jpg";
import rishikeshImg from "../assets/wedding-rishikesh.jpg";
import jimcorbettImg from "../assets/wedding-jimcorbett.jpg";

import rwGoaCouple from "../assets/rw-goa-couple.png";
import rwGoaCouple2 from "../assets/rw-goa-couple-2.png";
import rwUdaipurCouple from "../assets/rw-udaipur-couple.png";
import rwJaipurCouple from "../assets/rw-jaipur-couple.png";
import rwKeralaCouple from "../assets/rw-kerala-couple.png";
import rwRishikeshCouple from "../assets/rw-rishikesh-couple.png";

export const destinations = [
  {
    id: "goa",
    name: "Goa",
    location: "Goa, India",
    category: "Beach",
    image: goaImg,
    description:
      "Sun-kissed beaches, swaying palms, and golden sunsets create the perfect backdrop for a dreamy beach wedding. Goa offers a blend of Portuguese charm and tropical vibes.",
    startingPrice: 1500000,
    avgCost: "₹15L – ₹50L",
    bestSeason: "Oct – Mar",
    venueCount: 12,
    venues: [
      { id: "venue-v1", name: "Taj Exotica", type: "Luxury Resort", capacity: 500, pricePerDay: 800000 },
      { id: "venue-v2", name: "W Goa", type: "Beachfront Hotel", capacity: 300, pricePerDay: 600000 },
      { id: "venue-v3", name: "Cidade de Goa", type: "Heritage Resort", capacity: 400, pricePerDay: 500000 },
    ],
    plannerIds: ["p1", "p2", "p5"],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    location: "Rajasthan, India",
    category: "Heritage",
    image: jaipurImg,
    description:
      "The Pink City offers majestic forts, ornate palaces, and regal hospitality. A Jaipur wedding is a celebration steeped in royal grandeur and timeless elegance.",
    startingPrice: 2000000,
    avgCost: "₹20L – ₹1Cr",
    bestSeason: "Nov – Feb",
    venueCount: 18,
    venues: [
      { id: "venue-v4", name: "Rambagh Palace", type: "Palace", capacity: 800, pricePerDay: 1500000 },
      { id: "venue-v5", name: "Samode Palace", type: "Heritage Haveli", capacity: 400, pricePerDay: 900000 },
      { id: "venue-v6", name: "Fairmont Jaipur", type: "Luxury Hotel", capacity: 600, pricePerDay: 700000 },
    ],
    plannerIds: ["p1", "p3", "p6"],
  },
  {
    id: "udaipur",
    name: "Udaipur",
    location: "Rajasthan, India",
    category: "Heritage",
    image: udaipurImg,
    description:
      "Known as the Venice of the East, Udaipur's shimmering lakes, white marble palaces, and Aravalli hills create a fairy-tale wedding setting.",
    startingPrice: 2500000,
    avgCost: "₹25L – ₹2Cr",
    bestSeason: "Oct – Mar",
    venueCount: 15,
    venues: [
      { id: "venue-v7", name: "Taj Lake Palace", type: "Lake Palace", capacity: 250, pricePerDay: 2000000 },
      { id: "venue-v8", name: "The Oberoi Udaivilas", type: "Luxury Resort", capacity: 500, pricePerDay: 1800000 },
      { id: "venue-v9", name: "Jagmandir Island", type: "Island Palace", capacity: 400, pricePerDay: 1200000 },
    ],
    plannerIds: ["p2", "p3", "p4"],
  },
  {
    id: "kerala",
    name: "Kerala",
    location: "Kerala, India",
    category: "Resort",
    image: keralaImg,
    description:
      "God's Own Country offers lush backwaters, tropical greenery, and serene beaches. A Kerala wedding is intimate, natural, and breathtakingly beautiful.",
    startingPrice: 1200000,
    avgCost: "₹12L – ₹40L",
    bestSeason: "Sep – Mar",
    venueCount: 10,
    venues: [
      { id: "venue-v10", name: "Kumarakom Lake Resort", type: "Lake Resort", capacity: 300, pricePerDay: 500000 },
      { id: "venue-v11", name: "Taj Bekal", type: "Beach Resort", capacity: 400, pricePerDay: 600000 },
    ],
    plannerIds: ["p4", "p5", "p7"],
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    location: "Uttarakhand, India",
    category: "Hill",
    image: rishikeshImg,
    description:
      "Nestled in the Himalayan foothills by the sacred Ganges, Rishikesh offers a spiritual and scenic escape for couples seeking a unique, nature-inspired wedding.",
    startingPrice: 800000,
    avgCost: "₹8L – ₹25L",
    bestSeason: "Oct – Apr",
    venueCount: 6,
    venues: [
      { id: "venue-v12", name: "Aloha on the Ganges", type: "Riverside Resort", capacity: 200, pricePerDay: 300000 },
      { id: "venue-v13", name: "Ananda in the Himalayas", type: "Luxury Spa Resort", capacity: 150, pricePerDay: 700000 },
    ],
    plannerIds: ["p6", "p7", "p8"],
  },
  {
    id: "jimcorbett",
    name: "Jim Corbett",
    location: "Uttarakhand, India",
    category: "Resort",
    image: jimcorbettImg,
    description:
      "Surrounded by dense forests and the Ramganga river, Jim Corbett offers a magical wilderness wedding with luxury jungle resorts and starlit evenings.",
    startingPrice: 1000000,
    avgCost: "₹10L – ₹35L",
    bestSeason: "Oct – Mar",
    venueCount: 5,
    venues: [
      { id: "venue-v14", name: "The Solluna Resort", type: "Forest Resort", capacity: 250, pricePerDay: 400000 },
      { id: "venue-v15", name: "Namah Resort", type: "Luxury Resort", capacity: 300, pricePerDay: 500000 },
    ],
    plannerIds: ["p1", "p8", "p4"],
  },
];

export const planners = [
  {
    id: "p1", name: "Riya Sharma", company: "Regal Celebrations",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=riya",
    cities: ["Jaipur", "Goa", "Jim Corbett"],
    specialties: ["Royal Weddings", "Destination Events"],
    rating: 4.9, reviewCount: 127, experience: 12, startingPrice: 500000,
    bio: "With over a decade of creating royal destination weddings, Riya brings opulence and precision to every celebration.",
    portfolioImages: [],
    services: ["Full Planning", "Decor", "Vendor Management", "Guest Management"],
    packages: [
      { id: "pkg1", name: "Royal Package", price: 2500000, description: "Complete royal wedding experience", includes: ["Decor", "Catering", "Photography", "Entertainment", "Guest Management"] },
      { id: "pkg2", name: "Essentials Package", price: 800000, description: "Core planning and coordination", includes: ["Planning", "Vendor Coordination", "Day-of Management"] },
    ],
    reviews: [
      { name: "Anita & Rohit", rating: 5, text: "Riya made our Jaipur wedding a fairy tale. Every detail was perfect!", date: "2024-12-15" },
      { name: "Priya & Karan", rating: 5, text: "Exceptional service and attention to detail. Highly recommended!", date: "2024-11-20" },
    ],
  },
  {
    id: "p2", name: "Arjun Mehta", company: "DreamKnot Weddings",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
    cities: ["Udaipur", "Goa"],
    specialties: ["Luxury Weddings", "Beach Ceremonies"],
    rating: 4.8, reviewCount: 98, experience: 8, startingPrice: 400000,
    bio: "Arjun specializes in creating intimate luxury experiences that reflect each couple's unique love story.",
    portfolioImages: [],
    services: ["Full Planning", "Decor", "Photography", "Catering"],
    packages: [
      { id: "pkg3", name: "Luxury Experience", price: 2000000, description: "Premium end-to-end wedding planning", includes: ["Decor", "Catering", "Photography", "DJ", "Florals"] },
      { id: "pkg4", name: "Intimate Affair", price: 600000, description: "Perfect for smaller gatherings", includes: ["Planning", "Decor", "Photography"] },
    ],
    reviews: [
      { name: "Sneha & Vikram", rating: 5, text: "Our Udaipur wedding was magical. Arjun is a genius!", date: "2024-10-05" },
    ],
  },
  {
    id: "p3", name: "Meera Kapoor", company: "Shaadi Squad",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
    cities: ["Jaipur", "Udaipur", "Delhi"],
    specialties: ["Heritage Weddings", "Multi-day Events"],
    rating: 4.7, reviewCount: 156, experience: 15, startingPrice: 600000,
    bio: "Meera is a veteran wedding planner known for orchestrating grand multi-day heritage celebrations.",
    portfolioImages: [],
    services: ["Full Planning", "Decor", "Entertainment", "Logistics"],
    packages: [
      { id: "pkg5", name: "Heritage Grand", price: 3500000, description: "Multi-day heritage wedding package", includes: ["All Events Planning", "Royal Decor", "Catering", "Entertainment", "Transport"] },
    ],
    reviews: [
      { name: "Kavya & Aditya", rating: 5, text: "Meera handled our 4-day wedding flawlessly!", date: "2025-01-10" },
    ],
  },
  {
    id: "p4", name: "Dev Patel", company: "Bliss & Beyond",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
    cities: ["Kerala", "Udaipur", "Jim Corbett"],
    specialties: ["Eco Weddings", "Intimate Ceremonies"],
    rating: 4.6, reviewCount: 72, experience: 6, startingPrice: 300000,
    bio: "Dev crafts eco-conscious, intimate weddings that are gentle on the planet and stunning in every way.",
    portfolioImages: [],
    services: ["Planning", "Sustainable Decor", "Local Vendor Sourcing"],
    packages: [
      { id: "pkg6", name: "Green Wedding", price: 1200000, description: "Eco-friendly wedding package", includes: ["Sustainable Decor", "Organic Catering", "Photography"] },
    ],
    reviews: [
      { name: "Nisha & Rahul", rating: 5, text: "Our Kerala wedding was so beautiful and eco-friendly!", date: "2024-09-22" },
    ],
  },
  {
    id: "p5", name: "Simran Gill", company: "Ivory Events",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=simran",
    cities: ["Goa", "Kerala"],
    specialties: ["Beach Weddings", "Sunset Ceremonies"],
    rating: 4.8, reviewCount: 89, experience: 9, startingPrice: 450000,
    bio: "Simran is the beach wedding specialist, known for creating magical seaside celebrations.",
    portfolioImages: [],
    services: ["Full Planning", "Beach Decor", "Photography", "Entertainment"],
    packages: [
      { id: "pkg7", name: "Seaside Bliss", price: 1800000, description: "Complete beach wedding experience", includes: ["Beach Setup", "Decor", "Catering", "Photography", "DJ"] },
    ],
    reviews: [
      { name: "Tara & Jay", rating: 5, text: "The sunset ceremony Simran planned was unforgettable!", date: "2024-11-30" },
    ],
  },
  {
    id: "p6", name: "Kabir Singh", company: "The Grand Affair",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kabir",
    cities: ["Jaipur", "Rishikesh"],
    specialties: ["Grand Celebrations", "Themed Weddings"],
    rating: 4.5, reviewCount: 64, experience: 7, startingPrice: 350000,
    bio: "Kabir transforms wedding visions into grand spectacles with his creative flair and meticulous planning.",
    portfolioImages: [],
    services: ["Full Planning", "Theme Design", "Decor", "Entertainment"],
    packages: [
      { id: "pkg8", name: "Grand Spectacle", price: 2800000, description: "Show-stopping grand wedding", includes: ["Theme Design", "Decor", "Catering", "Entertainment", "Fireworks"] },
    ],
    reviews: [
      { name: "Isha & Manav", rating: 4, text: "Great creativity but slightly over budget. Still amazing!", date: "2024-08-15" },
    ],
  },
  {
    id: "p7", name: "Anjali Desai", company: "Whispering Vows",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anjali",
    cities: ["Kerala", "Rishikesh"],
    specialties: ["Spiritual Weddings", "Nature Ceremonies"],
    rating: 4.9, reviewCount: 45, experience: 5, startingPrice: 250000,
    bio: "Anjali creates soulful, nature-inspired weddings that celebrate love in its purest form.",
    portfolioImages: [],
    services: ["Planning", "Nature Decor", "Rituals Coordination"],
    packages: [
      { id: "pkg9", name: "Sacred Union", price: 900000, description: "Spiritual wedding by nature", includes: ["Ritual Planning", "Natural Decor", "Photography"] },
    ],
    reviews: [
      { name: "Leela & Om", rating: 5, text: "The Rishikesh riverside ceremony was deeply moving. Thank you Anjali!", date: "2025-02-01" },
    ],
  },
  {
    id: "p8", name: "Vikram Joshi", company: "Elysian Weddings",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
    cities: ["Rishikesh", "Jim Corbett", "Mussoorie"],
    specialties: ["Mountain Weddings", "Adventure Ceremonies"],
    rating: 4.7, reviewCount: 53, experience: 6, startingPrice: 280000,
    bio: "Vikram brings adventure and romance together for unforgettable mountain destination weddings.",
    portfolioImages: [],
    services: ["Full Planning", "Adventure Activities", "Decor", "Photography"],
    packages: [
      { id: "pkg10", name: "Mountain Magic", price: 1500000, description: "Adventure wedding in the hills", includes: ["Mountain Venue", "Adventure Activities", "Decor", "Catering", "Photography"] },
    ],
    reviews: [
      { name: "Zara & Nikhil", rating: 5, text: "Our Jim Corbett wedding was absolutely wild and wonderful!", date: "2025-01-25" },
    ],
  },
];

export const testimonials = [
  { name: "Anita & Rohit Malhotra", location: "Jaipur Wedding", text: "Our palace wedding was beyond anything we imagined. Every flower, every light — pure magic.", rating: 5, image: jaipurImg },
  { name: "Sneha & Vikram Reddy", location: "Udaipur Wedding", text: "The lakeside ceremony at sunset was the most beautiful moment of our lives.", rating: 5, image: udaipurImg },
  { name: "Tara & Jay Khanna", location: "Goa Wedding", text: "Dancing barefoot on the beach under fairy lights — exactly the wedding we dreamed of.", rating: 5, image: goaImg },
  { name: "Nisha & Rahul Verma", location: "Kerala Wedding", text: "The backwater ceremony was intimate, serene, and absolutely unforgettable.", rating: 5, image: keralaImg },
  { name: "Zara & Nikhil Thakur", location: "Jim Corbett Wedding", text: "A jungle wedding under the stars — our guests are still talking about it!", rating: 5, image: jimcorbettImg },
];

export const budgetBuckets = [
  { label: "Intimate", range: "₹5L – ₹15L", description: "Perfect for small, intimate gatherings up to 100 guests" },
  { label: "Classic", range: "₹15L – ₹40L", description: "A beautiful celebration with 100–300 guests" },
  { label: "Grand", range: "₹40L – ₹1Cr", description: "A lavish affair with premium venues and 300+ guests" },
  { label: "Royal", range: "₹1Cr+", description: "No limits — palace weddings, celebrity planners, the works" },
];

// localStorage helpers
export const saveEnquiry = (data) => {
  const existing = getEnquiries();
  existing.push({ ...data, id: Date.now(), createdAt: new Date().toISOString() });
  localStorage.setItem("weddingEnquiries", JSON.stringify(existing));
};

export const getEnquiries = () => {
  try { return JSON.parse(localStorage.getItem("weddingEnquiries") || "[]"); }
  catch { return []; }
};

export const saveFavourite = (id) => {
  const favs = getFavourites();
  if (!favs.includes(id)) { favs.push(id); localStorage.setItem("weddingFavourites", JSON.stringify(favs)); }
};

export const removeFavourite = (id) => {
  const favs = getFavourites().filter((f) => f !== id);
  localStorage.setItem("weddingFavourites", JSON.stringify(favs));
};

export const getFavourites = () => {
  try { return JSON.parse(localStorage.getItem("weddingFavourites") || "[]"); }
  catch { return []; }
};

export const realWeddings = [
  { id: "rw-goa-1", location: "Goa", destinationId: "goa", coupleName: "Anita & Rohit", guests: 150, budgetMin: "₹35L", budgetMax: "₹50L", coverImage: rwGoaCouple, photos: [rwGoaCouple, rwGoaCouple2, rwUdaipurCouple, rwJaipurCouple, rwKeralaCouple, rwRishikeshCouple] },
  { id: "rw-goa-2", location: "Goa", destinationId: "goa", coupleName: "Priya & Sameer", guests: 120, budgetMin: "₹40L", budgetMax: "₹55L", coverImage: rwGoaCouple2, photos: [rwGoaCouple2, rwGoaCouple, rwJaipurCouple, rwUdaipurCouple] },
  { id: "rw-udaipur-1", location: "Udaipur", destinationId: "udaipur", coupleName: "Snehal & Karma", guests: 250, budgetMin: "₹55L", budgetMax: "₹75L", coverImage: rwUdaipurCouple, photos: [rwUdaipurCouple, rwJaipurCouple, rwGoaCouple, rwGoaCouple2, rwKeralaCouple] },
  { id: "rw-udaipur-2", location: "Udaipur", destinationId: "udaipur", coupleName: "Ananya & Kabir", guests: 200, budgetMin: "₹60L", budgetMax: "₹80L", coverImage: rwUdaipurCouple, photos: [rwUdaipurCouple, rwKeralaCouple, rwRishikeshCouple, rwGoaCouple2] },
  { id: "rw-jaipur-1", location: "Jaipur", destinationId: "jaipur", coupleName: "Kavya & Aditya", guests: 200, budgetMin: "₹45L", budgetMax: "₹60L", coverImage: rwJaipurCouple, photos: [rwJaipurCouple, rwUdaipurCouple, rwKeralaCouple, rwGoaCouple] },
];

export const myBookings = [
  { id: "bk-1", destination: "Goa", date: "Dec 15, 2026", status: "Confirmed", totalBudget: 4500000, plannerName: "Riya Sharma", venueName: "Taj Exotica", image: goaImg },
  { id: "bk-2", destination: "Udaipur", date: "Feb 22, 2027", status: "Pending", totalBudget: 7500000, plannerName: "Arjun Mehta", venueName: "Taj Lake Palace", image: udaipurImg },
  { id: "bk-3", destination: "Jim Corbett", date: "Nov 10, 2026", status: "Cancelled", totalBudget: 2500000, plannerName: "Vikram Joshi", venueName: "The Solluna Resort", image: jimcorbettImg },
];

export const formatPrice = (price) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
};
