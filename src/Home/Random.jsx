import React, { useEffect, useRef, useState } from "react";
import SearchResult from "../Searching/SearchResult";
import Trending from "../Trending/Trending";
import Popular from "../Popular/Popular";
import NavBar from "./NavBar";
import Footer from "../Footer/footer";
import { useLocation } from "react-router-dom";
import TrendingShows from "../Trending/TrendingShows";
import PopularShows from "../Popular/PopularShows";
import { Play, Star, Info, ChevronDown } from "lucide-react";

const Random = () => {
  const inputRef = useRef(null);
  const sectionRef = useRef(null); // Ref for the background section
  const trendingRef = useRef(null); // Ref for Trending
  const popularRef = useRef(null); // Ref for Popular
  const genreRef = useRef(null); // Ref for Popular

  const location = useLocation(); // Extract the location here

  // Extract hash from location for dependency
  const hash = location.hash;

  const handleScrollToHome = () => {
    if (sectionRef) {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleScrollToTrending = () => {
    if (trendingRef.current) {
      trendingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToPopular = () => {
    if (popularRef.current) {
      popularRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  //After Refreshing helps scrool to rop
  useEffect(() => {
    // Remove the hash on page load to prevent auto-scroll
    if (hash) {
      window.history.replaceState(null, "", window.location.pathname);
      handleScrollToHome();
    }

    // Ensure the page starts at the top
    handleScrollToHome();
  }, [hash]); // Empty dependency array to run only once on mount

  //After Click trending scroll to trending
  useEffect(() => {
    requestAnimationFrame(() => {
      if (trendingRef.current && hash === "#trending-section") {
        trendingRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        setTimeout(() => {
          if (hash === "#popular-section" && popularRef.current) {
            popularRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else if (hash === "#genre-section" && genreRef.current) {
            genreRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100); // Delay ensures DOM is updated before scrolling
      }
      const timer = setTimeout(() => {
        window.history.replaceState(null, "", window.location.pathname);
      }, 1000); // Set a delay based on your scroll duration (in ms)

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    });
  }, [hash]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handlePageLoad = () => {
      setIsLoaded(true); // Trigger animation after page load
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`transition-opacity duration-500 ${
        !isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <NavBar
        inputRef={inputRef}
        popularRef={popularRef}
        trendingRef={trendingRef}
        sectionRef={sectionRef}
        genreRef={genreRef}
      />

      <div
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* 1. High-Res Cinematic Background (Dark Movie Theater) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=2071&auto=format&fit=crop')`,
          }}
        >
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />
        </div>

        {/* 2. Main Content - Centered & Clean */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8 pt-20">
          {/* Small Label */}
          <span className="mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium tracking-[0.3em] text-red-500 uppercase">
            Streaming Now
          </span>

          {/* Hero Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl leading-tight">
            Unlimited <span className="text-red-600">Cinema.</span> <br />
            Anytime.
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed font-light">
            Your gateway to the world's biggest movies and TV shows.{" "}
            <br className="hidden sm:block" />
            Start exploring the universe of entertainment today.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleScrollToTrending}
              className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
            >
              <Play size={20} fill="currentColor" />
              Start Watching
            </button>

            <button
              onClick={handleScrollToPopular}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Info size={20} />
              More Info
            </button>
          </div>
        </div>

        {/* Bottom Fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10"></div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce z-20">
          <ChevronDown size={32} />
        </div>
      </div>

      {/* Movie cards section */}

      {/* Trending Section */}
      <Trending ref={trendingRef} />
      <TrendingShows />

      {/* Popular Section */}
      <Popular ref={popularRef} />
      <PopularShows />

      {/* Genre Section */}
      <SearchResult ref={genreRef} />
      <Footer />
    </div>
  );
};

export default Random;
