import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import "./CSS/Loader.css";
function App() {
  const Random = React.lazy(() => import("./Home/Random"));
  const Details = React.lazy(() => import("./Details/Details"));
  const SearchedResulttt = React.lazy(() => import("./SearchedResult/SResult"));
  return (
    <div className="App">
      {/*  */}

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    <div class="loader">
                      <svg viewBox="0 0 80 80">
                        <circle r="32" cy="40" cx="40" id="test"></circle>
                      </svg>
                    </div>

                    <div class="loader triangle">
                      <svg viewBox="0 0 86 80">
                        <polygon points="43 8 79 72 7 72"></polygon>
                      </svg>
                    </div>

                    <div class="loader">
                      <svg viewBox="0 0 80 80">
                        <rect height="64" width="64" y="8" x="8"></rect>
                      </svg>
                    </div>
                  </div>
                }
              >
                <Random />
              </Suspense>
            }
          />
          <Route
            path="/search/:query"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    <div class="loader">
                      <svg viewBox="0 0 80 80">
                        <circle r="32" cy="40" cx="40" id="test"></circle>
                      </svg>
                    </div>

                    <div class="loader triangle">
                      <svg viewBox="0 0 86 80">
                        <polygon points="43 8 79 72 7 72"></polygon>
                      </svg>
                    </div>

                    <div class="loader">
                      <svg viewBox="0 0 80 80">
                        <rect height="64" width="64" y="8" x="8"></rect>
                      </svg>
                    </div>
                  </div>
                }
              >
                <SearchedResulttt />
              </Suspense>
            }
          />
          <Route
            path="/movie/:query/:id"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    <div class="loader">
                      <svg viewBox="0 0 80 80">
                        <circle r="32" cy="40" cx="40" id="test"></circle>
                      </svg>
                    </div>

                    <div class="loader triangle">
                      <svg viewBox="0 0 86 80">
                        <polygon points="43 8 79 72 7 72"></polygon>
                      </svg>
                    </div>

                    <div class="loader">
                      <svg viewBox="0 0 80 80">
                        <rect height="64" width="64" y="8" x="8"></rect>
                      </svg>
                    </div>
                  </div>
                }
              >
                <Details type="movie" />
              </Suspense>
            }
          />
          <Route
            path="/tv/:query/:id"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    <div class="loader">
                      <svg viewBox="0 0 80 80">
                        <circle r="32" cy="40" cx="40" id="test"></circle>
                      </svg>
                    </div>

                    <div class="loader triangle">
                      <svg viewBox="0 0 86 80">
                        <polygon points="43 8 79 72 7 72"></polygon>
                      </svg>
                    </div>

                    <div class="loader">
                      <svg viewBox="0 0 80 80">
                        <rect height="64" width="64" y="8" x="8"></rect>
                      </svg>
                    </div>
                  </div>
                }
              >
                <Details type="tv" />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
