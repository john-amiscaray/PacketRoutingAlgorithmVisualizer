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

    /**
     *
     * Computes dijkstra's algorithm on a given graph, returning the computed path after each step
     *
     * @param graph The graph to compute the algorithm on
     * @param start The starting node for the shortest path
     * @return A list of lists of path entries, each representing the state at each step of the algorithm
     */
    public static List<PathEntry> dijkstra(Graph graph, String start){

        if(graph.getNode(start).isEmpty()){
            throw new IllegalArgumentException("The graph does not have node: " + start);
        }

        List<Node> visited = new ArrayList<>();
        List<PathEntry> entries = graph.getNodes()
                .stream()
                .map(node -> new PathEntry(node.getLabel(), node.getLabel().equals(start) ? 0 : Integer.MAX_VALUE, null))
                .collect(Collectors.toList());

        // Create a priority queue where the priority is dictated by the path entry with the least distance
        PriorityQueue<PathEntry> searchQueue = new PriorityQueue<>(entries.size(), Comparator.comparingInt(PathEntry::getDistance));

        searchQueue.addAll(entries);
        int lastCost = 0;

        while(!searchQueue.isEmpty()){

            PathEntry entry = searchQueue.poll();
            Optional<Node> optionalNode = graph.getNode(entry.getVertexLabel());
            assert optionalNode.isPresent();
            Node currentNode = optionalNode.get();
            if(visited.contains(currentNode)){
                continue;
            }
            visited.add(currentNode);
            lastCost += entry.getDistance();
            List<Pair<Node, Edge>> connectedUnvisitedNodes = graph.connectedNodesOf(currentNode)
                    .stream()
                    .filter(pair -> !visited.contains(pair.getValue0()))
                    .collect(Collectors.toList());

            // Need to declare this finalLastCost variable because the compiler requires that variables used in a lambda must be final or effectively final
            int finalLastCost = lastCost;
            connectedUnvisitedNodes.forEach(nodeEdgePair -> {
                Optional<PathEntry> nodeEntryOptional = entries.stream()
                        .filter(pathEntry -> pathEntry.getVertexLabel().equals(nodeEdgePair.getValue0().getLabel()))
                        .findFirst();
                assert nodeEntryOptional.isPresent();
                PathEntry nodeEntry = nodeEntryOptional.get();
                if(finalLastCost + nodeEdgePair.getValue1().getWeight() < nodeEntry.getDistance()){
                    nodeEntry.setDistance(finalLastCost + nodeEdgePair.getValue1().getWeight());
                    /*
                     Add the entry again to the priority queue. This is because the priority queue doesn't auto update the priority when we update the state of an entry.
                     If we tried deleting the old entry and added the new one with the updated distance, this would take O(n) time, slowing down the algorithm. Instead,
                     we add the entry again with the updated distance and if we see the old entry we can ignore it using the if statement at line 89. For more details on this
                     implementation decision, see this: https://stackoverflow.com/questions/6952660/java-priority-queue-reordering-when-editing-elements
                     */
                    searchQueue.add(nodeEntry);
                }
            });

        }

        return entries;

    }

}
