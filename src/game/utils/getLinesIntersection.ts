import { Vector } from "./Vector";

// stolen from https://discourse.processing.org/t/vector-math-for-line-to-line-intersection/5296
const DIV_TOO_FAR = 0.00001;
export const getLinesIntersection = (a: Vector, b: Vector, c: Vector, d: Vector): Vector|false => {
  // center everything on point "d"
  const axis = c.copy().sub(d);
  const axLen = axis.mag();
  axis.normalize();
  const workingA = a.copy().sub(d);
  const workingB = b.copy().sub(d);

  // create a perpendicular vector to "c-d"
  const rightang = new Vector(-axis.y, axis.x);

  // In short: rotate everything so "c-d" becomes the y-axis
  //   rightang becomes x-axis
  const mappedA = new Vector(workingA.dot(rightang), workingA.dot(axis));
  const mappedB = new Vector(workingB.dot(rightang), workingB.dot(axis));
  // More detail: mappedA and -B are projections of "a" and "b" onto the lines
  //   "c-d" and "rightang", creating Axis Aligned 2D coordinates

  // Get the axis-aligned segment
  const dir = mappedA.sub(mappedB);

  // This is the same math used for 2D axis-aligned-bounding-boxes but only used
  //   for one intersection instead of two edges
  // In other words:
  //   "How much do we change segment 'a-b's length to reach segment 'c-d'?"
  // Result can be +/- INF, meaning segments are parallel
  // Relying on the floating point to handle div by 0.0 --> INF
  //   is implementation dependant. Your hardware may vary.
  let tx = 1.0 / DIV_TOO_FAR;
  if (Math.abs(dir.x) > DIV_TOO_FAR)
    tx = -mappedB.x / dir.x;
  
  // when the original line segment "a-b" is extended/shortened by tx,
  //   the end of that segment is the intersecting point
  const inters = new Vector(a.copy().sub(b).mult(tx).add(b));
  
  // Segment/segment intersection:
  // Logic is that if the first segment would have to expand or reverse to
  //   reach the point at 'inters', then the segments do not cross
  const ty = inters.sub(d).dot(axis);
  const intersecting = (tx >= 0) && (tx <= 1.0) && (ty >= 0) && (ty <= axLen);
  
  inters.add(d);
  return intersecting ? inters : false;
}