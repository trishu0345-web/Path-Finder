// Demo logic for BFS, DFS, Shortest Path, and Dijkstra

// Example graph: nodes are 0,1,2,3 (A,B,C,D)
const nodes = ["A", "B", "C", "D"];
const edges = [
  [0, 1], [0, 2], [1, 3], [2, 3], [1, 2]
];
const weights = {
  '0-1': 2, '0-2': 6, '1-3': 3, '2-3': 1, '1-2': 4
};

function drawGraph(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Node positions
  const positions = [
    {x:60, y:100}, {x:170, y:50}, {x:170, y:150}, {x:280, y:100}
  ];
  // Draw edges
  edges.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(positions[a].x, positions[a].y);
    ctx.lineTo(positions[b].x, positions[b].y);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 3;
    ctx.stroke();
    // If weights exist, draw them
    if (canvasId === "graph-canvas-dijkstra") {
      const midX = (positions[a].x + positions[b].x)/2;
      const midY = (positions[a].y + positions[b].y)/2;
      ctx.fillStyle = "#f8ffae";
      ctx.font = "bold 16px Segoe UI";
      ctx.fillText(weights[`${a}-${b}`] || weights[`${b}-${a}`], midX, midY-8);
    }
  });
  // Draw nodes
  positions.forEach((pos, i) => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, 2*Math.PI);
    ctx.fillStyle = "#43c6ac";
    ctx.fill();
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = "#222";
    ctx.font = "bold 18px Segoe UI";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(nodes[i], pos.x, pos.y);
  });
}

window.onload = function() {
  drawGraph('graph-canvas-bfs');
  drawGraph('graph-canvas-dfs');
  drawGraph('graph-canvas-path');
  drawGraph('graph-canvas-dijkstra');
};

// BFS Demo
function runBFS() {
  let visited = Array(nodes.length).fill(false);
  let queue = [0];
  let order = [];
  visited[0] = true;
  while (queue.length > 0) {
    let node = queue.shift();
    order.push(nodes[node]);
    edges.forEach(([a, b]) => {
      let neighbor = null;
      if (a === node && !visited[b]) neighbor = b;
      else if (b === node && !visited[a]) neighbor = a;
      if (neighbor !== null) {
        queue.push(neighbor);
        visited[neighbor] = true;
      }
    });
  }
  document.getElementById("bfs-output").innerText = "BFS Order: " + order.join(" → ");
}

// DFS Demo
function runDFS() {
  let visited = Array(nodes.length).fill(false);
  let order = [];
  function dfs(node) {
    visited[node] = true;
    order.push(nodes[node]);
    edges.forEach(([a, b]) => {
      let neighbor = null;
      if (a === node && !visited[b]) neighbor = b;
      else if (b === node && !visited[a]) neighbor = a;
      if (neighbor !== null) dfs(neighbor);
    });
  }
  dfs(0);
  document.getElementById("dfs-output").innerText = "DFS Order: " + order.join(" → ");
}

// Shortest Path Demo (BFS)
function runShortestPath() {
  let start = 0, end = 3;
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
  // Reconstruct path
  let path = [];
  for (let at = end; at !== -1; at = prev[at]) path.push(nodes[at]);
  path.reverse();
  document.getElementById("path-output").innerText = "Shortest Path: " + path.join(" → ");
}

// Dijkstra Demo
function runDijkstra() {
  let start = 0, end = 3;
  let dist = Array(nodes.length).fill(Infinity);
  let prev = Array(nodes.length).fill(-1);
  let visited = Array(nodes.length).fill(false);
  dist[start] = 0;
  for (let i = 0; i < nodes.length; i++) {
    // Find unvisited node with smallest dist
    let u = -1;
    for (let j = 0; j < nodes.length; j++) {
      if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
    }
    if (dist[u] === Infinity) break;
    visited[u] = true;
    edges.forEach(([a, b]) => {
      let neighbor = (a === u) ? b : (b === u) ? a : null;
      if (neighbor !== null) {
        let weight = weights[`${u}-${neighbor}`] || weights[`${neighbor}-${u}`];
        if (dist[u] + weight < dist[neighbor]) {
          dist[neighbor] = dist[u] + weight;
          prev[neighbor] = u;
        }
      }
    });
  }
  // Reconstruct path
  let path = [];
  for (let at = end; at !== -1; at = prev[at]) path.push(nodes[at]);
  path.reverse();
  document.getElementById("dijkstra-output").innerText =
    "Dijkstra's Shortest Path: " + path.join(" → ") + " (Total cost: " + dist[end] + ")";
}
