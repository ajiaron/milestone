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
    db.query('SELECT * FROM userposts', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/api/pushposts', (req, res)=> {
    const username = req.body.username
    const caption = req.body.caption
    const profilepic = req.body.profilepic
    const src = req.body.src
    const date = req.body.date
    db.query('INSERT INTO userposts (username, caption, profilepic, src, date) VALUES (?,?,?,?,?)', 
    [username, caption, profilepic, src, date], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})

app.listen(19001, () => {
    console.log("ayo server running on port 19001")
})