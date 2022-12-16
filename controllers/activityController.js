const { User } = require("../models/user");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Activity, validateActivity } = require("../models/activity");

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
	getAllActivity,
	ActivityService,
};
