var inputs = document.querySelectorAll(".book-inputs"),
des = document.querySelector("textarea"),
table = document.querySelector(".trHolder"),
si = 0;

document.getElementById("search").value = "";
des.value='';
inputs.forEach((el)=>{
  el.value='';
});

function wrapper(id, si, book, author, des) {
  return `<div class="tr" id="customBook${id}" onmouseover="showIcon(this)" onmouseout="removeIcon(this)">
  <div>${si}</div>
  <div contenteditable="true" class="book" onkeyup="modifyIconShow(this)">${book}</div>
  <div contenteditable="true" class="author" onkeyup="modifyIconShow(this)">${author}</div>
  <div contenteditable="true" class="des" onkeyup="modifyIconShow(this)">${des}</div>
  <span class="removeIcon" onclick="removeBook(this)">x</span>
  <span class="saveIcon" onclick="modifyBook(this)">&#10003</span>
  </div>`;
}

function sortBooks(){
  var bookCount=localStorage.customBookCount,
  bookArray=[];
  for(var i=1; i<=bookCount; i++){
    bookArray.push(JSON.parse(localStorage.getItem(`customBook${i}`)));
  }
  bookArray.sort(function(a,b){
    var book1 = a.book.toLowerCase(),book2 = b.book.toLowerCase();
    if(book1<book2) return -1;
    if(book1>book2) return 1;
    return 0;
  });

  var j=1;
  bookArray.forEach((book)=>{
    localStorage.removeItem(`customBook${j}`);
    localStorage.setItem(`customBook${j}`,JSON.stringify(book));
    j++;
  });
  bookCollect();
  tempContent = table.innerHTML;
  books = document.querySelectorAll(".tr");
}
sortBooks();
function bookCollect() {
  (function localBookCollect() {
    var books = window.localBook;
    table.innerHTML = "";
    for (si = 0; si < books.length; si++) {
      table.innerHTML += `
  <div class="tr">
  <div>${si + 1}</div>
  <div contenteditable="true" class="book">${books[si].book}</div>
  <div contenteditable="true" class="author">${books[si].author}</div>
  <div contenteditable="true" class="des">${books[si].des}</div>
  </div>`;
    }
  })();

  (function initialBookCollect() {
    if (localStorage.customBookCount > 0) {
      for (var i = 1; i <= localStorage.customBookCount; i++) {
        var tempObj = JSON.parse(localStorage.getItem(`customBook${i}`));
        table.innerHTML += wrapper(
          i,
          ++si,
          tempObj.book,
          tempObj.author,
          tempObj.des
        );
      }
    }
  })();
}

bookCollect();

function addBook() {
  if (inputs[0].value != "" && inputs[1].value != "" && des.value != "") {
    if (localStorage.customBookCount > 0) {
      localStorage.customBookCount = Number(localStorage.customBookCount) + 1;
    } else {
      localStorage.customBookCount = 1;
    }
    var obj = {
      book: inputs[0].value,
      author: inputs[1].value,
      des: des.value,
    };

    localStorage.setItem(
      `customBook${localStorage.customBookCount}`,
      JSON.stringify(obj)
    );
  }
  sortBooks();
  bookCollect();
  tempContent = table.innerHTML;
  books = document.querySelectorAll(".tr");
}

function showIcon(el) {
  el.querySelector("span").classList.add("showIcon");
}

function removeIcon(el) {
  el.querySelector("span").classList.remove("showIcon");
}

function removeBook(el) {
  el.parentElement.remove();
  var bookName = el.parentElement.getAttribute("id"),
  bookIndex = parseInt(bookName.replace("customBook", "")),
  i=0;
  localStorage.removeItem(bookName);
  
  for (var i = bookIndex; i < localStorage.customBookCount; i++) {
    localStorage.setItem(
      `customBook${i}`,
      localStorage.getItem(`customBook${i + 1}`)
    );
  }
  localStorage.removeItem(`customBook${i}`);
  localStorage.customBookCount--;
  bookCollect();
  tempContent = table.innerHTML;
  books = document.querySelectorAll(".tr");
}

function modifyIconShow(el) {
  el.parentElement.querySelector(".saveIcon").style.display = "inline-block";
  table.style.pointerEvents='none';
  el.parentElement.style.pointerEvents='auto';
}

function modifyBook(el) {
  table.style.pointerEvents='auto';
  var bookName = el.parentElement.getAttribute("id"),
  book = JSON.parse(localStorage.getItem(bookName)),
  Name = el.parentElement.querySelector(".book").innerText,
  authorName = el.parentElement.querySelector(".author").innerText,
  description = el.parentElement.querySelector(".des").innerText;

  book.book = Name;
  book.author = authorName;
  book.des = description;

  localStorage.removeItem(bookName);
  localStorage.setItem(bookName, JSON.stringify(book));

  el.style.display = "none";
  sortBooks();
  document.getElementById("search").value = "";
  tempContent = table.innerHTML;
  books = document.querySelectorAll(".tr");
}

var tempContent = table.innerHTML,
books = document.querySelectorAll(".tr");

function search(el) {
  var searchedBooks = [];
  if (el.value != "") {
    books.forEach((book) => {
      if (
        book.querySelector(".book").innerText.toLowerCase().match(el.value.toLowerCase()) ||
        book.querySelector(".author").innerText.toLowerCase().match(el.value.toLowerCase())
      ) {
        searchedBooks.push(book);
      }

      table.innerHTML = "";
      if (searchedBooks.length) {
        searchedBooks.forEach((el, index) => {
          var resultBook = {
            id: el.getAttribute("id").replace('customBook',''),
            book: el.querySelector(".book").innerText,
            author: el.querySelector(".author").innerText,
            des: el.querySelector(".des").innerText,
          };
          table.innerHTML += wrapper(
            resultBook.id,
            index + 1,
            resultBook.book,
            resultBook.author,
            resultBook.des
          );
        });
      } else {
        table.innerHTML = "Not found !";
      }
    });
  } else {
    table.innerHTML = tempContent;
  }
}
