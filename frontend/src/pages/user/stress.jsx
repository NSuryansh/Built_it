import React, { useState, useEffect } from "react";
import { Clock, Building, Youtube, ChevronRight, BookOpen, Sun, Brain, Heart, Headphones, PlayCircle, VideoOff } from "lucide-react"; 
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/common/Footer";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/common/SessionExpired";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/common/CustomLoader";
import axios from "axios"; 

const iconMap = {
  Book: BookOpen,
  Sun: Sun,
  Brain: Brain,
  Heart: Heart,
  Headphones: Headphones,
  Default: BookOpen
};

/**
 * FIXED: This Regex is much more powerful than the 'new URL' approach.
 * It handles:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/shorts/ID
 * - https://www.youtube.com/live/ID
 * - URLs with extra parameters like ?si=... or &t=...
 */
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoCard = ({ video }) => {
  const videoId = getYouTubeVideoId(video.youtubeUrl);
  const [imageError, setImageError] = useState(false);
  
  // 'mqdefault' is the most reliable thumbnail resolution for every video.
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
    : null;

  const handleClick = () => {
    if (video.youtubeUrl) window.open(video.youtubeUrl, "_blank");
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
    >
      <div className="relative h-48 bg-gray-900 overflow-hidden flex items-center justify-center">
        {/* We only render the image if we successfully got an ID */}
        {videoId && !imageError ? (
          <img 
            src={thumbnailUrl} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center text-gray-400">
            <VideoOff className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium">Thumbnail Not Found</span>
          </div>
        )}
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-xl" />
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
  );
};

const Stress = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videoSections, setVideoSections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const navigate = useNavigate();

  const fetchStressData = async () => {
    try {
      const backendUrl = "http://localhost:3000/api/doc"; 
      
      const [articlesRes, videosRes] = await Promise.all([
        axios.get(`${backendUrl}/get-articles`),
        axios.get(`${backendUrl}/get-videos`)
      ]);

      setArticles(articlesRes.data);
      setVideoSections(videosRes.data);

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

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--custom-yellow-400)] to-[var(--custom-orange-500)] text-[var(--custom-white)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
              Your Mental Wellness Journey
            </h1>
            <p className="text-md md:text-xl text-center text-[var(--custom-red-100)] max-w-3xl mx-auto">
              Discover resources, techniques, and exercises to help manage
              stress and improve your mental well-being
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Articles */}
        <section className="bg-[var(--custom-white)] rounded-2xl shadow-xl p-8 mb-12">
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
                      <div className="flex flex-1">
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
                  </div>
                </a>
              );
            }) : (
              <p className="text-center col-span-2 text-gray-500">No articles available.</p>
            )}
          </div>
        </section>

        {/* Video Sections */}
        <div className="space-y-12 mb-16">
          {videoSections.length > 0 ? videoSections.map((section, index) => (
            <section
              key={index}
              className="bg-[var(--custom-white)] rounded-2xl shadow-xl p-8"
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.videos.map((video, idx) => (
                  <VideoCard key={video.id || idx} video={video} />
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