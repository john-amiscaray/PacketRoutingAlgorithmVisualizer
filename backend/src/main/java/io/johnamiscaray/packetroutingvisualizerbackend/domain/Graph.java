package io.johnamiscaray.packetroutingvisualizerbackend.domain;

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
public class Graph {

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

    private static Optional<PathEntry> getNodeEntry(String label, List<PathEntry> entries) {
        return entries.stream()
                .filter(e -> e.getVertexLabel().equals(label))
                .findFirst();
    }

    /**
     *
     * Computes dijkstra's algorithm on a given graph, returning the computed path after each step represented as a DijkstraState instance
     *
     * @param graph The graph to compute the algorithm on
     * @param start The starting node for the shortest path
     * @return A list of DijkstraStates, each representing the state at each step of the algorithm (the last element is the state representing the shortest path along the graph).
     */
    public static List<DijkstraState> dijkstra(Graph graph, String start){

        if(graph.getNode(start).isEmpty()){
            throw new IllegalArgumentException("The graph does not have starting node: " + start);
        }

        List<Node> visited = new ArrayList<>();
        TreeMap<String, PathEntry> entries = new TreeMap<>(String::compareTo);
        List<DijkstraState> finalResult = new ArrayList<>();

        for (Node node : graph.getNodes()) {
            entries.put(node.getLabel(), new PathEntry(node.getLabel(), node.getLabel().equals(start) ? 0 : Integer.MAX_VALUE, null));
        }

        finalResult.add(new DijkstraState(entries.values().stream().map(PathEntry::new).toList(), "A", List.of()));

        // Create a priority queue where the priority is dictated by the path entry with the least distance
        PriorityQueue<Pair<Node, Integer>> searchQueue = new PriorityQueue<>(entries.size(), Comparator.comparing(Pair::getValue1));

        searchQueue.addAll(
            graph.getNodes()
                .stream()
                .map(node -> new Pair<>(node, node.getLabel().equals(start) ? 0 : Integer.MAX_VALUE))
                .collect(Collectors.toList())
        );
        int lastCost;
        String currentNodeLabel;

        while(!searchQueue.isEmpty()){

            Pair<Node, Integer> entry = searchQueue.poll();
            Node currentNode = entry.getValue0();
            if(visited.contains(currentNode)){
                continue;
            }
            visited.add(currentNode);
            lastCost = entry.getValue1();
            currentNodeLabel = currentNode.getLabel();
            List<Pair<Node, Edge>> connectedUnvisitedNodes = graph.connectedNodesOf(currentNode)
                    .stream()
                    .filter(pair -> !visited.contains(pair.getValue0()))
                    .collect(Collectors.toList());

            // Need to declare these finalLastCost and finalLastNode variables because the compiler requires that variables used in a lambda must be final or effectively final
            int finalLastCost = lastCost;
            String finalLastNode = currentNodeLabel;
            List<Edge> connectedEdges = new ArrayList<>();
            connectedUnvisitedNodes.forEach(nodeEdgePair -> {
                PathEntry nodeEntry = entries.get(nodeEdgePair.getValue0().getLabel());
                connectedEdges.add(nodeEdgePair.getValue1());
                if(finalLastCost + nodeEdgePair.getValue1().getWeight() < nodeEntry.getDistance()){
                    nodeEntry.setDistance(finalLastCost + nodeEdgePair.getValue1().getWeight());
                    nodeEntry.setPreviousVertexLabel(finalLastNode);
                    /*
                     Add a new entry to the queue with the node and the updated cost. We keep the old entry with the previous cost
                     and ignore it using the if statement at line 94. Deletion from the queue takes linear time, so it's potentially
                     better to ignore it instead of delete it like what we do here.
                     */
                    searchQueue.add(new Pair<>(nodeEdgePair.getValue0(), nodeEntry.getDistance()));
                }
            });

            finalResult.add(new DijkstraState(entries.values().stream().map(PathEntry::new).toList(), currentNodeLabel, connectedEdges));

        }

        return finalResult;

    }

    /**
     *
     * Computes the Bellman-Ford algorithm on a given graph, returning the computed path after each step represented as a BellmanFordState instance.
     *
     * @param graph The graph to compute the algorithm on
     * @param start The starting node for the shortest path
     * @return A list of BellmanFordStates, each representing the state at each step of the algorithm (the last element is the state representing the shortest path along the graph).
     */
    public static List<BellmanFordState> bellmanFord(Graph graph, String start) {

        if (graph.getNode(start).isEmpty()) {
            throw new IllegalArgumentException("The graph does not have starting node: " + start);
        }

        List<PathEntry> entries = new ArrayList<>();
        List<Edge> edges = new ArrayList<>(graph.getEdges());
        List<BellmanFordState> finalResult = new ArrayList<>();

        for (Node node : graph.getNodes()) {
            entries.add(new PathEntry(node.getLabel(), node.getLabel().equals(start) ? 0 : Integer.MAX_VALUE, null));
        }

        finalResult.add(new BellmanFordState(new ArrayList<>(entries), new ArrayList<>()));

        for (int i = 0; i < graph.getNodes().size() - 1; i++) {
            List<PathEntry> updates = new ArrayList<>();
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
                        updates.add(updatedEntry);
                        int index = entries.indexOf(node2Entry);
                        entries.set(index, updatedEntry);
                    }
                }
            }
            finalResult.add(new BellmanFordState(new ArrayList<>(entries), updates));
        }

        return finalResult;
    }

}
