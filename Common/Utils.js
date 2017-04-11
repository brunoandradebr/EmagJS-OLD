/**
* RequestAnimationFrame unification
*/
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;







/**
* Constants
*/
const TO_RAD = Math.PI / 180;
const TO_DEGREE = 180 / Math.PI;
const PROJECT_URL = window.location.href;







/**
* Global var
*/
var DEVICE_WIDTH = window.innerWidth;
var DEVICE_HEIGHT = window.innerHeight;
var DEVICE_CENTER_X = DEVICE_WIDTH * 0.5;
var DEVICE_CENTER_Y = DEVICE_HEIGHT * 0.5;
var DEVICE_ASPECT_RATIO = DEVICE_WIDTH / DEVICE_HEIGHT;
var DEVICE_ORIENTATION = (DEVICE_WIDTH > DEVICE_HEIGHT) ? 'landscape' : 'portrait';
var MOBILE = navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Windows Phone/i);






/**
* Global event
*/
window.addEventListener('resize', function(){
    DEVICE_WIDTH = window.innerWidth;
    DEVICE_HEIGHT = window.innerHeight;
    DEVICE_CENTER_X = DEVICE_WIDTH * 0.5;
    DEVICE_CENTER_Y = DEVICE_HEIGHT * 0.5;
    DEVICE_ASPECT_RATIO = DEVICE_WIDTH / DEVICE_HEIGHT;
    DEVICE_ORIENTATION = (DEVICE_WIDTH > DEVICE_HEIGHT) ? 'landscape' : 'portrait'
    window.scrollTo(0, 0);
});
// prevent ios scroll and zoom
window.addEventListener('touchmove', function(e){
    e.preventDefault();
}, {passive : false});






/**
* Global methods
*/
function trace(_var, color, background, font){

    var color = color || '#333';
    var background = background || '#fff';
    var font = font || 13;
    var css = 'background : '+ background +'; color : '+ color +'; padding: 3px 10px; font-size : '+ font +'px';

    if(arguments.length == 1){
        console.log(_var);
    }else{
        console.log('%c' + _var, css);
    }

}

/**
* map
*
* @param Number value - value from original range - between a and b
* @param Number a - min original range
* @param Number b - max original range
* @param Number c - min new range
* @param Number d - max new range
*
* @return Number
*/
function map(value, a, b, c, d){

    return c + (d - c) * (value - a) / (b - a);

}

/**
* clamp
*
* @param Number value
* @param Number min
* @param Number max
*
* @return Number
*/
function clamp(value, min, max){
    if(value < min) value = min;
    if(value > max) value = max;
    return value;
}

/**
* random
*
* Generates a random number in the range.
* Signed is optional - between -range and range.
*
* @param  Number range
* @param  Boolean signed - default false
*
* @return Number
*/
function random(range, signed){

    var signed = signed || false;

    if(signed){
        return (Math.random() * 2 - 1) * range;
    }else{
        return Math.random() * range;
    }

}
/**
* intRandom
*
* Generates a intRandom number in the range.
* Signed is optional - between -range and range.
*
* @param  Number range
* @param  Boolean signed - default false
*
* @return Number
*/
function intRandom(range, signed){

    var signed = signed || false;

    if(signed){
        return (Math.random() * 2 - 1) * range|0;
    }else{
        return Math.random() * range|0;
    }

}

function authorSignature(){
    trace('EmagJS                      ', 'white', '#f06', 20);
    trace('by Bruno Andrade', '#000', 'white', 16);
    trace('>> bruno.faria.andrade@gmail.com', '#000', 'white', 16);
    trace('────────────────────────────────────', '#000', 'white', 16);
}
