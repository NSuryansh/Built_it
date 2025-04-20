import React, { useState, useEffect } from "react";
import { Music, Book, Gamepad2, Film, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import SessionExpired from "../components/SessionExpired";
import { movies, games, books, categories, music } from "../utils/data";

function EntertainmentSection({ title, items, icon: Icon, categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Top Picks");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleClosePopup = () => {
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (<SessionExpired handleClosePopup={handleClosePopup} theme="orange" />);
  }

  const getFilteredItems = () => {
    if (selectedCategory === "Top Picks") {
      const uniqueCategories = [...new Set(items.map((item) => item.category))];
      return uniqueCategories
        .map((category) => items.find((item) => item.category === category))
        .filter(Boolean);
    }
    return items.filter((item) => item.category === selectedCategory);
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="mb-4 md:mb-8 bg-white rounded-2xl shadow-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-100 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gray-100">
            <Icon className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </button>

      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-6 pt-2">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2.5 md:px-5 py-[5px] md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-amber-700 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredItems.map((item, index) => (
              <a
                key={index}
                href={item.spotifyLink || item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-lg md:rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end transition-opacity duration-300 ${
                    hoveredItem === index ? "opacity-100" : "opacity-90"
                  }`}
                >
                  <div className="p-2 sm:p-4 md:p-6 w-full transform transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-sm sm:text-md md:text-lg font-semibold md:font-bold text-white mb-1 md:mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <span className="sm:inline-block hidden px-2 md:px-3 py-1 rounded-full bg-white/20 text-xs md:text-sm text-white backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Entertainment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-[34px] lg:text-5xl font-bold text-gray-900 mb-2 lg:mb-4 tracking-tight">
            Entertainment Hub
          </h1>
          <p className="text-sm lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and explore your favorite movies, books, music, and games
            all in one place
          </p>
        </div>

        <EntertainmentSection
          title="Movies"
          items={movies}
          icon={Film}
          categories={categories.movies}
        />
        <EntertainmentSection
          title="Books"
          items={books}
          icon={Book}
          categories={categories.books}
        />
        <EntertainmentSection
          title="Music"
          items={music}
          icon={Music}
          categories={categories.music}
        />
        <EntertainmentSection
          title="Games"
          items={games}
          icon={Gamepad2}
          categories={categories.games}
        />
      </div>
    </div>
  );
}

export default Entertainment;
