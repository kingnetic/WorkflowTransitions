const data = require('../../db.json');

exports.handler = async function(event, context) {
  if (event.path.endsWith('/transitions')) {
    return {
      statusCode: 200,
      body: JSON.stringify(data.transitions)
    };
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' })
  };
};