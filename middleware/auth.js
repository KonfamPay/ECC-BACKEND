const jwt = require("jsonwebtoken");
const { cookieExtractor } = require("./admin");

const auth = async (req, res, next) => {
	let token = cookieExtractor(req, res, next);
	if (!token || !token.startsWith("Bearer")) {
		throw new Error("Authentication invalid");
	}
	token = token.split(" ")[1];
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
