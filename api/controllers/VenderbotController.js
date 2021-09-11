/**
 * VenderbotController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


const {JSON} = require('sequelize');
module.exports = {

  link: async (req, res) => {
    // Display the welcome view, setting the view variable
    // named "name" to the value of the user's name.
    //console.log(req.param('companyid'));


    let apiToken = await LineBotChannelApiToken.findOne({
      where: {CompanyId: req.param('companyid')}
    });

    //console.log(JSON.stringify(apiToken))
    if (apiToken != null) {
      console.log(apiToken['channelSecret']);
    }


    //console.log(cc.dataValues)
    return res.json(apiToken);

  }
};



