"use client";

import { PageHeader } from "@/components/page-header";
import { useEffect, useState, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Phone } from "lucide-react";

interface PersonData {
  name: string;
  role: string;
  phone: string;
  avatar: string;
}

interface GraphData {
  nodes: Node<PersonData>[];
  edges: Edge[];
}

const PersonNode = ({ data }: { data: PersonData }) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-xl bg-card border border-border min-w-[220px] transition-all hover:shadow-lg hover:border-primary/50 relative">
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "var(--primary)",
          width: "12px",
          height: "12px",
          top: "-6px",
          border: "2px solid var(--background)",
          zIndex: 10,
        }}
      />

      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 transition-colors">
            <img
              src={data.avatar}
              alt={data.name}
              className="w-full h-full object-cover bg-muted"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground leading-tight">
            {data.name}
          </span>
          <span className="text-xs text-primary font-medium">{data.role}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-muted-foreground transition-colors">
        <Phone size={14} className="text-primary/70" />
        <span className="text-xs font-mono">{data.phone}</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "var(--primary)",
          width: "12px",
          height: "12px",
          bottom: "-6px",
          border: "2px solid var(--background)",
          zIndex: 10,
        }}
      />
    </div>
  );
};

function TreeView() {
  return (
    <div className="h-screen flex flex-col">
      <PageHeader
        title="Tree View"
        breadcrumbs={[{ title: "Tree View", href: "/tree-view" }]}
      />
      <TreeViewCanvas />
    </div>
  );
}

function TreeViewCanvas() {
  const nodeTypes = useMemo(
    () => ({
      person: PersonNode,
    }),
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGraphData = async () => {
      try {
        const response = await fetch("/data/graph.json");
        if (!response.ok) {
          throw new Error("Failed to load graph data");
        }
        const data: GraphData = await response.json();
        setNodes(data.nodes);
        setEdges(data.edges);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    loadGraphData();
  }, [setNodes, setEdges]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm font-medium">
            Loading organization structure...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-destructive/10 p-6 rounded-2xl border border-destructive/20 text-center max-w-md">
          <p className="text-destructive font-bold mb-1">Configuration Error</p>
          <p className="text-destructive/80 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background/50"
        minZoom={0.05}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        defaultEdgeOptions={{
          type: "default",
          animated: true,
          style: {
            stroke: "var(--primary)",
            strokeWidth: 2,
            strokeDasharray: "5,5",
            opacity: 0.6,
          },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          className="opacity-20"
        />
        <Controls />
        <MiniMap
          nodeColor="var(--primary)"
          maskColor="rgba(0, 0, 0, 0.5)"
          className="bg-card! border! border-border! rounded-xl! overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
}

export default TreeView;
