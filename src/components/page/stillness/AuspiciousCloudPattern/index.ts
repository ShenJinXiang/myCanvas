import BaseCanvas from "@/lib/BaseCanvas";

interface IOption {
    backgroundColor: string;
    cloudColor: string;
};

class Element {
    private x: number;
    private y: number;
    private radius: number;
    private rs: number[];
    constructor() {
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.rs = [1, 0.8, 0.6, 0.5, 0.4, 0.3];
    }

    data(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        return this;
    }

    draw(context: CanvasRenderingContext2D | null, style: string, backgroundColor: string) {
        if (!context) {
            return;
        }
        context.save();
        context.translate(this.x, this.y);
        // backaground
        context.beginPath();
        context.fillStyle = backgroundColor;
        context.arc(0, 0, this.radius, -Math.PI, 0, false);
        context.fill();
        context.closePath();
        // line
        this.rs.forEach((item, index) => {
            context.beginPath();
            context.strokeStyle = style;
            const radius = this.radius * item;
            context.lineWidth = index === 0 ? (radius * 0.05 > 2 ? radius * 0.05 : 2) : (radius * 0.02 > 1 ? radius * 0.02 : 1);
            context.arc(0, 0, this.radius * item, -Math.PI, 0, false);
            context.stroke();
        });
        context.restore();
    }
}

export default class AuspiciousCloudPattern extends BaseCanvas {
    private elements: Element[] = [];
    private option: IOption = {
        backgroundColor: '#f1f1f1',
        cloudColor: '#333'
    };
    constructor(width: number, height: number) {
        super();
        this.initRect(width, height);
        this.initData();
    }

    initData() {
        // const ele = new Element();
        // ele.data(
        //     this.width * 0.5,
        //     this.height * 0.5,
        //     200
        // );
        // this.elements = [
        //     ele
        // ];
        const size = this.width * 0.05;
        for (let x: number = 0; x < this.width; x += 2 * size) {
            this.elements.push(
                new Element().data(x, size, size)
            );
        }
    }

    draw() {
        if (!this.context) {
            return;
        }
        this.clear(this.option.backgroundColor);

        this.context.save();
        this.elements.forEach((item) => item.draw(this.context, this.option.cloudColor, this.option.backgroundColor));
        this.context.restore();
    }
}