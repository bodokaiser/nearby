module.exports = function(app) {

	require('./general')(app);

	require('./resolve')(app);

	require('./production')(app);

	require('./development')(app);

};
