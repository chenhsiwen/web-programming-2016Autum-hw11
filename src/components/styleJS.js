const textstyle ={

  alignItems: 'center',
  fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
  fontSize:25,
  pan: 20,
}
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};
const contentstyle ={
  alignItems: 'center',
  fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
  fontSize:16,
  padding: 25,
  margin:12,
}
const spanStyle = {
  margin: 80,
  fontSize: 30
};

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


var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];



export {spanStyle, contentstyle, styleMap, textstyle, INLINE_STYLES, BLOCK_TYPES}

  

