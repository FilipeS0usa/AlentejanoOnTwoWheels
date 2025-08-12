// Main JavaScript for Alentejano on Two Wheels
document.addEventListener("DOMContentLoaded", () => {
  console.log("Welcome to Alentejano on Two Wheels!");

  // Initialize the home page
  initHomePage();

  // Add smooth scrolling for anchor links
  addSmoothScrolling();

  // Add intersection observer for animations
  addScrollAnimations();
});

// Initialize home page functionality
function initHomePage() {
  loadLatestTrips();
  updateStats();
  addCardHoverEffects();
}

// Load latest trips for the home page
async function loadLatestTrips() {
  try {
    console.log("HELLO");
    const response = await fetch("data/trips.json");
    const trips = await response.json();

    const latestTripsContainer = document.getElementById("latest-trips");
    if (!latestTripsContainer) return;

    // Clear loading state
    latestTripsContainer.innerHTML = "";

    // Show only the latest 3 trips
    const latestTrips = trips
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    latestTrips.forEach((trip, index) => {
      const tripCard = createTripCard(trip, index);
      latestTripsContainer.appendChild(tripCard);
    });

    // Add animation delay for each card
    const cards = latestTripsContainer.querySelectorAll(".trip-card");
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
      card.classList.add("fade-in-up");
    });
  } catch (error) {
    console.error("Error loading latest trips:", error);
    const container = document.getElementById("latest-trips");
    if (container) {
      container.innerHTML = `
        <div class="card">
          <h3>No trips available</h3>
          <p>Check back soon for new adventures!</p>
        </div>
      `;
    }
  }
}

// Create a trip card element
function createTripCard(trip, index) {
  const card = document.createElement("div");
  card.className = "trip-card";

  // Add fallback image if trip image doesn't exist
  const imageUrl = trip.image || `img/image_default.png`;

  // Format the date
  const formattedDate = formatDate(trip.date);

  // Create category badge
  const categoryBadge = trip.category
    ? `<span class="category-badge">${trip.category}</span>`
    : "";

  // Add distance and duration info
  const tripInfo = [];
  if (trip.distance) tripInfo.push(`${trip.distance} km`);
  if (trip.duration) {
    if (trip.duration === "1") {
      tripInfo.push(`${trip.duration} dia`); // singular
    } else {
      tripInfo.push(`${trip.duration} dias`); // plural
    }
  }

  card.innerHTML = `
    <img src="${imageUrl}" alt="${trip.title}" onerror="this.src='img/error.png'">
    <div class="trip-card-content">
      ${categoryBadge}
      <h3>${trip.title}</h3>
      <p>${trip.description}</p>
      <div class="card-meta">
        <span>${formattedDate}</span>
        ${tripInfo.length > 0 ? `<span>${tripInfo.join(" • ")}</span>` : ""}
      </div>
      <a href="${trip.link}" class="btn">Ler mais</a>
    </div>
  `;

  return card;
}

// Update journey statistics
async function updateStats() {
  try {
    const response = await fetch("data/trips.json");
    const trips = await response.json();

    // Calculate stats from actual data
    const stats = {
      totalTrips: trips.length,
      totalDistance: trips.reduce(
        (sum, trip) => sum + (parseInt(trip.distance) || 0),
        0,
      ),
    };

    // Update stats with animation
    animateCounter("total-trips", stats.totalTrips);
    animateCounter("total-distance", stats.totalDistance);
  } catch (error) {
    console.error("Error loading stats:", error);
    // Fallback to default stats
    const stats = {
      totalTrips: 404,
      totalDistance: 404,
    };

    animateCounter("total-trips", stats.totalTrips);
    animateCounter("total-distance", stats.totalDistance);
  }
}

// Animate counter numbers
function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;

  let currentValue = 0;
  const increment = targetValue / 50; // 50 steps for smooth animation
  const duration = 1000; // 1 second
  const stepTime = duration / 50;

  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(timer);
    }
    element.textContent = Math.floor(currentValue);
  }, stepTime);
}

// Add smooth scrolling for anchor links
function addSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Add scroll animations using Intersection Observer
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document.querySelectorAll(".card, .section").forEach((el) => {
    observer.observe(el);
  });
}

// Add hover effects for cards
function addCardHoverEffects() {
  document.querySelectorAll(".card, .trip-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// Utility function to format dates
function formatDate(dateString) {
  if (!dateString) return "Date TBD";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
}

// Add loading states
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="loading">Loading...</div>';
  }
}

function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element && element.querySelector(".loading")) {
    element.querySelector(".loading").remove();
  }
}
