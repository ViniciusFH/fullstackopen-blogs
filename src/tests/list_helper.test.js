const listHelper = require('../utils/list_helper');
const { initialBlogs, userId } = require('./test_helper');

describe('total likes', () => {
  test('returns sum of likes of all blog posts', () => {
    const result = listHelper.totalLikes(initialBlogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('returns blog with most likes', () => {
    const favorite = listHelper.favoriteBlog(initialBlogs);
    expect(favorite).toEqual({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      user: userId,
      __v: 0,
    });
  });
});

describe('most blogs', () => {
  test('returns author with most blogs', () => {
    const most = listHelper.mostBlogs(initialBlogs);
    expect(most).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});

describe('most likes', () => {
  test('returns author with most blogs likes', () => {
    const most = listHelper.mostLikes(initialBlogs);
    expect(most).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 });
  });
});
