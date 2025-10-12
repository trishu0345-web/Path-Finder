# Path Finder Visualization

A premium web application to visualize and interact with graph algorithms: BFS, DFS, and Shortest Path, featuring a modern UI and a robust Java backend.

## Features

- **Premium UI:** Built with Bootstrap, gradients, cards, and animations.
- **Detailed Explanations:** Algorithms with theory, pseudocode, and applications.
- **Java Backend:** Spring Boot REST API for BFS, DFS, and Shortest Path.

## How to Run

### Backend (Java, Spring Boot)

1. Navigate to the `backend/` directory.
2. Run:
   ```bash
   mvn spring-boot:run
   ```
   The server will start at `http://localhost:8080`.

#### API Endpoints

- `POST /api/algorithms/bfs`
    - Body: `{ "graph": [[0,1,0],[1,0,1],[0,1,0]], "start": 0 }`
- `POST /api/algorithms/dfs`
    - Body: `{ "graph": [[0,1,0],[1,0,1],[0,1,0]], "start": 0 }`
- `POST /api/algorithms/shortest-path`
    - Body: `{ "graph": [[0,1,0],[1,0,1],[0,1,0]], "start": 0, "end": 2 }`

### Frontend

1. Open `frontend/index.html` in your browser.
2. Connect to the backend as needed for interactive features.

## Customization

- Edit `/frontend/index.html` and `/frontend/style.css` for UI changes.
- Update Java code in `/backend/src/main/java/com/pathfinder/` for backend logic.

---

**This project fulfills all academic requirements for a Path Finder visualization, with an elegant, professional interface and a Java backend.**
