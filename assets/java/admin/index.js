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

        //header closed

   

        //View Data according to provideed sheet name

        // Function to fetch the list of sheet names and populate the dropdown
        function getSheetNames() {
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbx8LxDhLiVtq0iKMQdHTTpB9y8EEtt0rMXwt1AVz_kQKs1cfd6lUriWM6TZ8uekjOVe5A/exec';

            fetch(`${scriptUrl}?action=getSheetNames`)
                .then(response => response.json())
                .then(data => populateDropdown(data))
                .catch(error => console.error('Error fetching sheet names:', error));
        }

        // Function to populate the dropdown with sheet names
        function populateDropdown(sheets) {
            const dropdown = document.getElementById('sheetDropdown');
            sheets.forEach(sheet => {
                const option = document.createElement('option');
                option.value = sheet;
                option.text = sheet;
                dropdown.appendChild(option);
            });
        }

        // Function to fetch data when a sheet is selected
        function fetchData() {
            const sheetName = document.getElementById('sheetDropdown').value;
            if (sheetName) {
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbx8LxDhLiVtq0iKMQdHTTpB9y8EEtt0rMXwt1AVz_kQKs1cfd6lUriWM6TZ8uekjOVe5A/exec';
                const url = `${scriptUrl}?action=getSheetData&sheetName=${sheetName}`;

                fetch(url)
                    .then(response => response.json())
                    .then(data => populateTables(data))
                    .catch(error => console.error('Error fetching sheet data:', error));
            }
        }

        // Function to format dates as YYYY.MM.DD
        function formatDate(date) {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = ('0' + (d.getMonth() + 1)).slice(-2); // Months are zero-based
            const day = ('0' + d.getDate()).slice(-2);
            return `${year}.${month}.${day}`;
        }

        // Function to populate tables with fetched data, only showing rows with data
        function populateTables(data) {
            const table1 = document.getElementById('table1').getElementsByTagName('tbody')[0];
            const table2 = document.getElementById('table2').getElementsByTagName('tbody')[0];
            const table3 = document.getElementById('table3').getElementsByTagName('tbody')[0];

            // Clear previous data
            table1.innerHTML = '';
            table2.innerHTML = '';
            table3.innerHTML = '';

            // Table 1: A2 to E (all rows)
            data.table1.forEach(row => {
                // Check if the row has data in columns A to E
                if (row.some(cell => cell !== '' && cell !== null)) {
                    let newRow = table1.insertRow();
                    row.forEach((cell, index) => {
                        let cellElement = newRow.insertCell();
                        if (index === 0) { // Format date in Column A
                            cellElement.innerText = formatDate(cell);
                        } else {
                            cellElement.innerText = cell;
                        }
                    });
                }
            });

            // Table 2: G2 to I (only one row)
            let row2 = table2.insertRow();
            data.table2.forEach(cell => {
                let cellElement = row2.insertCell();
                cellElement.innerText = cell;
            });

            // Table 3: J2 to K (all rows)
            data.table3.forEach(row => {
                // Check if the row has data in columns J and K
                if (row.some(cell => cell !== '' && cell !== null)) {
                    let newRow = table3.insertRow();
                    row.forEach((cell, index) => {
                        let cellElement = newRow.insertCell();
                        if (index === 1) { // Format date in Column K
                            cellElement.innerText = formatDate(cell);
                        } else {
                            cellElement.innerText = cell;
                        }
                    });
                }
            });
        }

        // Call the function to populate the dropdown when the page loads
        window.onload = getSheetNames;

        