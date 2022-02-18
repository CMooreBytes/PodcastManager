const { response } = require('express')
const express = require('express')
const app = express()
app.use(express.json())
const db = require('./db')
const util = require('./utility')
const PORT = 3000;
let dataContext = null;

db.createDataContext({
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    host: 'db',
    port: 5432    
}).then(ctx => dataContext = ctx);

async function getShows(request, response) {
    console.log('getshows')
    const shows = await dataContext.getShows();
    return response.json(shows);
}

async function getShow(request, response) {
    const show = await dataContext.getShow(request.params.show_id);
    if (show)
        return response.json(show);
    return response.sendStatus(404);
}

async function getEpisodes(request, response) {
    const episodes = await dataContext.getEpisodes();
    return response.json(episodes);
}

async function getShowsEpisodes(request, response) {
    const episodes = await dataContext.getShowsEpisodes(request.params.show_id);
    return response.json(episodes);
}

async function getEpisode(request, response) {
    const episode = await dataContext.getEpisode(request.params.episode_id);
    if (episode)
        return response.json(episode);
    return response.sendStatus(404);
}

async function addShow(request, response) {
    const feed = await util.getPodcast(request.body.url)
    
    await dataContext.addShow(
        feed['rss']['channel']['title'],
        feed['rss']['channel']['link'],
        feed['rss']['channel']['description'],
        feed['rss']['channel']['itunes:image']);
    response.send(dataContext.getShows());
}

app.get('/shows',getShows)
app.post('/shows',addShow)

app.get('/shows/:show_id', getShow)
app.get('/shows/:show_id/episodes', getShowsEpisodes)
app.get('/shows/:show_id/episodes/:episode_id', getEpisode)
app.get('/', getEpisodes)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})