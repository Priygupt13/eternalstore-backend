module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("files", {
      id: {
        // UUID is used for id
        type: Sequelize.STRING,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      }
    });
  
    return File;
  };