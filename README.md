# Web Tic Tac Toe – Real-Time Multiplayer

This project is a **self-learning, end-to-end full-stack implementation** of a real-time multiplayer Tic Tac Toe game.  
The goal of the project is not just to build a playable game, but to deeply understand **modern web architecture**, **real-time communication**, and **clean separation of concerns** across frontend and backend layers.

---

## Project Goals

-   Practice building a **real-time multiplayer system**
-   Gain hands-on experience with **WebSockets (Socket.IO)**
-   Design a **clean backend architecture** with proper layering
-   Work with **Prisma ORM** and relational data modeling
-   Enforce **game rules, validation, and ownership** on the server
-   Build a responsive frontend using **React + TypeScript + Vite**
-   Learn by implementing production-like patterns end to end

This project was built entirely for **learning purposes**, focusing on correctness, structure, and scalability rather than shortcuts.

---

## Technical Depth & Architecture

### Frontend (React + TypeScript + Vite)

-   Built with **Vite** for fast development and modern tooling
-   Fully typed with **TypeScript**
-   Component-based architecture
-   Game state is **server-authoritative**
-   Real-time updates via **Socket.IO client**
-   Enforces:
    -   Turn ownership (X / O)
    -   Disabled moves when not allowed
    -   Game over handling
-   Clean UI separation:
    -   Grid rendering
    -   Status display
    -   Join / Reset actions

---

### Backend (Node.js + Express + Socket.IO)

The backend follows a **layered architecture**:

routes / sockets
↓
controllers
↓
services (business logic)
↓
repositories (Prisma)
↓
database

#### Key Concepts Implemented:

-   **Server-authoritative game logic**
-   Real-time multiplayer via **Socket.IO**
-   Game lifecycle management:
    -   Game creation
    -   Joining existing games
    -   Turn-based move validation
    -   Win / draw detection
-   Strict validation:
    -   Valid turn
    -   Valid position
    -   Player ownership
    -   Game state consistency
-   Graceful error handling (no server crashes on invalid actions)

---

### Database (PostgreSQL + Prisma)

-   **Prisma ORM** for type-safe database access
-   JSON-based grid storage
-   Game state fields:
    -   `cells`
    -   `players`
    -   `turn`
    -   `winner`
    -   `gameOver`
-   Designed to support **multiple concurrent games**

---

## Technologies Used

-   **Frontend**

    -   React
    -   TypeScript
    -   Vite
    -   Socket.IO Client

-   **Backend**

    -   Node.js
    -   Express
    -   Socket.IO
    -   TypeScript
    -   Prisma ORM

-   **Database**
    -   PostgreSQL

---

## What I Learned

-   How real-time multiplayer systems actually work
-   Why server authority is critical in games
-   How to structure a backend beyond “just routes”
-   Practical Prisma usage with JSON fields
-   Managing state consistency across multiple clients
-   Debugging async, real-time flows

---

## Future Improvements

-   Spectator mode
-   Match history
-   Authentication
-   Game timers
-   Ranking system
-   AI opponent

---

## 📝 Notes

This project is intentionally **over-engineered for a simple game** in order to maximize learning and exposure to real-world backend and frontend patterns.

---

## 👤 Author

Built by **Ori Baruch** as part of a continuous self-learning journey in full-stack development, real-time systems, and software architecture.
