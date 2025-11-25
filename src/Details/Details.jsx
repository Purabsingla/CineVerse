import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  Star,
  Calendar,
  Globe,
  Monitor,
  Film,
  Tv,
  Layers,
  Video,
} from "lucide-react";

import Footer from "../Footer/footer";
import NavBar from "../Home/NavBar";

const API_KEY = String(
  process.env.REACT_APP_API_KEY || "2b42109ec723deefd4b119269974252b"
).trim();
const TOKEN = process.env.REACT_APP_TOKEN_KEY;

const Details = ({ type = "movie" }) => {
  const navigate = useNavigate();
  const { id, query } = useParams();
  const [data, setData] = useState(null);
  const [youtubeData, setYoutubeData] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [ottLinks, setOttLinks] = useState([]);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState({ director: [], writers: [] });
  const [clickedItems, setClickedItems] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const trailerRef = useRef(null);

  const formattedQuery = query
    ? query.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Details";

  // --- Scroll to Top & Title ---
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${
      data ? data.title || data.name : formattedQuery
    } - CineVerse`;
  }, [id, data, formattedQuery]);

  // --- Loader Animation ---
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // --- Fetch Logic ---
  useEffect(() => {
    if (!id) return;

    // 1. Get User Country for OTT
    fetch(`https://ipinfo.io/json?token=${TOKEN}`)
      .then((res) => res.json())
      .then((ipData) => {
        fetchOttProviders(ipData.country);
      })
      .catch((e) => {
        console.warn("IP Fetch Error (using default US):", e);
        fetchOttProviders("US");
      });

    // 2. Fetch Details, Videos, Similar & Credits
    const urlDetails = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`;
    const urlVideos = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`;
    const urlSimilar = `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}`;
    const urlCredits = `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`;

    Promise.all([
      fetch(urlDetails).then((res) => res.json()),
      fetch(urlVideos).then((res) => res.json()),
      fetch(urlSimilar).then((res) => res.json()),
      fetch(urlCredits).then((res) => res.json()),
    ])
      .then(([detailsData, videosData, similarData, creditsData]) => {
        // Process Details
        if (detailsData) {
          // Helper to format dates
          const format = (d) => (d ? d.split("-").reverse().join("-") : "N/A");
          const formatted = {
            ...detailsData,
            release_date: format(detailsData.release_date),
            first_air_date: format(detailsData.first_air_date),
          };
          setData(formatted);
        }

        // Process Videos
        const trailer = videosData.results?.find(
          (vid) =>
            vid.site === "YouTube" &&
            ["Trailer", "Teaser", "Opening Credits"].includes(vid.type)
        );
        setYoutubeData(trailer ? trailer.key || "" : null);

        // Process Similar
        if (similarData.results) {
          const filtered = similarData.results
            .filter((t) => t.poster_path)
            .filter((m) => !clickedItems.has(m.id));
          setSimilarMovies(filtered);
        }

        // Process Credits (Cast & Crew)
        if (creditsData) {
          setCast(creditsData.cast?.slice(0, 10) || []); // Top 10 Cast

          // Extract Director (for movies) or Created By (handled via details for TV usually, but checking crew here for safety)
          const directors = creditsData.crew?.filter(
            (member) => member.job === "Director"
          );
          const writers = creditsData.crew
            ?.filter((member) =>
              ["Screenplay", "Writer", "Story"].includes(member.job)
            )
            .slice(0, 2); // Limit to top 2 writers
          setCrew({ director: directors || [], writers: writers || [] });
        }
      })
      .catch((err) => console.error("Details Fetch Error:", err));
  }, [id, type, API_KEY, clickedItems]);

  const fetchOttProviders = (region) => {
    fetch(
      `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.results && json.results[region]) {
          setOttLinks(json.results[region]);
        }
      });
  };

  const handleClick = (item) => {
    if (item) {
      const itemTitle = item.title || item.name;
      const newSlug = itemTitle
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, "-");
      const newType = item.title ? "movie" : "tv";
      const newPath = `/${newType}/${newSlug}/${item.id}`;

      if (window.location.pathname !== newPath) {
        setClickedItems((prev) => new Set(prev).add(item.id));
        navigate(newPath);
        window.scrollTo(0, 0);
      }
    }
  };

  const scrollToTrailer = () => {
    trailerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!data)
    return (
      <div className="bg-[#050505] h-screen flex items-center justify-center text-cyan-500">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );

  return (
    <div
      className={`bg-[#050505] min-h-screen text-gray-100 font-sans selection:bg-cyan-500/30 transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <NavBar />

      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
        {/* Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`,
          }}
        >
          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-end pb-16 md:pb-24 gap-8 md:gap-12">
          {/* Poster (Floating Glass Effect) */}
          <div className="hidden md:block shrink-0 w-[300px] aspect-[2/3] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 relative group">
            <img
              src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
              alt={data.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-cyan-400 font-bold tracking-widest text-sm uppercase">
                {data.status}
              </p>
            </div>
          </div>

          {/* Text Info */}
          <div className="flex-1 space-y-6 animate-fade-in-up">
            {/* Breadcrumb / Tag */}
            <div className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase text-cyan-400 mb-2">
              <span className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {type === "movie" ? "Movie" : "TV Series"}
              </span>
              {data.adult && (
                <span className="text-red-500 border border-red-500/30 px-2 py-0.5 rounded">
                  18+
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-none tracking-tighter drop-shadow-2xl">
              {data.title || data.name}
            </h1>

            {/* Tagline */}
            {data.tagline && (
              <p className="text-lg md:text-2xl text-gray-300 italic font-light border-l-4 border-cyan-500 pl-4 opacity-90">
                "{data.tagline}"
              </p>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>{data.release_date || data.first_air_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>
                  {data.runtime
                    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
                    : data.episode_run_time?.[0]
                    ? `${data.episode_run_time[0]}m`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-500" />
                <span className="font-bold text-white">
                  {data.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-500">/ 10</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {youtubeData && (
                <button
                  onClick={scrollToTrailer}
                  className="flex items-center gap-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]"
                >
                  <Play className="w-5 h-5 fill-black" /> Watch Trailer
                </button>
              )}
              <button
                onClick={() =>
                  setClickedItems((prev) => new Set(prev).add(data.id))
                } // Just a dummy action for favorites
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest rounded transition-all backdrop-blur-sm"
              >
                + Add to List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="max-w-[1600px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-8 space-y-16">
          {/* Overview */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-cyan-500 rounded-full"></span>
              Storyline
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              {data.overview || "No overview available."}
            </p>

            {/* Genres Tags */}
            <div className="flex flex-wrap gap-3 mt-8">
              {data.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-4 py-2 rounded-full bg-gray-900 border border-white/10 text-sm text-cyan-400 font-bold uppercase tracking-wide hover:bg-cyan-500/10 transition-colors cursor-default"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </section>

          {/* Cast Section */}
          {cast.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-cyan-500 rounded-full"></span>
                Top Cast
              </h2>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="min-w-[120px] md:min-w-[140px] flex flex-col items-center text-center group"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-cyan-400 transition-colors shadow-lg mb-3">
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : "https://via.placeholder.com/200x200?text=No+Img"
                        }
                        alt={actor.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <h4 className="text-white font-bold text-sm md:text-base leading-tight">
                      {actor.name}
                    </h4>
                    <p className="text-cyan-400 text-xs mt-1 italic">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trailer Embed */}
          {youtubeData && (
            <section ref={trailerRef} className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-cyan-500 rounded-full"></span>
                Official Trailer
              </h2>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeData}`}
                  title="Trailer"
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}

          {/* Similar Movies (Carousel Grid) */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-cyan-500 rounded-full"></span>
              More Like This
            </h2>
            {similarMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarMovies.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleClick(item)}
                    className="group relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                      <span className="text-white font-bold text-sm">
                        {item.title || item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No similar content found.</p>
            )}
          </section>
        </div>

        {/* Right Column (Sidebar Stats) */}
        <div className="lg:col-span-4 space-y-12">
          {/* Quick Stats Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              Info Block
            </h3>

            <div className="space-y-4">
              {/* Director / Creator */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <Video className="w-4 h-4" />{" "}
                  {type === "movie" ? "Director" : "Created By"}
                </span>
                <span className="text-white font-medium text-right">
                  {type === "movie"
                    ? crew.director.length > 0
                      ? crew.director.map((d) => d.name).join(", ")
                      : "N/A"
                    : data.created_by?.length > 0
                    ? data.created_by.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Status
                </span>
                <span className="text-white font-medium">{data.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <Film className="w-4 h-4" /> Original Lang
                </span>
                <span className="text-white font-medium uppercase">
                  {data.original_language}
                </span>
              </div>
              {data.budget > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Budget</span>
                  <span className="text-green-400 font-mono">
                    ${(data.budget / 1000000).toFixed(1)}M
                  </span>
                </div>
              )}
              {data.revenue > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Revenue</span>
                  <span className="text-green-400 font-mono">
                    ${(data.revenue / 1000000).toFixed(1)}M
                  </span>
                </div>
              )}

              {/* TV Specific */}
              {type === "tv" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Tv className="w-4 h-4" /> Seasons
                    </span>
                    <span className="text-white font-medium">
                      {data.number_of_seasons}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Episodes
                    </span>
                    <span className="text-white font-medium">
                      {data.number_of_episodes}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* OTT Providers */}
          {ottLinks && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-cyan-400" /> Where to Watch
              </h3>
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/5">
                {["flatrate", "rent", "buy"].some(
                  (k) => ottLinks[k]?.length
                ) ? (
                  <div className="space-y-6">
                    {ottLinks.flatrate && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                          Stream
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {ottLinks.flatrate.map((p) => (
                            <img
                              key={p.provider_id}
                              src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
                              alt={p.provider_name}
                              className="w-10 h-10 rounded-lg shadow-md hover:scale-110 transition-transform"
                              title={p.provider_name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {(ottLinks.rent || ottLinks.buy) && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                          Rent / Buy
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {[...(ottLinks.rent || []), ...(ottLinks.buy || [])]
                            .map((p) => (
                              <img
                                key={p.provider_id}
                                src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
                                alt={p.provider_name}
                                className="w-10 h-10 rounded-lg shadow-md hover:scale-110 transition-transform"
                                title={p.provider_name}
                              />
                            ))
                            .slice(0, 5)}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No streaming info available for your region.
                  </p>
                )}
                <a
                  href={ottLinks.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-4 text-center text-xs text-cyan-500 hover:text-cyan-400 hover:underline"
                >
                  Check full availability on TMDB
                </a>
              </div>
            </div>
          )}

          {/* Production Companies */}
          {data.production_companies?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Production</h3>
              <div className="flex flex-wrap gap-4 bg-white p-6 rounded-xl">
                {data.production_companies
                  .filter((c) => c.logo_path)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-center h-12 w-auto"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${c.logo_path}`}
                        alt={c.name}
                        className="max-h-full max-w-[100px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                        title={c.name}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Details;
