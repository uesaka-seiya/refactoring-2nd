import type { Invoice, Play, Performance } from './types';

export function statement(invoice: Invoice, plays: { [playID: string]: Play }): string {
  const playFor = (aPerformance: Performance) => {
    return plays[aPerformance.playID];
  };

  const amountFor = (aPerformance: Performance) => {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 300 * aPerformance.audience;
        }
        break;
      default:
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
  };

  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let performance of invoice.performances) {
    // ボリューム特典のポイントを加算
    volumeCredits += Math.max(performance.audience - 30, 0);
    // 喜劇のときは10人につき、さらにポイントを加算
    if (playFor(performance).type === 'comedy') volumeCredits += Math.floor(performance.audience / 5);
    // 注文の内訳を出力
    result += `  ${playFor(performance).name}: ${format(amountFor(performance) / 100)} (${
      performance.audience
    } seats)\n`;
    totalAmount += amountFor(performance);
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}
