const _ = require('lodash');

const totalLikes = (blogs) => {
  return blogs.reduce((t, blog) => (t = t + blog.likes), 0);
};

const favoriteBlog = (blogs) => {
  return _.maxBy(blogs, (bl) => bl.likes);
};

const mostBlogs = (blogs) => {
  const byAuthor = _.groupBy(blogs, (bl) => bl.author);
  const mostBlogsAuthor = _.maxBy(
    Object.keys(byAuthor),
    (author) => byAuthor[author].length
  );

  return {
    author: mostBlogsAuthor,
    blogs: byAuthor[mostBlogsAuthor].length,
  };
};

const mostLikes = (blogs) => {
  const byAuthor = _.groupBy(blogs, (bl) => bl.author);
  const authorsLikes = _.mapValues(byAuthor, (bls) =>
    bls.reduce((totalLikes, bl) => bl.likes + totalLikes, 0)
  );
  const mostLikesAuthor = _.maxBy(
    Object.keys(authorsLikes),
    (author) => authorsLikes[author]
  );

  return {
    author: mostLikesAuthor,
    likes: authorsLikes[mostLikesAuthor],
  };
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
