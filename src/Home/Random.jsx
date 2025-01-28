import wall1 from "../assests/wall1.jpg";
import SearchResult from "../Searching/SearchResult";
import Trending from "../Trending/Trending";
import Popular from "../Popular/Popular";
import NavBar from "./NavBar";
import React, { useRef } from "react";
export default function Random() {
  const inputRef = useRef(null);
  const sectionRef = useRef(null); // Ref for the background section
  const trendingRef = useRef(null); // Ref for Trending
  const popularRef = useRef(null); // Ref for Popular
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

  return (
    <React.Fragment>
      <NavBar
        inputRef={inputRef}
        popularRef={popularRef}
        trendingRef={trendingRef}
        sectionRef={sectionRef}
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

      {/* Popular Section */}
      <Popular ref={popularRef} />

      {/* Genre Section */}
      <SearchResult />
    </React.Fragment>
  );
}
