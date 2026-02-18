const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: `no es un correo electrónico válido!`
    },
  },

  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'Debe tener al menos 8 caracteres'],
    select: false
  },

  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: [2, 'Debe tener al menos 2 caracteres'],
    maxlength: 50,
    trim: true
  },

  about: {
    type: String,
    //required: [true, 'La descripción es obligatoria'],
    minlength: [2, 'Debe tener al menos 2 caracteres'],
    maxlength: 200,
    trim: true
  },
  picture: {
    type: String,
    //required: [true, 'El enlace de la foto es obligatorio'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/(www\.)?[a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(v);
      },
      message: props => `${props.value} no es una URL válida!`
    }
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Correo electrónico o contraseña incorrectos'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Correo electrónico o contraseña incorrectos'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);