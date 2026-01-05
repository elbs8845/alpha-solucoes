const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if(!loggedUser){ window.location.href = "login.html"; }

const metaMensal = 300000;

let leads = JSON.parse(localStorage.getItem('leads')) || [];
let vendas = JSON.parse(localStorage.getItem('vendas')) || [];
let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
let allUsers = JSON.parse(localStorage.getItem('users')) || [];

if(loggedUser.role === "vendedor"){
  leads = leads.filter(l => l.owner === loggedUser.username);
  vendas = vendas.filter(v => v.owner === loggedUser.username);
  agendamentos = agendamentos.filter(a => a.owner === loggedUser.username);
}

if(loggedUser.role === "admin"){
  document.getElementById('user-management').style.display = "block";
  renderUserList();
}

window.onload = function() {
  document.querySelector('header h1').textContent = "Alpha Soluções - " + loggedUser.role.toUpperCase();
  renderLeads(); renderVendas(); renderAgenda(); updateStats();
}

function addLead() {
  const name = document.getElementById('lead-name').value;
  if(name){
    const lead = { name, owner: loggedUser.username };
    leads.push(lead);
    const allLeads = JSON.parse(localStorage.getItem('leads')) || [];
    allLeads.push(lead);
    localStorage.setItem('leads', JSON.stringify(allLeads));
    document.getElementById('lead-name').value = '';
    renderLeads(); updateStats();
  }
}

function addVenda() {
  const name = document.getElementById('venda-name').value;
  const valor = Number(document.getElementById('venda-valor').value);
  if(name && valor > 0){
    const venda = { name, valor, owner: loggedUser.username };
    vendas.push(venda);
    const allVendas = JSON.parse(localStorage.getItem('vendas')) || [];
    allVendas.push(venda);
    localStorage.setItem('vendas', JSON.stringify(allVendas));
    document.getElementById('venda-name').value = '';
    document.getElementById('venda-valor').value = '';
    renderVendas(); updateStats();
  }
}

function addAgendamento() {
  const name = document.getElementById('agenda-nome').value;
  const data = document.getElementById('agenda-data').value;
  if(name && data){
    const agenda = { name, data, owner: loggedUser.username };
    agendamentos.push(agenda);
    const allAgendas = JSON.parse(localStorage.getItem('agendamentos')) || [];
    allAgendas.push(agenda);
    localStorage.setItem('agendamentos', JSON.stringify(allAgendas));
    document.getElementById('agenda-nome').value = '';
    document.getElementById('agenda-data').value = '';
    renderAgenda();
  }
}

function renderLeads(){ const ul=document.getElementById('leads-list'); ul.innerHTML=''; leads.forEach(l=>{ const li=document.createElement('li'); li.textContent=l.name; ul.appendChild(li); }); }
function renderVendas(){ const ul=document.getElementById('vendas-list'); ul.innerHTML=''; vendas.forEach(v=>{ const li=document.createElement('li'); li.textContent=`${v.name} - R$ ${v.valor.toFixed(2)}`; ul.appendChild(li); }); }
function renderAgenda(){ const ul=document.getElementById('agenda-list'); ul.innerHTML=''; agendamentos.forEach(a=>{ const li=document.createElement('li'); li.textContent=`${a.name} - ${new Date(a.data).toLocaleString()}`; ul.appendChild(li); }); }
function updateStats(){ document.getElementById('total-leads').textContent = leads.length; document.getElementById('total-vendas').textContent = vendas.length; const totalVendas=vendas.reduce((sum,v)=>sum+v.valor,0); let percent = metaMensal>0 ? (totalVendas/metaMensal)*100 : 0; percent = percent>100 ? 100 : percent; document.getElementById('meta-percent').textContent = percent.toFixed(2)+'%'; }

function addUser(){ const username=document.getElementById('new-username').value.trim(); const password=document.getElementById('new-password').value.trim(); const role=document.getElementById('new-role').value; if(!username||!password){alert("Preencha todos os campos!"); return;} if(allUsers.find(u=>u.username===username)){alert("Usuário já existe!"); return;} const newUser={username,password,role}; allUsers.push(newUser); localStorage.setItem('users',JSON.stringify(allUsers)); document.getElementById('new-username').value=''; document.getElementById('new-password').value=''; renderUserList(); }
function renderUserList(){ const ul=document.getElementById('user-list'); ul.innerHTML=''; allUsers.forEach(u=>{ const li=document.createElement('li'); li.textContent=`${u.username} - ${u.role}`; ul.appendChild(li); }); }
