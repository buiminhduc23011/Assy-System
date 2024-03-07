'use strict'

/*
*   val: Value convert
*   pow: The number of characters after the "."
*   return float
*/
global.convertToFloat = (val = 0, pow = 1) => {
    if(val === '' || val === null || val === undefined) return 0;
    if(parseFloat(val) == NaN) return 0;

    return Math.round(parseFloat(val) * 10)/(Math.pow(10, pow));
}

/*
*   val: Value convert
*   pow: The number of characters after the "."
*   return int
*/
global.convertToInt = (val = 0, pow = 1) => {
    if(val === '' || val === null || val === undefined) return 0;
    if(parseFloat(val) == NaN) return 0;

    return Math.round(parseFloat(val));
}

// Convert Text signed to unsigned 
global.convStrToUnsigned = (str = '') => {
    if(!str || str === undefined) return '';
    if(str.typeOf != 'string') str = str.toString();
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, 'D') ?? '';
}

// Get MAC in Message Event Socket
global.getMac = (msg = []) => {
    return msg.MAC ?? (msg.mac ?? '');
}