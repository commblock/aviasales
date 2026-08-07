const data = [
    ["Aviasales", "infinity", "infinity"],
    ["USA", 22500400, 3170],
    ["Liam", 5500200, 1010],
    ["Veronica A.", 2005000, 1000],
    ["Verinica T.", 2067000, 1000],
    ["Yura", 6099400, 1465],
    ["Sean", 6084400, 995],
    ["Zlata", 22002500, 1197],
    ["Sasha", 5996000, 1807],
    ["Gabby", 2002200, 2057],
    ["Faina", "undefined", 995]
];

const tbody = document.querySelector("#myTable tbody");
tbody.innerHTML = data.map(row => 
    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
).join('');

document.querySelector("#adminButton").addEventListener("click", () => {
    if (prompt("Enter super secret password:") === "Avias@les6767") {
        alert("Access Granted! 67.");
        // Makes the entire table body editable as plain text strings instantly
        document.querySelector("#myTable tbody").contentEditable = "true";
    } else {
        alert("Access denied!");
    }
});
