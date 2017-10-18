var update;

(function () {
    
    var t = 0;
    var cx = 0;
    var cy = 0;
    var cz = 200;
    var pivot = { x: 0, y: 0, z: 0 };
    var angle = 0;
    var points = [];
    var pal = [
        [255, 255, 255],
        [200, 200, 200],
        [200, 160, 160],
        [180, 120, 80],
        [140, 50, 10],
        [80, 10, 0],
        [0, 0, 0]
    ];/*
    [
        [255, 255, 255],
        [255, 0, 0],
        [255, 0, 255],
        [0, 255, 255],
        [0, 0, 255],
        [255, 255, 0],
        [0, 255, 0]
    ];*/
    
    function createCube(t) {
        points = [];
        var l = 5 + Math.abs((Math.sin(t / 100)) * 10);
        var p;
        
        for (var x = -3; x <= 3; x++) {
            for (var y = -3; y <= 3; y++) {
                for (var z = -3; z <= 3; z++) {
                    p = {
                        x: x * l,
                        y: y * l,
                        z: z * l,
                        c: pal[3 + z]
                    };
                    
                    points.push(p);
                }
            }
        }
    }
    
    function createCurve(t) {
        points = [];
        var i = 0;
        var l;
        l1 = Math.abs(5 * (Math.cos(t / 50)));
        
        for (var u = -70; u <= 70; u += 15) {
            var r1 = Math.cos(u / 180 * Math.PI) * 30;
            
            for (var v = 1; v <= 360; v += 15) {
                var x = Math.sin(v / 180 * Math.PI);
                var y = Math.cos(v / 180 * Math.PI);
                p = {
                    x: x * r1,
                    y: y * r1,
                    z: u / (l1 + 0.7) + v / 5,
                    c: pal[i % 7]
                };
                
                points.push(p);
            }
            
            i += 1;
        }
    }
    
    function p2d(p3d, xx, yy) {
        var fov = 180;
        var x0 = p3d.x + cx;
        var y0 = p3d.y + cy;
        var z0 = p3d.z + cz;
        var x2d = fov * x0 / z0;
        var y2d = fov * y0 / z0;
        
        x2d += xx;  // centers
        y2d += yy;
        
        return { x: x2d, y: y2d };
    }
    
    function rotate(p3d, center, ax, ay, az) {
        var a,  b,  c,
            a1, b1, c1,
            a2, b2, c2,
            a3, b3, c3;
            
        var np3d = { x: 0, y: 0, z: 0, c: [0, 0, 0] };
        
        a = p3d.x - center.x;
        b = p3d.y - center.y;
        c = p3d.z - center.z;
        
        a1 = a * Math.cos(az) - b * Math.sin(az);
        b1 = a * Math.sin(az) + b * Math.cos(az);
        c1 = c;
        c2 = c1 * Math.cos(ay) - a1 * Math.sin(ay);
        a2 = c1 * Math.sin(ay) + a1 * Math.cos(ay);
        b2 = b1;
        b3 = b2 * Math.cos(ax) - c2 * Math.sin(ax);
        c3 = b2 * Math.sin(ax) + c2 * Math.cos(ax);
        a3 = a2;
        
        np3d.x = a3;
        np3d.y = b3;
        np3d.z = c3;
        np3d.c = p3d.c;
        
        return np3d;
    }
    
    function zsort(p1, p2) {
        return p1.z < p2.z;
    }
    
    update = function () {
        // [keyboard controls]
        
        if (t % 900 < 450) {
            createCube(t);
        } else {
            createCurve(t);
        }
        
        var copy = points.slice();
        for (var i = 0; i < points.length; i++) {
            var p = points[i]; 
            copy[i] = rotate(p, pivot, angle, angle / 2, angle / 4);
        }
        
        points = copy;
        points.sort(zsort);
        
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var m = p2d(p, 192 / 2, 160 / 2);
            setcolor(p.c[0], p.c[1], p.c[2]);
            rectfill(Math.floor(m.x), Math.floor(m.y), 4, 4);
        }
        
        angle += 0.05;
        t += 1;
    };
    
})();

