"use client";
import React, { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Player } from "./ts/classes/player";
import { Sprite } from "./ts/classes/sprite";
import { CollisionBlock } from "./ts/classes/collisionBlock";
import { Collectable, getRandomPosition } from "./ts/classes/collectable";
import { floorCollisions, platformCollisions } from "./ts/data/collisions";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "classic";
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;

    canvas.width = 1024;
    canvas.height = 576;

    const scaledCanvas = {
      width: canvas.width / 4,
      height: canvas.height / 4,
    };

    const floorCollisions2D = [];
    for (let i = 0; i < floorCollisions.length; i += 36) {
      floorCollisions2D.push(floorCollisions.slice(i, i + 36));
    }

    const collisionBlocks: CollisionBlock[] = [];
    floorCollisions2D.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 202) {
          collisionBlocks.push(
            new CollisionBlock({
              position: { x: x * 16, y: y * 16 },
            })
          );
        }
      });
    });

    const platformCollisions2D = [];
    for (let i = 0; i < platformCollisions.length; i += 36) {
      platformCollisions2D.push(platformCollisions.slice(i, i + 36));
    }

    const platformCollisionBlocks: CollisionBlock[] = [];
    platformCollisions2D.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 202) {
          platformCollisionBlocks.push(
            new CollisionBlock({
              position: { x: x * 16, y: y * 16 },
              height: 4,
            })
          );
        }
      });
    });

    const player = new Player({
      position: { x: 0, y: 300 },
      collisionBlocks,
      platformCollisionBlocks,
      imageSrc: "./img/minion/Idle.png",
      frameRate: 8,
      animations: {
        Idle: {
          imageSrc: "./img/minion/Idle.png",
          frameRate: 8,
          frameBuffer: 10,
        },
        Run: {
          imageSrc: "./img/minion/Run.png",
          frameRate: 8,
          frameBuffer: 5,
        },
        Jump: {
          imageSrc: "./img/minion/Jump.png",
          frameRate: 2,
          frameBuffer: 3,
        },
        Fall: {
          imageSrc: "./img/minion/Fall.png",
          frameRate: 2,
          frameBuffer: 3,
        },
        FallLeft: {
          imageSrc: "./img/minion/FallLeft.png",
          frameRate: 2,
          frameBuffer: 3,
        },
        RunLeft: {
          imageSrc: "./img/minion/RunLeft.png",
          frameRate: 8,
          frameBuffer: 5,
        },
        IdleLeft: {
          imageSrc: "./img/minion/IdleLeft.png",
          frameRate: 8,
          frameBuffer: 10,
        },
        JumpLeft: {
          imageSrc: "./img/minion/JumpLeft.png",
          frameRate: 2,
          frameBuffer: 3,
        },
      },
    });

    const keys = {
      d: { pressed: false },
      a: { pressed: false },
    };

    const background = new Sprite({
      position: { x: 0, y: 0 },
      imageSrc: "./img/background.png",
    });

    const backgroundImageHeight = 432;
    const camera = {
      position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
      },
    };

    // ** Create Collectables **
    const collectables: Collectable[] = Array.from(
      { length: 1 },
      () => new Collectable({ position: getRandomPosition() })
    );

    function animate() {
      window.requestAnimationFrame(animate);
      if (!c) return;

      c.fillStyle = "white";
      if (canvas) {
        c.fillRect(0, 0, canvas.width, canvas.height);
      }

      c.save();
      c.scale(4, 4);
      c.translate(camera.position.x, camera.position.y);
      background.update(c);

      player.checkForHorizontalCanvasCollision();
      player.update(c);

      collectables.forEach((collectable) => {
        collectable.draw(c);

        if (collectable.checkCollision(player)) {
          collectable.collected = true;
          setTimeout(() => {
            router.push(`/banana?difficulty=${difficulty}`);
          }, 500);
        }
      });

      player.velocity.x = 0;
      if (keys.d.pressed) {
        player.switchSprite("Run");
        player.velocity.x = 2;
        player.lastDirection = "right";
        if (canvas) {
          player.shouldPanCameraToTheLeft({ canvas, camera });
        }
      } else if (keys.a.pressed) {
        player.switchSprite("RunLeft");
        player.velocity.x = -2;
        player.lastDirection = "left";
        if (canvas) {
          player.shouldPanCameraToTheRight({ canvas, camera });
        }
      } else if (player.velocity.y === 0) {
        if (player.lastDirection === "right") player.switchSprite("Idle");
        else player.switchSprite("IdleLeft");
      }

      if (player.velocity.y < 0) {
        if (canvas) {
          player.shouldPanCameraDown({ camera, canvas });
        }
        if (player.lastDirection === "right") player.switchSprite("Jump");
        else player.switchSprite("JumpLeft");
      } else if (player.velocity.y > 0) {
        if (canvas) {
          player.shouldPanCameraUp({ camera, canvas });
        }
        if (player.lastDirection === "right") player.switchSprite("Fall");
        else player.switchSprite("FallLeft");
      }

      c.restore();
    }

    animate();

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "d":
          keys.d.pressed = true;
          break;
        case "a":
          keys.a.pressed = true;
          break;
        case "w":
          player.velocity.y = -4;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "d":
          keys.d.pressed = false;
          break;
        case "a":
          keys.a.pressed = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [difficulty, router]);

  return (
    <div className="flex items-center justify-center ">
      <canvas
        ref={canvasRef}
        className="border-8 border-red-800 rounded-xl shadow-2xl"
      ></canvas>
    </div>
  );
}
