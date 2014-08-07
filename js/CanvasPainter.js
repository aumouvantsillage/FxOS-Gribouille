
var svgNs = "http://www.w3.org/2000/svg";
    
var CanvasPainter = Object.create(Painter);

CanvasPainter.init = function (target, options) {
    Painter.init.call(this, target, options);
    this.context = target.getContext("2d");
};

CanvasPainter.repaint = function () {
    this.context.beginPath();
    this.context.strokeStyle = this.options.pathStroke;
    this.context.lineWidth = this.options.pathStrokeWidth;
    this.context.moveTo(this.points[this.index].x, this.points[this.index].y);
    for (var i = this.index + 1; i < this.points.length; i ++) {
        this.context.lineTo(this.points[i].x, this.points[i].y);
    } 
    this.context.stroke();
};

// TODO implement CanvasPainter.getLocalXY
