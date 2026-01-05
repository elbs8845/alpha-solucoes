const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if(!loggedUser){ window.location.href="login.html"; }

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

window.onload = function(){
  document.querySelector('header h1').textContent = "Alpha Soluções - "+loggedUser.role.toUpperCase();
  renderLeads(); renderVendas(); renderAgenda(); updateStats();
}

// --- Leads ---
function addLead(){
  const nome = document.getElementById('lead-nome').value.trim();
  const email = document.getElementById('lead-email').value.trim();
  const telefone = document.getElementById('lead-telefone').value.trim();
  const status = document.getElementById('lead-status').value;
  const origem = document.getElementById('lead-origem').value;
  const observacoes = document.getElementById('lead-observacoes').value.trim();
  if(!nome||!email||!telefone){ alert("Preencha Nome, Email e Telefone!"); return; }
  const lead={nome,email,telefone,status,origem,observacoes,owner:loggedUser.username};
  leads.push(lead);
  const allLeads = JSON.parse(localStorage.getItem('leads'))||[];
  allLeads.push(lead); localStorage.setItem('leads',JSON.stringify(allLeads));
  document.getElementById('lead-nome').value=''; document.getElementById('lead-email').value=''; 
  document.getElementById('lead-telefone').value=''; document.getElementById('lead-status').value='Novo';
  document.getElementById('lead-origem').value='Instagram'; document.getElementById('lead-observacoes').value='';
  renderLeads(); updateStats();
}
function renderLeads(){
  const ul=document.getElementById('leads-list'); ul.innerHTML='';
  leads.forEach(l=>{
    const li=document.createElement('li');
    li.innerHTML=`<strong>${l.nome}</strong><br>Email: ${l.email}<br>Tel: ${l.telefone}<br>Status: ${l.status}<br>Origem: ${l.origem}<br>Obs: ${l.observacoes}`;
    ul.appendChild(li);
  });
}

// --- Vendas ---
function addVenda(){
  const cliente=document.getElementById('venda-cliente').value.trim();
  const produto=document.getElementById('venda-produto').value.trim();
  const valor=Number(document.getElementById('venda-valor').value);
  const data=document.getElementById('venda-data').value;
  const status=document.getElementById('venda-status').value;
  if(!cliente||!produto||valor<=0||!data){ alert("Preencha todos os campos!"); return; }
  const venda={cliente,produto,valor,data,status,owner:loggedUser.username};
  vendas.push(venda);
  const allVendas=JSON.parse(localStorage.getItem('vendas'))||[];
  allVendas.push(venda); localStorage.setItem('vendas',JSON.stringify(allVendas));
  document.getElementById('venda-cliente').value=''; document.getElementById('venda-produto').value='';
  document.getElementById('venda-valor').value=''; document.getElementById('venda-data').value='';
  document.getElementById('venda-status').value='Pendente';
  renderVendas(); updateStats();
}
function renderVendas(){
  const ul=document.getElementById('vendas-list'); ul.innerHTML='';
  vendas.forEach(v=>{
    const li=document.createElement('li');
    li.innerHTML=`<strong>${v.cliente}</strong> - ${v.produto}<br>R$: ${v.valor.toFixed(2)} | Data: ${v.data} | Status: ${v.status}`;
    ul.appendChild(li);
  });
}

// --- Agendamentos ---
function addAgendamento(){
  const nome=document.getElementById('agenda-nome').value.trim();
  const data=document.getElementById('agenda-data').value;
  if(!nome||!data){ alert("Preencha todos os campos!"); return; }
  const agenda={nome,data,owner:loggedUser.username};
  agendamentos.push(agenda);
  const allAgendas=JSON.parse(localStorage.getItem('agendamentos'))||[];
  allAgendas.push(agenda); localStorage.setItem('agendamentos',JSON.stringify(allAgendas));
  document.getElementById('agenda-nome').value=''; document.getElementById('agenda-data').value='';
  renderAgenda();
}
function renderAgenda(){
  const ul=document.getElementById('agenda-list'); ul.innerHTML='';
  agendamentos.forEach(a=>{
    const li=document.createElement('li');
    li.textContent=`${a.nome} - ${new Date(a.data).toLocaleString()}`;
    ul.appendChild(li);
  });
}

// --- Usuários ---
function addUser(){
  const username=document.getElementById('new-username').value.trim();
  const password=document.getElementById('new-password').value.trim();
  const role=document.getElementById('new-role').value;
  if(!username||!password){alert("Preencha todos os campos!"); return;}
  if(allUsers.find(u=>u.username===username)){alert("Usuário já existe!"); return;}
  const newUser={username,password,role};
  allUsers.push(newUser); localStorage.setItem('users',JSON.stringify(allUsers));
  document.getElementById('new-username').value=''; document.getElementById('new-password').value='';
  renderUserList();
}
function renderUserList(){
  const ul=document.getElementById('user-list'); ul.innerHTML='';
  allUsers.forEach(u=>{ const li=document.createElement('li'); li.textContent=`${u.username} - ${u.role}`; ul.appendChild(li); });
}

// --- Estatísticas ---
function updateStats(){
  document.getElementById('total-leads').textContent=leads.length;
  document.getElementById('total-vendas').textContent=vendas.length;
  const totalVendas=vendas.reduce((sum,v)=>sum+v.valor,0);
  let percent = metaMensal>0 ? (totalVendas/metaMensal)*100 : 0;
  percent = percent>100 ? 100 : percent;
  document.getElementById('meta-percent').textContent=percent.toFixed(2)+'%';
}
