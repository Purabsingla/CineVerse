import { useEffect, useState } from "react";
import wall2 from "../assests/Wall2.jpg";
import NavBar from "../Home/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../Footer/footer";

const SearcedResulttt = () => {
  const { query } = useParams(); // Get search term from URL
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const formattedQuery = query
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  // Format the query to capitalize the first letter

  const API_KEY = "2b42109ec723deefd4b119269974252b";
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${formattedQuery}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.results);
        setData(data.results);
      })
      .catch((err) => console.log(err));
  }, [url]);

  const HandleClick = (id) => {
    navigate(`/movie/${query}/${id}`);
  };

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
          {data &&
            data.map((item) => (
              <div
                key={item.id}
                className="text-white overflow-hidden rounded-lg shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,0,0.6)] hover:scale-105 transition-transform duration-300 ease-in-out w-[200px] h-[300px] relative flex-shrink-0 mx-[1.5rem] my-[3rem]"
                onClick={() => HandleClick(item.id)}
              >
                {/* Gradient Overlay for Better Visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"></div>

                {/* Movie Image */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-lg font-bold mb-1 text-white drop-shadow-md">
                    {item.title}
                  </h3>
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
