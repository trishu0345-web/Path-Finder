// --- Graph Data ---
const nodes = [0, 1, 2, 3];
const positions = [
  { x: 100, y: 100 },
  { x: 250, y: 50 },
  { x: 250, y: 150 },
  { x: 400, y: 100 }
];
const edges = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3]
];
const weights = [
  [0, 2, 4, 0],
  [2, 0, 0, 3],
  [4, 0, 0, 1],
  [0, 3, 1, 0]
];

// --- Drawing Logic ---
function drawGraph(canvasId, highlightNodes = [], highlightEdges = []) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all edges
  edges.forEach(([a, b], i) => {
    ctx.beginPath();
    ctx.moveTo(positions[a].x, positions[a].y);
    ctx.lineTo(positions[b].x, positions[b].y);
    ctx.strokeStyle = highlightEdges.some(
      ([ha, hb]) => (ha === a && hb === b) || (ha === b && hb === a)
    )
      ? "#e67e22"
      : "#888";
    ctx.lineWidth = highlightEdges.some(
      ([ha, hb]) => (ha === a && hb === b) || (ha === b && hb === a)
    )
      ? 5
      : 2;
    ctx.stroke();
    // Draw weight (for Dijkstra)
    if (canvasId === "graph-canvas-dijkstra") {
      ctx.fillStyle = "#333";
      ctx.font = "bold 15px Segoe UI";
      ctx.fillText(
        weights[a][b] || weights[b][a],
        (positions[a].x + positions[b].x) / 2 + 10,
        (positions[a].y + positions[b].y) / 2
      );
    }
  });

  // Draw all nodes
  nodes.forEach((node, i) => {
    ctx.beginPath();
    ctx.arc(positions[i].x, positions[i].y, 22, 0, 2 * Math.PI);
    ctx.fillStyle = highlightNodes.includes(i) ? "#43c6ac" : "#fff";
    ctx.strokeStyle = highlightNodes.includes(i) ? "#e67e22" : "#333";
    ctx.lineWidth = highlightNodes.includes(i) ? 5 : 2;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#222";
    ctx.font = "bold 18px Segoe UI";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node, positions[i].x, positions[i].y);
  });
}

// --- BFS DEMO ---
function runBFS() {
  let visited = Array(nodes.length).fill(false);
  let queue = [0];
  let order = [];
  let traversedEdges = [];
  visited[0] = true;
  while (queue.length > 0) {
    let node = queue.shift();
    order.push(node);
    edges.forEach(([a, b]) => {
      let neighbor = null;
      if (a === node && !visited[b]) neighbor = b;
      else if (b === node && !visited[a]) neighbor = a;
      if (neighbor !== null) {
        queue.push(neighbor);
        visited[neighbor] = true;
        traversedEdges.push([node, neighbor]);
      }
    });
  }
  drawGraph("graph-canvas-bfs", order, traversedEdges);
  document.getElementById("bfs-output").innerText =
    "BFS Order: " + order.join(" → ");
}

// --- DFS DEMO ---
function runDFS() {
  let visited = Array(nodes.length).fill(false);
  let order = [];
  let traversedEdges = [];
  function dfs(node) {
    visited[node] = true;
    order.push(node);
    edges.forEach(([a, b]) => {
      let neighbor = null;
      if (a === node && !visited[b]) neighbor = b;
      else if (b === node && !visited[a]) neighbor = a;
      if (neighbor !== null && !visited[neighbor]) {
        traversedEdges.push([node, neighbor]);
        dfs(neighbor);
      }
    });
  }
  dfs(0);
  drawGraph("graph-canvas-dfs", order, traversedEdges);
  document.getElementById("dfs-output").innerText =
    "DFS Order: " + order.join(" → ");
}

// --- Shortest Path Demo (BFS for unweighted) ---
function runShortestPath() {
  let start = 0,
    end = 3;
  let visited = Array(nodes.length).fill(false);
  let prev = Array(nodes.length).fill(-1);
  let queue = [start];
  visited[start] = true;
  while (queue.length > 0) {
    let node = queue.shift();
    if (node === end) break;
    edges.forEach(([a, b]) => {
      let neighbor = null;
      if (a === node && !visited[b]) neighbor = b;
      else if (b === node && !visited[a]) neighbor = a;
      if (neighbor !== null) {
        queue.push(neighbor);
        visited[neighbor] = true;
        prev[neighbor] = node;
      }
    });
  }
  let path = [];
  for (let at = end; at !== -1; at = prev[at]) path.push(at);
  path.reverse();
  // Convert path to edge pairs
  let pathEdges = [];
  for (let i = 0; i < path.length - 1; ++i) {
    pathEdges.push([path[i], path[i + 1]]);
  }
  drawGraph("graph-canvas-path", path, pathEdges);
  document.getElementById("path-output").innerText =
    "Shortest Path: " + path.join(" → ");
}

// --- Dijkstra Demo (for weighted) ---
function runDijkstra() {
  let start = 0,
    end = 3;
  let dist = Array(nodes.length).fill(Infinity);
  let prev = Array(nodes.length).fill(-1);
  let visited = Array(nodes.length).fill(false);
  dist[start] = 0;

  for (let count = 0; count < nodes.length; count++) {
    let u = -1;
    for (let i = 0; i < nodes.length; i++) {
      if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (dist[u] === Infinity) break;
    visited[u] = true;
    for (let v = 0; v < nodes.length; v++) {
      if (
        weights[u][v] > 0 &&
        !visited[v] &&
        dist[u] + weights[u][v] < dist[v]
      ) {
        dist[v] = dist[u] + weights[u][v];
        prev[v] = u;
      }
    }
  }
  // Reconstruct path
  let path = [];
  for (let at = end; at !== -1; at = prev[at]) path.push(at);
  path.reverse();
  let pathEdges = [];
  for (let i = 0; i < path.length - 1; ++i) {
    pathEdges.push([path[i], path[i + 1]]);
  }
  drawGraph("graph-canvas-dijkstra", path, pathEdges);
  document.getElementById("dijkstra-output").innerText =
    "Dijkstra Path: " + path.join(" → ") + " (Distance: " + dist[end] + ")";
}

// --- Always show graphs on page load ---
window.onload = function () {
  drawGraph("graph-canvas-bfs");
  drawGraph("graph-canvas-dfs");
  drawGraph("graph-canvas-path");
  drawGraph("graph-canvas-dijkstra");
};
