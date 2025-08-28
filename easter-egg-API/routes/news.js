import express from 'express';

const router = express.Router();

// Static news data
const newsData = [
  {
    id: 1,
    title: "New Easter Egg Discovered in Latest Game Release",
    description: "Players have found a hidden reference to a classic game in the newest release, sparking excitement in the gaming community.",
    publishDate: "2024-01-20",
    isLatest: true,
    isHome: false,
    label: "NEWS",
    classify: ["Gaming", "Discovery", "Community"],
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    imageAlt: "Gaming News",
    addressBar: "new-easter-egg-discovered",
    iframeUrl: "https://example.com/news/new-discovery",
    seo: {
      title: "New Easter Egg Discovered - Latest Gaming News",
      description: "Latest discovery of hidden content in new game release.",
      keywords: "gaming, easter egg, discovery, news"
    },
    detailsHtml: "<h2>New Discovery</h2><p>Players have found an exciting new easter egg...</p>"
  },
  {
    id: 2,
    title: "Movie Director Confirms Hidden References",
    description: "The director of the latest blockbuster has confirmed several hidden references that fans have been speculating about.",
    publishDate: "2024-01-18",
    isLatest: true,
    isHome: false,
    label: "NEWS",
    classify: ["Movies", "Director", "Confirmation"],
    imageUrl: "https://images.unsplash.com/photo-1489599835382-3b9b0f7d4d5c?w=800&q=80",
    imageAlt: "Movie Director Interview",
    addressBar: "director-confirms-references",
    iframeUrl: "https://example.com/news/director-interview",
    seo: {
      title: "Director Confirms Hidden References - Movie News",
      description: "Exclusive interview reveals confirmed easter eggs in latest film.",
      keywords: "movie, director, easter egg, interview, confirmation"
    },
    detailsHtml: "<h2>Director Interview</h2><p>In an exclusive interview, the director confirmed...</p>"
  }
];

// Get all news
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, classify } = req.query;
    const offset = (page - 1) * limit;
    
    let filteredData = [...newsData];
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(news => 
        news.title.toLowerCase().includes(searchLower) || 
        news.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by classification
    if (classify) {
      const classifications = classify.split(',');
      filteredData = filteredData.filter(news => 
        classifications.some(cat => news.classify.includes(cat))
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
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news'
    });
  }
});

// Get latest news
router.get('/latest', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const latestNews = newsData.filter(news => news.isLatest).slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: latestNews
    });
  } catch (error) {
    console.error('Error fetching latest news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest news'
    });
  }
});

// Get news by address bar
router.get('/:addressBar', async (req, res) => {
  try {
    const { addressBar } = req.params;
    
    const news = newsData.find(n => n.addressBar === addressBar);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'News not found'
      });
    }
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news'
    });
  }
});

// Get news classifications
router.get('/classifications/all', async (req, res) => {
  try {
    const classifications = [...new Set(newsData.flatMap(news => news.classify))].sort();
    
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
