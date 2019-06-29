// Description:
//   Corgime
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot corgi me - Receive a corgi
//   hubot corgi bomb N - get N corgis
//
// Author:
//   alexgodin with modifications from eduardoveras

module.exports = function (robot) {

  robot.respond(/corgi me/i, msg => msg.http('https://corginator.herokuapp.com/random')
    .get()((err, res, body) => msg.send(JSON.parse(body).corgi))
  );
  robot.respond(/corgi bomb( (\d+))?/i, function (msg) {
    let count = msg.match[2] || 5;
    count = count > 50 ? 50 : count;
    msg.http(`https://corginator.herokuapp.com/bomb?count=${count}`)
      .get()((err, res, body) => Array.from(JSON.parse(body).corgis).map(corgi => msg.send(corgi)));
  });
};
