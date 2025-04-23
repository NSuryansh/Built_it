import React, { useState, useEffect } from "react";
import { Clock, Building, Youtube, ChevronRight } from "lucide-react";
import VideoSection from "../components/videosection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { checkAuth } from "../utils/profile";
import SessionExpired from "../components/SessionExpired";
import { useNavigate } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import { articles, videoSections } from "../utils/data";

const Stress = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
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
    return (
      <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
              Your Mental Wellness Journey
            </h1>
            <p className="text-md md:text-xl text-center text-red-100 max-w-3xl mx-auto">
              Discover resources, techniques, and exercises to help manage
              stress and improve your mental well-being
            </p>
          </div>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Articles Section */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform transition-all duration-500 hover:shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Expert Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => {
              const Icon = article.icon;
              return (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                      <div className="p-3 self-center sm:self-start rounded-lg bg-gradient-to-br from-amber-100 to-orange-500 text-white">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-500 transition-colors duration-300">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2">
                            {article.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transform group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between text-sm border-t border-gray-100 pt-4 mt-4">
                      <span className="flex items-center text-red-500">
                        <Building className="w-4 h-4 mr-2" />
                        {article.source}
                      </span>
                      <span className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Video Sections */}
        <div className="space-y-12 mb-16">
          {videoSections.map((section, index) => (
            <section
              key={index}
              className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-amber-100 to-orange-500 text-white">
                  <Youtube className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{section.description}</p>
                </div>
              </div>
              <VideoSection videos={section.videos} />
            </section>
          ))}
        </div>
      </div>
      <Footer color="orange" />
    </div>
  );
};

export default Stress;
