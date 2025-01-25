import { useState } from "react";
// import { FaSearch } from "react-icons/fa";
import wall1 from "../assests/wall1.jpg";
import "../CSS/Cards.css";
import SearchResult from "../Searching/SearchResult";
import Trending from "../Trending/Trending";
import Popular from "../Popular/Popular";
import NavBar from "./NavBar";
export default function Random() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(false);

  const handleSearch = () => {
    console.log("Workng");
    if (searchTerm.trim()) {
      console.log(`Searching for: ${searchTerm}`);
      // Add navigation or API call logic here
    }
    setSearchResults(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <NavBar />
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${wall1})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
            Discover Movies & TV Shows
          </h1>

          <p className="text-lg md:text-2xl mb-8 max-w-2xl text-gray-300">
            Explore trending films, search by title, genre, or actor, and enjoy
            the world of entertainment.
          </p>

          {/* <button className="mt-8 px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-full text-lg font-semibold shadow-md">
            Browse Trending
          </button> */}

          <p className="btn-glitch-fill">
            <span className="text">~~ Browse Trending</span>
            <span className="text-decoration"> _</span>
            <span className="decoration">⇒</span>
          </p>
        </div>
      </div>

      {/* Movie cards section */}
      {searchResults && <SearchResult />}
      <Trending />
      <Popular />
      <div className="cards">
        <div className="card red">
          <p className="tip">Hover Me</p>
          <p className="second-text">Lorem Ipsum</p>
        </div>
        <div className="card blue">
          <p className="tip">Hover Me</p>
          <p className="second-text">Lorem Ipsum</p>
        </div>
        <div className="card green">
          <p className="tip">Hover Me</p>
          <p className="second-text">Lorem Ipsum</p>
        </div>
      </div>
    </>
  );
}
// <div
//           key={index}
//             className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all w-[250px]"
//             >
//       <img
//           src={`https://via.placeholder.com/300x450?text=Movie+${
//               index + 1
//               }`}
//                 alt={`Movie ${index + 1}`}
//                  className="w-full h-64 object-cover"
//    />
//      <div className="p-4">
//          <h3 className="text-lg font-bold mb-2">Movie {index + 1}</h3>
//            <p className="text-sm text-gray-300">
//                Description of Movie {index + 1}...
//                </p>
//                </div>
//              </div>
