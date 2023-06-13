const { StatusCodes } = require("http-status-codes");

const deleteOneDocument = (Model) => async (req, res) => {
  try {
    // Check if tour exists
    const foundDocument = await Model.findByIdAndDelete(req.params.id);

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
    // If error oocurs delteting tour send response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Something went wrong trying to delete your tour. Please try again later.",
    });
  }
};
module.exports = { deleteOneDocument };
