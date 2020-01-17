const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {
    async create(atts){
        atts.id = this.randomId();
        
        const salt = crypto.randomBytes(8).toString('hex');
        const hashedBuffer = await scrypt(atts.password, salt, 64);

        const records = await this.getAll();
        const record = {...atts, password: `${hashedBuffer.toString('hex')}.${salt}`};
        records.push(record);

        await this.writeAll(records);

        return record

    }

    async comparePasswords(saved, supplied){
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuffer.toString('hex');
    }

}


module.exports = new UserRepository('users.json');