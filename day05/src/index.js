const fs = require('fs');
const readline = require('readline');
const { once } = require('events');
const { stringify } = require('querystring');



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
            lines.push(line);
        });
  
        await once(rl, 'close');
  
        console.log('File processed.');

    } catch (err) {
        console.error(err);
    }

    return lines;
};


const load = async (filename) => {
    const data = await processLineByLine(filename);
    return data;
}



(async () => {

    const data = await load(filename);

    const rows = [64, 32, 16, 8, 4, 2, 1];
    const cols = [4, 2 ,1];


    const seats = [];

    const maxSeat = (128*8);

    for (s = 0; s < maxSeat; s++)
    {
        seats.push(false);
    }

    data.forEach(a => {
        const p = a.split('');

        let row = 0;

        for (i = 0; i < 7; i++) {
            row += (p[i] === 'F' ? 0 : rows[i]);
        }
        let col = 0;
        for (j = 0; j < 3; j++) {
            col += (p[j+7] === 'L' ? 0 : cols[j]);
            
        }

        const seat = (row * 8) + col;

        seats[seat] = true;
    });

    let maxPass = 0;
    let mySeat = 0;

    for (z = 0; z < maxSeat; z++) {
        maxPass = seats[z] ? z : maxPass;

        if (!seats[z] && seats[z-1] && seats[z+1])
        {
            mySeat = z;
        }
        
    }
    console.log(`Max Pass Seat is ${maxPass} and my seat must be ${mySeat}`);
})();

