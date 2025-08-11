# Alentejano on Two Wheels 🏍️

A modern, responsive motorcycle travel blog website showcasing adventures across Portugal and beyond. Built with vanilla HTML, CSS, and JavaScript for a fast, lightweight experience.

## ✨ Features

- **Modern Dark Theme**: Sleek, eye-friendly dark design with cyan accents
- **Responsive Design**: Optimized for all devices and screen sizes
- **Interactive Trip Cards**: Beautiful cards displaying trip information with hover effects
- **Advanced Filtering**: Search, sort, and filter trips by category, date, and more
- **Dynamic Statistics**: Real-time journey statistics calculated from trip data
- **Smooth Animations**: Elegant fade-in animations and smooth scrolling
- **Category System**: Organized trip categories (Countryside, Coastal, Mountains, Wine Country)
- **Trip Detail Pages**: Individual pages for each adventure with highlights and related trips

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Local web server (for development)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/alentejanoon2wheels.git
   cd alentejanoon2wheels
   ```

2. Start a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

## 📁 Project Structure

```
alentejanoon2wheels/
├── css/
│   └── style.css          # Main stylesheet with dark theme
├── data/
│   └── trips.json         # Trip data in JSON format
├── img/
│   ├── logo.png           # Website logo
│   └── trips/             # Trip images directory
├── js/
│   ├── main.js            # Home page functionality
│   ├── trips.js           # Trips page with filtering
│   ├── trip-detail.js     # Individual trip page logic
│   └── gallery.js         # Photo gallery functionality
├── index.html             # Home page
├── trips.html             # Trips listing page
├── trip-template.html     # Individual trip template
├── gallery.html           # Photo gallery page
└── README.md              # This file
```

## 🗺️ Trip Data Structure

Trips are stored in `data/trips.json` with the following structure:

```json
{
  "id": "unique-trip-id",
  "title": "Trip Title",
  "date": "YYYY-MM-DD",
  "image": "path/to/image.jpg",
  "description": "Trip description",
  "category": "Category Name",
  "distance": "180",
  "duration": "1 day",
  "link": "trip-template.html?id=trip-id",
  "highlights": ["Highlight 1", "Highlight 2"]
}
```

## 🎨 Customization

### Adding New Trips
1. Add trip data to `data/trips.json`
2. Place trip images in `img/trips/`
3. Update the trip link to point to `trip-template.html?id=your-trip-id`

### Styling
- Modify `css/style.css` to change colors, fonts, and layout
- CSS variables are defined at the top for easy theme customization
- Responsive breakpoints are included for mobile optimization

### Categories
Supported trip categories:
- **Countryside**: Rural and agricultural areas
- **Coastal**: Beach and cliff routes
- **Mountains**: Mountain passes and alpine scenery
- **Wine Country**: Vineyard and wine region routes

## 🌟 Key Features Explained

### Dynamic Statistics
The home page displays real-time statistics:
- Total trips count
- Total kilometers ridden
- Estimated photos taken
- Favorite route (most recent)

### Advanced Filtering
The trips page includes:
- **Search**: Text-based search across titles and descriptions
- **Sort**: By date (recent/oldest) or alphabetically
- **Category Filter**: Filter by trip category

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Optimized touch interactions
- Adaptive typography

## 🚧 Future Enhancements

- [ ] Interactive route maps with GPX integration
- [ ] Photo gallery with lightbox and slideshow
- [ ] Trip planning tools and route sharing
- [ ] Weather integration for trip planning
- [ ] Social media sharing
- [ ] Comments and community features
- [ ] Multi-language support (Portuguese/English)

## 🛠️ Technical Details

- **No Framework**: Pure HTML, CSS, and JavaScript
- **Modern CSS**: CSS Grid, Flexbox, CSS Variables, and animations
- **ES6+ JavaScript**: Async/await, arrow functions, modern array methods
- **Performance**: Optimized images, minimal dependencies, fast loading
- **Accessibility**: Semantic HTML, proper contrast ratios, keyboard navigation

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🏍️ About the Rider

This website chronicles motorcycle adventures through Portugal's diverse landscapes - from the rolling plains of Alentejo to the dramatic mountains of the north, and the stunning coastline that stretches along the Atlantic.

Each trip is an opportunity to discover new roads, meet interesting people, and create lasting memories on two wheels.

---

*Made with ❤️ for the open road*
