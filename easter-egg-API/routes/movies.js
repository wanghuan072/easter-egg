import express from 'express';

const router = express.Router();

// Static movies data
const moviesData = [
  {
    id: 1,
    title: "Marvel Phase 5: Every MCU Easter Egg You Missed",
    description: "A comprehensive breakdown of all the hidden references, cameos, and setup for future films in the latest Marvel releases. From subtle background details to post-credit scene connections, discover every easter egg that hints at the future of the MCU.",
    publishDate: "2024-01-12",
    isLatest: true,
    isHome: true,
    label: "MOVIE",
    classify: ["Superhero", "Action", "Sci-Fi", "Adventure"],
    imageUrl: "https://images.unsplash.com/photo-1531259683007-016a943daa8e?w=800&q=80",
    imageAlt: "Marvel Phase 5 Easter Eggs",
    addressBar: "marvel-phase-5-easter-eggs",
    iframeUrl: "https://example.com/movies/marvel-phase-5-details",
    seo: {
      title: "Marvel Phase 5: Every MCU Easter Egg You Missed - Complete Guide",
      description: "Discover all the hidden references, cameos, and setup for future films in Marvel Phase 5. Complete MCU easter egg guide.",
      keywords: "Marvel, MCU, Phase 5, easter eggs, hidden references, superhero movies"
    },
    detailsHtml: "<h2>Marvel Phase 5 Easter Eggs Guide</h2><p>Marvel Phase 5 continues the tradition of hiding easter eggs throughout its films...</p><h3>Hidden References</h3><p>From subtle background details to post-credit scene connections...</p>"
  }
];

// Get all movies
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, classify } = req.query;
    const offset = (page - 1) * limit;
    
    let filteredData = [...moviesData];
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(movie => 
        movie.title.toLowerCase().includes(searchLower) || 
        movie.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by classification
    if (classify) {
      const classifications = classify.split(',');
      filteredData = filteredData.filter(movie => 
        classifications.some(cat => movie.classify.includes(cat))
      );
    }
    
    const total = filteredData.length;
    const paginatedData = filteredData.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch movies'
    });
  }
});

// Get movies for home page
router.get('/home', async (req, res) => {
  try {
    const homeMovies = moviesData.filter(movie => movie.isHome).slice(0, 6);
    
    res.json({
      success: true,
      data: homeMovies
    });
  } catch (error) {
    console.error('Error fetching home movies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch home movies'
    });
  }
});

// Get latest movies
router.get('/latest', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const latestMovies = moviesData.filter(movie => movie.isLatest).slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: latestMovies
    });
  } catch (error) {
    console.error('Error fetching latest movies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest movies'
    });
  }
});

// Get movie by address bar
router.get('/:addressBar', async (req, res) => {
  try {
    const { addressBar } = req.params;
    
    const movie = moviesData.find(m => m.addressBar === addressBar);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }
    
    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch movie'
    });
  }
});

// Get movie classifications
router.get('/classifications/all', async (req, res) => {
  try {
    const classifications = [...new Set(moviesData.flatMap(movie => movie.classify))].sort();
    
    res.json({
      success: true,
      data: classifications
    });
  } catch (error) {
    console.error('Error fetching classifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch classifications'
    });
  }
});

export default router;
