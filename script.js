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

    document.querySelector("#adminButton").addEventListener("click", () => {
        if (prompt("Enter super secret password:") === "Avias@les6767") {
            alert("Access Granted! 67.");
            
            const tbody = document.querySelector("#myTable tbody");
            tbody.contentEditable = "true";
            
            // This forces tbody to catch focusout events from its child cells!
            tbody.addEventListener("focusout", async (event) => {
                // Find the parent row element of the cell that lost focus
                const row = event.target.closest("tr");
                if (!row) return;

                // Explicitly grab data columns using correct layout indexing
                const updatedData = {
                    name: row.cells[0].innerText.trim(),         
                    stars: row.cells[1].innerText.trim(),        
                    socialCredit: row.cells[2].innerText.trim()   
                };

                console.log("Sending update to backend:", updatedData);

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
            }, true);

        } else {
            alert("Access denied!");
        }
    });

});
