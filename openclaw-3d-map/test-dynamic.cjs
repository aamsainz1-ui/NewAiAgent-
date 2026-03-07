const fs = require('fs');
const code = fs.readFileSync('./src/App.jsx', 'utf8');

if (code.includes('const allNodes = useMemo(() => [...NODES, ...mcNodes], [mcNodes]);')) {
    console.log("allNodes definition found");
}

if (code.includes('const allEdges = useMemo(() => [...EDGES, ...mcEdges], [mcEdges]);')) {
    console.log("allEdges definition found");
}

if (code.includes('<DynamicConnections nodeRefMap={nodeRefMap} selectedNode={selectedNode} relatedNodesMap={relatedNodesMap} edges={allEdges} allNodes={allNodes} />')) {
    console.log("DynamicConnections called with allNodes and allEdges");
}
