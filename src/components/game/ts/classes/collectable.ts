// Types and interfaces
interface Position {
  x: number;
  y: number;
}

interface CollectableProps {
  position: Position;
}

interface Player {
  hitbox: {
    position: Position;
    width: number;
    height: number;
  };
}

// Utility function for random position
export function getRandomPosition(): Position {
  const minX = 50;
  const maxX = 550;
  const minY = 50;
  const maxY = 400;

  return {
    x: Math.floor(Math.random() * (maxX - minX) + minX),
    y: Math.floor(Math.random() * (maxY - minY) + minY),
  };
}

export class Collectable {
  position: Position;
  width: number;
  height: number;
  collected: boolean;
  image: HTMLImageElement;

  constructor({ position }: CollectableProps) {
    this.position = position;
    this.width = 20;
    this.height = 20;
    this.collected = false;

    this.image = new Image();
    this.image.src = `./img/Banana.png`;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (!this.collected) {
      context.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  checkCollision(player: Player): boolean {
    if (this.collected) return false;

    return collision({
      object1: player.hitbox,
      object2: {
        position: this.position,
        width: this.width,
        height: this.height,
      },
    });
  }
}

// Import this from your utilities file
import { collision } from "../utils";
