import React from 'react';
import { Bell, User } from 'lucide-react';
import VideoSection from '../components/videosection';

function Stress() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
      }}
    >
      {/* Navigation */}
      <nav className="bg-transparent fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold text-white">CalmNest</div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-white hover:text-gray-200">Home</a>
            <a href="#" className="text-white hover:text-gray-200">Mood</a>
            <a href="#" className="text-white hover:text-gray-200">Peer</a>
            <a href="#" className="text-white hover:text-gray-200">Book</a>
            <a href="#" className="text-white hover:text-gray-200">Stress</a>
            <Bell className="w-5 h-5 cursor-pointer text-white" />
            <User className="w-5 h-5 cursor-pointer text-white" />
            <button className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 max-w-7xl mx-auto space-y-8">
        {/* Guided Meditation Section */}
        <section className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-3xl font-semibold text-red-500 mb-4 text-center">Stress Relief Exercises</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Guided Meditation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Follow along with guided meditations that focus on relaxation, mindfulness, and stress reduction.
            </p>
            <VideoSection 
              videos={[
                'https://www.youtube.com/embed/FuuXHJB74iU',
                'https://www.youtube.com/embed/ZToicYcHIOU',
                'https://www.youtube.com/embed/a2pZOIzbp7Q',
                'https://www.youtube.com/embed/-2zdUXve6fQ',
                'https://www.youtube.com/embed/0gz1WjL4sW0',
              ]}
            />
          </div>
        </section>

        {/* Stretching Section */}
        <section className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-1">Stretching</h3>
          <p className="text-sm text-gray-600 mb-4">
            Simple full-body stretches that help relieve muscle tension and promote relaxation.
          </p>
          <VideoSection 
            videos={[
              'https://www.youtube.com/embed/ferw4VhbN54',
              'https://www.youtube.com/embed/mj2RGYpknzA',
              'https://www.youtube.com/embed/_OoEYEhNAlY',
              'https://www.youtube.com/embed/y87vSUoIMGU',
              'https://www.youtube.com/embed/DZ7hrD0Z_3o',
            ]}
          />
        </section>

        {/* Dance Section */}
        <section className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-1">Dance Workouts</h3>
          <p className="text-sm text-gray-600 mb-4">
            Fun, energetic dance routines (like Zumba or freestyle dance) to release tension and boost mood.
          </p>
          <VideoSection 
            videos={[
              'https://www.youtube.com/embed/x7JYxuzwtQc',
              'https://www.youtube.com/embed/XTH5saFBDqA',
              'https://www.youtube.com/embed/Cw-Wt4xKD2s',
              'https://www.youtube.com/embed/v3SGmJPDNVw',
              'https://www.youtube.com/embed/Btyw98t0Ef4',
            ]}
          />
        </section>
      </div>
    </div>
  );
}

export default Stress;
