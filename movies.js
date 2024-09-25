var http = require('http');
var axios = require('axios');

var API_KEY = '6c523e48';
const PORT = process.env.PORT || 3001;

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    var searchTerm = '';
    if (req.url.includes('?search=')) {
        searchTerm = req.url.split('?search=')[1];
    }

    res.write('<html><body>');
    res.write('<h1>Movie Search Engine</h1>');
    res.write('<h3>Find all of your favorite movies here.</h3><br>');
    res.write('<form action="/" method="GET">');
    res.write('<input type="text" name="search" placeholder="Search for a movie title" required>');
    res.write('<button type="submit">Search</button>');
    res.write('</form>');

    if (searchTerm) {
        var apiUrl = 'http://www.omdbapi.com/?s=' + searchTerm + '&apikey=' + API_KEY;

        axios.get(apiUrl)
            .then(function (response) {
                var movies = response.data.Search;

                res.write('<h2>Results for "' + searchTerm + '"</h2><ul>');
                if (movies) {
                    movies.forEach(function (movie) {
                        res.write('<li>' + movie.Title + ' (' + movie.Year + ')<br>');
                        res.write('<img src="' + movie.Poster + '" style="max-width:100px;"><br></li>');
                    });
                } else {
                    res.write('<li>No movies found.</li>');
                }
                res.write('</ul>');
                res.end();
            })
            .catch(function (error) {
                res.write('<h1>Error fetching data from OMDb.</h1>');
                res.end();
            });
    } else {
        res.write('<p>Please enter a movie title to search.</p>');
        res.end();
    }

}).listen(PORT, function () {
    console.log('Server running at http://localhost:' + PORT + '/');
});
