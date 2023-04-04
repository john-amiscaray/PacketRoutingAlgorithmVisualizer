package io.johnamiscaray.packetroutingvisualizerbackend.util;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class GraphTest {

    private final List<Node> nodes = List.of(new Node("A"), new Node("B"), new Node("C"));
    private final List<Edge> edges = List.of(new Edge("A", "B", 5), new Edge("A", "C", 4));
    private final Graph graph = new Graph(nodes, edges);

    @Test
    public void testGraphHasGivenNodes(){


        assertEquals(nodes, graph.getNodes());

    }

    @Test
    public void testGraphHasGivenEdges() {

        Graph graph = new Graph(nodes, edges);

        assertEquals(edges, this.graph.getEdges());

    }

}