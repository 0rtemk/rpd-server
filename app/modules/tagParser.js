module.exports.parseHtmlString = function parseHtmlString(html) {
    const tagMatches = [];
    let match;

    const tagRegexMap = {
        paragraph: /<p>([\s\S]*?)<\/p>/g,
        numericList: /<ol>([\s\S]*?)<\/ol>/g,
        list: /<ul>([\s\S]*?)<\/ul>/g
    };

    function addMatches(regex, tagType) {
        while ((match = regex.exec(html)) !== null) {
            tagMatches.push({
                type: tagType,
                value: match[1],
                index: match.index
            });
        }
    }

    for (const [tagType, regex] of Object.entries(tagRegexMap)) {
        addMatches(regex, tagType);
    }

    tagMatches.sort((a, b) => a.index - b.index);

    const parsedResult = {};
    tagMatches.forEach((match, i) => {
        if (match.type === 'paragraph') {
            parsedResult[i] = { type: 'paragraph', value: match.value };
        } else if (match.type === 'numericList' || match.type === 'list') {
            const items = match.value.match(/<li>[\s\S]*?<\/li>/g).map(li => li.match(/<li>([\s\S]*?)<\/li>/)[1]);
            parsedResult[i] = { type: match.type === 'numericList' ? 'numericList' : 'list', value: items };
        }
    });

    return parsedResult;
}