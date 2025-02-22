# Real-Time Chat Application Frontend

A modern real-time chat application built with Next.js that allows users to create private chat rooms and communicate instantly across multiple devices.

## Features

- Create private chat rooms instantly
- Join existing rooms with room ID
- Real-time messaging
- User presence indicators
- Message history
- Responsive design for all devices
- Dark mode support

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- WebSocket - Real-time communication
- TypeScript - Type safety

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd chat-app/frontend
```
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. start the development
```bash
npm run dev
# or
yarn dev
```
Environment Variables
Create a .env.local file in the root directory:
```
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```


