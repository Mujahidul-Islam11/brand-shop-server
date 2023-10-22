const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.OWNER_NAME}:${process.env.OWNER_PASS}@cluster0.u8ojnwq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const AddSlider = client.db("EntoMedu").collection("AddSlider");
    const AddProduct = client.db("EntoMedu").collection("AddProduct");
    const cartCollection = client.db("EntoMedu").collection("cart");


    app.get("/brand", async (req, res) => {
        const cursor = AddSlider.find({});
        const add = await cursor.toArray();
        res.send(add)
        });
        app.get("/brand/:brandName",async(req, res)=>{
            const brandName = req.params.brandName;
            const query = {brandName : brandName}
            const brandData = await AddSlider.findOne(query)
            res.send(brandData)
        })
        app.get("/products",async(req,res)=>{
            const cursor = AddProduct.find({})
            const add = await cursor.toArray();
            res.send(add)
        })
        app.get('/products/:id', async (req, res) => {
          const id = req.params.id
          const query = { _id: new ObjectId(id) }
          const result = await AddProduct.findOne(query)
          res.send(result)
        })
        app.put('/products/:id', async (req, res) => {
          const id = req.params.id
          const filter = {_id: new ObjectId(id) }
          const update =req.body
          const cart = {
            $set: {
              name:update.name,
              brandName:update.brandName,
              rating:update.rating,
              price:update.price,
              description:update.description,
              type:update.type,
              photo:update.photo
            }
          }
          const result = await AddProduct.updateOne(filter, cart);
          res.send(result);
        })
        

        app.post('/myCart', async(req, res)=>{
          const cart = req.body;
          console.log(cart)
          const result =await cartCollection.insertOne(cart)
          res.send(result)
         })


         app.delete("/myCart/:id", async (req, res) => {
          const id = req.params.id
          const query ={_id : id}
          const result = await cartCollection.deleteOne(query);
          res.send(result)
        });
        
         app.get('/myCart', async(req, res)=> {
          const cursor = cartCollection.find()
          const result = await cursor.toArray()
          res.send(result)
        })

        app.post("/products",async(req, res)=>{
            const products = req.body;
            const result = await AddProduct.insertOne(products)
            res.send(result)
        })

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My server is running");
});

app.listen(port, () => {
  console.log(`My server is running on port: ${port}`);
});
