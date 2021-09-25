import express from 'express';
import Comment from '../models/Comment.js';
import auth from '../middleware/auth.js';

const commentsRouter = express.Router();

//=================================
//             Subscribe
//=================================

commentsRouter.post('/saveComment', auth, (req, res) => {
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    console.log(err);
    if (err) return res.json({ success: false, err });

    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
});

commentsRouter.post('/getComments', (req, res) => {
  Comment.find({ postId: req.body.movieId })
    .populate('writer')
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

// commentsRouter.get('/getComments', (req, res) => {
//   Comment.find({ postId: req.body.movieId })
//     .populate('writer')
//     .exec((err, comments) => {
//       if (err) return res.status(400).send(err);
//       res.status(200).json({ success: true, comments });
//     });
// });

commentsRouter.get('//getComments', async (req, res, next) => {
  try {
    const comments = await Comment();
    res.send(comments);
    console.log(comments, 'comments here');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// favoritesRouter.post('/getFavoredMovie', (req, res) => {
//   //Need to find all of the Users that I am subscribing to From Subscriber Collection
//   Favorite.find({ userFrom: req.body.userFrom }).exec((err, favorites) => {
//     if (err) return res.status(400).send(err);
//     return res.status(200).json({ success: true, favorites });
//   });
// });

export default commentsRouter;
