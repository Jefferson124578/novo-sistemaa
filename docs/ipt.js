let inventory = JSON.parse(localStorage.getItem("inventory")) || {}; // Carrega o estoque do localStorage
let history = JSON.parse(localStorage.getItem("history")) || [];  // Carrega o histórico do localStorage
let sharedData = JSON.parse(localStorage.getItem("sharedData")) || []; // Carrega os dados compartilhados
let alertMessage = document.getElementById("alertMessage");

function addItem() {
    const code = document.getElementById("productCode").value;
    const name = document.getElementById("itemName").value;
    const quantity = parseInt(document.getElementById("itemQuantity").value);
    const responsible = document.getElementById("responsiblePerson").value;

    if (!code || !name || !quantity || !responsible) {
        showAlert("Todos os campos são obrigatórios.", true);
        return;
    }

    if (quantity <= 0) {
        showAlert("A quantidade deve ser maior que zero.", true);
        return;
    }

    if (inventory[code]) {
        inventory[code].quantity += quantity;
    } else {
        inventory[code] = { name, quantity };
    }

    addHistory(code, name, "Entrada", quantity, responsible);
    saveData();
    updateTable();
    clearInputFields();
    showAlert("Produto cadastrado com sucesso!", false);
}

function addHistory(code, name, type, quantity, responsible) {
    const date = new Date().toLocaleString();
    history.push({ code, name, type, quantity, responsible, date });
    saveData();
    updateHistoryTable();
}

function saveData() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("sharedData", JSON.stringify(sharedData));
}

function showAlert(message, isError) {
    alertMessage.style.display = "block";
    alertMessage.textContent = message;
    alertMessage.className = isError ? "alert error" : "alert success";
    setTimeout(() => {
        alertMessage.style.display = "none";
    }, 3000);
}

function updateTable() {
    const inventoryBody = document.getElementById("inventoryBody");
    inventoryBody.innerHTML = "";
    for (let code in inventory) {
        const item = inventory[code];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${code}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="btn-entry" onclick="updateItem('${code}')">Entrada</button>
                <button class="btn-exit" onclick="removeItem('${code}')">Saída</button>
                <button class="btn-edit" onclick="editItem('${code}')">Editar</button>
            </td>
        `;
        inventoryBody.appendChild(row);
    }
}

function showTab(tabId) {
    document.getElementById("estoque").style.display = tabId === 'estoque' ? 'block' : 'none';
    document.getElementById("historico").style.display = tabId === 'historico' ? 'block' : 'none';
    document.getElementById("compartilhado").style.display = tabId === 'compartilhado' ? 'block' : 'none';

    document.querySelectorAll('.menu button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tabId}Tab`).classList.add('active');
}

function filterStock() {
    const filter = document.getElementById("filterProduct").value.toLowerCase();
    const inventoryBody = document.getElementById("inventoryBody");
    inventoryBody.innerHTML = "";

    for (let code in inventory) {
        if (inventory[code].name.toLowerCase().includes(filter)) {
            const item = inventory[code];
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${code}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>
                    <button class="btn-entry" onclick="updateItem('${code}')">Entrada</button>
                    <button class="btn-exit" onclick="removeItem('${code}')">Saída</button>
                    <button class="btn-edit" onclick="editItem('${code}')">Editar</button>
                </td>
            `;
            inventoryBody.appendChild(row);
        }
    }
}

function editItem(code) {
    const item = inventory[code];
    const newQuantity = prompt("Informe a nova quantidade:", item.quantity);
    const newName = prompt("Informe o novo nome do item:", item.name);

    if (newQuantity && !isNaN(newQuantity) && newQuantity > 0 && newName) {
        item.name = newName;
        item.quantity = parseInt(newQuantity);
        saveData();
        updateTable();
        showAlert("Item atualizado com sucesso!", false);
    } else {
        showAlert("Falha na atualização. Dados inválidos.", true);
    }
}

function updateItem(code) {
    const quantity = prompt("Informe a quantidade para entrada:");
    if (quantity && !isNaN(quantity) && quantity > 0) {
        inventory[code].quantity += parseInt(quantity);
        addHistory(code, inventory[code].name, "Entrada", quantity, "Sistema");
        saveData();
        updateTable();
        showAlert("Entrada registrada com sucesso!", false);
    } else {
        showAlert("Quantidade inválida!", true);
    }
}

function removeItem(code) {
    const quantity = prompt("Informe a quantidade para saída:");
    if (quantity && !isNaN(quantity) && quantity > 0 && inventory[code].quantity >= quantity) {
        inventory[code].quantity -= parseInt(quantity);
        addHistory(code, inventory[code].name, "Saída", quantity, "Sistema");
        saveData();
        updateTable();
        showAlert("Saída registrada com sucesso!", false);
    } else {
        showAlert("Quantidade inválida ou estoque insuficiente!", true);
    }
}

function updateHistoryTable() {
    const historyBody = document.getElementById("historyBody");
    historyBody.innerHTML = "";
    history.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.code}</td>
            <td>${entry.name}</td>
            <td>${entry.type}</td>
            <td>${entry.quantity}</td>
            <td>${entry.responsible}</td>
            <td>${entry.date}</td>
        `;
        historyBody.appendChild(row);
    });
}

function filterHistory() {
    const filter = document.getElementById("filterHistory").value.toLowerCase();
    const historyBody = document.getElementById("historyBody");
    historyBody.innerHTML = "";

    history.forEach(entry => {
        if (
            entry.code.toLowerCase().includes(filter) ||
            entry.name.toLowerCase().includes(filter) ||
            entry.responsible.toLowerCase().includes(filter)
        ) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.code}</td>
                <td>${entry.name}</td>
                <td>${entry.type}</td>
                <td>${entry.quantity}</td>
                <td>${entry.responsible}</td>
                <td>${entry.date}</td>
            `;
            historyBody.appendChild(row);
        }
    });
}

function clearInputFields() {
    document.getElementById("productCode").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("itemQuantity").value = "";
    document.getElementById("responsiblePerson").value = "";
}

// Inicializa a página
updateTable();
updateHistoryTable();
