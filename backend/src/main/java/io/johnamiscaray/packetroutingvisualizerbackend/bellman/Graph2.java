package io.johnamiscaray.packetroutingvisualizerbackend.bellman;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Singular;
import org.javatuples.Pair;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Graph2 {

    @Singular
    private List<Node> nodes;
    @Singular
    private List<Edge> edges;

    public List<Node> getNodes() {
        return Collections.unmodifiableList(nodes);
    }

    public List<Edge> getEdges() {
        return Collections.unmodifiableList(edges);
    }

    public List<Pair<Node, Edge>> connectedNodesOf(Node node) {
        List<Edge> connectedEdges = edges.stream()
                .filter(edge -> edge.getNode1().equals(node.getLabel()) || edge.getNode2().equals(node.getLabel()))
                .collect(Collectors.toList());
        List<Pair<Node, Edge>> result = new ArrayList<>();
        for (Edge e : connectedEdges) {
            Optional<Node> other = node.getLabel().equals(e.getNode1()) ? getNode(e.getNode2()) : getNode(e.getNode1());
            result.add(new Pair<>(other.orElseThrow(), e));
        }
        return result;
    }

    public List<Pair<Node, Edge>> connectedNodesOf(String label) {

        Node node = getNode(label).orElseThrow();
        return connectedNodesOf(node);

    }

    public Optional<Node> getNode(String label) {

        return nodes.stream()
                .filter(node -> node.getLabel().equals(label))
                .findFirst();

    }

    /**
     *
     * Computes the Bellman-Ford algorithm on a given graph, returning the computed path after each step represented as a BellmanFordState instance.
     *
     * @param graph The graph to compute the algorithm on
     * @param start The starting node for the shortest path
     * @return A list of BellmanFordStates, each representing the state at each step of the algorithm (the last element is the state representing the shortest path along the graph).
     */
    public static List<BellmanFordState> bellmanFord(Graph2 graph, String start) {

        if (graph.getNode(start).isEmpty()) {
            throw new IllegalArgumentException("The graph does not have starting node: " + start);
        }

        List<PathEntry> entries = new ArrayList<>();
        List<Edge> edges = new ArrayList<>(graph.getEdges());
        List<BellmanFordState> finalResult = new ArrayList<>();

        for (Node node : graph.getNodes()) {
            entries.add(new PathEntry(node.getLabel(), node.getLabel().equals(start) ? 0 : Integer.MAX_VALUE, null));
        }

        finalResult.add(new BellmanFordState(new ArrayList<>(entries), new ArrayList<>(edges)));

        for (int i = 1; i < graph.getNodes().size(); i++) {
            for (Edge e : edges) {
                String node1Label = e.getNode1();
                String node2Label = e.getNode2();
		Optional<PathEntry> node1EntryOptional = getNodeEntry(node1Label, entries);
		Optional<PathEntry> node2EntryOptional = getNodeEntry(node2Label, entries);
		if (node1EntryOptional.isPresent() && node2EntryOptional.isPresent()) {
                PathEntry node1Entry = node1EntryOptional.get();
                PathEntry node2Entry = node2EntryOptional.get();
                int newDistance = node1Entry.getDistance() + e.getWeight();

                if (newDistance < node2Entry.getDistance()) {
                    PathEntry updatedEntry = new PathEntry(node2Label, newDistance, node1Label);
                    int index = entries.indexOf(node2Entry);
                    entries.set(index, updatedEntry);
                }
            }
        }
        finalResult.add(new BellmanFordState(new ArrayList<>(entries), new ArrayList<>(edges)));
    }

    return finalResult;
}

private static Optional<PathEntry> getNodeEntry(String label, List<PathEntry> entries) {
    return entries.stream()
            .filter(e -> e.getNodeLabel().equals(label))
            .findFirst();
}

}

class PathEntry {
private final String nodeLabel;
private final int distance;
private final String predecessor;
public PathEntry(String nodeLabel, int distance, String predecessor) {
    this.nodeLabel = nodeLabel;
    this.distance = distance;
    this.predecessor = predecessor;
}

public String getNodeLabel() {
    return nodeLabel;
}

public int getDistance() {
    return distance;
}

public String getPredecessor() {
    return predecessor;
}
}
