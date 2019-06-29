// Description:
//   tell people not to use here in certain rooms.
//
// Configuration:
//   None.
//
// Commands:
//   hubot hears a callout to @everyone, @channel, @here or @all and yells at the offender
//
// Author:
//   jangie

const WHITELIST = new Set([
  'someones_handle',
  'someone_elses_handle'
]);

module.exports = function (robot) {
  robot.hear(/@(?:here|all|channel|everyone)(?:$| )/, (msg) => {
    let roomId = msg && msg.message && msg.message.room || '';
    let roomInfo = robot.adapter.client.rtm.dataStore.getChannelGroupOrDMById(roomId);
    let roomName = roomInfo.name;
    let isShoutingOkInThisRoom = true;
    let shoutdownResponse = 'Please do not use [@]everyone, [@]channel, [@]all, or [@]here in this room.';

    if (roomName.toUpperCase() === 'DevOps'.toUpperCase() || roomName.toUpperCase() === 'TESTNOSHOUTING') {
      if (WHITELIST.has(msg.envelope.user.slack.profile.display_name)) {
        return;
      }
      isShoutingOkInThisRoom = false;
      shoutdownResponse += ' Please ping the oncall instead. To determine the oncall, say "@otto oncall"';
    }

    if (!isShoutingOkInThisRoom) {
      msg.send(shoutdownResponse);
    }
  });
};
