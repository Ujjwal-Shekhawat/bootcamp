const advancedQuerying = (model, populate) => async (req, res, next) => {
  try {
    const removeFeilds = ['select', 'sort', 'page', 'limit'];
    const req_query = { ...req.query };
    removeFeilds.forEach((param) => delete req_query[param]);

    let query = JSON.stringify(req_query);

    query = query.replace(/\b(lt|lte|gt|gte|in)\b/g, (match) => `$${match}`);
    let result = model.find(JSON.parse(query));
    // Selecting specific feilds
    if (req.query.select) {
      const feilds = req.query.select.split(',').join(' ');
      result = result.select(feilds);
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      result = result.sort(sortBy);
    } else {
      result = result.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const start = (page - 1) * limit;
    const end = page * limit;
    const total = await model.countDocuments();

    result = result.skip(start).limit(limit);

    if (populate) {
      result.populate(populate);
    }

    const modelresults = await result;

    let pagination = {};

    if (end < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (start > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.advancedQuerying = {
      message: 'Hello from advanced filtering and querying middleware',
      count: modelresults.length,
      pagination: pagination,
      data: modelresults,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = advancedQuerying;
