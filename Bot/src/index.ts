import { Bot } from 'grammy'
import { env } from './config/env.js'
import { registerDebtCommand } from './commands/debt.js'
import { registerPayCommand } from './commands/pay.js'

const bot = new Bot(env.botToken)

bot.command('start', async (ctx) => {
  await ctx.reply(
    [
      'Training center botiga xush kelibsiz!',
      '',
      'Buyruqlar:',
      '/debt — joriy oy qarzdorlari',
      '/pay <studentId> <amount> — to‘lov qilish',
      '',
      'Misollar:',
      '/debt',
      '/pay stu_123 150000',
    ].join('\n'),
  )
})

registerDebtCommand(bot)
registerPayCommand(bot)

bot.catch((error) => {
  console.error('Bot error:', error)
})

bot.start()
console.log('Telegram bot started (Grammy)')
