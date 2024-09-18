const body = document.querySelector("body"),
            header = document.querySelector("header"),
            nav = document.querySelector("nav"),
            modeToggle = document.querySelector(".dark-light"),
            searchBox = document.querySelector(".searchBox"),
            open = document.querySelector(".open"),
            close = document.querySelector(".close");

        // nav bar scroll up and down with windows
        // for always selector dark or light mode
        let getMode = localStorage.getItem("mode");
        if (getMode && getMode === "dark-mode") {
            body.classList.add("dark");
        }
        //js code to toggle dark and light mode
        modeToggle.addEventListener("click", () => {
            modeToggle.classList.toggle("active");
            body.classList.toggle("dark");
            //    for always dark or light mode    
            if (!body.classList.contains("dark")) {
                localStorage.setItem("mode", "light-mode");
            } else {
                localStorage.setItem("mode", "dark-mode");
            }
        });
        //toggle for nav bar
        searchBox.addEventListener("click", () => {
            searchBox.classList.toggle("active");
            // nav.classList.add("active");
        });
        //for side bar
        open.addEventListener("click", () => {
            nav.classList.add("active");
        })
        body.addEventListener("click", e => {
            let clickedElm = e.target;
            if (!clickedElm.classList.contains("open") && !clickedElm.classList.contains("menu")) {
                nav.classList.remove("active");
                searchBox.classList.remove("active");
            }
        })
        // header close
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbxwm5CaeNunZyvqbnyErdPQnnlRxRpsTDwduEymNVkyUgJz4LaUAWZm-jkJlbS7jpaEOQ/exec'; // <-- Replace with your Google Apps Script Web App URL
        // Load Google Sheet names into the dropdown
        async function loadSheetNames() {
            try {
                const response = await fetch(`${webAppUrl}?action=getSheetNames`);
                const sheetNames = await response.json();
                const dropdown = document.getElementById('sheetDropdown');
                sheetNames.forEach(sheet => {
                    const option = document.createElement('option');
                    option.value = sheet;
                    option.textContent = sheet;
                    dropdown.appendChild(option);
                });
            } catch (error) {
                console.error('Error fetching sheet names:', error);
            }
        }
        // Load data from the selected sheet
        async function loadSheetData() {
            const sheetName = document.getElementById('sheetDropdown').value;
            try {
                // Fetch data for Columns A to E
                const responseAE = await fetch(`${webAppUrl}?action=getSheetData&sheetName=${sheetName}`);
                const sheetDataAE = await responseAE.json();
                populateTable('sheetDataTable', sheetDataAE, 5, sheetName, 'A-E');

                // Fetch data for Columns J to K
                const responseJK = await fetch(`${webAppUrl}?action=getExtraData&sheetName=${sheetName}`);
                const sheetDataJK = await responseJK.json();
                populateTable('extraDataTable', sheetDataJK, 2, sheetName, 'J-K');

                // Fetch data for Columns G to I (view-only)
                const responseGI = await fetch(`${webAppUrl}?action=getViewOnlyData&sheetName=${sheetName}`);
                const sheetDataGI = await responseGI.json();
                populateViewOnlyTable('viewOnlyDataTable', sheetDataGI, 3);
            } catch (error) {
                console.error('Error loading sheet data:', error);
            }
        }
        // Populate table with the sheet data and attach actions for edit/delete
        function populateTable(tableId, data, columnCount, sheetName, type) {
            const tbody = document.getElementById(tableId).querySelector('tbody');
            tbody.innerHTML = ''; // Clear previous data
            data.forEach((row, index) => {
                if (row.some(cell => cell !== '')) { // Check if row is not empty
                    const tr = document.createElement('tr');
                    // Create editable fields for the number of columns
                    row.slice(0, columnCount).forEach((cell, i) => {
                        const td = document.createElement('td');
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.value = cell;
                        input.id = `${type}-cell-${index}-${i}`;
                        td.appendChild(input);
                        tr.appendChild(td);
                    });
                    // Add edit and delete buttons
                    const actionsTd = document.createElement('td');
                    const saveButton = document.createElement('button');
                    saveButton.textContent = 'Update';
                    saveButton.style.backgroundColor = '#90ee90'; // Lighter green for Update button
                    saveButton.style.marginRight = '5px';
                    saveButton.style.border = '1px solid #90ee90';
                    saveButton.style.padding = '2px 5px';
                    saveButton.onclick = () => saveRow(sheetName, index, columnCount, type);
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.style.backgroundColor = '#f08080'; // Lighter green for Update button
                    deleteButton.style.marginRight = '5px';
                    deleteButton.style.border = '1px solid #f08080';
                    deleteButton.style.padding = '2px 5px';
                    deleteButton.onclick = () => deleteRow(sheetName, index, type);
                    actionsTd.appendChild(saveButton);
                    actionsTd.appendChild(deleteButton);
                    tr.appendChild(actionsTd);
                    tbody.appendChild(tr);
                }
            });
        }
        // Populate view-only table with Columns G to I
        function populateViewOnlyTable(tableId, data, columnCount) {
            const tbody = document.getElementById(tableId).querySelector('tbody');
            tbody.innerHTML = ''; // Clear previous data
            data.forEach((row) => {
                if (row.some(cell => cell !== '')) { // Check if row is not empty
                    const tr = document.createElement('tr');
                    row.slice(0, columnCount).forEach((cell) => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                }
            });
        }
        // Save row changes to the Google Sheet
        async function saveRow(sheetName, rowIndex, columnCount, type) {
            const updatedRow = [];
            for (let i = 0; i < columnCount; i++) {
                const cellValue = document.getElementById(`${type}-cell-${rowIndex}-${i}`).value;
                updatedRow.push(cellValue);
            }
            try {
                const response = await fetch(`${webAppUrl}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'updateRow',
                        sheetName: sheetName,
                        rowIndex: rowIndex + 2, // Adjust for header row
                        rowData: updatedRow,
                        type: type
                    })
                });
                const result = await response.text();
                alert(result);
                loadSheetData();
            } catch (error) {
                console.error('Error saving row:', error);
            }
        }
        // Delete row from the Google Sheet
        async function deleteRow(sheetName, rowIndex, type) {
            try {
                const columns = type === 'A-E' ? 'A-E' : 'J-K'; // Set columns based on the table
                const response = await fetch(`${webAppUrl}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'deleteRow',
                        sheetName: sheetName,
                        rowIndex: rowIndex + 2, // Adjust for header row
                        columns: columns,
                        type: type
                    })
                });
                const result = await response.text();
                alert(result);
                loadSheetData(); // Refresh data after deletion
            } catch (error) {
                console.error('Error deleting row:', error);
            }
        }
        // Load sheet names when the page loads
        window.onload = loadSheetNames;

        
