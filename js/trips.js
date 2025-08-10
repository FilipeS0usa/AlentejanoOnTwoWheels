document.addEventListener("DOMContentLoaded", () => {
  fetch("data/trips.json")
    .then((response) => response.json())
    .then((trips) => {
      const container = document.getElementById("trips-container");
      trips.forEach((trip) => {
        const tripCard = document.createElement("div");
        tripCard.classList.add("trip-card");
        tripCard.innerHTML = `
                    <img src="${trip.image}" alt="${trip.title}">
                    <h2>${trip.title}</h2>
                    <p>${trip.description}</p>
                    <a href="${trip.link}" class="btn">Read more</a>
                `;
        container.appendChild(tripCard);
      });
    })
    .catch((error) => console.error("Error loading trips:", error));
});
