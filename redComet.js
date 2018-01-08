'use strict';

let renderRedComet = function(container) {
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const ctx = canvas.getContext('2d');
    // 颜色
    const bgColor = '#000';
    const redCometColor = 'rgb(214, 30, 30)';
    const redCometTailColor = 'rgb(214, 30, 30)';

    // 点
    const Dot = (function() {
        const dotFn = {

        }
        
        return function(x, y, color) {
            let dot = Object.create(dotFn);
            dot.x = x;
            dot.y = y;
            dot.color = color;

            return dot;
        }
    })();

    // canvas绘制
    let clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
    let fillCanvas = (color) => {
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.fill();
    };
    let drawCircle = (x, y, radius, color) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    };

    // 红彗星！
    let redComet = {
        dot: null,
        tail: [],
        radius: 4,
        init() {
            this.dot = Dot(canvas.width / 2, canvas.height / 2, redCometColor);
        },
        setPos(x, y) {
            this.dot.x = x;
            this.dot.y = y;
        },
        update() {
            drawCircle(this.dot.x, this.dot.y, this.radius, this.dot.color);
        }
    }

    // 渲染
    let render = function() {
        // 根据鼠标位置设置红彗星位置
        
        clearCanvas();
        // fillCanvas(bgColor);
        redComet.update();

        requestAnimationFrame(render);
    }
    
    // 监听鼠标
    let listenMouse = function() {
        canvas.addEventListener('mousemove', function(e) {
            redComet.setPos(e.offsetX, e.offsetY);
        });
    }

    redComet.init();
    listenMouse();
    render();

    // 添加dom
    container.appendChild(canvas);
}