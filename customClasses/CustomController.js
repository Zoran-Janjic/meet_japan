// * We can reuse the class for any controller in the project

class CustomController {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // ? Get filters if specified
    const queryObj = { ...this.queryString };

    // ? Exclude from filter and delete it from the query object
    const excludedFields = ["page", "sort", "limit", "fields"];
    // ? Remove the excluded fields from the query object
    excludedFields.forEach((field) => {
      delete queryObj[field];
    });

    // * Step 1 Advanced filtering
    // ? regular expression to search for any occurrence of the filtering operators
    // ? gte, gt, lte, and lt using the \b(gte|gt|lte|lt)\b pattern.
    const queryStep1 = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStep1));
    return this;
  }

  sort() {
    // * Step 2 Sorting the query if the sort is requested
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // ? If not sort provided we add the default one which will sort by the date added
      // ? and will show the newest one first.
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // * Step 3 Limit which fields we want to get back so we can
    // * reduce the bandwidth for the request
    if (this.queryString.fields) {
      const requiredFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(requiredFields);
    } else {
      // ? If no fields are specified than use the default one which remove the following properties
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    // * Step 4 Pagination Allowing the request to specify which page of the results they want
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = CustomController;
