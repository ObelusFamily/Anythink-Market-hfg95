//TODO: seeds script should come here, so we'll be able to put some data in our local env
// import {faker} from '';
// import Item from '../models/Item'
// import User from '../models/User'
var faker = require('@faker-js/faker')

var mongoose = require('mongoose');
mongoose.connect('process.env.MONGODB_URI');

var Item = require('../models/Item')
var User = require('../models/User')

for (let i = 0; i < 100; i++) {
    const user = new User({
        name: faker.internet.userName(),
        email: faker.internet.email()
    })

    user.save()
    .then(userRef => {
        console.log(`${userRef.name} saved successfully`);
        const item = new Item({
            title: user.name,
            description: faker.random.words(),
            image: faker.image.abstract()
        })
        item.save()
    })
}
