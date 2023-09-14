// Import the data model and all required libaries
var express = require('express');
var app = express();
var mongoose = require('mongoose')
const Data = require("./NoteModel");
const assert = require("assert");

// Connect to the database
mongoose.connect("mongodb://localhost/newDB");
// Tell us whether is connection was successful or not
mongoose.connection.once("open", () => {
    console.log("Connected!");
}).on("error", function(error) {
    console.log("Connection Error:", error);
});

// When localhost:8081/fetch is pinged return all items in the Data collection
router.get('/fetch', async (req, res) => {
    try {
        const notes = await Data.find({});
        res.json(notes);
    } catch (error) {
        // Handle errors here
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// When the delete route is called seach the database using the ID header and delete that item
app.post('/delete', async (req, res) => {
    try {
      // Assuming the "id" is sent as a query parameter or in the request body
      const id = req.get("id");
  
      if (!id) {
        return res.status(400).json({ error: 'Missing "id" parameter' });
      }
  
      const deletedData = await Data.findOneAndRemove({ _id: id });
  
      if (!deletedData) {
        return res.status(404).json({ error: 'Data not found' });
      }
  
      res.send('Data deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// To update, look for the item with the given ID and update all the vakues with the new header values
app.post('/update', async (req, res) => {
    try {
      const id = req.get("id");
      const newData = {
        date: req.get("date"),
        title: req.get("title"),
        note: req.get("note")
      };
  
      // Use await to update the data
      const updatedData = await Data.findOneAndUpdate(
        { _id: id },
        newData,
        { upsert: true, new: true } // Set new to true to return the updated data
      );
  
      // Send a response with the updated data or a success message
      res.json(updatedData || { message: 'Done' });
    } catch (err) {
      // Handle errors appropriately
      res.status(500).json({ error: 'An error occurred' });
    }
  });

// Create a new data object with the headers and input it into the DB
app.post("/form", (req, res) => {
    var data = new Data({ note: req.get("note"), title: req.get("title"), date: req.get("date") })
    res.send("Done")
    data.save().then(() => {
        assert(data.isNew == false);
    });
    console.log("Saved");
})

// Start the server on localhost:8081
var server = app.listen(8081, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});