# jazz-hubot

[jazz-hubot](https://en.wikipedia.org/wiki/Jazz_(Transformers)) is a chat bot built on the [Hubot][hubot] framework. It was
initially generated by [generator-hubot][generator-hubot], and configured to be
deployed on [Heroku][heroku] to get you up and running as quick as possible.

This README is intended to help get you started. Definitely update and improve
to talk about your own instance, how to use and deploy, what functionality is
available, etc!

[heroku]: http://www.heroku.com
[hubot]: http://hubot.github.com
[generator-hubot]: https://github.com/github/generator-hubot

### Redis

If you need to install [Redis](https://redis.io/) locally on your OSX laptop for development and testing, you can follow the instructions in [this blog post](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298).

I have opted to manually start redis as needed with `redis-server /usr/local/etc/redis.conf`. To verify the server is running, I use `redis-cli ping` in another Terminal window.

### Running jazz-hubot Locally

You can test your hubot by running the following, however some plugins will not
behave as expected unless the [environment variables](#configuration) they rely
upon have been set.

Start redis:

    % `redis-server /usr/local/etc/redis.conf`

Start jazz-hubot:

    % bin/hubot

You'll see some start up output and a prompt:

    [Sat Feb 28 2015 12:38:27 GMT+0000 (GMT)] INFO Using default redis on localhost:6379
    jazz-hubot>

Then you can interact with jazz-hubot by typing `jazz-hubot help`.

    jazz-hubot> jazz-hubot help
    jazz-hubot animate me <query> - The same thing as `image me`, except adds [snip]
    jazz-hubot help - Displays all of the help commands that jazz-hubot knows about.
    ...

### Configuration

A few scripts (including some installed by default) require environment
variables to be set as a simple form of configuration.

Each script should have a commented header which contains a "Configuration"
section that explains which values it requires to be placed in which variable.
When you have lots of scripts installed this process can be quite labour
intensive. The following shell command can be used as a stop gap until an
easier way to do this has been implemented.

    grep -o 'hubot-[a-z0-9_-]\+' external-scripts.json | \
      xargs -n1 -I {} sh -c 'sed -n "/^# Configuration/,/^#$/ s/^/{} /p" \
          $(find node_modules/{}/ -name "*.coffee")' | \
        awk -F '#' '{ printf "%-25s %s\n", $1, $2 }'

How to set environment variables will be specific to your operating system.
Rather than recreate the various methods and best practices in achieving this,
it's suggested that you search for a dedicated guide focused on your OS.

### Scripting

An example script is included at `scripts/example.coffee`, so check it out to
get started, along with the [Scripting Guide][scripting-docs].

For many common tasks, there's a good chance someone has already one to do just
the thing.

[scripting-docs]: https://github.com/github/hubot/blob/master/docs/scripting.md

### external-scripts

There will inevitably be functionality that everyone will want. Instead of
writing it yourself, you can use existing plugins.

Hubot is able to load plugins from third-party `npm` packages. This is the
recommended way to add functionality to your hubot. You can get a list of
available hubot plugins on [npmjs.com][npmjs] or by using `npm search`:

    % npm search hubot-scripts panda
    NAME             DESCRIPTION                        AUTHOR DATE       VERSION KEYWORDS
    hubot-pandapanda a hubot script for panda responses =missu 2014-11-30 0.9.2   hubot hubot-scripts panda
    ...


To use a package, check the package's documentation, but in general it is:

1. Use `npm install --save` to add the package to `package.json` and install it
2. Add the package name to `external-scripts.json` as a double quoted string

You can review `external-scripts.json` to see what is included by default.

##### Advanced Usage

It is also possible to define `external-scripts.json` as an object to
explicitly specify which scripts from a package should be included. The example
below, for example, will only activate two of the six available scripts inside
the `hubot-fun` plugin, but all four of those in `hubot-auto-deploy`.

```json
{
  "hubot-fun": [
    "crazy",
    "thanks"
  ],
  "hubot-auto-deploy": "*"
}
```

**Be aware that not all plugins support this usage and will typically fallback
to including all scripts.**

[npmjs]: https://www.npmjs.com

### hubot-scripts

Before hubot plugin packages were adopted, most plugins were held in the
[hubot-scripts][hubot-scripts] package. Some of these plugins have yet to be
migrated to their own packages. They can still be used but the setup is a bit
different.

To enable scripts from the hubot-scripts package, add the script name with
extension as a double quoted string to the `hubot-scripts.json` file in this
repo.

[hubot-scripts]: https://github.com/github/hubot-scripts

## Deployment

    % heroku create --stack cedar
    % git push heroku master


**TODO**

Add information referring to [these docs](https://hubot.github.com/docs/deploying/heroku/) about the the `rediscloud` addon for heroku.

## Slack Variables

Jazz is bot for Slack and a _Bot OAuth Access Token_ is required to run it.
Follow the instructions for _Getting a Slack Token_ on the [Slack Developer Kit for Hubot](https://slack.dev/hubot-slack/)

The bot can be run locally by specifying the token on the command line.

    % HUBOT_SLACK_TOKEN=xoxb-YOUR-TOKEN-HERE ./bin/hubot --adapter slack

A Heroku deployment for this bot will need this value as well.

    % heroku config:set HUBOT_SLACK_TOKEN=xoxb-xoxb-YOUR-TOKEN-HERE

Additionally, `hubot-heroku-keepalive` is specified in `external-scripts.json`, but the package is not installed by default when the hubot is created.

    % npm install hubot-heroku-keepalive --save


### Additional documentation

- [hubot-adapters](https://github.com/github/hubot/blob/master/docs/adapters.md)
- [redistogo]: https://redistogo.com/
