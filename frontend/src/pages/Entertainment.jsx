import React, { useState } from 'react';
import { Music, Book, Gamepad2, Film, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from "../components/Navbar";

const movies = [
  {
    title: "Inside Out",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&q=80",
    link: "https://www.google.com/search?q=inside+out+movie",
    category: "Feel Good"
  },
  {
    title: "The Secret Life of Walter Mitty",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
    link: "https://www.google.com/search?q=the+secret+life+of+walter+mitty+movie",
    category: "Adventure"
  },
  {
    title: "Big Hero 6",
    image: "https://images.unsplash.com/photo-1597002973885-8c90683fa6e0?w=500&q=80",
    link: "https://www.google.com/search?q=big+hero+6+movie",
    category: "Animation"
  }
];

const books = [
  {
    title: "The Happiness of Pursuit",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=the+happiness+of+pursuit+book",
    category: "Self Help"
  },
  {
    title: "Atomic Habits",
    image: "https://images.unsplash.com/photo-1544716278-e513176f20b5?w=500&q=80",
    link: "https://www.google.com/search?q=atomic+habits+book",
    category: "Personal Development"
  },
  {
    title: "The Power of Now",
    image: "https://images.unsplash.com/photo-1544716280-aa053eb39c7c?w=500&q=80",
    link: "https://www.google.com/search?q=the+power+of+now+book",
    category: "Mindfulness"
  }
];

const music = [
  {
    title: "Weightless - Marconi Union",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    spotifyLink: "https://open.spotify.com/track/1ZqHjApl3pfzwjweTfveWl",
    category: "Ambient"
  },
  {
    title: "Meditation Music",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
    category: "Meditation"
  },
  {
    title: "Nature Sounds",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX4PP3DA4J0N8",
    category: "Nature"
  }
];

const games = [
  {
    title: "Journey",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&q=80",
    link: "https://www.google.com/search?q=journey+game",
    category: "Adventure"
  },
  {
    title: "Stardew Valley",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=stardew+valley+game",
    category: "Simulation"
  },
  {
    title: "Animal Crossing",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80",
    link: "https://www.google.com/search?q=animal+crossing+game",
    category: "Life Simulation"
  }
];

const categories = {
  movies: ['Top Picks', 'Feel Good', 'Adventure', 'Animation', 'Comedy', 'Drama'],
  books: ['Top Picks', 'Self Help', 'Personal Development', 'Mindfulness', 'Fiction', 'Non-Fiction'],
  music: ['Top Picks', 'Ambient', 'Meditation', 'Nature', 'Classical', 'Lo-fi'],
  games: ['Top Picks', 'Adventure', 'Simulation', 'Life Simulation', 'Puzzle', 'RPG']
};

function EntertainmentSection({ title, items, icon: Icon, categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Top Picks');

  const filteredItems = items.filter(item => 
    selectedCategory === 'Top Picks' || item.category === selectedCategory
  );

  return (
    <div className="mb-12">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-amber-700" />
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-gray-500" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-amber-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <a
                key={index}
                href={item.spotifyLink || item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <span className="text-gray-300 text-sm">{item.category}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Entertainment() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Entertainment Hub
        </h1>
        
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