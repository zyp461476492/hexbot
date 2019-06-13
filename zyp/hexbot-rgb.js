let colorRegExp = new RegExp('#([a-fA-F_0-9][a-fA-F_0-9]){3}');
let numberRegExp = new RegExp('[0-9]');
let R = 0;
let G = 0;
let B = 0;
let ctx;
let canvas = null;
let colorArray = ['#000000'];
let startX = 0;
let itemWidth = 0;
let startY = 0;
let speed = 2000;
let ticket;
let rgb = ['R', 'G', 'B'];


function start_app() {
    sizeCanvas();

    NOOPBOT_FETCH({
        API: 'hexbot',
        count: '800'
    }, settingColorArray);


}

/**
 * init canvas
 */
function sizeCanvas() {
    itemWidth = (window.innerWidth - 600) / 3;
    startX = 300;
    startY = window.innerHeight / 2 - 45;
    canvas = document.getElementById('canvas');
    ctx = NOOPBOT_SETUP_CANVAS({
        canvas: canvas,
        bgColor: '#f1f1f1'
    });
}

function settingColorArray(responseJson) {
    let {
        colors
    } = responseJson;
    colorArray = [];
    colors.forEach(function (color, index) {
        colorArray.push(color.value);
    });
    // start draw rgb 
    ticket = NOOPBOT_TICK_SETUP(draw, speed);
}

function draw() {
    // 清空画布
    sizeCanvas();
    startX = 300;
    let rgbArray = hexToRgb(NOOPBOT_DECIDE(colorArray));
    drawRgb(rgbArray);
}


function drawRgb(rgbArray) {
    rgbArray.forEach(function (item, index) {
        drawNumber(item, index);
    });
}

/**
 * hex convert to rgb value
 * example: #CC00FF return 204,0,255
 * @param {String} hexCode 
 */
function hexToRgb(hexCode) {
    if (!colorRegExp.test(hexCode)) {
        console.log('illegal hex code');
        return [];
    }
    hexString = hexCode.substr(1, 6);
    R = hexToDecimal(hexString.substr(0, 2));
    G = hexToDecimal(hexString.substr(2, 2));
    B = hexToDecimal(hexString.substr(4, 2));
    return [R, G, B];
}

function drawNumber(number, index) {
    let digitArray = getDigitArray(number);
    drawText(rgb[index], startX + 48, startY - 40);
    digitArray.forEach(function (item, index) {
        drawDigit(item, startX, startY);
        startX += 48;
    });
    startX += itemWidth - 48;
}

/**
 * draw [0-9]
 * @param {Number} index the index of digitList
 * @param {Number} startX  
 * @param {Number} startY  
 */
function drawDigit(index, startX, startY) {
    let array = digitList[index];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 7; j++) {
            x = startX + j * 5;
            y = startY + i * 5;
            if (array[i][j] === 1) {
                let grd = ctx.createRadialGradient(x, y, 2, x, y, 4);
                grd.addColorStop(0, '#ffffff');
                grd.addColorStop(1, NOOPBOT_DECIDE(colorArray));
                ctx.fillStyle = grd;
                ctx.fillStyle = NOOPBOT_DECIDE(colorArray);
                ctx.beginPath();
                // ctx.arc(x, y, 4, 0, Math.PI * 2, true);
                ctx.fillRect(x, y, 4, 4);
                ctx.closePath();
                ctx.fill();
            }

        }
    }
}

/**
 * if input 5, return [0,0,5]
 * if input 25, return [0,2,5]
 * if input 123, return [1,2,3]
 * else error 
 * @param {Number} value 
 */
function getDigitArray(value) {
    let unitDigit = Math.floor(value / 1) % 10;
    let decadeDigit = Math.floor(value / 10) % 10;
    let hundredDigit = Math.floor(value / 100) % 10;
    return [hundredDigit, decadeDigit, unitDigit];
}



/**
 * hex to decimal
 * @param {String} hex 
 */
function hexToDecimal(hex) {
    let n = 0;
    let decimal = 0;

    for (let i = hex.length - 1; i >= 0; i--) {
        let ch = charToNumber(hex.charAt(i));
        decimal += ch * Math.pow(16, n);
        n++;
    }

    return decimal;
}

/**
 * convert hex character to number
 * @param {String} ch 
 */
function charToNumber(ch) {
    if (numberRegExp.test(ch)) {
        return parseInt(ch);
    } else {
        switch (ch) {
            case 'a':
            case 'A':
                return 10;
            case 'b':
            case 'B':
                return 11;
            case 'c':
            case 'C':
                return 12;
            case 'd':
            case 'D':
                return 13;
            case 'e':
            case 'E':
                return 14;
            case 'f':
            case 'F':
                return 15;
        }
    }
}

/**
 * draw text by canvas
 * @param {Nubmer} text 
 */
function drawText(text, x, y) {
    ctx.font = '80px arial';
    ctx.fillText(text, x, y); //图片填充的文字
    ctx.strokeText(text, x, y); //描边文字
}