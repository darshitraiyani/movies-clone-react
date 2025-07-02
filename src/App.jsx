import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useState,useEffect } from "react";
import { useDebounce } from "react-use";
import { getTrendingMoives, updateSearchCount } from "./appwrite.js";
// import bgImage from './assets/hero-bg.png';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept:'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

function App() {

  const [searchTerm,setSearchTerm] = useState('');

  const [errorMessage,setErrorMessage] = useState(null);

  const [movieList,setMovieList] = useState([]);

  const [trendingMovies,setTrendingMovies] = useState([]);

  const [isLoading,setIsLoading] = useState(false);

  const [isLoadingTrendingMovies,setIsLoadingTrendingMovies] = useState(false);

  const [errorMessageTrendingMovies,setErrorMessageTrendingMovies] = useState(null);

  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm),500,[searchTerm]);

  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
      : `${API_BASE_URL}/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc`;

      const response = await fetch(endpoint,API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query,data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later!');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {

    setIsLoadingTrendingMovies(true);

    try {
      const movies = await getTrendingMoives();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setErrorMessageTrendingMovies('Error fetching trending movies. Please try again later!');
    } finally {
      setIsLoadingTrendingMovies(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  },[]);

  return (
    <main>
      <div className="pattern" style={{ backgroundImage: "url('hero-bg.png')" }}/>
        
      <div className="wrapper">

        <header>

          <img src="hero.png" alt="Hero Banner"/>

          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

        </header>

        <section className="trending">
          <h2>Trending Movies</h2>

          {isLoadingTrendingMovies ? 
            (<Spinner/>) : 
            errorMessageTrendingMovies ? 
            (<p className="text-red-500">{errorMessageTrendingMovies}</p>) : 
            (trendingMovies.length > 0 ? 
            <ul>
              {
                trendingMovies.map((movie,index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.search_term}/>
                  </li>
                ))
              }
            </ul> : 
            <h5 className="text-white">No Movies Found.</h5>)
          }
        </section>

        <section className="mt-2 all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            movieList.length > 0 ? 
            <ul>
              {
                movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>  
                ))
              }
            </ul>
            : <h5 className="text-white">No Data Found.</h5>
          )}
        </section>

      </div>

    </main>    
  )
}

export default App;
