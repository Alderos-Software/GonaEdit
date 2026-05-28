const $ = id => document.getElementById(id);
const e = $('edit'), v = $('view'), ln = $('ln'), f = $('file');

let file = "untitled.js", u = [], r = [];

const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

const hl = t => esc(t)
  .replace(/(\/\/.*)/g,'<span class=cm>$1</span>')
  .replace(/(".*?"|'.*?'|`[\s\S]*?`)/g,'<span class=st>$1</span>')
  .replace(/\b\d+\b/g,'<span class=nu>$&</span>')
  .replace(/\b(function|return|if|else|then|fi|for|while|const|let|var)\b/g,'<span class=kw>$1</span>');

const getLine = (text, pos, type) => {
  let start = text.lastIndexOf('\n', pos - 1) + 1;
  let end = text.indexOf('\n', pos);
  if (end === -1) end = text.length;
  return type === 'indent' ? text.slice(start, pos).match(/^\t*/)[0] : text.slice(start, end).trim();
};

const render = () => {
  v.innerHTML = hl(e.value) + '\n';
  ln.textContent = e.value.split('\n').map((_,i)=>i+1).join('\n');
  v.scrollTop = ln.scrollTop = e.scrollTop;
  v.scrollLeft = e.scrollLeft;
};

e.oninput = () => (u.push(e.value), r = [], render());
e.onscroll = () => (v.scrollTop = ln.scrollTop = e.scrollTop, v.scrollLeft = e.scrollLeft);

const bracketMap = { '(': ')', '[': ']', '{': '}' };

e.onkeydown = ev => {
  if (ev.ctrlKey) {
    const map = { s: save, o: () => f.click(), z: undo, y: redo };
    if (map[ev.key]) (ev.preventDefault(), map[ev.key]());
    return;
  }

  if (ev.key === "Tab") {
    ev.preventDefault();
    const i = e.selectionStart;
    e.value = e.value.slice(0,i) + "\t" + e.value.slice(i);
    e.selectionStart = e.selectionEnd = i + 1;
    render();
    return;
  }

  if (bracketMap[ev.key]) {
    ev.preventDefault();
    const i = e.selectionStart;
    e.value = e.value.slice(0,i) + ev.key + bracketMap[ev.key] + e.value.slice(i);
    e.selectionStart = e.selectionEnd = i + 1;
    render();
    return;
  }

  if (ev.key === "Enter") {
    ev.preventDefault();
    const i = e.selectionStart;
    const indent = getLine(e.value, i, 'indent');
    const charBefore = e.value[i - 1], charAfter = e.value[i];
    const newIndent = charBefore === '{' && charAfter === '}' ? indent + '\t' : indent;
    const newlineStr = charBefore === '{' && charAfter === '}' ? "\n" + newIndent + "\n" + indent : "\n" + indent;
    e.value = e.value.slice(0,i) + newlineStr + e.value.slice(i);
    e.selectionStart = e.selectionEnd = i + 1 + (charBefore === '{' && charAfter === '}' ? newIndent.length : indent.length);
    render();
    return;
  }
};

const undo = () => u.length && (r.push(e.value), e.value = u.pop(), render());
const redo = () => r.length && (u.push(e.value), e.value = r.pop(), render());

const save = async () => {
  try {
    if (!window.fileHandle) {
      window.fileHandle = await showSaveFilePicker({
        suggestedName: file,
        types: [{ description: 'Text Files', accept: { 'text/*': ['.txt', '.js'] } }]
      });
    }
    const writable = await window.fileHandle.createWritable();
    await writable.write(e.value);
    await writable.close();
    file = window.fileHandle.name;
  } catch (err) {
    console.error('Save failed:', err);
  }
};

f.onchange = () => {
  const fr = new FileReader();
  fr.onload = () => (e.value = fr.result, u = [], r = [], render());
  file = f.files[0].name;
  fr.readAsText(f.files[0]);
};

e.value = `// GonaEdit\nfunction test(){console.log("ok")}`;
render();
