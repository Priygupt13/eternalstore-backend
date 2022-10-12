module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      id: {
        // UUID is used for id
        type: Sequelize.STRING,
        primaryKey: true
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };