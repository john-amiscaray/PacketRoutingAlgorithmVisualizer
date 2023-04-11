package io.johnamiscaray.packetroutingvisualizerbackend.controllers;

import io.johnamiscaray.packetroutingvisualizerbackend.domain.BellmanFordState;
import io.johnamiscaray.packetroutingvisualizerbackend.domain.DijkstraState;
import io.johnamiscaray.packetroutingvisualizerbackend.domain.Graph;
import io.johnamiscaray.packetroutingvisualizerbackend.dto.DijkstraRequest;
import io.johnamiscaray.packetroutingvisualizerbackend.dto.BellmanFordRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/graph")
public class GraphController {

    @PostMapping("/dijkstra")
    public ResponseEntity<List<DijkstraState>> computeDijkstra(@RequestBody DijkstraRequest request) {

        return ResponseEntity.ok(Graph.dijkstra(request.getGraph(), request.getStart()));

    }

    @PostMapping("/bellmanFord")
    public ResponseEntity<List<BellmanFordState>> computeBellman(@RequestBody BellmanFordRequest request) {

        return ResponseEntity.ok(Graph.bellmanFord(request.getGraph(), request.getStart()));

    }

}
