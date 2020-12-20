const fs = require('fs');
const readline = require('readline');
const { once } = require('events');

const filename = 'data-test.txt';

async function processLineByLine(filename) {
    const lines = [];

    console.log(`opening ${filename} for read`);

    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(filename),
            crlfDelay: Infinity
        });
    

        rl.on('line', (line) => {
            lines.push(line);
        });
  
        await once(rl, 'close');
  
    } catch (err) {
        console.error(err);
    }

    return lines;
};


const load = async () => {
    const data = await processLineByLine(filename);
    return data;
}


const parseTiles = (data) => {

    let tiles = [];
    let tile = {};

    for (let i = 0; i < data.length; i++) {
        let line = data[i];


        if (line.length === 0) {
            tiles.push(tile);
        } else if (line.substr(0,4) === 'Tile') {
            
            let id = Number(line.split(' ')[1].split(':')[0]);

            tile = {
                id: id,
                image: []
            };
        } else {
            tile.image.push(line.split(''));
        }
    }
    tiles.push(tile);

    return tiles;
}

const calcSideChecksum = (side) => {
    let checksum = 0;

    for (let i = side.length - 1, j = 0; i >= 0; i--, j++) {
        if (side[i] === '#') checksum += 2**j;
    }
    return checksum;
}

const generateSideChecksums = (tile) => {
    
    let north = calcSideChecksum(tile[0]);
    let northReversed = calcSideChecksum(tile[0].reverse());
    tile[0].reverse();

    let south = calcSideChecksum(tile[tile.length-1]);
    let southReversed = calcSideChecksum(tile[tile.length-1].reverse());
    tile[tile.length-1].reverse();

    let east = calcSideChecksum(tile.map(t => t[t.length - 1]));
    let eastReversed = calcSideChecksum(tile.map(t => t[t.length - 1]).reverse());
    
    let west = calcSideChecksum(tile.map(t => t[0]));
    let westReversed = calcSideChecksum(tile.map(t => t[0]).reverse());

    return {
        north: north,
        south: south,
        east: east,
        west: west,
        northReversed: northReversed,
        southReversed: southReversed,
        eastReversed: eastReversed,
        westReversed: westReversed,
    }
}

const flipEastWest = tile => {
    let flipped = {};

    flipped.sides.north = tile.sides.northReversed;
    flipped.sides.northReversed = tile.sides.north;

    flipped.sides.south = tile.sides.southReversed;
    flipped.sides.southReversed = tile.sides.south;

    flipped.sides.east = tile.sides.west;
    flipped.sides.eastReversed = tile.sides.westReversed;

    flipped.sides.west = tile.sides.east;
    flipped.sides.westReversed = tile.sides.eastReversed;

    return flipped;
}

const flipNorthSouth = tile => {
    let flipped = {};

    flipped.sides.north = tile.sides.south;
    flipped.sides.northReversed = tile.sides.northReversed;

    flipped.sides.south = tile.sides.north;
    flipped.sides.southReversed = tile.sides.northReversed;

    flipped.sides.east = tile.sides.westReversed;
    flipped.sides.eastReversed = tile.sides.west;

    flipped.sides.west = tile.sides.eastReversed;
    flipped.sides.westReversed = tile.sides.east;

    return flipped;
}

const rotateClockwise90 = tile => {
    let rotated = {};
    rotated.sides.north = tile.sides.west;
    rotated.sides.northReversed = tile.sides.westReversed;

    rotated.sides.south = tile.sides.east;
    rotated.sides.southReversed = tile.sides.eastReversed;

    rotated.sides.east = tile.sides.south;
    rotated.sides.eastReversed = tile.sides.southReversed;

    rotated.sides.west = tile.sides.south;
    rotated.sides.westReversed = tile.sides.southReversed;

    return rotated;

};

const printTile = (tile) => {

    console.log(tile.id);

    for (const side in tile.sides) {
        
        console.log(`\t ${side} ${tile.sides[side]}`);
    }

}

const findNeighbors = (tile, tiles) => {


    for (side in tile.sides) {

        let neighbor = tiles.filter(t => t.id !== tile.id).find(t =>
            tile.sides[side] === t.sides.north ||
            tile.sides[side] === t.sides.northReversed ||
            tile.sides[side] === t.sides.south ||
            tile.sides[side] === t.sides.southReversed ||
            tile.sides[side] === t.sides.east ||
            tile.sides[side] === t.sides.eastReversed ||
            tile.sides[side] === t.sides.west ||
            tile.sides[side] === t.sides.westReversed 
        );

        if (neighbor) {
            console.log(`${tile.id} has neighbor ${neighbor.id} on ${[side]}`);
        }
    }
}

const part1 = (data) => {

    let tiles = parseTiles(data);

    tiles = tiles.map(t => { 
        t.sides = generateSideChecksums(t.image);
        return t;
    });

    tiles.forEach(t => {
        findNeighbors(t, tiles)
    });

    return false;
}

const part2 = () => {
    return false;
}

(async () => {


    const data = await load();

    /*

        the big idea.  figure out the checksums for each side (north, south, east and west), 
        assuming '#' = 1 and '.' = 0.  We'll also calc the revers of each side as well
        to memoize the "flipped" tile as well.
        
        Then match the checksum across the tiles to find a solution.

    */


    //part 1
    const result1 = part1(data);
    console.log(`part 1: ${result1}`);

    //part 2
    const result2 = part2();
    console.log(`part 2: ${result2}`);

})();