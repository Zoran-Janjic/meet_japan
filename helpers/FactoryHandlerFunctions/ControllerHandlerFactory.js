const { StatusCodes } = require("http-status-codes");
const helpers = require("../index");
const CustomController = require("../../customClasses/CustomController");

const deleteOneDocument = (Model, actionType) => async (req, res) => {
  try {
    // Check if tour exists
    const foundDocument = await Model[actionType](req.params.id);

    // If tour does not exist send not found response
    if (!foundDocument) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: `Document with ${req.params.id} does not exist.`,
      });
    }
    // if tour is found and deleted successfully send the deleted tour
    res.json({
      status: StatusCodes.OK,
      message: `Document deleted successfully with ${req.params.id}`,
      deletedDocument: foundDocument,
    });
  } catch {
    // If error occurs deleting tour send response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Something went wrong trying to delete your tour. Please try again later.",
    });
  }
};

const updateDocument = (Model, actionType) => async (req, res) => {
  const updatedDocument = await Model[actionType](req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (updatedDocument) {
    helpers.createHttpResponse(
      res,
      StatusCodes.OK,
      `Document with id ${req.params.id} updated successfully.`,
      "Success",
      updatedDocument
    );
  } else {
    helpers.createHttpResponse(
      res,
      StatusCodes.NOT_FOUND,
      `Failed updating the document with ${req.params.id}`,
      "Failed"
    );
  }
};

const createDocument = (Model, actionType) => async (req, res) => {
  const newDocument = await Model[actionType](req.body);

  if (newDocument) {
    helpers.createHttpResponse(
      res,
      StatusCodes.CREATED,
      `Document with id ${req.params.id} created successfully.`,
      "Success",
      newDocument
    );
  } else {
    helpers.createHttpResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed creating new document, please try again later.",
      "Failed"
    );
  }
};

const getDocument =
  (Model, actionType, populateOptions) => async (req, res) => {
    let query = Model[actionType](req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const foundDocument = await query;

    if (foundDocument) {
      helpers.createHttpResponse(
        res,
        StatusCodes.OK,
        `Document with id ${req.params.id} found successfully.`,
        "Success",
        foundDocument
      );
    } else {
      helpers.createHttpResponse(
        res,
        StatusCodes.NOT_FOUND,
        "Failed finding your document, please try again later.",
        "Failed"
      );
    }
  };

const getAllDocuments = (Model) => async (req, res) => {
  // *  Custom controller that does all the filtering options as we pass to it
  // * The query object and the query string that we receive
  const filteredQueryObject = new CustomController(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // *  Execute the final query and send result
  // ? Add explain(); if you want stats of the query.
  const allDocuments = await filteredQueryObject.query;

  if (allDocuments) {
    helpers.createHttpResponse(
      res,
      StatusCodes.OK,
      `Total documents retrieved: ${allDocuments.length}`,
      "Success",
      allDocuments
    );
  } else {
    helpers.createHttpResponse(
      res,
      StatusCodes.NOT_FOUND,
      "Failed finding your documents, please try again later.",
      "Failed"
    );
  }
};

module.exports = {
  deleteOneDocument,
  updateDocument,
  createDocument,
  getDocument,
  getAllDocuments,
};
