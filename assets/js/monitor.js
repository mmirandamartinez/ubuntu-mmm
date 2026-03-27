document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("monitorModal");
  const monitorHeader = document.getElementById("monitorHeader");
  const closeBtn = document.getElementById("monitor-close");
  const tabs = document.querySelectorAll(".monitor-tab");
  const tabContents = {
    procesos: document.getElementById("monitor-procesos"),
    recursos: document.getElementById("monitor-recursos"),
    sistema: document.getElementById("monitor-sistema"),
  };

  // --- Ventana drag ---
  let dragging = false, dx = 0, dy = 0;
  monitorHeader.addEventListener("mousedown", function(e) {
    dragging = true;
    dx = e.clientX - modal.offsetLeft;
    dy = e.clientY - modal.offsetTop;
    document.onmousemove = function(ev) {
      if (!dragging) return;
      modal.style.left = (ev.clientX - dx) + "px";
      modal.style.top = Math.max(12, ev.clientY - dy) + "px";
    }
    document.onmouseup = function() {
      dragging = false;
      document.onmousemove = null;
    }
  });

  closeBtn.onclick = () => modal.style.display = "none";

  // --- Tabs switching ---
  tabs.forEach(tab => {
    tab.onclick = function() {
      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      Object.values(tabContents).forEach(tc => (tc.style.display = "none"));
      tabContents[this.dataset.tab].style.display = "block";
    }
  });

  // --- Procesos simulados ---
  function randomProcState() {
    const states = ["Activo", "En espera", "Finalizado", "Dormido"];
    return states[Math.floor(Math.random() * states.length)];
  }
  let fakePID = 1200;
  function randomProcList() {
    const procs = [
      ["firefox", "firefox.png"],
      ["nautilus", "carpeta.png"],
      ["bash", "terminal.png"],
      ["python3", "python.png"],
      ["node", "settings.png"],
      ["discord", "Discord.png"],
      ["spotify", "spotify.png"],
      ["code", "ajustes.png"],
      ["htop", "ajustes.png"],
      ["Xorg", "ajustes.png"],
    ];
    let arr = [];
    let time = Date.now() % 300000;
    for (let i = 0; i < 8; i++) {
      let [nombre, _] = procs[Math.floor(Math.random() * procs.length)];
      arr.push({
        nombre: nombre,
        pid: fakePID + i,
        cpu: (Math.random() * 23 + 1).toFixed(1),
        ram: (Math.random() * 620 + 20).toFixed(0),
        estado: randomProcState(),
      });
    }
    return arr;
  }

  function renderProcesoTable(procs){
    const tbody = modal.querySelector(".monitor-procesos-table tbody");
    tbody.innerHTML = "";
    for(const p of procs){
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.pid}</td>
        <td><div style="display: flex;align-items:center;">
          <div style="background:#7d42a1cc;height:15px;width:${Math.min(p.cpu,100) * 1.1}px;
          border-radius:4px;margin-right:7px;min-width:25px;"></div>
          <span>${p.cpu} %</span>
        </div></td>
        <td><div style="display: flex;align-items:center;">
          <div style="background:#54b26699;height:15px;width:${p.ram/6}px;border-radius:4px;margin-right:7px;min-width:18px;"></div>
          <span>${p.ram} MB</span>
        </div></td>
        <td>${p.estado}</td>
      `;
      tbody.appendChild(row);
    }
  }

  // --- Simulación para pestaña de Recursos ---
  function rndBarUsage(init, vari, max){
    let value = init + Math.random() * vari;
    return Math.min(Math.max(value, 2), max);
  }
  let cpu=14, ram=37, net=22;
  function animateRecursos(){
    cpu = rndBarUsage(cpu,4,98);
    ram = rndBarUsage(ram,3,96);
    net = rndBarUsage(net,10,95);

    const barCPU = document.getElementById("monitorBarCPU");
    const barRAM = document.getElementById("monitorBarRAM");
    const barNet = document.getElementById("monitorBarNet");
    const txtCPU = document.getElementById("monitorCPUText");
    const txtRAM = document.getElementById("monitorRAMText");
    const txtNet = document.getElementById("monitorNetText");

    barCPU.style.width = cpu.toFixed(0) + "%";
    barRAM.style.width = ram.toFixed(0) + "%";
    barNet.style.width = net.toFixed(0) + "%";
    txtCPU.textContent = cpu.toFixed(1) + "%";
    txtRAM.textContent = ram.toFixed(1) + "%";
    txtNet.textContent = net.toFixed(1) + "%";

    setTimeout(animateRecursos, 700+Math.random()*600);
  }

  // --- Sistema/Uptime ---
  const sysStartTime = Date.now();
  function updateUptime(){
    let secs = Math.floor((Date.now()-sysStartTime)/1000);
    let d = Math.floor(secs/86400), h = Math.floor(secs%86400/3600), m = Math.floor(secs%3600/60), s = secs%60;
    let uptime = d > 0 ? `${d}d ` : "";
    uptime += h > 0 ? `${h}h ` : "";
    uptime += `${m}m ${s}s`;
    document.getElementById("sysInfoUptime").textContent = uptime;
    setTimeout(updateUptime, 1000);
  }

  // --- Manejador de inicio (auto update) ---
  let procesos = randomProcList();
  renderProcesoTable(procesos);
  animateRecursos();
  updateUptime();
  setInterval(() => { 
    procesos = randomProcList(); 
    renderProcesoTable(procesos); 
  }, 4300);

  // --- Abrir desde el grid de apps ---
  document.getElementById("monitorApp").addEventListener("click", function(){
    modal.style.display = "flex";
    modal.style.zIndex = 55555;
    modal.style.top = "90px";
    modal.style.left = "240px";
  });
});