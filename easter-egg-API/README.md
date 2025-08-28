# EasterEggVault API

Backend API for the EasterEggVault platform - a comprehensive easter egg discovery platform for video games, movies, and TV shows.

## Features

- **RESTful API** with Express.js
- **Static data support** (no database required for development)
- **Search functionality** across all media types
- **Pagination and filtering** support
- **CORS enabled** for frontend integration
- **Rate limiting** and security middleware
- **Ready for Vercel deployment** with Neon database

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Games
- `GET /api/games` - Get all games with pagination and search
- `GET /api/games/home` - Get games for home page
- `GET /api/games/latest` - Get latest games
- `GET /api/games/:addressBar` - Get specific game by address bar
- `GET /api/games/classifications/all` - Get all game classifications

### Movies
- `GET /api/movies` - Get all movies with pagination and search
- `GET /api/movies/home` - Get movies for home page
- `GET /api/movies/latest` - Get latest movies
- `GET /api/movies/:addressBar` - Get specific movie by address bar
- `GET /api/movies/classifications/all` - Get all movie classifications

### TV Shows
- `GET /api/tv` - Get all TV shows with pagination and search
- `GET /api/tv/home` - Get TV shows for home page
- `GET /api/tv/latest` - Get latest TV shows
- `GET /api/tv/:addressBar` - Get specific TV show by address bar
- `GET /api/tv/classifications/all` - Get all TV show classifications

### News
- `GET /api/news` - Get all news with pagination and search
- `GET /api/news/latest` - Get latest news
- `GET /api/news/:addressBar` - Get specific news by address bar
- `GET /api/news/classifications/all` - Get all news classifications

### Search
- `GET /api/search?q=query` - Global search across all media types
- `GET /api/search/suggestions?q=query` - Get search suggestions
- `GET /api/search/stats` - Get search statistics

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Search & Filtering
- `search` - Search in title and description
- `classify` - Filter by classifications (comma-separated)
- `mediaType` - Filter by media type (games, movies, tv)

### Examples

```bash
# Search for action games
GET /api/games?search=action&classify=Action&page=1&limit=5

# Get latest movies
GET /api/movies/latest?limit=10

# Global search for "Marvel"
GET /api/search?q=Marvel&mediaType=movies

# Get search suggestions
GET /api/search/suggestions?q=elden&limit=5
```

## Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Database (for future Neon integration)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

## Development

### Scripts

```bash
# Development with hot reload
npm run dev

# Production build
npm start

# Lint code
npm run lint

# Format code
npm run format
```

### Project Structure

```
easter-egg-API/
├── config/          # Database configuration
├── routes/          # API route handlers
├── scripts/         # Database migration and seeding
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## Deployment to Vercel

### 1. Prepare for Production

```bash
# Install production dependencies only
npm ci --only=production

# Build the project (if needed)
npm run build
```

### 2. Vercel Configuration

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 3. Environment Variables

Set these in Vercel dashboard:
- `DATABASE_URL` - Your Neon database connection string
- `NODE_ENV` - Set to "production"
- `CORS_ORIGIN` - Your frontend domain

### 4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Database Migration (Future)

When ready to migrate to Neon database:

```bash
# Run database migration
npm run db:migrate

# Seed with initial data
npm run db:seed
```

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the API endpoints
5. Submit a pull request

## License

MIT License - see LICENSE file for details
