'use strict';

let renderRedComet = function (container) {
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const ctx = canvas.getContext('2d');
    // 颜色
    const bgColor = '#000';
    const redCometColor = 'rgb(214, 30, 30)';
    const redCometTailColor = 'rgba(232, 70, 70, 0.7)';
    const msColor = '#eee';
    
    // canvas绘制
    let clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
    let fillCanvas = (color) => {
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        if (color)
            ctx.fillStyle = color;
        ctx.fill();
    };
    let drawCircle = (x, y, radius, color) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        if (color)
            ctx.fillStyle = color;
        ctx.fill();
    };
    let centerPos = (pos1, pos2) => [(pos1[0] + pos2[0]) / 2, (pos1[1] + pos2[1]) / 2];
    let drawPath = (posList, width, color) => {
        ctx.beginPath();
        // 绘制平滑的曲线
        for (let i = 0; i < posList.length - 2; i++) {
            // 二次贝塞尔曲线需要的三个坐标
            let startPos, endPos, controlPos;
            if (i === 0) startPos = posList[i];
            else startPos = centerPos(posList[i], posList[i + 1]);
            controlPos = posList[i + 1];
            if (i === posList.length - 2) endPos = posList[i + 2];
            else endPos = centerPos(posList[i + 1], posList[i + 2]);

            ctx.moveTo(startPos[0], startPos[1]);
            ctx.quadraticCurveTo(controlPos[0], controlPos[1], endPos[0], endPos[1]);
        }
        if (width)
            ctx.lineWidth = width;
        if (color)
            ctx.strokeStyle = color;
        ctx.stroke();
    }

    // 点
    const Dot = (function () {
        const dotFn = {

        }
        return function (x, y, color) {
            let dot = Object.create(dotFn);
            dot.x = x;
            dot.y = y;
            dot.color = color;

            return dot;
        }
    })();


    // 红彗星！
    let redComet = {
        dot: null,
        radius: 5,
        tail: null,
        tailLength: 20,
        tailInterval: 2, // 拖尾帧间隔
        tailSpeed: 4, // 拖尾速度
        tailRotation: Math.PI * 0.75,
        posHistory: [], // 每帧的坐标记录
        init() {
            this.dot = Dot(canvas.width / 2, canvas.height / 2, redCometColor);
            this.tail = new Array(this.tailLength).fill([this.dot.x, this.dot.y]);
        },
        setPos(x, y) {
            // 更新主体坐标
            this.dot.x = x;
            this.dot.y = y;
        },
        updateData() {
            // 如20个拖尾点，每个间隔5帧，最多只需记录100帧的坐标
            if (this.posHistory.length >= this.tailLength * this.tailInterval) {
                this.posHistory.pop();
            }
            this.posHistory.unshift([this.dot.x, this.dot.y]);
            for (let i = 0; i < this.tailLength; i++) {
                let tailIndex = i * this.tailInterval;
                if (this.posHistory[tailIndex]) {
                    this.tail[i] = [this.posHistory[tailIndex][0] - this.tailSpeed * i, this.posHistory[tailIndex][1] + this.tailSpeed * i];
                }
            }
        },
        // 绘制
        draw() {
            // 绘制
            drawCircle(this.dot.x, this.dot.y, this.radius, this.dot.color);
            drawPath([[this.dot.x, this.dot.y], ...this.tail], 2, redCometTailColor);
        }
    }

    // ms大军!
    let msRain = {
        msList: [],
        msListLength: 50,
        basicRadius: 4,
        basicSpeed: 2,
        init() {
            while (this.msListLength--) {
                let dot = Dot(null, null, msColor);
                this.initPos(dot);
                this.msList.push(dot);
            }
        },
        initPos(dot) {
            if (Math.random() > 0.5) {
                dot.x = canvas.width * 1.1 + Math.random() * 20;
                dot.y = Math.random() * canvas.height;
            } else {
                dot.x = Math.random() * canvas.width;
                dot.y = 0 - canvas.height * 0.1 - Math.random() * 20;
            }
        },
        updateData() {
            for (let item of this.msList) {
                item.x -= this.basicSpeed;
                item.y += this.basicSpeed;
            }
        },
        draw() {
            for (let item of this.msList) {
                drawCircle(item.x, item.y, this.basicRadius, item.color);
            }
        },
        
    }

    // 渲染
    let render = function () {
        // 更新数据
        msRain.updateData();
        redComet.updateData();
        
        // 绘制
        clearCanvas();
        fillCanvas(bgColor);
        msRain.draw();
        redComet.draw();

        requestAnimationFrame(render);
    }

    // 监听鼠标
    let listenMouse = function () {
        canvas.addEventListener('mousemove', function (e) {
            redComet.setPos(e.offsetX, e.offsetY);
        });
    }

    redComet.init();
    msRain.init();
    listenMouse();
    render();

    // 添加dom
    container.appendChild(canvas);
}