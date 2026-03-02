# 🤖 AI Feedback Analyzer API

> Production-ready REST API that analyzes customer feedback using OpenAI GPT-4o — extracts summaries, keywords, sentiment, and themes automatically.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## 🏗️ Architecture

```
Client Request
    │
    ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Express.js  │────▶│  Auth (JWT)   │────▶│  Rate Limiter   │
│  REST API    │     │  Middleware   │     │  (per user)     │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                    ┌──────────────────────────────┘
                    ▼
            ┌───────────────┐
            │  AI Service    │
            │  (OpenAI GPT)  │
            │                │
            │  • Summarize   │
            │  • Keywords    │
            │  • Sentiment   │
            │  • Themes      │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   MongoDB      │
            │   (Results +   │
            │    Analytics)  │
            └───────────────┘
```

## ✨ Features

- **AI-Powered Analysis** — Send any text feedback, get structured insights back
- **Batch Processing** — Analyze up to 50 feedbacks in one request
- **Sentiment Detection** — Positive, negative, neutral with confidence scores
- **Keyword Extraction** — Auto-extract key topics and phrases
- **Theme Clustering** — Group similar feedbacks by topic
- **JWT Authentication** — Secure API with user registration and login
- **Rate Limiting** — Per-user rate limits to prevent abuse
- **Analytics Dashboard API** — Aggregated insights across all feedback
- **Docker Ready** — One command to run: `docker-compose up`
- **Well Tested** — Unit tests with Jest, 85%+ coverage

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
git clone https://github.com/rohitkapoorfriend/ai-feedback-api.git
cd ai-feedback-api
cp .env.example .env
# Add your OpenAI API key to .env (or use mock mode)
docker-compose up
```
API available at `http://localhost:3000`

### Option 2: Local
```bash
npm install
cp .env.example .env
npm run dev
```

### Mock Mode (No OpenAI key needed)
```bash
MOCK_AI=true npm run dev
```
Runs with simulated AI responses — perfect for testing and demos.

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT token |

### Feedback Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedback/analyze` | Analyze single feedback |
| POST | `/api/feedback/batch` | Analyze multiple feedbacks (up to 50) |
| GET | `/api/feedback/:id` | Get analysis result by ID |
| GET | `/api/feedback` | List all analyzed feedbacks (paginated) |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Overall sentiment distribution |
| GET | `/api/analytics/keywords` | Top keywords across all feedback |
| GET | `/api/analytics/themes` | Theme clusters with counts |

## 📝 Example Usage

### Analyze Feedback
```bash
curl -X POST http://localhost:3000/api/feedback/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The product quality is amazing but shipping took way too long. Customer support was helpful when I reached out about the delay.",
    "source": "product_review",
    "metadata": { "product_id": "SKU-1234", "rating": 4 }
  }'
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "fb_abc123",
    "original_text": "The product quality is amazing but...",
    "analysis": {
      "summary": "Customer praises product quality but criticizes slow shipping. Support experience was positive.",
      "sentiment": {
        "overall": "mixed",
        "score": 0.65,
        "breakdown": {
          "product_quality": { "label": "positive", "score": 0.95 },
          "shipping": { "label": "negative", "score": 0.85 },
          "customer_support": { "label": "positive", "score": 0.80 }
        }
      },
      "keywords": ["product quality", "shipping delay", "customer support", "helpful"],
      "themes": ["product_satisfaction", "delivery_issues", "support_experience"],
      "actionable_insights": [
        "Improve shipping times to match product quality expectations",
        "Leverage strong support team as a differentiator"
      ]
    },
    "metadata": { "product_id": "SKU-1234", "rating": 4 },
    "processed_at": "2026-03-02T10:30:00Z"
  }
}
```

## 🗂️ Project Structure

```
ai-feedback-api/
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   ├── openai.js          # OpenAI client setup
│   │   └── env.js             # Environment validation
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── rateLimiter.js     # Per-user rate limiting
│   │   ├── validator.js       # Input validation
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Feedback.js        # Feedback + analysis schema
│   ├── routes/
│   │   ├── auth.routes.js     # Auth endpoints
│   │   ├── feedback.routes.js # Feedback CRUD + analysis
│   │   └── analytics.routes.js# Aggregation endpoints
│   ├── services/
│   │   ├── ai.service.js      # OpenAI integration logic
│   │   ├── feedback.service.js# Business logic
│   │   └── analytics.service.js
│   ├── utils/
│   │   ├── prompts.js         # AI prompt templates
│   │   └── logger.js          # Winston logger
│   └── app.js                 # Express app setup
├── tests/
│   ├── auth.test.js
│   ├── feedback.test.js
│   └── ai.service.test.js
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
└── README.md
```

## ⚙️ Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-feedback

# OpenAI
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini

# Auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Mock Mode (set to true to run without OpenAI key)
MOCK_AI=false
```

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:coverage # Run with coverage report
```

## 🐳 Docker

```bash
docker-compose up     # Start API + MongoDB
docker-compose down   # Stop everything
```

## 🔑 Why This Project?

This project demonstrates real-world patterns I use daily in production:

1. **AI/LLM Integration** — Structured prompts, response parsing, error handling, fallbacks
2. **Production API Design** — Auth, validation, rate limiting, error handling, logging
3. **Database Design** — Efficient schemas for analytics aggregation
4. **DevOps** — Docker, environment management, health checks
5. **Testing** — Unit tests, integration tests, mock services

---

## 👨‍💻 Author

**Rohit Kapoor** — Senior Backend Engineer | 11+ Years

- 📧 rohitkapoorfriendfriend@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/rohit-kapoor-5945a987/)
- 🐙 [GitHub](https://github.com/rohitkapoorfriend)

> 🟢 **Available for remote contract work** — US/EU time zones

## 📄 License

MIT License — feel free to use this as a reference for your own projects.
