const fs = require('fs');
const readline = require('readline');
const { once } = require('events');

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
  
    } catch (err) {
        console.error(err);
    }

    return lines;
};


const load = async () => {
    const data = await processLineByLine(filename);
    return data;
}



(async () => {


    const data = await load();

    console.log(`part 1: ${false}`);

})();