import { useState } from "react";
import { GiAlienEgg } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
const NavBar = ({ sectionRef, trendingRef, popularRef, genreRef }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleScrollToTrending = () => {
    if (trendingRef) {
      if (trendingRef.current) {
        trendingRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#trending-section");
    }
  };

  const handleScrollTogenre = () => {
    if (genreRef) {
      if (genreRef.current) {
        genreRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#genre-section");
    }
  };

  const handleScrollToHome = () => {
    if (sectionRef) {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else navigate("/");
  };

  const handleScrollToPopular = () => {
    if (popularRef) {
      if (popularRef.current) {
        popularRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else navigate("/#popular-section");
  };

  const HandleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(!isMobileMenuOpen);
      }
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      const formattedSearch = search.toLowerCase().replace(/\s+/g, "-"); // Format for URL
      navigate(`/search/${formattedSearch}`);
    }
  };

  return (
    <nav className="backdrop-blur-lg fixed top-0 z-20 start-0 w-full">
      <div className="max-w-[1300px] flex flex-wrap items-center justify-between mx-auto p-4">
        <p className="flex items-center space-x-3 rtl:space-x-reverse cursor-default">
          <GiAlienEgg className="h-8 w-8 text-white" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            CineVerse
          </span>
        </p>

        {/* Search Bar And Hamburger Button */}
        <div className="md:order-2">
          {/* Search Bar for Desktop */}
          {/* Desktop Search Bar */}
          <div className="relative hidden md:flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                id="search-desktop"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-500 transition-colors focus:ring-[#00FFFF] focus:border-[#00FFFF] focus:placeholder-[#00FFFF] focus:text-[#00FFFF] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#00FFFF] dark:focus:border-[#00FFFF]"
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyPress={HandleKeyPress}
              />
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400 font-extrabold transition-colors group-hover:text-[#00FFFF] group-focus-within:text-[#00FFFF]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            </div>

            {/* Search Button - Positioned Next to Input */}
            <button
              className="p-2 text-base font-medium bg-[#00FFFF] text-white rounded-lg transition-colors hover:bg-[#00BFFF]"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Hamburger Button for Mobile */}
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center p-2 w-10 h-10 border justify-center text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none focus:ring-2 transition-all hover:bg-[#00FFFF] hover:text-black focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path stroke="currentColor" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        {/* Navbar Links and Search for Mobile */}
        <div
          className={`items-center justify-between ${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-search"
        >
          {/* Search Bar for Mobile */}
          <div className="relative md:hidden mt-12 mb-4 flex items-center gap-2 transition-colors">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                id="search-mobile"
                className="block w-full border rounded-md transition-colors hover:border hover:border-[#00FFFF] p-2 ps-10 text-sm border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyPress={HandleKeyPress}
              />
              {/* Search Icon */}
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              className="p-2 text-base font-medium bg-[#00FFFF] text-white rounded-lg transition-colors hover:bg-[#00BFFF]"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Navbar Links */}
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg backdrop-blur-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 cursor-pointer">
            <li onClick={handleScrollToHome}>
              <p
                className="block py-2 px-3 hover:bg-gray-700 text-white rounded-sm md:bg-transparent md:p-0 transition-colors hover:text-[#00FFFF]"
                aria-current="page"
              >
                Home
              </p>
            </li>
            <li onClick={handleScrollToTrending}>
              <p
                className="block py-2 px-3 hover:bg-gray-700 text-white rounded-sm md:bg-transparent md:p-0 transition-colors hover:text-[#00FFFF]"
                aria-current="page"
              >
                Trending
              </p>
            </li>
            <li onClick={handleScrollToPopular}>
              <p className="block py-2 px-3 rounded-sm hover:bg-gray-700  md:hover:bg-transparent transition-colors hover:text-[#00FFFF] md:p-0 text-white">
                Popular
              </p>
            </li>
            <li onClick={handleScrollTogenre}>
              <p className="block py-2 px-3  rounded-sm  md:hover:bg-transparent transition-colors hover:text-[#00FFFF] md:p-0 dark:text-white  dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700">
                Genre
              </p>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
