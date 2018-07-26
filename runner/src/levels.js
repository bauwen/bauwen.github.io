var levels = {};
var currentLevel = null;

function loadLevelEditorWorlds(name, data) {
    levels = data;
}

function loadLevel(name) {
    var data = levels[name];
    var layer = data.layers[0];
    
    for (var i = 0; i < layer.length; i++) {
        var obj = layer[i];
        switch (obj.name) {
            case "obj_wall":
                createInstance("obj_wall", obj.x, 16*8 + obj.y);
                break;
            case "obj_spike":
                createInstance("obj_spike", obj.x, 16*8 + obj.y);
                break;
                
            case "obj_spike_hard":
                var spike = createInstance("obj_spike", obj.x, 16*8 + obj.y);
                spike.hard = true;
                break;
        }
    }
    
    currentLevel = data;
}
