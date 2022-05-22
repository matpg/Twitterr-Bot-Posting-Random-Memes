const fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    config = require(path.join(__dirname, './config/config.js'));

const T = new Twit(config);

function randomFromArray(images) {
    return images[Math.floor(Math.random() * images.length)];
}

function tweetRandomImage() {
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
                            "Join or new Official Discord Community 🔥🔥🔥 visit https://discord.gg/ANVZcedxTK to be part of the force 🥵 and receive incredible new tokens!",
                        ];

                        const textToTweet = statsArray[2]


                        T.post('statuses/update', {
                            status: textToTweet,
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

setInterval(function () {
    tweetRandomImage();
}, 10000);
