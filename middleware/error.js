module.exports = async (err, req, res, next) => {
  return res
    .status(500)
    .send(err.message || "Internal server error. Something Failed");
};
