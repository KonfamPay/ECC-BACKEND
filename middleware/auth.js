const jwt = require("jsonwebtoken");

const auth = async (req, next) => {
	// check header
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new Error("Authentication invaddlid");
	}
	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		req.user = {
			userId: payload.userId,
			firstName: payload.firstName,
			lastName: payload.lastName,
			email: payload.email,
		};
		next();
	} catch (error) {
		throw new Error("Authentication invalid");
	}
};

module.exports = auth;
