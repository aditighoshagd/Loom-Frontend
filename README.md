<div align="center">

# 🧵 Loom Frontend

### The React client for the Loom newsletter platform

*Read. Write. Subscribe. Connect.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-GKE-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**🌐 Live:** [loom.solvix.buzz](https://loom.solvix.buzz)  
**🔧 Backend:** [Loom (microservices)](https://github.com/aditighoshagd/Loom)

</div>

---

## 📖 Overview

This is the React frontend for **Loom** — a Substack-style newsletter platform. Writers can publish long-form newsletters, readers can subscribe to their favourite writers and get a personalised feed, and everyone gets access to an AI assistant that generates summaries, suggests tags, and powers semantic content discovery.

The frontend communicates exclusively with the Loom backend through the **API Gateway** at `/api/v1`.

---

## 🗂️ Pages & Routing

| Route | Component | Description |
|---|---|---|
| `/` | `Landing` | Public landing page for new visitors |
| `/home` | `HomePage` | Personalised feed from followed writers |
| `/explore` | `ExplorePage` | Global explore feed, discover new writers |
| `/inbox` | `InboxPage` | Notification inbox |
| `/activity` | `ActivityPage` | Activity log for your account |
| `/chat` | `ChatPage` | AI assistant chat interface |
| `/dashboard` | `DashboardPage` | Writer analytics and post management |
| `/create` | `CreatePage` | Rich text newsletter editor |
| `/login` | `LoginPage` | Login with JWT auth |
| `/signup` | `SignupPage` | Create a new Loom account |
| `/settings` | `SettingsPage` | Profile and account settings |
| `/post/:postId` | `PostPage` | Full newsletter view with comments |
| `/profile/:userId` | `ProfilePage` | Writer profile with all their posts |

---

## 🏗️ Project Structure

```
src/
├── App.jsx                   # Root router and provider tree
├── main.jsx                  # React entry point
├── styles.css                # Global Tailwind styles
├── assets/
│   └── loom-logo.png
├── routes/                   # One file per page/view
│   ├── index.jsx             # Landing page
│   ├── home.jsx              # Subscription feed
│   ├── explore.jsx           # Global explore feed
│   ├── inbox.jsx             # Notifications
│   ├── activity.jsx          # Activity log
│   ├── chat.jsx              # AI chat assistant
│   ├── dashboard.jsx         # Writer dashboard
│   ├── create.jsx            # Post editor
│   ├── login.jsx             # Login
│   ├── signup.jsx            # Signup
│   ├── settings.jsx          # Settings
│   ├── post.$postId.jsx      # Post detail view
│   └── profile.$userId.jsx   # User profile view
├── components/
│   ├── loom/                 # Platform-specific components
│   │   ├── AppLayout.jsx     # Root layout with sidebar
│   │   ├── Sidebar.jsx       # Desktop sidebar navigation
│   │   ├── MobileBottomNav.jsx  # Mobile bottom navigation
│   │   ├── NewsletterCard.jsx   # Feed post card
│   │   ├── NoteCard.jsx         # Short note card
│   │   ├── ExploreCard.jsx      # Explore feed card
│   │   ├── CommentSection.jsx   # Threaded comments
│   │   ├── LikeButton.jsx       # Like/unlike toggle
│   │   ├── ReloomPopover.jsx    # Restack (reshare) popover
│   │   ├── SubscribeButton.jsx  # Follow/unfollow button
│   │   ├── AIAssistantPanel.jsx # AI sidebar panel
│   │   ├── CategoryPills.jsx    # Category filter pills
│   │   ├── SearchBar.jsx        # Search input
│   │   ├── UserAvatar.jsx       # User avatar with fallback
│   │   ├── ThemeToggle.jsx      # Dark/light mode toggle
│   │   ├── CreateMenu.jsx       # Post creation dropdown menu
│   │   ├── LoomLogo.jsx         # Brand logo
│   │   └── EmptyState.jsx       # Empty placeholder state
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── api/                  # All backend API clients
│   │   ├── client.js         # Axios base client with JWT
│   │   ├── auth.js           # Signup / login / profile
│   │   ├── posts.js          # Posts CRUD, feeds, AI
│   │   ├── connections.js    # Follow / unfollow
│   │   ├── uploads.js        # File upload
│   │   ├── jwt.js            # JWT decode utilities
│   │   └── types.js          # Shared type constants
│   ├── auth/
│   │   └── context.jsx       # React Auth context + provider
│   ├── theme/
│   │   └── context.jsx       # Dark/light theme context
│   ├── use-api.js            # Custom hook for API calls with loading state
│   ├── loom-utils.js         # Loom-specific utility helpers
│   ├── utils.js              # General utilities (cn, etc.)
│   ├── error-capture.js      # Error boundary capture
│   └── error-page.js        # Error page renderer
└── hooks/
    └── use-mobile.js         # Hook to detect mobile viewport
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Routing** | React Router DOM 7 |
| **Forms** | React Hook Form + Zod |
| **State** | React Context (auth + theme) |
| **HTTP Client** | Custom Axios wrapper |
| **Icons** | Lucide React |
| **Notifications** | Sonner (toast) |
| **Containerisation** | Docker (Node 20 Alpine + serve) |
| **Deployment** | GKE (Google Kubernetes Engine) |

---

## ⚙️ Local Development

### Prerequisites
- Node.js 20+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/aditighoshagd/Loom-Frontend.git
cd Loom-Frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment
Create a `.env.local` file in the project root:
```env
VITE_API_BASE_URL=http://localhost:8080
```

Replace `localhost:8080` with your running API Gateway URL.

### 4. Start the dev server
```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🐳 Docker

### Build the image
```bash
docker build -t loom-frontend .
```

### Run the container
```bash
docker run -p 3000:3000 loom-frontend
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## ☁️ GKE Deployment

The frontend is deployed to GKE as part of the full Loom stack. The Docker image is hosted on Docker Hub at `aditiighosh/loom-frontend`.

```bash
# Build and push to Docker Hub (linux/amd64 for GKE compatibility)
docker build --platform linux/amd64 \
  -t aditiighosh/loom-frontend:latest \
  -t aditiighosh/loom-frontend:v1.0.2 .

docker push aditiighosh/loom-frontend:v1.0.2
docker push aditiighosh/loom-frontend:latest

# Deploy to GKE
kubectl apply -f k8s/frontend.yml
kubectl rollout status deployment/frontend
```

For the full GKE deployment setup including SSL and ingress, see the [backend repo](https://github.com/aditighoshagd/Loom).

---

## 🔑 API Integration

All API calls go through a single base Axios client in `src/lib/api/client.js` which automatically attaches the JWT token from `localStorage` to every request.

```js
// Example: Fetching the personalised feed
import { getFeed } from "@/lib/api/posts";

const { data } = await getFeed();
```

The `VITE_API_BASE_URL` environment variable controls where the API Gateway is located. In production on GKE, API calls go to `https://loom.solvix.buzz/api/v1` via the GCE Ingress.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

<div align="center">

Built with ❤️ using React, Tailwind CSS, and shadcn/ui

</div>
