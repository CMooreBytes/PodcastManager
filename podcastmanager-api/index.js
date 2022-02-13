const { response } = require('express')
const express = require('express')
const app = express()
const { Client } = require('pg')
const PORT = 3000;

const client = new Client({
    host: 'postgres', 
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    host: 'db',
    port: 5432    
})

client.connect()

async function createEpisodes(client){
    const command = 'CREATE TABLE IF NOT EXISTS episodes (episode_id INT GENERATED ALWAYS AS IDENTITY, show_id INT, info_url TEXT, media_url TEXT, created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(episode_id), CONSTRAINT fk_show FOREIGN KEY(show_id) REFERENCES shows(show_id));';
    return await client.query(command);
}

async function createShows(client){
    const command = 'CREATE TABLE  IF NOT EXISTS shows (show_id INT GENERATED ALWAYS AS IDENTITY, title VARCHAR(1000), url TEXT, description TEXT, imageUrl TEXT, created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(show_id));';
    return await client.query(command);
}

async function setup(client) {
    await createShows(client);
    await createEpisodes(client);
}

async function getShows(request, response) {
    const res = await client.query('SELECT show_id, title, url, description, imageUrl, created_on FROM shows');
    return response.json(res.rows || []);
}

async function getShow(request, response) {
    const res = await client.query('SELECT show_id, title, url, description, imageUrl, created_on FROM shows WHERE show_id = $1::int', [request.params.show_id]);
    if (res.rows && res.rows.length)
        return response.json(res.rows[0]);
    return response.sendStatus(404);
}

async function getEpisodes(request, response) {
    const res = await client.query('SELECT episode_id, show_id, info_url, media_url, created_on FROM episodes');
    return response.json(res.rows || []);
}

async function getShowsEpisodes(request, response) {
    const res = await client.query('SELECT episode_id, show_id, info_url, media_url, created_on FROM episodes WHERE show_id = $1::int', [request.params.show_id]);
    return response.json(res.rows || []);
}

async function getEpisode(request, response) {
    const res = await client.query('SELECT episode_id, show_id, info_url, media_url, created_on FROM episodes WHERE episode_id = $1::int', [request.params.episode_id]);
    if (res.rows && res.rows.length)
        return response.json(res.rows);
    return response.sendStatus(404);
}

setup(client)

app.get('/shows', getShows)
app.get('/shows/:show_id', getShow)
app.get('/shows/:show_id/episodes', getShowsEpisodes)
app.get('/shows/:show_id/episodes/:episode_id', getEpisode)
app.get('/', getEpisodes)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})