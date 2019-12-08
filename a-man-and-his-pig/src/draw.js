var draw = {
    image: function (image, x, y, rotation) {
        if (rotation) {
            var w = image.naturalWidth;
            var h = image.naturalHeight;

            ctx.save();
            ctx.translate(x + w / 2, y + h / 2);
            ctx.rotate(-rotation / 180 * Math.PI);
            ctx.drawImage(image, -w / 2, -h / 2);
            ctx.restore();
        } else {
            ctx.drawImage(image, x, y);
        }
    },

    reflection: function (obj, alpha, dx, dy) {
        if (obj.sprite.length == 0) {
            return;
        }

        var name = obj.sprite[Math.floor(obj.index)];

        ctx.globalAlpha = alpha;
        draw.image(assets.images[name], obj.x + dx, obj.y + dy, obj.rotation);
        ctx.globalAlpha = 1;
    },

    object: function (obj, shadowX, shadowY) {
        if (obj.sprite.length == 0) {
            return;
        }

        shadowX = shadowX || 0;
        shadowY = shadowY || 0;

        var name = obj.sprite[Math.floor(obj.index)];

        if (shadowX !== 0 || shadowY !== 0) {
            ctx.globalAlpha = shadowAlpha;
            draw.image(assets.shadows[name], obj.x + shadowX, obj.y + shadowY, obj.rotation);
            ctx.globalAlpha = 1;
        }
        draw.image(assets.images[name], obj.x, obj.y, obj.rotation);
    },

    stamp: function (obj, shadowX, shadowY) {
        var temp = ctx;
        ctx = backCtx;
        draw.object(obj, shadowX, shadowY);
        ctx = temp;
    }
};
