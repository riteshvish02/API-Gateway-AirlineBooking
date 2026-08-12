// aggregation-demo.js
// Copyable aggregation examples: pipeline, runnable Mongoose snippet, one-line explanation, and expected result.
// Drop this file inside `API-Gateway/scripts` and run/inspect as needed. It does not connect to MongoDB — it only prints the examples.

function printBlock(title, pipeline, runnable, explanation, result) {
  console.log('------------------------------------------------------------');
  console.log(`BLOCK: ${title}\n`);
  console.log('Pipeline:');
  console.log(JSON.stringify(pipeline, null, 2));
  console.log('\nRunnable (Mongoose):');
  console.log(runnable);
  console.log('\nOne-line explanation:');
  console.log(explanation);
  console.log('\nResult:');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n');
}

// Dummy data (for reference)
const DUMMY = {
  users: [
    { _id: 1, name: 'Aman', active: true, createdAt: '2024-01-10T00:00:00.000Z' },
    { _id: 2, name: 'Riya', active: true, createdAt: '2024-02-15T00:00:00.000Z' },
    { _id: 3, name: 'John', active: false, createdAt: '2023-12-20T00:00:00.000Z' }
  ],
  posts: [
    { _id: 101, title: 'Mongo Basics', userId: 1, likes: 10, createdAt: '2024-01-01T00:00:00.000Z' },
    { _id: 102, title: 'Aggregation', userId: 1, likes: 15, createdAt: '2024-02-01T00:00:00.000Z' },
    { _id: 103, title: 'Node Tips', userId: 2, likes: 7, createdAt: '2024-03-01T00:00:00.000Z' },
    { _id: 104, title: 'JS Patterns', userId: 2, likes: 20, createdAt: '2024-04-01T00:00:00.000Z' },
    { _id: 105, title: 'Old Post', userId: 3, likes: 3, createdAt: '2023-12-01T00:00:00.000Z' }
  ],
  comments: [
    { _id: 201, postId: 101, text: 'Nice' },
    { _id: 202, postId: 101, text: 'Great' },
    { _id: 203, postId: 102, text: 'Helpful' },
    { _id: 204, postId: 104, text: 'Excellent' },
    { _id: 205, postId: 104, text: 'Superb' }
  ]
};

// Block 1
const pipeline1 = [
  { $lookup: { from: 'posts', localField: '_id', foreignField: 'userId', as: 'posts' } },
  { $project: { _id: 0, name: 1, 'posts.title': 1, 'posts.createdAt': 1 } },
  { $sort: { name: 1 } },
  { $limit: 2 }
];
const runnable1 = `const result = await User.aggregate(${JSON.stringify(pipeline1, null, 2)});`;
const explanation1 = 'Join posts into users, keep name + post titles/dates, sort by name, return first 2.';
const result1 = [
  {
    name: 'Aman',
    posts: [
      { title: 'Mongo Basics', createdAt: '2024-01-01T00:00:00.000Z' },
      { title: 'Aggregation', createdAt: '2024-02-01T00:00:00.000Z' }
    ]
  },
  {
    name: 'John',
    posts: [ { title: 'Old Post', createdAt: '2023-12-01T00:00:00.000Z' } ]
  }
];

// Block 2
const pipeline2 = [
  { $lookup: { from: 'posts', localField: '_id', foreignField: 'userId', as: 'posts' } },
  { $unwind: { path: '$posts', preserveNullAndEmptyArrays: true } },
  { $group: {
      _id: '$_id',
      name: { $first: '$name' },
      totalPosts: { $sum: { $cond: [ { $ifNull: ['$posts._id', false] }, 1, 0 ] } },
      totalLikes: { $sum: { $ifNull: ['$posts.likes', 0] } }
    }
  },
  { $project: { _id: 0, userId: '$_id', name: 1, totalPosts: 1, totalLikes: 1 } },
  { $sort: { totalPosts: -1, totalLikes: -1 } }
];
const runnable2 = `const stats = await User.aggregate(${JSON.stringify(pipeline2, null, 2)});`;
const explanation2 = 'Attach posts, explode array into rows, then regroup to count posts and sum likes per user.';
const result2 = [
  { userId: 1, name: 'Aman', totalPosts: 2, totalLikes: 25 },
  { userId: 2, name: 'Riya', totalPosts: 2, totalLikes: 27 },
  { userId: 3, name: 'John', totalPosts: 1, totalLikes: 3 }
];

// Block 3
const pipeline3 = [
  { $lookup: { from: 'comments', localField: '_id', foreignField: 'postId', as: 'comments' } },
  { $project: { _id: 1, title: 1, likes: 1, commentCount: { $size: '$comments' }, comments: 1 } },
  { $sort: { _id: 1 } }
];
const runnable3 = `const postsWithComments = await Post.aggregate(${JSON.stringify(pipeline3, null, 2)});`;
const explanation3 = 'For each post attach comments array, compute commentCount via $size, return posts sorted by _id.';
const result3 = [
  { _id: 101, title: 'Mongo Basics', likes: 10, commentCount: 2, comments: [ { _id:201, postId:101, text:'Nice' }, { _id:202, postId:101, text:'Great' } ] },
  { _id: 102, title: 'Aggregation', likes: 15, commentCount: 1, comments: [ { _id:203, postId:102, text:'Helpful' } ] },
  { _id: 103, title: 'Node Tips', likes: 7, commentCount: 0, comments: [] },
  { _id: 104, title: 'JS Patterns', likes: 20, commentCount: 2, comments: [ { _id:204, postId:104, text:'Excellent' }, { _id:205, postId:104, text:'Superb' } ] },
  { _id: 105, title: 'Old Post', likes: 3, commentCount: 0, comments: [] }
];

// Block 4
const pipeline4 = [
  { $lookup: { from: 'posts', localField: '_id', foreignField: 'userId', as: 'posts' } },
  { $facet: {
      recentUsers: [
        { $sort: { createdAt: -1 } },
        { $limit: 3 },
        { $project: { _id: 0, name: 1, createdAt: 1 } }
      ],
      topAuthors: [
        { $project: { _id: 0, name: 1, postCount: { $size: '$posts' } } },
        { $sort: { postCount: -1 } },
        { $limit: 3 }
      ],
      postsStats: [
        { $unwind: '$posts' },
        { $group: { _id: null, totalPosts: { $sum: 1 }, avgLikes: { $avg: '$posts.likes' } } },
        { $project: { _id: 0, totalPosts: 1, avgLikes: 1 } }
      ]
    }
  }
];
const runnable4 = `const dashboard = await User.aggregate(${JSON.stringify(pipeline4, null, 2)});`;
const explanation4 = 'Single query runs three parallel reports: recentUsers, topAuthors by postCount, and postsStats.';
const result4 = [
  {
    recentUsers: [
      { name: 'Riya', createdAt: '2024-02-15T00:00:00.000Z' },
      { name: 'Aman', createdAt: '2024-01-10T00:00:00.000Z' },
      { name: 'John', createdAt: '2023-12-20T00:00:00.000Z' }
    ],
    topAuthors: [
      { name: 'Aman', postCount: 2 },
      { name: 'Riya', postCount: 2 },
      { name: 'John', postCount: 1 }
    ],
    postsStats: [ { totalPosts: 5, avgLikes: 11 } ]
  }
];

function main() {
  console.log('\nDummy data (for reference):');
  console.log(JSON.stringify(DUMMY, null, 2));
  printBlock('lookup + project + sort + limit', pipeline1, runnable1, explanation1, result1);
  printBlock('lookup + unwind + group', pipeline2, runnable2, explanation2, result2);
  printBlock('posts with nested lookup (comments per post)', pipeline3, runnable3, explanation3, result3);
  printBlock('dashboard-style $facet', pipeline4, runnable4, explanation4, result4);
}

if (require.main === module) main();

module.exports = {
  pipeline1, pipeline2, pipeline3, pipeline4,
  result1, result2, result3, result4
};
