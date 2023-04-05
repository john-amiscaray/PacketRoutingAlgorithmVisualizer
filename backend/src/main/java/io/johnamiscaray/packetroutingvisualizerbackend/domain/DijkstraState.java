package io.johnamiscaray.packetroutingvisualizerbackend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DijkstraState {

    private List<PathEntry> pathTable;
    private String currentNode;
    private List<Edge> attachedEdges;

}
