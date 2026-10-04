export interface GreenFlowController {
  setPaused(paused: boolean): void;
  destroy(): void;
}

export function createGreenFlow(
  canvas: HTMLCanvasElement,
  options?: { paused?: boolean },
): GreenFlowController | null;
