
var SVGPolylinePainter = Object.create(SVGPainter);

SVGPolylinePainter.init = function (target, options) {
    SVGPainter.init.call(this, target, options);
    this.svgPolyline = null;
};

SVGPolylinePainter.repaint = function () {
    SVGPainter.repaint.call(this);

    var svgPolylinePoints;
    if (this.index === 0) {
        this.svgPolyline = document.createElementNS(this.svgNs, "polyline");
        this.svgPolyline.setAttribute("stroke", this.options.pathStroke);
        this.svgPolyline.setAttribute("stroke-width", this.options.pathStrokeWidth);
        this.svgPolyline.setAttribute("fill", "none");
        this.target.insertBefore(this.svgPolyline, this.svgCircle);
        svgPolylinePoints = "";
    }
    else {
        svgPolylinePoints = this.svgPolyline.getAttribute("points");
    }
    
    for (var i = this.index; i < this.points.length; i ++) {
        svgPolylinePoints += this.points[i].x + "," + this.points[i].y + " ";
    }
    
    this.svgPolyline.setAttribute("points", svgPolylinePoints);
};