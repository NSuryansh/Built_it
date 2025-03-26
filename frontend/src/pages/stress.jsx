import React from "react";
import { Bell, User, ExternalLink } from "lucide-react";
import VideoSection from "../components/videosection";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { checkAuth } from "../utils/profile";
import SessionExpired from "../components/SessionExpired";
import { useNavigate } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";

const articles = [
  {
    id: 1,
    title: "Understanding and Managing Stress",
    description: "Learn about the different types of stress and effective strategies to manage them in your daily life.",
    url: "https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet",
    readTime: "5 min read",
    source: "National Institute of Mental Health"
  },
  {
    id: 2,
    title: "The Science Behind Stress and Mental Health",
    description: "Explore the biological mechanisms of stress and its impact on mental well-being.",
    url: "https://www.health.harvard.edu/staying-healthy/understanding-the-stress-response",
    readTime: "8 min read",
    source: "Harvard Health"
  },
  {
    id: 3,
    title: "Mindfulness Techniques for Stress Relief",
    description: "Discover practical mindfulness exercises that can help reduce stress and anxiety.",
    url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/mindfulness-exercises/art-20046356",
    readTime: "6 min read",
    source: "Mayo Clinic"
  },
  {
    id: 4,
    title: "Work-Related Stress Management",
    description: "Tips and strategies for managing stress in the workplace and maintaining work-life balance.",
    url: "https://www.apa.org/topics/healthy-workplaces/work-stress",
    readTime: "7 min read",
    source: "American Psychological Association"
  }
];

const Stress = () => {
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

  if(isAuthenticated === null){
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} /> 
        <p>Loading...</p>
      </div>
    );
  }

  if(!isAuthenticated){
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="min-h-screen bg-[var(--custom-orange-100)]" style={{}}>
      <Navbar />
      {/* Main Content */}
      <div className="pt-10 px-4 max-w-7xl mx-auto space-y-8 mb-8">
        {/* Articles Section */}
        <section className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-3xl font-semibold text-red-500 mb-6 text-center">
            Mental Health Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">
                      {article.title}
                    </h3>
                    <ExternalLink className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-500">{article.source}</span>
                    <span className="text-gray-500">{article.readTime}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Guided Meditation Section */}
        <section className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-3xl font-semibold text-red-500 mb-4 text-center">
            Stress Relief Exercises
          </h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Guided Meditation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Follow along with guided meditations that focus on relaxation,
              mindfulness, and stress reduction.
            </p>
            <VideoSection
              videos={[
                "https://www.youtube.com/embed/FuuXHJB74iU",
                "https://www.youtube.com/embed/ZToicYcHIOU",
                "https://www.youtube.com/embed/a2pZOIzbp7Q",
                "https://www.youtube.com/embed/-2zdUXve6fQ",
                "https://www.youtube.com/embed/0gz1WjL4sW0",
              ]}
            />
          </div>
        </section>

        {/* Stretching Section */}
        <section className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-1">Stretching</h3>
          <p className="text-sm text-gray-600 mb-4">
            Simple full-body stretches that help relieve muscle tension and
            promote relaxation.
          </p>
          <VideoSection
            videos={[
              "https://www.youtube.com/embed/ferw4VhbN54",
              "https://www.youtube.com/embed/mj2RGYpknzA",
              "https://www.youtube.com/embed/_OoEYEhNAlY",
              "https://www.youtube.com/embed/y87vSUoIMGU",
              "https://www.youtube.com/embed/DZ7hrD0Z_3o",
            ]}
          />
        </section>

        {/* Dance Section */}
        <section className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-1">Dance Workouts</h3>
          <p className="text-sm text-gray-600 mb-4">
            Fun, energetic dance routines (like Zumba or freestyle dance) to
            release tension and boost mood.
          </p>
          <VideoSection
            videos={[
              "https://www.youtube.com/embed/x7JYxuzwtQc",
              "https://www.youtube.com/embed/XTH5saFBDqA",
              "https://www.youtube.com/embed/Cw-Wt4xKD2s",
              "https://www.youtube.com/embed/v3SGmJPDNVw",
              "https://www.youtube.com/embed/Btyw98t0Ef4",
            ]}
          />
        </section>
      </div>
      <Footer color="orange" />
    </div>
  );
};

export default Stress;