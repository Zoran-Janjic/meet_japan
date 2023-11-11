const isUserGuide = (tourData, userId) => {
  return tourData.guides.some((guide) => guide.id === userId);
};

module.exports = { isUserGuide };
