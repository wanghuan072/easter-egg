import express from 'express';

const router = express.Router();

// Import static data from other routes (in a real app, this would come from a shared data service)
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
    detailsHtml: "<h2>The Hidden Connections</h2><p>Elden Ring represents a culmination of FromSoftware's design philosophy...</p><h3>Environmental Storytelling</h3><p>The game's world is filled with subtle references...</p>",
    media_type: "games"
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
    detailsHtml: "<h2>BBB Game Overview</h2><p>This is a placeholder for BBB game details...</p>",
    media_type: "games"
  }
];

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
    detailsHtml: "<h2>Marvel Phase 5 Easter Eggs Guide</h2><p>Marvel Phase 5 continues the tradition of hiding easter eggs throughout its films...</p><h3>Hidden References</h3><p>From subtle background details to post-credit scene connections...</p>",
    media_type: "movies"
  }
];

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
    detailsHtml: "<h2>The Last of Us TV Series Guide</h2><p>HBO's adaptation of The Last of Us carefully preserves the essence of the original game...</p><h3>Game References</h3><p>From character details to environmental storytelling...</p>",
    media_type: "tv"
  }
];

// Combine all data for search
const allData = [...gamesData, ...moviesData, ...tvData];

// Global search across all media types
router.get('/', async (req, res) => {
  try {
    const { q: query, page = 1, limit = 20, mediaType, classify } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    let filteredData = [...allData];
    
    // Search in title and description
    const searchLower = query.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.title.toLowerCase().includes(searchLower) || 
      item.description.toLowerCase().includes(searchLower) ||
      item.classify.some(cat => cat.toLowerCase().includes(searchLower))
    );
    
    // Filter by media type
    if (mediaType) {
      const types = mediaType.split(',');
      filteredData = filteredData.filter(item => types.includes(item.media_type));
    }
    
    // Filter by classification
    if (classify) {
      const classifications = classify.split(',');
      filteredData = filteredData.filter(item => 
        classifications.some(cat => item.classify.includes(cat))
      );
    }
    
    // Sort by relevance (exact matches first, then partial matches)
    filteredData.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchLower);
      const bTitleMatch = b.title.toLowerCase().includes(searchLower);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      // If both have title matches, sort by publish date
      return new Date(b.publishDate) - new Date(a.publishDate);
    });
    
    const total = filteredData.length;
    const offset = (page - 1) * limit;
    const paginatedData = filteredData.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      searchInfo: {
        query,
        mediaType: mediaType || 'all',
        classify: classify || 'all'
      }
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query, limit = 5 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const searchLower = query.toLowerCase();
    const suggestions = [];
    
    // Get title suggestions
    const titleMatches = allData
      .filter(item => item.title.toLowerCase().includes(searchLower))
      .slice(0, limit)
      .map(item => ({
        type: 'title',
        text: item.title,
        mediaType: item.media_type,
        addressBar: item.addressBar
      }));
    
    // Get classification suggestions
    const allClassifications = [...new Set(allData.flatMap(item => item.classify))];
    const classificationMatches = allClassifications
      .filter(classification => classification.toLowerCase().includes(searchLower))
      .slice(0, limit)
      .map(classification => ({
        type: 'classification',
        text: classification,
        mediaType: 'all'
      }));
    
    // Combine and deduplicate suggestions
    const allSuggestions = [...titleMatches, ...classificationMatches];
    const uniqueSuggestions = allSuggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.text === suggestion.text)
      )
      .slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: uniqueSuggestions
    });
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
});

// Get search statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalItems: allData.length,
      byMediaType: {
        games: gamesData.length,
        movies: moviesData.length,
        tv: tvData.length
      },
      totalClassifications: [...new Set(allData.flatMap(item => item.classify))].length,
      latestItems: allData.filter(item => item.isLatest).length,
      homeItems: allData.filter(item => item.isHome).length
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting search stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get search statistics'
    });
  }
});

export default router;
