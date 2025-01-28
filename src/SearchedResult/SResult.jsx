import { useEffect } from "react";
import wall2 from "../assests/Wall2.jpg";
import NavBar from "../Home/NavBar";
import { useParams } from "react-router-dom";
import Footer from "../Footer/footer";
const SearcedResulttt = () => {
  const Data = [
    {
      id: 1,
      title: "Movie 1",
      description: "This is the description for Movie 1.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-01",
    },
    {
      id: 2,
      title: "Movie 2",
      description: "This is the description for Movie 2.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-02",
    },
    {
      id: 3,
      title: "Movie 3",
      description: "This is the description for Movie 3.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-03",
    },
    {
      id: 4,
      title: "Movie 4",
      description: "This is the description for Movie 4.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-04",
    },
    {
      id: 5,
      title: "Movie 5",
      description: "This is the description for Movie 5.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-05",
    },
    {
      id: 6,
      title: "Movie 6",
      description: "This is the description for Movie 6.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-06",
    },
    {
      id: 7,
      title: "Movie 7",
      description: "This is the description for Movie 7.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-07",
    },
    {
      id: 8,
      title: "Movie 8",
      description: "This is the description for Movie 8.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-08",
    },
    {
      id: 9,
      title: "Movie 9",
      description: "This is the description for Movie 9.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-09",
    },
    {
      id: 10,
      title: "Movie 10",
      description: "This is the description for Movie 10.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-10",
    },
    {
      id: 11,
      title: "Movie 11",
      description: "This is the description for Movie 11.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-11",
    },
    {
      id: 12,
      title: "Movie 12",
      description: "This is the description for Movie 12.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-12",
    },
    {
      id: 13,
      title: "Movie 13",
      description: "This is the description for Movie 13.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-13",
    },
    {
      id: 14,
      title: "Movie 14",
      description: "This is the description for Movie 14.",
      image: "https://via.placeholder.com/150",
      releaseDate: "2025-01-14",
    },
  ];
  const { query } = useParams(); // Get search term from URL

  // Format the query to capitalize the first letter
  const formattedQuery = query
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <NavBar />
      <div
        className="relative w-full h-[20rem] bg-cover bg-center"
        style={{ backgroundImage: `url(${wall2})` }}
      >
        <h1 className="absolute top-[15rem] left-1/2 -translate-x-1/2 -translate-y-1/2  text-white text-5xl font-bold text-center">
          Results for: {formattedQuery}
        </h1>
      </div>
      <div className="bg-deep-space w-full min-h-screen p-8">
        <div className="flex flex-wrap justify-center">
          {Data.map((item) => (
            <div
              key={item.id}
              className="text-white overflow-hidden rounded-lg shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,0,0.6)] hover:scale-105 transition-transform duration-300 ease-in-out w-[200px] h-[300px] relative flex-shrink-0 mx-[1.5rem] my-[3rem]"
            >
              {/* Gradient Overlay for Better Visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"></div>

              {/* Movie Image */}
              <img
                src={`https://moviesmod.cash/wp-content/uploads/2025/01/Sonic-the-Hedgehog-3-2024-MoviesMod.red_.jpg`}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-lg font-bold mb-1 text-white drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300 drop-shadow-sm line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearcedResulttt;
