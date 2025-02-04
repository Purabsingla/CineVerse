import { forwardRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

  return (
    <div className="relative overflow-hidden">
      <Slider {...settings}>
        {MetaData &&
          MetaData.map((item) => (
            <div
              key={item.id}
              className="text-white cursor-pointer overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,255,1)] hover:scale-105 transition-transform duration-300 ease-in-out min-w-[200px] 2xl:h-[25rem] xl:h-[25rem]  lg:h-[25rem] md:h-[27rem] sm:h-[30rem] relative my-[5rem]"
              onClick={() => {
                HandleNavigate(item);
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
          ))}
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
