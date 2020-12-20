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

const addendsExists = (sum, list) => {
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            if (list[i] !== list[j] && ((list[i] + list[j]) === sum)) return true;
        }
    }

    return false;
}

const part1 = () => {
    return false;
}

const part2 = () => {
    return false;
}

(async () => {


    const data = await load();


    //part 1
    const result1 = part1();
    console.log(`part 1: ${result1}`);

    //part 2
    const result2 = part2();
    console.log(`part 2: ${result2}`);

})();