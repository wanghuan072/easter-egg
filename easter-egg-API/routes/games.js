import express from 'express';

const router = express.Router();

// Static games data
const gamesData = [
  {
    id: 1,
    title: "Elden Ring: The Miyazaki Universe Connections",
    description: "Uncover the hidden lore connections between Elden Ring and FromSoftware's previous titles. Discover how the game's mysterious world connects to Dark Souls, Bloodborne, and other Miyazaki masterpieces through subtle environmental storytelling and hidden item descriptions.",
    publishDate: "2024-01-15",
    isLatest: true,
    isHome: true,
    label: "GAME",
    classify: ["Action", "RPG", "Open World", "Souls-like"],
    imageUrl: "https://images.unsplash.com/photo-1625805866449-3589fe3c4e40?w=800&q=80",
    imageAlt: "Elden Ring Miyazaki Universe",
    addressBar: "elden-ring-miyazaki-universe",
    iframeUrl: "https://example.com/games/elden-ring-details",
    seo: {
      title: "Elden Ring: The Miyazaki Universe Connections - Game Secrets Revealed",
      description: "Discover the hidden connections between Elden Ring and FromSoftware's previous titles. Uncover lore secrets and environmental storytelling.",
      keywords: "Elden Ring, Dark Souls, Bloodborne, FromSoftware, Miyazaki, game lore, secrets"
    },
    detailsHtml: "<h2>The Hidden Connections</h2><p>Elden Ring represents a culmination of FromSoftware's design philosophy...</p><h3>Environmental Storytelling</h3><p>The game's world is filled with subtle references...</p>"
  },
  {
    id: 2,
    title: "bbb",
    description: "Uncover the hidden lore connections between Elden Ring and FromSoftware's previous titles. Discover how the game's mysterious world connects to Dark Souls, Bloodborne, and other Miyazaki masterpieces through subtle environmental storytelling and hidden item descriptions.",
    publishDate: "2024-01-15",
    isLatest: true,
    isHome: true,
    label: "GAME",
    classify: ["Action"],
    imageUrl: "https://images.unsplash.com/photo-1625805866449-3589fe3c4e40?w=800&q=80",
    imageAlt: "Elden Ring Miyazaki Universe",
    addressBar: "bbb-game",
    iframeUrl: "https://example.com/games/bbb-details",
    seo: {
      title: "BBB Game - Action Adventure Secrets",
      description: "Explore the mysterious world of BBB game and discover its hidden secrets.",
      keywords: "BBB game, action, adventure, secrets, gaming"
    },
    detailsHtml: "<h2>BBB Game Overview</h2><p>This is a placeholder for BBB game details...</p>"
  }
];

// Get all games
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, classify } = req.query;
    const offset = (page - 1) * limit;
    
    let filteredData = [...gamesData];
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(game => 
        game.title.toLowerCase().includes(searchLower) || 
        game.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by classification
    if (classify) {
      const classifications = classify.split(',');
      filteredData = filteredData.filter(game => 
        classifications.some(cat => game.classify.includes(cat))
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
    console.error('Error fetching games:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games'
    });
  }
});

// Get games for home page
router.get('/home', async (req, res) => {
  try {
    const homeGames = gamesData.filter(game => game.isHome).slice(0, 6);
    
    res.json({
      success: true,
      data: homeGames
    });
  } catch (error) {
    console.error('Error fetching home games:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch home games'
    });
  }
});

// Get latest games
router.get('/latest', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const latestGames = gamesData.filter(game => game.isLatest).slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: latestGames
    });
  } catch (error) {
    console.error('Error fetching latest games:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest games'
    });
  }
});

// Get game by address bar
router.get('/:addressBar', async (req, res) => {
  try {
    const { addressBar } = req.params;
    
    const game = gamesData.find(g => g.addressBar === addressBar);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game'
    });
  }
});

// Get game classifications
router.get('/classifications/all', async (req, res) => {
  try {
    const classifications = [...new Set(gamesData.flatMap(game => game.classify))].sort();
    
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
