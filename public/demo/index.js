(function() {
    let option = {
        elementStrokeColor: 'rgba(255, 255, 255, 0.5)',
        marksLength: 5000,
        minWidth: 1200,
        minHeight: 800,
        rightXStep: .5,
        // cs: [
        //     {radius: 400 / Math.PI, beginAngle: 0, angleStep: Math.PI / 360, counterclockwise: false}
        // ]
        // cs: [
        //     {radius: 400 / Math.PI, beginAngle: 0, angleStep: Math.PI / 360, counterclockwise: false}
        //     , {radius: 400 / (3 * Math.PI), beginAngle: 0, angleStep: 3 * Math.PI / 360, counterclockwise: false}
        // ]
        // cs: [
        //     {radius: 400 / Math.PI, beginAngle: 0, angleStep: Math.PI / 360, counterclockwise: false}
        //     , {radius: 400 / (3 * Math.PI), beginAngle: 0, angleStep: 3 * Math.PI / 360, counterclockwise: false}
        //     , {radius: 400 / (5 * Math.PI), beginAngle: 0, angleStep: 5 * Math.PI / 360, counterclockwise: false}
        // ]
        // cs: [
        //     {radius: 400 / Math.PI, beginAngle: 0, angleStep: Math.PI / 360, counterclockwise: false}
        //     , {radius: 400 / (3 * Math.PI), beginAngle: 0, angleStep: 3 * Math.PI / 360, counterclockwise: false}
        //     , {radius: 400 / (5 * Math.PI), beginAngle: 0, angleStep: 5 * Math.PI / 360, counterclockwise: false}
        //     , {radius: 400 / (7 * Math.PI), beginAngle: 0, angleStep: 7 * Math.PI / 360, counterclockwise: false}
        // ]
        cs: [
            {radius: 400 / Math.PI, beginAngle: 0, angleStep: Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (3 * Math.PI), beginAngle: 0, angleStep: 3 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (5 * Math.PI), beginAngle: 0, angleStep: 5 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (7 * Math.PI), beginAngle: 0, angleStep: 7 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (9 * Math.PI), beginAngle: 0, angleStep: 9 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (11 * Math.PI), beginAngle: 0, angleStep: 11 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (13 * Math.PI), beginAngle: 0, angleStep: 13 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (15 * Math.PI), beginAngle: 0, angleStep: 15 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (17 * Math.PI), beginAngle: 0, angleStep: 17 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (19 * Math.PI), beginAngle: 0, angleStep: 19 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (21 * Math.PI), beginAngle: 0, angleStep: 21 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (23 * Math.PI), beginAngle: 0, angleStep: 23 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (25 * Math.PI), beginAngle: 0, angleStep: 25 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (27 * Math.PI), beginAngle: 0, angleStep: 27 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (29 * Math.PI), beginAngle: 0, angleStep: 29 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (31 * Math.PI), beginAngle: 0, angleStep: 31 * Math.PI / 360, counterclockwise: false}
            , {radius: 400 / (33 * Math.PI), beginAngle: 0, angleStep: 33 * Math.PI / 360, counterclockwise: false}
        ]
    };
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    function linePoint(ctx, point1, point2, lineWidth, color) {
        line(ctx, point1.x, point1.y, point2.x, point2.y, lineWidth, color);
    }
    function line(ctx, sx, sy, ex, ey, lineWidth, color) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = lineWidth || 1;
        ctx.strokeStyle = !!color ? color : 'rgba(0, 0, 0, 0.5)';
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.restore();
    }
    function Element(radius, beginAngle, angleStep, counterclockwise) {
        this.radius = radius;
        this.beginAngle = beginAngle;
        this.angle = this.beginAngle;
        this.angleStep = angleStep;
        this.counterclockwise = !!counterclockwise;
    }
    Element.prototype.setOrigin = function (origin) {
        this.origin = origin;
    };
    Element.prototype.setNext = function(next) {
        this.next = next;
    };
    Element.prototype.update = function (arr) {
        this.currentPoint = new Point(
            this.origin.x + this.radius * Math.cos(this.angle),
            this.origin.y + this.radius * Math.sin(this.angle)
        );
        if(this.next) {
            this.next.setOrigin(this.currentPoint);
        }
        if (this.counterclockwise) {
            this.angle -= this.angleStep;
        } else {
            this.angle += this.angleStep;
        }
    };
    Element.prototype.draw = function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = option.elementStrokeColor;
        ctx.arc(this.origin.x, this.origin.y, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.restore();
        linePoint(ctx, this.origin, this.currentPoint, 1, option.elementStrokeColor);
    };

    let drawer = {
        start: function() {
            drawer.c = document.getElementById('canvas');
            drawer.w = drawer.c.width = drawer.getWidth();
            drawer.h = drawer.c.height = drawer.getHeight();
            drawer.ctx = drawer.c.getContext('2d');
            drawer.initElements();
            drawer.marks = [];
            drawer.rmarks = [];
            drawer.animate();
        },
        animate: function() {
            drawer.update();
            drawer.draw();
            requestAnimationFrame(drawer.animate);
        },
        update: function() {
            drawer.elements.forEach(item => item.update(drawer.marks));
            drawer.rmarks.forEach(item => item.x += option.rightXStep);
            drawer.rmarks = drawer.rmarks.filter(item => item.x <= drawer.w);
            let last = drawer.elements[drawer.elements.length - 1];
            drawer.marks.push(last.currentPoint);
            drawer.rmarks.push(new Point(option.minHeight, last.currentPoint.y));
            if (drawer.elements.length > option.marksLength) {
                drawer.elements.shift();
            }

        },
        draw: function() {
            let ctx = drawer.ctx;
            ctx.clearRect(0, 0, drawer.w, drawer.h);
            this.elements.forEach(item => item.draw(ctx));
            drawer.drawMarks(ctx, drawer.marks);
            drawer.drawMarks(ctx, drawer.rmarks);
            // linePoint(ctx, drawer.marks[drawer.marks.length - 1], drawer.rmarks[drawer.rmarks.length - 1], 1, 'rgba(255, 0, 0, 1)');
            // line(ctx, option.minHeight, 0, option.minHeight, drawer.h, 2, 'rgb(255, 255, 255)');
            drawer.drawMarkLink(ctx, drawer.marks[drawer.marks.length - 1], drawer.rmarks[drawer.rmarks.length - 1]);
        },
        drawMarkLink(ctx, markPoint, rmarkPoint) {
            linePoint(ctx, markPoint, rmarkPoint, 1, 'rgba(255, 0, 0, 1)');
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 0, 0, 1)';
            ctx.moveTo(rmarkPoint.x, rmarkPoint.y);
            ctx.lineTo(rmarkPoint.x - 20, rmarkPoint.y - 5);
            ctx.lineTo(rmarkPoint.x - 20, rmarkPoint.y + 5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        drawMarks: function(ctx, arr) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let i = 0; i < arr.length; i++ ) {
                ctx.lineTo(arr[i].x, arr[i].y);
            }
            ctx.stroke();
            ctx.restore();
        },
        initElements: function() {
            drawer.elements = [];
            option.cs.forEach(function (item, index) {
                let elment = new Element(item.radius, item.beginAngle, item.angleStep, item.counterclockwise);
                if (index == 0) {
                    elment.setOrigin(new Point(option.minHeight / 2, option.minHeight / 2));
                } else {
                    let prev = drawer.elements[index - 1];
                    prev.setNext(elment);
                    elment.setOrigin(new Point(
                        prev.origin.x + prev.radius * Math.cos(prev.angle),
                        prev.origin.y + prev.radius * Math.sin(prev.angle)
                    ));
                }
                drawer.elements.push(elment);
            });
        },
        getWidth: function () {
            return window.innerWidth <= option.minWidth ? option.minWidth : window.innerWidth;
        },
        getHeight: function () {
            return window.innerHeight <= option.minHeight ? option.minHeight : window.innerHeight;
        }
    };
    drawer.start();
})();
