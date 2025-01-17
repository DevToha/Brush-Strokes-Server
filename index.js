const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000


// middleware

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.myfy8om.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

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
        await client.connect();

        // ////

        const itemCollection = client.db('itemDB').collection('item')

        // const subcategoryNameCollection = client.db('itemDB').collection('subcategoryName')

        // app.get('/subcategoryName', async (req, res) => {
        //     const cursor = subcategoryNameCollection.find()
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })

        // //

        app.get('/item', async (req, res) => {
            const cursor = itemCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // /////

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await itemCollection.findOne(query)
            res.send(result)
        })

        //  //////

        app.get("/myProduct/:email", async (req, res) => {
            console.log(req.params.email)
            const result = await itemCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        // ////

        app.put('/item/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedItem = req.body

            const item = {
                $set: {
                    itemName: updatedItem.itemName,
                    subcategoryName: updatedItem.subcategoryName,
                    shortDescription: updatedItem.shortDescription,
                    processingTime: updatedItem.processingTime,
                    userName: updatedItem.userName,
                    price: updatedItem.price,
                    rating: updatedItem.rating,
                    photoURL: updatedItem.photoURL,
                    customization: updatedItem.customization,
                    userEmail: updatedItem.userEmail,
                    stockStatus: updatedItem.stockStatus
                }
            }

            const result = await itemCollection.updateOne(filter, item, options);
            res.send(result)
        })

        // ////

        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await itemCollection.deleteOne(query)
            res.send(result)
        })

        // ////

        app.post('/item', async (req, res) => {
            const newItem = req.body
            console.log(newItem)
            const result = await itemCollection.insertOne(newItem)
            res.send(result)
        })

        // ///


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})