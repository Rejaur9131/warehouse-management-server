const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ message: 'Unauthorized access' });
  }
  const token = authHeader?.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).send({ message: 'Access Forbidden' });
    }
    console.log('decoded', decoded);
    req.decoded = decoded;
  });

  next();
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.syhej.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const userCollection = client.db('wareHouse').collection('user');
    console.log('Connected successfully to server');

    // Auth
    app.post('/login', verifyJWT, async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
      });
      res.send({ accessToken });
    });

    app.get('/user', async (req, res) => {
      // const decodedEmail = req.decoded.email;
      const email = req.query.email;

      // if (email === decodedEmail) {
      const query = { email: email };
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
      // } else {
      //   res.status(403).send({ message: 'Access Forbidden' });
      // }
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
