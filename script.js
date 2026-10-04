const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expensesElement = document.getElementById("expenses");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let editingId = null;


transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = document.getElementById("description").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;

    if (description === "" || amount <= 0 || date === "") {
        alert("Please fill all fields correctly.");
        return;
    }

    // EDIT MODE
    if (editingId !== null) {

        const transaction = transactions.find(function(item) {
            return item.id === editingId;
        });

        transaction.description = description;
        transaction.amount = amount;
        transaction.type = type;
        transaction.date = date;

        editingId = null;

    } 
    
    // ADD MODE
    else {

        const transaction = {
            id: Date.now(),
            description: description,
            amount: amount,
            type: type,
            date: date
        };

        transactions.push(transaction);
    }

    saveTransactions();
    updateTransactions();

    transactionForm.reset();
});


function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


function updateTransactions() {

    transactionList.innerHTML = "";

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }

        const transactionItem = document.createElement("li");

        transactionItem.classList.add(
            transaction.type === "income"
                ? "income-item"
                : "expense-item"
        );

        transactionItem.innerHTML = `
            <span>
                <strong>${transaction.description}</strong><br>
                <small>${transaction.date}</small>
            </span>

            <span class="amount">
                ${transaction.type === "income" ? "+" : "-"} ₹${transaction.amount}
            </span>

            <div>
                <button onclick="editTransaction(${transaction.id})">
                    Edit
                </button>

                <button onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            </div>
        `;

        transactionList.appendChild(transactionItem);

    });

    const balance = totalIncome - totalExpenses;

    incomeElement.textContent = `₹${totalIncome}`;
    expensesElement.textContent = `₹${totalExpenses}`;
    balanceElement.textContent = `₹${balance}`;
}


function editTransaction(id) {

    const transaction = transactions.find(function(item) {
        return item.id === id;
    });

    document.getElementById("description").value = transaction.description;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("type").value = transaction.type;
    document.getElementById("date").value = transaction.date;

    editingId = id;

    document.getElementById("description").focus();
}


function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();
    updateTransactions();
}


updateTransactions();