// Define a tree structure as in the image (BFS/DFS demo)
const nodes = [0, 1, 2, 3, 4, 5, 6, 7];
const edges = [
  [0, 1], [0, 2], [0, 3],
  [1, 4], [1, 5],
  [2, 6],
  [3, 7]
];
// Node positions for tree layout
const positions = [
  {x: 400, y: 60},   // 0
  {x: 200, y: 160},  // 1
  {x: 400, y: 160},  // 2
  {x: 600, y: 160},  // 3
  {x: 120, y: 260},  // 4
  {x: 280, y: 260},  // 5
  {x: 400, y: 260},  // 6
  {x: 600, y: 260}   // 7
];

// Draw the graph with optional highlighting
function drawGraph(canvasId, highlightNodes = [], highlightEdges = []) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(positions[a].x, positions[a].y);
    ctx.lineTo(positions[b].x, positions[b].y);
    ctx.strokeStyle = highlightEdges.some(([ha, hb]) => (ha === a && hb === b) || (ha === b && hb === a)) ? "#e67e22" : "#888";
    ctx.lineWidth = highlightEdges.some(([ha, hb]) => (ha === a && hb === b) || (ha === b && hb === a)) ? 5 : 2;
    ctx.stroke();
  });

  // Draw nodes
  nodes.forEach((node, i) => {
    ctx.beginPath();
    ctx.arc(positions[i].x, positions[i].y, 32, 0, 2 * Math.PI);
    ctx.fillStyle = highlightNodes.includes(i) ? "#43c6ac" : "#fff";
    ctx.strokeStyle = highlightNodes.includes(i) ? "#e67e22" : "#333";
    ctx.lineWidth = highlightNodes.includes(i) ? 5 : 2;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#222";
    ctx.font = "bold 22px Segoe UI";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node, positions[i].x, positions[i].y);
  });
}

// BFS traversal (layer order)
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
      if (a === node && !visited[b]) {
        queue.push(b);
        visited[b] = true;
        traversedEdges.push([a, b]);
      }
    });
  }
  drawGraph("graph-canvas-bfs", order, traversedEdges);
  document.getElementById("bfs-output").innerText = "BFS Order: " + order.join(" → ");
}

// DFS traversal (preorder)
function runDFS() {
  let visited = Array(nodes.length).fill(false);
  let order = [];
  let traversedEdges = [];
  function dfs(node) {
    visited[node] = true;
    order.push(node);
    edges.forEach(([a, b]) => {
      if (a === node && !visited[b]) {
        traversedEdges.push([a, b]);
        dfs(b);
      }
    });
  }
  dfs(0);
  drawGraph("graph-canvas-dfs", order, traversedEdges);
  document.getElementById("dfs-output").innerText = "DFS Order: " + order.join(" → ");
}

// Shortest path from 0 to 7 (BFS)
function runShortestPath() {
  let start = 0, end = 7;
  let visited = Array(nodes.length).fill(false);
  let prev = Array(nodes.length).fill(-1);
  let queue = [start];
  visited[start] = true;
  while (queue.length > 0) {
    let node = queue.shift();
    if (node === end) break;
    edges.forEach(([a, b]) => {
      if (a === node && !visited[b]) {
        queue.push(b);
        visited[b] = true;
        prev[b] = node;
      }
    });
  }
  let path = [];
  for (let at = end; at !== -1; at = prev[at]) path.push(at);
  path.reverse();
  let pathEdges = [];
  for (let i = 0; i < path.length - 1; ++i) pathEdges.push([path[i], path[i + 1]]);
  drawGraph("graph-canvas-path", path, pathEdges);
  document.getElementById("path-output").innerText = "Shortest Path: " + path.join(" → ");
}

// Dijkstra: all edges weight 1 for this tree, same as BFS shortest path
function runDijkstra() {
  let start = 0, end = 7;
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
    edges.forEach(([a, b]) => {
      if (a === u && !visited[b] && dist[u] + 1 < dist[b]) {
        dist[b] = dist[u] + 1;
        prev[b] = u;
      }
    });
  }
  // Reconstruct path
  let path = [];
  for (let at = end; at !== -1; at = prev[at]) path.push(at);
  path.reverse();
  let pathEdges = [];
  for (let i = 0; i < path.length - 1; ++i) pathEdges.push([path[i], path[i + 1]]);
  drawGraph("graph-canvas-dijkstra", path, pathEdges);
  document.getElementById("dijkstra-output").innerText = "Dijkstra Path: " + path.join(" → ") + " (Distance: " + dist[end] + ")";
}

// Draw all graphs on load
window.onload = function () {
  drawGraph("graph-canvas-bfs");
  drawGraph("graph-canvas-dfs");
  drawGraph("graph-canvas-path");
  drawGraph("graph-canvas-dijkstra");
};
