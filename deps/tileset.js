class MapTile {
    constructor(name, x, y) {
        this.name = name;
        this.neighbours = [];
        this.parent = null;
        this.x = x;
        this.y = y;
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }

    resetPathCost() {
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
}

class Tileset {
    constructor (img, tileW, tileH, names) {
        this.img = loadImage(img);
        this.tileW = tileW;
        this.tileH = tileH;
        this.names = names;
        this.tiles = [];
        this.selected = names[0];
        this.hide = true;
        this.map = [];
        this.blockedList = [];

        // create tile "blocks" for tileCount tiles
        for (let i = 0; i < names.length; i++) {
            this.tiles.push({name : names[i] + "", xOff: 0, yOff: i * tileH});
        }
    }

    /* Draw a tile on the canvas */
    drawTile(tName, x, y, w = this.tileW, h = this.tileH) {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].name == tName) {
                image(this.img, x, y, w, h, this.tiles[i].xOff, this.tiles[i].yOff, this.tileW, this.tileH);
            }
        }
    }

    setMap(pmap) {
        this.map = [];
        for (let i = 0; i < pmap.length; i++) {
            let row = [];
            for (let j = 0; j < pmap[0].length; j++) {
                row.push(new MapTile(pmap[i][j], j * this.tileW, i * this.tileH));
            }
            this.map.push(row);
        }
        this.initNeighbours();
    }


    /* Create a tilemap */
    creatorMode() {
        // create an empty tilemap, fill it with the first tileset image
        for (let y = 0; y < round(height / this.tileH); y++) {
            let row = [];
            for (let x = 0; x < round(width / this.tileW); x++) {
                row.push(new MapTile(this.selected, x * this.tileW, y * this.tileH));
            }
            this.map.push(row);
        }
        this.initNeighbours();
        this.hide = false;
    }

    /* Select a tile to paint with in the creator mode by clicking a tile from the tool bar */
    handleClick() {
        if (this.hide)
            return;
        // clicking hide on the toolbar should hide the toolbar
        let r = 0;
        if (dist(mouseX, mouseY, width - this.tileW + (this.tileW / 2), height - (this.tileH / 2)) < this.tileW / 2) {
            this.hide = true;
            this.exportMapToText();
            return;
        }
        // check which tile was clicked
        for (let i = 0; i < this.tiles.length; i++) {
            let x = i * this.tileW + i;
            let y = height - this.tileH;
            let w = this.tileW;
            let h = this.tileH;
            if ((mouseX + r > x) && (mouseX - r < x + w) && (mouseY + r > y) && (mouseY - r < y + h)) {
                // tile to paint with is the clicked tile
                this.selected = this.tiles[i].name;
                return;
            }
        }
        // toolbar element was not clicked, try to draw
        this.handleDrag();
    }

    /* Dragging the mouse with a tile will add the tile to the tilemap */
    handleDrag() {
        if (!this.hide && mouseY > height - this.tileH)
            return;
        // draw the tile on the grid.
        let x = round(mouseX / this.tileW);
        let y = round(mouseY / this.tileH);
        this.map[y][x].name = this.selected;
    }

    /* Render map, and the toolbar if it's hidden */
    displayMap() {
        // show the toolbar by pressing H.
        if (keys[keyH]) {
            if (this.map.length == 0)
                this.creatorMode();
            this.hide = false;
        }
        // draw tiles from the tilemap on the canvas
        if (this.map.length == 0)
            return;
        for (let y = 0; y < round(height / this.tileH); y++) {
            for (let x = 0; x < round(width / this.tileW); x++) {
                this.drawTile(this.map[y][x].name, x * this.tileW, y * this.tileH);
            }
        }
        // display toolbar if it's not in hidden mode
        if (this.hide)
            return;
        stroke(0, 0, 0);
        fill(0);
        rect(0, height - this.tileH, width, this.tileH);
        for (let i = 0; i < this.tiles.length; i++) {
            image(this.img, i * this.tileW + i, height - this.tileH, this.tileW, this.tileH,
                this.tiles[i].xOff, this.tiles[i].yOff, this.tileW, this.tileH);
        }
        fill(255);
        rect(width - this.tileW, height - this.tileH, this.tileW, this.tileH);
        fill(255, 0, 0);
        textAlign(CENTER);
        textSize(this.tileW / 3);
        text("hide", width - this.tileW + (this.tileW / 2), height - (this.tileH / 2));
        // draw grid lines
        for (let i = 0; i < round(height / this.tileH); i++) {
            line(0, i * this.tileH, width, i * this.tileH);
        }
        for (let i = 0; i < round(width / this.tileW); i++) {
            line(i * this.tileW, 0, i * this.tileW, height - this.tileH);
        }
        noFill();
        stroke(255, 0, 0);
        strokeWeight(2);
        try {
            rect(round(mouseX / this.tileW) * this.tileW, round(mouseY / this.tileH) * this.tileH, this.tileW, this.tileH);
        } catch (err) {
            console.log("mouse out of canvas. - indicator unshown.");
        }
        stroke(0);
        strokeWeight(1);
    }

    exportMapToText() {
        let strDisp = "var worldMap = [\n";
        for (let y = 0; y < round(height / this.tileH); y++) {
            strDisp += "[";
            for (let x = 0; x < round(width / this.tileW); x++) {
                if ((x + 1) == round(width / this.tileW))
                    strDisp += '"' + this.map[y][x].name + '"';
                else
                    strDisp += '"' + this.map[y][x].name + '"' + ", ";
            }
            strDisp += "],\n";
        }
        strDisp += "];";
        console.log(strDisp);
        strDisp += "\n\n// Don't forget to do: tileset.setMap(worldMap);";
        let answer = prompt("Would you like to export a text fire for the current map?");
        if (answer == "y" || answer == "Y" || answer == "yes" || answer == "Yes" || answer == "YES") {
            let blob = new Blob([strDisp], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "tilemap.js");
        }
    }

    // create a list of blocked tile IDs that entities can't move through
    initBlockedList(blocked) {
        this.blockedList = blocked;
    }

    initMoveableList(moveableList) {
        let blocked = [];
        // let moveable = moveableList.sort();
        // let this.tiles = this.tiles.sort();
        for (let i = 0; i < this.tiles.length; i++) {
            let contained = false;
            for (let j = 0; j < moveableList.length; j++) {
                if ((this.tiles[i].name + "") == (moveableList[j] + "")) {
                    // if moveableList doesn't contain the element this.tiles[0], skip
                    contained = true;
                    break;
                }
            }
            if (!contained)
                blocked.push(this.tiles[i].name + "");
        }
        this.blockedList = blocked;
    }

    initNeighbours() {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[0].length; x++) {
                if (x > 0) {
                    // add left neighbour
                    this.map[y][x].neighbours.push(this.map[y][x - 1]);
                }
                if (x < (this.map[0].length - 1)) {
                    // add right neighbour
                    this.map[y][x].neighbours.push(this.map[y][x + 1]);
                }
                if (y > 0) {
                    // add neighbour above
                    this.map[y][x].neighbours.push(this.map[y - 1][x]);
                }
                if (y < this.map.length - 1) {
                    // add neighbour below
                    this.map[y][x].neighbours.push(this.map[y + 1][x]);
                }
            }
        }
    }

    // A* path finding algorithm
    shortestPath(start, goal) {
        // start isn't moveable to
        if (!this.moveable(start.x / this.tileW, start.y / this.tileH)) {
            return [];
        }
        let openSet = [];
        let closedSet = [];
        openSet.push(start);

        // clear path finding data
        for (let y = 0; y < round(height / this.tileH); y++) {
            for (let x = 0; x < round(width / this.tileW); x++) {
                this.map[y][x].f = 0;
                this.map[y][x].g = 0;
                this.map[y][x].h = 0;
                this.map[y][x].parent = null;
            }
        }

        while (openSet.length > 0) {
            // get lowest cost node in open set
            let currentNode = openSet[0];
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < currentNode.f)
                    currentNode = openSet[i];
            }

            // if end has been reached, then finish
            if (currentNode.x == goal.x && currentNode.y == goal.y) {
                let path = []
                while (currentNode.parent != null) {
                    path.push(currentNode);
                    currentNode = currentNode.parent;
                }
                return path.reverse();
            }

            // remove currentNode from openset, and put into closed set
            closedSet.push(currentNode);
            for (let i = openSet.length - 1; i >= 0;  i--) {
                if (openSet[i] === currentNode) {
                    openSet.splice(i, 1);
                }
            }

            // evaluate currentNode's neighbours
            for (let i = 0; i < currentNode.neighbours.length; i++) {
                let neighbour = currentNode.neighbours[i];
                if (!this.moveable(neighbour.x / this.tileW, neighbour.y / this.tileH)) {
                    continue;
                }
                if (closedSet.includes(neighbour))
                    continue;
                //  valid neighbour found..
                let gScore = currentNode.g + 1;
                let bestG = false;
                if (!openSet.includes(neighbour)) {
                    // first time at neighbour, so it's the best
                    bestG = true;
                    neighbour.h = this.heuristic(neighbour.x, neighbour.y, goal.x, goal.y);
                    openSet.push(neighbour);
                } else if (gScore < neighbour.g) {
                    // worse path to it exists in openset..
                    bestG = true;
                    openSet.splice(openSet.indexOf(neighbour), 1);
                }

                if (bestG) {
                    neighbour.parent = currentNode;
                    neighbour.g = gScore;
                    neighbour.f = neighbour.h + neighbour.g;
                }
            }
        }
        // no path found
        return [];
    }

    heuristic(x1, y1, x2, y2) {
        return Math.abs((x1 * this.tileW) - (x2 * this.tileW)) +
        Math.abs((y2 * this.tileH) - (y1 * this.tileH));
    }

    moveable(x, y) {
        return !this.blockedList.includes(this.map[y][x].name);
    }

}
