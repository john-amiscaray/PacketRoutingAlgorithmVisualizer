package io.johnamiscaray.packetroutingvisualizerbackend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A class representing a table entry in the resulting table when computing dijkstra's algorithm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PathEntry {

    private String vertexLabel;
    private Integer distance;
    private String previousVertexLabel;

    public PathEntry(PathEntry entry) {
        vertexLabel = entry.vertexLabel;
        distance = entry.distance;
        previousVertexLabel = entry.previousVertexLabel;
    }

}
