package io.johnamiscaray.packetroutingvisualizerbackend.bellman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Edge {

    private String node1;
    private String node2;
    private Integer weight;

}