package com.pathfinder;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/algorithms")
public class AlgorithmController {

    @PostMapping("/bfs")
    public List<Integer> bfs(@RequestBody GraphRequest request) {
        return GraphAlgorithms.bfs(request.getGraph(), request.getStart());
    }

    @PostMapping("/dfs")
    public List<Integer> dfs(@RequestBody GraphRequest request) {
        return GraphAlgorithms.dfs(request.getGraph(), request.getStart());
    }

    @PostMapping("/shortest-path")
    public List<Integer> shortestPath(@RequestBody PathRequest request) {
        return GraphAlgorithms.shortestPath(request.getGraph(), request.getStart(), request.getEnd());
    }

    @PostMapping("/dijkstra")
    public List<Integer> dijkstra(@RequestBody DijkstraRequest request) {
        return GraphAlgorithms.dijkstra(request.getGraph(), request.getWeights(), request.getStart(), request.getEnd());
    }

    // Request classes
    public static class GraphRequest {
        private int[][] graph;
        private int start;
        public int[][] getGraph() { return graph; }
        public void setGraph(int[][] graph) { this.graph = graph; }
        public int getStart() { return start; }
        public void setStart(int start) { this.start = start; }
    }
    public static class PathRequest extends GraphRequest {
        private int end;
        public int getEnd() { return end; }
        public void setEnd(int end) { this.end = end; }
    }
    public static class DijkstraRequest extends PathRequest {
        private int[][] weights;
        public int[][] getWeights() { return weights; }
        public void setWeights(int[][] weights) { this.weights = weights; }
    }
}
