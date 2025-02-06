interface Position {
  x: number;
  y: number;
}

interface CollisionBlockProps {
  position: Position;
  height?: number;
}

export class CollisionBlock {
  position: Position;
  width: number;
  height: number;

  constructor({ position, height = 16 }: CollisionBlockProps) {
    this.position = position;
    this.width = 16;
    this.height = height;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(255, 0, 0, 0.5)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(context: CanvasRenderingContext2D): void {
    this.draw(context);
  }
}
