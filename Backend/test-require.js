try {
  require('./controllers/user.controller');
  require('./middlewares/auth.middleware');
  console.log('OK');
} catch (e) {
  console.error(e);
  process.exit(1);
}
