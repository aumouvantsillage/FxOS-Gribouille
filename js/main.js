window.addEventListener("load", function () {

    var painter = Painter;
    
    var options = {
        pathStroke: "purple",
        pathStrokeWidth: 5,
        circleFill: "red",
        circleRadius: 25,
        log: true
    };
    
    var svg = document.querySelector("svg");
    var canvas = document.querySelector("canvas");
    
    if (painter === SVGPainter || SVGPainter.isPrototypeOf(painter)) {
        canvas.style.display = "none";
        painter.init(svg, options);
    }
    else {
        svg.style.display = "none";
        painter.init(canvas, options);
    }
    
    function resize() {
        painter.target.setAttribute("width", window.innerWidth);
        painter.target.setAttribute("height", window.innerHeight);
    }
    
    resize();
    window.addEventListener("resize", resize, false);
    
    painter.run();

}, false);
