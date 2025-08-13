// server.js - only starts the server
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
