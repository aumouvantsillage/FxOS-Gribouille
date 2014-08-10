window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
    

Gribouille.Painter = {
    
    init: function (target, options) {
        this.target = target;
        this.options = options;
        this.points = [];
        this.drawing = false;
        this.animationFrames = [];
        this.index = 0;
        
        this.installMouseHandlers();
        this.installTouchHandlers();
    },
    
    installMouseHandlers: function () {
        var self = this;
        
        this.target.addEventListener("mousedown", function (evt) {
            if (!self.drawing && evt.button === 0) {
                self.startPath(evt.clientX, evt.clientY);
                evt.preventDefault();
            }
        }, false);

        this.target.addEventListener("mousemove", function (evt) {
            if (self.drawing) {
                self.addPointToPath(evt.clientX, evt.clientY);
                evt.preventDefault();
            }
        }, false);

        this.target.addEventListener("mouseup", function (evt) {
            if (self.drawing && evt.button === 0) {
                self.endPath(evt.clientX, evt.clientY);
                evt.preventDefault();
            }
        } , false);
    },

    installTouchHandlers: function () {
        var self = this;
        var touchId;

        this.target.addEventListener("touchstart", function (evt) {
            if (!self.drawing) {
                var touch = evt.changedTouches[0];
                touchId = touch.identifier;
                self.startPath(touch.clientX, touch.clientY);
                evt.preventDefault();
            }
        });

        this.target.addEventListener("touchmove", function (evt) {
            if (self.drawing) {
                var touches = evt.changedTouches;
                for (var i = 0; i < touches.length; i ++) {
                    if (touches[i].identifier === touchId) {
                        self.addPointToPath(touches[i].clientX, touches[i].clientY);
                    }
                }
                evt.preventDefault();
            }
        });

        this.target.addEventListener("touchend", function (evt) {
            if (self.drawing) {
                var touches = evt.changedTouches;
                for (var i = 0; i < touches.length; i ++) {
                    if (touches[i].identifier === touchId) {
                        self.endPath(touches[i].clientX, touches[i].clientY);
                    }
                }
                evt.preventDefault();
            }
        });
    },
    
    addPoint: function (p) {
        this.points.push({
            x: p.x,
            y: p.y,
            t: performance.now()
        });
    },
    
    startPath: function (clientX, clientY) {
        var p = this.getLocalXY(clientX, clientY);        
        this.points = [];
        this.animationFrames = [];
        this.addPoint(p);
        this.drawing = true;
        this.index = 0;
    },
    
    addPointToPath: function (clientX, clientY) {
        var p = this.getLocalXY(clientX, clientY);        
        this.addPoint(p);
    },
    
    endPath: function (clientX, clientY) {
        var p = this.getLocalXY(clientX, clientY);        
        this.addPoint(p);
        this.drawing = false;
    },
    
    run: function () {
        if (this.index < this.points.length - 1) {
            this.repaint();
            this.index = this.points.length - 1;
            if (!this.drawing && this.options.log) {
                console.log(JSON.stringify({
                    points: this.points,
                    animationFrames: this.animationFrames
                }));
            }
        }
        
        var self = this;
        window.requestAnimationFrame(function (time) {
            self.run();
            self.animationFrames.push(time);
        });
    },
    
    /*
     * Override this method in backend.
     */
    getLocalXY: function (clientX, clientY) {
        return {
            x: clientX,
            y: clientY
        };
    },

    /*
     * Override this method in backend.
     */
    repaint: function () {
        // Nothing
    }
};
