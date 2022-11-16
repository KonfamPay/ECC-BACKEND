module.exports = async (err, req, res, next) => {
  console.log(err);
  return res
    .status(500)
    .send(err.message || "Internal server error. Something Failed");
};
