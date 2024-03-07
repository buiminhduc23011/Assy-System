'use strict'

const read_file_amount = require('../app/controllers/Read_File/AmountOfJobGen');
const robot = require('../app/controllers/ROBOTController');

const read_file_auto = async () => {

    await robot.get_list_axis();
    await robot.get_list_machine();
    console.log('Lấy Dữ Liệu DB Thành Công');
    // setTimeout( async function () {
    //     await read_file_amount.run();
    // }, 500);
}


const run = async () => {
    await read_file_auto();
}

module.exports = {run};