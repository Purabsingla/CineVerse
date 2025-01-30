import { useEffect, useState } from "react";
import Footer from "../Footer/footer";
import NavBar from "../Home/NavBar";
import { useParams } from "react-router-dom";

const Details = () => {
  const movie = {
    id: 550,
    title: "Fight Club",
    overview:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    release_date: "1999-10-15",
    runtime: 139,
    vote_average: 8.4,
    genres: ["Drama"],
    backdrop_path: "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    production_companies: [
      {
        name: "20th Century Fox",
        logo_path: "/hUzeosd33nzE5MCNsZxCGEKTXaQ.png",
      },
      {
        name: "Regency Enterprises",
        logo_path: "/3tvBqYsBhxWeHlu62SIJ1el93O7.png",
      },
    ],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const API_KEY = "2b42109ec723deefd4b119269974252b";
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
        })
        .catch((error) => console.error("Error fetching movie:", error));
    }
  }, [id]);

  console.log(id);

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

  return (
    <div
      className={`transition-opacity duration-500 ${
        !isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <NavBar />
      <div className="bg-gray-900 text-white min-h-screen">
        {/* Backdrop Section */}
        <div
          className="relative h-[30rem] w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${
              data && data.backdrop_path
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute bottom-10 left-10 flex items-center space-x-4">
            <img
              src={`https://image.tmdb.org/t/p/w500${data && data.poster_path}`}
              alt={data && data.title}
              className="w-36 rounded-lg shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold">{data && data.title}</h1>
              <p className="text-lg text-gray-300">
                {data && data.release_date}
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-10 py-8">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-300 mb-6">{data && data.overview}</p>
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="font-bold">Genres</p>
              <p>{data && data.genres.join(", ")}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="font-bold">Runtime</p>
              <p>{data && data.runtime} mins</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="font-bold">Rating</p>
              <p>{data && data.vote_average}/10</p>
            </div>
          </div>

          {/* Production Companies */}
          <h2 className="text-2xl font-bold mb-4">Production Companies</h2>
          <div className="flex gap-6">
            {movie.production_companies.map((company) => (
              <div key={company.name} className="text-center">
                <img
                  src={`https://image.tmdb.org/t/p/w500${company.logo_path}`}
                  alt={company.name}
                  className="h-20 mx-auto"
                />
                <p className="mt-2">{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Details;
