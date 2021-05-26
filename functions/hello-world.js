const superagent = require('superagent');
exports.handler = async function(context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();
  let inbMsg = event.Body.trim();
  let propObj, firstCell, secondCell, thirdCell;
  let count = (inbMsg.match(/,/g) || []).length; //# of commas means # columns sent
  switch(count) {
    case 0: 
      firstCell = inbMsg;
      propObj = {
        "Name": [
          {
            "text": {
              "content": `${firstCell}`
            }
          }
        ]
      }
      break;
    case 1: //1 comma = 2 columns
      firstCell = inbMsg.split(',')[0];
      secondCell = inbMsg.split(',')[1];
      propObj = {
        "Name": [
          {
            "text": {
              "content": `${firstCell}`
            }
          }
        ],
        "Where": [
          {
            "text": {
              "content": `${secondCell}`
            }
          }
        ],
      }
      break;
    case 2: //2 commas, 3 columns
      firstCell = inbMsg.split(',')[0];
      secondCell = inbMsg.split(',')[1];
      thirdCell = inbMsg.split(',')[2];
      propObj = {
        "Name": [
          {
            "text": {
              "content": `${firstCell}`
            }
          }
        ],
        "Where": [
          {
            "text": {
              "content": `${secondCell}`
            }
          }
        ],
        "Price": [
          {
            "text": {
              "content": `${thirdCell}`
            }
          }
        ]
      }
      break;
  }
    
  superagent.post(`https://api.notion.com/v1/pages`, 
  { "parent": { 
    "database_id": `dcfc26d4074241628beace35c8ecde9e`
  }, "properties": propObj
})
  .set('Authorization', `Bearer ${context.NOTION_API_KEY}`)
  .set('Content-Type', 'application/json')
  .set('Notion-Version', '2021-05-13')
  .end((err, res) => {
    twiml.message(`posted ${inbMsg} to the Notion page!`);
    callback(null, twiml);
  });
};

