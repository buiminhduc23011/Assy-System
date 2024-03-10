
function convertString(data, data_len) {
    let data_fill = new Uint32Array(Math.ceil(data_len / 2));

    let sum = 0;

    for (let i = 0, j = 0; i < data_len; i += 2, j++) {
        if (i + 1 < data_len) {
            sum = data[i].charCodeAt(0) + (data[i + 1].charCodeAt(0) << 8);
        } else {
            sum = data[i].charCodeAt(0);
        }

        data_fill[j] = sum;
    }

    return data_fill;
}

function reverseToString(data_fill) {
    let stringBuilder = "";

    for (let i = 0; i < data_fill.length; i++) {
        let value = data_fill[i] & 0xFFFF;

        let lowByte = String.fromCharCode(value & 0xFF);
        let highByte = String.fromCharCode((value >> 8) & 0xFF);

        if (lowByte === '\0' && highByte === '\0') {
            break;
        }

        stringBuilder += lowByte;
        if (highByte !== '\0') {
            stringBuilder += highByte;
        }
    }

    return stringBuilder;
}
module.exports = { convertString, reverseToString};