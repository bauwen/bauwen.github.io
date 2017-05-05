obj_controller = function () {
    this.depth = 100;
    this.count = 0;

    this.main = function () {
        currentCount = levelCount - Player.trail.length;

        if (key.pressed(key.R)) {
            sound.play(snd_restart);
            currentLevel -= 1;
            world.restart();
            return;
        }

        if (key.pressed(key.M)) {
            sound.play(snd_click);
            world.goto(menu);
            return;
        }

        draw.color = color.BROWN;
        draw.rectangle(leftArea + 4, topArea + 4, rightArea - 4, bottomArea - 4);

        draw.color = color.BLACK;
        draw.alpha = 0.2;
        draw.rectangle(leftArea, topArea , rightArea, bottomArea, 4);

        draw.alpha = 0.06;

        for (var i = Math.floor((leftArea - 32) / 32), len = Math.floor((rightArea - 32) / 32); i < len; i++)
            draw.line(64 + i * 32 - 8, topArea + 4, 64 + i * 32 - 8, bottomArea - 4);

        for (var i = Math.floor((topArea - 96) / 32), len = Math.floor((bottomArea - 96) / 32); i < len; i++)
            draw.line(leftArea + 4, 128 + i * 32 - 8, rightArea - 4, 128 + i * 32 - 8);

        draw.gradient = grad_title;
        draw.alpha = 0.1;
        draw.rectangle(0, 20, world.width, 100);
        draw.alpha = 1;

        draw.line(0, 20, world.width, 20, 1);
        draw.line(0, 100, world.width, 100, 1);

        draw.color = color.BLACK;
        draw.alpha = 0.2;
        text.size = 64;
        text.halign = halign.CENTER;
        draw.text(world.width / 2 + 3, 30 + 3, "Level " + currentLevel);
        draw.alpha = 1;
        draw.color = color.make(200, 200, 200);
        draw.text(world.width / 2, 30, "Level " + currentLevel);
        draw.color = color.BLACK;
        draw.text(world.width / 2, 30, "Level " + currentLevel, 1);

        var quote;

        if (levelCompleted)
            quote = "Level completed!";
        else
            if (currentCount == 1)
                quote = "Still 1 tile to fill";
            else
                quote = "Still " + currentCount + " tiles to fill";

        text.valign = valign.MIDDLE;
        text.size = 28;
        draw.alpha = 0.1;
        draw.text(world.width / 2 + 3, world.height - 30 + 3, quote);
        draw.alpha = 1;
        draw.color = color.make(200, 200, 200);
        draw.text(world.width / 2, world.height - 30, quote);
        draw.color = color.BLACK;
        draw.alpha = 1;
        draw.text(world.width / 2, world.height - 30, quote, 1);
        text.halign = halign.LEFT;
        text.valign = valign.TOP;
        draw.alpha = 1;

        var r = 0.60;
        var m = 0.70;

        if (world.height - 35 - 24 < mouse.y && mouse.y < world.height - 35 + 24) {
            r += (45 - 24 < mouse.x && mouse.x < 45 + 24 ? 1 : 0) * 0.20;
            m += (world.width - 60 - 24 < mouse.x && mouse.x < world.width - 60 + 24 ? 1 : 0) * 0.20;

            if (mouse.pressed(mouse.LEFT)) {
                if (r > 0.60) {
                    sound.play(snd_restart);
                    currentLevel -= 1;
                    world.restart();
                    return;
                }

                if (m > 0.70) {
                    sound.play(snd_click);
                    world.goto(menu);
                    return;
                }
            }
        }

        draw.alpha = 0.2;
        draw.sprite(spr_icon, 1, world.width - 60 + 3, world.height - 35 + 3, m, m);
        draw.sprite(spr_icon, 3, 45 + 3, world.height - 35 + 3, r, r);
        draw.alpha = 1;

        draw.sprite(spr_icon, 1, world.width - 60 + 1, world.height - 35, m, m);
        draw.sprite(spr_icon, 1, world.width - 60 - 1, world.height - 35, m, m);
        draw.sprite(spr_icon, 1, world.width - 60, world.height - 35 + 1, m, m);
        draw.sprite(spr_icon, 1, world.width - 60, world.height - 35 - 1, m, m);
        draw.sprite(spr_icon, 0, world.width - 60, world.height - 35, m, m);

        draw.sprite(spr_icon, 3, 45 + 1, world.height - 35, r, r);
        draw.sprite(spr_icon, 3, 45 - 1, world.height - 35, r, r);
        draw.sprite(spr_icon, 3, 45, world.height - 35 + 1, r, r);
        draw.sprite(spr_icon, 3, 45, world.height - 35 - 1, r, r);
        draw.sprite(spr_icon, 2, 45, world.height - 35, r, r);

        // ONLY FOR TESTING
        text.size = 12;
        //draw.text(8, 2, world.fps);
        if (key.pressed(key.A)) {
            currentLevel -= 2;
            world.goto(worlds);
        }
        if (key.pressed(key.Z)) {
            world.goto(worlds);
        }
    }
}
