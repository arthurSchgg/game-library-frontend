const API_URL = "http://localhost:8085/v1/game-library";

async function listingGames() {
    try {
        const response = await fetch(`${API_URL}`);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const games = await response.json();

        console.log("Loaded Games: ", games);

        const container = document.getElementById("container-games");
        container.innerText = "";

        if (games.length === 0) {
            container.innerText = "No games found";
            return;
        }

        games.forEach(game => {

            const card = document.createElement("div");
            card.classList.add("game-card");

            const title = document.createElement("h3");
            title.innerText = game.title;

            const genre = document.createElement("p");
            genre.innerText = `Gênero: ${game.genre}`;

            const platform = document.createElement("p");
            platform.innerText = `Plataforma: ${game.platform}`;

            const releaseYear = document.createElement("p");
            releaseYear.innerText = `Lançamento: ${game.releaseYear}`;

            const rating = document.createElement("p");
            rating.innerText = `Avaliação: ${game.rating ?? "—"}`;

            const description = document.createElement("p");
            description.innerText = game.description;

            card.append(title, genre, platform, releaseYear, rating, description);
            container.appendChild(card);
        });
    } catch (erro) {
        console.error("Error listing games: ", erro);
        document.getElementById("container-games").innerText =
            "Error loading games";
    }
}

listingGames();