package io.johnamiscaray.packetroutingvisualizerbackend.domain;

import io.johnamiscaray.packetroutingvisualizerbackend.stub.Graphs;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class DijkstraTest {

    private final Graph graph1 = Graphs.getGraph1();

    private final Graph graph2 = Graphs.getGraph2();

    @Test
    public void testInvalidStartFails() {

        assertThrows(IllegalArgumentException.class, () -> Graph.dijkstra(graph1, "F"));

    }

    @Test
    public void testGraph1Steps() {

        assertEquals(List.of(
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", Integer.MAX_VALUE, null),
                                new PathEntry("C", Integer.MAX_VALUE, null),
                                new PathEntry("D", Integer.MAX_VALUE, null),
                                new PathEntry("E", Integer.MAX_VALUE, null)
                        ),
                        "A",
                        List.of()
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 6, "A"),
                                new PathEntry("C", Integer.MAX_VALUE, null),
                                new PathEntry("D", 1, "A"),
                                new PathEntry("E", Integer.MAX_VALUE, null)
                        ),
                        "A",
                        List.of(
                                new Edge("A", "B", 6),
                                new Edge("A", "D", 1)
                        )
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 3, "D"),
                                new PathEntry("C", Integer.MAX_VALUE, null),
                                new PathEntry("D", 1, "A"),
                                new PathEntry("E", 2, "D")
                        ),
                        "D",
                        List.of(
                                new Edge("D", "E", 1),
                                new Edge("D", "B", 2)
                        )
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 3, "D"),
                                new PathEntry("C", 7, "E"),
                                new PathEntry("D", 1, "A"),
                                new PathEntry("E", 2, "D")
                        ),
                        "E",
                        List.of(
                                new Edge("B", "E", 2),
                                new Edge("E", "C", 5)
                        )
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 3, "D"),
                                new PathEntry("C", 7, "E"),
                                new PathEntry("D", 1, "A"),
                                new PathEntry("E", 2, "D")
                        ),
                        "B",
                        List.of(
                                new Edge("B", "C", 5)
                        )
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 3, "D"),
                                new PathEntry("C", 7, "E"),
                                new PathEntry("D", 1, "A"),
                                new PathEntry("E", 2, "D")
                        ),
                        "C",
                        List.of()
                )
        ), Graph.dijkstra(graph1, "A"));

    }

    @Test
    public void testGraph2FinalResult() {

        assertEquals(List.of(
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", Integer.MAX_VALUE, null),
                                new PathEntry("C", Integer.MAX_VALUE, null),
                                new PathEntry("D", Integer.MAX_VALUE, null),
                                new PathEntry("E", Integer.MAX_VALUE, null),
                                new PathEntry("F", Integer.MAX_VALUE, null)
                        ),
                        "A",
                        List.of()
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", Integer.MAX_VALUE, null),
                                new PathEntry("D", 8, "A"),
                                new PathEntry("E", Integer.MAX_VALUE, null),
                                new PathEntry("F", Integer.MAX_VALUE, null)
                        ),
                        "A",
                        List.of(
                                new Edge("A", "B", 2),
                                new Edge("A", "D", 8)
                        )
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", Integer.MAX_VALUE, null),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", Integer.MAX_VALUE, null)
                        ),
                        "B",
                        List.of(
                                new Edge("B", "D", 5),
                                new Edge("B", "E", 6)
                        )
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", Integer.MAX_VALUE, null),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D")
                        ),
                        "D",
                        List.of(
                                new Edge("D", "E", 3),
                                new Edge("D", "F", 2)
                        )
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", 17, "E"),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D")
                        ),
                        "E",
                        List.of(
                                new Edge("E", "F", 1),
                                new Edge("E", "C", 9)
                        )
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", 12, "F"),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D")
                        ),
                        "F",
                        List.of(
                                new Edge("F", "C", 3)
                        )
                ),
                new DijkstraState(
                        List.of(
                                new PathEntry("A", 0, null),
                                new PathEntry("B", 2, "A"),
                                new PathEntry("C", 12, "F"),
                                new PathEntry("D", 7, "B"),
                                new PathEntry("E", 8, "B"),
                                new PathEntry("F", 9, "D")
                        ),
                        "C",
                        List.of()
                )
        ), Graph.dijkstra(graph2, "A"));

    }

}
