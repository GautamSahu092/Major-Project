const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data=initdata.data.map((obj)=>({...obj,owner:"67c16651a4b559ccb791258d"}));
  await Listing.insertMany(initdata.data);
  console.log('Data initialized successfully');
};
initDB();