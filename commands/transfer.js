const command = async (clients, message, args) => {
  const channels = message.guild.channels.cache
  const voice_channels = channels.filter((channel) => channel.type === 2)

  if (voice_channels.length < 2) {
    message.channel.send("error: Requires at least two voice channels")
    return
  }

  let targets = null
  if (args.length === 2) {
    targets = await select_channels_by_name(message, voice_channels, args[0], args[1])
  }

  if (!targets) {
    return
  }

  const { from_ch, to_ch } = targets

  clients.connect(from_ch, to_ch)
  message.channel.send(`Transfer voice from \`${from_ch.name}\` to \`${to_ch.name}\``)
}

const select_channels_by_name = async (
  message,
  voice_channels,
  target_from_name,
  target_to_name
) => {
  const from_ch = voice_channels.find((channel) => channel.name === target_from_name)
  if (!from_ch) {
    message.channel.send("error: From channel is not exist")
    return
  }
  const remain_vc = voice_channels.filter((channel) => channel !== from_ch)
  const to_ch = remain_vc.find((channel) => channel.name === target_to_name)
  if (!to_ch) {
    message.channel.send("error: To channel is not exist")
    return
  }

  return { from_ch, to_ch }
}

module.exports = command
