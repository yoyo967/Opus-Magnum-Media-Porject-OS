
import React, { useEffect, useRef } from 'react';

interface NeuralBackgroundProps {
    opacity?: number;
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({ opacity = 0.15 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Nodes representing servers/infrastructure points
        const nodes: { x: number; y: number; r: number; connections: number[]; activity: number }[] = [];
        const nodeCount = Math.floor((width * height) / 30000); // Density control

        // Packets representing data flow
        const packets: { from: number; to: number; progress: number; speed: number; size: number }[] = [];

        // Initialize Nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() > 0.9 ? 3 : 1.5, // Some "hub" nodes are larger
                connections: [],
                activity: 0
            });
        }

        // Establish Connections (Simulating Network Topology)
        const connectionDistance = 250;
        nodes.forEach((node, i) => {
            nodes.forEach((otherNode, j) => {
                if (i !== j) {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < connectionDistance) {
                        // Create a web-like structure, prioritizing closer nodes but allowing some long-distance backbone links
                        if (Math.random() > 0.9 || dist < 100) { 
                             node.connections.push(j);
                        }
                    }
                }
            });
        });

        let animationFrameId: number;
        let time = 0;

        const animate = () => {
            time += 0.01;
            ctx.clearRect(0, 0, width, height);
            
            // Draw Connections (Fiber Optics)
            ctx.lineWidth = 0.5;
            nodes.forEach((node, i) => {
                // Decay activity
                if (node.activity > 0) node.activity -= 0.02;

                node.connections.forEach(targetIndex => {
                    const target = nodes[targetIndex];
                    const dx = node.x - target.x;
                    const dy = node.y - target.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const alpha = (1 - dist / connectionDistance) * opacity;
                    
                    // Lines are faint grey usually, but pulse if there is activity
                    ctx.strokeStyle = `rgba(120, 120, 130, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.stroke();

                    // Randomly spawn a data packet
                    if (Math.random() < 0.001) {
                        packets.push({
                            from: i,
                            to: targetIndex,
                            progress: 0,
                            speed: 0.005 + Math.random() * 0.01,
                            size: Math.random() > 0.9 ? 2 : 1
                        });
                        node.activity = 1; // Flash node
                    }
                });
            });

            // Draw Nodes (Servers)
            nodes.forEach(node => {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity + node.activity * 0.5})`;
                ctx.beginPath();
                // Use squares for a more "tech/server" feel
                ctx.rect(node.x - node.r, node.y - node.r, node.r * 2, node.r * 2);
                ctx.fill();
                
                // Occasional blink
                if (Math.random() < 0.001) {
                     ctx.fillStyle = 'rgba(168, 85, 247, 0.8)'; // Purple blink
                     ctx.fill();
                }
            });

            // Draw & Update Packets (Data Flow)
            for (let i = packets.length - 1; i >= 0; i--) {
                const p = packets[i];
                const start = nodes[p.from];
                const end = nodes[p.to];

                p.progress += p.speed;

                if (p.progress >= 1) {
                    packets.splice(i, 1);
                    nodes[p.to].activity = 1; // Flash destination
                    continue;
                }

                const currX = start.x + (end.x - start.x) * p.progress;
                const currY = start.y + (end.y - start.y) * p.progress;

                // Glowing packet
                const packetOpacity = Math.sin(p.progress * Math.PI) * (opacity * 4); 
                ctx.fillStyle = `rgba(168, 85, 247, ${packetOpacity})`; // Purple Energy
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
                ctx.beginPath();
                ctx.rect(currX - p.size, currY - p.size, p.size*2, p.size*2);
                ctx.fill();
                ctx.shadowBlur = 0; 
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [opacity]);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
};
