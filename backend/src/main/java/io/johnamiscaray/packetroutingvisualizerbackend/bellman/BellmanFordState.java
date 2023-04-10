package io.johnamiscaray.packetroutingvisualizerbackend.bellman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BellmanFordState {

    private List<PathEntry> pathTable;
    private List<Edge> edges;

}
