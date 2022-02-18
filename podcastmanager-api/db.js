const { Client } = require('pg')

exports.DataContext = class DataContext {
    #host;
    #user;
    #password;
    #database;
    #port;
    constructor({host, user, password, database, port}) {
        this.#host = host;
        this.#user = user;
        this.#password = password;
        this.#database = database;
        this.#port = port;
    }
    async getShows() {
        const client = new Client({ user: this.#user, password: this.#password, database: this.#database, host:this.#host, port:this.#port });
        await client.connect();
        const res = await client.query('SELECT show_id, title, url, description, imageUrl, created_on FROM shows');
        client.end()
        return res.rows || [];
    }

    async getShows() {
        const client = new Client({ user: this.#user, password: this.#password, database: this.#database, host:this.#host, port:this.#port });
        await client.connect();
        const res = await client.query('SELECT show_id, title, url, description, imageUrl, created_on FROM shows');
        client.end()
        return res.rows || [];
    }
    
    async getShow() {
        const client = new Client({ user: this.#user, password: this.#password, database: this.#database, host:this.#host, port:this.#port });
        await client.connect();
        const res = await client.query('SELECT show_id, title, url, description, imageUrl, created_on FROM shows WHERE show_id = $1::int', [show_id]);
        client.end()
        if (res.rows && res.rows.length)
            return res.rows[0];
        return null;
    }
    
    async getEpisodes() {
        const client = new Client({ user: this.#user, password: this.#password, database: this.#database, host:this.#host, port:this.#port });
        await client.connect();
        const res = await client.query('SELECT episode_id, show_id, title, info_url, media_url, description, created_on FROM episodes');
        client.end()
        return res.rows || [];
    }
    
    async getShowsEpisodes(show_id) {
        const client = new Client({ user: this.#user, password: this.#password, database: this.#database, host:this.#host, port:this.#port });
        await client.connect();
        const res = await client.query('SELECT episode_id, show_id, title, info_url, media_url, description, created_on FROM episodes WHERE show_id = $1::int', [show_id]);
        client.end()
        return res.rows || [];
    }
    
    async getEpisode(episode_id) {    
        const client = new Client({ user: this.#user, password: this.#password, database: this.#database, host:this.#host, port:this.#port });
        await client.connect();
        const res = await client.query('SELECT episode_id, show_id, title, info_url, media_url, description, created_on FROM episodes WHERE episode_id = $1::int', [episode_id]);
        client.end()
        if (res.rows && res.rows.length)
            return res.rows;
        return null;
    }
    
    async addShow(title, url, description, imageUrl){
        const client = new Client({ user: this.#user, password: this.#password, database: this.#database, host:this.#host, port:this.#port });
        await client.connect();
        const res = await client.query('INSERT INTO shows (title, url, description, imageUrl) VALUES ($1::text, $2::text, $3::text, $4::text) RETURNING show_id, title, url, description, imageUrl, created_on', [title, url, description, imageUrl]);
        client.end()
        if (res.rows && res.rows.length)
            return res.rows[0];
        return null;
    }

    async addEpisode(show_id, title, info_url, media_url, description){
        const client = new Client({ user: this.#user, password: this.#password, database: this.#database, host:this.#host, port:this.#port });
        await client.connect();
        const res = await client.query('INSERT INTO episodes (show_id, title, info_url, media_url, description) VALUES ($1::int, $2::text, $3::text, $4::text, $5::text) RETURNING episode_id, show_id, title, info_url, media_url, description, created_on', [show_id, title, info_url, media_url, description]);
        client.end()
        if (res.rows && res.rows.length)
            return res.rows[0];
        return null;
    }
}