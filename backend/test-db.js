const mongoose = require('mongoose');

const uri = 'mongodb+srv://kalikayavarshini99_db_user:UDZYFbpBxPFvv9kD@cluster0.i7t7u52.mongodb.net/plasticloop?retryWrites=true&w=majority';

console.log('[Test DB Script]: Attempting connection to MongoDB Atlas...');
console.log('[Test DB URI]:', uri.replace(/UDZYFbpBxPFvv9kD/, '****'));

mongoose.connect(uri)
  .then((conn) => {
    console.log(`✅ [MongoDB Atlas Connection SUCCESSFUL!]: Host=${conn.connection.host}, Database=${conn.connection.name}`);
    return conn.connection.db.admin().ping();
  })
  .then((pingResult) => {
    console.log('✅ [Ping Test]: Success', pingResult);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ [MongoDB Connection Failure]:', err);
    process.exit(1);
  });
