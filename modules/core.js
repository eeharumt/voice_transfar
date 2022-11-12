const { Client, Collection } = require("discord.js")
const AudioMixer = require("audio-mixer")

const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  EndBehaviorType,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  StreamType,
  AudioPlayerStatus
} = require("@discordjs/voice")
const prism = require("prism-media")
class Transfer {
  from = null
  to = null
  guilds = {}

  constructor() {
    this.from = new Client({
      intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"]
    })
    this.to = new Client({
      intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"]
    })
    this.from.slash_commands = new Collection()
    this.to.slash_commands = new Collection()
  }

  login = async (from_token, to_token) => {
    this.from.login(from_token)
    this.to.login(to_token)
  }

  connect = (from_ch, to_ch) => {
    from_ch = this.from.channels.cache.get(from_ch.id)
    to_ch = this.to.channels.cache.get(to_ch.id)
    const guild = new Guild(from_ch, to_ch)
    this.guilds[guild.id] = guild
  }

  leave = (guild_id) => {
    if (!(guild_id in this.guilds)) return
    this.guilds[guild_id].leave()
    delete this.guilds[guild_id]
  }
}

class Guild {
  id = ""
  connection = {
    from: null,
    to: null
  }
  volumes = {}
  audioMixer = null

  constructor(from_ch, to_ch) {
    const conn_from = joinVoiceChannel({
      channelId: from_ch.id,
      guildId: from_ch.guild.id,
      adapterCreator: from_ch.guild.voiceAdapterCreator,
      group: from_ch.client.user.id,
      selfDeaf: false
    })
    const conn_to = joinVoiceChannel({
      channelId: to_ch.id,
      guildId: to_ch.guild.id,
      adapterCreator: to_ch.guild.voiceAdapterCreator,
      group: to_ch.client.user.id,
      selfDeaf: false
    })

    if (from_ch.guild.id !== to_ch.guild.id) throw "construct error"
    if (from_ch.id === to_ch.id) throw "construct error"

    this.id = from_ch.guild.id
    this.connection = {
      from: conn_from,
      to: conn_to
    }

    const mixer = new AudioMixer.Mixer({
      channels: 2,
      bitDepth: 16,
      sampleRate: 48000
    })
    this.audioMixer = mixer

    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    })

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.player.stop()
      this.createAudioResource()
    })

    this.createAudioResource()

    this.connection.from.receiver.speaking.on("start", (user) => {
      if (this.audioMixer == null) {
        throw "audioMixer is null"
      } else {
        let stream = this.connection.from.receiver.subscribe(user, {
          end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 100
          }
        })
        let standaloneInput = new AudioMixer.Input({
          channels: 2,
          bitDepth: 16,
          sampleRate: 48000,
          volume: 100
        })
        this.audioMixer.addInput(standaloneInput)
        const decoder = new prism.opus.Decoder({
          rate: 48000,
          channels: 2,
          frameSize: 960
        })
        let p = stream.pipe(decoder).pipe(standaloneInput)
        stream.on("end", () => {
          if (this.audioMixer != null) {
            this.audioMixer.removeInput(standaloneInput)
          }
        })
      }
    })
  }

  createAudioResource = () => {
    this.connection.to.subscribe(this.player)
    this.resource = createAudioResource(
      this.audioMixer.pipe(
        new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 })
      ),
      {
        inputType: StreamType.Opus
      }
    )
    this.player.play(this.resource)
  }

  leave = async () => {
    this.connection.from.disconnect()
    this.connection.to.disconnect()
    this.audioMixer.close()
  }
}

module.exports = {
  Transfer
}
