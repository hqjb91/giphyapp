// Load libraries
const express = require('express');
const hbs = require('express-handlebars');

const fetch = require('node-fetch');
const withquery = require('with-query').default;

const API_KEY = require('./private');
const searchFunction = require('./search');

// Instantiate Express
const app = express();

// Set up port
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// Set up handlebars
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs'
}));
app.set('view engine', 'hbs');

// Serve up static files
app.use(express.static(__dirname + '/public'));


// Handle requests
app.get('/', (req, res) => {
    res.status(200);
    res.type('text/html');
    res.render('index');
});

// Using async/await + promise chaining
// app.get('/results', (req, res) => {

//     const searchTerm = req.query.tosearch;

//     searchFunction(searchTerm, API_KEY).then(data => {
//         let imgList = [];
//         data.forEach((data)=>{
//             imgList.push(data.images.fixed_height.url);
//         })

//         return imgList;
//     }).then((imgList)=>{
//         res.status(200);
//         res.type('text/html');
//         res.render('results', {
//             imgList,
//             searchTerm: searchTerm
//         });
//     }).catch((e)=>{
//         console.log(e);
//     })
// });

app.get('/results', async (req, res) => {

    const searchTerm = req.query.tosearch;
    const url = withquery('http://api.giphy.com/v1/gifs/search', {
        q: searchTerm,
        api_key: API_KEY
    });

    let imgList = [];

    const results = await fetch(url)
    const gifs = await results.json();
    const gifsData = await gifs.data;

    await gifsData.forEach((data)=>{
            imgList.push(data.images.fixed_height.url);
    });

    res.status(200);
    res.type('text/html');
    res.render('results', {
            imgList,
            searchTerm: searchTerm
        });
});

app.use((req, res) => {
    res.render('index');
});

// Start server
if (API_KEY)
{
    app.listen(PORT, () => {
    console.log(`Server has started on PORT: ${PORT} at ${new Date()}`);
    });
} else {
    console.log('API key is not set');
}