import React, { forwardRef, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

const Popular = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const API_KEY = String(process.env.REACT_APP_API_KEY || "").trim();
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

  const [data, setData] = useState([]);

  const handleNavigate = (movie) => {
    if (movie.title && movie.id) {
      const query = movie.title.toLowerCase().replace(/\s+/g, "-");
      navigate(`/movie/${query}/${movie.id}`);
    }
  };

  useEffect(() => {
    if (!API_KEY) return;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.results) setData(data.results);
      })
      .catch((err) => console.error("Popular Fetch Error:", err));
  }, [url, API_KEY]);

  return (
    <section ref={ref} className="relative py-20 bg-[#050505] overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12 pl-2 border-l-4 border-cyan-500">
          <Flame className="text-cyan-400 w-8 h-8 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-[0.2em] drop-shadow-lg">
            Popular Now
          </h2>
        </div>

        {/* Carousel */}
        {data.length > 0 ? (
          <MovieCarousel movies={data} onNavigate={handleNavigate} />
        ) : (
          <div className="text-gray-500 text-center py-20 animate-pulse">
            Loading Popular Movies...
          </div>
        )}
      </div>
    </section>
  );
});

export default Popular;

// --- Custom Carousel Component ---
const MovieCarousel = ({ movies, onNavigate }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/carousel">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all duration-300 -translate-x-4 md:-translate-x-6"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all duration-300 translate-x-4 md:translate-x-6"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-8 pt-4 no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-none w-[160px] sm:w-[200px] md:w-[240px] snap-start"
          >
            <div
              onClick={() => onNavigate(movie)}
              className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 cursor-pointer transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              {/* Poster Image */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Border Glow Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/50 rounded-xl transition-colors duration-300 pointer-events-none" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-sm md:text-lg leading-tight drop-shadow-md line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <span className="text-[10px] font-bold bg-cyan-500 text-black px-2 py-0.5 rounded">
                    {(movie.vote_average || 0).toFixed(1)}
                  </span>
                  <span className="text-[10px] text-gray-300 uppercase tracking-wider">
                    {movie.release_date?.split("-")[0] || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
