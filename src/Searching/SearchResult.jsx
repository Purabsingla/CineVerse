import React, { forwardRef, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clapperboard, Filter } from "lucide-react";

// Loader Component (In case internal loader is needed)
const SimpleLoader = () => (
  <div className="flex justify-center items-center h-64 w-full">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

const SearchResult = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const API_KEY = String(process.env.REACT_APP_API_KEY || "").trim();

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("1");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Genres ---
  useEffect(() => {
    if (!API_KEY) return;

    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
        );
        const resData = await response.json();
        if (resData.genres) {
          setGenres(
            resData.genres.filter(
              (g) =>
                g.name !== "Action & Adventure" && g.name !== "Sci-Fi & Fantasy"
            )
          );
        }
      } catch (err) {
        console.error("Genre Fetch Error:", err);
      }
    };
    fetchGenres();
  }, [API_KEY]);

  // --- Fetch Movies/TV based on Genre ---
  useEffect(() => {
    if (!API_KEY) return;

    const fetchData = async () => {
      setLoading(true);
      let urlMovie = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;
      let urlTV = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}`;

      if (selectedGenre !== "1") {
        urlMovie += `&with_genres=${selectedGenre}`;
        urlTV += `&with_genres=${selectedGenre}`;
      }

      try {
        const [resMovie, resTV] = await Promise.all([
          fetch(urlMovie).then((res) => res.json()),
          fetch(urlTV).then((res) => res.json()),
        ]);

        let combined = [...(resMovie.results || []), ...(resTV.results || [])];

        // Shuffle the results for variety
        combined = combined.sort(() => Math.random() - 0.5);
        setData(combined);
      } catch (err) {
        console.error("Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGenre, API_KEY]);

  return (
    <section
      ref={ref}
      className="relative py-20 bg-[#050505] min-h-[80vh] overflow-hidden"
    >
      {/* Ambient Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Header & Filter Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          {/* Title Area */}
          <div className="pl-2 border-l-4 border-cyan-500">
            <div className="flex items-center gap-3 mb-2">
              <Clapperboard className="text-cyan-400 w-6 h-6" />
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs md:text-sm">
                Discover Content
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter drop-shadow-lg">
              Movies By Genre
            </h1>
          </div>

          {/* Stylish Genre Selector */}
          <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-full border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group">
            <div className="bg-gray-800 group-hover:bg-cyan-900 transition-colors p-2 rounded-full">
              <Filter className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="relative">
              <select
                className="bg-transparent text-white text-lg font-medium focus:outline-none cursor-pointer appearance-none pr-8 [&>option]:bg-gray-900 [&>option]:text-white"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="1">All Genres</option>
                <option value="28">Action</option>
                <option value="12">Adventure</option>
                <option value="878">Sci-Fi</option>
                <option value="14">Fantasy</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {/* Custom Arrow Icon */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? <SimpleLoader /> : <ResultCarousel data={data} />}
      </div>
    </section>
  );
});

export default SearchResult;

// --- Custom Carousel Component (Replaces Slick Slider) ---
const ResultCarousel = ({ data }) => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleRouting = (item) => {
    if (item.title) {
      const query = item.title.toLowerCase().replace(/\s+/g, "-");
      navigate(`/movie/${query}/${item.id}`);
    } else {
      const query = (item.name || "show").toLowerCase().replace(/\s+/g, "-");
      navigate(`/tv/${query}/${item.id}`);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-white/50 text-center py-10 text-xl">
        No results found for this genre.
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {/* Navigation Buttons (Hidden by default, shown on hover) */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-cyan-500 hover:text-black transition-all duration-300 -translate-x-2 md:-translate-x-8 disabled:opacity-0"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-cyan-500 hover:text-black transition-all duration-300 translate-x-2 md:translate-x-8"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-12 pt-4 no-scrollbar snap-x snap-mandatory px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {data.map((item) => (
          <div
            key={`${item.id}-${item.title || item.name}`}
            className="flex-none w-[160px] sm:w-[200px] md:w-[240px] lg:w-[260px] snap-start perspective-1000"
          >
            <div
              onClick={() => handleRouting(item)}
              className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 cursor-pointer transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-white/5 hover:border-cyan-400/50"
            >
              {/* Poster Image */}
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "https://via.placeholder.com/500x750/111827/ffffff?text=No+Image"
                }
                alt={item.title || item.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Hover Glow Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/30 rounded-xl transition-colors duration-500 pointer-events-none"></div>

              {/* Content Info */}
              <div className="absolute bottom-0 left-0 w-full p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-sm md:text-lg leading-tight drop-shadow-md line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {item.title || item.name}
                </h3>

                <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <span className="text-[10px] md:text-xs font-bold bg-cyan-500 text-black px-2 py-0.5 rounded">
                    {item.vote_average ? item.vote_average.toFixed(1) : "NR"}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold border border-white/20 px-2 py-0.5 rounded">
                    {item.media_type === "tv" ? "TV Series" : "Movie"}
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
