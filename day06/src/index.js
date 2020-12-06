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
            lines.push(line.split(''));
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


    let answers = { groupSize: 0 };
    let groupSize = 0;
    const groups = [];

    // for easch group create a hashtable for answers and number of each answer

    for (l = 0; l < data.length; l++)
    {
        if (data[l].length === 0) {
            groups.push(answers);
            answers = { groupSize: 0 };
        }
        else {

            answers.groupSize++;

            for (a = 0; a < data[l].length; a++) {
                
                if (!answers[data[l][a]]) {
                    answers[data[l][a]] = 0;
                }
            
                answers[data[l][a]]++; 
            }
        }
        
    }

    groups.push(answers);

    console.log(groups);

    const anyAnswered = groups.reduce((acc, grp) => { 
        let count = 0;
        for (a in grp) {
            if (grp.hasOwnProperty(a) && a != 'groupSize') ++count;
        } 

        return acc+ count;
    }, 0);

    console.log(`total answers: ${anyAnswered}`);

    const allAnswered = groups.reduce((acc, grp) => { 
        let count = 0;
        for (a in grp) {
            if (grp.hasOwnProperty(a) && a != 'groupSize' && grp[a] === grp.groupSize) ++count;
        } 

        return acc+ count;
    }, 0);

    console.log(`total all answers: ${allAnswered}`);
})();

