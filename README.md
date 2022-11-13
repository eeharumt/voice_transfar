# discord_transfer

Discord の特定のボイスチャンネルの音声を別チャンネルに転送する BOT です。  
BOT A が参加しているボイスチャンネルの音声転送し、BOT B が再生します。

BOT A transfers audio from the voice channel in which BOT A is joined.  
BOT B plays back the transferred voice.

このボットプログラムは下記プロジェクトを参考・改変したものです。  
https://github.com/suzukey/discord_transfer

## Requirements

Node v16.9.0+

## 起動方法

Discord Developper portal で２つの Bot を作成、
トークンを `config/secrets` を作成し、それぞれ記載。

`config/secrets.js`

```
module.exports = {
  from_token: "<BOT_MIC_TOKEN>",
  to_token: "<BOT_SPEAKER_TOKEN>"
}
```

依存関係をインストールし、起動。

```shell
$ npm install
$ npm run start
```

下記コマンドでチャンネルに Bot を参加させます。  
参加したボットについては Discord 上でドラッグアンドドロップなどで移動させる事ができます。

```
# ボイスチャンネル名を指定して転送元と転送先にボットを参加させる
&trans [FromChannelName] [ToChannelName]

# ボットの切断と転送の終了
&leave
```

<p align="center">
  <i>voice_transfer is licensed under the terms of the <a href="https://github.com/eeharumt/voice_transfar/blob/main/LICENSE">MIT license.</a></i>
</p>
