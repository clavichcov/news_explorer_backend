const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: 'Error en el servidor', error: err }));
}

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'ID de usuario no encontrado' });
      }
      res.send(user);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID de usuario no válido' });
      }
      res.status(500).send({ message: 'Error en el servidor', error: err });
    });
};

module.exports.createUser = (req, res) => {
  const {
    email,
    password,
    name
  } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({
      message: 'El correo electrónico y la contraseña son obligatorios'
    });
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      return User.create({
        email,
        password: hash,
        name
      });
    })
  .then((user) => {
      const userResponse = {
        _id: user._id,
        email: user.email,
        name: user.name
      };
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).json({
          message: 'El correo electrónico ya está registrado'
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Datos de entrada no válidos',
          errors: Object.values(err.errors).map(error => error.message)
        });
      }
      console.error('Error en registro:', err);
      res.status(500).send({ message: 'Error del servidor', error: err });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'El correo electrónico y la contraseña son obligatorios'
    });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
            const token = jwt.sign(
              { _id: user._id },
              process.env.JWT_SECRET,
              { expiresIn: '7d' }
            );
            res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUserMe = (req, res) => {
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
      }
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email
      });
    })
    .catch(err => {
      res.status(500).send({ message: 'Error del servidor' });
    });
}