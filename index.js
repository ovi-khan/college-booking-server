const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000;


// middlewire
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epqxwgn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const collegeDataCollection = client.db("collegeBookingDB").collection('collegeData')
    const admissionCollection = client.db("collegeBookingDB").collection('admission')

    app.get('/collegeData', async(req, res) => {
        const result = await collegeDataCollection.find().toArray();
        res.send(result)
    })

    app.get('/admission', async(req, res) => {
      const cursor = admissionCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/admission/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await admissionCollection.findOne(query)
      res.send(result)
    })

    app.post('/admission', async(req, res) => {
      const newAdmission = req.body;
      console.log(newAdmission)
      const result = await admissionCollection.insertOne(newAdmission)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req, res) => {
    res.send('Booking is running')
})

app.listen(port, () => {
    console.log(`college booking server is runnin on port ${port}`)
})