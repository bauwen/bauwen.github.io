function Mouse(element) {
    /*
    var preventDefault = true;
    var preventDefaultCases = null;
    
    if (preventDefaultCases && !(preventDefaultCases instanceof Set)) {
        try {
            preventDefaultCases = new Set(preventDefaultCases);
        } catch (err) {
            preventDefaultCases = null;
        }
    }
    */
    
    var names = ["Left", "Middle", "Right", "Fourth", "Fifth"];
    var buttons = {};
    
    names.forEach(function (value, index) {
        buttons[value] = index;
    });
    
    var buttonsDown = [false, false, false, false, false];
    var buttonsPressed = [false, false, false, false, false];
    var buttonsReleased = [false, false, false, false, false];
    
    var x = 0;
    var y = 0;
    
    var count = 0;
    var pressed = false;
    var released = false;
    var lastButton = "left";
    
    /*
    element.addEventListener("mousedown", function (event) {
        var rect = element.getBoundingClientRect();
        var button = event.button;
        var name = names[button];
        
        if (preventDefault && (!preventDefaultCases || preventDefaultCases.has(name))) {
            event.preventDefault();
        }
        
        x = event.pageX - window.scrollX - rect.left;
        y = event.pageY - window.scrollY - rect.top;
        
        if (!buttonsDown[button]) {
            buttonsDown[button] = true;
            count += 1;
            
            buttonsPressed[button] = true;
            pressed = true;
        }
        
        lastButton = name;
    });
    
    element.addEventListener("mouseup", function (event) {
        var button = event.button;
        var name = names[button];
        
        if (preventDefault && (!preventDefaultCases || preventDefaultCases.has(name))) {
            event.preventDefault();
        }
        
        if (buttonsDown[button]) {
            buttonsDown[button] = false;
            count -= 1;
        }
        
        buttonsReleased[button] = true;
        released = true;
    });
    
    element.addEventListener("mousemove", function (event) {
        var rect = element.getBoundingClientRect();
        
        x = event.pageX - window.scrollX - rect.left;
        y = event.pageY - window.scrollY - rect.top;
    });
    */
    
    function log(t) {
        document.getElementById("thing").innerHTML = t;
    }
    
    element.addEventListener("touchstart", function (event) {
        log("starting touch!");
        var rect = element.getBoundingClientRect();
        var touch = event.touches[0];
        var button = 0;
        
        x = touch.pageX - window.scrollX - rect.left;
        y = touch.pageY - window.scrollY - rect.top;
        
        if (!buttonsDown[button]) {
            buttonsDown[button] = true;
            count += 1;
            
            buttonsPressed[button] = true;
            pressed = true;
        }
    });
    
    element.addEventListener("touchend", function (event) {
        log("ending touch!");
        var button = 0;
        
        if (buttonsDown[button]) {
            buttonsDown[button] = false;
            count -= 1;
        }
        
        buttonsReleased[button] = true;
        released = true;
    });
    
    element.addEventListener("touchcancel", function (event) {
        var button = 0;
        
        if (buttonsDown[button]) {
            buttonsDown[button] = false;
            count -= 1;
        }
        
        buttonsReleased[button] = true;
        released = true;
    });
    
    element.addEventListener("touchmove", function (event) {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        
        var rect = element.getBoundingClientRect();
        var touch = event.touches[0];
        
        x = touch.pageX - window.scrollX - rect.left;
        y = touch.pageY - window.scrollY - rect.top;
    });
    
    return {
        isDown(button) {
            if (button) {
                return !!buttonsDown[buttons[button]];
            } else {
                return count;
            }
        },

        isPressed(button) {
            if (button) {
                return !!buttonsPressed[buttons[button]];
            } else {
                return pressed;
            }
        },

        isReleased(button) {
            if (button) {
                return !!buttonsReleased[buttons[button]];
            } else {
                return released;
            }
        },
        
        get x() {
            return x;
        },
        
        get y() {
            return y;
        },
        
        get last() {
            return lastButton;
        },

        update() {
            if (pressed) {
                buttonsPressed[0] = false;
                buttonsPressed[1] = false;
                buttonsPressed[2] = false;
                buttonsPressed[3] = false;
                buttonsPressed[4] = false;
                
                pressed = false;
            }
            
            if (released) {
                buttonsReleased[0] = false;
                buttonsReleased[1] = false;
                buttonsReleased[2] = false;
                buttonsReleased[3] = false;
                buttonsReleased[4] = false;
                
                released = false;
            }
        }
    };
}
