const fs = require('fs');
const readline = require('readline');
const { once } = require('events');



const filename = 'expenses.txt';


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


const loadExpenses = async () => {
    const expenses = await processLineByLine(filename);
    // [    
    //     1721,
    //     979,
    //     366,
    //     299,
    //     675,
    //     1456,
    // ]

    return expenses;
}


const findTwo2020Expenses = (expenses) => {

    console.log(`first: ${expenses[0]} last: ${expenses[expenses.length-1]}`);

    console.log(`Processing ${expenses.length} expenses`);

    for (i = 0; i < expenses.length; i++)
    {
        const e1 = Number(expenses[i]);

        for (j = i + 1; j < expenses.length; j++)
        {
            const e2 = Number(expenses[j]);

            if ((e1 + e2) === 2020)
                return { expense1: e1, expense2: e2};
        }
    }

    return null
}

const findThree2020Expenses = (expenses) => {

    console.log(`first: ${expenses[0]} last: ${expenses[expenses.length-1]}`);

    console.log(`Processing ${expenses.length} expenses`);

    for (i = 0; i < expenses.length; i++)
    {
        const e1 = Number(expenses[i]);

        for (j = i + 1; j < expenses.length; j++)
        {
            const e2 = Number(expenses[j]);

            for (k = j + 1; k < expenses.length; k++)
            {
                const e3 = Number(expenses[k]);
                if ((e1 + e2 + e3) === 2020)
                    return { expense1: e1, expense2: e2, expense3: e3};
            }
        }
    }

    return null
}

(async () => {

    const expenses = await loadExpenses();

    const result2 = findTwo2020Expenses(expenses);
    
    if (result2)
        console.log(`${result2.expense1} * ${result2.expense2} = ${result2.expense1 * result2.expense2}`);
    else
        console.log("not found");

    const result3 = findThree2020Expenses(expenses);
    if (result3)
        console.log(`${result3.expense1} * ${result3.expense2} * ${result3.expense3} = ${result3.expense1 * result3.expense2 * result3.expense3}`);
    else
        console.log("not found");
    
})();

