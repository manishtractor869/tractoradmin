const body = document.querySelector("body"),
            header = document.querySelector("header"),
            nav = document.querySelector("nav"),
            modeToggle = document.querySelector(".dark-light"),
            searchBox = document.querySelector(".searchBox"),
            open = document.querySelector(".open"),
            close = document.querySelector(".close");


        // nav bar scroll up and down with windows

        // let prevScrollpos = window.pageYOffset;
        // window.addEventListener("scroll", () => {
        //     let currentScrollpos = window.pageYOffset;
        //     if (prevScrollpos < currentScrollpos) {
        //         header.classList.add("hide");
        //         arrowTop.classList.add("show");
        //     } else {
        //         header.classList.remove("hide");
        //         arrowTop.classList.remove("show");
        //     }
        //     prevScrollpos = currentScrollpos;
        // })


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

        //fullname display
        // document.addEventListener('DOMContentLoaded', function () {
        //     var fullName = localStorage.getItem('fullName');
        //     if (fullName) {
        //         document.getElementById('fullName').textContent = fullName;
        //     } else {
        //         alert('No user information found.');
        //         window.location.href = "index.html";
        //     }
        // });

        //View Data according to provideed sheet name

        // Function to fetch the list of sheet names and populate the dropdown
        function getSheetNames() {
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbwgDpAhZHFfmuR5l8Bu5X0Kop2mj6O2U3I9p7YLrAfJA0QcUZsY6ll8Kaj1BpJwOy-1dA/exec';

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
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbwgDpAhZHFfmuR5l8Bu5X0Kop2mj6O2U3I9p7YLrAfJA0QcUZsY6ll8Kaj1BpJwOy-1dA/exec';
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

        