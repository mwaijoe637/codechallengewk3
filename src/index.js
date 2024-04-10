document.addEventListener("DOMContentLoaded", function () {
    const baseURL = "http://localhost:3000";

    // Function to make GET request to fetch movie details
    function fetchMovieDetails(movieId) {
        fetch(`${baseURL}/films/${movieId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(movie => {
                // Populate movie details into HTML elements
                document.getElementById("title").textContent = movie.title;
                document.getElementById("runtime").textContent = `${movie.runtime} minutes`;
                document.getElementById("showtime").textContent = movie.showtime;

                // Calculate available tickets
                const availableTickets = movie.capacity - movie.tickets_sold;
                document.getElementById("ticket-num").textContent = `${availableTickets} remaining tickets`;

                
                document.getElementById("poster").src = movie.poster;
                document.getElementById("poster").alt = movie.title;

                // Update movie description
                document.getElementById("film-info").textContent = movie.description;

                // Update Buy Ticket button
                const buyTicketButton = document.getElementById("buy-ticket");
                if (availableTickets > 0) {
                    buyTicketButton.disabled = false;
                    buyTicketButton.textContent = "Buy Ticket";
                } else {
                    buyTicketButton.disabled = true;
                    buyTicketButton.textContent = "Sold Out";
                }

                // Store selected movie ID for buying tickets
                buyTicketButton.dataset.movieId = movieId;
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    //  GET request to fetch all movies
    function fetchAllMovies() {
        fetch(`${baseURL}/films`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(movies => {
                // Remove placeholder li element
                const placeholderLi = document.querySelector("#films .film.item");
                if (placeholderLi) {
                    placeholderLi.remove();
                }


                const filmsList = document.getElementById("films");
                movies.forEach(movie => {
                    const listItem = document.createElement("li");
                    listItem.classList.add("film", "item");
                    listItem.textContent = movie.title;
                    listItem.addEventListener("click", function () {

                        fetchMovieDetails(movie.id);
                    });
                    filmsList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching movies:', error));
    }

    // Add event listener to "Buy Ticket" button
    document.getElementById("buy-ticket").addEventListener("click", function () {
        const buyTicketButton = document.getElementById("buy-ticket");
        const movieId = buyTicketButton.dataset.movieId;
        const availableTicketsElement = document.getElementById("ticket-num");
        const availableTickets = parseInt(availableTicketsElement.textContent);

        if (availableTickets > 0) {
            // Decrease available tickets 
            const newAvailableTickets = availableTickets - 1;
            availableTicketsElement.textContent = `${newAvailableTickets} remaining tickets`;

            // Record ticket purchase
            recordTicketPurchase(movieId);
        } else {
            alert("Sorry, this showing is sold out!");
        }
    });


    fetchAllMovies();
});




document.addEventListener("DOMContentLoaded", function () {
    function deleteFilm() {
        const filmsListElement = document.getElementById("films");
        filmsListElement.addEventListener("click", function (event) {
            if (event.target.classList.contains("delete-button")) {
                const filmId = event.target.getAttribute("data-id");
                const filmItem = event.target.closest(".film.item");
                filmItem.remove();

                fetch(`http://localhost:3000/films/${filmId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then(deletedFilm => {
                        console.log("Film deleted successfully:", deletedFilm);
                    })
                    .catch(error => {
                        console.error("Error deleting film:", error);
                    });
            }
        });
    }

    deleteFilm();
});






document.addEventListener("DOMContentLoaded", function () {
    function indicateSoldOut() {
        const filmsList = document.getElementById("films");
        const filmItems = filmsList.querySelectorAll(".film.item");

        filmItems.forEach(item => {
            const ticketNumElement = item.querySelector("#ticket-num");
            const availableTickets = parseInt(ticketNumElement.textContent);

            if (availableTickets === 0) {
                const buyButton = item.querySelector("#buy-ticket");
                buyButton.textContent = "Sold Out";
                item.classList.add("sold-out");
            }
        });
    }

    indicateSoldOut();
});

const availableTickets = 0;

const buyButton = document.getElementById("buy-ticket");
const filmItem = document.querySelector("#films .film.item");

if (availableTickets === 0) {
    buyButton.textContent = "Sold Out";
    filmItem.classList.add("sold-out");
}