package io.johnamiscaray.packetroutingvisualizerbackend.domain;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class DijkstraTest {

    private final Graph graph1 = new Graph(
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

    private final Graph graph2 = new Graph(
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

    @Test
    public void testGraph1FinalResult() {

        List<List<PathEntry>> result = Graph.dijkstra(graph1, "A");

        assertEquals(List.of(
                new PathEntry("A", 0, null),
                new PathEntry("B", 3, "D"),
                new PathEntry("C", 7, "E"),
                new PathEntry("D", 1, "A"),
                new PathEntry("E", 2, "D")
        ), result.get(result.size() - 1));

    }

    @Test
    public void testGraph2FinalResult() {

        List<List<PathEntry>> result = Graph.dijkstra(graph2, "A");

        assertEquals(List.of(
                new PathEntry("A", 0, null),
                new PathEntry("B", 2, "A"),
                new PathEntry("C", 12, "F"),
                new PathEntry("D", 7, "B"),
                new PathEntry("E", 8, "B"),
                new PathEntry("F", 9, "D")
        ), result.get(result.size() - 1));

    }

}
