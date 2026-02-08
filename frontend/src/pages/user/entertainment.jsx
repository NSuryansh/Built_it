import React, { useState, useEffect } from "react";
import { Music, Book, Gamepad2, Film, ChevronDown, PlayCircle, Headphones, Tv } from "lucide-react";
import Navbar from "../../components/user/Navbar";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/common/SessionExpired";
import CustomLoader from "../../components/common/CustomLoader";
import axios from "axios";

// Helper to map dynamic types to icons
const getIconForType = (type) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("movie") || lowerType.includes("film")) return Film;
  if (lowerType.includes("book") || lowerType.includes("novel")) return Book;
  if (lowerType.includes("music") || lowerType.includes("song")) return Music;
  if (lowerType.includes("game") || lowerType.includes("gaming")) return Gamepad2;
  if (lowerType.includes("podcast")) return Headphones;
  if (lowerType.includes("series") || lowerType.includes("show")) return Tv;
  return PlayCircle; // Default icon for custom types
};

const getUniqueCategories = (items) => {
  if (!items || items.length === 0) return ["Top Picks"];
  const cats = [...new Set(items.map((item) => item.category))];
  if(cats.length === 0) return ["Top Picks"];
  return ["Top Picks", ...cats.filter(c => c !== "Top Picks")];
};

function EntertainmentSection({ title, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Top Picks");
  const [hoveredItem, setHoveredItem] = useState(null);

  const Icon = getIconForType(title);
  const sectionCategories = getUniqueCategories(items);

  const getFilteredItems = () => {
    if (selectedCategory === "Top Picks") return items;
    return items.filter((item) => item.category === selectedCategory);
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="mb-4 md:mb-8 bg-[var(--custom-white)] rounded-2xl shadow-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-[var(--custom-gray-100)] transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-[var(--custom-gray-100)]">
            <Icon className="w-7 h-7 text-[var(--custom-orange-600)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--custom-gray-800)] capitalize">
            {title.toLowerCase()}
          </h2>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown className="w-6 h-6 text-[var(--custom-gray-500)]" />
        </div>
      </button>

      <div className={`transition-all duration-500 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
        <div className="p-6 pt-2">
          <div className="flex flex-wrap gap-2 mb-8">
            {sectionCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2.5 md:px-5 py-[5px] md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[var(--custom-orange-700)] text-[var(--custom-white)] shadow-md scale-105"
                    : "bg-[var(--custom-gray-100)] text-[var(--custom-gray-700)] hover:bg-[var(--custom-gray-200)] hover:scale-105"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <a
                  key={item.id || index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-lg md:rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t from-[var(--custom-black)]/90 via-[var(--custom-black)]/40 to-transparent flex items-end transition-opacity duration-300 ${hoveredItem === index ? "opacity-100" : "opacity-90"}`}>
                    <div className="p-2 sm:p-4 md:p-6 w-full transform transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="text-sm sm:text-md md:text-lg font-semibold md:font-bold text-[var(--custom-white)] mb-1 md:mb-2 group-hover:text-[var(--custom-purple-300)] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <span className="sm:inline-block hidden px-2 md:px-3 py-1 rounded-full bg-[var(--custom-white)]/20 text-xs md:text-sm text-[var(--custom-white)] backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
               <div className="col-span-full text-center text-gray-500 py-4">No items found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Entertainment() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [entertainmentData, setEntertainmentData] = useState({}); // Start empty
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);

      if (authStatus) {
         try {
             // Make sure this matches your server.js prefix (/api/doc)
             const backendUrl = "http://localhost:3000/api/doc"; 
             const res = await axios.get(`${backendUrl}/get-entertainment`);
             setEntertainmentData(res.data);
         } catch(e) {
             console.error("Failed to load entertainment", e);
         } finally {
             setLoading(false);
         }
      }
    };
    init();
  }, []);

  const handleClosePopup = () => {
    navigate("/user/login");
  };

  if (isAuthenticated === null || (isAuthenticated && loading)) {
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-orange-100)] via-[var(--custom-white)] to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-[34px] lg:text-5xl font-bold text-[var(--custom-gray-900)] mb-2 lg:mb-4 tracking-tight">
            Entertainment Hub
          </h1>
          <p className="text-sm lg:text-lg text-[var(--custom-gray-600)] max-w-2xl mx-auto">
            Discover and explore your favorite movies, books, music, games, and more.
          </p>
        </div>

        {/* DYNAMIC RENDERING: Only sections that exist in DB will show */}
        {Object.keys(entertainmentData).length > 0 ? (
          Object.keys(entertainmentData).map((type) => (
            <EntertainmentSection
              key={type}
              title={type}
              items={entertainmentData[type]}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-12">
            No items found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}

export default Entertainment;