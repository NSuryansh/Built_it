import React from 'react';
import Navbar from "../components/Navbar";

const MovieSection = ({ title, movies }) => {
  const handleMovieClick = (movieTitle) => {
    // Create a Google search URL with the movie title
    const searchQuery = encodeURIComponent(`${movieTitle} movie`);
    const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
    // Open in a new tab
    window.open(googleSearchUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {movies.map((movie, index) => (
            <div key={index} className="flex-none w-72">
              <div 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleMovieClick(movie.title)}
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{movie.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const movieData = {
  feelGood: [
    { title: "La La Land", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcROdG2hxWRGPiw_BvG1kZNeFy6mSf1VJl627bz1xRBaemQqhAqb&psig=AOvVaw2uAy9AdmdlNjs2aGl_1Y_X&ust=1743271351506000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOj8hoCurYwDFQAAAAAdAAAAABAE" },
    { title: "The Secret Life of Walter Mitty", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQOUyXlSiN6ER7Ru5qksGEOq09ij1zxHIN1UmIill7BRR2gp3OV&psig=AOvVaw3wQ0nAmhDVgWvsMu_m6INa&ust=1743271525205000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLDj4dGurYwDFQAAAAAdAAAAABA"},
    { title: "Little Miss Sunshine", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRZ0cUJ-yvCKNvYnq0dEBwi3jQEh9SpPgbW9lvSrTjspwQUwKd6&psig=AOvVaw0zCFd1w2Qj6KLOHwWiqhPr&ust=1743271447276000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPihqL-urYwDFQAAAAAdAAAAABA"},
    { title: "Soul", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcR-HcNukY4KpY1oCN-5nFtRgWoUbCOfL8Ge7acUa-oBNG11CCXk&psig=AOvVaw3B4l33Tut9K7NPBdqKTFi0&ust=1743271586929000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCT8vCurYwDFQAAAAAdAAAAABAE" },
  ],
  comedy: [
    { title: "The Hangover", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn3.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRWuhUtUEH-YWbeUfEEkJ3FmgrM9wJfo0DBtdR_tqvLNPXn7KNu&psig=AOvVaw1BPSBOGvi92DJBlKBs3mV-&ust=1743274078136000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNjXjJO4rYwDFQAAAAAdAAAAABAE" },
    { title: "Bridesmaids", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn1.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcSfFFwMta2D-y9M84M1DGV3yjweztkRReNLjuQeP2HxBV9ZEt6b&psig=AOvVaw0ZqQbFMNeL6AQGd2poaFPi&ust=1743274129957000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLjq2qu4rYwDFQAAAAAdAAAAABAE" },
    { title: "Superbad", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcTJmGobpUVCddF0JO9XmZjQ6xsHGC53RXulyGpAxr0nK7nuuaK4&psig=AOvVaw0o7vZc7ODQCcxQ3c4fZxU_&ust=1743274152862000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCIiL3ra4rYwDFQAAAAAdAAAAABAE" },
    { title: "The Other Guys", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcSX6NKee11WMdxDRSYTEfk3azKK8AA29IjhnCrSRUzzcM4RqYit&psig=AOvVaw0xetNLAKbvZsN_WBs7kL-G&ust=1743274173933000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCMCz5MC4rYwDFQAAAAAdAAAAABAE" },
  ],
  motivational: [
    { title: "The Pursuit of Happyness", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2069" },
    { title: "Rocky", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2025" },
    { title: "The Theory of Everything", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2070" },
    { title: "A Beautiful Mind", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=2070" },
  ],
  scifi: [
    { title: "Inception", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2069" },
    { title: "Interstellar", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2025" },
    { title: "The Matrix", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2070" },
    { title: "Blade Runner 2049", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=2070" },
  ],
  mindfulness: [
    { title: "Peaceful Warrior", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2069" },
    { title: "Spring, Summer, Fall, Winter... and Spring", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2025" },
    { title: "Samsara", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2070" },
    { title: "The Tree of Life", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=2070" },
  ],
};

const Movies = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">MOVIES TO WATCH OUT FOR BASED ON YOUR MOOD</h1>
        
        <div className="space-y-12">
          <MovieSection title="Feel Good Movies" movies={movieData.feelGood} />
          <MovieSection title="Comedy and Stress Relief Movies" movies={movieData.comedy} />
          <MovieSection title="Motivational and Self Improvement Movies" movies={movieData.motivational} />
          <MovieSection title="Sci-fi and Fantasy" movies={movieData.scifi} />
          <MovieSection title="Mindfulness and Relaxation Movies" movies={movieData.mindfulness} />
        </div>
      </main>
    </div>
  );
};

export default Movies;