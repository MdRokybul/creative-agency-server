const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.94gfj.mongodb.net/${process.env.DB_SERVICE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(cors());
app.use(bodyParser.json());


client.connect(err => {
    const services = client.db("servicedb").collection("serviceCollection");
    const feedbacks = client.db("feedbackdb").collection("feedbackCollection");
    const admins = client.db("admindb").collection("adminCollection");
    const orders = client.db("orderdb").collection("orderCollection");

    app.get('/individualorder', (req, res) => {
        const email = req.query.email;
        orders.find({email: email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/ordersadmin', (req, res) => {
        orders.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/orders', (req, res) => {
        const order = req.body;
        orders.insertOne(order)
        .then(result => {
            res.send(result);
        })
    })

    app.get('/allfeedback', (req, res) => {
        feedbacks.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get('/allservice', (req, res) => {
        services.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post("/isadmin", (req, res) => {
        const email = req.body.email
        admins.find({email: email})
        .toArray((err, documents) => {
            if (documents.length > 0) {
                res.send(documents[0])
            }
        })
    })

    app.post('/makeadmin', (req, res) => {
        const admin = req.body;
        admins.insertOne(admin)
        .then(result => {
            res.send(result);
        })
    })

    app.post('/addfeedback', (req, res) => {
        const feedback = req.body;
        feedbacks.insertOne(feedback)
            .then(result => {
                res.send(result);
            })
    })

    app.post('/addservice', (req, res) => {
        const service = req.body;
        services.insertOne(service)
            .then(result => {
                res.send(result)
            })
    });

});



app.listen(5000)