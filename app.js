// API key for accessing The Movie Database (TMDB) API
const APIKEY = '9dffaa28f307b031ed7082c228edbe21';

// DOM elements
let postList = document.getElementById('postList');
let search = document.getElementById('search');
let movieSearch = document.getElementById('movieSearch');
let userMovie = document.getElementById('userMovie');
let usersItem = document.createElement('p');
let usersImg = document.createElement('p');

// Initial value for searched movie (unused)
const searchedMovie = movieSearch.value;

// Function to look up movie details by name
const movielookUp = (moviename, callback) => {
    // Fetch movie data from TMDB API based on the provided movie name
    fetch('https://api.themoviedb.org/3/search/movie?query=' + moviename + '&api_key=' + APIKEY)
        .then((res) => res.json())
        .then((res) => {
            // Extract relevant movie details from the API response
            const movieID = res.results[0].id;
            const movieTitle = res.results[0].original_title;
            const img_path = res.results[0].poster_path;
            // Invoke the callback with the extracted movie details
            callback(undefined, { movieID, movieTitle, img_path });
        })
        .catch((error) => {
            // Handle errors in fetching movie data
            callback('Error fetching movie data', undefined);
        });
};

// Function to get similar movies based on a movie ID
const movieSimilar = (movieID, callback) => {
    // Fetch similar movies data from TMDB API based on the provided movie ID
    fetch('https://api.themoviedb.org/3/movie/' + movieID + '/similar?language=en-US&page=1' + '&api_key=' + APIKEY)
        .then((res) => res.json())
        .then((res) => {
            // Invoke the callback with the retrieved similar movies data
            callback(undefined, res.results);
            console.log(res.results);
        })
        .catch((error) => {
            // Handle errors in fetching similar movies data
            callback('Error fetching similar movies data', undefined);
        });
};

// Event listener for the search button click
search.addEventListener('click', () => {
    // Clear the user's selected movie information
    usersItem.textContent = '';
    // Look up details for the provided movie name
    movielookUp(movieSearch.value, (err, res) => {
        if (err) {
            // Log and handle errors in looking up movie details
            return console.log('error:' + err);
        }
        // Populate user's selected movie information
        usersItem.textContent = res.movieTitle;
        usersImg.innerHTML = `<img src="https://image.tmdb.org/t/p/w200${res.img_path}" /> `;
        userMovie.appendChild(usersImg);
        userMovie.appendChild(usersItem);
        console.log(res.movieTitle);
        console.log(usersItem);

        // Fetch similar movies based on the selected movie ID
        movieSimilar(res.movieID, (error, res) => {
            if (error) {
                // Log and handle errors in fetching similar movies
                console.error(error);
            } else {
                // Loop through similar movies and create movie containers
                res.forEach((movie) => {
                    let container = document.createElement('section');
                    container.classList.add('movie-container');

                    let listImg = document.createElement('section');
                    listImg.classList.add('front-side');
                    // Create image element with the poster path for the front side
                    listImg.innerHTML = `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="Poster for: ${movie.original_title}" />`;
                    container.appendChild(listImg);
                    listImg.classList.add('slide-in');

                    let backSide = document.createElement('section');
                    backSide.classList.add('back-side');
                    // Populate back side with movie details
                    backSide.innerHTML = `<h2>${movie.original_title}</h2></br><p>${movie.overview}</p>`;

                    // Append back side to the movie container
                    container.appendChild(backSide);

                    // Append the movie container to the recommendations list
                    postList.appendChild(container);

                    // Event listener to toggle the flip effect on click
                    container.addEventListener('click', () => {
                        container.classList.toggle('flipped');
                    });
                });
            }
        });

        // Clear the movie recommendations list
        postList.innerHTML = '';
        // Removing class from listImg 
        listImg.classList.remove('slide-in');
    });
});
