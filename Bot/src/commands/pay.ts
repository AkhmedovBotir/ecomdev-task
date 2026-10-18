import type { Bot } from 'grammy'
import { createPayment } from '../api/client.js'

export function registerPayCommand(bot: Bot): void {
  bot.command('pay', async (ctx) => {
    const text = ctx.message?.text ?? ''
    const parts = text.trim().split(/\s+/).slice(1)

    if (parts.length < 2) {
      await ctx.reply(
        'Foydalanish: /pay <studentId> <amount>\nMasalan: /pay stu_123 150000',
      )
      return
    }

    const [studentId, amountRaw] = parts
    const amount = Number(amountRaw)

    if (!studentId) {
      await ctx.reply('studentId majburiy.')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      await ctx.reply('amount musbat son bo‘lishi kerak.')
      return
    }

    const result = await createPayment({ studentId, amount })

    if (!result.ok) {
      await ctx.reply(`Xatolik: ${result.message}`)
      return
    }

    await ctx.reply(
      `To‘lov qabul qilindi.\nStudent ID: ${studentId}\nSumma: ${amount.toLocaleString('uz-UZ')}`,
    )
  })
}
