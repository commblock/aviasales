const API_URL = "https://localhost:7000/api/table"; 

// 1. Automatically fetch your spreadsheet data from the C# Database on page load
async function loadTableData() {
    try {
        const response = await fetch(API_URL);
        const records = await response.json();
        
        const tbody = document.querySelector("#myTable tbody");
        
        // Loop through your C# database records to generate your layout rows
        tbody.innerHTML = records.map(record => `
            <tr data-name="${record.name}">
                <td>${record.name}</td>
                <td>${record.stars}</td>
                <td>${record.socialCredit}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Could not read database data:", error);
    }
}

// Initial pull on page load
loadTableData();

// 2. Click button to enter password and instantly edit cell strings
window.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded and connected to HTML layout!"); // If you don't see this, your file isn't linked!

    document.querySelector("#adminButton").addEventListener("click", () => {
        if (prompt("Enter super secret password:") === "Avias@les") {
            alert("Access Granted! 67.");
            
            const tbody = document.querySelector("#myTable tbody");
            tbody.contentEditable = "true";
            
            // Listen to focusout directly using event bubbling
            tbody.addEventListener("focusout", async (event) => {
                const cell = event.target;
                if (cell.tagName !== "TD") return; // Make sure it's a cell

                const row = cell.closest("tr");
                if (!row) return;

                // Grab column strings via explicit index positions
                const updatedData = {
                    name: row.cells[0].innerText.trim(),         // First column text string
                    stars: row.cells[1].innerText.trim(),        // Second column text string
                    socialCredit: row.cells[2].innerText.trim()  // Third column text string
                };

                console.log("Sending update payload:", updatedData);

                try {
                    const response = await fetch(`${API_URL}/update`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedData)
                    });
                    
                    if (response.ok) {
                        console.log("Saved directly to database!");
                    } else {
                        console.error("Server rejected change framework.");
                    }
                } catch (error) {
                    console.error("Network pipe failed:", error);
                }
            });

        } else {
            alert("Access denied!");
        }
    });
});
