export default function Popular() {
  return (
    <>
      <div className="pt-8 pb-16 bg-deep-space bg-opacity-80">
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

        {/* Movie Cards */}
        <div className="flex flex-wrap gap-8 max-w-full justify-center items-center px-6">
          {[...Array(18)].map((_, index) => (
            <div
              key={index}
              className="text-white rounded-lg overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,0,0.6)] hover:scale-105 transition-transform duration-300 ease-in-out w-[230px] h-[350px] relative"
            >
              {/* Gradient Overlay for Entire Card */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80"></div>

              {/* Movie Image */}
              <img
                src={`https://moviesmod.cash/wp-content/uploads/2025/01/Sonic-the-Hedgehog-3-2024-MoviesMod.red_.jpg`}
                alt={`Movie ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-lg font-bold mb-2 text-white drop-shadow-md">
                  Movie {index + 1}
                </h3>
                <p className="text-sm text-gray-300 drop-shadow-sm">
                  Description of Movie {index + 1}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
