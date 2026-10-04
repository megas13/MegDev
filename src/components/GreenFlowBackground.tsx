"use client";

import { useEffect, useRef } from "react";
import { createGreenFlow, type GreenFlowController } from "../../public/green-flow-renderer.mjs";
import styles from "./GreenFlowBackground.module.css";

interface GreenFlowBackgroundProps {
  className?: string;
  paused?: boolean;
}

/** Place the page content in a positioned layer with z-index: 1. */
export default function GreenFlowBackground({ className = "", paused = false }: GreenFlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<GreenFlowController | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    controllerRef.current = createGreenFlow(canvasRef.current);
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setPaused(paused);
  }, [paused]);

  return (
    <div className={`${styles.background} ${className}`} data-paused={paused || undefined} aria-hidden="true">
      <div className={styles.ambient} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.shade} />
    </div>
  );
}
