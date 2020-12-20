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
            lines.push(Number(line));
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

const findErrorPart1 = (list, preambleSize) => {

    for (let i = preambleSize; i < list.length;i++) {
        if (!addendsExists(list[i], list.slice(i - preambleSize, i))) {
            return list[i];
        }
    }
}

const findErrorPart2 = () => {
    return false;

}

(async () => {


    const data = await load();

    const preambleSize = 25;

    //part 1
    const result1 = findErrorPart1(data, preambleSize);
    console.log(`part 1: ${result1}`);

    //part 2
    const result2 = findErrorPart2();
    console.log(`part 2: ${result2}`);

})();