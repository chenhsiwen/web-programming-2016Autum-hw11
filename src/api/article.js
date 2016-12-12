import { Router } from 'express';
import { Article }  from '../models/';
// import model
let ObjectID = require('mongodb').ObjectID;




const articleRouter = new Router();

articleRouter.get('/', (req, res) => {
	Article.find({}).lean().exec(function (err, articles) {
		if (err) return handleError(err);
		for (let i = 0; i < articles.length ; i++)
			delete articles[i]["content"]

    	return res.end(JSON.stringify(articles));
	});	
});

articleRouter.get('/:id', (req, res) => {
	Article.find({"id" : parseInt(req.params.id)}).lean().exec(function (err, article) {
		if (err) return handleError(err);
    	return res.end(JSON.stringify(article));
	});
});

articleRouter.post('/', (req, res) => {
	Article.find({}).lean().exec(function (err, articles) {
		if (err) return handleError(err);
		let newarticle = req.body;
		newarticle._id = new ObjectID();
		newarticle.view = 0;
		if (articles.length === 0)
			newarticle.id = 1;
		else 
   			newarticle.id = articles[articles.length-1].id + 1 ;
   		let article = new Article(newarticle);
		article.save(function (err) {
 			if (err) return handleError(err);
		})
	});	
	

		
	
});

articleRouter.post('/:id', (req, res) => {
	let updatearticle = req.body;
	Article.findOneAndUpdate({"id" : parseInt(req.params.id)},updatearticle ,function (err, article) {
		if (err) return handleError(err);
		
	});
	
	
});

articleRouter.delete('/:id', (req, res) => {
	Article.find({ "id" : parseInt(req.params.id) }).remove().exec();
});

export default articleRouter;
