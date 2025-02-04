import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import "./CSS/Loader.css";
import Loader from "./Loader/Loader";

function App() {
  const Random = React.lazy(() => import("./Home/Random"));
  const Details = React.lazy(() => import("./Details/Details"));
  const SearchedResulttt = React.lazy(() => import("./SearchedResult/SResult"));
  return (
    <div className="App">
      {/*  */}

      <HashRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Random />} />
            <Route path="/search/:query" element={<SearchedResulttt />} />
            <Route
              path="/movie/:query/:id"
              element={<Details type="movie" />}
            />
            <Route path="/tv/:query/:id" element={<Details type="tv" />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </div>
  );
}

export default App;
