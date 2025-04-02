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

import React, { useState, useEffect } from 'react';
import { Music, Book, Gamepad2, Film, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from "../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../utils/profile';
import PacmanLoader from "react-spinners/PacmanLoader";
import SessionExpired from '../components/SessionExpired';

const movies = [
  {
    title: "The Greatest Showman",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcSPXPXxyragqONMUM_E90S5RV1nJXYN2iSmAOjIT-Bm3olOUKzz&psig=AOvVaw1LbjDma2xrSjuPXBveQjpH&ust=1743622100158000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNibvNDIt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=the greatest showman",
    category: "Feel Good"
  },
  {
    title: "Little Miss Sunshine ",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRZ0cUJ-yvCKNvYnq0dEBwi3jQEh9SpPgbW9lvSrTjspwQUwKd6&psig=AOvVaw1iyHLqSqJg6-MjyV6BBW2f&ust=1743622143323000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCKDshOXIt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Little Miss Sunshine",
    category: "Feel Good" 
  },
  {
    title: "Mamma Mia!  ",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcT2C2oIprBEh1UL7mDlkX69bINcsjLVurRT6d6ziII-RK1i0c6h&psig=AOvVaw2WcbQDGti5eS33QU9IRqtT&ust=1743622222968000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCMDi84rJt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Mamma Mia!",
    category: "Feel Good"
  },
  {
    title: "Zindagi Na Milegi Dobara ",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn3.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQqOb7SYCekBWHrdqpplOSANdbjx-tff4WH6_-wxTtFY9viR4UU&psig=AOvVaw3K8gtszh7bOUl84w47NBPn&ust=1743622279123000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPDC0aXJt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Zindagi NA MIleegi Dobara",
    category: "Feel Good" 
  },
  {
    title: "Yeh Jawaani Hai Deewani  ",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQhI92ZPIrEyAsuKs0MPVUnuhyH8boKCLcM1xtXKOP8gTNkEz5i&psig=AOvVaw3vQanzmdLjA5OwOC1Ca0BL&ust=1743622472167000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPjx3oHKt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Yeh Jawaani Hai Deewani",
    category: "Feel Good" 
  },
  {
    title: "The Secret Life of Walter Mitty",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQOUyXlSiN6ER7Ru5qksGEOq09ij1zxHIN1UmIill7BRR2gp3OV&psig=AOvVaw0suTAC0-eZ3HreOfPNpKja&ust=1743622536831000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCKiHyaDKt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=The Secret Life of Walter Mitty",
    category: "Adventure"
  },
  {
    title: "Interstellar",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcT9oW0XQlu1lo1G_49M-YwGzKR6rUg-CtflZj07HfbT8d2GwKWg&psig=AOvVaw2-bh0ZcKIiaSDU6U-a475D&ust=1743622701784000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLiGne_Kt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Interstellar",
    category: "Adventure"
  },
  {
    title: "Mad Max: Fury Road",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQm-wNVkJz1g27KBqQY4giMITNnOakqStQDLx6XNQA5etEXzckT&psig=AOvVaw1wZ4p2fn-TNbmOA9lJmRKE&ust=1743622736831000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPiU-v_Kt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Mad Max: Fury Roade",
    category: "Adventure"
  },
  {
    title: "The Revenant",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn3.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQXUTGibEd0yESfOn4U6b9KqwYjLUKVI3QoCv36puzHfPvtZLMU&psig=AOvVaw00ysGsnwdU3j9yJZJDN6uG&ust=1743622767512000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOjPyY7Lt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=The Revenant",
    category: "Adventure"
  },
  {
    title: "Life of Pi",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcTxY-iBSLovlEzyVflK9ur7UCsECFY40t-m-FZ2QkO7UteUBayf&psig=AOvVaw2AzDKp7pnfoxX4arNVIqJO&ust=1743622807250000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLifz6HLt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Life of Pi",
    category: "Adventure"
  },
  {
    title: "Big Hero 6",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRjABLCIhD9tqx3443sAxBnjZW2MCnvhEZs9X-JF6pljOxaoi3G&psig=AOvVaw3DMX2sCgx1HYdLC6SIQlHH&ust=1743622893895000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNjn7crLt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Big Hero 6",
    category: "Animation"
  },
  {
    title: "Spider-Man: Into the Spider-Verse ",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcR7lwIPrJJySz-YBguA6CZYb5uGnHy2iAZEi0ZI3MtOGufwHLIx&psig=AOvVaw2cfAuZOR0TK3Km8xC8gdgu&ust=1743622972105000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPi7lPDLt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Spider-Man: Into the Spider-Verse ",
    category: "Animation"
  }, {
    title: "How to Train Your Dragon",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcT6gPz8jlQ5K8HFPmBpA7XH3-7qYaV2qemFp7eb8ev8ZBcEl6FV&psig=AOvVaw0toypwF7-7sEvcmsnHdh-P&ust=1743623031766000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCMituJHMt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=How to Train Your Dragon",
    category: "Animation"
  },
   {
    title: "Inside Out",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn3.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcR7IE8YJaJlh3CW-KYU745oE2WzjyvRgKwNyAwe73di_U0uuD5Q&psig=AOvVaw0trUTvDDbiBWSxWrMa3Ipj&ust=1743623079199000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPCcn6PMt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Inside Out",
    category: "Animation"
  }, {
    title: "Frozen",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRtOzQ7EBgKQEtfGoCrVqTgNqCgvrvvqZiDGMwIzr9Zpl1YmGEt&psig=AOvVaw3lOrpg7hbRFTGBuMEHH2Z7&ust=1743623105969000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOjj_a_Mt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=frozen",
    category: "Animation"
  },
  {
    title: "21 Jump Street",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn3.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcTlrEwuDXX2EcLMc6YST6aaFlxwYwFgaxAK27b7DzRrR_EHLUGD&psig=AOvVaw1z8f5kzbGxAlzVpqfXv2DV&ust=1743623139508000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPCJ-L_Mt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=21 Jump Street",
    category: "Comedy"
  },
  {
    title: "We’re the Millers",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRDwBz-7x7VrGa9MHvPMeZCHP1cY9CxBN4zL5NgpqfMxsZu5tCj&psig=AOvVaw324E-91iVxALztBljqOJ2F&ust=1743623181751000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPCBktTMt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=We’re the Millers",
    category: "Comedy"
  },
  {
    title: "Welcome",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn3.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcSARsq9fR-_zG3B4Bq14Qp6T3tcNdugwMDOmM3Xoxj-eeCnkQJ6&psig=AOvVaw299LSSqofw8hsHWEvySigx&ust=1743623219796000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCvsufMt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=welcome",
    category: "Comedy"
  },
  {
    title: "Fukrey ",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcTXJeqIhusFyya5ajeJKCQx_VlYdO9uNnvPecG3mAQrwM-3wkVu&psig=AOvVaw0HyaFpbJNkRa8RIhKJAFwr&ust=1743623253006000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCIjmhfbMt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=fukrey",
    category: "Comedy"
  },
  {
    title: "3 Idiots",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQV7sONOx4fl1xq9CbdWUmcTamWwzrPMzqKhZOGHh-V0zHpn0Ly&psig=AOvVaw33r6eCS_FiZLD0RMFjCoQT&ust=1743623378523000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCKCssrLNt4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=3idiots",
    category: "Comedy"
  },
  {
    title: "Manchester by the Sea",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn3.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRZLuEiplcmrl-b-LV8K3RfiN_ba4W4GyPJPIy8ZDfifsQGuRjm&psig=AOvVaw3zcQB2sHkxLwfxBljmYsDd&ust=1743636033422000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNDkscT8t4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Manchester by the Seae",
    category: "Drama"
  },{
    title: "Nomadland ",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcSXwR4tM2AiA1IaiNhHURaANWN37kC0EcwQdusCLkVTChvqhZ9E&psig=AOvVaw3dwnYLxFy4jwOKD6h9RL2H&ust=1743636163710000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCJDpsYL9t4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Nomadland ",
    category: "Drama"
  },{
    title: "The Whale",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcR1y3_ErQPDoju0td51KZZSrBwSZQJ-c9bAY5X7yMGwWQ4DUAXU&psig=AOvVaw1Ounj7SGt78ntMOwqdaab3&ust=1743636191298000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOiYt4_9t4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=The Whale",
    category: "Drama"
  },{
    title: "The Revenant",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn3.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQXUTGibEd0yESfOn4U6b9KqwYjLUKVI3QoCv36puzHfPvtZLMU&psig=AOvVaw2HfX0ORb2_hsHADBuFyPoO&ust=1743636246163000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNiwxKn9t4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=The Revenant",
    category: "Drama"
  },
];

const books = [
  {
    title: "The Happiness of Pursuit",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Happiness of Pursuit",
    category: "Self Help"
  },
  {
    title: "Atomic Habits",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=Atomic Habits",
    category: "Self Help"
  },
  {
    title: "The 7 Habits of Highly Effective People ",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The 7 Habits of Highly Effective People",
    category: "Self Help"
  },
  {
    title: "The Power of Now",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Power of Now",
    category: "Self Help"
  },
  {
    title: "The 5 AM Club",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The 5 AM Club",
    category: "Self Help"
  },
  
  {
    title: "The Power of Now",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Power of Now",
    category: "Mindfulness"
  },
  {
    title: "Wherever You Go, There You Are",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=Wherever You Go, There You Are",
    category: "Mindfulness"
  },
  {
    title: "Peace Is Every Step",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=Peace Is Every Step",
    category: "Mindfulness"
  },
  {
    title: "10% Happier",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=10% Happier",
    category: "Mindfulness"
  },
  {
    title: "The Art of Living",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Art of Living",
    category: "Mindfulness"
  },
  {
    title: "To Kill a Mockingbird",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=To Kill a Mockingbird",
    category: "Fiction"
  },
  {
    title: "The Great Gatsby",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Great Gatsby",
    category: "Fiction"
  },
  {
    title: "The Book Thief",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Book Thief",
    category: "Fiction"
  },
  {
    title: "A Man Called Ove",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=A Man Called Ove",
    category: "Fiction"
  },
  {
    title: "The Night Circus",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Night Circus",
    category: "Fiction"
  },
  {
    title: "Steve Jobs",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=Steve Jobs",
    category: "Non-Fiction"
  },
  {
    title: "The Diary of a Young Girl",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Diary of a Young Girl",
    category: "Non-Fiction"
  },
  {
    title: "The Power of Habit",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Power of Habit",
    category: "Non-Fiction"
  },
  {
    title: "The Psychology of Money",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=The Psychology of Money",
    category: "Non-Fiction"
  },
  {
    title: "Educated",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    link: "https://www.google.com/search?q=Educated",
    category: "Non-Fiction"
  },
];

const music = [
  {
    title: "Weightless - Marconi Union",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source",
    category: "Ambient"
  },
  {
    title: "Cenotes",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source",
    category: "Ambient"
  },
  {
    title: "Distant Traveller",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source",
    category: "Ambient"
  },
  {
    title: "Entirely",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source",
    category: "Ambient"
  },
  {
    title: "Ceres",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source",
    category: "Ambient"
  },
  {
    title: "Enigma",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u?utm_source",
    category: "Meditation"
  },
  {
    title: "Frid",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u?utm_source",
    category: "Meditation"
  },
  {
    title: "Pages",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u?utm_source",
    category: "Meditation"
  },
  {
    title: "Euphorbia",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u?utm_source",
    category: "Meditation"
  },
  {
    title: "Night Winds",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u?utm_source",
    category: "Meditation"
  },
  {
    title: "Sleep Waves 1 ",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/48sGg4EhRHdrPdurnSoUBH?utm_source",
    category: "Nature"
  },
  {
    title: "Rain tree",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/48sGg4EhRHdrPdurnSoUBH?utm_source8",
    category: "Nature"
  },
  {
    title: "Delicate Woodland With Bird Song",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/48sGg4EhRHdrPdurnSoUBH?utm_source",
    category: "Nature"
  },
  {
    title: "Ocean Waves",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/48sGg4EhRHdrPdurnSoUBH?utm_source",
    category: "Nature"
  },
  {
    title: "Blue Lagoon",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/48sGg4EhRHdrPdurnSoUBH?utm_source",
    category: "Nature"
  },
  {
    title: "Dhun In Raga Bhairavi",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/4JtowPifE700fO0oqyMFSD?utm_source",
    category: "Classical"
  },
  {
    title: "Madhoushi",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/4JtowPifE700fO0oqyMFSD?utm_source",
    category: "Classical"
  },
  {
    title: "Thillana",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/4JtowPifE700fO0oqyMFSD?utm_source",
    category: "Classical"
  },
  {
    title: "The Well Tempered Claiver",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWWEJlAGA9gs0?utm_source",
    category: "Classical"
  },
  {
    title: "Cello Suite NO.1 ",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWWEJlAGA9gs0?utm_source",
    category: "Classical"
  },
  {
    title: "Blues ",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source",
    category: "Lo-fi"
  },
  {
    title: "Sundown",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source",
    category: "Lo-fi"
  },
  {
    title: "YU",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source",
    category: "Lo-fi"
  },
  {
    title: "STHLM Air",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source",
    category: "Lo-fi"
  },
  {
    title: "Unchained ",
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&q=80",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source",
    category: "Lo-fi"
  },
];

const games = [
  {
    title: "Assassin's Creed Odyssey",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRBe7hJQiFUeusCs_QW5K3j7luoiFB1VkCveHHVass4Hd2mm1iy&psig=AOvVaw1riynJMtoI--gR7Prrrf7o&ust=1743638231763000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOD5sdyEuIwDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Assassin's Creed Odyssey",
    category: "Adventure"
  },
  {
    title: "Tomb Raider ",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FTomb_Raider_%2528film%2529&psig=AOvVaw2FHxGhY28A2Ddgkhsml57A&ust=1743638378604000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNiB9KKFuIwDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Tomb Raider",
    category: "Adventure"
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&q=80",
    link: "https://www.google.com/search?q=The Legend of Zelda: Breath of the Wild",
    category: "Adventure"
  },
  {
    title: "Red Dead Redemption 2",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&q=80",
    link: "https://www.google.com/search?q=Red Dead Redemption 2",
    category: "Adventure"
  },
  {
    title: "Planet Coaster",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=Planet Coaster",
    category: "Simulation"
  },
  {
    title: "My Time at Portia",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=My Time at Portiae",
    category: "Simulation"
  },
  {
    title: "The Sims Series",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=The Sims Series",
    category: "Simulation"
  },
  {
    title: "Stardew Valley",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcTYjodiC5iI8_dj-2HEzV0cABYfC06q4zc3M_KIdqLiOsZjemmw&psig=AOvVaw3cofua_hilVSGjSiAHP3vy&ust=1743621089512000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCKjvlu_Et4wDFQAAAAAdAAAAABAE",
    link: "https://www.google.com/search?q=Stardew Valley",
    category: "Simulation"
  },
  {
    title: "Candy Crush Saga",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=Candy Crush Saga",
    category: "Puzzle"
  },
  {
    title: "Monument Valley",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=Monument Valley",
    category: "Puzzle"
  },{
    title: "Sudoku",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=Sudoku",
    category: "Puzzle"
  },{
    title: "Tetris",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=Tetris",
    category: "Puzzle"
  },
  {
    title: "Dragon Age: Inquisition",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=Dragon Age: Inquisition",
    category: "RPG"
  },
  {
    title: "The Witcher 3: Wild Hunt",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=The Witcher 3: Wild Hunt",
    category: "RPG"
  },{
    title: "Baldur’s Gate 3",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=500&q=80",
    link: "https://www.google.com/search?q=Baldur’s Gate 3",
    category: "RPG"
  },{
    title: "Cyberpunk 2077",
    image: "https://tse1.mm.bing.net/th?id=OIP.a9hHlwAnsq2_YmXiXiwv7AHaLG&pid=Api",
    link: "https://www.google.com/search?q=Cyberpunk 2077",
    category: "RPG"
  },
];

const categories = {
  movies: ['Top Picks', 'Feel Good', 'Adventure', 'Animation', 'Comedy', 'Drama'],
  books: ['Top Picks', 'Self Help', 'Mindfulness', 'Fiction', 'Non-Fiction'],
  music: ['Top Picks', 'Ambient', 'Meditation', 'Nature', 'Classical', 'Lo-fi'],
  games: ['Top Picks', 'Adventure', 'Simulation', 'Puzzle', 'RPG']
};

function EntertainmentSection({ title, items, icon: Icon, categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Top Picks');
  const [hoveredItem, setHoveredItem] = useState(null);
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
        className="w-full flex items-center justify-between p-6 hover:bg-gray-100 transition-colors duration-300"
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