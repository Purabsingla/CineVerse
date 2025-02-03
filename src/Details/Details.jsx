import { useEffect, useState } from "react";
import Footer from "../Footer/footer";
import NavBar from "../Home/NavBar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_KEY = String(process.env.REACT_APP_API_KEY).trim();
const TOKEN = process.env.REACT_APP_TOKEN_KEY;

const Details = ({ type }) => {
  //For Navigation
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [youtubedata, setYoutubeData] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [ottLinks, setOttLinks] = useState([]);
  const [clickedItems, setClickedItems] = useState(new Set());

  //Getting OTT Platforms
  const OTT = (userRegion) => {
    fetch(
      `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.results && json.results[userRegion]) {
          setOttLinks(json.results[userRegion]); // Set the providers for the region
        } else {
          console.error("No providers found for this region");
        }
      });
  };

  // For Scrol TO Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // for getting Country of the user
  useEffect(() => {
    fetch(`https://ipinfo.io/json?token=${TOKEN}`)
      .then((response) => response.json())
      .then((data) => {
        OTT(data.country);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  //Getting Details of MOvie User Searched
  useEffect(() => {
    if (id) {
      const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`;
      const url2nd = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const formatDates = (item) => ({
            ...item,
            release_date: item.release_date
              ? formatDate(item.release_date)
              : undefined,
            last_air_date: item.last_air_date
              ? formatDate(item.last_air_date)
              : undefined,
          });

          // If the response is an array, process each item
          if (Array.isArray(data)) {
            setData(data.map(formatDates));
          }
          // If the response is a single object, format its dates
          else if (data && typeof data === "object") {
            setData(formatDates(data));
          }
        })
        .catch((error) => console.error("Error fetching movie:", error));

      fetch(url2nd)
        .then((response) => response.json())
        .then((data) => {
          const trailer =
            data &&
            data.results.find(
              (vid) =>
                vid.site === "YouTube" &&
                (vid.type === "Trailer" ||
                  vid.type === "Opening Credits" ||
                  vid.type === "Teaser")
            );
          trailer
            ? setYoutubeData(
                trailer.length > 0 ? trailer[trailer.length].key : trailer.key
              )
            : setYoutubeData(null);
        })
        .catch((error) => console.error("Error fetching movie:", error));

      fetch(
        `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}`
      )
        .then((res) => res.json())
        .then((json) => {
          const filteredMovies = json.results
            .filter((t) => t.poster_path !== null)
            .filter((movie) => !clickedItems.has(movie.id)); // ✅ Remove clicked items

          setSimilarMovies(filteredMovies);
        });
    }
  }, [id, type]);

  const [isLoaded, setIsLoaded] = useState(false);

  //For Loader
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

  const HandleClick = (Dataa) => {
    if (Dataa) {
      let newPath = "";
      if (Dataa.title) {
        const formattedQuery = Dataa.title
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
        newPath = `/movie/${formattedQuery}/${Dataa.id}`;
      } else if (Dataa.name) {
        const formattedQuery = Dataa.name
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
        newPath = `/tv/${formattedQuery}/${Dataa.id}`;
      }

      // 🔥 Prevent duplicate history entries 🔥
      if (window.location.pathname !== newPath) {
        console.log("Navigating to:", newPath);
        setClickedItems((prev) => new Set(prev).add(Dataa.id));
        window.scrollTo(0, 0);
        navigate(newPath);
      }
    }
  };

  window.onpopstate = () => {
    console.log("Back button pressed! History Length:", window.history.length);
  };

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  return (
    <div
      className={`transition-opacity duration-500 ${
        !isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <NavBar />
      <div className="bg-deep-space text-white min-h-screen">
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
              <h1 className="text-4xl font-bold">
                {data && (data.title || data.name)}
              </h1>
              <p className="text-lg text-gray-100 mt-2">
                {data && (data.release_date || data.last_air_date)}
              </p>
              <p className="text-lg text-gray-100 mt-2">
                Original {type === "movie" ? "Title" : "Name"} :-{" "}
                {data && (data.original_name || data.original_title)}
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-10 py-8">
          <h2 className="text-5xl font-bold mb-4">Overview</h2>
          <p className="text-gray-300 mb-6">{data && data.overview}</p>

          {youtubedata && (
            <div className="mb-10">
              <h2 className="text-5xl font-bold mb-6">Watch Trailer</h2>
              <div className="flex justify-center items-center my-7">
                <iframe
                  width="65%"
                  height="500"
                  src={`https://www.youtube.com/embed/${youtubedata}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-6 mb-10">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="font-bold">Genres</p>

              <span>
                {data && data.genres.map((item) => item.name).join(", ")}
              </span>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="font-bold">Runtime</p>
              <p>
                {data &&
                  (data.runtime > 0
                    ? data.runtime
                    : data.episode_run_time?.[0] || "Not available")}{" "}
                mins
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="font-bold">Rating</p>
              <p>{data && data.vote_average}/10</p>
            </div>
          </div>

          {/* Production Companies */}
          {data?.production_companies?.length > 0 && (
            <>
              <h2 className="text-5xl font-bold mb-10 mt-10">
                Production Companies
              </h2>
              <div className="flex flex-wrap gap-10">
                {data.production_companies.map((company) => (
                  <div key={company.name} className="text-center border-b">
                    {company.logo_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${company.logo_path}`}
                        alt={company.name}
                        className="h-20 mx-auto bg-white rounded-md p-2"
                      />
                    )}
                    <p className="mt-2">{company.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Available on OTT */}
          {ottLinks && (
            <div className="my-10 ">
              <h2 className="text-5xl font-bold mb-6">Available on</h2>
              <div className="flex flex-wrap gap-6">
                {/* Loop through buy, flatrate, and rent */}
                {/* {["buy", "flatrate", "rent"].map(
                  (type) =>
                    ottLinks[type] &&
                    ottLinks[type].map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="text-center bg-gray-800 p-4 rounded-lg shadow-md"
                      >
                        {provider.logo_path && (
                          <a
                            href={ottLinks.link} // Global link for the OTT platform
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="h-16 mx-auto"
                            />
                          </a>
                        )}
                        <p className="mt-2">{provider.provider_name}</p>
                        <p className="text-gray-400 text-sm capitalize">
                          ({type})
                        </p>
                      </div>
                    ))
                )} */}
                {["buy", "flatrate", "rent"].some(
                  (type) => ottLinks[type]?.length
                ) ? (
                  ["buy", "flatrate", "rent"].map(
                    (type) =>
                      ottLinks[type] &&
                      ottLinks[type].map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="text-center bg-gray-800 p-4 rounded-lg shadow-md"
                        >
                          {provider.logo_path && (
                            <a
                              href={ottLinks.link} // Global link for the OTT platform
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="h-16 mx-auto"
                              />
                            </a>
                          )}
                          <p className="mt-2">{provider.provider_name}</p>
                          <p className="text-gray-400 text-sm capitalize">
                            ({type})
                          </p>
                        </div>
                      ))
                  )
                ) : (
                  <p className="text-center  mt-4">
                    Not available in your country.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SImilar Movies */}
          <h2 className="text-5xl font-bold mt-10 mb-6">
            Similar {type === "movie" ? "Movies" : "TV Shows"}
          </h2>
          <div className="flex flex-wrap justify-center ">
            {similarMovies &&
              similarMovies.map((item) => (
                <div
                  key={item.id}
                  className="text-white cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,0,0.6)] hover:scale-105 transition-transform duration-300 ease-in-out w-[200px] h-[300px] relative flex-shrink-0 mx-[1.5rem] my-[3rem]"
                  onClick={() => HandleClick(item)}
                >
                  {/* Gradient Overlay for Better Visibility */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"></div>

                  {/* Movie Image */}
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-lg font-bold mb-1 text-white drop-shadow-md">
                      {item.title || item.name}
                    </h3>
                  </div>
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
