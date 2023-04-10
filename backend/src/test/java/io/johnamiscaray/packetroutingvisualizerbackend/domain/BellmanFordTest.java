package io.johnamiscaray.packetroutingvisualizerbackend.domain;

import io.johnamiscaray.packetroutingvisualizerbackend.stub.Graphs;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class BellmanFordTest {

    private final Graph graph1 = Graphs.getGraph1();
    private final Graph graph2 = Graphs.getGraph2();

    @Test
    public void testGraph1Solution() {

        List<BellmanFordState> states = Graph.bellmanFord(graph1, "A");
        assertEquals(new BellmanFordState(List.of(
                new PathEntry("A", 0, null),
                new PathEntry("B", 3, "D"),
                new PathEntry("C", 7, "E"),
                new PathEntry("D", 1, "A"),
                new PathEntry("E", 2, "D")
        )), states.get(states.size() - 1));

    }

    @Test
    public void testGraph2Solution() {

        List<BellmanFordState> states = Graph.bellmanFord(graph2, "A");
        assertEquals(new BellmanFordState(
                List.of(
                        new PathEntry("A", 0, null),
                        new PathEntry("B", 2, "A"),
                        new PathEntry("C", 12, "F"),
                        new PathEntry("D", 7, "B"),
                        new PathEntry("E", 8, "B"),
                        new PathEntry("F", 9, "D")
                )
        ), states.get(states.size() - 1));

    }

    @Test
    public void testBadStartingNode() {

        assertThrows(IllegalArgumentException.class, () -> Graph.bellmanFord(graph1, "H"));

    }

}
