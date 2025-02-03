import "./App.css";
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import React, { Suspense } from "react";
import "./CSS/Loader.css";
import Loader from "./Loader/Loader";
import { createBrowserHistory } from "history";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const history = createBrowserHistory();
function App() {
  const Random = React.lazy(() => import("./Home/Random"));
  const Details = React.lazy(() => import("./Details/Details"));
  const SearchedResulttt = React.lazy(() => import("./SearchedResult/SResult"));
  return (
    <div className="App">
      {/*  */}

      <HistoryRouter history={history}>
        <TrackHistory />
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
      </HistoryRouter>
    </div>
  );
}

export default App;

const TrackHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (performance.navigation.type === 1) {
      console.log("Page refreshed - preventing history overwrite.");
      navigate(-1); // Moves back to prevent history loss
    }
  }, []);

  useEffect(() => {
    console.log(
      "Navigated to:",
      location.pathname,
      "| History length:",
      window.history.length
    );
  }, [location]);

  return null;
};
