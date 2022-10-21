const { User } = require("../models/user");
const mongoose = require("mongoose");
const { Activity, validateActivity } = require("../models/activity");

const createNewActivity = async (req, res) => {
	const { adminId, actionType, action_done, username, grevianceId } = req.body;
	if (!adminId) return res.status(404).json({ message: "adminId is required" });
	if (!mongoose.Types.ObjectId.isValid(adminId))
		return res.status(400).json({ message: "This adminId is not valid" });

	let user = await User.findById(adminId);
	if (!user)
		return res
			.status(404)
			.json({ message: "This user does not exist in our database" });

	const { error } = validateComplaint({
		adminId,
		actionType,
		action_done,
	});

	if (error) return res.status(400).json({ message: error.details[0].message });
	let activity = new Activity(req.body);
	let result = await activity.save();

	res.status(200).json(result);
};

const getAllActivity = async (req, res) => {
	const activities = await Activity.find({});
	return res.status(200).send(activities);
};

module.exports = {
	createNewActivity,
	getAllActivity,
};
