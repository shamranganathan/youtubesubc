const express = require('express');
const app = express();
const path = require('path');
const subscriberModal = require('./models/subscribers');

// Parse JSON bodies that API clients send.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// web page explaining how to use various API queries is shown to the user.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

// shows an array of all database subscribers.
app.get('/subscribers', async (req, res) => {
    try {
        const subscribers = await subscriberModal.find().select("-__v");
        res.json(subscribers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// shows a list of subscribers' names and subscribed channels in the database.
app.get('/subscribers/names', async (req, res) => {
    try {
        const subscribersnames = await subscriberModal.find().select("-_id -subscribedDate -__v");
        res.json(subscribersnames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// _id is used to display a specific subscriber from the database.
app.get('/subscribers/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const subscriberId = await subscriberModal.findById(id).select("-__v");
        res.json(subscriberId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Subscriber doesn't exist with the given _id" });
    }
});

// Use Postman to add more subscribers.
app.post('/subscribers/add', async (req, response) => {
    // adding a new subscriber as defined by the subscriberModal in the model
    const newSubscriber = new subscriberModal({
        name: req.body.name,
        subscribedChannel: req.body.subscribedChannel
    });

    try {
        // To save it to the database, use .save().
        let result = await newSubscriber.save();
        response.json(result);
    } catch (err) {
        response.send("Error in adding data to the database");
        
    }
});

// using the id, delete any subscriber
app.delete('/subscribers/delete/:id', async (req, res) => {
    const delId = req.params.id;
    try {
        const subdel = await subscriberModal.deleteOne({ _id: delId });
        res.send(`Subscriber deleted successfully `);
    } catch (err) {
        res.send(`Error in deleting data from the database `);
    }
});

// handles any unwanted or irrational requests.
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
