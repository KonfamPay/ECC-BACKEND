const { User } = require("../models/user");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Activity, validateActivity } = require("../models/activity");

const createNewActivitdy = async (req, res) => {
	const { adminId, actionType, actionDone, username, grevianceId } = req.body;
	if (!adminId)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "adminId is required" });
	if (!mongoose.Types.ObjectId.isValid(adminId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This adminId is not valid" });

	let admin = await User.findById(adminId);
	if (!admin)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "This admin does not exist in our database" });
	if (!username || !grevianceId)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "A username or grevianceId is needed" });
	const { error } = validateActivity({
		adminId,
		actionType,
		actionDone,
	});

	if (error)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: error.details[0].message });
	let activity = new Activity(req.body);
	let result = await activity.save();

	res.status(StatusCodes.OK).json({ result });
};

const getAllActivity = async (req, res) => {
	const activities = await Activity.find({});
	return res.status(StatusCodes.OK).send(activities);
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
	createNewActivitdy,
	getAllActivity,
	ActivityService,
};
