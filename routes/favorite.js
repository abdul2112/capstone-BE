import express from 'express';
import Favorite from '../models/Favorite.js';
import auth from '../middleware/auth.js';

const favoritesRouter = express.Router();

//=================================
//             Subscribe
//=================================

favoritesRouter.post('/favoriteNumber', (req, res) => {
  Favorite.find({ movieId: req.body.movieId }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);

    res.status(200).json({ success: true, subscribeNumber: subscribe.length });
  });
});

favoritesRouter.post('/favorited', (req, res) => {
  Favorite.find({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);

    let result = false;
    if (subscribe.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, subscribed: result });
  });
});

favoritesRouter.post('/addToFavorite', (req, res) => {
  console.log(req.body);

  const favorite = new Favorite(req.body);

  favorite.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

favoritesRouter.post('/removeFromFavorite', (req, res) => {
  Favorite.findOneAndDelete({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});

favoritesRouter.post('/getFavoredMovie', (req, res) => {
  //Need to find all of the Users that I am subscribing to From Subscriber Collection
  Favorite.find({ userFrom: req.body.userFrom }).exec((err, favorites) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, favorites });
  });
});

favoritesRouter.get('/', async (req, res, next) => {
  try {
    const content = await Favorite();

    res.send(content);
    console.log(content, 'favorites here');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default favoritesRouter;
