const body = document.querySelector("body"),
            header = document.querySelector("header"),
            nav = document.querySelector("nav"),
            modeToggle = document.querySelector(".dark-light"),
            searchBox = document.querySelector(".searchBox"),
            open = document.querySelector(".open"),
            close = document.querySelector(".close");


        // nav bar scroll up and down with windows

        let prevScrollpos = window.pageYOffset;
        window.addEventListener("scroll", () => {
            let currentScrollpos = window.pageYOffset;
            if (prevScrollpos < currentScrollpos) {
                header.classList.add("hide");
                arrowTop.classList.add("show");
            } else {
                header.classList.remove("hide");
                arrowTop.classList.remove("show");
            }
            prevScrollpos = currentScrollpos;
        })


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
        //end of header

        // Function to handle form submission
        document.getElementById('sheetForm').addEventListener('submit', function (event) {
            event.preventDefault();
            var form = document.getElementById('sheetForm');
            var sheetName = form.sheetName.value;

            // Make an HTTP POST request to the Google Apps Script web app
            fetch('https://script.google.com/macros/s/AKfycbwMff7Vv0Gco92Q_7cXy2tX3-igcwAmV_8-eMQgPJ-LxWhvl3pt9WIt6YlYhRNot_DsrQ/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'sheetName': sheetName
                })
            })
                .then(response => response.text())
                .then(result => {
                    // Display the result in the div and show an alert
                    document.getElementById('result').innerText = result;
                    alert(result);
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('result').innerText = 'An error occurred.';
                    alert('An error occurred.');
                    window.location.reload();
                });
        });



        ///////////////////////////////////////
        //view edit delete sheetname
        ////////////////////////////////////////
        // Function to fetch sheet names
        function fetchSheetNames() {
            // Paste your web URL link here to connect with code.gs
            const url = 'https://script.google.com/macros/s/AKfycbx9tCxMhIvArBeX7sKmFctEGvvVsIyVmTQ8WhAzLau7S3YFzBI9atVrX_dMlKNaj4CBvQ/exec';

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.querySelector('#sheetTable tbody');
                    tableBody.innerHTML = ''; // Clear table body

                    data.forEach((sheetName, index) => {
                        const row = document.createElement('tr');

                        // Add sheet name cell
                        const nameCell = document.createElement('td');
                        nameCell.innerText = sheetName;
                        row.appendChild(nameCell);

                        // Add Edit button
                        const editCell = document.createElement('td');
                        const editButton = document.createElement('button');
                        editButton.innerText = 'Edit';
                        editButton.classList.add('edit-btn');
                        editButton.style.padding = '2px 5px';
                        editButton.style.border = 'none';
                        // editButton.style.color = '#90ee90';
                        editButton.style.backgroundColor = '#90ee90';
                        editButton.onclick = () => editSheetName(index, sheetName);
                        editCell.appendChild(editButton);
                        row.appendChild(editCell);

                        // Add Delete button
                        const deleteCell = document.createElement('td');
                        const deleteButton = document.createElement('button');
                        deleteButton.innerText = 'Delete';
                        deleteButton.classList.add('delete-btn');
                        deleteButton.style.padding = '2px 5px';
                        deleteButton.style.border = 'none';
                        // deleteButton.style.color = '#90ee90';
                        deleteButton.style.backgroundColor = '#f08080';
                        deleteButton.onclick = () => deleteSheetName(index);
                        deleteCell.appendChild(deleteButton);
                        row.appendChild(deleteCell);

                        // Append row to table
                        tableBody.appendChild(row);
                    });
                })
                .catch(error => console.error('Error fetching sheet names:', error));
        }

        // Function to edit sheet name
        function editSheetName(index, oldName) {
            const newName = prompt('Enter new sheet name:', oldName);
            if (newName) {
                // Send update request to server
                const url = 'https://script.google.com/macros/s/AKfycbx9tCxMhIvArBeX7sKmFctEGvvVsIyVmTQ8WhAzLau7S3YFzBI9atVrX_dMlKNaj4CBvQ/exec';
                const payload = { action: 'edit', index, newName };

                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    // headers: {
                    //   'Content-Type': 'application/json'
                    // }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            fetchSheetNames(); // Refresh the table
                        } else {
                            alert('Error editing sheet name.');
                        }
                    })
                    .catch(error => console.error('Error editing sheet name:', error));
            }
        }

        // Function to delete sheet name
        function deleteSheetName(index) {
            if (confirm('Are you sure you want to delete this sheet?')) {
                // Send delete request to server
                const url = 'https://script.google.com/macros/s/AKfycbx9tCxMhIvArBeX7sKmFctEGvvVsIyVmTQ8WhAzLau7S3YFzBI9atVrX_dMlKNaj4CBvQ/exec';
                const payload = { action: 'delete', index };

                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    // headers: {
                    //   'Content-Type': 'application/json'
                    // }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            fetchSheetNames(); // Refresh the table
                        } else {
                            alert('Error deleting sheet.');
                        }
                    })
                    .catch(error => console.error('Error deleting sheet:', error));
            }
        }

        // Fetch sheet names on page load
        window.onload = fetchSheetNames;
