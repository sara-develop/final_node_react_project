function isValidId(id) {
    if (id.length !== 9 || !/^\d+$/.test(id)) {
        return false;
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let digit = parseInt(id[i])
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }

    return sum % 10 === 0;
}

module.exports = { isValidId };