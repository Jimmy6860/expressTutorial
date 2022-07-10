const log = (req, res, next) => {
    console.log('looging')
    next();
}

module.exports = log;