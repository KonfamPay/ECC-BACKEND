module.exports = async (err, req, res, next) => {
	console.log(err);
	return res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.send(err.message || "Internal server error. Something Failed");
};
