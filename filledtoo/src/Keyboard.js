function Keyboard() {
    var element = window;
    var preventDefault = true;
    var preventDefaultCases = null;
    
    if (preventDefaultCases && !(preventDefaultCases instanceof Set)) {
        try {
            preventDefaultCases = new Set(preventDefaultCases);
        } catch (err) {
            preventDefaultCases = null;
        }
    }
    
    var keysDown = new Map();
    var keysPressed = new Map();
    var keysReleased = new Map();
    
    var count = 0;
    var pressed = false;
    var released = false;
    var lastKey = "Enter";
    
    element.addEventListener("keydown", function (event) {
        var key = event.key;
        
        if (preventDefault && (!preventDefaultCases || preventDefaultCases.has(key))) {
            event.preventDefault();
        }
        
        if (!keysDown.get(key)) {
            keysDown.set(key, true);
            count += 1;
            
            keysPressed.set(key, true);
            pressed = true;
        }
        
        lastKey = key;
    });
    
    element.addEventListener("keyup", function (event) {
        var key = event.key;
        
        if (preventDefault && (!preventDefaultCases || preventDefaultCases.has(key))) {
            event.preventDefault();
        }
        
        if (keysDown.get(key)) {
            keysDown.set(key, false);
            count -= 1;
        }
        
        keysReleased.set(key, true);
        released = true;
    });

    return {
        isDown(key) {
            if (key) {
                return !!keysDown.get(key);
            } else {
                return count;
            }
        },

        isPressed(key) {
            if (key) {
                return !!keysPressed.get(key);
            } else {
                return pressed;
            }
        },

        isReleased(key) {
            if (key) {
                return !!keysReleased.get(key);
            } else {
                return released;
            }
        },
        
        get last() {
            return lastKey;
        },

        update() {
            if (pressed) {
                keysPressed.forEach(function (_, key) {
                    keysPressed.set(key, false);
                });
                
                pressed = false;
            }
            
            if (released) {
                keysReleased.forEach(function (_, key) {
                    keysReleased.set(key, false);
                });
                
                released = false;
            }
        }
    };
}
