// Description:
//   Huskeyme
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot husky me - Receive a husky
//   hubot husky bomb N - get N huskies
//
// Author:
//   alexgodin with modifications from jctaveras

module.exports = function (robot) {

  robot.respond(/husky me/i, msg => msg.http('https://dog.ceo/api/breed/husky/images/random')
    .get()((err, res, body) => msg.send(JSON.parse(body).message))
  );
  robot.respond(/husky bomb( (\d+))?/i, function (msg) {
    let count = msg.match[2] || 5;
    count = count > 10 ? 10 : count;
    msg.http(`https://dog.ceo/api/breed/husky/images/random/${count}`)
      .get()((err, res, body) => Array.from(JSON.parse(body).message).forEach(husky => msg.send(husky)));
  });
};
