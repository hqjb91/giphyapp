const fetch = require('node-fetch');
const withquery = require('with-query').default;

//pull out fixed height url with search term on top
const searchFunction = async (term, apikey) => {

    const url = withquery('http://api.giphy.com/v1/gifs/search', {
        q: term,
        api_key: apikey
    });

    const result = await fetch(url);
    const resultJSON = await result.json();
    const data = await resultJSON.data;

    return data;
};

module.exports = searchFunction;