obj_menu = function () {
    this.main = function () {
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
        draw.text(world.width / 2 + 3, 30 + 3, "Level Menu");
        draw.alpha = 1;
        draw.color = color.make(200, 200, 200);
        draw.text(world.width / 2, 30, "Level Menu");
        draw.color = color.BLACK;
        draw.text(world.width / 2, 30, "Level Menu", 1);

        text.valign = valign.MIDDLE;

        for (var i = 0; i < 5; i++) {
            draw.alpha = 0.1;
            draw.line(150 + i * 80, 130, 150 + i * 80, 420);
            if (i < 4) draw.line(70, 180 + i * 60, 550, 180 + i * 60);
            draw.alpha = 1;
        }

        for (var i = 0; i < 30; i++) {
            var x = i % 6;
            var y = Math.floor(i / 6);
            var t = levelUnlocked[i] ? i + 1 : ".";

            text.size = 32;
            draw.color = color.WHITE;

            if (levelUnlocked[i]
                && 70 + x * 80 < mouse.x && mouse.x < 150 + x * 80
                && 120 + y * 60 < mouse.y && mouse.y < 180 + y * 60) {
                text.size = 56;

                if (mouse.pressed(mouse.LEFT)) {
                    sound.play(snd_next);
                    currentLevel = i;
                    world.goto(worlds);
                    return;
                }
            }

            draw.text(110 + x * 80, 150 + y * 60, t);

            draw.color = color.BLACK;
            draw.text(110 + x * 80, 150 + y * 60, t, 1);
        }

        text.valign = valign.TOP;

        var a = 0.80;

        if (world.height - 35 - 24 < mouse.y && mouse.y < world.height - 35 + 24) {
            a += (world.width - 60 - 24 < mouse.x && mouse.x < world.width - 60 + 24 ? 1 : 0) * 0.20;

            if (mouse.pressed(mouse.LEFT)) {
                if (a > 0.80) {
                    sound.play(snd_click);
                    currentLevel -= 1;
                    world.goto(worlds);
                    return;
                }
            }
        }

        if (key.pressed(key.ESCAPE)) {
            sound.play(snd_click);
            currentLevel -= 1;
            world.goto(worlds);
            return;
        }

        draw.alpha = 0.2;
        draw.sprite(spr_icon, 5, world.width - 60 + 3, world.height - 35 + 3, a, a);
        draw.alpha = 1;

        draw.sprite(spr_icon, 5, world.width - 60 + 1, world.height - 35, a, a);
        draw.sprite(spr_icon, 5, world.width - 60 - 1, world.height - 35, a, a);
        draw.sprite(spr_icon, 5, world.width - 60, world.height - 35 + 1, a, a);
        draw.sprite(spr_icon, 5, world.width - 60, world.height - 35 - 1, a, a);
        draw.sprite(spr_icon, 4, world.width - 60, world.height - 35, a, a);
    }
}
