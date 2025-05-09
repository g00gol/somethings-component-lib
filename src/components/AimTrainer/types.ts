export interface Position {
  x: number;
  y: number;
}

export interface TargetProps {
  position: Position;
  onHit: () => void;
  duration?: number;
}

export const TARGET_SIZE = 80;
