const body = document.querySelector("body"),
       header = document.querySelector("header"),
       nav = document.querySelector("nav"),
       modeToggle = document.querySelector(".dark-light"),
       searchBox = document.querySelector(".searchBox"),
       open = document.querySelector(".open"),
       close = document.querySelector(".close");
      

    //    // nav bar scroll up and down with windows

    //    let prevScrollpos = window.pageYOffset;
    //    window.addEventListener("scroll", ()=>{
    //        let currentScrollpos = window.pageYOffset;
    //    if(prevScrollpos < currentScrollpos){
    //         header.classList.add("hide");
    //         arrowTop.classList.add("show");
    //    }else{
    //         header.classList.remove("hide");
    //         arrowTop.classList.remove("show");
    //    }
    //    prevScrollpos = currentScrollpos;
    //    })
       

        // for always selector dark or light mode
        let getMode = localStorage.getItem("mode");
        if (getMode && getMode === "dark-mode"){
         body.classList.add("dark");
        }

//js code to toggle dark and light mode
       modeToggle.addEventListener("click",()=>{
        modeToggle.classList.toggle("active");
        body.classList.toggle("dark");

        //    for always dark or light mode    
    
        if(!body.classList.contains("dark")){
            localStorage.setItem("mode", "light-mode");
        }else{
            localStorage.setItem("mode", "dark-mode");
        }

       });

       //toggle for nav bar
       searchBox.addEventListener("click", ()=>{
              searchBox.classList.toggle("active");
              // nav.classList.add("active");
          });
      
      
      //for side bar
      
      open.addEventListener("click",()=>{
          nav.classList.add("active");
      })
      body.addEventListener("click", e =>{
          let clickedElm = e.target;
      
          if(!clickedElm.classList.contains("open") && !clickedElm.classList.contains("menu")){
              nav.classList.remove("active");
              searchBox.classList.remove("active");
          }
      })

      //header closed

       //fullname display
    //    document.addEventListener('DOMContentLoaded', function () {
    //     var fullName = localStorage.getItem('fullName');
    //     if (fullName) {
    //         document.getElementById('fullName').textContent = fullName;
    //     } else {
    //         alert('No user information found.');
    //         window.location.href = "index.html";
    //     }
    // });

   //end of header

   //calculation

   var totalHours = 0;
   var totalMinutes = 0;

   function recordTime() {
       var hours = parseInt(document.getElementById('hours').value);
       var minutes = parseInt(document.getElementById('minutes').value);

       if (isNaN(hours)) {
           hours = 0;
       }
       if (isNaN(minutes)) {
           minutes = 0;
       }

       var table = document.getElementById("timeTable");
       var row = table.insertRow(-1);
       var cell1 = row.insertCell(0);
       var cell2 = row.insertCell(1);
       cell1.innerHTML = hours;
       cell2.innerHTML = minutes;

       totalHours += hours;
       totalMinutes += minutes;

       // Adjust total time
       totalHours += Math.floor(totalMinutes / 60);
       totalMinutes = totalMinutes % 60;

       document.getElementById('totalTime').innerHTML = 'Total Time: ' + totalHours + ' Hours, ' + totalMinutes + ' Minutes';

       document.getElementById('hours').value = '';
       document.getElementById('minutes').value = '';
   }

   function calculateCost() {
       var rate = parseFloat(document.getElementById('rate').value);

       if (isNaN(rate)) {
           alert('Please enter a valid rate');
           return;
       }

       var totalTimeInHours = totalHours + (totalMinutes / 60);
       var totalCost = totalTimeInHours * rate;

       document.getElementById('totalCost').innerHTML = 'Total Rs: ' + totalCost.toFixed(2);
   }

   function clearPage() {
       location.reload();
   }
   

   // For STore in Google sheet

    // Update this function with the URL of your Google Apps Script web app
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw7sWAFmDcAhrDOQxyePhY2G85dZAVUWyPlE_Dojqqp-4bdC7C3NxVAiGDPiL_ns_bDOQ/exec';

    // Function to populate dropdown with sheet names
    function populateDropdown() {
        fetch(scriptURL)
            .then(response => response.json())
            .then(data => {
                const dropdown = document.getElementById('sheetDropdown');
                dropdown.innerHTML = ''; // Clear existing options
                dropdown.appendChild(new Option('Select a sheet', '')); // Add a default option
                data.sheets.forEach(sheet => {
                    const option = document.createElement('option');
                    option.value = sheet;
                    option.textContent = sheet;
                    dropdown.appendChild(option);
                });
                dropdown.addEventListener('change', handleDropdownChange);
            })
            .catch(error => console.error('Error fetching sheet names:', error));
    }

    // Function to handle dropdown change
    function handleDropdownChange() {
        const selectedSheet = document.getElementById('sheetDropdown').value;
        const additionalInputs = document.getElementById('additionalInputs');

        if (selectedSheet) {
            additionalInputs.style.display = 'block'; // Show inputs if a sheet is selected
        } else {
            additionalInputs.style.display = 'none'; // Hide inputs if no sheet is selected
        }
    }

    // Function to handle submit button click
    // Update this function with the URL of your Google Apps Script web app
  
    // Function to handle submit button click
    function submitData() {
        const selectedSheet = document.getElementById('sheetDropdown').value;
        const date = document.getElementById('dateInput').value;
        const type = document.getElementById('typeDropdown').value;
        const totalTime = document.getElementById('totalTime').textContent.replace('Total Time: ', '');
        const rate = document.getElementById('rate').value;
        const totalCost = document.getElementById('totalCost').textContent.replace('Total Rs: ', '').replace('₹', '');

        fetch(scriptURL, {
            method: 'POST',
          
            body: JSON.stringify({ sheet: selectedSheet, date: date, type: type, totalTime: totalTime, rate: rate, totalCost: totalCost })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Data submitted successfully.');
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error submitting data:', error));
    }

    // Call this function on page load
    document.addEventListener('DOMContentLoaded', populateDropdown);
