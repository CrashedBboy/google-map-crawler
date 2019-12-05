let RAD = 180 / Math.PI;

const MAX = 10;

let paused = false;

$(document).ready(() => {

});

async function getTilesByLevel(level, yStart = 0, yStop) {

    let max = Math.pow(2, level) - 1;
    let result;

    let stop = max;
    if (yStop && yStop >= yStart && yStop <= max) {

        stop = yStop;
    }

    for (let y = yStart; y <= stop; y++) {

        for (let x = 0; x <= max; x++) {

            if (!paused) {

                result = await getTile(x, y, level);
            
            } else {

                return;
            }
        }
    }
}


// example: getRegionalTilesByLevel('indonesia', 11.25, 90, -11.25, 157.5, 4)
async function getRegionalTilesByLevel(regionName, ulLat, ulLon, lrLat, lrLon, level) {

    // wrong!

    // let maxLatitude = 90;

    // let levelTilesNumber = Math.pow(2, level);
    // let latInterval = (maxLatitude*2) / levelTilesNumber;
    // let lonInterval = 360 / levelTilesNumber;

    // let xStart = Math.ceil((ulLon + 180) / lonInterval);
    // let xStop = Math.floor((lrLon + 180) / lonInterval);

    // let yStart = Math.ceil((maxLatitude - ulLat) / latInterval);
    // let yStop = Math.floor((maxLatitude - lrLat) / latInterval);

    // for (let y = yStart; y < yStop; y++) {

    //     for (let x = xStart; x < xStop; x++) {

    //         if (!paused) {

    //             result = await getTile(x, y, level, regionName);
            
    //         } else {

    //             return;
    //         }
    //     }
    // }
}

function getTile(x, y, z, regionName) {

    return new Promise((resolve) => {

        console.log('x: ' + x + ', y: ' + y + ', z: ' + z);
        $("#text").text('x: ' + x + ', y: ' + y + ', z: ' + z);
    
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
                        image: base64Data,
                        region: regionName
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

function lonlat2Tile(latitude, longitude, level) {

    // see: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames

    let latitudeRadian = latitude / (180/Math.PI);

    let n = Math.pow(2, level);

    let xTile = n * ((longitude + 180) / 360);

    let yTile = n * ( 1 - ( Math.log( Math.tan(latitudeRadian) + sec(latitudeRadian) ) / Math.PI ) ) / 2;

    console.log("X: " + xTile + ", Y: " + yTile);
}

function sec(radian) {

    return (1/Math.cos(radian));
}