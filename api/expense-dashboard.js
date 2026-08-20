const { handleExpenseDashboard } = require('../lib/expense-dashboard');

module.exports = async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  return handleExpenseDashboard(req, res, url);
};
