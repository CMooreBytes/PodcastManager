const { response } = require('express')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())


const { DataContext } = require('./db')
const util = require('./utility')
const PORT = 3000;

const dataContext = new DataContext({
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    host: 'db',
    port: 5432    
});

async function getShows(request, response) {
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
    const show = await dataContext.addShow(
        feed['rss']['channel']['title'],
        feed['rss']['channel']['link'],
        feed['rss']['channel']['description'],
        feed['rss']['channel']['itunes:image']['@_href']);
    for(const item of feed['rss']['channel']['item']) {
        await dataContext.addEpisode(
            show.show_id, 
            item['title'],
            item['link'],
            item['enclosure']['@_url'],
            item['description']
        )
    }
    response.send(show);
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