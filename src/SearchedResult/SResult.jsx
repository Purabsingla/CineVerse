import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Film,
  Tv,
  MoreHorizontal,
  Loader2,
  ChevronDown,
} from "lucide-react";

// --- MOCK NAVBAR (Replace with: import NavBar from "../Home/NavBar") ---
const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Film className="h-8 w-8 text-cyan-400" />
          <span className="text-2xl font-bold tracking-wider text-white uppercase font-sans">
            Cine
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Verse
            </span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold tracking-[0.2em] text-gray-300 uppercase">
          <span>Home</span>
          <span>Trending</span>
          <span>Popular</span>
        </div>
      </div>
    </nav>
  );
};

// --- MOCK FOOTER (Replace with: import Footer from "../Footer/footer") ---
const Footer = () => (
  <footer className="bg-[#050505] py-10 border-t border-white/5 text-center text-gray-500">
    <p>CineVerse &copy; 2025. Powered by TMDB.</p>
  </footer>
);

const SearchedResult = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(10);
  const [topResult, setTopResult] = useState(null);

  // Format query for display
  const formattedQuery = query
    ? query.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Search";

  const API_KEY = String(
    process.env.REACT_APP_API_KEY || "2b42109ec723deefd4b119269974252b"
  ).trim();

  // --- Fetch Data ---
  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);

      const urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
      const urlTV = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`;

      try {
        const [resMovie, resTV] = await Promise.all([
          fetch(urlMovie).then((res) => res.json()),
          fetch(urlTV).then((res) => res.json()),
        ]);

        // Filter items with images for better UI
        const validMovies = (resMovie.results || []).filter(
          (item) => item.poster_path
        );
        const validTV = (resTV.results || []).filter(
          (item) => item.poster_path
        );

        // Merge and sort by popularity
        let combined = [...validMovies, ...validTV].sort(
          (a, b) => b.popularity - a.popularity
        );

        setData(combined);

        // Set the top result for the Hero Background (if it has a backdrop)
        const heroItem =
          combined.find((item) => item.backdrop_path) || combined[0];
        setTopResult(heroItem);
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    document.title = `Results: ${formattedQuery} - CineVerse`;
  }, [query, API_KEY, formattedQuery]);

  const handleNavigate = (item) => {
    const type = item.title ? "movie" : "tv";
    const slug = (item.title || item.name).toLowerCase().replace(/\s+/g, "-");
    navigate(`/${type}/${slug}/${item.id}`);
  };

  const handleSeeMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <NavBar />

      {/* --- Cinematic Hero Header --- */}
      <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden mt-16 md:mt-0">
        {/* Background Image (Dynamic or Fallback) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: topResult?.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${topResult.backdrop_path})`
              : `url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop)`,
          }}
        ></div>

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/60 to-[#050505]"></div>
        <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm border border-cyan-500/30 px-4 py-1 rounded-full bg-black/50 backdrop-blur-sm">
            <Search className="w-4 h-4" />
            <span>Search Results</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter uppercase drop-shadow-2xl break-words max-w-4xl mx-auto">
            {formattedQuery}
          </h1>
          <p className="text-gray-400 mt-4 text-sm md:text-lg tracking-widest">
            {data.length} TITLES FOUND
          </p>
        </div>
      </div>

      {/* --- Results Grid --- */}
      <div className="max-w-[1600px] mx-auto px-6 py-12 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            <span className="text-gray-500 tracking-widest uppercase text-sm">
              Scanning Database...
            </span>
          </div>
        ) : data.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
              {data.slice(0, displayCount).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(item)}
                  className="group relative aspect-[2/3] bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] border border-white/5 hover:border-cyan-400/50"
                >
                  {/* Poster */}
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>

                  {/* Content Info */}
                  <div className="absolute bottom-0 left-0 w-full p-3 md:p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {/* Type Badge */}
                    <div className="flex items-center justify-between mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm flex items-center gap-1">
                        {item.title ? (
                          <Film className="w-3 h-3" />
                        ) : (
                          <Tv className="w-3 h-3" />
                        )}
                        {item.title ? "Movie" : "TV"}
                      </span>
                      <span className="text-[10px] font-bold text-yellow-500 flex items-center gap-1">
                        ★ {item.vote_average?.toFixed(1)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-sm md:text-lg leading-tight drop-shadow-md line-clamp-2 group-hover:text-cyan-200 transition-colors">
                      {item.title || item.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {displayCount < data.length && (
              <div className="flex justify-center mt-20">
                <button
                  onClick={handleSeeMore}
                  className="group relative px-8 py-4 bg-transparent border border-cyan-500/30 text-cyan-400 font-bold tracking-[0.2em] uppercase rounded-sm overflow-hidden hover:text-black transition-colors duration-300"
                >
                  <span className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                  <span className="relative flex items-center gap-2 z-10">
                    Load More Results <ChevronDown className="w-4 h-4" />
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-gray-900 mb-4 text-gray-600">
              <MoreHorizontal className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              No Results Found
            </h2>
            <p className="text-gray-400">
              We couldn't find anything matching "{formattedQuery}".
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchedResult;
