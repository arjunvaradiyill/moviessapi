# Movie Management API

This is a simple Express-based API for managing a collection of movies. It allows users to view, add, update, and delete movies. 

## Features

- **GET /movies**: Retrieve a list of all movies.
- **GET /movies/:id**: Retrieve details of a specific movie by its ID.
- **POST /movies**: Add a new movie to the collection.
- **PATCH /movies/:id**: Update the rating of a movie by its ID.
- **DELETE /movies/:id**: Delete a movie by its ID.

## Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/<your-username>/movie-management-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd movie-management-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   node server.js
   ```

   The API will be available at `http://localhost:3000`.

## API Endpoints

### 1. Get All Movies

**GET** `/movies`

**Response:**

```json
[
  { "id": 1, "title": "Inception", "genre": "Sci-Fi", "releaseYear": 2010, "rating": 8.8 },
  { "id": 2, "title": "The Godfather", "genre": "Crime", "releaseYear": 1972, "rating": 9.2 }
]
```

---

### 2. Get a Movie by ID

**GET** `/movies/:id`

**Response (if found):**

```json
{ "id": 1, "title": "Inception", "genre": "Sci-Fi", "releaseYear": 2010, "rating": 8.8 }
```

**Response (if not found):**

```json
{ "error": "Movie not found" }
```

---

### 3. Add a New Movie

**POST** `/movies`

**Request Body:**

```json
{
  "title": "Avatar",
  "genre": "Sci-Fi",
  "releaseYear": 2009,
  "rating": 7.8
}
```

**Response:**

```json
{
  "id": 3,
  "title": "Avatar",
  "genre": "Sci-Fi",
  "releaseYear": 2009,
  "rating": 7.8
}
```

---

### 4. Update a Movie's Rating

**PATCH** `/movies/:id`

**Request Body:**

```json
{ "rating": 9.0 }
```

**Response:**

```json
{
  "id": 1,
  "title": "Inception",
  "genre": "Sci-Fi",
  "releaseYear": 2010,
  "rating": 9.0
}
```

---

### 5. Delete a Movie

**DELETE** `/movies/:id`

**Response:**

```json
{ "message": "Movie deleted successfully" }
```

---

## Deployment

You can deploy this API on platforms like [Render](https://render.com), [Vercel](https://vercel.com), or [Netlify](https://www.netlify.com) (for serverless deployment).

## License

This project is licensed under the MIT License.

---
