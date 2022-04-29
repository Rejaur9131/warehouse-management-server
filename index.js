const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.syhej.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const userCollection = client.db('wareHouse').collection('user');

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('<h2>WareHouse Management Server</h2>');
});

app.get('/user', async (req, res) => {
  const query = {};
  const cursor = userCollection.find({});
  const users = await cursor.toArray();
  res.send(users);
});

// user:wareHouse
// pass hxxF8OuwkMBJHC5C
app.listen(port, () => {
  console.log('Listening to port:', port);
});
