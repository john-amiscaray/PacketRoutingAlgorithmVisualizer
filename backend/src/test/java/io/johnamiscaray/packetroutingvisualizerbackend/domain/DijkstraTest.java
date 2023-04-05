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

    @Test
    public void testGraph1() {

        assertEquals(List.of(
                new PathEntry("A", 0, null),
                new PathEntry("B", 3, "D"),
                new PathEntry("C", 7, "E"),
                new PathEntry("D", 1, "A"),
                new PathEntry("E", 2, "D")
        ), Graph.dijkstra(graph1, "A"));

    }

}
