module.exports.connections = {
  default: {
    user: 'sa',
    password: 'New@type',
    database: 'n580440__CallCenter',
    dialect: 'mssql',
    options: {
      dialect: 'mssql',
      host: 'localhost',
      port: 1433,
      logging: console.log        // or specify sails log level to use ('info', 'warn', 'verbose', etc)
    }
  }
};
