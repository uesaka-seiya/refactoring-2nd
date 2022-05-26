import type { Invoice, Play } from './types';

export function statement(invoice: Invoice, plays: { [playID: string]: Play }): string {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let performance of invoice.performances) {
    const play = plays[performance.playID];
    let thisAmount = 0;

    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000;
        if (performance.audience > 30) {
          thisAmount += 1000 * (performance.audience - 30);
        }
        break;
      case 'comedy':
        thisAmount = 30000;
        if (performance.audience > 20) {
          thisAmount += 300 * performance.audience;
        }
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }

    // ボリューム特典のポイントを加算
    volumeCredits += Math.max(performance.audience - 30, 0);
    // 喜劇のときは10人につき、さらにポイントを加算
    if (play.type === 'comedy') volumeCredits += Math.floor(performance.audience / 5);
    // 注文の内訳を出力
    result += `  ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
    totalAmount += thisAmount;
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}
