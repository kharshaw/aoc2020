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

const parse = source => {
    const program = [];

    for (line = 0; line < source.length; line++)
    {
        input = source[line].split(' ');

        program.push({
            command: input[0],
            arg: Number(input[1]),
            isEvaluated: false
        });
    }

    return program;
}

const reset = program => {
    
    program.forEach(line => {
        line.isEvaluated = false;
    });

    return program;
}

const run = (program, fixLine) => {
    let line = 0;
    let acc = 0;
    let cmd;
 
    do {

        program[line].isEvaluated = true;
        cmd = program[line].command;

        if (fixLine && fixLine === line) {
            cmd = (cmd === "nop" ? "jmp" : cmd === "jmp" ? "nop" : cmd);
        }

        switch (cmd) {
            case "nop":
                line++;
                break;
            case "acc":
                acc += program[line].arg;
                line++;
                break;
            case "jmp":
                line += program[line].arg;
                break;
        }  

    } while (program[line] && !program[line].isEvaluated);
 
    if (typeof(fixLine) !== 'undefined' && line !== program.length)
    {
        return run(reset(program), ++fixLine);
    } else {
        
        return acc
    }


}



(async () => {


    const data = await load();
    const program = parse(data);


    //part 1
    const result = run(program);
    console.log(`part 1: ${result}`);

    //part 2
    const result2 = run(reset(program),0);
    console.log(`part 2: ${result2}`);

})();