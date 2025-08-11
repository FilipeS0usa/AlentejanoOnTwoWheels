// Trips JavaScript for Alentejano on Two Wheels
document.addEventListener("DOMContentLoaded", () => {
  console.log("Loading trips page...");
  loadTrips();
  addSearchAndFilter();
});

// Load all trips
async function loadTrips() {
  try {
    showLoading("trips-container");
    
    const response = await fetch("data/trips.json");
    const trips = await response.json();
    
    hideLoading("trips-container");
    
    if (trips.length === 0) {
      showNoTripsMessage();
      return;
    }
    
    displayTrips(trips);
    
  } catch (error) {
    console.error("Error loading trips:", error);
    showErrorMessage();
  }
}

// Display trips in the container
function displayTrips(trips) {
  const container = document.getElementById("trips-container");
  if (!container) return;
  
  // Clear container
  container.innerHTML = "";
  
  // Create trip cards with staggered animation
  trips.forEach((trip, index) => {
    const tripCard = createTripCard(trip, index);
    container.appendChild(tripCard);
    
    // Add staggered animation only once
    setTimeout(() => {
      if (tripCard.parentNode) { // Check if card is still in DOM
        tripCard.classList.add('fade-in-up');
      }
    }, index * 100); // Reduced delay to prevent flickering
  });
}

// Create a trip card element
function createTripCard(trip, index) {
  const card = document.createElement("div");
  card.className = "trip-card";
  
  // Add fallback image if trip image doesn't exist
  const imageUrl = trip.image || `https://via.placeholder.com/400x200/2a2a2a/00d4ff?text=${encodeURIComponent(trip.title)}`;
  
  // Format the date
  const formattedDate = formatDate(trip.date);
  
  // Create category badge
  const categoryBadge = trip.category ? `<span class="category-badge">${trip.category}</span>` : '';
  
  // Add distance and duration info
  const tripInfo = [];
  if (trip.distance) tripInfo.push(`${trip.distance} km`);
  if (trip.duration) tripInfo.push(trip.duration);
  
  card.innerHTML = `
    <img src="${imageUrl}" alt="${trip.title}" onerror="this.src='https://via.placeholder.com/400x200/2a2a2a/00d4ff?text=${encodeURIComponent(trip.title)}'">
    <div class="trip-card-content">
      ${categoryBadge}
      <h3>${trip.title}</h3>
      <p>${trip.description}</p>
      <div class="card-meta">
        <span>${formattedDate}</span>
        ${tripInfo.length > 0 ? `<span>${tripInfo.join(' • ')}</span>` : ''}
      </div>
      <a href="${trip.link}" class="btn">Read More</a>
    </div>
  `;
  
  // Add click event to the entire card
  card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn')) {
      window.location.href = trip.link;
    }
  });
  
  return card;
}

// Add search and filter functionality
function addSearchAndFilter() {
  // Create search bar above trips
  const tripsSection = document.querySelector('.section');
  if (!tripsSection) return;
  
  const searchContainer = document.createElement('div');
  searchContainer.style.cssText = 'margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; align-items: center;';
  
  searchContainer.innerHTML = `
    <input type="text" id="search-trips" placeholder="Search trips..." class="search-input" style="
      padding: 12px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--card-bg);
      color: var(--text-primary);
      font-size: 1rem;
      min-width: 250px;
    ">
    <select id="filter-trips" class="filter-select" style="
      padding: 12px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--card-bg);
      color: var(--text-primary);
      font-size: 1rem;
      cursor: pointer;
    ">
      <option value="all">All Trips</option>
      <option value="recent">Recent</option>
      <option value="oldest">Oldest</option>
      <option value="alphabetical">Alphabetical</option>
    </select>
    <select id="category-filter" class="filter-select" style="
      padding: 12px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--card-bg);
      color: var(--text-primary);
      font-size: 1rem;
      cursor: pointer;
    ">
      <option value="all">All Categories</option>
    </select>
  `;
  
  tripsSection.insertBefore(searchContainer, tripsSection.firstChild);
  
  // Populate category filter
  populateCategoryFilter();
  
  // Add event listeners
  const searchInput = document.getElementById('search-trips');
  const filterSelect = document.getElementById('filter-trips');
  const categoryFilter = document.getElementById('category-filter');
  
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  if (filterSelect) {
    filterSelect.addEventListener('change', handleFilter);
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryFilter);
  }
}

// Populate category filter with available categories
async function populateCategoryFilter() {
  try {
    const response = await fetch("data/trips.json");
    const trips = await response.json();
    
    const categories = [...new Set(trips.map(trip => trip.category).filter(Boolean))];
    const categorySelect = document.getElementById('category-filter');
    
    if (categorySelect && categories.length > 0) {
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error populating categories:", error);
  }
}

// Handle search functionality
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const tripCards = document.querySelectorAll('.trip-card');
  
  tripCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = 'block';
      // Remove animation class to prevent flickering
      card.classList.remove('fade-in-up');
      // Re-add animation smoothly
      setTimeout(() => {
        if (card.parentNode) {
          card.classList.add('fade-in-up');
        }
      }, 50);
    } else {
      card.style.display = 'none';
    }
  });
}

// Handle filter functionality
async function handleFilter(e) {
  const filterValue = e.target.value;
  
  try {
    const response = await fetch("data/trips.json");
    const trips = await response.json();
    
    let filteredTrips = [...trips];
    
    switch (filterValue) {
      case 'recent':
        filteredTrips.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filteredTrips.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'alphabetical':
        filteredTrips.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order
        break;
    }
    
    // Clear search input when filtering
    const searchInput = document.getElementById('search-trips');
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Reset category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.value = 'all';
    }
    
    displayTrips(filteredTrips);
    
  } catch (error) {
    console.error("Error filtering trips:", error);
  }
}

// Handle category filter
async function handleCategoryFilter(e) {
  const categoryValue = e.target.value;
  
  try {
    const response = await fetch("data/trips.json");
    const trips = await response.json();
    
    let filteredTrips = trips;
    
    if (categoryValue !== 'all') {
      filteredTrips = trips.filter(trip => trip.category === categoryValue);
    }
    
    // Clear search input when filtering
    const searchInput = document.getElementById('search-trips');
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Reset sort filter
    const filterSelect = document.getElementById('filter-trips');
    if (filterSelect) {
      filterSelect.value = 'all';
    }
    
    displayTrips(filteredTrips);
    
  } catch (error) {
    console.error("Error filtering by category:", error);
  }
}

// Show no trips message
function showNoTripsMessage() {
  const container = document.getElementById("trips-container");
  if (container) {
    container.innerHTML = `
      <div class="card" style="text-align: center; grid-column: 1 / -1;">
        <h3>No trips available yet</h3>
        <p>Check back soon for new motorcycle adventures!</p>
        <a href="index.html" class="btn">Back to Home</a>
      </div>
    `;
  }
}

// Show error message
function showErrorMessage() {
  const container = document.getElementById("trips-container");
  if (container) {
    container.innerHTML = `
      <div class="card" style="text-align: center; grid-column: 1 / -1; border-color: #ff6b6b;">
        <h3>Error loading trips</h3>
        <p>Sorry, there was an error loading the trips. Please try again later.</p>
        <button onclick="location.reload()" class="btn">Retry</button>
      </div>
    `;
  }
}

// Show loading state
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="loading">Loading trips...</div>';
  }
}

// Hide loading state
function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element && element.querySelector('.loading')) {
    element.querySelector('.loading').remove();
  }
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'Date TBD';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

// Add hover effects for trip cards
function addTripCardHoverEffects() {
  document.querySelectorAll('.trip-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 20px 40px var(--shadow)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
  });
}
