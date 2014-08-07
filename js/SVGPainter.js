
var SVGPainter = Object.create(Painter);

SVGPainter.svgNs = "http://www.w3.org/2000/svg";
    
SVGPainter.init = function (target, options) {
    Painter.init.call(this, target, options);
    
    this.svgCircle = document.createElementNS(this.svgNs, "circle");
    this.svgCircle.setAttribute("fill", options.circleFill || "red");
    this.svgCircle.setAttribute("r", options.circleRadius || 5);
    this.svgCircle.style.display = "none";
    target.appendChild(this.svgCircle);
};

SVGPainter.repaint = function () {
    this.svgCircle.style.display = this.drawing ? "inline" : "none";
    this.svgCircle.setAttribute("cx", this.points[this.points.length - 1].x);
    this.svgCircle.setAttribute("cy", this.points[this.points.length - 1].y);
};

SVGPainter.getLocalXY = function (clientX, clientY) {
    var p = this.target.createSVGPoint();
    p.x = clientX;
    p.y = clientY;
    return p.matrixTransform(this.target.getScreenCTM().inverse());
};
