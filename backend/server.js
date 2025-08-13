// server.js - only starts the server
const app = require('./app');

const PORT = process.env.PORT || 5000; // 5000 only for local use
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

