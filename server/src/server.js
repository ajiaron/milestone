/* cloudy-space-872085 */
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

app.post('/register/account', (req, res) => {
    const name = req.body.name
    const milestones = req.body.milestones
    const blurb = req.body.blurb
    const date = req.body.date
    const password = req.body.password
    const friends = req.body.friends
    const groupcount = req.body.groupcount
    const email = req.body.email
    const fullname = req.body.fullname
    db.query("INSERT INTO users (name, milestones, blurb, date, password, friends, groupcount, email, fullname) VALUES (?,?,?,?,?,?,?,?,?)",
    [name, milestones, blurb, date, password, friends, groupcount, email, fullname], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('new users have been posted')
        }
    })
}) 

app.get('/login/account', (req,res)=> {
    db.query('SELECT * FROM users', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/newfeed/create', (req, res) => {
    const id = req.body.id
    const username = req.body.username
    const text = req.body.text
    const context = req.body.context
    const date = req.body.date
    const likes = req.body.likes
    db.query('INSERT INTO posts (id, username, text, context, date, likes) VALUES (?,?,?,?,?,?)', 
    [id, username, text, context, date, likes], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})

app.get('/newfeed/newposts', (req,res)=> {
    db.query('SELECT * FROM posts', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/newfeed/comment', (req, res) => {
    const comment = req.body.comment
    const date = req.body.date
    const postId = req.body.postId
    const username = req.body.username
    db.query('INSERT INTO comments (comment, date, postid, username) VALUES (?,?,?,?)', 
    [comment, date, postId, username], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('comment all good sir')
        }
    })
})

app.get('/newfeed/getcomments', (req,res)=> {
    db.query('SELECT * FROM comments', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})



app.listen(3000, () => console.log('Listening on port 3000'))
