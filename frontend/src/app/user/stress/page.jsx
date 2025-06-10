"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, Building, Youtube, ChevronRight } from "lucide-react";
import VideoSection from "@/components/user/VideoSection";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/common/Footer";
import { checkAuth } from "@/utils/profile";
import SessionExpired from "@/components/common/SessionExpired";
import { articles, videoSections } from "@/utils/data";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/common/CustomLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Stress = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();
  const heroRef = useRef(null);
  const articlesRef = useRef(null);
  const videoSectionRefs = useRef([]);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        articlesRef.current.children,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: articlesRef.current,
            start: "top 80%",
          },
        }
      );
      videoSectionRefs.current.forEach((section, sectionIndex) => {
        if (section) {
          gsap.fromTo(
            section.querySelector(".header-container").children,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );

          // subpart - video
          const videoElements = section.querySelectorAll(".videos-container > *");
          videoElements.forEach((video, index) => {
            const isOdd = index % 2 !== 0;
            gsap.fromTo(
              video,
              { opacity: 0, x: isOdd ? -50 : 50 },
              {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  toggleActions: "play none none none",
                },
              }
            );
          });
        }
      });
    }}, [isAuthenticated]);

  const handleClosePopup = () => {
    router.replace("/user/login");
  };

  if (isAuthenticated === null) {
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  if (!isAuthenticated) {
    return (
      <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-orange-50)] to-[var(--custom-red-50)]">
      <Navbar />

      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--custom-yellow-400)] to-[var(--custom-orange-500)] text-[var(--custom-white)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={heroRef} className="relative">
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

  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <section
          ref={articlesRef}
          className="bg-[var(--custom-white)] rounded-2xl shadow-xl p-8 mb-12 transform transition-all duration-500 hover:shadow-2xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--custom-gray-900)] mb-8 text-center">
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
            })}
          </div>
        </section>

        
        <div className="space-y-12 mb-16">
          {videoSections.map((section, index) => (
            <section
              key={index}
              ref={(el) => (videoSectionRefs.current[index] = el)}
              className="bg-[var(--custom-white)] rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl"
            >
              <div className="header-container flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[var(--custom-yellow-100)] to-[var(--custom-orange-500)] text-[var(--custom-white)]">
                  <Youtube className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--custom-gray-900)]">
                    {section.title}
                  </h2>
                  <p className="text-[var(--custom-gray-600)] mt-1">{section.description}</p>
                </div>
              </div>
              <div className="videos-container">
                <VideoSection videos={section.videos} />
              </div>
            </section>
          ))}
        </div>
      </div>
      <Footer color="orange" />
    </div>
  );
};

export default Stress;