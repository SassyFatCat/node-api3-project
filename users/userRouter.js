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

router.get('/:id', validateUserId, (req, res) => {
res.status(200).json({ data: req.user })
});

router.get('/:id/posts', validateUserId, (req, res) => {
const {id} = req.params;
Users.getUserPosts(id)
  .then(result => {
    result[0] ? res.status(200).json({ data: result }) : res.status(200).json({ data: "This user does not have any posts" })
  })
  .catch(err => res.status(500).json({ error: "Server error" }))
});

router.delete('/:id', validateUserId, (req, res) => {
Users.remove(req.user.id)
  .then(result => res.status(200).json({ data: result === 1 ? "User was removed" : "User could not be removed" }))
  .catch(err => res.status(500).json({ error: "Server error" }))
});

router.put('/:id', validateUserId, (req, res) => {
req.user.name = req.body.name;
Users.update(req.params.id, req.user)
  .then(result => res.status(200).json({ data: result === 1 ? "User updated" : "User could not be updated" }))
  .catch(err => res.status(500).json({ error: "Server error" }))
});


// CUSTOM MIDDLEWARE
function validateUserId(req, res, next) {
const id = Number(req.params.id);
Users.getById(id)
  .then(result => {
    if (result) {
      req.user = result;
      next()
    } else {
      res.status(400).json({ error: "User does not exist" })
    }
  })
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
