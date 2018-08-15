const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// process.ENV stores all our environment variables
const port = process.env.PORT || 3000;

let app = express(); // create new express app

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

// next tells when middleware is done
// things won't move until next is called
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now} ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// Comment out to remove from Maintenance mode
app.use((req, res, next) => {
    res.render('maintenance.hbs', {
        pageTitle: 'Under Maintenance'
    });
});


app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// Route to serve up when a get request happens 
// request = req
// response = res
// Send text to server
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page', 
        welcomeMessage: 'Welcome to our site bruv!'
    });

    // res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name: 'Jon',
    //     likes: [
    //         'Coding',
    //         'Watching Movies'
    //     ]
    // })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: '500 Bad Gateway'
    })
});

// binds to port in machine to serve up
app.listen(port, () => {
    console.log(`Server is up in port ${port}`);
});