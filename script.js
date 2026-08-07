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
document.querySelector("#adminButton").addEventListener("click", () => {
    if (prompt("Enter password:") === "Avias@les6767") {
        alert("Access Granted! 67.");
        
        // Ensure this replacement happens inside your focusout block in script.js
        tbody.addEventListener("focusout", async (event) => {
            const row = event.target.closest("tr");
            if (!row) return;
        
            // CORRECT METHOD: Target each layout cell individually by its column position
            const updatedData = {
                name: row.cells[0].innerText.trim(),         // Column 1: Name
                stars: row.cells[1].innerText.trim(),        // Column 2: Stars string
                socialCredit: row.cells[2].innerText.trim()   // Column 3: Social Credit string
            };
        
            // Fire the network payload string to your C# Controller
            try {
                const response = await fetch(`${API_URL}/update`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData)
                });
                
                if (response.ok) {
                    console.log(`Changes for ${updatedData.name} saved straight to SQLite database!`);
                } else {
                    console.error("Server rejected the update layout.");
                }
            } catch (error) {
                console.error("Failed to write data string to network:", error);
            }
        });
    } else {
        alert("Access denied!");
    }
});
