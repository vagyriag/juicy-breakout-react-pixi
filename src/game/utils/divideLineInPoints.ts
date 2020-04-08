import { Vector } from "./Vector";

export const divideLineInPoints = (a: Vector, b: Vector, pointsBetween: number) => {
  const part = a.dist(b) / (pointsBetween + 1);
  const ang = Vector.sub(b, a).heading();
  return Array.from({ length: pointsBetween })
    .map((_, index) => 
      Vector.fromAngle(ang, (index + 1) * part).add(a));
}