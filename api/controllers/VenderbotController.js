/**
 * VenderbotController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
'use strict';




module.exports = {
  link: async (req, res) => {

    let apiToken = await LineBotChannelApiToken.findOne({
      where: {CompanyId: req.param('companyid')}
    });

//console.log(JSON.stringify(apiToken))
    if (apiToken != null) {
      console.log(apiToken['channelSecret']);
    }




    // require('dotenv').config();
// const config = process.env;
    const line = require('@line/bot-sdk');

    const {WebhookEvent, validateSignature} = require('@line/bot-sdk');

    const client = new line.Client({
      'channelSecret': apiToken['channelSecret'],
      'channelAccessToken': apiToken['channelAccessToken']
    });


    const axios = require('axios');
    const cryptoRandomString = await import('crypto-random-string');//ESM obj


    const lineRequest = axios.create({
      baseURL: 'https://api.line.me/v2/bot',
      headers: {'Authorization': `Bearer ${apiToken['channelAccessToken']}`}
    });
    const accAuthRequest = axios.create({
      baseURL: 'http://tps-demo.newtype.com.tw/52279/line/p/',

    });


//     router.post('/', line.middleware(g_config.VenderBot), (req, res) => {
//       Promise
//         .all(req.body.events.map(HandleEvent))
//         .then((result) => res.json(result))
//         .catch((err) => {
//           console.error(err);
//           res.status(400).end();
//         });
//     });

    const GetLinktoken = async (uid) => {
      return lineRequest.post(`user/${uid}/linkToken`, {})
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          let lineLinkToken = data.linkToken;
          return lineLinkToken;
        })
        .catch((err) => {
          console.log(err);
          console.error(g_config.VenderBot.channelAccessToke);
        });
    };

    const GetUserInfo = async (uid) => {
      return accAuthRequest.get(`/signin/${uid}`, {})
        .then(res => res.data.o)
        .then(data => {
          // console.warn("////////")
          // console.log(data)
          return JSON.parse(JSON.stringify(data[0]));
        });
    };

// event handler
    const HandleEvent = async (event) => {
      console.log(event);
      let replyMsg = {};

      if (event.type == 'accountLink') {
        // if(event.link.result=='ok'){
        let lineUserId = event.source.userId;
        let linkNonce = event.link.nonce;

        lineRequest.post(`user/${lineUserId}/richmenu/${g_config.VenderBot.RichMenu_AfterLogin}`, {})
          .then((res) => {
          })
          .catch((err) => {
            console.log(err);
          });

        replyMsg = {type: 'text', text: `新人類資訊TOPServices維修商\n帳號綁定成功!!`};
        return client.replyMessage(event.replyToken, replyMsg);
        // }


      } else if (event.type == 'postback') {
        let postData = event.postback.data;
        let lineUserId = event.source.userId;
        replyMsg = {type: 'text', text: postData};

        switch (postData) {

          case 'action=accountSetting':
            replyMsg = {
              'type': 'flex',
              'altText': '帳號設定',
              'contents': {
                'type': 'bubble',
                'header': {
                  'type': 'box',
                  'layout': 'horizontal',
                  'contents': [{'type': 'text', 'text': '帳號設定', 'size': 'sm', 'weight': 'bold', 'color': '#000000'}]
                },
                'hero': {
                  'type': 'image',
                  'url': 'https://nwzimg.wezhan.cn/contents/sitefiles2040/10200972/images/16781871.png',
                  'size': 'full',
                  'aspectMode': 'cover',
                  'action': {'type': 'uri', 'label': 'Action', 'uri': 'https://linecorp.com/'}
                },
                'body': {
                  'type': 'box',
                  'layout': 'horizontal',
                  'spacing': 'md',
                  'contents': [{
                    'type': 'box',
                    'layout': 'vertical',
                    'contents': [{
                      'type': 'box',
                      'layout': 'horizontal',
                      'contents': [{
                        'type': 'button',
                        'action': {'type': 'postback', 'label': '查詢帳號資訊', 'data': 'action=queryAccountInfo'}
                      }]
                    }, {
                      'type': 'box',
                      'layout': 'horizontal',
                      'contents': [{
                        'type': 'button',
                        'action': {'type': 'postback', 'label': '解除綁定LINE帳號', 'data': 'action=unbind'}
                      }]
                    }]
                  }]
                }
              }
            };
            break;

          case 'action=unbind':
            replyMsg = {
              'type': 'flex',
              'altText': '確定刪除綁定？',
              'contents': {
                'type': 'bubble',
                'header': {
                  'type': 'box',
                  'layout': 'horizontal',
                  'contents': [{
                    'type': 'text',
                    'text': '確定刪除LINE帳號綁定?',
                    'size': 'lg',
                    'weight': 'bold',
                    'color': '#000000'
                  }]
                },
                'body': {
                  'type': 'box',
                  'layout': 'horizontal',
                  'spacing': 'md',
                  'contents': [{
                    'type': 'box',
                    'layout': 'vertical',
                    'contents': [{'type': 'text', 'text': '您將無法繼續接收LINE通知', 'size': 'sm', 'color': '#FF7B7B'}]
                  }]
                },
                'footer': {
                  'type': 'box',
                  'layout': 'horizontal',
                  'contents': [{
                    'type': 'box',
                    'layout': 'vertical',
                    'contents': [{
                      'type': 'button',
                      'action': {'type': 'postback', 'label': '刪除綁定', 'data': 'action=unbind&confirm=true'},
                      'color': '#FF0000',
                      'margin': 'xxl',
                      'style': 'primary'
                    }, {
                      'type': 'button',
                      'action': {'type': 'postback', 'label': '再想想', 'data': 'action=unbind&confirm=false'},
                      'margin': 'xxl',
                      'style': 'primary'
                    }]
                  }]
                }
              }
            };
            break;

          case 'action=unbind&confirm=true':
            accAuthRequest.patch(`/unbind/${lineUserId}`, {})
              .then((data) => {
                console.log(data);
              })
              .catch((err) => {
                console.log(err);
              });

            lineRequest.delete(`/user/${lineUserId}/richmenu`, {})
              .then((res) => {
                res.data;
              })
              .catch((err) => {
                console.log(err);
              });

            replyMsg = {type: 'text', text: '刪除綁定成功!!'};
            break;

          case 'action=unbind&confirm=false':
            replyMsg = {type: 'text', text: '感謝繼續使用TOPServices LINE通知服務'};
            break;

          case 'action=queryAccountInfo':
            //.catch((err) => { console.log(err); })
            let userInfo = await GetUserInfo(lineUserId);
            replyMsg = {
              'type': 'flex', 'altText': '綁定LINE通知', 'contents': {
                'type': 'bubble',
                'hero': {
                  'type': 'image',
                  'url': 'https://nwzimg.wezhan.cn/contents/sitefiles2040/10200972/images/16781871.png',
                  'size': 'full',
                  'aspectMode': 'cover',
                  'action': {'type': 'uri', 'label': 'Action', 'uri': 'https://linecorp.com/'}
                },
                'body': {
                  'type': 'box',
                  'layout': 'vertical',
                  'spacing': 'md',
                  'contents': [{
                    'type': 'text',
                    'text': '綁定帳號資訊',
                    'size': 'xl',
                    'gravity': 'center',
                    'weight': 'bold'
                  }, {
                    'type': 'box',
                    'layout': 'vertical',
                    'spacing': 'sm',
                    'margin': 'lg',
                    'contents': [{
                      'type': 'box',
                      'layout': 'baseline',
                      'spacing': 'sm',
                      'contents': [{
                        'type': 'text',
                        'text': '登入帳號',
                        'flex': 0,
                        'size': 'sm',
                        'color': '#000000'
                      }, {
                        'type': 'text',
                        'text': `${userInfo.Id}`,
                        'flex': 4,
                        'size': 'sm',
                        'align': 'end',
                        'weight': 'bold',
                        'color': '#118AA3',
                        'wrap': true
                      }]
                    }, {
                      'type': 'box',
                      'layout': 'baseline',
                      'spacing': 'sm',
                      'contents': [{
                        'type': 'text',
                        'text': '登入名稱',
                        'flex': 0,
                        'size': 'sm',
                        'color': '#000000'
                      }, {
                        'type': 'text',
                        'text': `${userInfo.Name}`,
                        'size': 'sm',
                        'align': 'end',
                        'weight': 'bold',
                        'color': '#118AA3',
                        'wrap': true
                      }]
                    }, {'type': 'separator'}, {
                      'type': 'box',
                      'layout': 'baseline',
                      'contents': [{
                        'type': 'text',
                        'text': '公司名稱',
                        'flex': 0,
                        'size': 'sm',
                        'color': '#000000'
                      }, {
                        'type': 'text',
                        'text': `${userInfo.CompanyName}`,
                        'flex': 4,
                        'size': 'sm',
                        'align': 'end',
                        'weight': 'bold',
                        'color': '#118AA3',
                        'wrap': true
                      }]
                    }, {
                      'type': 'box',
                      'layout': 'baseline',
                      'contents': [{'type': 'text', 'text': '單位名稱', 'flex': 0, 'size': 'sm'}, {
                        'type': 'text',
                        'text': `${userInfo.Unit}`,
                        'size': 'sm',
                        'align': 'end',
                        'weight': 'bold',
                        'color': '#118AA3'
                      }]
                    }]
                  }]
                },
                'footer': {
                  'type': 'box',
                  'layout': 'horizontal',
                  'flex': 1,
                  'contents': [{'type': 'spacer'}, {'type': 'spacer'}]
                }
              }
            };
            break;

        }
        return client.replyMessage(event.replyToken, replyMsg);
      } else if (event.type == 'message' && event.message.type == 'text') {
        let msgText = event.message.text;
        let userId = event.source.userId;
        let replyMsg = {};
        switch (msgText) {

          case '綁定LINE通知':
            let result = await GetLinktoken(userId);
            let randomKey = cryptoRandomString({length: 255, type: 'url-safe'});
            Model.SecureToken.create({Token: randomKey, UserLineId: userId});

            replyMsg = {
              'type': 'flex', 'altText': '綁定LINE通知', 'contents': {
                'type': 'bubble',
                'header': {
                  'type': 'box',
                  'layout': 'horizontal',
                  'contents': [{
                    'type': 'text',
                    'text': '開始綁定 LINE 帳號',
                    'size': 'sm',
                    'weight': 'bold',
                    'color': '#000000'
                  }]
                },
                'hero': {
                  'type': 'image',
                  'url': 'https://nwzimg.wezhan.cn/contents/sitefiles2040/10200972/images/16781871.png',
                  'size': 'full',
                  'aspectMode': 'cover',
                  'action': {'type': 'uri', 'label': 'Action', 'uri': 'https://linecorp.com/'}
                },
                'body': {
                  'type': 'box',
                  'layout': 'horizontal',
                  'spacing': 'md',
                  'contents': [{
                    'type': 'box',
                    'layout': 'vertical',
                    'contents': [{
                      'type': 'box',
                      'layout': 'vertical',
                      'contents': [{'type': 'spacer', 'size': 'lg'}]
                    }, {
                      'type': 'box',
                      'layout': 'vertical',
                      'contents': [{
                        'type': 'button',
                        'action': {
                          'type': 'uri',
                          'label': '開始綁定',
                          'uri': `${g_config.hostURL}/Static/Vender/LineLogin.html?token=${randomKey}&token2=${result}`
                        },
                        'color': '#19BF00',
                        'style': 'primary'
                      }]
                    }, {
                      'type': 'box',
                      'layout': 'vertical',
                      'contents': [{'type': 'spacer', 'size': 'xl'}, {
                        'type': 'text',
                        'text': '綁定連結5分鐘有效',
                        'size': 'xs',
                        'align': 'center',
                        'color': '#AFAFAF'
                      }]
                    }]
                  }]
                }
              }
            };
            console.log(`${g_config.hostURL}/Static/Vender/LineLogin.html?token=${randomKey}&token2=${result}`);
            break;//帳號綁定
          default:
            replyMsg = {type: 'text', text: `機器人不知道"${event.message.text}" 這是甚麼意思?`};
            //replyMsg = { "type": "flex", "altText": "Flex Message", "contents": { "type": "bubble", "body": { "type": "box", "layout": "vertical", "spacing": "md", "action": { "type": "uri", "label": "Action", "uri": "https://linecorp.com" }, "contents": [{ "type": "text", "text": "案件處裡通知", "size": "xl", "align": "start", "weight": "bold" }, { "type": "text", "text": "『x月x日』", "size": "xs", "align": "start", "color": "#AEAEAE" }, { "type": "text", "text": "以下案件請盡快與相關單位聯繫處裡，謝謝!", "size": "xs", "color": "#8A8A8A" }, { "type": "box", "layout": "vertical", "spacing": "sm", "contents": [{ "type": "box", "layout": "baseline", "contents": [{ "type": "text", "text": "客戶名稱", "flex": 0, "weight": "bold" }, { "type": "text", "text": "『客戶名稱測試測試』", "align": "end", "weight": "bold", "color": "#118AA3" }] }, { "type": "box", "layout": "baseline", "contents": [{ "type": "text", "text": "單位名稱", "flex": 0, "weight": "bold" }, { "type": "text", "text": "『單位名稱測試測試』", "align": "end", "weight": "bold", "color": "#118AA3" }] }, { "type": "box", "layout": "baseline", "contents": [{ "type": "text", "text": "報修單號", "flex": 0, "weight": "bold" }, { "type": "text", "text": "『報修單號測試測試』", "align": "end", "weight": "bold", "color": "#118AA3" }] }, { "type": "box", "layout": "baseline", "contents": [{ "type": "text", "text": "報修品項", "flex": 0, "weight": "bold" }, { "type": "text", "text": "『報修品項測試測試』", "align": "end", "weight": "bold", "color": "#118AA3" }] }, { "type": "box", "layout": "baseline", "contents": [{ "type": "text", "text": "要求時效", "flex": 0, "weight": "bold" }, { "type": "text", "text": "『要求時效測試測試』", "align": "end", "weight": "bold", "color": "#118AA3" }] }, { "type": "box", "layout": "vertical", "contents": [{ "type": "spacer" }, { "type": "text", "text": "點擊 ＂詳情＂ 查看案件詳情", "size": "xs", "color": "#AEAEAE" }, { "type": "text", "text": "如有疑問請聯繫580440報修中心", "size": "xs", "color": "#AEAEAE" }] }] }] }, "footer": { "type": "box", "layout": "vertical", "contents": [{ "type": "spacer", "size": "xxl" }, { "type": "button", "action": { "type": "uri", "label": "詳情", "uri": "https://www.example.com/SSOURL?" }, "color": "#118AA3", "style": "primary" }] } } };
            break;//default
        }//switch

        if (event.replyToken != '00000000000000000000000000000000' && event.replyToken != 'fffffffffffffffffffffffffffffff') {  //ignore invaild id
          return client.replyMessage(event.replyToken, replyMsg);
        }
      } else {
        return Promise.resolve(null);
      }
    };

    let isVaildLINEServer=validateSignature(JSON.stringify(req.body), apiToken['channelSecret'], req.headers['x-line-signature'])

    // console.log(req.body.events)
    if (isVaildLINEServer) {
      console.log('validateSignature_OK');


      console.log(req.body);
      Promise
        .all(req.body.events.map(HandleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
          console.error(err);
          res.status(400).end();
        });

    }

  }
};




