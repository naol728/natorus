exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tour',
  });
};
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
  });
};
