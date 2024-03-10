'use strict'

// Status socket
const statuSocket = {
    connect: 1,
    disconnect: 0
}

// Status Database Plan
const statusPlan = {
    default: 1, // Cho san xuat
    start: 2, // Dang san xuat
    stop: 3, // Tam dung san xuat
    continue: 4, // Tiep tuc san xuat
    end: 5, // Ket thuc san xuat
}

// Status after send event plan in client
const statusEventPlan = {
    get: 0, // Get plan
    start: 1, // Start plan
    stop: 2, // Stop plan
    end: 3, // End Plan
}

// Next, Back or Back Original Plan
const nextPlan = {
    default: 0, // Default plan
    next: 1, // Next Plan
    back: 2, // Back Plan
    original: 3, // Back Original Plan
}

// Status Machine Plan
const statusMachine = {
    stop: 0,
    run: 1,
    end: 2,
    err: 3,
    start: 4
}

// Time check cheo or setup
const timePlan = {
    setup: 1,
    check: 2
}

// Type Error
const typeError = {
    err: 1, // Nguyen nhan loi may
    stop: 2 // Nguyen nhan dung may
}

// Status Stop
const statusStop = {
    noplan: 1, // Khong cos KHSX
    nouser: 2, // Khong co nguoi
    nosetup: 3, // Khong co nguoi setup
    clear: 4, // Ve sinh may
    test: 5, // Dung hop, test
    emb: 6, // Dung cho phoi
    waitStage: 7, // Dung cho cong doan trc
    repair: 8, // Dung sua chua
    jig: 9, // Dung xu ly do ga
    drill: 10, // Dung xu ly khoan
    doa: 11, // Dung xu ly doa
    chip: 12, // Dung xu ly chip
    sogata: 13, // Dung xu ly sogata
    mizo: 14, // Dung xu ly mizo
    roll: 15, // Dung xu ly lan ren
    banishing: 16, // Dung xu ly banishing
    orther: 17, // Dung xu ly loi khac
}

// Status Error
const statusError = {
    sys: 1, // Loi he dieu hanh
    hardware: 2, // Loi phan cung
    warning: 3, // Loi canh bao
}

// Type setup or check cross in DB
const typeSCInDb = {
    setup: 2,
    check: 3,
    error: 4 // Error
} 

// Type setup
const typeSetup = {
    finish: 1,
    unfinish: 0
}

// Type check cheo
const typeCheckCross = {
    finish: 1,
    unfinish: 0
}

// Status Machine
const sttMachine = {
    connect: 1,
    disconnect: 0,
    run: 1,
    stop: 0
}
module.exports = {
    statuSocket, statusPlan, statusEventPlan, nextPlan, statusMachine, timePlan, typeError, statusStop, statusError, typeSCInDb, sttMachine
    ,typeSetup, typeCheckCross
}