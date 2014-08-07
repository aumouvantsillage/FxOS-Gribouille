
var SVGPolylineGroupPainter = Object.create(SVGPainter);

SVGPolylinePainter.init = function (target, options) {
    SVGPainter.init.call(this, target, options);
    this.svgGroup = null;
};

SVGPolylineGroupPainter.repaint = function () {
    SVGPainter.repaint.call(this);
    
    if (this.index === 0) {
        this.svgGroup = document.createElementNS(this.svgNs, "g");
        this.target.insertBefore(this.svgGroup, this.svgCircle);
    }

    var svgPolyline = document.createElementNS(this.svgNs, "polyline");
    svgPolyline.setAttribute("stroke", this.options.pathStroke);
    svgPolyline.setAttribute("stroke-width", this.options.pathStrokeWidth);
    svgPolyline.setAttribute("fill", "none");

    var svgPolylinePoints = "";
    for (var i = this.index; i < this.points.length; i ++) {
        svgPolylinePoints += this.points[i].x + "," + this.points[i].y + " ";
    }
    svgPolyline.setAttribute("points", svgPolylinePoints);

    this.svgGroup.appendChild(svgPolyline);
};
