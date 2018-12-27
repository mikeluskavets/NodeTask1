const http = require('http');
const url = require('url');
const fs = require('fs');
const queryString = require('querystring');

const port = 3000;

let db = {
    filename: './db.txt',
    init: function(){
        this.result = [];
    },
    add: function (obj) {
        this.result.push(obj);
    },
    get: function (index = null) {
        return index === null ? this.result[index] : this.result;
    }
};

db.init();

const server = http.createServer((request, response) => {
    let {pathname, query} = url.parse(request.url);
    let path = pathname;
    if (path === '/info') {
        let args = queryString.parse(query);
        if (args.auth !== false && args.login !== '' && args.password !== '') {
            let new_user = {login: args.login, password: args.password};
            db.add(new_user);
        }
        else {
            path = '/not-auth';
        }
    } else if (path === '/') {
        path = '/index';
    } else if (path === '/users') {
        if (db.result.length) {
            response.write('Users:');
            for (let i = 0; i < db.result.length; i++) {
                let html = `\n${i}. ${db.result[i].login} - ${db.result[i].password}`;
                response.write(html);
            }
            response.end('\nComplete');
        }
        else {
            response.end('User not registered!');
        }
    }
    let filename = `./templates${path}.html`;
    let filename_404 = `./templates/404.html`;
    fs.exists(filename, (exists) => {
        if (exists) {
            response.end(fs.readFileSync(filename));
        }
        else {
            response.end(fs.readFileSync(filename_404));
        }
    });
});
server.listen(port, (err) => {
    if (!err) {
        console.log(`server is listening on ${port}`)
    }
});
