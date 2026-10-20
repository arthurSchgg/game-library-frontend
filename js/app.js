const API_URL = "http://localhost:8085/v1/game-library";

// ==========================================
// SINGLE FUNCTION TO CREATE THE GAME CARD
// ==========================================
function createGameCard(game) {
    const card = document.createElement("div");
    card.classList.add("game-card");

    const idEl = document.createElement("small");
    idEl.textContent = `ID: ${game.id}`;

    const image = document.createElement("img");
    image.className = "game-cover";
    image.alt = game.title;

    if(game.imageUrl) {
        image.src = game.imageUrl;
    } else {
        image.src = "https://placehold.co/300x150/333/fff?text=No+Image";  
    }

    const titleEl = document.createElement("h3");
    titleEl.textContent = game.title;

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${game.genre}`;

    const platform = document.createElement("p");
    platform.textContent = `Platform: ${game.platform}`;

    const releaseYear = document.createElement("p");
    releaseYear.textContent = `Release Year: ${game.releaseYear}`;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${game.rating ?? "—"}`;

    const description = document.createElement("p");
    description.textContent = game.description;

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("card-buttons");

    const btnFavorite = document.createElement("button");
    btnFavorite.textContent = game.favorite ? "Unfavorite" : "Favorite";
    btnFavorite.classList.add("btn-favorite");

    btnFavorite.addEventListener("click", async () => {
        try {
            const response = await fetch(`${API_URL}/${game.id}/favorite`, { method: "PATCH" });
            if (response.ok) {

                listingGames();
            } else {
                alert("Error while adding the game to favorites.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Delete";
    btnDelete.classList.add("btn-delete");

    btnDelete.addEventListener("click", async () => {
        if (!confirm(`Are you sure you want to delete "${game.title}"?`)) return;

        try {
            const response = await fetch(`${API_URL}/${game.id}`, { method: "DELETE" });
            if (response.ok) {
                alert("Game deleted successfully!");
                listingGames();
            } else {
                alert("Error deleting the game.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    btnContainer.append(btnFavorite, btnDelete);

    card.append(idEl, image, titleEl, genre, platform, releaseYear, rating, description, btnContainer);

    return card;
}

// ==========================================
// GENERAL LISTING
// ==========================================
async function listingGames() {
    try {
        const response = await fetch(`${API_URL}`);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const games = await response.json();
        console.log("Loaded Games: ", games);

        const container = document.getElementById("container-games");
        container.replaceChildren();

        if (games.length === 0) {
            container.innerText = "No games found";
            return;
        }

        games.forEach(game => {
            const card = createGameCard(game);
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error listing games: ", error);
        document.getElementById("container-games").innerText = "Error loading games";
    }
}

listingGames();

// ==========================================
// ADD GAME (POST)
// ==========================================
const form = document.getElementById('form-game');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const game = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        platform: document.getElementById('platform').value,
        releaseYear: Number(document.getElementById('release-year').value.split('-')[0]),
        rating: document.getElementById('rating').value
            ? Number(document.getElementById('rating').value)
            : null,
        description: document.getElementById('description').value,
        
        // NOVO: Pega a URL da imagem que o usuário digitou no HTML
        imageUrl: document.getElementById('image-url').value || null
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(game)
        });

        if (!response.ok) {
            throw new Error("Error while registering the game");
        }

        const registeredGame = await response.json();
        console.log("Registered game: ", registeredGame);

        alert("Game registered successfully!");
        form.reset();
        listingGames();
    } catch (error) {
        console.error("Error: ", error);
        alert("It was not possible to register the game.");
    }
});

// ==========================================
// SEARCH BY ID
// ==========================================
const buttonFindId = document.getElementById("search-by-id");

buttonFindId.addEventListener('click', async () => {
    const id = document.getElementById("id").value;

    if (!id) {
        alert("Enter an ID");
        return;
    }

    const wrapper = document.getElementById("searching-game-id");

    try {
        wrapper.replaceChildren();
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`Game not found. Status: ${response.status}`);
        }

        const game = await response.json();
        console.log("Game found: ", game);

        const card = createGameCard(game);
        wrapper.appendChild(card);

    } catch (error) {
        console.error("Error finding game: ", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Game not found or server error.";
        errorMessage.style.color = "#ff5252";
        wrapper.replaceChildren(errorMessage);
    }
});

// ==========================================
// SEARCH BY TITLE
// ==========================================
const buttonFindTitle = document.getElementById("search-by-title");

buttonFindTitle.addEventListener('click', async () => {
    const searchTitle = document.getElementById("search-title").value;

    if (!searchTitle) {
        alert("Enter a title");
        return;
    }

    const wrapper = document.getElementById("searching-game-title");

    try {
        wrapper.replaceChildren();
        const response = await fetch(`${API_URL}/search?title=${encodeURIComponent(searchTitle)}`);

        if (!response.ok) {
            throw new Error(`Server error. Status: ${response.status}`);
        }

        const games = await response.json();

        if (games.length === 0) {
            throw new Error("Game not found.");
        }

        const game = games[0];
        console.log("Game found: ", game);

        const card = createGameCard(game);
        wrapper.appendChild(card);

    } catch (error) {
        console.error("Error finding game: ", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Game not found or server error.";
        errorMessage.style.color = "#ff5252";
        wrapper.replaceChildren(errorMessage);
    }
});

// ==========================================
// UPDATE GAME (PUT)
// ==========================================
const formUpdate = document.getElementById('update-form-game');

formUpdate.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updateId = document.getElementById("update-id").value;

    if (!updateId) {
        alert("Please enter the ID of the game you wish to update.");
        return;
    }

    const gameUpdate = {
        title: document.getElementById("new-title").value,
        genre: document.getElementById("new-genre").value,
        platform: document.getElementById("new-platform").value,
        releaseYear: Number(document.getElementById("new-release-year").value.split('-')[0]),
        rating: document.getElementById("new-rating").value
            ? Number(document.getElementById("new-rating").value)
            : null,
        description: document.getElementById("new-description").value,
        
        // NOVO: Pega a URL da imagem nova (para o update)
        imageUrl: document.getElementById("new-image-url").value || null
    };

    try {
        const response = await fetch(`${API_URL}/${updateId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gameUpdate)
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Game not found. Check if the ID is correct.");
            } else if (response.status === 400) {
                throw new Error("Invalid data. Check the fields filled in.");
            } else {
                throw new Error("Error updating the game on the server.");
            }
        }

        const updatedGame = await response.json();
        console.log("Game updated successfully: ", updatedGame);

        alert("Game updated successfully!");

        formUpdate.reset();
        listingGames();

    } catch (error) {
        console.error("Update error: ", error);
        alert(error.message);
    }
});