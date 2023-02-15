import Animate from "@/lib/Animate";

interface IOption {
  backgroundColor: string;
  bodyColor: string;
  fixedPointColor: string;
}

class FixedPoint {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  draw(context: CanvasRenderingContext2D | null, radius: number, style: string) {
    if (!context) {
      return;
    }
    context.save();
    context.beginPath();
    context.fillStyle = style;
    context.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
    context.fill();
    context.restore();
  }
}

class Head {
  fixedPoint: FixedPoint;
  rotate: number;
  constructor(fixedPoint: FixedPoint, rotate: number) {
    this.fixedPoint = fixedPoint;
    this.rotate = rotate;
  }
  draw(context: CanvasRenderingContext2D | null, radius: number, style: string) {
    if (!context) {
      return;
    }
    context.save();
    context.beginPath();
    context.fillStyle = style;
    context.arc(0.5 * radius * Math.cos(this.rotate), 0.5 * radius * Math.sin(this.rotate), radius, 0, 2 * Math.PI, false);
    context.fill();
    context.restore();
  }
}
class Limb {
  fixedPoint1: FixedPoint;
  fixedPoint2: FixedPoint;
  next: Limb | null = null;
  constructor(fixedPoint1: FixedPoint, fixedPoint2: FixedPoint) {
    this.fixedPoint1 = fixedPoint1;
    this.fixedPoint2 = fixedPoint2;
  }

  setNextElement(next: Limb) {
    this.next = next;
  }

  draw(context: CanvasRenderingContext2D | null, limbSize: number, style: string) {
    if (!context) {
      return;
    }
    context.save();
    context.beginPath();
    context.lineWidth = limbSize;
    context.strokeStyle = style;
    context.lineCap = 'round';
    context.moveTo(this.fixedPoint1.x, this.fixedPoint1.y);
    context.lineTo(this.fixedPoint2.x, this.fixedPoint2.y);
    context.stroke();
    context.restore();
  }

}

export default class WoodenManAnimation extends Animate {
  private option: IOption = {
    backgroundColor: '#f1f1f1',
    bodyColor: '#333',
    fixedPointColor: '#e1e1e1'
  };
  points: FixedPoint[] = [];
  head: Head | null = null;
  limbs: Limb[] = [];
  constructor(width: number, height: number) {
    super();
    this.initRect(width, height);
    this.initData();
  }

  private initData() {
    this.points = [
      new FixedPoint(100, 100),
      new FixedPoint(200, 200),
    ];
    this.limbs = [
      new Limb(this.points[0], this.points[1])
    ]
  }

  draw() {
    if (!this.context) {
      return;
    }
    this.clear(this.option.backgroundColor);
    this.context.save();
    this.limbs.forEach((item) => item.draw(this.context, 20, this.option.bodyColor));
    this.points.forEach((item) => item.draw(this.context, 3, this.option.fixedPointColor));
    this.context.restore();
  }
}