//inisialiasi variabel untuk menampung elemen dokumen
const inputBookTitle = document.querySelector('#inputBookTitle');
const inputBookAuthor = document.querySelector('#inputBookAuthor');
const inputBookYear = document.querySelector('#inputBookYear');
const inputBookIsComplete = document.querySelector('#inputBookIsComplete');
const inputSearchBookTitle = document.querySelector('#searchBookTitle');
const uncompletedBookList = document.getElementById('incompleteBookshelfList');
const listCompleted = document.getElementById('completeBookshelfList');

/**
 * [
 *   {
  id: 3657848524,
  title: 'Harry Potter and the Philosopher\'s Stone',
  author: 'J.K Rowling',
  year: 1997,
  isComplete: false,
}
 * ]
 */
const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const article = document.createElement('article');
  article.classList.add('book_item');

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;

  const authorContainer = document.createElement('p');
  authorContainer.innerText = `penulis: ${author}`;

  const yearContainer = document.createElement('p');
  yearContainer.innerText = `tahun: ${year}`;

  article.append(bookTitle, authorContainer, yearContainer);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');

  if (isCompleted) {
    const uncompletedButton = document.createElement('button');
    uncompletedButton.classList.add('green');
    uncompletedButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });
    uncompletedButton.innerText = 'Belum selesai di Baca';

    actionContainer.append(uncompletedButton);
  } else {
    const completedButton = document.createElement('button');
    completedButton.classList.add('green');
    completedButton.addEventListener('click', function () {
      addBookToCompleted(id);
    });
    completedButton.innerText = 'Selesai dibaca';

    actionContainer.append(completedButton);
  }

  const trashButton = document.createElement('button');
  trashButton.classList.add('red');
  trashButton.addEventListener('click', function () {
    removeBook(id);
  });
  trashButton.innerText = 'Hapus buku';

  actionContainer.append(trashButton);
  article.append(actionContainer);

  return article;
}

function addBook() {
  const textTitle = inputBookTitle.value;
  const author = inputBookAuthor.value;
  const year = inputBookYear.value;
  const isComplete = inputBookIsComplete.checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    textTitle,
    author,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  // clearing list item
  uncompletedBookList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});

function findBookTitle(title) {
  const filteredBooks = books.filter((book) => {
    return book.title.toLowerCase().match(title.toLowerCase());
  });

  return filteredBooks;

  // for (const bookItem of books) {
  //   if (bookItem.title.toLowerCase().search(title.toLowerCase())) {
  //     return bookItem;
  //   }
  // }
  // return null;
}

inputSearchBookTitle.addEventListener('keyup', (event) => {
  const filteredBook = findBookTitle(inputSearchBookTitle.value);
  // clearing list item
  uncompletedBookList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of filteredBook) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});
