const https = require('https');
const { XMLParser } = require('fast-xml-parser')

function parsePodcast(content){
    const parser = new XMLParser({ ignoreAttributes: false });
    return parser.parse(content);
}

function getContent(url, callback){
    let content = ''
    return new Promise(resolve => {
        https.get(url, response => {
            let count = 0;
            response.on('data', data => {
                content += data.toString();
            })
            response.on('end', () => resolve(content))
        });
    })
}

exports.getPodcast = async function(url) {
    const content = await getContent(url);
    return parsePodcast(content);
}