{
    const option = {
        angleRange: 1.4 * Math.PI, // 角度范围
        maxVal: 160,                // 最大值
        stepNum: 8,                 // 段数
        width: 380,                 // 最大尺寸

    };

    class DrawPlan {
        constructor(time, startVal, endVal) {
            this.time = time;
            this.current = 0;
            this.start = startVal;
            this.end = endVal;
            this.step = (this.end - this.start) / this.time;
            this.val = this.start;
        }
        isEnd() {
            return this.time <= this.current;
        }
        update() {
            this.current++;
            this.val = this.current * this.step;
            this.currentAngle = option.angleRange * this.val / option.maxVal;
        }
        draw(ctx) {
            ctx.save();
            // 圆弧上的圆点刻度
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.arc(
                drawer.rs[4] * Math.cos(this.currentAngle),
                drawer.rs[4] * Math.sin(this.currentAngle),
                drawer.pointRadius,
                0,
                2 * Math.PI,
                false
            );
            ctx.fill();

            ctx.rotate(-drawer.startAngle);
            // 当前值
            ctx.beginPath();
            ctx.fillStyle = '#fff';
            ctx.font = drawer.currentValueFontSize + 'px Times New Roman Arial';
            ctx.fillText(this.val.toFixed(1), 0, drawer.currentValueY);
            ctx.rotate(drawer.startAngle);

            ctx.restore();
        }
    }

    class Plans {
        constructor() {
            this.plans = [];
        }
        addPlan(plan) {
            this.plans.push(plan);
            if (!this.currentPlan) {
                this.currentPlan = this.plans.shift();
                this.isEnd = !this.currentPlan;
            }
        }
        lastPlan() {
            if (this.plans.length) {
                return this.plans[this.plans.length - 1];
            }
            if (this.currentPlan) {
                return this.currentPlan;
            }
            return null;
        }
        update() {
            if (!this.currentPlan) {
                return;
            }
            this.currentPlan.update();
        }
        draw(ctx) {
            if (!this.currentPlan) {
                return;
            }
            this.currentPlan.draw(ctx);
            if (this.currentPlan.isEnd()) {
                this.currentPlan = this.plans.shift();
                if (!this.currentPlan) {
                    this.isEnd = true;
                }
            }

        }
    }

    const drawer = {
        start() {
            drawer.c = document.getElementById('canvas');
            drawer.ctx = drawer.c.getContext('2d');
            drawer.mark = CanvasUtil.getMarkCanvas('#999');
            drawer.init();
            drawer.animate();
            // drawer.drawStatic();
            // drawer.drawValues();
        },
        init() {
            drawer.w = drawer.c.width = window.innerWidth;
            drawer.h = drawer.c.height = window.innerHeight;
            drawer.r = option.width / 2;
            drawer.ox = drawer.w / 2;
            drawer.oy = drawer.h / 2;
            drawer.rs = [
                drawer.r * 1.0,  // 最外层半径(长刻度外半径)
                drawer.r * 0.97, // 短刻度外半径
                drawer.r * 0.92, // 刻度内半径
                drawer.r * 0.85, // 刻度值位置半径
                drawer.r * 0.6   // 红点所在圆半径
            ];
            drawer.vals = [];
            drawer.valStep = option.maxVal / option.stepNum;
            for (let i = 0; i <= option.stepNum; i++) {
                drawer.vals.push({val: drawer.valStep * i, angle: i * option.angleRange / option.stepNum});
            }
            drawer.angleStep = option.angleRange / (option.stepNum * 5);
            // 左侧0的起始角度
            drawer.startAngle = - (Math.PI / 2) - option.angleRange / 2;

            // 红色校圆点的半径
            drawer.pointRadius = 4;

            // 文字"下载速度"相对于圆心所在位置Y值
            drawer.xzsdY = -drawer.r * 0.23;
            drawer.currentValueY = drawer.r * 0;
            drawer.mbpsY = drawer.r * 0.23;

            drawer.xzsdFontSize = drawer.r * .06
            drawer.currentValueFontSize = drawer.r * 0.4;
            drawer.mbpsFontSize = drawer.r * .06


            // // 当前值
            // drawer.currentValue = 40;
            // // 当前值对应的角度
            // drawer.currentAngle = option.angleRange * drawer.currentValue / option.maxVal;

            drawer.initData();
        },
        initData() {
            drawer.plans = new Plans();
            drawer.plans.addPlan(drawer.createPlan());
            drawer.plans.addPlan(drawer.createPlan());
        },
        createPlan() {
            let startVal = 0,
                endVal,
                randomD = random(-1, 1),
                d = randomD > 0 ? 1 : (randomD < 0 ? -1 : 0),
                time = 0,
                lastPlan = drawer.plans.lastPlan();
            if (lastPlan) {
                startVal = lastPlan.end;
            }
            endVal = startVal + d * random(option.maxVal * 0.25);
            endVal = endVal < 0 ? 0 : endVal;
            endVal = endVal > option.maxVal ? option.maxVal : endVal;
            time = Math.abs(endVal - startVal) * 100;
            return new DrawPlan(time, startVal, endVal);
        },
        animate() {
            drawer.update();
            drawer.draw();
        },
        update() {
            this.plans.update();
        },
        draw() {
            let ctx = drawer.ctx;
            ctx.save();
            ctx.translate(drawer.ox, drawer.oy);
            ctx.rotate(drawer.startAngle);
            ctx.strokeStyle = '#a1a1a1';
            ctx.fillStyle = '#a1a1a1';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            drawer.drawStatic(ctx);
            this.plans.draw(ctx);

            ctx.restore();
        },
        drawStatic(ctx) {
            // 刻度
            for (let i = 0; i <= option.stepNum * 5; i++) {
                ctx.save();
                ctx.rotate(i * drawer.angleStep);
                ctx.beginPath();
                if (i % 5 == 0) {
                    ctx.lineWidth = 2;
                    ctx.lineTo(drawer.rs[0], 0);
                } else {
                    ctx.lineWidth = 1;
                    ctx.lineTo(drawer.rs[1], 0);
                }
                ctx.lineTo(drawer.rs[2], 0);
                ctx.stroke();
                ctx.restore();
            }

            ctx.rotate(-drawer.startAngle);
            // 刻度值
            drawer.vals.forEach(function (item) {
                ctx.font = '12px Arial';
                ctx.fillText(item.val, drawer.rs[3] * Math.cos(item.angle + drawer.startAngle), drawer.rs[3] * Math.sin(item.angle + drawer.startAngle));
            });

            // 下载速度
            ctx.beginPath();
            ctx.font = drawer.xzsdFontSize + 'px Arial';
            ctx.fillText('下载速度', 0, drawer.xzsdY);

            // Mbps
            ctx.beginPath();
            ctx.font = drawer.mbpsFontSize + 'px Times New Roman Arial';
            ctx.fillText('Mbps', 0, drawer.mbpsY);
            ctx.rotate(drawer.startAngle);

            // 圆弧
            ctx.beginPath();
            ctx.arc(0, 0, drawer.rs[4], 0, option.angleRange, false);
            ctx.stroke();
        }
    }


    drawer.start();
}