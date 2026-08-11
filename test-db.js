const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://hr_user:hr_password@127.0.0.1:5433/hr_db?schema=public'
});
client.connect()
  .then(() => {
    console.log('Connected!');
    client.end();
  })
  .catch(err => console.error('Connection error', err.stack));
