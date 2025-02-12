interface CollisionObject {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
}

interface CollisionParams {
  object1: CollisionObject;
  object2: CollisionObject;
}

export function collision({ object1, object2 }: CollisionParams): boolean {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}

export function platformCollision({
  object1,
  object2,
}: CollisionParams): boolean {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y + object1.height <=
      object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}
