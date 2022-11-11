# discord_transfer

BOT A transfers audio from the voice channel in which BOT A is joined.
BOT B plays back the transferred voice.

## Requirements

Node v16.9.0+

## Run

Create `config/secrets.js` and set tokens

```
module.exports = {
  from_token: "<BOT_MIC_TOKEN>",
  to_token: "<BOT_SPEAKER_TOKEN>"
}
```

Install dependencies & Run bots

```shell
$ npm install
$ npm run start
```

To start the bot in the current guild, Send `&trans` command in Discord

```
# Join by specifying the channel names argument
&trans [FromChannelName] [ToChannelName]

# Leave channels and end the transfer
&leave
```

<p align="center">
  <i>voice_transfer is licensed under the terms of the MIT license.</i>
</p>
