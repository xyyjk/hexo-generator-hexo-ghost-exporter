const fs = require('hexo-fs');
const moment = require('moment');
const pinyin = require('pinyin');
const _ = require('lodash');

function getPinYin(value, type) {
  const STYLE_NORMAL = { style: pinyin.STYLE_NORMAL };
  if (type === 'slug') {
    return pinyin(value.replace(/\s+/g, '-'), STYLE_NORMAL).join('-').replace(/-+/g, '-');
  } else if (type === 'user') {
    return pinyin(value, STYLE_NORMAL).join('');
  } else {
    return pinyin(value, STYLE_NORMAL);
  }
}

function getPosts(posts, pages) {
  const data = [].concat(posts, pages);

  if (!data.length) { return []; }

  data.sort((a, b) => a.date - b.date);

  return data.map((item, index) => {
    const author_id = getPinYin(item.author, 'user');

    return {
      id: item._id,
      title: item.title,
      html: item._content.replace(/\/assets\//g, '/content/images/hexo/'),
      featured: 0,
      page: item.layout === 'post' ? 0 : 1,
      status: 'published',
      visibility: 'public',
      author_id: author_id,
      created_at: item.date.format(),
      created_by: author_id,
      updated_at: item.updated.format(),
      updated_by: author_id,
      published_at: item.date.format(),
      published_by: author_id,
    };
  });
}

function getUsers(data) {
  if (!data.length) { return []; }

  const users = [];
  const users_id = [];

  data.forEach((item) => {
    const author = item.author || 'autohome-fe';
    const author_id = getPinYin(author, 'user');

    if (users_id.indexOf(author_id) !== -1) {
      return;
    }

    users_id.push(author_id);

    users.push({
      id: author_id,
      name: author,
      slug: author_id,
      email: `${author_id}@autohome.com.cn`,
      status: 'active',
      visibility: 'public',
    });
  });

  return users;
}

function getTags(tags, categories) {
  const data = Object.assign({}, tags, categories);

  if (!data || !Object.keys(data).length) { return []; }

  return Object.keys(data).map(key => {
    return {
      id: data[key]._id,
      name: data[key].name,
      slug: getPinYin(data[key].name, 'slug'),
      visibility: 'public',
    };
  });
}

function getPostsTags(data) {
  if (!data.length) { return []; }

  const tags = [];

  data.forEach(item => {
    const data = [].concat(item.tags.data, item.categories.data);

    _.uniq(data, 'name').forEach(tag => {
      tags.push({
        "post_id": item._id,
        "tag_id": tag._id,
      });
    });
  });

  return tags;
}

hexo.extend.generator.register('datatrans', locals => {
  const ghostData = {
    "meta": {
      "exported_on": Date.now(),
      "version": "1.19.0"
    },
    data: {
      posts: getPosts(locals.posts.data, locals.pages.data),
      users: getUsers(locals.posts.data),
      tags: getTags(locals.tags.data, locals.categories.data),
      posts_tags: getPostsTags(locals.posts.data),
    },
  };

  // console.log(locals);
  // console.log(ghostData);

  const path = `hexo.export.${moment().format('YYYYMMDD')}.json`;
  fs.writeFile(path, JSON.stringify(ghostData, null, '\t'), () => {
    console.log('Data export completed =>', path);
  });
});
