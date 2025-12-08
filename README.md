# Social Network Frontend

A modern Next.js-based frontend for the Social Network application featuring real-time content discovery, user interactions, and admin controls.

## 🚀 Features

- 🔍 Hybrid search (Internal MongoDB + External Hacker News via Algolia)
- 👤 User authentication with role-based access control
- 📝 Story and comment creation with rich text support
- ❤️ Like/upvote system
- 🔖 Bookmark functionality
- 👥 Follow/unfollow users
- 🚨 Content reporting system
- 👨‍💼 Admin dashboard with moderation tools
- 📱 Fully responsive design (mobile, tablet, desktop)

## 🛠 Tech Stack

- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit
- **Icons**: React Icons
- **Authentication**: JWT (stored in cookies)

---

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd social-network-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Build for production
npm run build
npm run start
```

---

## 🌍 Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

---

## 👥 User Roles & Permissions

### 🔓 Unauthenticated User (Guest)

**Can Access:**

- ✅ View all public stories
- ✅ View all comments
- ✅ Search and filter content
- ✅ View user profiles
- ✅ Browse by tags (story, job, ask_hn, show_hn)

**Cannot Access:**

- ❌ Create stories or comments
- ❌ Like/upvote content
- ❌ Follow users
- ❌ Bookmark content
- ❌ Report content
- ❌ Edit or delete anything

**Available Actions:**

- Login
- Register

---

### 🔒 Authenticated User (USER)

**All Guest Permissions +**

**Can:**

- ✅ Create stories (types: story, ask_hn, show_hn, poll)
- ✅ Create comments and replies (depth limit: 1)
- ✅ Edit own stories and comments
- ✅ Delete own stories and comments
- ✅ Like/unlike stories and comments
- ✅ Follow/unfollow other users
- ✅ Bookmark stories and comments
- ✅ Report inappropriate content
- ✅ Update own profile (bio, photo, location, website)
- ✅ View own bookmarks and activity

**Cannot:**

- ❌ Create job postings
- ❌ Delete other users' content (unless admin)
- ❌ Access admin dashboard
- ❌ Block users or emails

---

### 💼 Employer (EMPLOYER)

**All Authenticated User Permissions +**

**Can:**

- ✅ Create job postings (type: job)
- ✅ All USER role permissions

**Special Features:**

- Job posts are labeled with "job" tag
- Can manage own job listings

---

### 👑 Admin (ADMIN)

**Full System Access**

**Can:**

- ✅ All USER and EMPLOYER permissions
- ✅ Delete any story or comment
- ✅ Block/unblock users
- ✅ Block/unblock email addresses
- ✅ View and manage all reports
- ✅ Restore deleted content
- ✅ View analytics dashboard
- ✅ View problematic users list
- ✅ View top contributors
- ✅ Access admin panel

**Admin Dashboard Features:**

- User management (block/unblock)
- Content moderation (delete/restore)
- Email blocking system
- Report management
- Analytics and statistics
- Trending content monitoring

---

## 📱 Key Features

### 🏠 Home Page

- Front page stories (hybrid: internal + Hacker News)
- Tag-based filtering (story, job, ask_hn, show_hn)
- Search functionality
- Sort by popularity or date
- Responsive card layout

### 📝 Story Details Page

- Full story with metadata (author, points, time)
- Share, edit, delete buttons (based on permissions)
- Bookmark functionality
- Report button
- Comments section with nested replies (depth: 1)
- Like/comment interactions
- Responsive layout for all screen sizes

### 💬 Comments System

- Create top-level comments
- Reply to comments (one level only)
- Edit/delete own comments
- Like comments
- Icons for metadata (user, points, time)
- Responsive threading

### 👤 User Profile

- View user's stories and comments
- Follow/unfollow
- Edit own profile (bio, photo, location, website)
- View followers and following count
- Bookmarks list (own profile only)

### 🔍 Search & Discovery

- Real-time search
- Filter by tags
- Sort options (relevance, date)
- Combines internal and external (HN) results
- Responsive results display

### 👨‍💼 Admin Dashboard

- User management table
- Content moderation tools
- Report queue with filtering
- Email blocking interface
- Analytics overview
- Problematic users monitoring

---

## 🎨 UI Components

### Icons Used Throughout

- **FaUser** - Author/username
- **FaStar** (yellow) - Points/likes
- **FaRegClock** - Timestamps
- **FaCommentAlt** - Comments count
- **FaExternalLinkAlt** - External links
- **BiLike/BiSolidLike** - Like buttons
- **Bookmark icon** - Save functionality

### Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl)

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── admin/               # Admin dashboard
│   ├── components/          # Shared components
│   ├── context/             # React context (Auth)
│   ├── details/[storyId]/   # Story detail pages
│   ├── home/                # Home page
│   ├── profile/             # User profiles
│   ├── search/              # Search pages
│   ├── services/            # API services
│   ├── store/               # Redux store
│   └── types/               # TypeScript types
├── components/ui/           # shadcn/ui components
└── public/                  # Static assets
```

---

## 🔑 Key Pages & Routes

| Route                 | Description     | Auth Required   |
| --------------------- | --------------- | --------------- |
| `/`                   | Landing page    | ❌              |
| `/home`               | Main feed       | ❌              |
| `/details/[storyId]`  | Story details   | ❌              |
| `/logIn`              | Login page      | ❌              |
| `/register`           | Registration    | ❌              |
| `/profile/[username]` | User profile    | ❌              |
| `/search`             | Search results  | ❌              |
| `/admin`              | Admin dashboard | ✅ (Admin only) |

---

## 🎯 Special Features

### Comment Threading

- **Depth Limit**: 1 (only one level of replies)
- Top-level comments can have replies
- Replies cannot have further replies
- Reply button hidden at depth 1

### Story Types

- **story**: Regular posts
- **job**: Job postings (EMPLOYER/ADMIN only)
- **ask_hn**: Ask HN style posts
- **show_hn**: Show HN style posts
- **poll**: Polls

### Hybrid Content System

- **Internal Stories**: UUID format (e.g., `abc-123-def`)
- **External Stories**: Numeric IDs (e.g., `12345`)
- External stories fetch metadata from Algolia
- Comments for external stories are MongoDB-only

### Responsive Design

- Mobile-first approach
- Stacked layouts on mobile
- Horizontal layouts on desktop
- Touch-friendly buttons on mobile
- Optimized image loading

---

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel deploy

# Deploy to production
vercel --prod
```

### Docker

```bash
docker build -t social-network-frontend .
docker run -p 3001:3001 social-network-frontend
```

---

## 🔧 Configuration

### Tailwind CSS

Custom configuration in `tailwind.config.ts`

- Custom colors (cyan theme)
- Responsive breakpoints
- Custom animations

### Redux Store

State management for:

- User authentication
- Profile data
- Bookmarks
- UI state

---

## 🎨 Design System

### Color Palette

- **Primary**: Cyan
- **Accent**: Blue
- **Text**: Gray
- **Background**: White/Light Gray

### Typography

- **Font**: System font stack
- **Headings**: Bold, larger sizes
- **Body**: Regular, readable sizes

---

## 📄 License

MIT

---

## 👥 Team

- Preethi Rajesh Yennemadi - Section 4 - Grad Student MSCS
- Kalyana Ramanuja Swami Mudumby - Section 4 - Grad Student MSCS
- Mrinal Srinath Setty - Section 4 - Grad Student MSCS

---

## 🔗 Links

- [Backend Repository](https://github.com/CS5610-NEU-Fall2025-SEC4/social-network-backend)
- [Frontend Repository](https://github.com/CS5610-NEU-Fall2025-SEC4/social-network-webdev-final-project)
