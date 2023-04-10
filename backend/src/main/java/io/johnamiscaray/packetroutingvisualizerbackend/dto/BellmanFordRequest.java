package io.johnamiscaray.packetroutingvisualizerbackend.dto;

import io.johnamiscaray.packetroutingvisualizerbackend.bellman.Graph2;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BellmanFordRequest {

    private Graph2 graph;
    private String start;

}
