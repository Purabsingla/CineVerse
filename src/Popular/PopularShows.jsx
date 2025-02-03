import { forwardRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PopularShows = forwardRef((props, ref) => {
  const API_KEY = String(process.env.REACT_APP_API_KEY).trim();
  const url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`;

  const [data, setData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.results);
        setData(data.results);
      })
      .catch((err) => console.log(err));
  }, [url]);

  const HandleNavigate = (Data) => {
    console.log("Woorking", Data.id);
    if (Data.name && Data.id) {
      if (Data.name.trim()) {
        const query = Data.name.toLowerCase().replace(/\s+/g, "-");
        navigate(`/tv/${query}/${Data.id}`);
      }
    }
  };

  return (
    <div
      className="pt-8 pb-16 bg-deep-space-2 bg-opacity-80 transition-all"
      ref={ref}
    >
      {/* Heading Section */}
      <div className="py-8">
        <div
          className="text-center py-6"
          style={{
            background: "radial-gradient(circle, #001f3f, black)",
          }}
        >
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Popular TV Shows
          </h1>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="px-4 md:px-8 lg:px-12 ">
        <Card MetaData={data} HandleNavigate={HandleNavigate} />
      </div>
    </div>
  );
});

export default PopularShows;

const Card = ({ MetaData, HandleNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 4; // Number of slides visible at a time
  const PendingSlides = MetaData && MetaData.length - 5;
  const [disable, setDisable] = useState(false);
  const [prevDisable, setPrevDisable] = useState(true);

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
                className="text-white cursor-pointer overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,0,0.6)] hover:scale-105 transition-transform duration-300 ease-in-out w-0 h-300px relative flex-shrink-0 mr-[1.95rem] ml-[3.2rem] my-[5rem]"
                style={{ flex: `0 0 calc(100% / ${slidesToShow + 3.1})` }}
                onClick={() => {
                  HandleNavigate(item);
                }}
              >
                {/* Gradient Overlay for Entire Card */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80"></div>

                {/* Movie Image */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.name}
                  className="object-cover"
                />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-lg font-bold mb-2 text-white drop-shadow-md">
                    {item.name}
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
