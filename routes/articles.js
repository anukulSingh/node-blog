const express = require('express')
const Article = require('../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:slug', async (req, res, next) => {
  req.article = await Article.findOne({ slug: req.params.slug })
  next()
}, saveArticleAndRedirect('edit'))

router.patch('/like/:slug', async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug })
  article.likes = article.likes + 1;
  await article.save();
  res.redirect(`/articles/${article.slug}`)
})

router.delete('/:slug', async (req, res) => {
  await Article.findOneAndDelete({ slug: req.params.slug })
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    // article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router