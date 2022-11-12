const transfer = require("./modules/core")
const secrets = require("./config/secrets")
const config = require("./config/settings")

const clients = new transfer.Transfer()

const init = async () => {
  clients.login(secrets.from_token, secrets.to_token)
}

clients.from.once("ready", () => {
  console.log(`transfer_from: ${clients.from.user.tag} on ready`)
})

clients.to.once("ready", () => {
  console.log(`transfer_to: ${clients.to.user.tag} on ready`)
})

clients.from.on("messageCreate", async (message) => {
  if (message.content.indexOf(config.prefix) !== 0) return

  const command_extraction = message.content.slice(config.prefix.length).trim()
  const args = command_extraction.split(/ +/g)
  const command = args.shift().toLowerCase()

  if (command === "trans" || command === "transfer") {
    require("./commands/transfer")(clients, message, args)
  }

  if (command == "leave") {
    clients.leave(message.guild.id)
  }./commands/command
})

init()
