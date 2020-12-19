const fs = require('fs');
const readline = require('readline');
const { once } = require('events');
const { stringify } = require('querystring');



const filename = 'data.txt';


async function processLineByLine(filename) {
    const lines = [];

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


const load = async (filename) => {
    const data = await processLineByLine(filename);
    return data;
}

// part one
const canContainBag = (rules, rule, bag) => {
    let found = false;
    
    if (rule.bags.length === 0) {
        found = false;
    } else if (rule.bags.filter(b => b.bagName === bag).length > 0) {
        found = true; 
    } else { 
        found = rule.bags.reduce((f, b) => {
            return f || canContainBag(rules, rules.find(r => r.bagName === b.bagName), bag ); 
            }, false 
        );       
    }

    return found;

};

//part toe
const ruleContains = (rules, bag) =>
{
    const rule = rules.find(b => b.bagName === bag);

    if (rule.bags.length === 0) {
        return 0;
    }
    else {
        return rule.bags.reduce((acc, bag) =>{
            return acc + bag.count + (bag.count * ruleContains(rules, bag.bagName));
        },0);
    }
}


(async () => {

    const data = await load(filename);

    bagRuleRegEx = new RegExp(/(?:(^[a-zA-Z]+\s[a-zA-Z]+) bags contain)(?: no other bags.$|(?:,? (?:(\d+) ([a-zA-Z]+ [a-zA-Z]+) bags?))?,?(?: (\d+) ([a-zA-Z]+ [a-zA-Z]+) bags?)?,?(?: (\d+) ([a-zA-Z]+ [a-zA-Z]+) bags?)?,?(?: (\d+) ([a-zA-Z]+ [a-zA-Z]+) bags?)?\.$)/);
    rules = [];

    data.forEach(r => {
        const match = r.match(bagRuleRegEx);

        let rule = {};

        if (match) {
            rule = {
                rule: match[1].replace(' ','-'),
                bagName: match[1],
                bags: []
            };

            for (let i = 2; i < match.length; i = i + 2) {
                if (match[i]) {
                    rule.bags.push({
                        bagName: `${match[i+1]}`,
                        count: Number(match[i]),
                    });
                }
            }
            
            rules.push(rule);
        }
    });

    const bagOfInterest = 'shiny gold';

    // part 1
    let found = rules.reduce((matchRules, rule) => {
        if (canContainBag(rules, rule, bagOfInterest)) {
             matchRules.push(rule);
        }
        return matchRules;
    }, []);

    console.log(`rules that contain shiny gold: ${found.length}`);
    
    // part 2
    let bagCount = ruleContains(rules, bagOfInterest);

    console.log(`${bagOfInterest} bags contain ${bagCount} bag`);

})();