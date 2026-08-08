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
    console.log("Script loaded and connected to HTML layout!"); 

    document.querySelector("#adminButton").addEventListener("click", () => {
        if (prompt("Enter password:") === "Avias@les6767") {
            alert("Access Granted! Cells are now unlocked for editing.");
            
            // 1. Select all individual data cells
            const cells = document.querySelectorAll("#myTable tbody td");
            
            // 2. Loop through every cell and make them individually editable
            cells.forEach(cell => {
                cell.contentEditable = "true";
                
                // Optional visual cue: changes cursor to text beam on hover
                cell.style.cursor = "text"; 
            });

            // 3. Listen for focusout on the table container (events bubble up from cells)
            const tbody = document.querySelector("#myTable tbody");
            tbody.addEventListener("focusout", async (event) => {
                const cell = event.target;
                if (cell.tagName !== "TD") return; // Safety check

                const row = cell.closest("tr");
                if (!row) return;

                // Grab column strings via explicit index positions
                const updatedData = {
                    name: row.cells.innerText.trim(),         
                    stars: row.cells.innerText.trim(),        
                    socialCredit: row.cells.innerText.trim()   
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
