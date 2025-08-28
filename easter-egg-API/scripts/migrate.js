import { query } from '../config/database.js';

const createTables = async () => {
  try {
    console.log('🚀 Starting database migration...');

    // Create easter_eggs table
    await query(`
      CREATE TABLE IF NOT EXISTS easter_eggs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        publish_date DATE NOT NULL,
        is_latest BOOLEAN DEFAULT false,
        is_home BOOLEAN DEFAULT false,
        label VARCHAR(50) NOT NULL,
        classify TEXT[] NOT NULL,
        image_url TEXT NOT NULL,
        image_alt VARCHAR(255) NOT NULL,
        address_bar VARCHAR(255) UNIQUE NOT NULL,
        iframe_url TEXT,
        seo_title VARCHAR(255),
        seo_description TEXT,
        seo_keywords TEXT,
        details_html TEXT,
        media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('games', 'movies', 'tv')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created easter_eggs table');

    // Create index for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_easter_eggs_media_type ON easter_eggs(media_type)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_easter_eggs_address_bar ON easter_eggs(address_bar)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_easter_eggs_is_latest ON easter_eggs(is_latest)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_easter_eggs_is_home ON easter_eggs(is_home)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_easter_eggs_publish_date ON easter_eggs(publish_date)
    `);
    console.log('✅ Created indexes');

    // Create function to update updated_at timestamp
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    console.log('✅ Created update_updated_at_column function');

    // Create trigger for updated_at
    await query(`
      DROP TRIGGER IF EXISTS update_easter_eggs_updated_at ON easter_eggs
    `);
    await query(`
      CREATE TRIGGER update_easter_eggs_updated_at
        BEFORE UPDATE ON easter_eggs
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log('✅ Created trigger for updated_at');

    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTables()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { createTables };
