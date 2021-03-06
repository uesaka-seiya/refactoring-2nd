export interface Performance {
  playID: string;
  audience: number;
}

export interface Invoice {
  customer: string;
  performances: Array<Performance>;
}

export interface Play {
  name: string;
  type: string;
}

declare module '*/invoices.json' {
  const value: Invoice[];
  export = value;
}
