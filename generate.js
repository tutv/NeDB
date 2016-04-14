var lorem = require('lorem-ipsum');
var generateK = {};

/**
 * Generate title
 */
generateK.generateTitle = function () {
    return lorem({
        count: 1,
        units: 'sentences',
        sentenceLowerBound: 5,
        sentenceUpperBound: 15
    });
};

/**
 * Generate content
 */
generateK.generateContent = function () {
    return lorem({
        count: 1,
        units: 'paragraphs',
        sentenceLowerBound: 5,
        sentenceUpperBound: 15,
        paragraphLowerBound: 3, paragraphUpperBound: 7,
        format: 'html'
    });
};

generateK.random = function (min, max) {
    return Math.floor((Math.random() * max) + min);
};

module.exports = generateK;