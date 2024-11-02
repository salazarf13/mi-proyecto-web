document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const userRole = document.getElementById("userRole").value;
    addUser({ username, role: userRole });
    this.reset();
    toggleView("homeView");
});

document.getElementById("bookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;

    addBook({ title, author, reserved: false, borrowedBy: null, returnInfo: null });
    this.reset();
});

document.getElementById("viewBooksBtn").addEventListener("click", function () {
    toggleView("booksView");
    displayBooks();
});

document.getElementById("searchBookBtn").addEventListener("click", function () {
    toggleView("searchView");
});

document.getElementById("backBtn").addEventListener("click", function () {
    toggleView("homeView");
});

document.getElementById("backSearchBtn").addEventListener("click", function () {
    toggleView("homeView");
});

document.getElementById("searchBtn").addEventListener("click", function () {
    const searchTitle = document.getElementById("searchTitle").value.trim();
    searchBook(searchTitle);
});

document.getElementById("actionCancelBtn").addEventListener("click", function () {
    toggleView("searchView");
    document.getElementById("actionName").value = "";
    document.getElementById("actionDate").value = "";
    clearMessage();
});

document.getElementById("actionConfirmBtn").addEventListener("click", function () {
    const actionType = document.getElementById("actionTitle").dataset.actionType;
    const personName = document.getElementById("actionName").value;
    const actionDate = document.getElementById("actionDate").value;

    if (actionType === "loan") {
        books[selectedBookIndex].borrowedBy = personName;
    } else if (actionType === "return") {
        books[selectedBookIndex].returnInfo = { person: personName, date: actionDate };
        books[selectedBookIndex].borrowedBy = null;
        displayMessage("Libro devuelto con éxito");
    }

    toggleView("searchView");
    searchBook(books[selectedBookIndex].title);
});

let users = [];
let books = [];
let selectedBookIndex = null;

function addUser(user) {
    users.push(user);
}

function addBook(book) {
    books.push(book);
}

function displayBooks() {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";
    books.forEach((book, index) => {
        const li = document.createElement("li");
        li.textContent = `${book.title} - ${book.author}`;
        bookList.appendChild(li);
    });
}

function searchBook(title) {
    const searchResultDiv = document.getElementById("searchResult");
    searchResultDiv.innerHTML = "";

    const bookIndex = books.findIndex(book => book.title.toLowerCase() === title.toLowerCase());

    if (bookIndex === -1) {
        searchResultDiv.textContent = "Lo sentimos, libro no disponible.";
    } else {
        const book = books[bookIndex];
        selectedBookIndex = bookIndex;
        searchResultDiv.innerHTML = `
            <span>Libro encontrado: ${book.title} - ${book.author}</span><br>
            ${book.borrowedBy ? `<span>Prestado a: ${book.borrowedBy}</span><br>` : ''}
            ${book.returnInfo ? `<span>Devuelto por: ${book.returnInfo.person} el ${book.returnInfo.date}</span><br>` : ''}
            <button onclick="openActionMenu('loan')" class="secondary-btn">Préstamo</button>
            <button onclick="openActionMenu('return')" class="secondary-btn">Devolución</button>
            <button onclick="deleteBook(${bookIndex})" class="secondary-btn">Eliminar</button>
        `;
    }
}

function openActionMenu(actionType) {
    toggleView("actionMenu");
    const actionTitle = document.getElementById("actionTitle");
    actionTitle.textContent = actionType === "loan" ? "Préstamo de Libro" : "Devolución de Libro";
    actionTitle.dataset.actionType = actionType;

    document.getElementById("actionName").value = "";
    document.getElementById("actionDate").value = "";
    document.getElementById("actionDate").style.display = actionType === "return" ? "block" : "none";
}

function deleteBook(index) {
    books.splice(index, 1);
    displayBooks();
    document.getElementById("searchResult").innerHTML = "";
    document.getElementById("searchTitle").value = "";
}

function displayMessage(message) {
    const searchResultDiv = document.getElementById("searchResult");
    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;
    messageSpan.classList.add("success-message");
    searchResultDiv.appendChild(messageSpan);

    setTimeout(() => {
        searchResultDiv.removeChild(messageSpan);
    }, 3000);
}

function toggleView(viewId) {
    document.getElementById("userManagementView").style.display = viewId === "userManagementView" ? "block" : "none";
    document.getElementById("homeView").style.display = viewId === "homeView" ? "block" : "none";
    document.getElementById("booksView").style.display = viewId === "booksView" ? "block" : "none";
    document.getElementById("searchView").style.display = viewId === "searchView" ? "block" : "none";
    document.getElementById("actionMenu").style.display = viewId === "actionMenu" ? "block" : "none";
}