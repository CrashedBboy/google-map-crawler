let RAD = 180 / Math.PI;

const MAX = 20;

$(document).ready(() => {

});

async function getTilesByLevel(level) {

    let max = Math.pow(2, level) - 1;
    let result;

    for (let y = 0; y <= max; y++) {

        for (let x = 0; x <= max; x++) {

            result = await getTile(x, y, level);
        }
    }

    if (level < MAX) {

        getTilesByLevel(level+1);
    }
}

function getTile(x, y, z) {

    return new Promise((resolve) => {

        console.log('x: ' + x + ', y: ' + y + ', z: ' + z);
    
        $.ajax({
            url: 'https://mt1.google.com/vt/lyrs=y&x='+x+'&y='+y+'&z='+z,
            type: 'GET',
            mimeType: "text/plain; charset=x-user-defined"
        })
            .done((data) => {
    
                let base64Data = base64encode(data);
    
                $("#result").attr('src', 'data:image/jpeg;base64,' + base64Data);
    
                $.ajax({
                    url: 'save.php',
                    type: 'POST',
                    dataType: "json",
                    data: {
                        x: x,
                        y: y,
                        z: z,
                        image: base64Data
                    }
                })
                .done((d) => {
    
                    resolve();
                });
            });
    });

    
}

function base64encode(str) {
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "", i = 0, len = str.length, c1, c2, c3;
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
}