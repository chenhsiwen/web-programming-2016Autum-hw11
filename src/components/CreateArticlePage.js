import 'isomorphic-fetch';
import React, { Component } from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import {convertFromRaw, convertToRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

class CreateArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: '',
      content: {},
      author: ''
    };
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }
  updateState() {
      this.setState({
        title: this.state.title, 
        author: this.state.author,
        content: this.state.content,
      }
    )
  }
  handletitle(event) {
    this.setState({ title: event.target.value });
  }
  handlecontent(event) {
    this.setState({ content: event.target.value });
  }
  handleauthor(event) {
    this.setState({ author: event.target.value });
  }

  handleSubmitClick() {
    const confirm = window.confirm('確定要新增文章嗎？');
    if (confirm) {
      var contentState = this.state.editorState.getCurrentContent();
      this.state.content = stateToHTML(contentState);

      this.updateState();

      fetch('/api/articles/', {
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
      }).then( document.location.href= "#/articles");
    }
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
    return (
      <input 
        name="title"
        placeholder="title"
        autoFocus
        value={this.state.title}
        onChange={this.handletitle.bind(this)}
        style = {mystyle}
      />
    )
  }                
  renderAuthor = () => {
    return (
      <input 
        name="author"
        placeholder="author"
        autoFocus
        value={this.state.author}
        onChange={this.handleauthor.bind(this)}
        style = {mystyle}
      />
    )
  }


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
    return (
      <div className="container">
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
            {this.rendeRichAricle()}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button
              className="btn btn-info pull-right"
              role="button"
              onClick={this.handleSubmitClick}
            >送出</button>
          </div>
        </div>
      </div>
    );
  }
}
const mystyle ={

  alignItems: 'center',
  fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
  fontSize:25,
  pan: 20,
}
// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};


export default CreateArticlePage;
