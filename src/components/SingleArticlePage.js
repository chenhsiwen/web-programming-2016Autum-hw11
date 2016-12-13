import 'isomorphic-fetch';
import React, { Component, PropTypes } from 'react';
import {Editor, EditorState, RichUtils, ContentState} from 'draft-js';
import {convertFromHTML, createFromBlockArray, createWithContent } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {getBlockStyle, StyleButton, BlockStyleControls, InlineStyleControls} from './Editorbtn';
import {textstyle, styleMap, contentstyle, spanStyle} from './styleJS';


class SingleArticlePage extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      hasarticle : false,
      editorState: EditorState.createEmpty(),
      title: '',
      content: {},
      author: '',
      view: 0,
      isEditing: false,
    };
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  handlearticle(json){
    console.log(json.length);
    if ( json.length !== 0  ){
      console.log(1);
      json[0].isEditing = false;
      this.state = Object.assign({}, json[0]);
      this.state.hasarticle = true;
      const blocksFromHTML = convertFromHTML(this.state.content);

      const state = ContentState.createFromBlockArray(blocksFromHTML);
      
      this.setState ( {editorState: EditorState.createWithContent(state)});
      console.log(this.state.editorState);
      this.updateState();
    }
  }
  updateState() {
    this.setState({
      hasarticle: this.state.hasarticle,
      title: this.state.title, 
      author: this.state.author,
      content: this.state.content,
      view: this.state.view,
      isEditing : this.state.isEditing,
    })
  }
  componentDidMount() {

    fetch ('/api/articles/'+this.props.id)
    .then(response => {
      return response.json();})
    .then(json => this.handlearticle(json));

  }

  handleDelClick = () => {
    const confirm = window.confirm('確定要刪除文章嗎？');
    if (confirm) {
      fetch('/api/articles/'+this.props.id, {
        method: 'DELETE'
      }).then( document.location.href= "#/articles");
    }
  };

  handleEditClick = () => {
    if ( this.state.isEditing === false ) { 
      this.state.isEditing = true;
     
    }
    else {
      this.updateState();
      const confirm = window.confirm('確定要編輯文章嗎？');
      if (confirm) {
        this.state.isEditing = false;
        var contentState = this.state.editorState.getCurrentContent();
        this.state.content = stateToHTML(contentState);
        this.updateState();
        fetch('/api/articles/'+this.props.id, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: this.state.title,
            content: this.state.content,
            author: this.state.author,
          })
        });
        
      }
    }
    this.updateState();
    
  };
  handletitle(event) {
    if (this.state.isEditing)
      this.setState({ title: event.target.value });
    else 
      return false;
  }
  handlecontent(event) {
    if (this.state.isEditing)
      this.setState({ content: event.target.value });
    else 
      return false;
  }
  handleauthor(event) {
    if (this.state.isEditing)
      this.setState({ author: event.target.value });
    else 
      return false;
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);

      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }
  renderTitle = () => {
     if (this.state.isEditing)
       return (
         <span style = {textstyle}> Title :
          <input 
            name="title"
            placeholder="title"
            autoFocus
            value={this.state.title}
            onChange={this.handletitle.bind(this)}
            style = {textstyle}
          />
        </span>

      );
    else 
      return (<span style = {textstyle}>Title :{this.state.title}</span>);
  };        
         
  renderAuthor = () => {
    if (this.state.isEditing === true)
      return (
        <span style = {textstyle}> Author :
          <input 
            name="author"
            placeholder="author"
            autoFocus
            value={this.state.author}
            onChange={this.handleauthor.bind(this)}
            style = {textstyle}
          />
        </span>
      );
    else 
      return (<span style = {textstyle}>Author :{this.state.author}</span>);
  };
  renderContent = () => {
    const {content} = this.state;
    if (this.state.isEditing){
      return this.rendeRichAricle();
    }
    else {
      return ( 
        <span style = {textstyle}>Content : 
          <div dangerouslySetInnerHTML={{__html: content}} style = {contentstyle}></div>
        </span>
      );
    }
     

  };
  rendeRichAricle() {
    const {editorState} = this.state;
  
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            name="content"
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Tell a story..."
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );

  }
  render() {
    const { isEditing } = this.state;
    if (this.state.hasarticle)
      return (
        <div className="container" >
          <div className="row">
            <div className="col-md-12">
              {this.renderTitle()}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {this.renderAuthor()}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {this.renderContent()}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button
                className="btn btn-info"
                role="button"
                onClick={this.handleEditClick}
              >{isEditing ? '確認' : '編輯'}</button>
              {isEditing ? null :
              <button
                className="btn btn-warning"
                role="button"
                onClick={this.handleDelClick}
              >刪除</button>
              }
            </div>
          </div>
        </div>
      );
    else 
      return(
        <div className="row">
           <div className="col-md-3">
           </div>
            <div className="col-md-9">
               <span style = {spanStyle}>No Such Article</span>
            </div>
        </div>
      )
  }
}




export default SingleArticlePage;
