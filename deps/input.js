var keys = [];
var BACKSPACE = 8;
var TAB = 9;
var ENTER = 13;
var SHIFT = 16;
var CTRL = 17;
var ALT = 18;
var PAUSE = 19;
var CAPSLOCK = 20;
var ESCAPE = 27;
var SPACE = 32;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;
var DELETE = 46;
var key0 = 48;
var key1 = 49;
var key2 = 50;
var key3 = 51;
var key4 = 52;
var key5 = 53;
var key6 = 54;
var key7 = 55;
var key8 = 56;
var key9 = 57;
var keyA = 65;
var keyB = 66;
var keyC = 67;
var keyD = 68;
var keyE = 69;
var keyF = 70;
var keyG = 71;
var keyH = 72;
var keyI = 73;
var keyJ = 74;
var keyK = 75;
var keyL = 76;
var keyM = 77;
var keyN = 78;
var keyO = 79;
var keyP = 80;
var keyQ = 81;
var keyR = 82;
var keyS = 83;
var keyT = 84;
var keyU = 85;
var keyV = 86;
var keyW = 87;
var keyX = 88;
var keyY = 89;
var keyZ = 90;

function keyPressed() {
	keys[keyCode] = true;
}

function keyReleased() {
	delete keys[keyCode];
}

function randomColor() {
	return color(random(0, 255), random(0, 255), random(0, 255));
}

function mouseOnRect(x, y, w, h) {
    if ((mouseX > x) && (mouseX < x + w) && (mouseY > y) && (mouseY < y + h)) {
        return true;
    }
    return false;
}
