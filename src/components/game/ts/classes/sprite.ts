interface Position {
  x: number;
  y: number;
}

interface SpriteOptions {
  position: Position;
  imageSrc: string;
  frameRate?: number;
  frameBuffer?: number;
  scale?: number;
}

interface CropBox {
  position: Position;
  width: number;
  height: number;
}

export class Sprite {
  position: Position;
  scale: number;
  loaded: boolean;
  image: HTMLImageElement;
  width!: number;
  height!: number;
  frameRate: number;
  currentFrame: number;
  frameBuffer: number;
  elapsedFrames: number;

  constructor({
    position,
    imageSrc,
    frameRate = 1,
    frameBuffer = 3,
    scale = 1,
  }: SpriteOptions) {
    this.position = position;
    this.scale = scale;
    this.loaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = this.image.height * this.scale;
      this.loaded = true;
    };
    this.image.src = imageSrc;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
  }

  draw(c: CanvasRenderingContext2D): void {
    if (!this.image || !this.loaded) return;

    const cropbox: CropBox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };

    c.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(c: CanvasRenderingContext2D): void {
    this.draw(c);
    this.updateFrames();
  }

  updateFrames(): void {
    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
      else this.currentFrame = 0;
    }
  }
}
