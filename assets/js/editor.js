/**
 * editor.js
 * Ubuntu MMM — Web Desktop Simulation
 *
 * Code editor powered by Monaco Editor (VS Code engine)
 *
 * Author: Manuel Miranda Martínez
 * https://mmirandamartinez.com
 */

document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("editorModal");
  const header = document.getElementById("editorHeader");
  const closeBtn = document.getElementById("editor-close");
  const tabsEl = document.getElementById("editorTabs");
  const fileListEl = document.getElementById("editorFileList");
  const addFileBtn = document.getElementById("editorAddFileBtn");
  const gutterEl = document.getElementById("editorGutter");
  const textArea = document.getElementById("editorTextArea");
  const highlightEl = document.getElementById("editorHighlight");
  const saveBtn = document.getElementById("editorSaveBtn");
  const statusEl = document.getElementById("editorStatus");
  const autocompleteEl = document.getElementById("editorAutocomplete");
  const themeBtn = document.getElementById("editorThemeBtn");
  // ---- Archivos simulados ----
  let files = [
    {name:"index.html", content:`<!DOCTYPE html>
<html>
<head>
  <title>Ejemplo</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hola Mundo</h1>
  <script src="app.js"></script>
</body>
</html>`},
    {name:"style.css", content:`body {\n  font-family: "Ubuntu Mono", monospace;\n  background: #222;\n  color:#fff;\n}\nh1 { color:#86fff5; }`,},
    {name:"app.js", content:`const saludo = "Hola mundo";\nconsole.log(saludo);`}
  ];
  let currentTab = 0;
  // Guardar/cargar archivos desde localStorage también
  if(localStorage.getItem("editor_files")){
    try{files = JSON.parse(localStorage.getItem("editor_files"));}catch{}
  }
  // ---- Utilidades de tema ----
  function setTheme(dark) {
    document.body.classList.toggle("editor-dark", dark);
    document.body.classList.toggle("editor-light", !dark);
  }
  // Inicial: dark
  setTheme(true);
  let isDark = true;
  themeBtn.onclick = () => { setTheme(!isDark); isDark = !isDark; };

  // ---- Explorador y tabs ----
  function renderFiles() {
    fileListEl.innerHTML = "";
    files.forEach((f, i) => {
      let li = document.createElement("li");
      li.textContent = f.name;
      if(i === currentTab) li.classList.add("active");
      li.onclick = () => openTab(i);
      fileListEl.appendChild(li);
    });
  }
  function renderTabs() {
    tabsEl.innerHTML = "";
    files.forEach((f,i)=>{
      let li = document.createElement("li");
      li.textContent = f.name;
      if(i===currentTab) li.classList.add("active");
      let closeBtn = document.createElement("span");
      closeBtn.className = "editor-tab-close";
      closeBtn.innerHTML = "&times;";
      closeBtn.onclick = (e) => { e.stopPropagation(); closeTab(i);}
      li.appendChild(closeBtn);
      li.onclick = () => openTab(i);
      tabsEl.appendChild(li);
    });
  }
  function openTab(i) {
    saveCurrentFile(textArea.value);
    currentTab = i;
    updateEditor();
    renderTabs();
    renderFiles();
  }
  function closeTab(i) {
    if(files.length<=1) return;
    files.splice(i,1);
    if(currentTab >= files.length) currentTab = files.length-1;
    updateEditor();
    renderTabs();
    renderFiles();
  }
  function addNewFile() {
    let base = "nuevo";
    let extlist = [".js",".css",".html"];
    let ext = extlist[files.length%3];
    let name = `${base}${files.length+1}${ext}`;
    files.push({name,content:""});
    openTab(files.length-1);
  }

  addFileBtn.onclick = addNewFile;
  // Autocargar primero
  renderFiles();
  renderTabs();

  // ---- Editor Funcional ----
  function updateEditor() {
    textArea.value = files[currentTab].content;
    highlightSyntax();
    updateGutter();
    statusEl.textContent = files[currentTab].name;
  }
  function saveCurrentFile(value) {
    files[currentTab].content = value;
    localStorage.setItem("editor_files",JSON.stringify(files));
  }
  
  // --- Overlay fix: Asegura sincronización y NO duplicidad editable ---
  // Solo debe haber un listener
  if (!textArea._inputListenerRegistered) {
    textArea.addEventListener('input',function(){
      highlightSyntax();
      updateGutter();
      updateAutocomplete();
    });
    textArea._inputListenerRegistered = true;
  }
  
  // Sincroniza scroll entre textarea y overlay+gutter
  textArea.addEventListener('scroll', function(){
    highlightEl.scrollTop = textArea.scrollTop;
    highlightEl.scrollLeft = textArea.scrollLeft;
    gutterEl.scrollTop = textArea.scrollTop;
  });
  function updateGutter() {
    // Genera números de línea
    const nlines = textArea.value.split("\n").length;
    let out = "";
    for(let i=1; i<=nlines; ++i) out += i + "\n";
    gutterEl.textContent = out; // Usa textContent para mejor rendimiento
  }

  // ---- Sintaxis "real" minimax (HTML,CSS,JS por regex, rápido) ----
  function highlightSyntax() {
    const val = textArea.value;
    let file = files[currentTab];
    let ext = file.name.split(".").pop();

    if (!val) {
      highlightEl.innerHTML = "";
      highlightEl.style.display = "none";
      return;
    } else {
      highlightEl.style.display = "block";
    }

    let html = escapeHTML(val);

    if (ext === "html") {
      // Resalta comentarios
      html = html.replace(
        /(&lt;!--[\s\S]*?--&gt;)/g,
        '<span class="syntax-comment">$1</span>'
      );
      // Solo resalta tags que tengan un nombre de etiqueta válido (>=1 caracter alfanumérico)
      html = html.replace(
        /(&lt;\/?)([a-zA-Z][\w\-]*)([^&]*?)(&gt;)/g,
        function(_, open, tag, rest, close) {
          return (
            open +
            '<span class="syntax-tag">' + tag + '</span>' +
            rest +
            close
          );
        }
      );
      // Atributos y valores entre comillas dentro de los tags
      html = html.replace(
        /(\w+)=("[^"]*"|'[^']*')/g,
        '<span class="syntax-attr">$1</span>=<span class="syntax-string">$2</span>'
      );
      // NO intentes resaltar "<>" o "< >" ni overlays raros por tags sin nombre
    } else if (ext === "js") {
      html = html
        .replace(/(\/\/[^\n]*)/g, '<span class="syntax-comment">$1</span>')
        .replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, '<span class="syntax-jsstring">$&</span>')
        .replace(/\b(const|let|var|function|if|for|while|return|else|=>|import|from|export|class|new|try|catch|switch|case|break|continue|default|async|await|of|in)\b/g, '<span class="syntax-keyword">$1</span>')
        .replace(/\b(document|window|console|Array|String|Number|Boolean|Function|Object|RegExp|Date|Math|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval)\b/g, '<span class="syntax-builtin">$1</span>')
        .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="syntax-number">$1</span>');
    } else if (ext === "css") {
      html = html
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-comment">$&</span>')
        .replace(/(\.[\w\-]+|\#[\w\-]+)/g, '<span class="syntax-selector">$1</span>')
        .replace(/([a-z-]+)(\:)/g, '<span class="syntax-property">$1</span>$2')
        .replace(/#[a-fA-F0-9]{3,6}\b/g, '<span class="syntax-hex">$&</span>')
        .replace(/\b(\d+(\.\d+)?(px|em|rem|vh|vw|%|s|ms)?)\b/g, '<span class="syntax-number">$1</span>');
    }
    highlightEl.innerHTML = html;
  }
  function escapeHTML(str){
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // ---- Autocompletado Express JS/HTML5/CSS básico simulado ----
  const htmlSnips = [
    "<div>", "<span>", "<img>", "<a href=\"\">", "<h1>", "<script>", "<style>", "<ul>", "<li>", "<input>", "<!-- -->"
  ];
  const jsSnips = [
    "function", "const ", "let ", "console.log()", "document.querySelector('')", "for (let i = 0; i < ; i++) {}", "if () {}\n", "return"
  ];
  const cssSnips = [
    "color: ;", "background: ;", "font-family: ;", "margin: ;", "padding: ;", "display: ;", "position: ;"
  ];
  function updateAutocomplete(){
    const pos = textArea.selectionStart;
    const before = textArea.value.slice(0,pos);
    let ext = files[currentTab].name.split(".").pop();
    let suggs = [];
    if(ext==="html") suggs=htmlSnips;
    else if(ext==="js") suggs=jsSnips;
    else if(ext==="css") suggs=cssSnips;
    const word = before.split(/[\s<>'"=\(\)\{\};:]+/).pop() || "";
    if(word.length === 0) { autocompleteEl.style.display="none"; return; }
    let found = suggs.filter(x => x.toLowerCase().startsWith(word.toLowerCase()));
    if(found.length===0){ autocompleteEl.style.display="none"; return; }
    autocompleteEl.innerHTML = "<ul>"+found.map((t,i)=>`<li${i==0?' class="selected"':''}>${t}</li>`).join("")+"</ul>";
    
    // Mejorar posicionamiento del autocompletado
    const rect = textArea.getBoundingClientRect();
    const lineHeight = parseInt(window.getComputedStyle(textArea).lineHeight) || 20;
    const textBeforeCursor = textArea.value.substring(0, pos);
    const lines = textBeforeCursor.split('\n');
    const currentLineNumber = lines.length;
    const currentLineText = lines[lines.length - 1];
    
    // Calcular posición basada en la posición del cursor
    const topOffset = (currentLineNumber * lineHeight) - textArea.scrollTop;
    const leftOffset = (currentLineText.length * 8) + 60; // Aproximación de ancho de carácter
    
    autocompleteEl.style.top = `${topOffset}px`;
    autocompleteEl.style.left = `${leftOffset}px`;
    autocompleteEl.style.display = "block";
  }
  textArea.addEventListener("keydown",function(e){
    if(autocompleteEl.style.display!=="block") return;
    const lis = autocompleteEl.querySelectorAll("li");
    let sel = Array.from(lis).findIndex(x=>x.classList.contains("selected"));
    if(e.key==="ArrowDown"){e.preventDefault();
      if(sel>=0) lis[sel].classList.remove("selected");
      sel=(sel+1)%lis.length; lis[sel].classList.add("selected");
    } else if(e.key==="ArrowUp"){e.preventDefault();
      if(sel>=0) lis[sel].classList.remove("selected");
      sel=(sel-1+lis.length)%lis.length; lis[sel].classList.add("selected");
    } else if(e.key==="Tab"||e.key==="Enter"){
      e.preventDefault();
      if(sel>=0){
        insertSnippet(lis[sel].textContent);
        autocompleteEl.style.display="none";
      }
    } else if(e.key==="Escape"){
      autocompleteEl.style.display="none";
    }
  });
  function insertSnippet(snippet){
    const pos = textArea.selectionStart;
    const before = textArea.value.slice(0, pos);
    const after = textArea.value.slice(pos);
    const word = before.split(/[\s<>'"=\(\)\{\};:]+/).pop() || "";
    const newValue = before.slice(0, before.length-word.length) + snippet + after;
    textArea.value = newValue;
    const newPos = before.length-word.length+snippet.length;
    textArea.setSelectionRange(newPos, newPos);
    highlightSyntax();
    updateGutter();
    // Trigger input event para asegurar que todo se actualiza
    textArea.dispatchEvent(new Event('input'));
  }

  // ---- Botón guardar ----
  saveBtn.onclick = function(){
    saveCurrentFile(textArea.value);
    statusEl.textContent = `✅ Guardado (${files[currentTab].name})`;
    setTimeout(()=>{statusEl.textContent = files[currentTab].name;},1400);
  };

  // ---- Drag & close ----
  let offsetX=0, offsetY=0,dragging=false;
  header.onmousedown = function(e){
    dragging=true;
    offsetX=e.clientX-modal.offsetLeft; offsetY=e.clientY-modal.offsetTop;
    document.onmousemove = function(e){
      if(dragging){modal.style.left = (e.clientX-offsetX)+"px"; modal.style.top = (e.clientY-offsetY)+"px";}
    };
    document.onmouseup = function(){dragging=false; document.onmousemove=null;};
  };
  closeBtn.onclick = function(){modal.style.display="none";}

  // ---- Lanzar desde el grid de apps ----
  document.getElementById("editorApp").addEventListener("click",function(){
    modal.style.display="flex";
    modal.style.zIndex=56555;modal.style.top="90px";modal.style.left="260px";
    updateEditor();
    renderTabs();
    renderFiles();
  });
  
  // --- Overlay & focus ---
  // Configurar el overlay para que sea no-interactivo y puramente visual
  highlightEl.setAttribute("aria-hidden", "true");
  highlightEl.style.pointerEvents = "none";
  highlightEl.style.userSelect = "none";
  highlightEl.tabIndex = -1;
  highlightEl.style.position = "absolute";
  highlightEl.style.zIndex = 1;
  highlightEl.style.top = highlightEl.style.left = highlightEl.style.right = highlightEl.style.bottom = "0";
  highlightEl.style.width = "100%";
  highlightEl.style.height = "100%";
  highlightEl.setAttribute("contenteditable", "false");
  highlightEl.setAttribute("unselectable", "on");
  
  // Asegurar que el textarea está por encima y su texto es VISIBLE
  textArea.style.position = "absolute";
  textArea.style.zIndex = 2;
  textArea.style.background = "transparent";
  textArea.style.color = "#fff"; // Texto visible en lugar de transparente
  textArea.style.caretColor = "#fff";
  textArea.style.width = "100%";
  textArea.style.height = "100%";
  
  // Focus automático
  modal.addEventListener("click",() => {textArea.focus();})
  // Inicializar
  updateEditor();
});
