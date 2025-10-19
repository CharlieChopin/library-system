// ✅ Firebase Configuration (same as in user.js)
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

// DOM Elements
const adminBookList = document.getElementById("adminBookList");
const requestList = document.getElementById("requestList");
const addBookBtn = document.getElementById("addBookBtn");
const generateReportBtn = document.getElementById("generateReport");

// Add new book
addBookBtn.addEventListener("click", () => {
  const title = document.getElementById("bookTitle").value.trim();
  if (!title) return alert("Enter a book title!");
  const newBook = { title, status: "Available" };
  db.ref("books").push(newBook);
  document.getElementById("bookTitle").value = "";
});

// Display books
db.ref("books").on("value", (snapshot) => {
  adminBookList.innerHTML = "";
  snapshot.forEach(child => {
    const book = child.val();
    const div = document.createElement("div");
    div.className = "book";
    div.innerHTML = `
      <strong>${book.title}</strong> - ${book.status}
      <button onclick="removeBook('${child.key}')">🗑 Remove</button>
    `;
    adminBookList.appendChild(div);
  });
});

// Remove book
function removeBook(id) {
  db.ref("books/" + id).remove();
}

// Display requests
db.ref("requests").on("value", (snapshot) => {
  requestList.innerHTML = "";
  snapshot.forEach(child => {
    const req = child.val();
    const div = document.createElement("div");
    div.className = "request";
    div.innerHTML = `
      <strong>${req.name}</strong> requested "<em>${req.title}</em>"<br>
      Status: ${req.status}<br>
      ${req.status === "Pending" ? `
        <button onclick="approveRequest(${req.id}, '${req.bookId}')">Approve</button>
        <button onclick="denyRequest(${req.id})">Deny</button>
      ` : ""}
    `;
    requestList.appendChild(div);
  });
});

// Approve
function approveRequest(reqId, bookId) {
  db.ref("requests/" + reqId).update({ status: "Approved" });
  db.ref("books/" + bookId).update({ status: "Borrowed" });
}

// Deny
function denyRequest(reqId) {
  db.ref("requests/" + reqId).update({ status: "Denied" });
}

// Generate report
generateReportBtn.addEventListener("click", async () => {
  const snapshot = await db.ref("requests").get();
  const approved = [];
  snapshot.forEach(child => {
    const r = child.val();
    if (r.status === "Approved") approved.push(r);
  });

  let report = "Borrowed Books Report\n\n";
  approved.forEach(r => {
    report += `Book: ${r.title}\nBorrower: ${r.name}\n\n`;
  });

  const blob = new Blob([report], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "BorrowedBooksReport.txt";
  a.click();
  URL.revokeObjectURL(url);
});
