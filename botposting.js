const { exit } = require('process');

const fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    config = require(path.join(__dirname, 'config.js'));

const T = new Twit(config);

function randomFromArray(elements) {
    return elements[Math.floor(Math.random() * elements.length)];
}

//create a template for async await function
async function fetchTrendingTopics() {
    const response = await T.get('trends/place', { id: '23424977' });
    const trends = response.data[0].trends
    
    let trendsHashtags = trends.map(trend => trend.name);
    trendsHashtags = trends.filter(function (trend) {
        return trend.name.startsWith('#');
    }).slice(0, 3);
    trendsHashtags = trendsHashtags.map(trend => trend.name);
    
    return trendsHashtags;
}

function tweetRandomImage(trendsHashtags) {
    fs.readdir(__dirname + '/images', function (err, files) {
        if (err) {
            console.log('error:', err);
        }
        else {
            let images = [];
            files.forEach(function (f) {
                images.push(f);
            });

            console.log('opening an image...');

            const imagePath = path.join(__dirname, '/images/' + randomFromArray(images)),
                b64content = fs.readFileSync(imagePath, { encoding: 'base64' });

            console.log('uploading an image...');

            

            T.post('media/upload', { media_data: b64content }, function (err, data, response) {
                if (err) {
                    console.log('error:', err);
                }
                else {
                    const image = data;
                    console.log('image uploaded, adding description...');

                    T.post('media/metadata/create', {
                        media_id: image.media_id_string,
                        alt_text: {
                            text: 'Describe the image'
                        }
                    }, function (err, data, response) {
                        console.log('tweeting the image...');

                        const statsArray = [
                            "PRE-SALE 4/20 LIMITED 🚀🚀🚀 \n visit buffdogecoin.com for more info!",
                            "Thanks to the #BuffDoge Community! ❤️ \n Remember visiting buffdogecoin.com for more info!",
                            "New Official Community 🔥🔥🔥 visit https://discord.gg/ANVZcedxTK to be part of the force 🥵!",
                        ];
                        const cryptoTrends = [
                            "#Bitcoin", "#Dogecoin", "#ETH", "#Babydoge", "#Dogecoin", "#ElonMusk",
                            "#Ethereum", "#CryptoCurrency", "#Crypto"
                        ];

                        const textToTweet = randomFromArray(statsArray)
                        const trend1ToTweet = randomFromArray(cryptoTrends)
                        const trend2ToTweet = randomFromArray(cryptoTrends)
                        const trend3ToTweet = randomFromArray(cryptoTrends)
                        const tweetToPost = textToTweet + "\n" + trend1ToTweet + " " + trend2ToTweet + " " + trend3ToTweet +
                            " " + trendsHashtags[0] + " " + trendsHashtags[1] + " " + trendsHashtags[2]

                        T.post('statuses/update', {
                            status: tweetToPost,
                            media_ids: [image.media_id_string]
                        },
                            function (err, data, response) {
                                if (err) {
                                    console.log('error:', err);
                                }
                                else {
                                    console.log('posted an image!');
                                }
                            }
                        );
                    });
                }
            });
        }
    });
}
async function start() {
    const trendsHashtags = await fetchTrendingTopics();
    tweetRandomImage(trendsHashtags);

}

start();
