# 🎮 Game Library — Frontend

A web application for managing a personal video game library. It allows users to register games, browse their collection, search for games, update information, manage favorites, and delete games through a REST API built with Java and Spring Boot.

> This repository contains the **frontend**, built with HTML, CSS, and JavaScript. The backend is maintained separately: [game-library-backend](https://github.com/arthurSchgg/game-library-backend).

- **Backend repository:** https://github.com/arthurSchgg/game-library-backend
- **Production API:** https://game-library-backend-ebrh.onrender.com/

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and forms |
| CSS3 | Styling, responsive layout, and dark theme |
| JavaScript (ES6+) | DOM manipulation, event handling, and asynchronous requests |
| Fetch API | HTTP communication with the backend |
| REST API | Game data management |
| Spring Boot | Backend integration |
| Vercel | Frontend deployment |

## ✨ Features

- **Add games:** Register a game with its title, genre, platform, release year, rating, description, and optional cover image URL.
- **List games:** Display registered games as cards containing their information and cover images.
- **Search by ID:** Retrieve a specific game using its unique identifier.
- **Search by title:** Find games by title using a case-insensitive search.
- **Update games:** Edit the information of an existing game.
- **Manage favorites:** Toggle a game's favorite status.
- **Delete games:** Remove games from the library after confirming the action.
- **Responsive interface:** Adapt the layout to smaller screens.
- **Image fallback:** Display a placeholder when a game does not have an image URL.

## 🎨 Interface

The interface uses a dark theme with a blue accent color, organized into the following sections:

- **Add Game to Library:** A form for registering games.
- **List of Games:** A collection of game cards with details and action buttons.
- **Search for a Game by ID:** Find a game using its ID.
- **Search for a Game by Title:** Search by the game's name.
- **Update Game:** Edit the fields of an existing game.

## 🏗 Project Structure

```text
game-library-frontend/
├── css/
│   └── style.css
├── img/
│   └── transferir.png
├── js/
│   └── app.js
├── .vscode/
│   └── settings.json
└── index.html
```

### File responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Defines the page structure, forms, search areas, game list, and footer. |
| `css/style.css` | Handles the dark theme, game cards, buttons, forms, and responsive styling. |
| `js/app.js` | Handles API requests, form submissions, game rendering, searching, updating, favorites, and deletion. |
| `img/transferir.png` | Contains the application's logo. |

## 🔗 Backend Integration

The frontend communicates with the backend using the Fetch API and JSON.

The API base URL is configured in `js/app.js`:

```javascript
const API_URL = "https://game-library-backend-ebrh.onrender.com/v1/game-library";
```

### API endpoints used

| Method | Endpoint | Frontend functionality |
|---|---|---|
| `GET` | `/v1/game-library` | Loads all games |
| `POST` | `/v1/game-library` | Registers a new game |
| `GET` | `/v1/game-library/{id}` | Searches for a game by ID |
| `GET` | `/v1/game-library/search?title={title}` | Searches for games by title |
| `PUT` | `/v1/game-library/{id}` | Updates an existing game |
| `PATCH` | `/v1/game-library/{id}/favorite` | Toggles favorite status |
| `DELETE` | `/v1/game-library/{id}` | Deletes a game |

The backend handles data validation, business logic, and database persistence. The frontend is responsible for collecting user input, sending requests, and displaying the returned information.

## 🖼 Game Cover Images

Each game can have an image URL stored in the `imageUrl` field.

The frontend displays the provided image URL in the game card. When the field is empty, a placeholder image is used instead.

Images are rendered using CSS, which controls their dimensions and display within the cards. The backend stores and returns the image URL without processing the image itself.

## 🚀 How to Run Locally

### Prerequisites

- A modern web browser
- Visual Studio Code
- The VS Code **Live Server** extension
- An accessible instance of the backend API

### 1. Clone the repository

```bash
git clone https://github.com/arthurSchgg/game-library-frontend.git
```

### 2. Open the project

Open the `game-library-frontend` folder in Visual Studio Code.

### 3. Start the frontend

Open `index.html`, right-click inside the editor, and select **Open with Live Server**.

The application will usually be available at:

```text
http://localhost:5500
```

### 4. Connect to the backend

By default, the frontend uses the production API hosted on Render.

To use a local backend instead, change the `API_URL` constant in `js/app.js`:

```javascript
const API_URL = "http://localhost:8085/v1/game-library";
```

Make sure the backend is running and its CORS configuration allows the frontend's origin.

## 🌐 Deployment

The frontend is a static website and can be deployed using services such as Vercel.

A typical deployment workflow is:

1. Push the frontend project to GitHub.
2. Import the repository into Vercel.
3. Deploy the project using the repository root as the root directory.
4. Keep the production API URL configured in `js/app.js`.
5. Ensure the backend permits requests from the deployed frontend domain.

No Node.js build process or JavaScript package installation is required for the current implementation.

## 🔐 CORS

The frontend communicates with the backend from a different origin. The backend must allow cross-origin requests from the frontend's domain.

The current backend configuration permits the local Live Server origin and matching Vercel preview or deployment subdomains.

If the frontend is deployed to a different domain, update the backend's CORS configuration accordingly.

## 👤 Author

**Arthur Miguel Schlichting**
