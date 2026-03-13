# 🤖 AI Feedback Analyzer API

> Production-ready REST API that analyzes customer feedback using OpenAI GPT-4o — extracts summaries, keywords, sentiment, themes, and actionable insights automatically.

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

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
          ┌─────────┴──────────┐
          ▼                    ▼
  ┌───────────────┐   ┌─────────────────┐
  │   MongoDB      │   │  Webhook / CSV  │
  │   (Results +   │   │  Export Service │
  │    Analytics)  │   └─────────────────┘
  └───────────────┘
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **GPT-4o Analysis** | Sentiment, keywords, themes, and actionable insights per feedback |
| 📦 **Batch Processing** | Analyze up to 50 feedbacks in one request |
| 📊 **Analytics Dashboard** | Sentiment trends, top keywords, theme breakdowns via aggregation |
| 🔐 **JWT Authentication** | Secure register/login with bcrypt password hashing |
| 🛡️ **Rate Limiting** | Per-user configurable rate limits to prevent abuse |
| 🐳 **Docker Ready** | One command to run everything: `docker-compose up` |
| 🧪 **Mock Mode** | Full testing without an OpenAI API key |
| 📝 **Input Validation** | Joi-based schema validation on all endpoints |
| 📄 **CSV Export** | Download all feedback data as a spreadsheet with filters |
| 🔔 **Webhook Support** | Auto-notify Slack, Zapier, or any URL after each analysis |
| 📅 **Date Range Filtering** | Filter feedback lists and exports by date range |
| ⏱️ **Processing Metrics** | Track AI response time per request |
| 🔍 **Pagination & Filters** | Filter by sentiment, source, date on list endpoints |

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
git clone https://github.com/rohitkapoorfriend/ai-feedback-api.git
cd ai-feedback-api
cp .env.example .env
# Add your OpenAI API key to .env (or leave MOCK_AI=true)
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

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, receive JWT token |

### Feedback Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedback/analyze` | Analyze single feedback |
| POST | `/api/feedback/batch` | Analyze multiple feedbacks (up to 50) |
| GET | `/api/feedback/:id` | Get analysis result by ID |
| GET | `/api/feedback` | List feedbacks (paginated, filterable) |
| GET | `/api/feedback/export` | Download feedback as CSV |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Overall sentiment distribution |
| GET | `/api/analytics/keywords` | Top keywords across all feedback |
| GET | `/api/analytics/themes` | Theme clusters with counts |

---

## 📝 Example Usage

### 1. Register & Get Token
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"test1234","name":"Your Name"}'
```

### 2. Analyze Feedback
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
    "processingTimeMs": 1243,
    "analysis": {
      "summary": "Customer praises product quality but criticizes slow shipping. Support experience was positive.",
      "sentiment": {
        "overall": "mixed",
        "score": 0.65,
        "breakdown": {
          "product_quality": { "label": "positive", "score": 0.95 },
          "shipping":        { "label": "negative", "score": 0.85 },
          "customer_support":{ "label": "positive", "score": 0.80 }
        }
      },
      "keywords": ["product quality", "shipping delay", "customer support", "helpful"],
      "themes": ["product_satisfaction", "delivery_issues", "support_experience"],
      "actionableInsights": [
        "Improve shipping times to match product quality expectations",
        "Leverage strong support team as a differentiator"
      ]
    },
    "metadata": { "product_id": "SKU-1234", "rating": 4 },
    "processed_at": "2026-03-02T10:30:00Z"
  }
}
```

### 3. Export to CSV
```bash
curl -X GET "http://localhost:3000/api/feedback/export?sentiment=negative&startDate=2026-01-01" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output feedback-export.csv
```

### 4. Batch Analyze
```bash
curl -X POST http://localhost:3000/api/feedback/batch \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "feedbacks": [
      { "text": "Great product, fast delivery!", "source": "survey" },
      { "text": "App keeps crashing on login", "source": "support_ticket" }
    ]
  }'
```

---

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
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Mock Mode (set true to run without OpenAI key)
MOCK_AI=false

# Webhooks (optional — POST results to any URL after each analysis)
WEBHOOK_URL=https://hooks.slack.com/your-webhook
```

---

## 🗂️ Project Structure

```
ai-feedback-api/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── openai.js            # OpenAI client singleton
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── rateLimiter.js       # Per-user rate limiting
│   │   ├── validator.js         # Joi schema validation
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema + bcrypt hooks
│   │   └── Feedback.js          # Feedback + analysis schema
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── feedback.routes.js   # Feedback CRUD + analysis + export
│   │   └── analytics.routes.js  # Aggregation endpoints
│   ├── services/
│   │   ├── ai.service.js        # OpenAI integration + mock engine
│   │   ├── feedback.service.js  # Core feedback business logic
│   │   ├── analytics.service.js # MongoDB aggregation queries
│   │   ├── export.service.js    # CSV export generation
│   │   └── webhook.service.js   # Outbound webhook delivery
│   ├── utils/
│   │   ├── prompts.js           # AI prompt templates
│   │   └── logger.js            # Winston logger
│   └── app.js                   # Express app + server bootstrap
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
└── README.md
```

---

## 🐳 Docker

```bash
docker-compose up -d    # Start API + MongoDB in background
docker-compose logs -f  # Follow logs
docker-compose down     # Stop everything
```

---

## 🧪 Testing

```bash
npm test                # Run all tests
npm run test:coverage   # Run with coverage report
```

---

## 🔑 Why This Project?

Real-world patterns used in production every day:

1. **AI/LLM Integration** — Structured prompts, response normalization, mock fallback for zero-cost testing
2. **Production API Design** — Auth, validation, rate limiting, error handling, structured logging
3. **Database Design** — Efficient schemas with compound indexes for fast analytics aggregation
4. **Webhooks & Integrations** — Event-driven delivery to any downstream service
5. **DevOps** — Docker, environment management, health checks, graceful error recovery

---

## 👨‍💻 Author

**Rohit Kapoor** — Senior Backend Engineer | 11+ Years

- 📧 rohitkapoorfriendfriend@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/rohit-kapoor-5945a987/)
- 🐙 [GitHub](https://github.com/rohitkapoorfriend)

> 🟢 **Available for remote contract work** — US/EU time zones

---

## 📄 License

MIT — free to use and reference.