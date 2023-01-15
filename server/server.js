const express = require('express');
const app = express();
const mysql = require('mysql')
const cors = require('cors')
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'password',
    database:'milestoneDB',
 }
)

app.get('/api/getmilestones', (req, res)=> {
    db.query('SELECT * FROM personal_milestones', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})

app.get('/api/getposts', (req, res) => {
    db.query('SELECT * FROM posts', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.listen(19005, () => {
    console.log("ayo server running on port 19001")
})