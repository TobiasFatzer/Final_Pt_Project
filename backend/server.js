// Imports
const express = require('express');
const {MongoClient, ObjectId} = require('mongodb'); // See https://www.mongodb.com/docs/drivers/node/current/quick-start/
const cors = require('cors')
const http = require('http');
const bodyParser = require('body-parser');
const config = require('./config');

// Set up App
const app = express();
app.use(cors()); // Allow all cross-origing requests. More information: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(express.static('public')); // Host all static files in the folder /public
app.use(bodyParser.json()); // Support json encoded bodies
const port = process.env.PORT || '3001'; // Use the PORT variable if set (e.g., when deploying to Heroku)
app.set('port', port);

const server = http.createServer(app);


// Create the client and connect to the database
let database;
const client = new MongoClient(config.mongodb_connection_string);
client.connect((error, db) => {
    if (error || !db) {
        console.log("Could not connect to MongoDB:")
        console.log(error.message);
    } else {
        database = db.db('SPSV');
        console.log("Successfully connected to MongoDB.");
    }
})

const mysql = require('mysql2');

const mysql_connection = mysql.createConnection(config.mysql_connection);

mysql_connection.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database.');
});

//--------------------------------------------------------------------------------------------------
// Get M-N from Mysql to mongoDB (Commented out since only needed once)
//--------------------------------------------------------------------------------------------------
/*async function updateMitgliederComp(mitgliederId, compIds) {
    const collection = database.collection('mitglieder');
    const query = {id: Number(mitgliederId)};
    await collection.updateOne(query, {$set: {comps: compIds}});
}

app.get('/api/init', async (req, res) => {
    const collection = database.collection('mitglieder');
    let Mitglieder = {
        _id: ObjectId,
        id: Number
    }
    const result = await collection.find({}, {projection: {id: 1}}).toArray();
    for (const index in result) {
        mysql_connection.query('SELECT * FROM sasse_schiffeinzel WHERE steuermann_id = ? or vorderfahrer_id = ?', [result[index].id, result[index].id], (err, rows, fields) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(rows);
            updateMitgliederComp(result[index].id, rows)

        });
    }
})*/


//##################################################################################################
// ENDPOINTS 
//##################################################################################################

//--------------------------------------------------------------------------------------------------
// Welcome message
//--------------------------------------------------------------------------------------------------
app.get('/api', async (req, res) => {
    res.send("Welcome to the SPSV Full Database API");
})

//--------------------------------------------------------------------------------------------------
// Get all Mitglieder
//--------------------------------------------------------------------------------------------------
app.get('/api/mitglieder', async (req, res) => {
    try {
        const collection = database.collection('mitglieder');
        // You can specify a query/filter here
        // See https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/
        const query = {};
        // Get all objects that match the query
        const result = await collection.find(query).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Get a Mitglieder by their id
//--------------------------------------------------------------------------------------------------
app.get('/api/mitglieder/:id', async (req, res) => {
    // read the path parameter :id
    let id = req.params.id;
    try {
        const collection = database.collection('mitglieder');
        const query = {id: Number(id)}; // filter by id
        const result = await collection.findOne(query);
        if (!result) {
            let responseBody = {
                status: "No Mitglieder with id " + id
            }
            res.status(404).send(responseBody);
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Get a Mitglieder by their id
//--------------------------------------------------------------------------------------------------
app.get('/api/mitglieder/sektionId/:sectionId', async (req, res) => {
    // read the path parameter :id
    let sectionId = req.params.sectionId;
    try {
        const collection = database.collection('mitglieder');
        const query = {sektion_id: Number(sectionId)}; // filter by id
        const result = await collection.find(query).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Update an existing Mitglieder
//--------------------------------------------------------------------------------------------------
app.put('/api/mitglieder/:id', async (req, res) => {
    // read the path parameter :id
    let id = req.params.id;
    let mitglieder = req.body;
    delete mitglieder._id; // delete the _id from the object, because the _id cannot be updated
    try {
        const collection = database.collection('mitglieder');
        const query = {id: Number(id)}; // filter by id
        const result = await collection.updateOne(query, {$set: mitglieder});
        if (result.matchedCount === 0) {
            let responseBody = {
                status: "No Mitglieder with id " + id
            }
            res.status(404).send(responseBody);
        } else {
            res.send({status: "Mitglieder with id " + id + " has been updated."});
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Delete an existing Mitglieder
//--------------------------------------------------------------------------------------------------
app.delete('/api/mitglieder/:id', async (req, res) => {
    // read the path parameter :id
    let id = req.params.id;
    try {
        const collection = database.collection('mitglieder');
        const query = {id: Number(id)}; // filter by id
        const result = await collection.deleteOne(query);
        if (result.deletedCount === 0) {
            let responseBody = {
                status: "No Mitglieder with id " + id
            }
            res.status(404).send(responseBody);
        } else {
            let responseBody = {
                status: "Mitglieder with id " + id + " has been successfully deleted."
            }
            res.send(responseBody);
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Create a new Mitglieder
//--------------------------------------------------------------------------------------------------
app.post('/api/mitglieder', async (req, res) => {
    try {
        const collection = database.collection('mitglieder');
        let highestIdCollection = await collection.aggregate([{$group: {_id: null, maxId: {$max: "$id"}}}]).toArray();
        let highestId = highestIdCollection[0].maxId;
        var mitglieder = {
            id: highestId + 1,
            name: req.body.name,
            vorname: req.body.vorname,
            geburtsdatum: req.body.geburtsdatum,
            geschlecht: req.body.geschlecht,
            sektion_id: req.body.sektion_id,
            comps: req.body.comps
        };
        const result = await collection.insertOne(mitglieder);
        res.status(201).send({_id: result.insertedId});
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})

//--------------------------------------------------------------------------------------------------
// Get all Sektions
//--------------------------------------------------------------------------------------------------
app.get('/api/sektion', async (req, res) => {
    try {
        const collection = database.collection('sektion');
        // You can specify a query/filter here
        // See https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/
        const query = {};
        // Get all objects that match the query
        const result = await collection.find(query).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Get a Sektion by their id
//--------------------------------------------------------------------------------------------------
app.get('/api/sektion/:id', async (req, res) => {
    // read the path parameter :id
    let id = req.params.id;
    try {
        const collection = database.collection('sektion');
        const query = {id: Number(id)}; // filter by id
        const result = await collection.findOne(query);
        if (!result) {
            let responseBody = {
                status: "No Sektion with id " + id
            }
            res.status(404).send(responseBody);
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Get a Sektion by their Name
//--------------------------------------------------------------------------------------------------
app.get('/api/sektion/getSektionIdByName/:name', async (req, res) => {
    // read the path parameter :name
    let name = req.params.name;
    try {
        const collection = database.collection('sektion');
        const query = {name: String(name)}; // filter by name
        const result = await collection.findOne(query);
        if (!result) {
            let responseBody = {
                status: "No Sektion with Name " + name
            }
            res.status(404).send(responseBody);
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Update an existing Sektion
//--------------------------------------------------------------------------------------------------
app.put('/api/sektion/:id', async (req, res) => {
    let id = req.params.id;
    let sektion = req.body;
    try {
        const collection = database.collection('sektion');
        const query = {id: Number(id)}; // filter by id
        const result = await collection.updateOne(query, {
            $set: {
                name: req.body.name,
            }
        });
        if (result.matchedCount === 0) {
            let responseBody = {
                status: "No Sektion with id " + id
            }
            res.status(404).send(responseBody);
        } else {
            res.send({status: "Sektion with id " + id + " has been updated."});
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Delete an existing Sektion
//--------------------------------------------------------------------------------------------------
app.delete('/api/sektion/:id', async (req, res) => {
    // read the path parameter :id
    let id = req.params.id;
    try {
        const collection = database.collection('sektion');
        const query = {id: Number(id)}; // filter by id
        const result = await collection.deleteOne(query);
        if (result.deletedCount === 0) {
            let responseBody = {
                status: "No Mitglieder with id " + id
            }
            res.status(404).send(responseBody);
        } else {
            let responseBody = {
                status: "Mitglieder with id " + id + " has been successfully deleted."
            }
            res.send(responseBody);
        }
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Create a new Sektion
//--------------------------------------------------------------------------------------------------
app.post('/api/sektion', async (req, res) => {
    try {
        const collection = database.collection('sektion');
        let highestIdCollection = await collection.aggregate([{$group: {_id: null, maxId: {$max: "$id"}}}]).toArray();
        let highestId = highestIdCollection[0].maxId;
        var mitglieder = {
            id: highestId + 1,
            name: req.body.name,
            nummer: highestId + 10
        };
        const result = await collection.insertOne(mitglieder);
        res.status(201).send({_id: result.insertedId});
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})
//--------------------------------------------------------------------------------------------------
// Get Actual Values of comp
//--------------------------------------------------------------------------------------------------
app.get('/api/comp', async (req, res) => {
        try {
            mysql_connection.query('SELECT sasse_wettkampf.von as date, COUNT(st.startnummer) as amount \nFROM sasse_wettkampf\nJOIN sasse_disziplin sd ON sasse_wettkampf.id = sd.wettkampf_id\nJOIN sasse_teilnehmer st ON sd.id = st.disziplin_id\nGROUP BY sasse_wettkampf.von;',
                (err, rows, fields) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);

                });
        } catch
            (error) {
            res.status(500).send({error: error.message});
        }
    }
)

//--------------------------------------------------------------------------------------------------
// Start the server
//--------------------------------------------------------------------------------------------------
server.listen(port, () => console.log("app listening on port " + port));


