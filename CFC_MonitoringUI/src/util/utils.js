function encodePassword(pass) {
    return Buffer.from(pass).toString('base64');
}

function decodePassword(pass) {
    return Buffer.from(pass, 'base64').toString('ascii');
}

export{encodePassword,decodePassword}