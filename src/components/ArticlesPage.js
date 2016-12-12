import 'isomorphic-fetch';
import React, { Component } from 'react';

class ArticleItem extends Component {
   render() {
    const { index, id, title, author, created_at, updated_at } = this.props;
    return (
        <div className="row" key={index}>
          <div className="col-md-3">
            <span style = {mystyle}><a href={"#/articles/"+ id}>{title}</a></span>
          </div>
          <div className="col-md-3">
              <span style = {mystyle}>{author}</span>
          </div>
          <div className="col-md-3">
              <span style = {mystyle}>{created_at}</span>
          </div>
          <div className="col-md-3">
             <span style = {mystyle}>{updated_at}</span>
          </div>
        </div>
          
      );
    }
}
class ArticlesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles : []
    };
  }
   updateState() {
    this.setState({
      articles: this.state.articles
    })
  }
  componentDidMount() {
    fetch ('/api/articles/')
    .then(response => {
      return response.json();
    })
    .then(json => {
      this.state.articles = json;
      this.updateState(); 
    });
    
  }
  renderArticleItem(item,id) {
    return (
      <ArticleItem
        index = {id}
        id = {item.id}
        title = {item.title}
        author = {item.author}
        created_at={item.created_at.slice(0,10)}
        updated_at={item.updated_at.slice(0,10)}

      />
    );
  }
  render() {
    return (
      <div className="container" >
         <div className="row"  >
          <div className="col-md-3" >
              Title
          </div>
          <div className="col-md-3">
              Author
          </div>
          <div className="col-md-3">
              Created Time
          </div>
          <div className="col-md-3">
              Updated Time
          </div>
          <div className="col-md-12">
              {this.state.articles.map(this.renderArticleItem, this)}
          </div>
        </div>
      </div>
    );
  }
}
const mystyle ={

  alignItems: 'center',
  fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
  fontSize: 20,


}
export default ArticlesPage;
