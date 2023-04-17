module.exports = {
  allowAll: (req, res, next) => {
    console.log('osidjfosdjfosjifosdjf');
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET, PUT, POST, DELETE, HEAD, OPTIONS, TRACE, PATCH'
    );
    next();
  },
};
