const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://usX.api.mailchimp.com/x.0/lists/x;" //your mailchimp campaign url goes here

    const options = {
        method: "POST",
        auth: "//mailchimp-key//" //your mailchimp key goes here
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + 'public/success.html');
        } else {
            res.sendFile(__dirname + 'public/failure.html');
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", (req, res) => res.redirect("/"));


app.listen(3000, () => console.log("Server ok"));
