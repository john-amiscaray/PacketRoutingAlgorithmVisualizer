package io.johnamiscaray.packetroutingvisualizerbackend.stub;

import io.johnamiscaray.packetroutingvisualizerbackend.domain.Edge;
import io.johnamiscaray.packetroutingvisualizerbackend.domain.Graph;
import io.johnamiscaray.packetroutingvisualizerbackend.domain.Node;

import java.util.List;

public class Graphs {
    
    public static Graph getGraph1() {
        
        return new Graph(
                List.of(new Node("A"), new Node("B"), new Node("C"), new Node("D"), new Node("E")),
                List.of(
                        new Edge("A", "B", 6),
                        new Edge("A", "D", 1),
                        new Edge("D", "E", 1),
                        new Edge("D", "B", 2),
                        new Edge("B", "E", 2),
                        new Edge("B", "C", 5),
                        new Edge("E", "C", 5)
                )
        );
        
    }
    
    public static Graph getGraph2() {
        
        return new Graph(
                List.of(new Node("A"), new Node("B"), new Node("C"), new Node("D"), new Node("E"), new Node("F")),
                List.of(
                        new Edge("A", "B", 2),
                        new Edge("A", "D", 8),
                        new Edge("B", "D", 5),
                        new Edge("B", "E", 6),
                        new Edge("D", "E", 3),
                        new Edge("D", "F", 2),
                        new Edge("E", "F", 1),
                        new Edge("E", "C", 9),
                        new Edge("F", "C", 3)
                )
        );
        
    }
    
}
