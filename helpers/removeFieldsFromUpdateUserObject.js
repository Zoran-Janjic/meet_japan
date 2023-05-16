const filterUpdateUserObject = (obj, fieldsToRemove) => {
  const allowedFields = { ...obj };

  fieldsToRemove.forEach((field) => {
    delete allowedFields[field];
  });

  return allowedFields;
};
module.exports = filterUpdateUserObject;
