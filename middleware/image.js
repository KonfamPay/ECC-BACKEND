const cloudinary = require("../utils/cloudinary");
const BadRequestError = require("../errors/bad-request");
const fs = require("fs");

const uploadDocument = async (req, res, next) => {
	try {
		if (req.files) {
			const file = req.files.myFile;
			const upload = await cloudinary.uploader.upload(file.tempFilePath, {
				public_id: `${Date.now()}`,
				resource_type: "auto",
				folder: "images",
			});
			fs.unlinkSync(file.tempFilePath);
			req.upload = {
				public_id: upload.public_id,
				url: upload.url,
			};
		} else {
			req.upload = {
				public_id: null,
				url: null,
			};
		}
		next();
	} catch (err) {
		throw new BadRequestError("Failed to upload the image");
	}
};

const deleteDocument = async (req, res, next) => {
	try {
		const result = await cloudinary.uploader.destroy(req.body.public_id);
		req.delete = result;
		next();
	} catch (err) {
		throw new Error({ message: "Failed to delete the image" });
	}
};
module.exports = { uploadDocument, deleteDocument };
