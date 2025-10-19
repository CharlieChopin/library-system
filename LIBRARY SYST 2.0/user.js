// ✅ Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWiz4p-wuxDGWZodQ4Cm_DHPW0R_NHJU0",
  authDomain: "library-system-8e1b0.firebaseapp.com",
  projectId: "library-system-8e1b0",
  storageBucket: "library-system-8e1b0.firebasestorage.app",
  messagingSenderId: "126524141183",
  appId: "1:126524141183:web:26412faad149f16920194a",
  measurementId: "G-X0NMDFXNYR"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const bookList = document.getElementById("bookList");

// Display books
div.innerHTML = `
  <strong>${book.title}</strong><br>
  Author: ${book.author}<br>
  Year: ${book.year}<br>
  Category: ${book.category}<br>
  Status: ${book.status}<br>
  ${book.status === "Available"
    ? `<button onclick="requestBook('${child.key}', '${book.title}')">Request</button>`
    : ""}
`;


// Real-time updates for books
db.ref("books").on("value", displayBooks);

// Request to borrow
function requestBook(bookId, title) {
  const userName = prompt("Enter your name:");
  if (!userName) return alert("Name is required!");

  const newReq = {
    id: Date.now(),
    name: userName,
    bookId: bookId,
    title: title,
    status: "Pending"
  };

  db.ref("requests/" + newReq.id).set(newReq);
  alert("Request sent!");
}
