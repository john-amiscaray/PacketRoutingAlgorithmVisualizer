package io.johnamiscaray.packetroutingvisualizerbackend.controllers;

import io.johnamiscaray.packetroutingvisualizerbackend.domain.Graph;
import io.johnamiscaray.packetroutingvisualizerbackend.dto.DijkstraRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/graph")
public class GraphController {

    @PostMapping("/dijkstra")
    public ResponseEntity<?> computeDijkstra(@RequestBody DijkstraRequest request) {

        try{
            return ResponseEntity.ok(Graph.dijkstra(request.getGraph(), request.getStart()));
        }catch(IllegalArgumentException ex){
            return ResponseEntity.badRequest()
                    .body(ex.getMessage());
        }

    }

}
