package io.johnamiscaray.packetroutingvisualizerbackend.domain;

import io.johnamiscaray.packetroutingvisualizerbackend.stub.Graphs;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class BellmanFordTest {

    private final Graph graph1 = Graphs.getGraph1();
    private final Graph graph2 = Graphs.getGraph2();

    @Test
    public void testGraph1States() {

        assertEquals(
                List.of(
                        new BellmanFordState(
                                List.of(
                                        new PathEntry("A", 0, null),
                                        new PathEntry("B", Integer.MAX_VALUE, null),
                                        new PathEntry("C", Integer.MAX_VALUE, null),
                                        new PathEntry("D", Integer.MAX_VALUE, null),
                                        new PathEntry("E", Integer.MAX_VALUE, null)
                                ),
                                List.of()
                        ),
                        new BellmanFordState(
                                List.of(
                                        new PathEntry("A", 0, null),
                                        new PathEntry("B", 3, "D"),
                                        new PathEntry("C", 7, "E"),
                                        new PathEntry("D", 1, "A"),
                                        new PathEntry("E", 2, "D")
                                ),
                                List.of(
                                        new PathEntry("B", 6, "A"),
                                        new PathEntry("D", 1, "A"),
                                        new PathEntry("E", 2, "D"),
                                        new PathEntry("B", 3, "D"),
                                        new PathEntry("C", 8, "B"),
                                        new PathEntry("C", 7, "E")
                                )
                        ),
                        new BellmanFordState(
                                List.of(
                                        new PathEntry("A", 0, null),
                                        new PathEntry("B", 3, "D"),
                                        new PathEntry("C", 7, "E"),
                                        new PathEntry("D", 1, "A"),
                                        new PathEntry("E", 2, "D")
                                ),
                                List.of()
                        ),
                        new BellmanFordState(
                                List.of(
                                        new PathEntry("A", 0, null),
                                        new PathEntry("B", 3, "D"),
                                        new PathEntry("C", 7, "E"),
                                        new PathEntry("D", 1, "A"),
                                        new PathEntry("E", 2, "D")
                                ),
                                List.of()
                        ),
                        new BellmanFordState(
                                List.of(
                                        new PathEntry("A", 0, null),
                                        new PathEntry("B", 3, "D"),
                                        new PathEntry("C", 7, "E"),
                                        new PathEntry("D", 1, "A"),
                                        new PathEntry("E", 2, "D")
                                ),
                                List.of()
                        )
                ), Graph.bellmanFord(graph1, "A"));

    }

    @Test
    public void testGraph2States() {

        assertEquals(List.of(
                new BellmanFordState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", Integer.MAX_VALUE, null),
                                new PathEntry("C", Integer.MAX_VALUE, null),
                                new PathEntry("D", Integer.MAX_VALUE, null),
                                new PathEntry("E", Integer.MAX_VALUE, null),
                                new PathEntry("F", Integer.MAX_VALUE, null)
                        ),
                        List.of()
                ),
                new BellmanFordState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", 12, "F"),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D")
                        ),
                        List.of(
                                new PathEntry("B", 2, "A"),
                                new PathEntry("D", 8, "A"),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D"),
                                new PathEntry("C", 17, "E"),
                                new PathEntry("C", 12, "F")
                        )
                ),
                new BellmanFordState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", 12, "F"),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D")
                        ),
                        List.of()
                ),
                new BellmanFordState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", 12, "F"),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D")
                        ),
                        List.of()
                ),
                new BellmanFordState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", 12, "F"),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D")
                        ),
                        List.of()
                ),
                new BellmanFordState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", 12, "F"),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D")
                        ),
                        List.of()
                )
        ), Graph.bellmanFord(graph2, "A"));

    }

    @Test
    public void testBadStartingNode() {

        assertThrows(IllegalArgumentException.class, () -> Graph.bellmanFord(graph1, "H"));

    }

}
