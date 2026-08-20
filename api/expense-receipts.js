const { handleExpenseReceipts } = require('../lib/expense-receipts');

module.exports = async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  return handleExpenseReceipts(req, res, url);
};
