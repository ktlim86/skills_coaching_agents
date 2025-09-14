# Chat Website - Next.js Setup

## Project Overview
A simple chat website built with Next.js and Node.js that allows users to interact through chat conversations.

## Setup Instructions

### Prerequisites
- Node.js 18+ (currently using v22.0.0)
- npm (currently using v10.5.1)
- NVM (for Node.js version management)

### Installation
1. Navigate to the project directory:
   ```bash
   cd /Users/limkimtee/skills/web/chat-website
   ```

2. Ensure Node.js is available (via NVM):
   ```bash
   source ~/.nvm/nvm.sh
   ```

3. Install dependencies (already done):
   ```bash
   npm install
   ```

### Development Server
Start the development server:
```bash
source ~/.nvm/nvm.sh && npm run dev
```

The application will be available at:
- Local: http://localhost:3000
- Network: http://127.0.2.2:3000

### Project Structure
```
web/chat-website/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout component
│       ├── page.tsx        # Homepage component
│       ├── globals.css     # Global styles
│       └── favicon.ico     # Site favicon
├── public/                 # Static assets
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── postcss.config.mjs     # PostCSS configuration (for Tailwind)
└── README.md              # Next.js default documentation
```

### Technologies Used
- **Next.js 15.5.2** with App Router
- **React 19.1.0**
- **TypeScript 5**
- **Tailwind CSS 4** for styling
- **ESLint** for code linting
- **Turbopack** for fast development builds

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps
This completes the foundation setup. The next user stories will build:
1. Basic chat interface components (US-2025-002)
2. Message input and send functionality (US-2025-003)  
3. Message display and storage (US-2025-004)

## Story Status
- ✅ Next.js 15.5.2 with App Router installed
- ✅ TypeScript configuration complete
- ✅ Development server running successfully
- ✅ Basic project structure established
- ✅ ESLint and Tailwind CSS configured
- ✅ Homepage component accessible
