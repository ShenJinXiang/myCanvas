import BaseCanvas from "@/lib/BaseCanvas";

interface IOption {
    backgroundColor: string;
    showColor: string;
}


export default class Background extends BaseCanvas {
    private static readonly option: IOption = {
        backgroundColor: '#000',
        showColor: '#fff',
    };
    private elements: Element[] = [];
    constructor(width: number, height: number) {
        super();
        this.initRect(width, height);
        this.markCanvas.setStyle('rgba(250, 250, 250, 0.5)');
        this.initData();
    }
    initData() {
        this.elements = [];
    }
    draw() {
        if (!this.context) {
            return;
        }
        this.clear(Background.option.backgroundColor);

        this.context.save();
        this.context.fillStyle = Background.option.showColor;
        this.context.fillRect(200, 200, 400, 230);
        this.context.restore();
        this.drawMark();
    }

    public setRect(width: number, height: number) {
        this.initRect(width, height);
        this.initData();
        this.draw();
    }
}