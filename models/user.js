
// Definicion de la clase User:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User',
      { login: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: { msg: "El campo login no puede estar vacio" }
            }
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: { msg: "El campo nombre no puede estar vacio" }
            }
        },
        email: {
            type: DataTypes.TEXT,
            validate: {
                isEmail: { msg: "El formato del email introducido no es correcto" },
                notEmpty: { msg: "El campo email no puede estar vacio" }
            }
        },
        hashed_password: {
            type: DataTypes.STRING
        },
        salt: {
            type: DataTypes.STRING
        }
    });
}
