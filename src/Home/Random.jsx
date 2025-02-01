import wall1 from "../assests/wall1.jpg";
import SearchResult from "../Searching/SearchResult";
import Trending from "../Trending/Trending";
import Popular from "../Popular/Popular";
import NavBar from "./NavBar";
import React, { useEffect, useRef, useState } from "react";
import Footer from "../Footer/footer";
import { useLocation } from "react-router-dom";
import TrendingShows from "../Trending/TrendingShows";
import PopularShows from "../Popular/PopularShows";

export default function Random() {
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
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${wall1})` }}
        ref={sectionRef}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
            Discover Movies & TV Shows
          </h1>

          <p className="text-lg md:text-2xl mb-8 max-w-2xl text-gray-300">
            Explore trending films, search by title, genre, and enjoy the world
            of entertainment.
          </p>

          <div className="flex gap-28">
            <p className="btn-glitch-fill" onClick={handleScrollToTrending}>
              <span className="text">~~ Browse Trending</span>
              <span className="text-decoration"> _</span>
              <span className="decoration">⇒</span>
            </p>
            <p className="btn-glitch-fill" onClick={handleScrollToPopular}>
              <span className="text">~~ Browse Popular</span>
              <span className="text-decoration"> _</span>
              <span className="decoration">⇒</span>
            </p>
          </div>
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
}
