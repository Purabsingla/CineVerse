import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, X, Film } from "lucide-react";

// --- Reusable NavBar Component ---
const NavBar = ({ sectionRef, trendingRef, popularRef, genreRef }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Detect scroll to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavigation = (ref, path) => {
    if (ref && ref.current) {
      const yOffset = -80;
      const y =
        ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSearch = () => {
    if (search.trim()) {
      const formattedSearch = search.toLowerCase().replace(/\s+/g, "-");
      navigate(`/search/${formattedSearch}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Dynamic classes for cinematic effect
  // If menu is open, we force transparent background so it blends with the full-screen overlay
  const navBackground = isMobileMenuOpen
    ? "bg-transparent border-none"
    : isScrolled
    ? "bg-black/30 backdrop-blur-xl  shadow-2xl"
    : "bg-gradient-to-b from-black/80 to-transparent ";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${navBackground}`}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div
              onClick={() => handleNavigation(sectionRef, "/")}
              className="flex items-center gap-2 lg:gap-3 cursor-pointer group relative z-50"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
                <Film className="h-6 w-6 lg:h-8 lg:w-8 text-cyan-400 relative z-10 transform group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <span className="text-lg lg:text-2xl font-bold tracking-wider text-white uppercase font-sans truncate">
                Cine
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                  Verse
                </span>
              </span>
            </div>

            {/* Desktop Navigation & Search */}
            <div className="hidden lg:flex items-center gap-8">
              <ul className="flex gap-8 items-center">
                {[
                  { label: "Home", ref: sectionRef, path: "/" },
                  { label: "Trending", ref: trendingRef, path: "/#trending" },
                  { label: "Popular", ref: popularRef, path: "/#popular" },
                  { label: "Genre", ref: genreRef, path: "/#genre" },
                ].map((item) => (
                  <li
                    key={item.label}
                    onClick={() => handleNavigation(item.ref, item.path)}
                    className="text-xs font-bold tracking-[0.2em] text-gray-300 hover:text-cyan-400 uppercase cursor-pointer transition-all duration-300 hover:scale-105 relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#22d3ee]"></span>
                  </li>
                ))}
              </ul>

              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 transition-all duration-300 focus-within:border-cyan-400/50 focus-within:bg-black/60 w-64">
                  <input
                    type="text"
                    className="bg-transparent border-none text-gray-200 text-sm placeholder-gray-500 focus:ring-0 w-full outline-none tracking-wide"
                    placeholder="FIND MOVIES..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Search
                    onClick={handleSearch}
                    className="w-4 h-4 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-white hover:text-cyan-400 transition-colors z-50 relative p-2"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/98 backdrop-blur-3xl z-40 transition-all duration-500 lg:hidden flex flex-col justify-center items-center gap-8 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible"
        }`}
      >
        {/* Mobile Search */}
        <div className="w-full max-w-xs relative px-4">
          <input
            type="text"
            className="w-full bg-white/5 border border-white/20 rounded-full px-6 py-4 text-white text-lg outline-none focus:border-cyan-400 transition-colors text-center tracking-widest placeholder-gray-600"
            placeholder="SEARCH..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Mobile Links */}
        <ul className="flex flex-col items-center gap-6">
          {[
            { label: "Home", ref: sectionRef, path: "/" },
            { label: "Trending", ref: trendingRef, path: "/#trending" },
            { label: "Popular", ref: popularRef, path: "/#popular" },
            { label: "Genre", ref: genreRef, path: "/#genre" },
          ].map((item) => (
            <li
              key={item.label}
              onClick={() => handleNavigation(item.ref, item.path)}
              className="text-xl font-bold tracking-[0.3em] text-white hover:text-cyan-400 uppercase cursor-pointer transition-all duration-300 active:scale-95"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
