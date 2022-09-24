//book class: represents the book ,each object creates a new book 

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}






// UI class : handle UI tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));

    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href ="#" class=" btn btn-sm delete btn-danger">X</a></td>
        `
        list.appendChild(row);
    }

    static removeBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const table = document.querySelector(".table");
        container.insertBefore(div, table);


        //disapper after 2 seconds
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 2000)
    }


    static clearFields() {
        document.querySelector("#title").value = '';
        document.querySelector("#author").value = '';
        document.querySelector("#isbn").value = '';
    }


}



//Store class: handles the storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }
    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        })

        localStorage.removeItem('books', JSON.stringify(books));

    }
}
//Event: to show book
document.addEventListener('DOMContentLoaded', UI.displayBooks());
//EVENT  : to Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //get form values from the form.

    // to prevent actual submit
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // to validate the values entered that they are not empty or not of the type before creation of book object
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Fill all the fields', 'danger');
    } else {
        // intiatiate a book object using book class
        const book = new Book(title, author, isbn);
        // to add book to the UI
        UI.addBookToList(book);
        //add book to storage
        Store.addBook(book);
        UI.showAlert("Book is Added to the list", 'success')
            //now clear the fields in whcih form's data is given
        UI.clearFields();
    }

});
//Event : to remove a book


document.querySelector("#book-list").addEventListener('click', function(e) {
    UI.removeBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); // to access previous element and its text,use textcontent as inner html provides data in different format
    UI.showAlert("Book is removed", 'success');

})