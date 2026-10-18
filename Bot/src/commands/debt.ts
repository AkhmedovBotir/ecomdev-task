import type { Bot } from 'grammy'
import { fetchDebtors } from '../api/client.js'

function currentMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('uz-UZ')
}

export function registerDebtCommand(bot: Bot): void {
  bot.command('debt', async (ctx) => {
    const month = currentMonth()

    try {
      const debtors = await fetchDebtors(month)

      if (debtors.length === 0) {
        await ctx.reply("Qarzdorlar yo'q")
        return
      }

      const lines = debtors.map((d, index) => {
        const id = d.studentId || '—'
        return `${index + 1}. ${d.name}\n   Qarz: ${formatAmount(d.debt)}\n   ID: ${id}`
      })

      await ctx.reply(
        `Qarzdorlar (${month}):\n\n${lines.join('\n\n')}`,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Xatolik yuz berdi'
      await ctx.reply(`Xatolik: ${message}`)
    }
  })
}
