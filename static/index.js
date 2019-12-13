let RAD = 180 / Math.PI;

const MAX = 10;

let paused = false;

let base64Data;

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

// example: getRegionalTilesByLevel('indonesia', 6, 94, -11, 157.5, 4)
// example: getRegionalTilesByLevel('east-kalimantan', 2.665231, 113.788818, -2.413267, 119.027324, 5)
// example: getRegionalTilesByLevel('lampung', -3.679327, 103.531741, -6.039077, 106.223360, 13)
// example: getRegionalTilesByLevel('banten-jakarta', -5.839810, 105.040608, -7.042476, 106.977860, 13)
// example: getRegionalTilesByLevel('taiwan', 25.302141, 120.033393, 21.896279, 122.008280, 15)
async function getRegionalTilesByLevel(regionName, ulLat, ulLon, lrLat, lrLon, level, toLevel) {

    let startTile = lonlat2Tile(ulLat, ulLon, level);
    let endTile = lonlat2Tile(lrLat, lrLon, level);

    let xStart = Math.floor(startTile.x);
    let xStop = Math.ceil(endTile.x);

    let yStart = Math.floor(startTile.y);
    let yStop = Math.ceil(endTile.y);

    // yStart = ; yStop = ;
    // yStart = ; yStop = ;
    // yStart = ; yStop = ;
    // yStart = ; yStop = ;

    $("#x-bound").text("x from " + xStart + " to " + (xStop-1));
    $("#y-bound").text("y from " + yStart + " to " + (yStop-1));
    for (let y = yStart; y < yStop; y++) {

        for (let x = xStart; x < xStop; x++) {

            if (!paused) {

                result = await getTile(x, y, level, regionName);
            
            } else {

                return;
            }
        }
    }

    console.log("completed!");

    if (toLevel && toLevel > level) {

        getRegionalTilesByLevel(regionName, ulLat, ulLon, lrLat, lrLon, level+1, toLevel);
    }
}

function getTile(x, y, z, regionName, drawImage = false) {

    return new Promise((resolve) => {

        // console.log('x: ' + x + ', y: ' + y + ', z: ' + z);
        $("#text").text('x: ' + x + ', y: ' + y + ', z: ' + z);
    
        $.ajax({
            url: 'https://mt1.google.com/vt/lyrs=y&x='+x+'&y='+y+'&z='+z,
            type: 'GET',
            mimeType: "text/plain; charset=x-user-defined"
        })
            .done((data) => {
    
                base64Data = base64encode(data);
    
                if (drawImage) {

                    $("#result").attr('src', 'data:image/jpeg;base64,' + base64Data);
                }
    
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

// latitude and longitude are in degrees
function lonlat2Tile(latitude, longitude, level) {

    // see: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames

    let latitudeRadian = latitude / (180/Math.PI);

    let n = Math.pow(2, level);

    let xTile = n * ((longitude + 180) / 360);

    let yTile = n * ( 1 - ( Math.log( Math.tan(latitudeRadian) + sec(latitudeRadian) ) / Math.PI ) ) / 2;

    // console.log("X: " + xTile + ", Y: " + yTile);

    return {
        x: xTile,
        y: yTile
    };
}

function sec(radian) {

    return (1/Math.cos(radian));
}