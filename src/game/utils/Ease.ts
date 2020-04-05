// https://gist.github.com/yukulele/2234731c0445dd5b1f4673889bf3330c

export class Ease {
  static in(p = 1) {
    return (t: number) => t ** p;
  }
  static out(p = 1) {
    return (t: number) => 1 - Ease.in(p)(1 - t);
  }
  static inOut(p = 1) {
    return (t: number): number => {
      if (t <= 0.5) {
        return Ease.in(p)(t * 2) / 2
      }
      return 1 - Ease.inOut(p)(1 - t);
    }
  }
}