import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dislikeSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    videoId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Dislike = mongoose.model('Dislike', dislikeSchema);

export default Dislike;
