# Rooms - Project Structure

A modern chat application built with React (Vite) frontend and Node.js (Express) backend.

## 📁 Project Structure

```
Rooms/
│
├── backend/                                  # Node.js + Express API (TypeScript)
│   ├── .env.local                           # Environment variables template
│   ├── .gitignore                           # Git ignore rules
│   ├── tsconfig.json                        # TypeScript configuration
│   ├── MIGRATION.md                         # TypeScript migration documentation
│   ├── package.json                         # Backend dependencies
│   ├── render.yaml                          # Render deployment configuration
│   │
│   ├── public/                              # Static assets
│   │   └──
│   │
│   └── src/                                 # Source code
│       ├── app.ts                          # Main application entry point
│       │
│       ├── types/                          # TypeScript type definitions
│       │   └── index.ts                   # Shared interfaces and types
│       │
│       ├── controllers/                    # Route controllers
│       │   ├── authControllers.ts         # Authentication logic
│       │   ├── messageController.ts       # Message/chat operations
│       │   └── roomsController.ts         # Room CRUD operations
│       │
│       ├── helpers/                        # Helper utilities
│       │   ├── ApiError.ts                # Custom error class
│       │   └── asyncHandler.ts            # Async error wrapper
│       │
│       ├── middleware/                     # Express middleware
│       │   ├── errorHandler.ts            # Centralized error handling
│       │   └── requireAuth.ts             # Authentication middleware
│       │
│       ├── models/                         # Mongoose models
│       │   ├── messages.ts                # Message schema
│       │   ├── rooms.ts                   # Room schema
│       │   └── users.ts                   # User schema
│       │
│       └── routes/                         # API routes
│           ├── authRoutes.ts              # Authentication endpoints
│           ├── messageRoutes.ts           # Message endpoints
│           └── roomsRoutes.ts             # Room endpoints
│
└── frontend/                                # React + Vite + TypeScript
    ├── .env.example                        # Environment variables template
    ├── .gitignore                          # Git ignore rules
    ├── index.html                          # HTML entry point
    ├── package.json                        # Frontend dependencies
    ├── postcss.config.js                   # PostCSS configuration
    ├── tailwind.config.js                  # Tailwind CSS config
    ├── vite.config.ts                      # Vite configuration
    ├── netlify.toml                        # Netlify deployment config
    ├── README.md                           # Project documentation
    │
    ├── build/                              # Production build output
    │   ├── index.html
    │   └── assets/
    │       ├── index-CY4CGXk1.js
    │       └── index-DdtkHFvO.css
    │
    └── src/                                # Source code
        ├── App.tsx                         # Root app component
        ├── main.tsx                        # Application entry point
        ├── index.css                       # Global styles
        ├── vite-env.d.ts                   # Vite type definitions
        ├── mockData.ts                     # Mock data for development
        ├── Attributions.md                 # Third-party attributions
        │
        ├── components/                     # Reusable components
        │   ├── AnimatedBackground.tsx
        │   ├── AppModal.tsx
        │   ├── AppSkeleton.tsx
        │   ├── RoomBackground.tsx
        │   ├── RoomCard.tsx
        │   │
        │   ├── figma/
        │   │   └── ImageWithFallback.tsx
        │   │
        │   └── ui/                         # shadcn/ui components
        │       ├── accordion.tsx
        │       ├── alert-dialog.tsx
        │       ├── alert.tsx
        │       ├── aspect-ratio.tsx
        │       ├── avatar.tsx
        │       ├── badge.tsx
        │       ├── breadcrumb.tsx
        │       ├── button.tsx
        │       ├── calendar.tsx
        │       ├── card.tsx
        │       ├── carousel.tsx
        │       ├── chart.tsx
        │       ├── checkbox.tsx
        │       ├── collapsible.tsx
        │       ├── command.tsx
        │       ├── context-menu.tsx
        │       ├── dialog.tsx
        │       ├── drawer.tsx
        │       ├── dropdown-menu.tsx
        │       ├── form.tsx
        │       ├── hover-card.tsx
        │       ├── input-otp.tsx
        │       ├── input.tsx
        │       ├── label.tsx
        │       ├── menubar.tsx
        │       ├── navigation-menu.tsx
        │       ├── pagination.tsx
        │       ├── popover.tsx
        │       ├── progress.tsx
        │       ├── radio-group.tsx
        │       ├── resizable.tsx
        │       ├── scroll-area.tsx
        │       ├── select.tsx
        │       ├── separator.tsx
        │       ├── sheet.tsx
        │       ├── sidebar.tsx
        │       ├── skeleton.tsx
        │       ├── slider.tsx
        │       ├── sonner.tsx
        │       ├── switch.tsx
        │       ├── table.tsx
        │       ├── tabs.tsx
        │       ├── textarea.tsx
        │       ├── toggle-group.tsx
        │       ├── toggle.tsx
        │       ├── tooltip.tsx
        │       └── ...
        │
        ├── helpers/                        # Helper functions
        │   ├── apiRoutes.ts               # API route definitions
        │   ├── AppRequest.ts              # Axios API wrapper
        │   ├── constant.ts                # App constants
        │   └── misc.ts                    # Miscellaneous utilities
        │
        ├── hooks/                          # Custom React hooks
        │   ├── index.ts                   # Hook exports
        │   ├── useAppRequest.ts           # API request hook
        │   └── useDebouncedValue.ts       # Debounce value hook
        │
        ├── modules/                        # Feature modules
        │   │
        │   ├── auth/                       # Authentication module
        │   │   ├── pages.tsx
        │   │   └── components/
        │   │       ├── LandingPage.tsx
        │   │       ├── LoginPage.tsx
        │   │       ├── OnboardingPage.tsx
        │   │       └── SignupPage.tsx
        │   │
        │   ├── chat/                       # Chat module
        │   │   ├── pages.tsx
        │   │   └── components/
        │   │       ├── BackgroundDecor.tsx
        │   │       ├── ChatListPage.tsx
        │   │       └── ...
        │   │
        │   ├── notifications/              # Notifications module
        │   │   ├── pages.tsx
        │   │   └── components/
        │   │       └── ...
        │   │
        │   └── settings/                   # Settings module
        │       ├── pages.tsx
        │       └── components/
        │           └── SettingsPage.tsx
        │
        ├── routes/                         # Routing configuration
        │   ├── OnboardingGate.tsx         # Onboarding guard
        │   ├── index.tsx                  # Route definitions
        │   ├── AppLayout.tsx              # App layout wrapper
        │   ├── AuthLayout.tsx             # Auth layout wrapper
        │   └── ProtectedRoute.tsx         # Auth guard
        │
        ├── store/                          # Zustand state management
        │   ├── index.ts                   # Store exports
        │   ├── authStore.ts               # Authentication state
        │   ├── chatStore.ts               # Chat state
        │   ├── notificationsStore.ts      # Notifications state
        │   └── settingsStore.ts           # Settings state
        │
        ├── styles/                         # Stylesheets
        │   └── globals.css                # Global CSS with Tailwind
        │
        └── types/                          # TypeScript types
            └── index.ts                    # Type definitions
```

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcrypt
- **Validation**: validator.js
- **Error Handling**: Custom ApiError + asyncHandler
- **Development**: ts-node-dev (hot reload)

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Notifications**: Sonner

## 🚀 API Endpoints

### Autheforgot-password` - Password reset request

- `POST /reset-password` - Reset password with token
- `GET /me` - Get current user account (protected)
- `PATCH /me` - Update user profile (protected)
- `POST /me/change-password` - Change user password (protected)

### Rooms (`/api/v1/rooms`)

- `GET /` - Get all rooms (protected)
- `POST /` - Create new room (protected)
- `GET /:id` - Get room by ID (protected)
- `POST /:id/leave` - Leave a room (protected)

### Messages (`/api/v1/rooms/chat`)

Real-time chat rooms

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ User profile management
- ✅ Room creation and management
- ✅ Message history and read receipts
- ✅ Centralized error handling
- ✅ Form validation
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Type-safe API requests
- ✅ Toast notifications
- ✅ Protected routes
- ✅ Onboarding flow
- ✅ Animated backgrounds and UI transition

## 📝 Features

- ✅ Modern CSR (Client-Side Rendering) architecture
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Centralized error handling
- ✅ Form validation
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Type-safe API requests
- ✅ Toast notifications
- ✅ Protected routes
