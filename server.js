const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const mailgun = require('mailgun-js')
const bcrypt = require("bcrypt");


const UserItem = require('./models/users');
const {PORT, mongoUri, apiKey, domain} = require('./config')

const app = express()
app.use(cors())
app.use(express.json())

const mg = mailgun({apiKey: apiKey, domain: domain})

mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB database Connected...'))
    .catch((err) => console.log(err))


app.get('/logout', (req, res) => {
    // TODO: DE FACUT DECONECTAREA
    res.send('Hello World!')
})

app.post('/session', async (req, res) => {
    // TODO: DE MODIFICAT JSON UL TRIMIS CA SA FIE O CONECTARE SI NU DOAR UN MESAJ CARE ARATA DECONECTAT SAU CONECTAT
    const user = await UserItem.findOne({ emailAddress: req.body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (validPassword) {
        res.status(200).json({ message: "Valid password" });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } 
    else {
      res.status(401).json({ error: "User does not exist" });
    }
})

app.post('/user', async (req, res) => {
    const newUser = new UserItem(req.body)
    try {
        // hashing password
        console.log(newUser.password)
        const salt = await bcrypt.genSalt(10);
        console.log(salt)
        newUser.password = await bcrypt.hash(newUser.password, salt);
        console.log(newUser.password)
        const user = await newUser.save()
        if (!user) throw new Error('Something went wrong saving the user information')
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ status: error.message })
    }
})

app.post('/user/recovery', (req, res) => {
    // TODO: DE FACUT UN LINK CARE SA TE DUCA SA ITI FACI ALTA PAROLA
    let link = "udakdasfjsdjfa"
    const data = {
        from: 'Nume <halfflux@gmail.com>',
        to: req.body.email,
        subject: 'Password reset!',
        text: `Link to reset password ${link}`
    };
    
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
    res.status(200).json({status: "DONE"})  
})


app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
