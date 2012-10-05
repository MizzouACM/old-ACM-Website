exports.index = function(req, res) {
  res.render('home', { title: 'Association for Computing Machinery' });
};
exports.calendar = function(req, res) {
  res.render('page', { title: 'Calendar' });
};
exports.contact = function(req, res) {
  res.render('page', { title: 'Contact' });
};
exports.about = function(req, res) {
  res.render('page', { title: 'About' });
};