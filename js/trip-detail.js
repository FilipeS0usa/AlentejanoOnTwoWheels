// Trip Detail Page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  console.log("Trip detail page loaded");
  
  // Get trip ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');
  
  if (tripId) {
    loadTripDetails(tripId);
    loadRelatedTrips(tripId);
  } else {
    // No trip ID provided, show error or redirect
    showTripError("No trip specified");
  }
  
  // Add smooth scrolling for anchor links
  addSmoothScrolling();
  
  // Add intersection observer for animations
  addScrollAnimations();
});

// Load trip details based on ID
async function loadTripDetails(tripId) {
  try {
    const response = await fetch("data/trips.json");
    const trips = await response.json();
    
    const trip = trips.find(t => t.id === tripId);
    
    if (trip) {
      displayTripDetails(trip);
      // Update page title
      document.title = `${trip.title} - Alentejano on Two Wheels`;
    } else {
      showTripError("Trip not found");
    }
    
  } catch (error) {
    console.error("Error loading trip details:", error);
    showTripError("Failed to load trip details");
  }
}

// Display trip details in the UI
function displayTripDetails(trip) {
  // Update trip header
  document.getElementById('trip-category').textContent = trip.category || 'Adventure';
  document.getElementById('trip-date').textContent = formatDate(trip.date);
  document.getElementById('trip-title').textContent = trip.title;
  document.getElementById('trip-description').textContent = trip.description;
  
  // Update trip stats
  if (trip.distance) {
    document.getElementById('trip-distance').textContent = trip.distance;
  }
  if (trip.duration) {
    document.getElementById('trip-duration').textContent = trip.duration;
  }
  
  // Update cover image
  const coverImage = document.getElementById('trip-cover-image');
  if (trip.image) {
    coverImage.src = trip.image;
    coverImage.alt = trip.title;
  }
  
  // Display trip photos
  displayTripPhotos(trip.photos || []);
  
  // Display trip map and route information from GPX file
  if (trip.gpxFile) {
    loadAndDisplayGPXRoute(trip.gpxFile);
  } else {
    displayNoRouteMessage();
  }
  
  // Add fade-in animation
  setTimeout(() => {
    document.querySelector('.trip-header').classList.add('fade-in-up');
  }, 100);
}

// Display trip photos
function displayTripPhotos(photos) {
  const photosContainer = document.getElementById('trip-photos');
  
  if (photos.length === 0) {
    photosContainer.innerHTML = `
      <div class="card text-center">
        <h3>No photos available</h3>
        <p>Photos for this trip will be added soon!</p>
      </div>
    `;
    return;
  }
  
  photosContainer.innerHTML = '';
  
  // Create a grid of photos
  const photosGrid = document.createElement('div');
  photosGrid.className = 'trip-photos-grid';
  photosGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1rem;';
  
  photos.forEach((photo, index) => {
    const photoElement = createPhotoElement(photo, index);
    photosGrid.appendChild(photoElement);
  });
  
  photosContainer.appendChild(photosGrid);
}

// Create a photo element
function createPhotoElement(photo, index) {
  const photoDiv = document.createElement('div');
  photoDiv.className = 'trip-photo-item';
  photoDiv.style.cssText = 'position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px var(--shadow); transition: transform 0.3s ease;';
  
  // Add fallback image if photo doesn't exist
  const imageUrl = photo.src || `https://via.placeholder.com/400x300/2a2a2a/00d4ff?text=${encodeURIComponent(photo.alt || 'Trip Photo')}`;
  
  photoDiv.innerHTML = `
    <img src="${imageUrl}" alt="${photo.alt || 'Trip Photo'}" 
         onerror="this.src='https://via.placeholder.com/400x300/2a2a2a/00d4ff?text=${encodeURIComponent(photo.alt || 'Trip Photo')}'"
         style="width: 100%; height: 250px; object-fit: cover; display: block;">
    <div class="photo-overlay" style="
      position: absolute; bottom: 0; left: 0; right: 0; 
      background: linear-gradient(transparent, rgba(0,0,0,0.8)); 
      color: white; padding: 1rem; transform: translateY(100%); 
      transition: transform 0.3s ease;">
      <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${photo.alt || 'Trip Photo'}</h4>
      <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${photo.caption || ''}</p>
    </div>
  `;
  
  // Add hover effects
  photoDiv.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
    this.querySelector('.photo-overlay').style.transform = 'translateY(0)';
  });
  
  photoDiv.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.querySelector('.photo-overlay').style.transform = 'translateY(100%)';
  });
  
  // Add click to open in lightbox
  photoDiv.addEventListener('click', () => {
    openPhotoLightbox(photo);
  });
  
  return photoDiv;
}

// Display trip map and route information from GPX file
async function loadAndDisplayGPXRoute(gpxFile) {
  const mapContainer = document.getElementById('trip-map');
  const routeDetailsContainer = document.getElementById('route-details');
  
  try {
    const response = await fetch(gpxFile);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const gpxContent = await response.text();
    
    // Show simple map placeholder
    mapContainer.innerHTML = `
      <div class="card text-center">
        <h3>🗺️ GPX Route Loaded</h3>
        <p>Route file loaded successfully. Use the buttons below to open in maps or download the file.</p>
      </div>
    `;
    
    // Setup the three buttons
    setupMapControls(gpxFile);
    
    // Show success message
    showMapMessage('GPX route loaded successfully!', 'success');
    
  } catch (error) {
    console.error("Error loading GPX file:", error);
    displayNoRouteMessage();
    showMapMessage(`Error loading GPX file: ${error.message}`, 'error');
  }
}



// Display no route message
function displayNoRouteMessage() {
  const mapContainer = document.getElementById('trip-map');
  const routeDetailsContainer = document.getElementById('route-details');
  
  mapContainer.innerHTML = `
    <div class="card text-center">
      <h3>No GPX Route Available</h3>
      <p>This trip doesn't have a GPX route file yet.</p>
    </div>
  `;
  
  routeDetailsContainer.innerHTML = `
    <p>GPX route files will be added for trips that have recorded routes.</p>
  `;
}

// Setup map control buttons
function setupMapControls(gpxFile) {
  const gmapsBtn = document.getElementById('open-gmaps');
  const appleMapsBtn = document.getElementById('open-apple-maps');
  const gpxBtn = document.getElementById('download-gpx');
  
  // Google Maps button - open Google Maps
  if (gmapsBtn) {
    gmapsBtn.addEventListener('click', () => {
      try {
        // Open Google Maps - user can import their GPX file there
        window.open('https://www.google.com/maps', '_blank');
        showMapMessage('Google Maps opened. You can import your GPX file there.', 'info');
      } catch (error) {
        console.error("Error opening Google Maps:", error);
        showMapMessage('Unable to open Google Maps', 'error');
      }
    });
  }
  
  // Apple Maps button - open Apple Maps
  if (appleMapsBtn) {
    appleMapsBtn.addEventListener('click', () => {
      try {
        // Open Apple Maps - user can import their GPX file there
        window.open('https://maps.apple.com', '_blank');
        showMapMessage('Apple Maps opened. You can import your GPX file there.', 'info');
      } catch (error) {
        console.error("Error opening Apple Maps:", error);
        showMapMessage('Unable to open Apple Maps', 'error');
      }
    });
  }
  
  // GPX download button - download the actual GPX file
  if (gpxBtn) {
    gpxBtn.addEventListener('click', async () => {
      try {
        const response = await fetch(gpxFile);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const gpxContent = await response.text();
        
        // Get filename from path
        const filename = gpxFile.split('/').pop();
        
        // Create and download file
        const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        showMapMessage('GPX route file downloaded successfully!', 'success');
      } catch (error) {
        console.error("Error downloading GPX file:", error);
        showMapMessage('Unable to download GPX file', 'error');
      }
    });
  }
}



// Show map-related messages
function showMapMessage(message, type = 'info') {
  // Remove existing message
  const existingMessage = document.querySelector('.map-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `map-message ${type}`;
  messageDiv.style.cssText = `
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
    ${type === 'error' ? 'background: rgba(255, 107, 107, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 107, 107, 0.3);' : ''}
    ${type === 'success' ? 'background: rgba(76, 175, 80, 0.1); color: #4caf50; border: 1px solid rgba(76, 175, 80, 0.3);' : ''}
    ${type === 'info' ? 'background: rgba(0, 212, 255, 0.1); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.3);' : ''}
  `;
  messageDiv.textContent = message;
  
  // Insert after the map controls
  const mapControls = document.querySelector('.map-controls');
  if (mapControls) {
    mapControls.parentNode.insertBefore(messageDiv, mapControls.nextSibling);
  }
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// Open photo lightbox
function openPhotoLightbox(photo) {
  // Create a simple lightbox
  const lightbox = document.createElement('div');
  lightbox.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.9); display: flex; align-items: center; 
    justify-content: center; z-index: 1000; padding: 2rem;
  `;
  
  const imageUrl = photo.src || `https://via.placeholder.com/800x600/2a2a2a/00d4ff?text=${encodeURIComponent(photo.alt || 'Trip Photo')}`;
  
  lightbox.innerHTML = `
    <div style="position: relative; max-width: 90%; max-height: 90%; text-align: center;">
      <img src="${imageUrl}" alt="${photo.alt || 'Trip Photo'}" 
           onerror="this.src='https://via.placeholder.com/800x600/2a2a2a/00d4ff?text=${encodeURIComponent(photo.alt || 'Trip Photo')}'"
           style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 12px;">
      <div style="color: white; margin-top: 1rem;">
        <h3 style="margin-bottom: 0.5rem;">${photo.alt || 'Trip Photo'}</h3>
        <p style="color: #b0b0b0;">${photo.caption || ''}</p>
      </div>
      <button class="close-lightbox" style="
        position: absolute; top: -40px; right: 0; color: white; 
        font-size: 2rem; cursor: pointer; background: none; border: none; 
        padding: 0; width: 40px; height: 40px; display: flex; 
        align-items: center; justify-content: center; border-radius: 50%; 
        transition: background-color 0.3s ease;">&times;</button>
    </div>
  `;
  
  // Close lightbox functionality
  const closeBtn = lightbox.querySelector('.close-lightbox');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(lightbox);
    document.body.style.overflow = 'auto';
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      document.body.removeChild(lightbox);
      document.body.style.overflow = 'auto';
    }
  });
  
  // Close with Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      document.body.removeChild(lightbox);
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  
  // Prevent background scrolling
  document.body.style.overflow = 'hidden';
  document.body.appendChild(lightbox);
}

// Load related trips (excluding current trip)
async function loadRelatedTrips(currentTripId) {
  try {
    const response = await fetch("data/trips.json");
    const trips = await response.json();
    
    const relatedTrips = trips.filter(trip => trip.id !== currentTripId).slice(0, 3);
    
    displayRelatedTrips(relatedTrips);
    
  } catch (error) {
    console.error("Error loading related trips:", error);
    const container = document.getElementById("related-trips");
    if (container) {
      container.innerHTML = '<p>Unable to load related trips.</p>';
    }
  }
}

// Display related trips
function displayRelatedTrips(trips) {
  const container = document.getElementById("related-trips");
  
  if (trips.length === 0) {
    container.innerHTML = '<p>No other trips available.</p>';
    return;
  }
  
  container.innerHTML = '';
  
  trips.forEach(trip => {
    const tripCard = createRelatedTripCard(trip);
    container.appendChild(tripCard);
  });
}

// Create a related trip card
function createRelatedTripCard(trip) {
  const card = document.createElement("div");
  card.className = "trip-card";
  
  const imageUrl = trip.image || `https://via.placeholder.com/300x200/2a2a2a/00d4ff?text=${encodeURIComponent(trip.title)}`;
  
  card.innerHTML = `
    <img src="${imageUrl}" alt="${trip.title}" onerror="this.src='https://via.placeholder.com/300x200/2a2a2a/00d4ff?text=${encodeURIComponent(trip.title)}'">
    <div class="trip-card-content">
      <span class="category-badge">${trip.category || 'Adventure'}</span>
      <h3>${trip.title}</h3>
      <p>${trip.description.substring(0, 100)}${trip.description.length > 100 ? '...' : ''}</p>
      <div class="card-meta">
        <span>${formatDate(trip.date)}</span>
        ${trip.distance ? `<span>${trip.distance} km</span>` : ''}
      </div>
      <a href="${trip.link}" class="btn">Read More</a>
    </div>
  `;
  
  return card;
}

// Show trip error
function showTripError(message) {
  const main = document.querySelector('main');
  main.innerHTML = `
    <section class="section">
      <div class="card text-center">
        <h2>Oops!</h2>
        <p>${message}</p>
        <a href="trips.html" class="btn">Back to Trips</a>
      </div>
    </section>
  `;
}

// Add smooth scrolling for anchor links
function addSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Add scroll animations using Intersection Observer
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all cards and sections
  document.querySelectorAll('.card, .section').forEach(el => {
    observer.observe(el);
  });
}

// Utility function to format dates
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