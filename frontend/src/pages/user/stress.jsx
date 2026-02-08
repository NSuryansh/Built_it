import React, { useState, useEffect } from "react";
import { Clock, Building, Youtube, ChevronRight, BookOpen, Sun, Brain, Heart, Headphones, PlayCircle } from "lucide-react"; 
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/common/Footer";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/common/SessionExpired";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/common/CustomLoader";
import axios from "axios"; 

// Map string names from DB to actual Icon components
const iconMap = {
  Book: BookOpen,
  Sun: Sun,
  Brain: Brain,
  Heart: Heart,
  Headphones: Headphones,
  Default: BookOpen
};

// ✅ HELPER: Extract Thumbnail from YouTube URL
const getYouTubeThumbnail = (url) => {
  if (!url) return "https://via.placeholder.com/640x360?text=No+Video+Link";
  
  // Regex to handle various YouTube URL formats (standard, short, embed)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  
  return videoId 
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
    : "https://via.placeholder.com/640x360?text=Invalid+Link";
};

const Stress = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videoSections, setVideoSections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const navigate = useNavigate();

  // Fetch Data Function
  const fetchStressData = async () => {
    try {
      // Ensure this matches your server.js /api/doc
      const backendUrl = "http://localhost:3000/api/doc"; 
      
      const [articlesRes, videosRes] = await Promise.all([
        axios.get(`${backendUrl}/get-articles`),
        axios.get(`${backendUrl}/get-videos`)
      ]);

      setArticles(articlesRes.data);

      // Process videos to add Thumbnail URL
      const processedVideos = videosRes.data.map(section => ({
        ...section,
        videos: section.videos.map(video => ({
          ...video,
          thumbnail: getYouTubeThumbnail(video.youtubeUrl), // Generate thumbnail
          url: video.youtubeUrl // Ensure URL is accessible
        }))
      }));

      setVideoSections(processedVideos);

    } catch (error) {
      console.error("Error fetching stress data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
      if (authStatus) {
        fetchStressData();
      }
    };
    verifyAuth();
  }, []);

  const handleClosePopup = () => {
    navigate("/user/login");
  };

  if (isAuthenticated === null || (isAuthenticated && loadingData)) {
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-orange-50)] to-[var(--custom-red-50)]">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--custom-yellow-400)] to-[var(--custom-orange-500)] text-[var(--custom-white)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
              Your Mental Wellness Journey
            </h1>
            <p className="text-md md:text-xl text-center text-[var(--custom-red-100)] max-w-3xl mx-auto">
              Discover resources, techniques, and exercises to help manage
              stress and improve your mental well-being
            </p>
          </div>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Articles Section */}
        <section className="bg-[var(--custom-white)] rounded-2xl shadow-xl p-8 mb-12 transform transition-all duration-500 hover:shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--custom-gray-900)] mb-8 text-center">
            Expert Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.length > 0 ? articles.map((article) => {
              const Icon = iconMap[article.iconName] || iconMap.Default;
              return (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-gradient-to-br from-[var(--custom-white)] to-[var(--custom-orange-50)] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                      <div className="p-3 self-center sm:self-start rounded-lg bg-gradient-to-br from-[var(--custom-yellow-100)] to-[var(--custom-orange-500)] text-[var(--custom-white)]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[var(--custom-gray-900)] group-hover:text-[var(--custom-red-500)] transition-colors duration-300">
                            {article.title}
                          </h3>
                          <p className="text-sm text-[var(--custom-gray-600)] mt-2">
                            {article.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--custom-gray-400)] group-hover:text-[var(--custom-red-500)] transform group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between text-sm border-t border-[var(--custom-gray-100)] pt-4 mt-4">
                      <span className="flex items-center text-[var(--custom-red-500)]">
                        <Building className="w-4 h-4 mr-2" />
                        {article.source}
                      </span>
                      <span className="flex items-center text-[var(--custom-gray-500)]">
                        <Clock className="w-4 h-4 mr-2" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </a>
              );
            }) : (
              <p className="text-center col-span-2 text-gray-500">No articles available at the moment.</p>
            )}
          </div>
        </section>

        {/* Video Sections - DIRECTLY RENDERED (No VideoSection Component) */}
        <div className="space-y-12 mb-16">
          {videoSections.length > 0 ? videoSections.map((section, index) => (
            <section
              key={index}
              className="bg-[var(--custom-white)] rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[var(--custom-yellow-100)] to-[var(--custom-orange-500)] text-[var(--custom-white)]">
                  <Youtube className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--custom-gray-900)]">
                    {section.title}
                  </h2>
                  <p className="text-[var(--custom-gray-600)] mt-1">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* DIRECT VIDEO GRID RENDERING */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.videos.map((video, idx) => (
                  <div 
                    key={video.id || idx}
                    onClick={() => {
                        if (video.url) window.open(video.url, "_blank");
                    }}
                    className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                     <div className="relative h-48 bg-gray-200 overflow-hidden">
                       <img 
                         src={video.thumbnail || "https://via.placeholder.com/640x360?text=No+Thumbnail"} 
                         alt={video.title} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         onError={(e) => { e.target.src = "https://via.placeholder.com/640x360?text=Video"; }}
                       />
                       <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                         <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-lg" />
                       </div>
                     </div>
                     <div className="p-4">
                       <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-[var(--custom-orange-600)] transition-colors">
                         {video.title}
                       </h3>
                       <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                         {video.description}
                       </p>
                     </div>
                  </div>
                ))}
              </div>

            </section>
          )) : (
             <p className="text-center text-gray-500">No videos available.</p>
          )}
        </div>
      </div>
      <Footer color="orange" />
    </div>
  );
};

export default Stress;