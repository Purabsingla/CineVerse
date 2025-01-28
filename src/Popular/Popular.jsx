import { forwardRef, useState } from "react";

const Popular = forwardRef((props, ref) => {
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
            Popular Movies
          </h1>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="px-4 md:px-8 lg:px-12 ">
        <Card />
      </div>
    </div>
  );
});

export default Popular;

const Card = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 4; // Number of slides visible at a time
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
  const PendingSlides = Data.length - 5;
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
          {Data.map((item) => (
            <div
              key={item.id}
              className="text-white  overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,0,0.6)] hover:scale-105 transition-transform duration-300 ease-in-out w-0 h-300px relative flex-shrink-0 mr-[1.95rem] ml-[3.2rem] my-[5rem]"
              style={{ flex: `0 0 calc(100% / ${slidesToShow + 3.1})` }}
            >
              {/* Gradient Overlay for Entire Card */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80"></div>

              {/* Movie Image */}
              <img
                src={`https://moviesmod.cash/wp-content/uploads/2025/01/Sonic-the-Hedgehog-3-2024-MoviesMod.red_.jpg`}
                alt={item.title}
                className="object-cover"
              />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-lg font-bold mb-2 text-white drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300 drop-shadow-sm">
                  {item.description}
                </p>
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
