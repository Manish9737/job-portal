exports.index = (req, res) => {
  res.render('index', {title: "Welcome to Job-Portal."})
};

exports.gpay = (req, res) => {
  res.render('gpay')
};
