import express from 'express';

const router = express.Router();

// Static TV shows data
const tvData = [
  {
    id: 1,
    title: "The Last of Us TV Series: Game References Guide",
    description: "Every callback to the original game series hidden in HBO's adaptation, from character details to environmental storytelling. Discover how the showrunners carefully preserved the essence of the game while adding new layers of meaning for both fans and newcomers.",
    publishDate: "2024-01-10",
    isLatest: true,
    isHome: true,
    label: "TV",
    classify: ["Drama", "Post-Apocalyptic", "Action", "Thriller"],
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80",
    imageAlt: "The Last of Us TV Series",
    addressBar: "last-of-us-tv-series-guide",
    iframeUrl: "https://example.com/tv/last-of-us-details",
    seo: {
      title: "The Last of Us TV Series: Complete Game References Guide",
      description: "Discover every callback to the original game series hidden in HBO's The Last of Us adaptation. Complete reference guide.",
      keywords: "The Last of Us, HBO, TV series, game references, post-apocalyptic, drama"
    },
    detailsHtml: "<h2>The Last of Us TV Series Guide</h2><p>HBO's adaptation of The Last of Us carefully preserves the essence of the original game...</p><h3>Game References</h3><p>From character details to environmental storytelling...</p>"
  }
];

// Get all TV shows
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, classify } = req.query;
    const offset = (page - 1) * limit;
    
    let filteredData = [...tvData];
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(show => 
        show.title.toLowerCase().includes(searchLower) || 
        show.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by classification
    if (classify) {
      const classifications = classify.split(',');
      filteredData = filteredData.filter(show => 
        classifications.some(cat => show.classify.includes(cat))
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
    console.error('Error fetching TV shows:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TV shows'
    });
  }
});

// Get TV shows for home page
router.get('/home', async (req, res) => {
  try {
    const homeShows = tvData.filter(show => show.isHome).slice(0, 6);
    
    res.json({
      success: true,
      data: homeShows
    });
  } catch (error) {
    console.error('Error fetching home TV shows:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch home TV shows'
    });
  }
});

// Get latest TV shows
router.get('/latest', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const latestShows = tvData.filter(show => show.isLatest).slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: latestShows
    });
  } catch (error) {
    console.error('Error fetching latest TV shows:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest TV shows'
    });
  }
});

// Get TV show by address bar
router.get('/:addressBar', async (req, res) => {
  try {
    const { addressBar } = req.params;
    
    const show = tvData.find(s => s.addressBar === addressBar);
    
    if (!show) {
      return res.status(404).json({
        success: false,
        error: 'TV show not found'
      });
    }
    
    res.json({
      success: true,
      data: show
    });
  } catch (error) {
    console.error('Error fetching TV show:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TV show'
    });
  }
});

// Get TV show classifications
router.get('/classifications/all', async (req, res) => {
  try {
    const classifications = [...new Set(tvData.flatMap(show => show.classify))].sort();
    
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
