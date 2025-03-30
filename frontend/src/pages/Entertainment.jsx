import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import SessionExpired from "../components/SessionExpired";
import { checkAuth } from "../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useNavigate } from "react-router-dom";

function Entertainment() {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Verify authentication
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
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  const sections = {
    movies: {
      title: "Movies",
      categories: [
        {
          name: "Feel Good Movies",
          items: [
            {
              title: "La La Land",
              image:
                "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=200&fit=crop",
            },
            {
              title: "The Secret Life of Walter Mitty",
              image:
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=200&fit=crop",
            },
            {
              title: "Big Fish",
              image:
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=200&fit=crop",
            },
            {
              title: "Legally Blonde",
              image:
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=200&fit=crop",
            },
          ],
        },
        {
          name: "Comedy and Stress Relief Movies",
          items: [
            {
              title: "The Hangover",
              image:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn3.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRWuhUtUEH-YWbeUfEEkJ3FmgrM9wJfo0DBtdR_tqvLNPXn7KNu&psig=AOvVaw1BPSBOGvi92DJBlKBs3mV-&ust=1743274078136000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNjXjJO4rYwDFQAAAAAdAAAAABAE",
            },
            {
              title: "Bridesmaids",
              image:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcSfFFwMta2D-y9M84M1DGV3yjweztkRReNLjuQeP2HxBV9ZEt6b&psig=AOvVaw0ZqQbFMNeL6AQGd2poaFPi&ust=1743274129957000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLjq2qu4rYwDFQAAAAAdAAAAABAE",
            },
            {
              title: "Superbad",
              image:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcTJmGobpUVCddF0JO9XmZjQ6xsHGC53RXulyGpAxr0nK7nuuaK4&psig=AOvVaw0o7vZc7ODQCcxQ3c4fZxU_&ust=1743274152862000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCIiL3ra4rYwDFQAAAAAdAAAAABAE",
            },
            {
              title: "The Other Guys",
              image:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcSX6NKee11WMdxDRSYTEfk3azKK8AA29IjhnCrSRUzzcM4RqYit&psig=AOvVaw0xetNLAKbvZsN_WBs7kL-G&ust=1743274173933000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCMCz5MC4rYwDFQAAAAAdAAAAABAE",
            },
          ],
        },
        {
          name: "Motivational and Self Improvement Movies",
          items: [
            {
              title: "The Pursuit of Happyness",
              image:
                "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2069",
            },
            {
              title: "Rocky",
              image:
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2025",
            },
            {
              title: "The Theory of Everything",
              image:
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2070",
            },
            {
              title: "A Beautiful Mind",
              image:
                "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=2070",
            },
          ],
        },
        {
          name: "Mindfulness and Relaxation Movies",
          items: [
            {
              title: "Peaceful Warrior",
              image:
                "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2069",
            },
            {
              title: "Spring, Summer, Fall, Winter... and Spring",
              image:
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2025",
            },
            {
              title: "Samsara",
              image:
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2070",
            },
            {
              title: "The Tree of Life",
              image:
                "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=2070",
            },
          ],
        },
      ],
    },
    books: {
      title: "Books",
      categories: [
        {
          name: "Self-Help",
          items: [
            {
              title: "Atomic Habits",
              image:
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
            },
            {
              title: "The Power of Now",
              image:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop",
            },
            {
              title: "The 7 Habits of Highly Effective People",
              image:
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
            },
            {
              title: "The Four Agreements",
              image:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop",
            },
          ],
        },
        {
          name: "Fiction",
          items: [
            {
              title: "The Shattered Realm",
              image:
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
            },
            {
              title: "Echoes of Eldoria",
              image:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop",
            },
            {
              title: "Stellar Exodus",
              image:
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
            },
            {
              title: "Chrono Rift",
              image:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop",
            },
          ],
        },
        {
          name: "Biography",
          items: [
            {
              title: "The Diary of a Young Girl – Anne Frank",
              image:
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
            },
            {
              title: "Alexander Hamilton – Ron Chernow",
              image:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop",
            },
            {
              title: "The Story of My Experiments with Truth – Mahatma Gandhi",
              image:
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
            },
            {
              title: "Long Walk to Freedom – Nelson Mandela",
              image:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop",
            },
          ],
        },
      ],
    },
    music: {
      title: "Music",
      categories: [
        {
          name: "Relaxing",
          items: [
            {
              title: "Ambient Sounds",
              image:
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop",
            },
            {
              title: "Classical Piano",
              image:
                "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=200&fit=crop",
            },
            {
              title: "Clair de Lune – Claude Debussy",
              image:
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop",
            },
            {
              title: "Moonlight Sonata – Ludwig van Beethoven",
              image:
                "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=200&fit=crop",
            },
          ],
        },
        {
          name: "Meditation",
          items: [
            {
              title: "Gayatri Mantra – Deva Premal",
              image:
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop",
            },
            {
              title: "Buddha’s Flute – Relaxing Tibetan Music",
              image:
                "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=200&fit=crop",
            },
            {
              title: "Deep Peace – Bill Douglas",
              image:
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop",
            },
            {
              title: "A Moment of Peace – Liquid Mind",
              image:
                "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=200&fit=crop",
            },
          ],
        },
        {
          name: "Focus",
          items: [
            {
              title: "Lofi Study – Lofi Girl",
              image:
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop",
            },
            {
              title: "Coffee & Jazz – Chillhop Music",
              image:
                "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=200&fit=crop",
            },
            {
              title: "Rainy Day Study – Lofi Fruits",
              image:
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop",
            },
            {
              title: "Max Richter – Sleep",
              image:
                "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=200&fit=crop",
            },
          ],
        },
      ],
    },
    games: {
      title: "Games",
      categories: [
        {
          name: "Casual",
          items: [
            {
              title: "Candy Crush Saga",
              image:
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
            },
            {
              title: "Sybway Suffer",
              image:
                "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=200&fit=crop",
            },
            {
              title: "Stardew Valley",
              image:
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
            },
            {
              title: "Journey",
              image:
                "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=200&fit=crop",
            },
          ],
        },
        {
          name: "Puzzle",
          items: [
            {
              title: "Tetris – The legendary block-stacking game",
              image:
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
            },
            {
              title: "Sudoku – Number-based logic puzzle",
              image:
                "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=200&fit=crop",
            },
            {
              title:
                "Portal & Portal 2 – Physics-based first-person puzzle game",
              image:
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
            },
            {
              title: "Baba Is You – Unique rule-changing logic game",
              image:
                "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=200&fit=crop",
            },
          ],
        },
        {
          name: "Adventure",
          items: [
            {
              title: "Tetris – The legendary block-stacking game",
              image:
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
            },
            {
              title: "Sudoku – Number-based logic puzzle",
              image:
                "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=200&fit=crop",
            },
            {
              title:
                "Portal & Portal 2 – Physics-based first-person puzzle game",
              image:
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
            },
            {
              title: "Baba Is You – Unique rule-changing logic game",
              image:
                "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=200&fit=crop",
            },
          ],
        },
      ],
    },
  };

  const handleItemClick = (title) => {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[var(--custom-orange-50)]">
      {/* Navigation Bar */}
      <Navbar />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {Object.entries(sections).map(([key, section]) => (
          <div key={key} className="mb-4">
            <button
              className="w-full bg-[var(--custom-orange-200)] p-4 rounded-lg flex justify-between items-center hover:bg-[var(--custom-orange-300)] transition-colors"
              onClick={() =>
                setActiveSection(activeSection === key ? null : key)
              }
            >
              <span className="text-[var(--custom-orange-900)] text-lg font-medium">
                {section.title}
              </span>
              <ChevronDown
                className={`transform transition-transform text-[var(--custom-orange-700)] ${
                  activeSection === key ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeSection === key && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                {section.categories.map((category, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="text-[var(--custom-orange-800)] text-lg font-semibold mb-4">
                      {category.name}
                    </h3>
                    {category.items && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="cursor-pointer transform hover:scale-105 transition-transform"
                            onClick={() => handleItemClick(item.title)}
                          >
                            <div className="relative group">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-lg shadow-md"
                              />
                              <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 transition-colors rounded-lg" />
                            </div>
                            <p className="mt-2 text-center text-[var(--custom-orange-900)] group-hover:text-[var(--custom-orange-700)] transition-colors">
                              {item.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Entertainment;
