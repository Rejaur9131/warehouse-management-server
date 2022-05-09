const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.syhej.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const inventoryCollection = client.db('wareHouse').collection('inventoryItem');
    console.log('Connected successfully to server');

    app.get('/inventoryitems', async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const inventoryItems = await cursor.toArray();
      res.send(inventoryItems);
    });

    app.get('/inventoryitems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventoryItem = await inventoryCollection.findOne(query);
      res.send(inventoryItem);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('<h2>WareHouse Management Server</h2>');
});

app.listen(port, () => {
  console.log('Listening to port:', port);
});
