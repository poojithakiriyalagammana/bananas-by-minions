import { Sprite } from "./sprite";
import { collision, platformCollision } from "../utils";
import { CollisionBlock } from "./collisionBlock";

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

interface Hitbox {
  position: Position;
  width: number;
  height: number;
}

interface Animation {
  imageSrc: string;
  frameRate: number;
  frameBuffer: number;
  image?: HTMLImageElement;
}

interface PlayerProps {
  position: Position;
  collisionBlocks: CollisionBlock[];
  platformCollisionBlocks: CollisionBlock[];
  imageSrc: string;
  frameRate: number;
  scale?: number;
  animations: Record<string, Animation>;
}

interface Camera {
  position: Position;
}

interface Canvas {
  width: number;
  height: number;
}

const gravity = 0.1;

export class Player extends Sprite {
  position: Position;
  velocity: Velocity;
  collisionBlocks: CollisionBlock[];
  platformCollisionBlocks: CollisionBlock[];
  hitbox: Hitbox;
  animations: Record<string, Animation>;
  lastDirection: string;
  camerabox: Hitbox;

  constructor({
    position,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    animations,
  }: PlayerProps) {
    super({ position, imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };

    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };

    this.animations = animations;
    this.lastDirection = "right";

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;
      this.animations[key].image = image;
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  switchSprite(key: string): void {
    if (this.image === this.animations[key].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image!;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  updateCamerabox(): void {
    this.camerabox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  checkForHorizontalCanvasCollision(): void {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0;
    }
  }

  shouldPanCameraToTheLeft({
    canvas,
    camera,
  }: {
    canvas: Canvas;
    camera: Camera;
  }): void {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
    const scaledDownCanvasWidth = canvas.width / 4;

    if (cameraboxRightSide >= 576) return;

    if (
      cameraboxRightSide >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight({
    canvas,
    camera,
  }: {
    canvas: Canvas;
    camera: Camera;
  }): void {
    if (this.camerabox.position.x <= 0) return;

    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraDown({
    canvas,
    camera,
  }: {
    canvas: Canvas;
    camera: Camera;
  }): void {
    if (this.camerabox.position.y + this.velocity.y <= 0) return;

    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraUp({
    canvas,
    camera,
  }: {
    canvas: Canvas;
    camera: Camera;
  }): void {
    if (
      this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
      432
    )
      return;

    const scaledCanvasHeight = canvas.height / 4;

    if (
      this.camerabox.position.y + this.camerabox.height >=
      Math.abs(camera.position.y) + scaledCanvasHeight
    ) {
      camera.position.y -= this.velocity.y;
    }
  }

  update(context: CanvasRenderingContext2D): void {
    this.updateFrames();
    this.updateHitbox();
    this.updateCamerabox();
    this.draw(context);

    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
  }

  updateHitbox(): void {
    this.hitbox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 14,
      height: 27,
    };
  }

  checkForHorizontalCollisions(): void {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = this.hitbox.position.x - this.position.x;

          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  applyGravity(): void {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions(): void {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;

          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    // platform collision blocks
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];

      if (
        platformCollision({
          object1: this.hitbox,
          object2: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
