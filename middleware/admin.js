const jwt = require("jsonwebtoken");

const cookieExtractor = (req, res, next) => {
	let token = null;
	if (req && req.cookies) token = req.cookies["api-auth"];
	return token;
};

const leadAdmin = async (req, res, next) => {
	let token = cookieExtractor(req, res, next);
	if (!token || !token.startsWith("Bearer")) {
		throw new Error("Authentication ddinvalid");
	}
	token = token.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		if (payload.role !== "Lead-admin") {
			throw new Error("Authentication invalid");
		}
		req.admin = {
			adminId: payload.adminId,
			name: payload.name,
			email: payload.email,
			role: payload.role,
		};
		next();
	} catch (error) {
		throw new Error("Could not authenticate admin");
	}
};

const admin = async (req, res, next) => {
	let token = cookieExtractor(req, res, next);
	if (!token || !token.startsWith("Bearer")) {
		throw new Error("Authentication ddinvalid");
	}
	token = token.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		if (payload.role !== "Admin" && payload.role !== "Lead-admin") {
			throw new Error("Authentication invalid");
		}
		req.admin = {
			adminId: payload.adminId,
			name: payload.name,
			email: payload.email,
			role: payload.role,
		};
		next();
	} catch (error) {
		throw new Error("Could not authenticate admin");
	}
};

module.exports = {
	cookieExtractor,
	leadAdmin,
	admin,
};
