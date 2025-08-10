// Gallery JavaScript for Alentejano on Two Wheels
document.addEventListener("DOMContentLoaded", () => {
  console.log("Loading gallery page...");
  initGallery();
});

// Initialize gallery functionality
function initGallery() {
  loadGalleryPhotos();
  setupFilterButtons();
  setupLightbox();
}

// Sample gallery data - in a real app, this would come from a JSON file
const galleryPhotos = [
  {
    id: 1,
    title: "Évora Countryside",
    description: "Beautiful rolling hills of Alentejo",
    category: "landscape",
    image: "img/trips/evora.jpg",
    date: "2025-03-15"
  },
  {
    id: 2,
    title: "Mountain Road",
    description: "Winding mountain pass with stunning views",
    category: "road",
    image: "img/trips/mountain.jpg",
    date: "2025-02-20"
  },
  {
    id: 3,
    title: "My Motorcycle",
    description: "Trusty steed ready for adventure",
    category: "motorcycle",
    image: "img/trips/bike.jpg",
    date: "2025-01-10"
  },
  {
    id: 4,
    title: "Lisbon Streets",
    description: "Historic streets of Portugal's capital",
    category: "cities",
    image: "img/trips/lisbon.jpg",
    date: "2024-12-15"
  },
  {
    id: 5,
    title: "Coastal Cliffs",
    description: "Dramatic Atlantic coastline",
    category: "landscape",
    image: "img/trips/coast.jpg",
    date: "2024-11-30"
  },
  {
    id: 6,
    title: "Country Road",
    description: "Peaceful rural route through vineyards",
    category: "road",
    image: "img/trips/country.jpg",
    date: "2024-10-25"
  }
];

// Load gallery photos
function loadGalleryPhotos(filter = 'all') {
  const container = document.getElementById('gallery-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const filteredPhotos = filter === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter(photo => photo.category === filter);
  
  if (filteredPhotos.length === 0) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center;">
        <h3>No photos found</h3>
        <p>Try selecting a different category or check back later.</p>
      </div>
    `;
    return;
  }
  
  // Show only first 8 photos initially
  const initialPhotos = filteredPhotos.slice(0, 8);
  displayPhotos(initialPhotos, container);
  
  // Show load more button if there are more photos
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    if (filteredPhotos.length > 8) {
      loadMoreBtn.style.display = 'inline-block';
      loadMoreBtn.onclick = () => loadMorePhotos(filteredPhotos, container);
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }
}

// Display photos in the gallery
function displayPhotos(photos, container) {
  photos.forEach((photo, index) => {
    const galleryItem = createGalleryItem(photo, index);
    container.appendChild(galleryItem);
    
    // Add staggered animation
    setTimeout(() => {
      galleryItem.classList.add('fade-in-up');
    }, index * 100);
  });
}

// Create a gallery item
function createGalleryItem(photo, index) {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.dataset.category = photo.category;
  
  // Add fallback image if photo doesn't exist
  const imageUrl = photo.image || `https://via.placeholder.com/300x300/2a2a2a/00d4ff?text=${encodeURIComponent(photo.title)}`;
  
  item.innerHTML = `
    <img src="${imageUrl}" alt="${photo.title}" onerror="this.src='https://via.placeholder.com/300x300/2a2a2a/00d4ff?text=${encodeURIComponent(photo.title)}'">
    <div class="gallery-overlay">
      <h3>${photo.title}</h3>
    </div>
  `;
  
  // Add click event to open lightbox
  item.addEventListener('click', () => {
    openLightbox(photo);
  });
  
  return item;
}

// Load more photos
function loadMorePhotos(allPhotos, container) {
  const currentCount = container.children.length;
  const remainingPhotos = allPhotos.slice(currentCount, currentCount + 8);
  
  displayPhotos(remainingPhotos, container);
  
  // Hide load more button if all photos are shown
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn && currentCount + remainingPhotos.length >= allPhotos.length) {
    loadMoreBtn.style.display = 'none';
  }
}

// Setup filter buttons
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value and load photos
      const filter = button.dataset.filter;
      loadGalleryPhotos(filter);
    });
  });
}

// Setup lightbox functionality
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.querySelector('.close-lightbox');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  
  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

// Open lightbox with photo
function openLightbox(photo) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  
  if (lightbox && lightboxImg && lightboxTitle && lightboxDescription) {
    // Add fallback image if photo doesn't exist
    const imageUrl = photo.image || `https://via.placeholder.com/600x400/2a2a2a/00d4ff?text=${encodeURIComponent(photo.title)}`;
    
    lightboxImg.src = imageUrl;
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDescription.textContent = photo.description;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

// Close lightbox
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
}

// Add CSS for lightbox
function addLightboxStyles() {
  if (!document.getElementById('lightbox-styles')) {
    const style = document.createElement('style');
    style.id = 'lightbox-styles';
    style.textContent = `
      .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
      }
      
      .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
      }
      
      .lightbox-content img {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 12px;
        margin-bottom: 1rem;
      }
      
      .lightbox-caption {
        color: white;
        text-align: center;
      }
      
      .lightbox-caption h3 {
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
      }
      
      .lightbox-caption p {
        color: #b0b0b0;
        font-size: 1rem;
      }
      
      .close-lightbox {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s ease;
      }
      
      .close-lightbox:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      @media (max-width: 768px) {
        .lightbox {
          padding: 1rem;
        }
        
        .lightbox-content img {
          max-height: 50vh;
        }
        
        .lightbox-caption h3 {
          font-size: 1.2rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize lightbox styles
addLightboxStyles(); 