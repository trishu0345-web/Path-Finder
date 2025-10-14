package com.pathfinder;

import java.util.*;

public class GraphAlgorithms {

    // BFS
    public static List<Integer> bfs(int[][] graph, int start) {
        List<Integer> result = new ArrayList<>();
        boolean[] visited = new boolean[graph.length];
        Queue<Integer> queue = new LinkedList<>();
        queue.add(start);
        visited[start] = true;

        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);
            for (int i = 0; i < graph[node].length; i++) {
                if (graph[node][i] == 1 && !visited[i]) {
                    queue.add(i);
                    visited[i] = true;
                }
            }
        }
        return result;
    }

    // DFS
    public static List<Integer> dfs(int[][] graph, int start) {
        List<Integer> result = new ArrayList<>();
        boolean[] visited = new boolean[graph.length];
        dfsUtil(graph, start, visited, result);
        return result;
    }
    private static void dfsUtil(int[][] graph, int node, boolean[] visited, List<Integer> result) {
        visited[node] = true;
        result.add(node);
        for (int i = 0; i < graph[node].length; i++) {
            if (graph[node][i] == 1 && !visited[i]) {
                dfsUtil(graph, i, visited, result);
            }
        }
    }

    // Shortest Path (BFS for unweighted)
    public static List<Integer> shortestPath(int[][] graph, int start, int end) {
        int n = graph.length;
        boolean[] visited = new boolean[n];
        int[] prev = new int[n];
        Arrays.fill(prev, -1);
        Queue<Integer> queue = new LinkedList<>();
        queue.add(start);
        visited[start] = true;

        while (!queue.isEmpty()) {
            int node = queue.poll();
            if (node == end) break;
            for (int i = 0; i < n; i++) {
                if (graph[node][i] == 1 && !visited[i]) {
                    queue.add(i);
                    visited[i] = true;
                    prev[i] = node;
                }
            }
        }

        // Reconstruct path
        List<Integer> path = new ArrayList<>();
        for (int at = end; at != -1; at = prev[at]) {
            path.add(at);
        }
        Collections.reverse(path);
        if (path.get(0) == start)
            return path;
        return Collections.emptyList(); // No path found
    }

    // Dijkstra's Algorithm for weighted graphs
    public static List<Integer> dijkstra(int[][] graph, int[][] weights, int start, int end) {
        int n = graph.length;
        int[] dist = new int[n];
        int[] prev = new int[n];
        boolean[] visited = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        Arrays.fill(prev, -1);
        dist[start] = 0;
        for (int count = 0; count < n; count++) {
            int u = -1;
            for (int i = 0; i < n; i++) {
                if (!visited[i] && (u == -1 || dist[i] < dist[u])) u = i;
            }
            if (dist[u] == Integer.MAX_VALUE) break;
            visited[u] = true;
            for (int v = 0; v < n; v++) {
                if (graph[u][v] != 0 && !visited[v]) {
                    int alt = dist[u] + weights[u][v];
                    if (alt < dist[v]) {
                        dist[v] = alt;
                        prev[v] = u;
                    }
                }
            }
        }
        // Reconstruct path
        List<Integer> path = new ArrayList<>();
        for (int at = end; at != -1; at = prev[at]) path.add(at);
        Collections.reverse(path);
        if (path.get(0) == start)
            return path;
        return Collections.emptyList();
    }
}
