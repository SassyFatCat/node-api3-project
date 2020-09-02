const express = require('express');
const router = express.Router();
const Users = require('./userDb.js');
const Posts = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
Users.insert(req.body)
  .then(result => res.status(201).json({ newUser: result }))
  .catch(err => res.status(500).json({ error: "Server error" }))
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
Posts.insert({user_id: `${req.user.id}`, text: `${req.body.text}`})
  .then(result => res.status(201).json({ data: result }))
});

router.get('/', (req, res) => {
Users.get()
  .then(result => res.status(200).json({ data: result }))
  .catch(err => res.status(500).json({ error: err }))
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
const id = Number(req.params.id);
Users.getById(id)
  .then(result => {req.user = result; next()})
  .catch(err => res.status(400).json({ message: "invalid user id" }))
}

function validateUser(req, res, next) {
!req.body ? res.status(400).json({ message: "missing user data" })
          : !req.body.name ? res.status(400).json({ message: "missing required name field" })
          : next();
}

function validatePost(req, res, next) {
!req.body ? res.status(400).json({ message: "missing post data" })
          : !req.body.text ? res.status(400).json({ message: "missing required text field" })
          : next()
}

module.exports = router;
