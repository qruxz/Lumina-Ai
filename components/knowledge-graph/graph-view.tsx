'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { FileText, Link as LinkIcon, Book, File, Brain, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

interface Node {
  id: string;
  title: string;
  type: 'note' | 'paper' | 'document';
  x: number;
  y: number;
  connections: string[];
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

export function KnowledgeGraph() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      title: 'Research Notes on AI',
      type: 'note',
      x: 100,
      y: 100,
      connections: ['2', '3'],
    },
    {
      id: '2',
      title: 'Machine Learning Paper',
      type: 'paper',
      x: 300,
      y: 200,
      connections: ['1', '3'],
    },
    {
      id: '3',
      title: 'Project Documentation',
      type: 'document',
      x: 500,
      y: 100,
      connections: ['1', '2'],
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Connection[]>([]);
  const graphRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const [lines, setLines] = useState<SVGPathElement[]>([]);

  useEffect(() => {
    if (!graphRef.current) return;

    // Initialize draggable nodes
    const draggables: Draggable[] = [];
    nodes.forEach((node) => {
      if (!nodeRefs.current[node.id]) return;

      const draggable = Draggable.create(nodeRefs.current[node.id], {
        type: 'x,y',
        bounds: graphRef.current,
        inertia: true,
        onDrag: () => updateConnections(),
        onDragEnd: () => {
          const el = nodeRefs.current[node.id];
          const rect = el.getBoundingClientRect();
          const graphRect = graphRef.current!.getBoundingClientRect();
          
          setNodes(prev => prev.map(n => 
            n.id === node.id 
              ? { 
                  ...n, 
                  x: rect.left - graphRect.left + rect.width / 2,
                  y: rect.top - graphRect.top + rect.height / 2
                }
              : n
          ));
        }
      })[0];
      draggables.push(draggable);
    });

    return () => {
      draggables.forEach(d => d.kill());
    };
  }, [nodes]);

  const updateConnections = () => {
    const svgPaths: SVGPathElement[] = [];
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const sourceEl = nodeRefs.current[node.id];
        const targetEl = nodeRefs.current[targetId];
        if (!sourceEl || !targetEl) return;

        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${sourceRect.left + sourceRect.width / 2} ${sourceRect.top + sourceRect.height / 2} 
                  Q ${(sourceRect.left + targetRect.left) / 2} ${sourceRect.top} 
                    ${targetRect.left + targetRect.width / 2} ${targetRect.top + targetRect.height / 2}`;
        
        path.setAttribute('d', d);
        path.setAttribute('stroke', 'hsl(var(--primary))');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0.5');
        
        svgPaths.push(path);
      });
    });
    setLines(svgPaths);
  };

  const simulateAISuggestions = (nodeId: string) => {
    // Simulate AI processing
    setTimeout(() => {
      const newSuggestions: Connection[] = nodes
        .filter(n => n.id !== nodeId && !nodes.find(node => node.id === nodeId)?.connections.includes(n.id))
        .map(n => ({
          source: nodeId,
          target: n.id,
          strength: Math.random() * 0.5 + 0.3,
        }));
      setSuggestions(newSuggestions);
    }, 500);
  };

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] overflow-hidden bg-background/50 rounded-lg border border-border/50">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Node
        </Button>
        <Button variant="outline" size="sm">
          <Brain className="h-4 w-4 mr-2" />
          AI Suggest
        </Button>
      </div>

      <div ref={graphRef} className="relative w-full h-full">
        <svg className="absolute inset-0 pointer-events-none">
          {lines.map((path, index) => (
            <path
              key={index}
              d={path.getAttribute('d') || ''}
              stroke={path.getAttribute('stroke') || ''}
              strokeWidth={path.getAttribute('stroke-width') || ''}
              fill={path.getAttribute('fill') || ''}
              opacity={path.getAttribute('opacity') || ''}
            />
          ))}
        </svg>

        <AnimatePresence>
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              ref={el => {
                if (el) nodeRefs.current[node.id] = el;
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                transform: 'translate(-50%, -50%)',
                cursor: 'move',
              }}
              className="touch-none"
              onClick={() => {
                setSelectedNode(selectedNode === node.id ? null : node.id);
                simulateAISuggestions(node.id);
              }}
            >
              <Card className={`w-48 ${selectedNode === node.id ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {node.type === 'note' && <FileText className="h-4 w-4" />}
                    {node.type === 'paper' && <Book className="h-4 w-4" />}
                    {node.type === 'document' && <File className="h-4 w-4" />}
                    <h3 className="text-sm font-medium truncate">{node.title}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {selectedNode && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 right-4 w-64"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Suggested Connections</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSuggestions([])}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((suggestion) => (
                      <div
                        key={`${suggestion.source}-${suggestion.target}`}
                        className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                      >
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          <span className="text-sm">
                            {nodes.find(n => n.id === suggestion.target)?.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(suggestion.strength * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 