import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchResult = forwardRef((props, ref) => {
  const API_KEY = String(process.env.REACT_APP_API_KEY).trim();
  const [genre, setGenre] = useState(null);
  const [genreValue, setGenreValue] = useState("1");
  const [Data, getData] = useState(null);
  const [resetCarousel, setResetCarousel] = useState(false);
  useEffect(() => {
    fetch(
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
  }, [API_KEY]);

  const fetchMovies = (genre) => {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;
    let url2 = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}`;

    if (genre !== "1") {
      url += `&with_genres=${genre}`;
      url2 += `&with_genres=${genre}`;
    }

    console.log(url);

    Promise.all([
      fetch(url).then((res) => res.json()),
      fetch(url2).then((res) => res.json()),
    ])
      .then(([data1, data2]) => {
        console.log(data2.results);
        let combinedData = [...data1.results, ...data2.results]; // Merging both results

        // Shuffle the array
        combinedData = combinedData.sort(() => Math.random() - 0.5);

        getData(combinedData);

        setResetCarousel(true);
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
            className="p-3 rounded-md text-lg bg-gray-800 text-white border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-[#39ff14] hover:bg-gray-700 hover:ring-2 hover:ring-[#39ff14] transition-all duration-300 "
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
          <Card
            MetaData={Data}
            reset={resetCarousel}
            setReset={setResetCarousel}
          />
        </div>
      </div>
    </>
  );
});

export default SearchResult;

const Card = ({ MetaData, reset, setReset }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 4; // Number of slides visible at a time
  const PendingSlides = MetaData && MetaData.length - 5;
  const [disable, setDisable] = useState(false);
  const [prevDisable, setPrevDisable] = useState(true);
  const naviagte = useNavigate();

  useEffect(() => {
    if (reset) {
      console.log("Reset Triggers");
      setCurrentSlide(0);
      setDisable(false);
      setPrevDisable(true);
    }
  }, [reset]);

  const handleNext = () => {
    console.log(PendingSlides);
    if (currentSlide < PendingSlides) {
      console.log(
        "Main if working and condition is ",
        currentSlide < PendingSlides,
        " and this condition is ",
        currentSlide + 1 === PendingSlides
      );
      setCurrentSlide((prev) => prev + 1);
      if (currentSlide + 1 === PendingSlides) {
        console.log("Working eeeeeeeeeeeeeeee");
        setDisable(true);
      }
    }
    setPrevDisable(false);
    setReset(false);
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      if (currentSlide - 1 === 0) {
        console.log("Time to TRUEEE");
        console.log(currentSlide);
        setPrevDisable(true);
      } else {
        console.log("Time to false");
        setPrevDisable(false);
      }
    }
    setDisable(false);
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
    <div className="relative">
      {/* Left Arrow */}
      <button
        className={`absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#001f3f] opacity-70 transition-opacity hover:opacity-100 p-4 w-16 h-16 rounded-full text-white z-20 ${
          prevDisable ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={handlePrev}
        disabled={currentSlide === 0}
      >
        &#8249;
      </button>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          // style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          style={{ transform: `translateX(-${currentSlide * 20}%)` }}
        >
          {MetaData &&
            MetaData.map((item) => (
              <div
                key={item.id}
                className="text-white  overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,0,0.6)] hover:scale-105 transition-transform duration-300 ease-in-out w-0 h-300px relative flex-shrink-0 mr-[1.95rem] ml-[3.2rem] my-[5rem]"
                style={{ flex: `0 0 calc(100% / ${slidesToShow + 3.1})` }}
                onClick={() => {
                  HandleRouting(item);
                }}
              >
                {/* Gradient Overlay for Entire Card */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80"></div>

                {/* Movie Image */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  className="object-cover"
                />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-lg font-bold mb-2 text-white drop-shadow-md">
                    {item.title || item.name}
                  </h3>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        className={`absolute top-1/2 right-3 transform -translate-y-1/2 bg-black opacity-70 transition-opacity hover:opacity-100 w-16 h-16  rounded-full text-white z-10 ${
          disable ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={handleNext}
        disabled={disable}
      >
        &#8250;
      </button>
    </div>
  );
};
