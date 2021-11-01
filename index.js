const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9idnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('database connected')

        const database = client.db('tourPlace');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // post order  API
        app.post('/services/:id', async (req, res) => {
            const order = req.body;
            console.log('hit the post api', order);
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });

        // GET order  API
        app.get('/manageOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // GET service API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Service Single API 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting one service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        // GET order Single API 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting one service', id);
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.findOne(query);
            res.json(order);
        })



        // DELETE API
        app.delete("/deleteProduct/:id", async (req, res)=>{
            console.log(req.params.id);
            const result = await ordersCollection.deleteOne({ _id: ObjectId(req.params.id),
            })
            console.log(result);

        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(port, () => {
    console.log('Running Genius Server on port', port);
})