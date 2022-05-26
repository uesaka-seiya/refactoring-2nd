import { statement } from './statement';
import * as plays from './plays.json';
import invoices = require('./invoices.json');

invoices.forEach((invoice) => {
  console.log(statement(invoice, plays));
});
