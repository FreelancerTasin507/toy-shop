const express = require("express");
const app = express();
const port = process.env.PORT || 5500;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

// middlewire

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_name}:${process.env.DB_pass}@cluster0.wtgr9ca.mongodb.net/?retryWrites=true&w=majority  `;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)


    const categoryCollections = client
      .db("toy-categories")
      .collection("categories");
    const toyCollection = client.db("toyCollection").collection("Toys");

    app.get("/allToys", async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    });

    app.get("/singleEmail/:email", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const cursor = toyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/getEmail", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }

      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    app.post("/allToys", async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    });

    app.put("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;

      const toy = {
        $set: {
          photo: updatedToy.photo,
          name: updatedToy.name,
          sellerName: updatedToy.sellerName,
          email: updatedToy.email,
          category: updatedToy.category,
          price: updatedToy.price,
          rating: updatedToy.rating,
          quantity: updatedToy.quantity,
          description: updatedToy.description,
        },
      };

      const result = await toyCollection.updateOne(filter, toy, options);
      res.send(result);
    });

    app.delete("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });


    app.get("/categories", async (req, res) => {
      const cursor = categoryCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TOY SHOP SERVER IS RUNNING !! ");
});

app.listen(port, () => {
  console.log(`TOY SHOP IS RUNNIG ON PORT  ${port}`);
});
