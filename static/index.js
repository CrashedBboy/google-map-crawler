let RAD = 180 / Math.PI;

$(document).ready(() => {

    
});

function getTile(x, y, z) {

    console.log('x: ' + x + ', y: ' + y + ', z: ' + z);

    if (y > (Math.pow(2, z)-1)) {

        console.log('Completed');
        return;
    }

    if (x > (Math.pow(2, z)-1)) {

        setTimeout(() => { getTile(0, y+1, z) }, 100);
        return;
    }

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

                setTimeout(() => { getTile(x+1, y, z) }, 100);
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