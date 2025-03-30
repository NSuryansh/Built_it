import React from "react";
import Navbar from "../components/Navbar";
import { Users, Brain, Sparkles, ChevronRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* <div
        className={`px-4 sm:px-8 flex h-[${
          windowDimensions.height - height
        }px] justify-center items-center`}
      >
        <div className="flex flex-col mt-8 h-full items-center justify-center">
          <div className="text-[45px] sm:text-[55px] font-extrabold text-[var(--landing-bg-orange)]">
            Vitality
          </div>
          <div className="text-[30px] sm:text-[35px] text-center font-bold mt-2 text-[var(--landing-text-black)]">
            Find Peace - Get Support - Thrive
          </div>
          <div className="text-[15px] sm:text-[20px] text-center mt-2 flex flex-col items-center text-[var(--landing-text-black)]">
            <p>
              At Vitality we provide a safe space for your mental wellness
              journey.
            </p>
            <br />
            <p>
              Whether you are seeking mindfulness techniques, emotional support,
              or expert guidance, we are here to help
            </p>
          </div>
          <Link to="/signup">
            <button className="bg-[var(--landing-text-orange)] text-[var(--landing-text-white)] font-semibold px-6 py-2 mt-4 rounded-full shadow-md hover:bg-[var(--landing-bg-orange)] transition-colors duration-300 ease-in-out cursor-pointer">
              Get Started
            </button>
          </Link>
          <img src="/assests/plates.png" alt="" className="hidden md:block" />
        </div>
      </div> */}
      <div className="bg-[var(--custom-orange-100)]">
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center flex flex-col items-center">
              <h1 className="lg:text-5xl md:text-4xl text-3xl font-bold text-gray-900 mb-6">
                Find Peace - Get Support - Thrive
              </h1>
              <p className="md:text-xl sm:text-md text-gray-600 mb-8 max-w-3xl mx-auto">
                At Vitality we provide a safe space for your mental wellness
                journey. Whether you are seeking mindfulness techniques,
                emotional support, or expert guidance, we are here to help.
              </p>
              <Link
                to="/signup"
                className="bg-[var(--custom-orange-500)] text-[var(--custom-white)] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[var(--custom-orange-600)] w-fit transition-colors duration-300 flex items-center"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-[var(--custom-white)] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[var(--custom-white)] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-[var(--custom-orange-100)] rounded-lg flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-[var(--custom-orange-500)]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Mental Health Support
                </h3>
                <p className="text-gray-600">
                  Access professional counseling and therapy services from the
                  comfort of your home.
                </p>
              </div>
              <div className="bg-[var(--custom-white)] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-[var(--custom-orange-100)] rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-[var(--custom-orange-500)]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Community Connection
                </h3>
                <p className="text-gray-600">
                  Join support groups and connect with others who understand
                  your journey.
                </p>
              </div>
              <div className="bg-[var(--custom-white)] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-[var(--custom-orange-100)] rounded-lg flex items-center justify-center mb-6">
                  <Sparkles className="h-6 w-6 text-[var(--custom-orange-500)]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Wellness Resources
                </h3>
                <p className="text-gray-600">
                  Access guided meditations, exercises, and tools for your
                  mental wellness.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-[var(--custom-orange-500)] rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center px-8 py-16 justify-evenly text-center">
              <div className="">
                <h2 className="text-3xl font-bold text-[var(--custom-white)] mb-4">
                  Start Your Journey Today
                </h2>
                <p className="text-[var(--custom-orange-50)] mb-8 max-w-2xl mx-auto">
                  Take the first step towards better mental health. Our team of
                  professionals is here to support you every step of the way.
                </p>
                <Link
                  to="/book"
                  className="bg-[var(--custom-white)] text-[var(--custom-orange-500)] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[var(--custom-orange-50)] transition-colors duration-300"
                >
                  Book Free Consultation
                </Link>
              </div>
              <img
                src="/assets/qr-code.svg"
                className="w-[250px]"
                alt="qr-code"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
