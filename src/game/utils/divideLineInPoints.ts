import { Vector } from "./Vector";

export const divideLineInPoints = (a: Vector, b: Vector, pointsBetween: number): [Vector[], number] => {
  const part = a.dist(b) / (pointsBetween + 1);
  const ang = Vector.sub(b, a).heading();
  const points = Array.from({ length: pointsBetween })
    .map((_, index) => 
      Vector.fromAngle(ang, (index + 1) * part).add(a));
  return [ points, part ];
}