// Example graph for demo (edit as needed)
const nodes = [0, 1, 2, 3, 4, 5, 6, 7];
const edges = [
  [0, 1], [0, 2], [1, 3], [1, 4],
  [2, 5], [2, 6], [5, 7], [4, 7]
];

// Optionally, define weights for Dijkstra's (edge [a, b] => weight)
const edgeWeights = {
  "0-1": 1, "0-2": 2, "1-3": 1, "1-4": 3,
  "2-5": 1, "2-6": 2, "5-7": 1, "4-7": 2
};

function drawGraph(canvasId, highlightNodes = [], highlightEdges = []) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  // Simple node positioning for demo
  const positions = [
    [80, 130], [180, 60], [180, 200], [300, 30],
    [300, 110], [300, 190], [420, 200], [420, 60]
  ];

  // Draw edges
  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(...positions[a]);
    ctx.lineTo(...positions[b]);
    let isHighlight = highlightEdges.some(
      ([x, y]) => (x === a && y === b) || (x === b && y === a)
    );
    ctx.strokeStyle = isHighlight ? "#f39c12" : "#bbb";
    ctx.lineWidth = isHighlight ? 4 : 2;
    ctx.stroke();
  });

  // Draw nodes
  nodes.forEach((node, idx) => {
    ctx.beginPath();
    ctx.arc(...positions[idx], 18, 0, 2 * Math.PI);
    ctx.fillStyle = highlightNodes.includes(node) ? "#43c6ac" : "#fff";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#222";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node, positions[idx][0], positions[idx][1]);
  });
}

// BFS Demo
function runBFS() {
  let visited = Array(nodes.length).fill(false);
  let queue = [0], order = [], traversedEdges = [];
  visited[0] = true;
  while (queue.length > 0) {
    let node = queue.shift();
    order.push(node);
    edges.forEach(([a, b]) => {
      if (a === node && !visited[b]) {
        queue.push(b); visited[b] = true; traversedEdges.push([a, b]);
      }
    });
  }
  drawGraph("graph-canvas-bfs", order, traversedEdges);
  document.getElementById("bfs-output").innerText = "BFS Order: " + order.join(" → ");
}

// DFS Demo
function runDFS() {
  let visited = Array(nodes.length).fill(false), order = [], traversedEdges = [];
  function dfs(node) {
    visited[node] = true; order.push(node);
    edges.forEach(([a, b]) => {
      if (a === node && !visited[b]) { traversedEdges.push([a, b]); dfs(b); }
    });
  }
  dfs(0);
  drawGraph("graph-canvas-dfs", order, traversedEdges);
  document.getElementById("dfs-output").innerText = "DFS Order: " + order.join(" → ");
}

// Shortest Path Demo (Unweighted BFS)
function runShortestPath() {
  let start = 0, end = 7;
  let visited = Array(nodes.length).fill(false), prev = Array(nodes.length).fill(-1);
  let queue = [start]; visited[start] = true;
  while (queue.length > 0) {
    let node = queue.shift(); if (node === end) break;
    edges.forEach(([a, b]) => {
      if (a === node && !visited[b]) { queue.push(b); visited[b] = true; prev[b] = node; }
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

// Dijkstra's Demo (Weighted)
function runDijkstra() {
  let start = 0, end = 7, n = nodes.length;
  let dist = Array(n).fill(Infinity), prev = Array(n).fill(-1), visited = Array(n).fill(false);
  dist[start] = 0;

  for (let count = 0; count < n; ++count) {
    let u = -1;
    for (let i = 0; i < n; ++i)
      if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;
    if (dist[u] === Infinity) break;
    visited[u] = true;
    edges.forEach(([a, b]) => {
      if (a === u && !visited[b]) {
        let w = edgeWeights[`${a}-${b}`] || edgeWeights[`${b}-${a}`] || 1;
        if (dist[b] > dist[u] + w) {
          dist[b] = dist[u] + w;
          prev[b] = u;
        }
      }
    });
  }

  let path = [];
  for (let at = end; at !== -1; at = prev[at]) path.push(at);
  path.reverse();
  let pathEdges = [];
  for (let i = 0; i < path.length - 1; ++i) pathEdges.push([path[i], path[i + 1]]);
  drawGraph("graph-canvas-dijkstra", path, pathEdges);
  document.getElementById("dijkstra-output").innerText =
    "Dijkstra's Path: " + path.join(" → ") + " (Cost: " + dist[end] + ")";
}

// Draw graphs on load
window.addEventListener('DOMContentLoaded', function () {
  drawGraph("graph-canvas-bfs");
  drawGraph("graph-canvas-dfs");
  drawGraph("graph-canvas-path");
  drawGraph("graph-canvas-dijkstra");
});
