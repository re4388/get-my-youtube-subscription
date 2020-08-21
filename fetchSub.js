const ObjectsToCsv = require('objects-to-csv');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// sanity check
// I use local env file to get my `NOCODEAPI` endpoint, you can comment out
// these process.env stuff if you just use your endpoint in below url variables
// console.log(process.env.THIS);
// console.log(process.env.noCodeAPiSegment);
const noCodeAPiSegment =  process.env.noCodeAPiSegment

let csvData = new Array();
let pageToken = process.argv[2];
let outputMode = process.argv[3];
let url = ''

if (pageToken === `page1`) {
  url = `https://v1.nocodeapi.com/${noCodeAPiSegment}/subscriptions?maxResults=50`
} else {
  url = `https://v1.nocodeapi.com/${noCodeAPiSegment}/subscriptions?maxResults=50&pageToken=${pageToken}`
}

axios({
  method: 'get',
  url: url,
}).then(async function (response) {
  const items = response.data.items
  console.log(`next page token: ${response.data.nextPageToken}`)

  items.forEach(item => {

    let tempObject = {
      Title: item.snippet.title,
      Description: `${item.snippet.description.substring(0, 15)}...`,
      Url: `https://www.youtube.com/channel/${item.snippet.resourceId.channelId}`
    };
    csvData.push(tempObject)
    // console.log(csvData);
  })

  if (outputMode === 'csv') {
    /* save to youtube_sub.json */
    let csv = new ObjectsToCsv(csvData);
    if (pageToken === `page1`) {
      await csv.toDisk('./youtube_sub.csv');
    } else {
      await csv.toDisk('./youtube_sub.csv', {
        append: true
      });
    }
  } else {
    /* save to YTSub.csv */
    if (pageToken === `page1`) {
      let obj = {
        data: csvData
      };
      let json = JSON.stringify(obj);
      fs.writeFile('youtube_sub.json', json, 'utf8', function (err, data) {
        if (err) {
          console.log(err);
        }
      });
    } else {
      fs.readFile('youtube_sub.json', 'utf8', function (err, data) {
        if (err) {
          console.log(err);
        } else {
          let obj = JSON.parse(data); // parse it to object
          // console.log(csvData);
          const newData = obj.data.concat(csvData) //add some data
          let newObj = {
            data: newData
          };
          // console.log(obj);
          json = JSON.stringify(newObj); //convert it back to json
          fs.writeFile('youtube_sub.json', json, 'utf8', function (err, data) {
            if (err) {
              console.log(err);
            }
          }); // write it back
        }
      });
    }


  }


}).catch(function (error) {
  console.log(error);
});