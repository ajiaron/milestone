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
    charset:'utf8mb4',
    database:'milestoneDB',
 }
)

app.get('/api/getusers', (req, res)=> {
    db.query('SELECT * FROM users', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getmilestones', (req, res)=> {
    db.query('SELECT * FROM milestones', (err, result)=> {
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

app.get('/api/getlinkedmilestones', (req, res) => {
    const postid = req.body.postid
    db.query('SELECT * FROM postmilestones', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/api/pushposts', (req, res)=> {
    const idposts = req.body.idposts
    const username = req.body.username
    const caption = req.body.caption
    const profilepic = req.body.profilepic
    const src = req.body.src
    const date = req.body.date
    const ownerid = req.body.ownerid
    db.query('INSERT INTO userposts (idposts, username, caption, profilepic, src, date, ownerid) VALUES (?,?,?,?,?,?,?)', 
    [idposts, username, caption, profilepic, src, date, ownerid], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})

app.post('/api/postmilestones', (req, res) => {
    const title = req.body.title
    const src = req.body.src
    const streak = req.body.streak
    const description = req.body.description
    const ownerid = req.body.ownerid
    db.query('INSERT INTO milestones (title, src, streak, description, ownerid) VALUES (?,?,?,?,?)',
    [title, src, streak, description, ownerid], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})

app.post('/api/linkmilestones', (req, res) => {
    const postid = req.body.postid
    const milestoneid = req.body.milestoneid
    db.query('INSERT INTO postmilestones (postid, milestoneid) VALUES (?,?)',
    [postid, milestoneid], (err, result) => {
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