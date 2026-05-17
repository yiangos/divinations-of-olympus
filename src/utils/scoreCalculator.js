const rpn = (input) => {
    const stack = [];
    const handleToken = (token) => {
        if (!isNaN(parseFloat(token))) {
            stack.push(token);
            return;
        }
        const right = parseFloat(stack.pop());
        const left = parseFloat(stack.pop());
        switch (token) {
            case '+': return stack.push(left + right);
            case '-': return stack.push(left - right);
            case '*': return stack.push(left * right);
            case '/': return stack.push(left / right);
            case '^': return stack.push(left ** right);
            default: throw new Error(`Invalid token: ${token}`);
        }
    };
    const tokens = input.split(/(\s+)/).filter(i => i.trim() != "");
    for (let i of tokens) { handleToken(i); }
    return stack.pop();
};
const replaceCounter = (rpnToken, selectedGlyphs) => {
    const match = rpnToken.match(/\[c(\d+)\]/gi);
    if (!match) return rpnToken;
    const scoreValue = parseInt(rpnToken.match(/\d/), 10);
    return selectedGlyphs.filter(t => t.score == scoreValue).map(i => i.score).reduce((a, c) => a + c, 0);
};
const replaceCounters = (scoreString, selectedGlyphs) => {
    return scoreString.split(/(\s+)/).filter(i => i.trim() != "").map(token => replaceCounter(token, selectedGlyphs)).join(" ");
};
const finalScoreCandidate = (wordCombo, selectedGlyphs) => {
    const baseScore = calculateBaseScore(selectedGlyphs);
    const actionString = wordCombo.map(w => w.action).join(" ");
    const fullExpression = `${baseScore} ${actionString}`;
    return rpn(replaceCounters(fullExpression, selectedGlyphs));
};
export const allPossibleCombos = (words, selectedGlyphs) => {
    const availableWords = words.filter(w => 
        w.glyphs.every(wg => selectedGlyphs.some(g => g.name == wg))
    );
    const total = Math.pow(2, availableWords.length);
    let res = [];
    for (let i = 0; i < total; i++) {
        let comb = [];
        for (let j = 0; j < availableWords.length; j++) {
            if ((i & Math.pow(2, j))) comb.push(availableWords[j]);
        }
        if (comb.length) res.push(comb);
    }
    return res.filter(comboList => {
        for (const word of comboList) {
            if (comboList.some(t => t.name != word.name && t.glyphs.some(tg => word.glyphs.some(wg => wg == tg)))) {
                return false;
            }
        }
        return true;
    });
};
export const calculateBaseScore = (selectedGlyphs) => {
    return selectedGlyphs.map(g => g.score).reduce((a, c) => a + c, 0);
};
export const calculateFinalScore = (words, selectedGlyphs) => {
    let score = calculateBaseScore(selectedGlyphs);
    let selectedWords = [];
    const allPossible = allPossibleCombos(words, selectedGlyphs);
    
    allPossible.forEach(combo => {
        const tempScore = finalScoreCandidate(combo, selectedGlyphs);
        if (tempScore > score) {
            score = tempScore;
            selectedWords = combo;
        }
    });
    return { score, selectedWords };
};