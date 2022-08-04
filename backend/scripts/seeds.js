//TODO: seeds script should come here, so we'll be able to put some data in our local env
import {faker} from '@faker-js/faker';

mongoose.connect('process.env.MONGODB_URI');

var Items = require('../models/Item')
var Users = require('../models/User');

for (let i = 0; i < 100; i++) {
    const user = new Users({
        name: faker.internet.userName(),
        email: faker.internet.email()
    })

    user.save()
    .then(userRef => {
        console.log(`${userRef.name} saved successfully`);
        const item = new Items({
            title: user.name,
            description: faker.random.words(),
            image: faker.image.abstract()
        })
    })
}
