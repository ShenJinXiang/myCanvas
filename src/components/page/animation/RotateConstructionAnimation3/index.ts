import Animate from "@/lib/Animate";
import Point from "@/lib/Point";

enum ElementPostionType {
  M, L, R
}
enum TaskStatus {
  PREPARE, DOING, COMPLETE
}

class Element {
  roundRadius: number;
  rotate: number = 0;
  lineWidth: number = 1;
  lineColor: string;
  pointColor: string;
  pointRadius: number;
  start: Point = { x: 0, y: 0 };
  end: Point = { x: 0, y: 0 };
  leftPoint: Point = { x: 0, y: 0 };
  rightPoint: Point = { x: 0, y: 0 };
  middelPoint: Point = { x: 0, y: 0 };
  positionPoint: Point;
  positionType: ElementPostionType;
  constructor(roundRadius: number, lineWidth: number, lineColor: string, pointColor: string, positionType: ElementPostionType = ElementPostionType.M, position: Point = { x: 0, y: 0 }) {
    this.roundRadius = roundRadius;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.pointColor = pointColor;
    this.pointRadius = this.lineWidth * 0.35;
    this.positionPoint = { x: position.x, y: position.y };
    this.positionType = positionType;
    this.refreshByPositionType();
  }

  private refreshByPositionType() {
    switch (this.positionType) {
      case ElementPostionType.L:
        this.start = { x: -this.lineWidth, y: 0 };
        this.leftPoint = { x: 0, y: 0 };
        this.middelPoint = { x: this.roundRadius, y: 0 };
        this.rightPoint = { x: 2 * this.roundRadius, y: 0 };
        this.end = { x: 2 * this.roundRadius + this.lineWidth, y: 0 };
        break;
      case ElementPostionType.M:
        this.start = { x: -this.roundRadius - this.lineWidth, y: 0 };
        this.leftPoint = { x: -this.roundRadius, y: 0 };
        this.middelPoint = { x: 0, y: 0 };
        this.rightPoint = { x: this.roundRadius, y: 0 };
        this.end = { x: this.roundRadius + this.lineWidth, y: 0 };
        break;
      case ElementPostionType.R:
        this.start = { x: -2 * this.roundRadius - this.lineWidth, y: 0 };
        this.leftPoint = { x: -2 * this.roundRadius, y: 0 };
        this.middelPoint = { x: -this.roundRadius, y: 0 };
        this.rightPoint = { x: 0, y: 0 };
        this.end = { x: this.lineWidth, y: 0 };
        break;
    }

  }

  position(positionType: ElementPostionType, x: number, y: number) {
    this.positionType = positionType;
    this.positionPoint.x = x;
    this.positionPoint.y = y;
    this.refreshByPositionType();
  }

  setRotate(rotate: number) {
    this.rotate = rotate;
  }

  draw(context: CanvasRenderingContext2D | null) {
    if (!context) {
      return;
    }
    context.save();
    context.translate(this.positionPoint.x, this.positionPoint.y);
    context.rotate(this.rotate);
    context.lineCap = 'round';
    context.beginPath();
    context.strokeStyle = this.lineColor;
    context.lineWidth = this.lineWidth;
    context.moveTo(this.start.x, this.start.y);
    context.lineTo(this.end.x, this.end.y);
    context.stroke();
    this.drawPoint(context, this.middelPoint);
    this.drawPoint(context, this.leftPoint);
    this.drawPoint(context, this.rightPoint);
    context.restore();
  }

  drawPoint(context: CanvasRenderingContext2D, p: Point) {
    context.beginPath();
    context.fillStyle = this.pointColor;
    context.arc(p.x, p.y, this.pointRadius, 0, 2 * Math.PI, false);
    context.fill();
  }

  pointPosition() {
    if (this.positionType === ElementPostionType.L) {
      return {
        l: { x: this.positionPoint.x, y: this.positionPoint.y },
        m: { x: this.positionPoint.x + this.roundRadius * Math.cos(this.rotate), y: this.positionPoint.y + this.roundRadius * Math.sin(this.rotate) },
        r: { x: this.positionPoint.x + 2 * this.roundRadius * Math.cos(this.rotate), y: this.positionPoint.y + 2 * this.roundRadius * Math.sin(this.rotate) }
      };
    }
    if (this.positionType === ElementPostionType.M) {
      return {
        l: { x: this.positionPoint.x + this.roundRadius * Math.cos(Math.PI + this.rotate), y: this.positionPoint.y + this.roundRadius * Math.sin(Math.PI + this.rotate) },
        m: { x: this.positionPoint.x, y: this.positionPoint.y },
        r: { x: this.positionPoint.x + this.roundRadius * Math.cos(this.rotate), y: this.positionPoint.y + this.roundRadius * Math.sin(this.rotate) }
      };
    }
    if (this.positionType === ElementPostionType.R) {
      return {
        l: { x: this.positionPoint.x + 2 * this.roundRadius * Math.cos(this.rotate + Math.PI), y: this.positionPoint.y + 2 * this.roundRadius * Math.sin(this.rotate + Math.PI) },
        m: { x: this.positionPoint.x + this.roundRadius * Math.cos(this.rotate + Math.PI), y: this.positionPoint.y + this.roundRadius * Math.sin(this.rotate + Math.PI) },
        r: { x: this.positionPoint.x, y: this.positionPoint.y },
      };
    }
  }
}

class Task {
  protected duration: number;
  protected taskStatus: TaskStatus;
  protected current: number;
  constructor(duration: number) {
    this.duration = duration;
    this.current = 0;
    this.taskStatus = TaskStatus.PREPARE;
  }
  update() {
    switch (this.taskStatus) {
      case TaskStatus.PREPARE:
        this.reset();
        break;
      case TaskStatus.DOING:
        this.current++;
        if (this.current >= this.duration) {
          this.taskStatus = TaskStatus.COMPLETE;
          this.current = this.duration;
        }
        break;
      case TaskStatus.COMPLETE:
        this.current = this.duration;
    }
  }
  draw(context: CanvasRenderingContext2D | null) { }
  start() {
    this.taskStatus = TaskStatus.DOING;
    this.current = 0;
  }
  reset() {
    this.taskStatus = TaskStatus.PREPARE;
    this.current = 0;
  }
  started() {
    return this.taskStatus === TaskStatus.DOING;
  }
  completed() {
    return this.taskStatus === TaskStatus.COMPLETE;
  }
}

class ElementTask extends Task {
  private element: Element;
  private position: Point;
  private positionType: ElementPostionType;
  private startAngle: number;
  private endAngle: number;
  private angleStep: number;
  private currentAngle: number = 0;
  private counterclockwise: boolean;
  constructor(element: Element, position: Point, positionType: ElementPostionType, startAngle: number, endAngle: number, duration: number, counterclockwise: boolean = false) {
    super(duration);
    this.element = element;
    this.position = position;
    this.positionType = positionType;
    const rPi = 2 * Math.PI;
    startAngle = startAngle % rPi;
    endAngle = endAngle % rPi;
    startAngle = startAngle < 0 ? startAngle + rPi : startAngle;
    endAngle = endAngle < 0 ? endAngle + rPi : endAngle;
    if (!counterclockwise) {
      startAngle = startAngle > endAngle ? startAngle - rPi : startAngle;
    } else {
      endAngle = endAngle > startAngle ? endAngle - rPi : endAngle;
    }
    this.duration = duration;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.angleStep = (this.endAngle - this.startAngle) / this.duration;
    this.counterclockwise = counterclockwise;
  }
  update() {
    super.update();
    if (this.taskStatus === TaskStatus.DOING) {
      this.currentAngle = this.startAngle + this.angleStep * this.current;
      this.element.setRotate(this.currentAngle);
    }
    if (this.taskStatus === TaskStatus.COMPLETE) {
      this.currentAngle = this.endAngle;
      this.element.setRotate(this.endAngle);
    }
  }
  start() {
    super.start();
    this.currentAngle = this.startAngle;
    this.element.position(this.positionType, this.position.x, this.position.y);
  }
  draw(context: CanvasRenderingContext2D | null) {
    if (!context) {
      return;
    }
    switch (this.taskStatus) {
      case TaskStatus.PREPARE:
        break;
      case TaskStatus.DOING:
        switch (this.positionType) {
          case ElementPostionType.L:
            this.arc(context, this.element.roundRadius, this.startAngle, this.currentAngle);
            this.arc(context, 2 * this.element.roundRadius, this.startAngle, this.currentAngle);
            break;
          case ElementPostionType.M:
            this.arc(context, this.element.roundRadius, this.startAngle + Math.PI, this.currentAngle + Math.PI);
            this.arc(context, this.element.roundRadius, this.startAngle, this.currentAngle);
            break;
          case ElementPostionType.R:
            this.arc(context, this.element.roundRadius, this.startAngle + Math.PI, this.currentAngle + Math.PI);
            this.arc(context, 2 * this.element.roundRadius, this.startAngle + Math.PI, this.currentAngle + Math.PI);
            break;
        }
        break;
      case TaskStatus.COMPLETE:
        switch (this.positionType) {
          case ElementPostionType.L:
            this.arc(context, this.element.roundRadius, this.startAngle, this.endAngle);
            this.arc(context, 2 * this.element.roundRadius, this.startAngle, this.endAngle);
            break;
          case ElementPostionType.M:
            this.arc(context, this.element.roundRadius, this.startAngle + Math.PI, this.endAngle + Math.PI);
            this.arc(context, this.element.roundRadius, this.startAngle, this.endAngle);
            break;
          case ElementPostionType.R:
            this.arc(context, this.element.roundRadius, this.startAngle + Math.PI, this.endAngle + Math.PI);
            this.arc(context, 2 * this.element.roundRadius, this.startAngle + Math.PI, this.endAngle + Math.PI);
            break;
        }
    }
    this.element.draw(context);
  }

  arc(context: CanvasRenderingContext2D, radius: number, startAngle: number, endAngle: number) {
    context.save();
    context.beginPath();
    context.strokeStyle = this.element.pointColor;
    context.lineWidth = this.element.pointRadius * 1.8;
    context.arc(this.position.x, this.position.y, radius, startAngle, endAngle, this.counterclockwise);
    context.stroke();
    context.restore();
  }
}

export default class RotateConstructionAnimation extends Animate {
  origin: Point = { x: 0, y: 0 };
  points: Point[] = [];
  tasks: Task[] = [];
  element: Element | null = null;
  current: number = 0;
  constructor(width: number, height: number) {
    super();
    this.initRect(width, height);
    this.initData();
  }

  initData() {
    const PI = Math.PI;
    this.origin = { x: 0.5 * this.width, y: 0.5 * this.height };
    const base = Math.min(this.width, this.height);
    const baseRadius = base * 0.2;
    const angleStep = PI / 3;
    for (let index = 0; index < 6; index++) {
      this.points.push({
        x: baseRadius * Math.cos(-PI / 2 + angleStep * index),
        y: baseRadius * Math.sin(-PI / 2 + angleStep * index)
      });
    }
    const element = new Element(baseRadius, 10, '#ccc', '#666');
    const sAngle = - PI / 6;
    this.tasks = [
      new ElementTask(element, this.points[4], ElementPostionType.L, sAngle, sAngle + angleStep, 100),
      new ElementTask(element, this.points[3], ElementPostionType.M, sAngle + 1 * angleStep, sAngle + 2 * angleStep, 100),
      new Task(50),
      new ElementTask(element, { x: 0, y: 0 }, ElementPostionType.L, sAngle + 2 * angleStep, sAngle + 3 * angleStep, 100),
      new ElementTask(element, this.points[4], ElementPostionType.M, sAngle + 3 * angleStep, sAngle + 4 * angleStep, 100),
      new Task(50),
    ]
    this.tasks[0].start();
  }

  update() {
    const task = this.tasks[this.current];
    if (task.started()) {
      task.update();
    } else {
      task.start();
    }
    if (task.completed()) {
      this.current++;
    }
    if (this.current >= this.tasks.length) {
      this.current = 0;
      this.tasks.forEach((item) => item.reset());
    }
  }

  draw() {
    if (!this.context) {
      return;
    }
    this.clear();
    this.context.save();
    this.context.translate(this.origin.x, this.origin.y);
    this.drawPoints(this.context);
    this.tasks.forEach((item) => item.draw(this.context));
    this.context.restore();
  }

  public setRect(width: number, height: number): this {
    this.width = width;
    this.height = height;
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
    this.initData();
    return this;
  }

  private drawPoints(context: CanvasRenderingContext2D | null) {
    if (!context) {
      return;
    }
    this.points.forEach((item) => {
      context.beginPath();
      context.fillStyle = '#333';
      context.arc(item.x, item.y, 5, 0, Math.PI * 2, false);
      context.fill();
    });
  }

}