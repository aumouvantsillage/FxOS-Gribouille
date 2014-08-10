
var fs = require("fs");
var path = require("path");

var jsonFileName = process.argv[2];

var data = JSON.parse(fs.readFileSync(jsonFileName, {encoding: "utf-8"}));
var p0 = data.points[0];

/*
 * Compute additional data. 
 */
p0.l = 0;
p0.dl = 0;
p0.dt = 0;

var dlMin = -1;
var dlMax = 0;
var dtMin = -1;
var dtMax = 0;

for(var i = 1; i < data.points.length - 1; i ++) {
    var p = data.points[i - 1];
    var q = data.points[i];
    var dx = q.x - p.x;
    var dy = q.y - p.y;
    q.dl = Math.sqrt(dx * dx + dy * dy);    // Distance from previous point
    q.l = p.l + q.dl;                       // Cumulated distance from first point
    q.dt = q.t - p.t;                       // Time from previous point
    
    if (q.dt < dtMin || dtMin < 0) {
        dtMin = q.dt;
    }
    if (q.dt > dtMax) {
        dtMax = q.dt;
    }
    if (q.dl < dlMin || dlMin < 0) {
        dlMin = q.dl;
    }
    if (q.dl > 0 && q.dl > dlMax) {
        dlMax = q.dl;
    }
}

var tfMin = -1;
var tfMax = 0;
var tfAvg = 0;

for (var i = 2; i < data.animationFrames.length ; i ++) {
    var dt = data.animationFrames[i] - data.animationFrames[i - 1];
    if (dt < tfMin || tfMin < 0) {
        tfMin = dt;
    }
    if (dt > tfMax) {
        tfMax = dt;
    }
    tfAvg += dt;
}

tfAvg /= (data.animationFrames.length - 2);

var segs = data.points.length - 2;
var tMin = data.points[1].t;
var tMax = data.points[data.points.length - 2].t;
var lMax = data.points[data.points.length - 2].l;

console.log("Number of segments: " + segs);
console.log("Time between touch events: min=" + dtMin + " max="+ dtMax + " avg=" + (tMax / segs));
console.log("Distance between touch events: min=" + dlMin + " max=" + dlMax + " avg=" + (lMax / segs));
console.log("Time between animation frames: min=" + tfMin + " max=" + tfMax + " avg=" + tfAvg);

/*
 * Generate an SVG image of the path drawn by the user.
 */

// Compute image boundaries
var xMin = p0.x,
    yMin = p0.y,
    xMax = p0.x,
    yMax = p0.y;
var svgPolyLinePoints = "";
var svgCircles = "";
var margin = 10;

data.points.forEach(function (p) {
    svgPolyLinePoints += p.x + "," + p.y + " ";
    svgCircles += '<circle stroke="red" fill="none" stroke-width="1" cx="' + p.x + '" cy="' + p.y + '" r="6" />';
    if (p.x < xMin) {
        xMin = p.x;
    }
    if (p.x > xMax) {
        xMax = p.x;
    }
    if (p.y < yMin) {
        yMin = p.y;
    }
    if (p.y > yMax) {
        yMax = p.y;
    }
});

xMin -= margin;
yMin -= margin;
xMax += margin;
yMax += margin;
var width = xMax - xMin;
var height = yMax - yMin;

var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'width="'+ width + '" ' +
        'height="' + height + '" ' +
        'viewBox="' + xMin + ' ' + yMin + ' ' + width + ' ' + height + '" ' +
        'preserveAspectRatio="xMidYMid meet">' +
        '<polyline stroke="black" fill="none" stroke-width="3" points="' + svgPolyLinePoints + '" />' +
        svgCircles +
    '</svg>';

var svgFileName = path.join(path.dirname(jsonFileName), path.basename(jsonFileName, ".json") + ".drawing.svg");
fs.writeFileSync(svgFileName, svg);

/*
 * Generate charts.
 */

var svgLPolylinePoints = "";
var svgTPolylinePoints = "";
var svgPointsLines = "";

for(var i = 0; i < data.points.length - 1; i ++) {
    var p = data.points[i];
    var t = 1000 * (p.t - tMin) / (tMax - tMin);
    var l = 1000 - 1000 * p.l  / lMax;
    var j = 1000 - 1000 * i / segs;
    
    if (i % 10 === 0) {
        svgPointsLines += '<line y1="' + j + '" y2="' + j + '" x1 ="-5" x2="10" stroke="black" />';
    }
    svgLPolylinePoints  += t + "," + l + " ";
    svgTPolylinePoints += t + "," + j + " ";
}

var svgAnimationFrameLines = "";
for(var i = 0; i < data.animationFrames.length; i += 5) {
    var t = 1000 * (data.animationFrames[i] - tMin) / (tMax - tMin);
    svgAnimationFrameLines += '<line y1="0" y2="1000" x1 ="' + t + '" x2="' + t + '" stroke="#aaa"  stroke-width="2" />';
}

var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'width="800" height="400" viewBox="-10 -5 1010 1010" preserveAspectRatio="none">' +
        '<line x1="0" y1="1000" x2="1000" y2="1000" stroke="black" stroke-width="2" />'+
        '<line x1="0" y1="0"    x2="0"    y2="1000" stroke="black" stroke-width="2" />'+
        svgPointsLines +
        svgAnimationFrameLines +
        '<polyline stroke="#368" fill="none" stroke-width="3" points="' + svgLPolylinePoints + '" />' +
        '<polyline stroke="#f60" fill="none" stroke-width="3" points="' + svgTPolylinePoints + '" />' +
    '</svg>';

var svgFileName = path.join(path.dirname(jsonFileName), path.basename(jsonFileName, ".json") + ".chart.svg");
fs.writeFileSync(svgFileName, svg);
