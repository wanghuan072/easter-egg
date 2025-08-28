import { query } from '../config/database.js';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await query('DELETE FROM easter_eggs');
    console.log('🧹 Cleared existing data');

    // Games data
    const gamesData = [
      {
        title: "Elden Ring: The Miyazaki Universe Connections",
        description: "Uncover the hidden lore connections between Elden Ring and FromSoftware's previous titles. Discover how the game's mysterious world connects to Dark Souls, Bloodborne, and other Miyazaki masterpieces through subtle environmental storytelling and hidden item descriptions.",
        publish_date: "2024-01-15",
        is_latest: true,
        is_home: true,
        label: "GAME",
        classify: ["Action", "RPG", "Open World", "Souls-like"],
        image_url: "https://images.unsplash.com/photo-1625805866449-3589fe3c4e40?w=800&q=80",
        image_alt: "Elden Ring Miyazaki Universe",
        address_bar: "elden-ring-miyazaki-universe",
        iframe_url: "https://example.com/games/elden-ring-details",
        seo_title: "Elden Ring: The Miyazaki Universe Connections - Game Secrets Revealed",
        seo_description: "Discover the hidden connections between Elden Ring and FromSoftware's previous titles. Uncover lore secrets and environmental storytelling.",
        seo_keywords: "Elden Ring, Dark Souls, Bloodborne, FromSoftware, Miyazaki, game lore, secrets",
        details_html: "<h2>The Hidden Connections</h2><p>Elden Ring represents a culmination of FromSoftware's design philosophy...</p><h3>Environmental Storytelling</h3><p>The game's world is filled with subtle references...</p>",
        media_type: "games"
      },
      {
        title: "bbb",
        description: "Uncover the hidden lore connections between Elden Ring and FromSoftware's previous titles. Discover how the game's mysterious world connects to Dark Souls, Bloodborne, and other Miyazaki masterpieces through subtle environmental storytelling and hidden item descriptions.",
        publish_date: "2024-01-15",
        is_latest: true,
        is_home: true,
        label: "GAME",
        classify: ["Action"],
        image_url: "https://images.unsplash.com/photo-1625805866449-3589fe3c4e40?w=800&q=80",
        image_alt: "Elden Ring Miyazaki Universe",
        address_bar: "bbb-game",
        iframe_url: "https://example.com/games/bbb-details",
        seo_title: "BBB Game - Action Adventure Secrets",
        seo_description: "Explore the mysterious world of BBB game and discover its hidden secrets.",
        seo_keywords: "BBB game, action, adventure, secrets, gaming",
        details_html: "<h2>BBB Game Overview</h2><p>This is a placeholder for BBB game details...</p>",
        media_type: "games"
      }
    ];

    // Movies data
    const moviesData = [
      {
        title: "Marvel Phase 5: Every MCU Easter Egg You Missed",
        description: "A comprehensive breakdown of all the hidden references, cameos, and setup for future films in the latest Marvel releases. From subtle background details to post-credit scene connections, discover every easter egg that hints at the future of the MCU.",
        publish_date: "2024-01-12",
        is_latest: true,
        is_home: true,
        label: "MOVIE",
        classify: ["Superhero", "Action", "Sci-Fi", "Adventure"],
        image_url: "https://images.unsplash.com/photo-1531259683007-016a943daa8e?w=800&q=80",
        image_alt: "Marvel Phase 5 Easter Eggs",
        address_bar: "marvel-phase-5-easter-eggs",
        iframe_url: "https://example.com/movies/marvel-phase-5-details",
        seo_title: "Marvel Phase 5: Every MCU Easter Egg You Missed - Complete Guide",
        seo_description: "Discover all the hidden references, cameos, and setup for future films in Marvel Phase 5. Complete MCU easter egg guide.",
        seo_keywords: "Marvel, MCU, Phase 5, easter eggs, hidden references, superhero movies",
        details_html: "<h2>Marvel Phase 5 Easter Eggs Guide</h2><p>Marvel Phase 5 continues the tradition of hiding easter eggs throughout its films...</p><h3>Hidden References</h3><p>From subtle background details to post-credit scene connections...</p>",
        media_type: "movies"
      }
    ];

    // TV Shows data
    const tvData = [
      {
        title: "The Last of Us TV Series: Game References Guide",
        description: "Every callback to the original game series hidden in HBO's adaptation, from character details to environmental storytelling. Discover how the showrunners carefully preserved the essence of the game while adding new layers of meaning for both fans and newcomers.",
        publish_date: "2024-01-10",
        is_latest: true,
        is_home: true,
        label: "TV",
        classify: ["Drama", "Post-Apocalyptic", "Action", "Thriller"],
        image_url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80",
        image_alt: "The Last of Us TV Series",
        address_bar: "last-of-us-tv-series-guide",
        iframe_url: "https://example.com/tv/last-of-us-details",
        seo_title: "The Last of Us TV Series: Complete Game References Guide",
        seo_description: "Discover every callback to the original game series hidden in HBO's The Last of Us adaptation. Complete reference guide.",
        seo_keywords: "The Last of Us, HBO, TV series, game references, post-apocalyptic, drama",
        details_html: "<h2>The Last of Us TV Series Guide</h2><p>HBO's adaptation of The Last of Us carefully preserves the essence of the original game...</p><h3>Game References</h3><p>From character details to environmental storytelling...</p>",
        media_type: "tv"
      }
    ];

    // Insert all data
    const allData = [...gamesData, ...moviesData, ...tvData];
    
    for (const item of allData) {
      await query(`
        INSERT INTO easter_eggs (
          title, description, publish_date, is_latest, is_home, label, classify,
          image_url, image_alt, address_bar, iframe_url, seo_title, seo_description,
          seo_keywords, details_html, media_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        item.title, item.description, item.publish_date, item.is_latest, item.is_home,
        item.label, item.classify, item.image_url, item.image_alt, item.address_bar,
        item.iframe_url, item.seo_title, item.seo_description, item.seo_keywords,
        item.details_html, item.media_type
      ]);
    }

    console.log(`✅ Inserted ${allData.length} records`);

    // Verify data
    const count = await query('SELECT COUNT(*) FROM easter_eggs');
    console.log(`📊 Total records in database: ${count.rows[0].count}`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedData };
