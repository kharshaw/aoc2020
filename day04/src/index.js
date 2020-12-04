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

const parse = async(raw) => {

    let passport = {};
    let passports = [];

    for (i = 0; i < raw.length; i++) {
        const line = String(raw[i]);

        if (line.length != 0) {
            const fields = line.split(' ');

            for (j = 0; j < fields.length; j++) {
                const f = fields[j];

                const keyVal = f.split(':');
                passport[keyVal[0]] = keyVal[1]; 
            }
        }
        else {
            passports.push(passport);
            passport = {};
        }
    }

    if (passport) passports.push(passport);

    return passports;
}

const isValid = (passport, fields) => {

    passport.isValid = true;

    fields.forEach(field => {
        if (field != 'cid' && !passport[field]) {
            passport.isValid = false;
        }

    });

    if (passport.isValid) {

        if (passport.byr < 1920 || passport.byr > 2002) passport.isValid = false;
        if (passport.iyr < 2010 || passport.iyr > 2020) passport.isValid = false;
        if (passport.eyr < 2020 || passport.eyr > 2030) passport.isValid = false;
        
        const height = passport.hgt.match(/^([0-9]+)(cm|in$)/);
        console.log(height);

        if (height) {
            console.log(`measure: ${height[1]} uom:${height[2]}`)
            if ((height[2] === 'cm' && (height[1] < 150 || height[1] > 193)) ||
                (height[2] === 'in' && (height[1] < 59 || height[1] > 76))) {
                
                passport.isValid = false;
            }
        }
        else {
            passport.isValid = false;
        }

        if (!/#[0-9a-f]{6}/.test(passport.hcl)) passport.isValid = false;
        if (!/amb|blu|brn|gry|grn|hzl|oth/.test(passport.ecl)) passport.isValid = false;
        if (!/^[0-9]{9}$/.test(passport.pid)) passport.isValid = false; 
    }

    console.log(passport);

    return passport;
}

(async () => {

    const data = await load(filename);

    const passports = await parse(data);

    console.log(passports);


    const requiredFields = [
        'byr',
        'iyr',
        'eyr',
        'hgt',
        'hcl',
        'ecl',
        'pid',
        'cid',
    ]

    const processedPassports = passports.map(p => isValid(p, requiredFields));
    
    console.log(`valid passports: ${ processedPassports.filter(p => p.isValid === true).length }`);




    
})();

