const http = require("http");
const fs = require("fs");
http
.createServer(function (request, response) {
    if (request.url === "/") {
        fs.readFile("index.html", function (error, data) {
            if (error) {
                response.end(error);
            } else {
                console.log(11);
                response.writeHead(200, { "content-Type": "text/html" });
                response.write(data);
                return response.end();
            }
        });
    }
    if (request.url === "/create-a-file" && request.method === "POST") {
        let body = "";
        request.on("data", function (data) {
            body += data.toString();
        });
        request.on("end", function () {
            let parsedBody = JSON.parse(body);
            fs.writeFile(parsedBody.fileName, parsedBody.message, function (err) {
                if (err) {
                    response.end(err);
                } else {
                    response.end("File Created");
                }
            });
        });
    }
    if (request.url === "/update-a-file" && request.method === "POST") {
        let body = "";
        request.on("data", function (data) {
            body += data.toString();
        });
        request.on("end", function () {
            let parsedBody = JSON.parse(body);
            fs.appendFile(
                parsedBody.fileName,
                `\n${parsedBody.message}`,
                function (err) {
                    if (err) {
                        response.end(err);
                    } else {
                        response.end("Updated File");
                    }
                }
                );
            });
        }
        if (request.url === "/delete-a-file" && request.method === "POST") {
            let body = "";
            request.on("data", function (data) {
                body += data.toString();
            });
            request.on("end", function () {
                let parsedBody = JSON.parse(body);
                fs.unlink(parsedBody.fileName, function (err) {
                    if (err) return response.end(err);
                    response.end(`${parsedBody.fileName} File Deleted`);
                });
            });
        }
    })
    .listen(3000, function () {
        console.log("Server Started!!!");
    });