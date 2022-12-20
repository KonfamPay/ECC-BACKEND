const { User } = require("../models/user");
const { Admin } = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Activity, validateActivity } = require("../models/activity");

const getAllActivity = async (req, res) => {
	const activities = await Activity.find({});
	return res.status(StatusCodes.OK).send(activities);
};

const getActivityByAdmin = async (req, res) => {
	const adminId  = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(adminId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This adminId is not valid" });

	let admin = await Admin.findById(adminId);
	if (!admin)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "This admin does not exist in our database" });

	const activity = await Activity.find({ adminId });
	return res.status(StatusCodes.OK).json({ status: "success", data: activity });
};

class ActivityService {
	static async addActivity(activityPayload) {
		const { error } = validateActivity(activityPayload);
		if (error) throw new Error(error.details[0].message);
		const activity = new Activity(activityPayload);
		return await activity.save();
	}
}

module.exports = {
	getAllActivity,
	ActivityService,
	getActivityByAdmin,
};
