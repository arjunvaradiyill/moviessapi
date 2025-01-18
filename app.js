const express = require("express");
const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files like CSS
app.use(express.static("public"));

// In-memory movie collection
let movies = [
    { id: 1, title: "Inception", genre: "Sci-Fi", releaseYear: 2010, rating: "8.8", comment: null },
    { id: 2, title: "The Godfather", genre: "Crime", releaseYear: 1972, rating: "9.2", comment: null },
    { id: 3, title: "The Dark Knight", genre: "Action", releaseYear: 2008, rating: "9.0", comment: null },
];

// HTML Template Helper with Navigation Option
const renderHTML = (content, showNav = true) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movies API</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    ${showNav ? `
        <nav>
            <a href="/">Home</a>
            <a href="/movies">View Movies</a>
            <a href="/add-movie">Add a Movie</a>
        </nav>` : ''}
    <div class="container">
        ${content}
    </div>
</body>
</html>
`;

// Routes

// GET /movies - Return all movies with action buttons
app.get("/movies", (req, res) => {
    const movieList = movies
        .map(
            (movie) => `
                <div>
                    <h3>${movie.title}</h3>
                    <p>Genre: ${movie.genre}</p>
                    <p>Release Year: ${movie.releaseYear}</p>
                    <p>Rating: ${movie.rating ? movie.rating : 'N/A'}</p>
                    <p>Comment: ${movie.comment ? movie.comment : 'No comments yet'}</p>
                    <div class="actions">
                        <a href="/update-rating/${movie.id}" class="update-rating">Update Rating</a>
                        <a href="/trending-rating/${movie.id}" class="trending-rating">Trending Rating</a>
                        <a href="/delete-movie/${movie.id}" class="delete">Delete Movie</a>
                    </div>
                </div>`
        )
        .join("");
    res.send(renderHTML(`<h1>Movies List</h1>${movieList}`));
});

// GET /trending-rating/:id - View trending rating for a movie
app.get("/trending-rating/:id", (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find((m) => m.id === movieId);

    if (!movie) {
        return res.status(404).send(renderHTML(`<h1>Movie Not Found</h1><p class="error-message">No movie with the specified ID exists.</p>`));
    }

    res.send(renderHTML(`
        <h1>Trending Rating for ${movie.title}</h1>
        <p>Current Rating: ${movie.rating ? movie.rating : 'N/A'}</p>
        <p>Based on recent user reviews and feedback, the trending rating might change.</p>
        <p>Make sure to check back frequently for updated ratings!</p>
        <a href="/movies">Back to Movies List</a>
    `));
});

// GET /delete-movie/:id - Handle movie deletion
app.get("/delete-movie/:id", (req, res) => {
    const movieId = parseInt(req.params.id);

    if (!movies.some((m) => m.id === movieId)) {
        return res.status(404).send(renderHTML(`<h1>Movie Not Found</h1><p class="error-message">No movie with the specified ID exists.</p>`));
    }

    movies = movies.filter((m) => m.id !== movieId);

    res.redirect("/movies");
});

// GET /add-movie - Render Add Movie Form
app.get("/add-movie", (req, res) => {
    res.send(renderHTML(`
        <h1>Add a New Movie</h1>
        <form action="/add-movie" method="POST">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" required>
            
            <label for="genre">Genre:</label>
            <input type="text" id="genre" name="genre" required>
            
            <label for="releaseYear">Release Year:</label>
            <input type="number" id="releaseYear" name="releaseYear" required>
            
            <label for="rating">Rating:</label>
            <input type="text" id="rating" name="rating" required>
            
            <button type="submit">Add Movie</button>
        </form>
        <a href="/movies">Back to Movies List</a>
    `));
});

// POST /add-movie - Handle adding new movie
app.post("/add-movie", (req, res) => {
    const { title, genre, releaseYear, rating } = req.body;

    // Validate the form inputs
    if (!title || !genre || !releaseYear || !rating || isNaN(releaseYear) || isNaN(rating)) {
        return res.status(400).send(renderHTML(`<h1>Invalid Input</h1><p class="error-message">All fields are required. Please provide valid input.</p>`));
    }

    const newMovie = {
        id: movies.length > 0 ? movies[movies.length - 1].id + 1 : 1,
        title,
        genre,
        releaseYear: parseInt(releaseYear),
        rating: parseFloat(rating).toFixed(1),
        comment: null,
    };

    movies.push(newMovie);
    res.redirect("/movies");
});

// GET /update-rating/:id - Render Update Rating Form
app.get("/update-rating/:id", (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find((m) => m.id === movieId);

    if (!movie) {
        return res.status(404).send(renderHTML(`<h1>Movie Not Found</h1><p class="error-message">No movie with the specified ID exists.</p>`));
    }

    res.send(renderHTML(`
        <h1>Update Rating for ${movie.title}</h1>
        <form action="/update-rating/${movie.id}" method="POST">
            <label for="newRating">New Rating:</label>
            <input type="text" id="newRating" name="newRating" required>
            <button type="submit">Update Rating</button>
        </form>
        <a href="/movies">Back to Movies List</a>
    `));
});

// POST /update-rating/:id - Handle rating update
app.post("/update-rating/:id", (req, res) => {
    const movieId = parseInt(req.params.id);
    const newRating = req.body.newRating;

    const movie = movies.find((m) => m.id === movieId);

    if (!movie) {
        return res.status(404).send(renderHTML(`<h1>Movie Not Found</h1><p class="error-message">No movie with the specified ID exists.</p>`));
    }

    if (!newRating || isNaN(newRating)) {
        return res.status(400).send(renderHTML(`<h1>Invalid Rating</h1><p class="error-message">Please enter a valid numeric rating.</p>`));
    }

    movie.rating = parseFloat(newRating).toFixed(1);

    res.redirect("/movies");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
