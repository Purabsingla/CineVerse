import { forwardRef, useEffect, useState, useRef } from "react";
import { Meta, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../Loader/Loader";

const SearchResult = forwardRef((props, ref) => {
  const API_KEY = String(process.env.REACT_APP_API_KEY).trim();
  const [genre, setGenre] = useState(null);
  const [genreValue, setGenreValue] = useState("1");
  const [Data, getData] = useState([]);
  useEffect(() => {
    async function GETDATA() {
      await fetch(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setGenre(
            data.genres.filter(
              (genre) =>
                genre.name !== "Action & Adventure" &&
                genre.name !== "Sci-Fi & Fantasy"
            )
          );
        })
        .catch((err) => console.error(err));
    }
    GETDATA();
  }, [API_KEY]);

  const fetchMovies = async (genre) => {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;
    let url2 = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}`;

    if (genre !== "1") {
      url += `&with_genres=${genre}`;
      url2 += `&with_genres=${genre}`;
    }

    console.log(url);

    await Promise.all([
      fetch(url).then((res) => res.json()),
      fetch(url2).then((res) => res.json()),
    ])
      .then(([data1, data2]) => {
        console.log(data2.results, data1.results);
        let combinedData = [...data1.results, ...data2.results]; // Merging both results

        // Shuffle the array
        combinedData = combinedData.sort(() => Math.random() - 0.5);

        getData(combinedData);
        console.log("Data Stored");
      })
      .catch((err) => console.error(err));
  };

  // Fetch movies when genreValue changes
  useEffect(() => {
    fetchMovies(genreValue);
  }, [genreValue]);

  return (
    <>
      <div className="pt-8 pb-16 bg-deep-space bg-opacity-80" ref={ref}>
        {/* Heading Section */}
        <div className="py-8">
          <div
            className="text-center py-6"
            style={{
              background: "radial-gradient(circle, #001f3f, black)",
            }}
          >
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Movies By Genre
            </h1>
          </div>
        </div>
        <div className="flex ml-[3rem]  items-center space-x-4">
          <label className="text-white text-lg">Select Genre:</label>
          <select
            className="p-3 rounded-md text-lg bg-gray-800 text-white border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-[#00FFFF] hover:bg-gray-700 hover:ring-2 hover:ring-[#00FFFF] transition-all duration-300 "
            onChange={(e) => {
              console.log(e.target.value);
              setGenreValue(e.target.value);
            }}
          >
            <option value="1">All</option>
            <option value="28">Action</option>
            <option value="12">Adventure</option>
            <option value="878">Sci-Fi</option>
            <option value="14">Fantasy</option>
            {genre &&
              genre.map((item) => <option value={item.id}>{item.name}</option>)}
            {/* Add other genres here */}
          </select>
        </div>
        {/* Movie Cards */}
        <div className="px-4 md:px-8 lg:px-12 ">
          <Card MetaData={Data} />
        </div>
      </div>
    </>
  );
});

export default SearchResult;

const Card = ({ MetaData }) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    // When data changes, reset carousel to the starting point
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
    console.log(Array.isArray(MetaData));
  }, [MetaData]);

  const naviagte = useNavigate();

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const HandleRouting = (Data) => {
    if (Data.title) {
      const query = Data.title.toLowerCase().replace(/\s+/g, "-");
      naviagte(`/movie/${query}/${Data.id}`);
    } else {
      const query = Data.name.toLowerCase().replace(/\s+/g, "-");
      naviagte(`/tv/${query}/${Data.id}`);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {Array.isArray(MetaData) && MetaData ? (
          MetaData.map((item) => (
            <div
              key={item.id}
              className="text-white cursor-pointer overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,255,1)] hover:scale-105 transition-transform duration-300 ease-in-out min-w-[200px] 2xl:h-[25rem] xl:h-[25rem]  lg:h-[25rem] md:h-[27rem] sm:h-[30rem] relative my-[5rem]"
              onClick={() => {
                HandleRouting(item);
              }}
            >
              {/* Gradient Overlay for Entire Card */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80"></div>

              {/* Movie Image */}
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full h-full object-cover"
              />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-lg font-bold mb-2 text-white drop-shadow-md">
                  {item.title || item.name}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <Loader />
        )}
      </Slider>
    </div>
  );
};

const NextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black opacity-70 transition-opacity hover:opacity-100 w-16 h-16 rounded-full text-white z-10 cursor-pointer"
    style={{ right: "10px" }} // Adjust right position
    onClick={onClick}
  >
    &#8250;
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#001f3f] opacity-70 transition-opacity hover:opacity-100 p-4 w-16 h-16 rounded-full text-white z-20 cursor-pointer"
    style={{ left: "10px" }} // Adjust left position
    onClick={onClick}
  >
    &#8249;
  </button>
);
