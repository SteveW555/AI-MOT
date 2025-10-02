# Backend Architecture: Express.js API Proxy

**Purpose**: Secure OpenAI API key by keeping it server-side only
**Complexity**: Minimal (~20 lines of code)
**Deployment**: Single Node.js deployment with Railway.app

---

## Architecture Overview

```
┌─────────────────┐
│   Browser       │
│   (React App)   │
└────────┬────────┘
         │ POST /api/chat
         │ { messages: [...] }
         ▼
┌─────────────────┐
│   Express.js    │
│   Server        │
│   :3000         │
└────────┬────────┘
         │ Uses OPENAI_API_KEY
         │ (from .env)
         ▼
┌─────────────────┐
│   OpenAI API    │
│   api.openai.com│
└─────────────────┘
```

**Key Benefits**:
- ✅ API key never exposed to browser
- ✅ Single deployment (not separate frontend/backend)
- ✅ No CORS issues (same origin)
- ✅ Simple Railway deployment

---

## File Structure

```
project/
├── server/
│   └── index.js              # Express server (~20 lines)
├── src/                      # React frontend (existing)
├── dist/                     # Built frontend (production)
├── vite.config.ts            # Add API proxy for dev
├── package.json              # Scripts for dev + production
├── .env                      # OPENAI_API_KEY (backend only)
└── .gitignore                # Ensure .env is ignored
```

---

## Backend Implementation

### `server/index.js` (~20 lines)

```javascript
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

// API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500
    });
    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## Frontend API Client

### `src/services/api-client.ts`

```typescript
import { ChatMessage } from '@/types/chatbot';

export interface ChatResponse {
  message: string;
}

export interface ChatError {
  error: string;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  timeout: number = 5000
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ChatResponse = await response.json();
    return data.message;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }

    throw error;
  }
}
```

---

## Development Setup

### `vite.config.ts` (add proxy)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

### `package.json` (scripts)

```json
{
  "type": "module",
  "scripts": {
    "dev:server": "node server/index.js",
    "dev:client": "vite",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "build": "tsc && vite build",
    "start": "NODE_ENV=production node server/index.js",
    "preview": "vite preview"
  },
  "dependencies": {
    "express": "^4.18.2",
    "openai": "^4.20.1",
    "dotenv": "^16.3.1",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "vite": "^6.0.11",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3"
  }
}
```

### `.env` (backend only)

```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
PORT=3000
```

---

## Development Workflow

### Starting Development Server

```bash
# Install dependencies
npm install

# Start both frontend + backend concurrently
npm run dev
```

**What happens**:
1. `dev:server` starts Express on port 3000
2. `dev:client` starts Vite dev server on port 5173
3. Vite proxies `/api/*` requests to Express (port 3000)
4. Frontend at http://localhost:5173
5. Backend at http://localhost:3000

---

## Production Build

### Build Process

```bash
# Build frontend
npm run build
# Output: dist/ folder with static HTML/CSS/JS

# Start production server
npm start
# Express serves static files from dist/ + handles /api/chat
```

---

## Railway Deployment

### Configuration

**Railway auto-detects**:
- Node.js project (via `package.json`)
- Start command: `npm start`
- Build command: `npm run build`

**Environment Variables** (set in Railway dashboard):
```
OPENAI_API_KEY=sk-proj-your-key
NODE_ENV=production
PORT=3000  # Railway provides this automatically
```

**Deploy Steps**:
1. Connect GitHub repository to Railway
2. Add `OPENAI_API_KEY` environment variable
3. Railway runs `npm install` → `npm run build` → `npm start`
4. Single deployment serves both frontend + backend

**Railway Config** (optional `railway.toml`):
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
```

---

## Security Considerations

### ✅ What's Secure

- **API Key**: Never exposed to browser, stays on server
- **Environment Variables**: `.env` in `.gitignore`, Railway handles securely
- **Request Validation**: Express validates incoming requests
- **Error Handling**: Generic error messages to client (no internal details)

### ⚠️ Additional Hardening (Optional)

**Rate Limiting** (prevent abuse):
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**CORS** (if deploying frontend separately later):
```javascript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
```

**Request Size Limit**:
```javascript
app.use(express.json({ limit: '10kb' })); // Prevent large payloads
```

---

## API Contract

### Request Format

**Endpoint**: `POST /api/chat`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant for AI MOT..."
    },
    {
      "role": "user",
      "content": "What services do you offer?"
    }
  ]
}
```

### Response Format

**Success (200)**:
```json
{
  "message": "AI MOT offers consultation, audit, implementation, and training services..."
}
```

**Error (500)**:
```json
{
  "error": "Failed to get response from AI"
}
```

**Timeout**: Client aborts after 5 seconds

---

## Testing

### Manual Testing

**Backend Only**:
```bash
# Start server
npm run dev:server

# Test endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

**Full Stack**:
```bash
# Start both
npm run dev

# Open browser to http://localhost:5173
# Use chatbot interface
```

### Unit Tests

```typescript
// tests/integration/api-client.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { sendChatMessage } from '@/services/api-client';

describe('API Client', () => {
  let server: any;

  beforeAll(() => {
    // Start test server
  });

  afterAll(() => {
    // Stop test server
  });

  it('should send chat message and receive response', async () => {
    const messages = [{ role: 'user', content: 'test' }];
    const response = await sendChatMessage(messages);
    expect(response).toBeTruthy();
  });
});
```

---

## Dependencies

### Backend Dependencies

```json
{
  "express": "^4.18.2",         // Web server framework
  "openai": "^4.20.1",          // Official OpenAI SDK
  "dotenv": "^16.3.1"           // Environment variable management
}
```

### Dev Dependencies

```json
{
  "concurrently": "^8.2.2"      // Run dev:server + dev:client in parallel
}
```

### Optional (Production Hardening)

```json
{
  "express-rate-limit": "^7.1.5",  // Rate limiting
  "cors": "^2.8.5",                // CORS handling
  "helmet": "^7.1.0"               // Security headers
}
```

---

## Troubleshooting

### Common Issues

**1. Port 3000 already in use**:
```bash
# Change port in .env
PORT=3001

# Update vite.config.ts proxy target
target: 'http://localhost:3001'
```

**2. API key not found**:
```bash
# Verify .env file exists
cat .env

# Restart server after adding key
npm run dev
```

**3. CORS errors in development**:
- Ensure Vite proxy is configured correctly in `vite.config.ts`
- Check that requests go to `/api/chat` (not `http://localhost:3000/api/chat`)

**4. Production build not serving frontend**:
- Verify `dist/` folder exists after `npm run build`
- Check `server/index.js` static file path is correct
- Ensure `NODE_ENV=production` is set

---

## Performance

### Expected Metrics

- **Backend Response Time**: <100ms (excluding OpenAI API)
- **OpenAI API Time**: 1-3 seconds (variable)
- **Total Request Time**: 1-3.5 seconds
- **Timeout**: 5 seconds (client-side)

### Optimization

**1. Caching** (optional):
```javascript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache

app.post('/api/chat', async (req, res) => {
  const cacheKey = JSON.stringify(req.body.messages);
  const cached = cache.get(cacheKey);
  if (cached) return res.json({ message: cached });

  // ... OpenAI call ...
  cache.set(cacheKey, response);
});
```

**2. Connection Pooling**: OpenAI SDK handles this automatically

**3. Compression**:
```javascript
import compression from 'compression';
app.use(compression());
```

---

## Next Steps

1. ✅ Update `tasks.md` with backend tasks
2. ✅ Install new dependencies (`express`, `openai`, `dotenv`, `concurrently`)
3. ✅ Create `server/index.js`
4. ✅ Update `vite.config.ts` with proxy
5. ✅ Update `package.json` scripts
6. ✅ Create `.env` with `OPENAI_API_KEY`
7. ✅ Update frontend to call `/api/chat` instead of direct OpenAI

---

*Architecture designed for simplicity and Railway.app deployment*
