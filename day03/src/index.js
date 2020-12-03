const fs = require('fs');
const readline = require('readline');
const { once } = require('events');
const { pathToFileURL } = require('url');


const filename = 'data.txt';

async function processLineByLine(filename) {
    const lines = [];

    console.log(`opening ${filename} for read`);

    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(filename),
            crlfDelay: Infinity
        });
    

        rl.on('line', (line) => {
            //
            // this is different form other days.  we're pushing an array of chars not a simple string
            //
            lines.push(line.split(''));
        });
  
        await once(rl, 'close');
  
        console.log('File processed.');

    } catch (err) {
        console.error(err);
    }

    return lines;
};


const load = async () => {
    const data = await processLineByLine(filename);
    return data;
}

const move = (map, location, travel ) => {

    let newLocation = { };

    newLocation.row = location.row + travel.down;
    newLocation.col = location.col + travel.over;
    newLocation.done = location.row >= map.length;

    const checkCol = (newLocation.col % map[0].length);

    //console.log(`checking row: ${newLocation.row} col: ${checkCol} is: ${map[newLocation.row][checkCol]}`);

    newLocation.hitTree =   map[newLocation.row][checkCol ] === "#";


    return newLocation;

}



(async () => {


    const map = await load();

    const travels = [
        { over: 1, down: 1 },
        { over: 3, down: 1 },
        { over: 5, down: 1 },
        { over: 7, down: 1 },
        { over: 1, down: 2 }
    ];

    let total = 1;

    travels.forEach(travel => {
        let currLoc = { row: 0, col: 0, hitTree: false, done: false };

        const moves = [];
    
    
        console.log(`checking path ${JSON.stringify(travel)}`);


        for (i = 0; i < map.length - 1; i = i + travel.down) {
            
            currLoc = move(map, currLoc, travel );
            moves.push(currLoc);
        }
    
        const hits = moves.reduce((a, c) => a + Number(c.hitTree ? 1: 0), 0 );

        console.log(`hits: ${hits}`);

        total = total * hits;

        
    });

    console.log(`multiple: ${total}`);

})();