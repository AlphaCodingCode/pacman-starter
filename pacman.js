class Pacman {
    constructor(col, row) {
        this.dir = "left";
        this.lastDir = this.dir;
        this.x = tileset.tileW * col;
        this.y = tileset.tileH * row;
        this.speed = 2;
        this.mouthTop = 0 * Math.PI;
        this.mouthBot = 2 * Math.PI;
        this.mouthTopInitial = 0;
        this.mouthBotInitial = 0;
        this.mouthOpening = false;
        this.mouthDelay = 0;
        this.mouthSetDir();
    }

    mouthSetDir() {
        if (this.dir == "right") {
            this.mouthTopInitial = 0;
            this.mouthBotInitial = 0;
            this.mouthTop = 0;
            this.mouthBot = 2 * Math.PI;
        } else if (this.dir == "left") {
            this.mouthTopInitial = Math.PI;
            this.mouthBotInitial = Math.PI;
            this.mouthTop = Math.PI;
            this.mouthBot = Math.PI;
        } else if (this.dir == "down") {
            this.mouthTopInitial = Math.PI / 2;
            this.mouthBotInitial = Math.PI / 2;
            this.mouthTop = Math.PI / 2;
            this.mouthBot = 5 * Math.PI / 2;
        } else if (this.dir == "up") {
            this.mouthTopInitial = 3 * Math.PI / 2;
            this.mouthBotInitial = 3 * Math.PI / 2;
            this.mouthTop = 3 * Math.PI / 2;
            this.mouthBot = 7 * Math.PI / 2;
        }
    }

    updateMouth() {
        if (this.mouthDelay <= 0) {
            this.mouthDelay = 5;
        } else {
            this.mouthDelay--;
            return;
        }

        if (this.mouthTop >= this.mouthTopInitial + Math.PI / 4) {
            // dir reverse
            this.mouthOpening = false;
        } else if (this.mouthTop <= 0 + this.mouthBotInitial) {
            this.mouthOpening = true;
        }

        if (!this.mouthOpening) {
            // open mouth
            this.mouthTop -= Math.PI / 8;
            this.mouthBot += Math.PI / 8;
        } else {
            this.mouthTop += Math.PI / 8;
            this.mouthBot -= Math.PI / 8;
        }
    }

    update() {
        // pacman's mouth chomping animation update
        this.updateMouth();

        // log last player input direction
        if (keys[UP_ARROW] || keys[keyW])
            this.lastDir = "up";
        else if (keys[DOWN_ARROW] || keys[keyS])
            this.lastDir = "down";
        else if (keys[LEFT_ARROW] || keys[keyA])
            this.lastDir = "left";
        else if (keys[RIGHT_ARROW] || keys[keyD])
            this.lastDir = "right";

        // change pacman's position based on current direction facing
        if (this.dir == "down") {
            this.y += this.speed;
        } else if (this.dir == "up") {
            this.y -= this.speed;
        } else if (this.dir == "left") {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }

        // pacman has reached a new tile's center
        if  ((this.x % tileset.tileW == 0) && (this.y % tileset.tileH == 0)) {

            // change pacman's direction if a new direction was inputted
            let tile = this.getTileInDir(this.lastDir);
            if (tile.name != "brick") {
                if (tileset.map[tile.r][tile.c].name != "brick") {
                    this.dir = this.lastDir;
                    // mouth facing direction needs to re-adjust to facing direction
                    this.mouthSetDir();
                    this.speed = 2;
                }
            }

            // pacman should eat berries


            // if pacman reaches the portal, he should come out the other side


            // check that in the current direction, pacman isn't running into a wall, if he is stop him

        }
        // check contact with a ghost

    }

    getTileInDir(dir) {
        let col = this.x / tileset.tileW;
        let row = this.y / tileset.tileH;
        if (dir == "down") {
            row++;
        } else if (dir == "up") {
            row--;
        } else if (dir == "left") {
            col--;
        } else {
            col++;
        }
        return tileset.map[col][row];
    }

    render() {
        fill(200, 200, 0);
        arc(this.x + 16, this.y + 16, 32, 32, this.mouthTop, this.mouthBot, PIE);
        noFill();
    }
}
