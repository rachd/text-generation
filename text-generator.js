var fs = require('fs');

function readLines(input, func) {
    var remaining = '';

    input.on('data', function (data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            func(line);
            index = remaining.indexOf('\n');
        }
    });

    input.on('end', function () {
        if (remaining.length > 0) {
            func(remaining);
            afterGetWords();
        }
    });
}

function func(data) {
    words = words.concat(data.trim().split(/\s+/));
}

function afterGetWords() {
    words = ['<start1>', '<start2>', ...words, '<end1>', '<end2>'];
    // words = ['<start1>', ...words, '<end1>'];
    // for (let i = 0; i < words.length - 1; i++) {
    //     bigrams.push([words[i], words[i + 1]]);
    //     if (allNGrams.hasOwnProperty(words[i])) {
    //         allNGrams[words[i]].push(words[i + 1]);
    //     } else {
    //         allNGrams[words[i]] = [words[i + 1]];
    //     }
    // }
    for (let i = 0; i < words.length - 2; i++) {
        trigrams.push([words[i], words[i + 1], words[i + 2]]);
        if (allNGrams.hasOwnProperty(`${words[i]} ${words[i + 1]}`)) {
            allNGrams[`${words[i]} ${words[i + 1]}`].push(words[i + 2]);
        } else {
            allNGrams[`${words[i]} ${words[i + 1]}`] = [words[i + 2]];
        }
    }
    generateText('<start1>', '<start2>');
}

function getNextWordsBigrams(firstWord) {
    // return bigrams.filter(pair => {
    //     return pair[0] === firstWord
    // }).map(pair => pair[1]);
    return allNGrams[firstWord];
}

function getNextWordsTrigrams(firstWord, secondWord) {
    // return trigrams.filter(pair => {
    //     return pair[0] === firstWord && pair[1] === secondWord
    // }).map(pair => pair[2]);
    return allNGrams[`${firstWord} ${secondWord}`]
}

function getLikelyWord(words) {
    //const sortedWords = words.sort();
    //const max = Math.floor(sortedWords.length / 4);
    const index = Math.floor(Math.random() * (words.length));
    return words[index];
}

function generateText(start1, start2) {
    let count = 0;
    let nextWord1 = start1;
    let nextWord2 = start2;
    let output = "";
    let nextWord = "";
    while (nextWord1 !== "<end1>" && nextWord2 !== "<end2>" && count < 200) {
        nextWord = getLikelyWord(getNextWordsTrigrams(nextWord1, nextWord2));
        output += ` ${nextWord}`;
        nextWord1 = nextWord2;
        nextWord2 = nextWord;
        count++;
    }
    console.log(output);
}

let words = [];
let bigrams = [];
let trigrams = [];
let allNGrams = {};
var input = fs.createReadStream('./test.txt');
readLines(input, func);