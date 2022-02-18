const { Client } = require('pg')

async function createEpisodes(client){
    const command = 'CREATE TABLE IF NOT EXISTS episodes (episode_id INT GENERATED ALWAYS AS IDENTITY, show_id INT, info_url TEXT, media_url TEXT, created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(episode_id), CONSTRAINT fk_show FOREIGN KEY(show_id) REFERENCES shows(show_id));';
    return await client.query(command);
}

async function createShows(client){
    const command = 'CREATE TABLE  IF NOT EXISTS shows (show_id INT GENERATED ALWAYS AS IDENTITY, title VARCHAR(1000), url TEXT, description TEXT, imageUrl TEXT, created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(show_id));';
    return await client.query(command);    
}

async function getShows(client) {
    const res = await client.query('SELECT show_id, title, url, description, imageUrl, created_on FROM shows');
    client.end()
    return res.rows || [];
}

async function getShow(client) {
    const res = await client.query('SELECT show_id, title, url, description, imageUrl, created_on FROM shows WHERE show_id = $1::int', [show_id]);
    client.end()
    if (res.rows && res.rows.length)
        return res.rows[0];
    return null;
}

async function getEpisodes(client) {
    const res = await client.query('SELECT episode_id, show_id, info_url, media_url, created_on FROM episodes');
    client.end()
    return res.rows || [];
}

async function getShowsEpisodes(client, show_id) {
    const res = await client.query('SELECT episode_id, show_id, info_url, media_url, created_on FROM episodes WHERE show_id = $1::int', [show_id]);
    client.end()
    return res.rows || [];
}

async function getEpisode(client, episode_id) {    
    const res = await client.query('SELECT episode_id, show_id, info_url, media_url, created_on FROM episodes WHERE episode_id = $1::int', [episode_id]);
    client.end()
    if (res.rows && res.rows.length)
        return res.rows;
    return null;
}

async function addShow(client, title, url, description, imageUrl){
    const res = await client.query('INSERT INTO shows (title, url, description, imageUrl) VALUES ($1::text, $2::text, $3::text, $4::text)', [title, url, description, imageUrl]);
    client.end()
    return res;
}

async function createClient(host, user, password, database, port) {
    const client = new Client({ user, password, database, host, port });
    await client.connect();
    return client;
}

exports.createDataContext = async function ({host, user, password, database, port}){
    const client = await createClient(host, user, password, database, port);
    await createShows(client);
    await createEpisodes(client);
    client.end()
    return {
        getShows: () => createClient(host, user, password, database, port)
            .then(client => getShows(client)),
        getShow: show_id => createClient(host, user, password, database, port)
            .then(client => getShow(client, show_id)),
        getEpisodes: () => createClient(host, user, password, database, port)
            .then(client => getEpisodes(client)),
        getShowsEpisodes: show_id => createClient(host, user, password, database, port)
            .then(client => getShowsEpisodes(client, show_id)),
        getEpisode: episode_id => createClient(host, user, password, database, port)
            .then(client => getEpisode(client, episode_id)),
        addShow: (title, url, description, imageUrl) => createClient(host, user, password, database, port)
            .then(client => addShow(client, title, url, description, imageUrl))
    };
};

