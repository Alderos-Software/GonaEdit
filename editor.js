const $ = id => document.getElementById(id);
const e = $('edit'), v = $('view'), ln = $('ln'), f = $('file');

let file = "untitled.js", u = [], r = [];

const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

const hl = t =>
  esc(t)
    .replace(/(\/\/.*)/g,'<span class=cm>$1</span>')
    .replace(/(".*?"|'.*?'|`[\s\S]*?`)/g,'<span class=st>$1</span>')
    .replace(/\b\d+\b/g,'<span class=nu>$&</span>')
    .replace(/\b(function|return|if|else|for|while|const|let|var)\b/g,'<span class=kw>$1</span>');

const sync = () => {
  v.scrollTop = ln.scrollTop = e.scrollTop;
  v.scrollLeft = e.scrollLeft;
};

const render = () => {
  v.innerHTML = hl(e.value);
  ln.textContent = e.value.split('\n').map((_,i)=>i+1).join('\n');
  sync();
};

e.oninput = () => (u.push(e.value), r = [], render());
e.onscroll = sync;

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
  }
};

const undo = () => u.length && (r.push(e.value), e.value = u.pop(), render());
const redo = () => r.length && (u.push(e.value), e.value = r.pop(), render());

const save = () => {
  file = prompt("Save file as:", file) || file;
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([e.value])),
    download: file
  });
  a.click();
  URL.revokeObjectURL(a.href);
};

f.onchange = () => {
  const fr = new FileReader();
  fr.onload = () => (e.value = fr.result, u = [], r = [], render());
  file = f.files[0].name;
  fr.readAsText(f.files[0]);
};

e.value = `// GonaEdit\nfunction test(){console.log("ok")}`;
render();
