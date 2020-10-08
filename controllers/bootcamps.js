// GET
// public
// get all bootcamps
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ message: `get all bootcamps` });
};

// GET
// public
// get bootcamp by its id
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ message: `get bootcamp by id ${req.params.id}` });
};

// POST
// private
// create bootcamp
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ message: `create a new bootcamp` });
};

// PUT
// private
// update bootcamp by its id
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ message: `update bootcamp with id ${req.params.id}` });
};

// DELETE
// private
// delete bootcamp by its id
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ message: `delete bootcamp with id ${req.params.id}` });
};
