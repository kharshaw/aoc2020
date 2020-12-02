const fs = require('fs');
const readline = require('readline');
const { once } = require('events');
const { stringify } = require('querystring');



const filename = 'passwords.txt';


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


const load = async () => {
    const data = await processLineByLine(filename);
    return data;
}

const parsePasswordPolicy = (passwordPolicy) => {

    const recordFormat = /([0-9]+)\-([0-9]+) ([a-z]): ([a-zA-Z]+)/

    let pwd;

    passwordPolicy.replace(recordFormat, function(match, minCount, maxCount, requireChar, password) {
        pwd = {
            minCount: minCount,
            maxCount: maxCount,
            requireChar: requireChar,
            password: password
        };
    });
    
    return pwd;
}

const isValid = (policy) => {
    
    var matches = (policy.password.match(new RegExp(policy.requireChar,"g")));
    var count = matches === null ? 0 : matches.length;
    
    return count <= policy.maxCount && count >= policy.minCount;
}

const isValidForReal = (policy) => {
    
    position1 = policy.password.charAt(policy.minCount - 1);
    position2 = policy.password.charAt(policy.maxCount - 1);
    
    var valid = (position1 === policy.requireChar || position2 === policy.requireChar) && position1 != position2;

    return valid;
}

const isValidPassword = async (password) => {

}

(async () => {

    const passwords = await load();

    const policies = passwords.map(p => parsePasswordPolicy(p));

    var oldCount = policies.map(p => isValid(p)).reduce((acc, curr) => acc + curr );

    console.log(oldCount);
    

    var realCount = policies.map(p => isValidForReal(p)).reduce((acc, curr) => acc + curr );

    console.log(realCount);


    
})();

