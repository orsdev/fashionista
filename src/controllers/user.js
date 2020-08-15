const { UserClass } = require('../model/user');

exports.postUserInfo = async (req, res) => {
  const user = UserClass.postAddUser(req, res);

  user.save()
    .then((response) => res.send({ message: 'Account created' }))
    .catch((e) => res.status(400).send({ error: e.message }));
};
