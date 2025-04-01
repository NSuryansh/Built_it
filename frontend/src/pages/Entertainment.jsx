/*import React, { useState } from 'react';
import { Music, Book, Gamepad2, Film, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from "../components/Navbar";

const movies = [
  {
    title: "The Greatest Showman",
    image: "https://m.media-amazon.com/images/I/81cJ8sO7HPL.AC_SY679.jpg",
    link: "https://www.google.com/search?q=inside+out+movie",
    category: "Feel Good"
  },
  {
    title: "Little Miss Sunshine ",
    image: "https://m.media-amazon.com/images/I/71xBLRBYOiL.AC_SY679.jpg",
    link: "https://www.google.com/search?q=inside+out+movie",
    category: "Feel Good" 
  },
  {
    title: "Mamma Mia!  ",
    image: "https://m.media-amazon.com/images/I/81cJ8sO7HPL.AC_SY679.jpg",
    link: "https://www.google.com/search?q=inside+out+movie",
    category: "Feel Good"
  },
  {
    title: "Zindagi Na Milegi Dobara ",
    image: "https://m.media-amazon.com/images/I/71xBLRBYOiL.AC_SY679.jpg",
    link: "https://www.google.com/search?q=inside+out+movie",
    category: "Feel Good" 
  },
  {
    title: "Yeh Jawaani Hai Deewani  ",
    image: "https://m.media-amazon.com/images/I/71xBLRBYOiL.AC_SY679.jpg",
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
    title: "The Secret Life of Walter Mitty",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
    link: "https://www.google.com/search?q=the+secret+life+of+walter+mitty+movie",
    category: "Adventure"
  },
  {
    title: "The Secret Life of Walter Mitty",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
    link: "https://www.google.com/search?q=the+secret+life+of+walter+mitty+movie",
    category: "Adventure"
  },
  {
    title: "The Secret Life of Walter Mitty",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
    link: "https://www.google.com/search?q=the+secret+life+of+walter+mitty+movie",
    category: "Adventure"
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

  const getFilteredItems = () => {
    if (selectedCategory === 'Top Picks') {
      // Get unique categories from items (excluding 'Top Picks')
      const uniqueCategories = [...new Set(items.map(item => item.category))];
      // Get one item from each category
      return uniqueCategories.map(category => 
        items.find(item => item.category === category)
      ).filter(Boolean); // Remove any undefined values
    }
    return items.filter(item => item.category === selectedCategory);
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="mb-12">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-indigo-600" />
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
                    ? 'bg-indigo-600 text-white'
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

export default Entertainment;*/

import React, { useState } from 'react';
import { Music, Book, Gamepad2, Film, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from "../components/Navbar";


const movies = [
  {
    title: "The Greatest Showman",
    image: "https://m.media-amazon.com/images/I/71xBLRBYOiL.AC_SY679.jpg",
    link: "https://www.google.com/search?q=inside+out+movie",
    category: "Feel Good"
  },
  {
    title: "Little Miss Sunshine ",
    image: "https://m.media-amazon.com/images/I/71xBLRBYOiL.AC_SY679.jpg",
    link: "https://www.google.com/search?q=inside+out+movie",
    category: "Feel Good" 
  },
  {
    title: "Mamma Mia!  ",
    image: "https://m.media-amazon.com/images/I/81cJ8sO7HPL.AC_SY679.jpg",
    link: "https://www.google.com/search?q=inside+out+movie",
    category: "Feel Good"
  },
  {
    title: "Zindagi Na Milegi Dobara ",
    image: "https://m.media-amazon.com/images/I/71xBLRBYOiL.AC_SY679.jpg",
    link: "https://www.google.com/search?q=inside+out+movie",
    category: "Feel Good" 
  },
  {
    title: "Yeh Jawaani Hai Deewani  ",
    image: "https://m.media-amazon.com/images/I/71xBLRBYOiL.AC_SY679.jpg",
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
  const [hoveredItem, setHoveredItem] = useState(null);

  const getFilteredItems = () => {
    if (selectedCategory === 'Top Picks') {
      const uniqueCategories = [...new Set(items.map(item => item.category))];
      return uniqueCategories.map(category => 
        items.find(item => item.category === category)
      ).filter(Boolean);
    }
    return items.filter(item => item.category === selectedCategory);
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="mb-16 bg-white rounded-2xl shadow-lg overflow-hidden">
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gray-100">
            <Icon className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </button>

      <div className={`transition-all duration-500 ease-in-out ${
        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="p-6 pt-2">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-amber-700 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <a
                key={index}
                href={item.spotifyLink || item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
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
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end transition-opacity duration-300 ${
                  hoveredItem === index ? 'opacity-100' : 'opacity-90'
                }`}>
                  <div className="p-6 w-full transform transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm text-white backdrop-blur-sm">
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
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Entertainment Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and explore your favorite movies, books, music, and games all in one place
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