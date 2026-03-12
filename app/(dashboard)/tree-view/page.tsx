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
import { getMemberTreeAPI } from "@/lib/api/member";

interface PersonData {
  name?: string;
  fullName?: string;
  role?: string;
  memberId?: string;
  phone?: string;
  avatar?: string;
  status?: string;
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
            {data.fullName || data.name}
          </span>
          <span className="text-xs text-primary font-medium">{data.memberId || data.role}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone size={14} className="text-primary/70" />
          <span className="text-xs font-mono">{data.phone}</span>
        </div>
        {data.status && (
          <span 
            className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md ${
              data.status.toLowerCase() === 'active' 
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
            }`}
          >
            {data.status}
          </span>
        )}
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
        const res = await getMemberTreeAPI();
        console.log("Tree API Data:", res.data); // For help in debugging
        
        if (res.data?.status && res.data.data) {
          const apiData = res.data.data;
          
          if (apiData.nodes && apiData.edges) {
            // Already formatted correctly
            setNodes(apiData.nodes);
            setEdges(apiData.edges);
          } else {
            // Probably nested structure { fullName, children: [...] } OR a flat array
            const transformed = transformToNodesAndEdges(apiData);
            setNodes(transformed.nodes);
            setEdges(transformed.edges);
          }
        } else {
          throw new Error(res.data?.message || "Failed to load graph data");
        }
        setLoading(false);
      } catch (err: any) {
        console.error("Tree error:", err);
        setError(err?.response?.data?.message || err.message || "Unknown error");
        setLoading(false);
      }
    };

    loadGraphData();
  }, [setNodes, setEdges]);

  // Build tree using sponsorId to correctly reconstruct the hierarchy
  const transformToNodesAndEdges = (data: any) => {
    const rfNodes: Node[] = [];
    const rfEdges: Edge[] = [];
    const horizontalSpacing = 300;
    const verticalSpacing = 250;

    // Collect all members: root + all downlines
    const allMembers: any[] = [];
    const root = { ...data };
    // Remove downlines from root copy to avoid confusion
    delete root.downlines;
    allMembers.push(root);
    if (data.downlines && Array.isArray(data.downlines)) {
      data.downlines.forEach((m: any) => allMembers.push(m));
    }

    // Build a lookup: _id -> member data
    const byMongoId: Record<string, any> = {};
    allMembers.forEach((m) => {
      const key = m._id || m.id;
      if (key) byMongoId[key] = { ...m, __children: [] };
    });

    // Build parent → children map using sponsorId
    const rootNodes: any[] = [];
    allMembers.forEach((m) => {
      const key = m._id || m.id;
      if (!key) return;
      
      let sponsorMongoId = null;
      if (m.sponsorId) {
        sponsorMongoId = typeof m.sponsorId === 'object' ? (m.sponsorId._id || m.sponsorId.id) : m.sponsorId;
      }

      if (sponsorMongoId && byMongoId[sponsorMongoId]) {
        byMongoId[sponsorMongoId].__children.push(byMongoId[key]);
      } else {
        // No known sponsor → treat as root
        rootNodes.push(byMongoId[key]);
      }
    });

    // Width calculator based on reconstructed __children
    const getWidth = (node: any): number => {
      if (!node.__children || node.__children.length === 0) return 1;
      return node.__children.reduce((acc: number, c: any) => acc + getWidth(c), 0);
    };

    // Recursive traversal to create ReactFlow nodes & edges
    const traverse = (nodeData: any, xOffset: number, y: number, parentId: string | null = null) => {
      const id = String(nodeData.memberId || nodeData._id || nodeData.id || `node-${Math.random()}`);
      const width = getWidth(nodeData) * horizontalSpacing;
      const x = xOffset + width / 2;

      rfNodes.push({
        id,
        type: "person",
        position: { x, y },
        data: {
          ...nodeData,
          name: nodeData.fullName || nodeData.memberName || nodeData.name || "Unknown",
          role: nodeData.level !== undefined ? `Level ${nodeData.level}` : (nodeData.role || ""),
          phone: nodeData.phone || nodeData.mobile || nodeData.contactNo || "",
          avatar: nodeData.avatar || (nodeData.gender === "female" ? "/avatars/female_avatar.png" : "/avatars/male_avatar.png"),
          status: nodeData.status || "Inactive",
        },
      });

      if (parentId) {
        rfEdges.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          animated: true,
        });
      }

      let currentX = xOffset;
      (nodeData.__children || []).forEach((child: any) => {
        const childWidth = getWidth(child) * horizontalSpacing;
        traverse(child, currentX, y + verticalSpacing, id);
        currentX += childWidth;
      });
    };

    // Start traversal from all root nodes
    let currentX = 0;
    rootNodes.forEach((root) => {
      const w = getWidth(root) * horizontalSpacing;
      traverse(root, currentX, 0);
      currentX += w;
    });

    return { nodes: rfNodes, edges: rfEdges };
  };

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
