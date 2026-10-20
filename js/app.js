const API_URL = "http://localhost:8085/v1/game-library";

// ==========================================
// FUNÇÃO ÚNICA PARA CRIAR O CARD DO JOGO
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
        image.src = "https://via.placeholder.com/300x150/333/fff?text=Sem+Imagem"; 
    }

    const titleEl = document.createElement("h3");
    titleEl.textContent = game.title;

    const genre = document.createElement("p");
    genre.textContent = `Gênero: ${game.genre}`;

    const platform = document.createElement("p");
    platform.textContent = `Plataforma: ${game.platform}`;

    const releaseYear = document.createElement("p");
    releaseYear.textContent = `Lançamento: ${game.releaseYear}`;

    const rating = document.createElement("p");
    rating.textContent = `Avaliação: ${game.rating ?? "—"}`;

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
            console.error("Erro:", error);
        }
    });

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Delete";
    btnDelete.classList.add("btn-delete");

    btnDelete.addEventListener("click", async () => {
        if (!confirm(`Tem certeza que deseja deletar "${game.title}"?`)) return;

        try {
            const response = await fetch(`${API_URL}/${game.id}`, { method: "DELETE" });
            if (response.ok) {
                alert("Game deleted successfully!");
                listingGames();
            } else {
                alert("Error deleting the game.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    });

    btnContainer.append(btnFavorite, btnDelete);

    card.append(idEl, image, titleEl, genre, platform, releaseYear, rating, description, btnContainer);

    return card;
}

// ==========================================
// LISTAGEM GERAL
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
    } catch (erro) {
        console.error("Error listing games: ", erro);
        document.getElementById("container-games").innerText = "Error loading games";
    }
}

listingGames();

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
        description: document.getElementById('description').value
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
    } catch (erro) {
        console.error("Error: ", erro);
        alert("It was not possible to register the game.");
    }
});

// ==========================================
// BUSCAR POR ID
// ==========================================
const buttonFindId = document.getElementById("search-by-id");

buttonFindId.addEventListener('click', async () => {
    const id = document.getElementById("id").value;

    if (!id) {
        alert("Type a ID");
        return;
    }

    const wrapper = document.getElementById("searching-game-id");

    try {
        wrapper.replaceChildren();
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`Jogo não encontrado. Status: ${response.status}`);
        }

        const game = await response.json();
        console.log("Game found: ", game);

        const card = createGameCard(game);
        wrapper.appendChild(card);

    } catch (erro) {
        console.error("Error finding game: ", erro);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Game not found or server error.";
        errorMessage.style.color = "#ff5252";
        wrapper.replaceChildren(errorMessage);
    }
});

// ==========================================
// BUSCAR POR TÍTULO
// ==========================================
const buttonFindTitle = document.getElementById("search-by-title");

buttonFindTitle.addEventListener('click', async () => {
    const searchTitle = document.getElementById("search-title").value;

    if (!searchTitle) {
        alert("Type a title");
        return;
    }

    const wrapper = document.getElementById("searching-game-title");

    try {
        wrapper.replaceChildren();
        const response = await fetch(`${API_URL}/search?title=${encodeURIComponent(searchTitle)}`);

        if (!response.ok) {
            throw new Error(`Erro no servidor. Status: ${response.status}`);
        }

        const games = await response.json();

        if (games.length === 0) {
            throw new Error("Game not found.");
        }

        const game = games[0];
        console.log("Game found: ", game);

        const card = createGameCard(game);
        wrapper.appendChild(card);

    } catch (erro) {
        console.error("Error finding game: ", erro);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Game not found or server error.";
        errorMessage.style.color = "#ff5252";
        wrapper.replaceChildren(errorMessage);
    }
});

// ==========================================
// ATUALIZAR JOGO (PUT)
// ==========================================
const formUpdate = document.getElementById('update-form-game');

formUpdate.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updateId = document.getElementById("update-id").value;

    if (!updateId) {
        alert("Please, enter the ID of the game you wish to update.");
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
        description: document.getElementById("new-description").value
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
                throw new Error("Invalid Data. Check the fields filled in.");
            } else {
                throw new Error("Error updating the game on the server.");
            }
        }

        const updatedGame = await response.json();
        console.log("Game updated successfully: ", updatedGame);

        alert("Game updated successfully!");

        formUpdate.reset();
        listingGames();

    } catch (erro) {
        console.error("Update error: ", erro);
        alert(erro.message);
    }
});