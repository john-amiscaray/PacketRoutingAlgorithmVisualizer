package io.johnamiscaray.packetroutingvisualizerbackend.domain;

import org.javatuples.Pair;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class GraphTest {

    private final List<Node> nodes = List.of(new Node("A"), new Node("B"), new Node("C"));
    private final List<Edge> edges = List.of(new Edge("A", "B", 5), new Edge("A", "C", 4));
    private final Graph graph = new Graph(nodes, edges);
    private final Graph disconnectedGraph = new Graph(nodes, List.of());

    @Test
    public void testGraphHasGivenNodes(){

        assertEquals(nodes, graph.getNodes());

    }

    @Test
    public void testGraphHasGivenEdges() {

        assertEquals(edges, graph.getEdges());

    }

    @Test
    public void testGetNodeFromLabel() {

        assertEquals(nodes.get(0), graph.getNode("A").orElseThrow());

    }

    @Test
    public void testGetNodeFromNonExistentLabel() {

        assertTrue(graph.getNode("F").isEmpty());

    }

    @Test
    public void testGraphGetsConnectedNodesOfA() {

        assertEquals(List.of(new Pair<>(nodes.get(1), edges.get(0)), new Pair<>(nodes.get(2), edges.get(1))), graph.connectedNodesOf("A"));

    }

    @Test
    public void testGraphGetsConnectedNodesOfB() {

        assertEquals(List.of(new Pair<>(nodes.get(0), edges.get(0))), graph.connectedNodesOf("B"));

    }

    @Test
    public void testGraphGetsConnectedNodesOfC() {

        assertEquals(List.of(new Pair<>(nodes.get(0), edges.get(1))), graph.connectedNodesOf("C"));

    }

    @Test
    public void testGraphGetsConnectedNodesOfAInDisconnectedGraph() {

        assertEquals(List.of(), disconnectedGraph.connectedNodesOf("A"));

    }

}