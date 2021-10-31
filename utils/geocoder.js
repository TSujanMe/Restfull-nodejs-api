const NodeGeocoder = require('node-geocoder');


const options = {
    provider:'mapquest',
    httpAdapter:"https",
    apiKey:'ECtP4lHr4dN63k5gbHhG5e7pzsFovLgv',
    formatter:null
}


const geoCoder =NodeGeocoder(options)

module.exports = geoCoder;