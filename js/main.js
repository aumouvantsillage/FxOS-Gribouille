var Gribouille = {};

function selectPainter(name) {
    var painter = Gribouille[name];

    if (painter !== Gribouille.Painter && !Gribouille.Painter.isPrototypeOf(painter)) {
        painter = Gribouille.Painter;
    }
    
    var options = {
        pathStroke: "purple",
        pathStrokeWidth: 5,
        circleFill: "red",
        circleRadius: 25,
        log: true
    };
    
    var svg = document.querySelector("svg");
    var canvas = document.querySelector("canvas");
    
    if (painter === Gribouille.SVGPainter || Gribouille.SVGPainter.isPrototypeOf(painter)) {
        svg.style.display = "inline";
        painter.init(svg, options);
    }
    else {
        canvas.style.display = "inline";
        painter.init(canvas, options);
    }
    
    function resize() {
        painter.target.setAttribute("width", window.innerWidth);
        painter.target.setAttribute("height", window.innerHeight);
    }
    
    resize();
    window.addEventListener("resize", resize, false);
    
    painter.run();
}

window.addEventListener("load", function () {
    var select = document.querySelector("select");
    select.addEventListener("change", function (evt) {
        select.style.display = "none";
        selectPainter(select.value);
    }, false);    
}, false);
