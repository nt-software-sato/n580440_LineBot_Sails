/**
 * Venderbot.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    AutoCounter: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    channelType: {
      type: Sequelize.STRING,
    },
    CompanyId: {
      type: Sequelize.STRING
    },
    liffId: {
      type: Sequelize.STRING
    },
    channelAccessToken: {
      type: Sequelize.STRING
    },
    channelSecret: {
      type: Sequelize.STRING
    },


    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },
  options: {                                  // Options must exists (even if empty) in order to consider this model a Sequelize model
    tableName: 'LineBotChannelApiToken',
    classMethods: {},
    instanceMethods: {},
    hooks: {},
    scopes: {},
    timestamps: false,
    freezeTableName: true,
  },
};

