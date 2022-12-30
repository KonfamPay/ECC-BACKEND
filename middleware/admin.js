const jwt = require("jsonwebtoken");

const leadAdmin = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new UnauthenticatedError("Authentication invalid");
	}
	const token = authHeader.split(" ")[1];
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
		throw new Error("Authentication invalid");
	}
};

const admin = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new Error("Authentication invalid");
	}
	const token = authHeader.split(" ")[1];
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
		console.log(error)
		throw new Error("Authentication invalid");
	}
};

module.exports = {
	leadAdmin,
	admin,
};
