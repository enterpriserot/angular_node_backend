var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var sg = require('./sendgrid.env');

router.get('/people', getPeople);
router.get('/person/:id', getPerson);
router.get('/*', four0four.notFoundMiddleware);
router.post('/contact/:send', sendContact);

module.exports = router;

//////////////

function getPeople(req, res, next) {
  res.status(200).send(data.people);
}

function getPerson(req, res, next) {
  var id = +req.params.id;
  var person = data.people.filter(function(p) {
    return p.id === id;
  })[0];

  if (person) {
    res.status(200).send(person);
  } else {
    four0four.send404(req, res, 'person ' + id + ' not found');
  }
}

function sendContact(req, res){
    var options = {
        auth: {
            api_key: sg
        }
    }
    var mailer = nodemailer.createTransport(sgTransport(options));
    mailer.sendMail(req.body, function(error, info){
        if(error){
            res.status('401').json({err: info});
        }else{
            res.status('200').json({success: true});
        }
    });
}
