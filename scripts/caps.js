// Description:
//   Respond to all-caps comments with a random all-caps comment.
//   Basically allows the robot to pass the Turing test.
//
// Dependencies:
//   redis-brain.coffee
//
// Configuration:
//   None.
//
// Commands:
//   hubot hears something in ALL CAPS, responds with a random ALL CAPS phrase he's heard before.
//
// Author:
//   ericqweinstein

const MarkovChain = require('markovchain');

module.exports = function (robot) {
  const MAX_ARRAY_LENGTH = 50;
  const MAX_MARKOV_CHAIN_LENGTH = 20;

  const chain = new MarkovChain();

  robot.brain.on('connected', () => {
    if (robot.brain.data.capsPhrases) {
      robot.brain.data.capsPhrases.forEach(phrase => chain.parse(phrase));
    }
  });

  // Be explicit about what ALL CAPS means:
  // Acceptable phrases start with an uppercase letter and include no lowercase letters
  robot.hear(/(^[A-Z][^a-z]+$)/, (msg) => {
    let phrase = msg.match[1];

    if (!robot.brain.data.capsPhrases) {
      robot.brain.data.capsPhrases = [];
    }

    // Allow deletion of accidental, stupid, NSFW, &c phrases
    if (phrase.match(/^DELETE\s[A-Z]+/)) {
      let index = robot.brain.data.capsPhrases.indexOf(phrase.replace('DELETE ', ''));

      if (index > -1) {
        msg.send(`Deleted: '${robot.brain.data.capsPhrases.splice(index, 1)}'`);
      }
    } else if (phrase.match(/[A-Z]+-\d+/)) {
      // Looks like a Jira ticket
    } else {
      // TODO: Ignoring comments in private rooms has never been supported
      // in Slack. Should we support it?

      // No dupes
      if (!robot.brain.data.capsPhrases.indexOf(phrase) > -1) {
        robot.brain.data.capsPhrases.push(phrase);
        chain.parse(phrase);
      }

      // Don't hold on to too many phrases
      if (robot.brain.data.capsPhrases.length > MAX_ARRAY_LENGTH) {
        robot.brain.data.capsPhrases.shift();
      }

      if (phrase.match(/[!?.]\s*$/)) {
        const phraseLength = Math.floor(Math.random() * Math.floor(MAX_MARKOV_CHAIN_LENGTH));
        const markovMessage = chain.end(phraseLength).process();
        msg.send(markovMessage.length > 0 ? markovMessage : msg.random(robot.brain.data.capsPhrases));
      } else {
        msg.send(msg.random(robot.brain.data.capsPhrases));
      }
    }
  });
};
