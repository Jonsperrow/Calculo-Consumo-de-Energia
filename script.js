const users = JSON.parse(localStorage.getItem("users")) || [];
const appliances = [
  { name: "Aspirador de pó residencial", power: 600 },
  { name: "Assadeira grande", power: 1000 },
  { name: "Assadeira pequena", power: 500 },
  { name: "Ar condicionado 7500 BTU", power: 748 },
  { name: "Ar condicionado 8000 BTU", power: 800 },
  { name: "Ar condicionado 10000 BTU", power: 963 },
  { name: "Ar condicionado 12000 BTU", power: 3514 },
  { name: "Batedeira de bolo", power: 100 },
  { name: "Bomba d'água 1/4 CV monofásica", power: 390 },
  { name: "Bomba d'água 1/3 CV monofásica", power: 520 },
  { name: "Bomba d'água 1/2 CV trifásica", power: 570 },
  { name: "Bomba d'água 3/4 CV trifásica", power: 820 },
  { name: "Bomba d'água 1 CV monofásica", power: 1100 },
  { name: "Cafeteira elétrica pequena uso doméstico", power: 600 },
  { name: "Chuveiro elétrico 127V", power: 4400 },
  { name: "Chuveiro elétrico 220V", power: 6000 },
  { name: "Conjunto de som", power: 100 },
  { name: "Espremedor de frutas", power: 200 },
  { name: "Ferro elétrico simples de passar roupa", power: 500 },
  { name: "Fogão elétrico de 4 bocas", power: 1500 },
  { name: "Forno de microondas", power: 750 },
  { name: "Geladeira Comum", power: 250 },
  { name: "Grill", power: 1200 },
  { name: "Impressora comum", power: 90 },
  { name: "Liquidificador doméstico", power: 200 },
  { name: "Lâmpada de 15W", power: 15 },
  { name: "Lâmpada de 20W", power: 20 },
  { name: "Lâmpada de 25W", power: 25 },
  { name: "Lâmpada de 40W", power: 40 },
  { name: "Lâmpada de 60W", power: 60 },
  { name: "Máquina para costurar", power: 100 },
  { name: "Máquina de lavar roupas", power: 1500 },
  { name: "Máquina de xerox pequena", power: 1500 },
  { name: "Micro computador", power: 250 },
  { name: "Micro forno elétrico", power: 1000 },
  { name: "Panela elétrica", power: 1200 },
  { name: "Sanduicheira", power: 640 },
  { name: "Secador de cabelos", power: 1250 },
  { name: "Televisor", power: 150 },
  { name: "Ventilador grande", power: 250 },
  { name: "Ventilador médio", power: 200 },
  { name: "Ventilador pequeno", power: 70 },
  { name: "Carregador de celular", power: 25 },
  { name: "Vídeo game", power: 300 },
];

// Preencher tabela de aparelhos dinamicamente
const tableBody = document.getElementById("applianceTable");
appliances.forEach((appliance, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${appliance.name}</td>
    <td>${appliance.power}</td>
    <td><input type="number" id="quantity-${index}" min="0" value="0" /></td>
    <td><input type="number" id="days-${index}" min="0" max="31" value="0" /></td>
    <td><input type="number" id="hours-${index}" min="0" step="0.1" value="0" /></td>
  `;
  tableBody.appendChild(row);
});

// Função para salvar no LocalStorage
function saveToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}

// Atualizar lista de usuários
function updateUserList() {
  const userList = document.getElementById("userList");
  userList.innerHTML = "";

  users.sort((a, b) => a.consumption - b.consumption);
  users.forEach(user => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${user.name} - Consumo Total: ${user.consumption.toFixed(2)} kWh 
      <button class="user-delete-btn" onclick="removeUser('${user.name}')">Excluir</button>
    `;
    userList.appendChild(li);
  });

  // Atualizar campeão
  const champion = users[0];
  document.getElementById("champion").textContent = champion
    ? `Campeão: ${champion.name}`
    : "Campeão: --";
}

// Carregar lista ao iniciar
updateUserList();

// Remover usuário
function removeUser(username) {
  const index = users.findIndex(user => user.name === username);
  if (index !== -1) {
    users.splice(index, 1);
    saveToLocalStorage();
    updateUserList();
  }
}

// Calcular Consumo
document.getElementById("calculateBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Digite o nome do usuário!");
    return;
  }

  if (users.some(user => user.name.toLowerCase() === username.toLowerCase())) {
    alert("Este usuário já foi cadastrado!");
    return;
  }

  let totalDailyConsumption = 0;
  let totalConsumption = 0;

  appliances.forEach((appliance, index) => {
    const quantity = parseInt(document.getElementById(`quantity-${index}`).value) || 0;
    const days = parseInt(document.getElementById(`days-${index}`).value) || 0;
    const hours = parseFloat(document.getElementById(`hours-${index}`).value) || 0;

    const dailyConsumption = (appliance.power / 1000) * hours * quantity;
    totalDailyConsumption += dailyConsumption;
    totalConsumption += dailyConsumption * days;
  });

  const pricePerKwh = parseFloat(document.getElementById("pricePerKwh").value) || 0;
  const dailyCost = totalDailyConsumption * pricePerKwh;
  const totalCost = totalConsumption * pricePerKwh;

  document.getElementById("totalConsumption").innerText = `Consumo total (kWh): ${totalConsumption.toFixed(2)}`;
  document.getElementById("totalCost").innerText = `Gasto total (R$): ${totalCost.toFixed(2)}`;
  document.getElementById("dailyConsumption").innerText = `Consumo diário (kWh): ${totalDailyConsumption.toFixed(2)}`;
  document.getElementById("dailyCost").innerText = `Gasto diário (R$): ${dailyCost.toFixed(2)}`;
  document.getElementById("result").classList.remove("hidden");

  // Adicionar usuário à lista
  users.push({ name: username, consumption: totalConsumption });
  saveToLocalStorage();
  updateUserList();
});