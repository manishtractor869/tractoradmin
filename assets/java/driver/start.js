const body = document.querySelector("body"),
       header = document.querySelector("header"),
       nav = document.querySelector("nav"),
       modeToggle = document.querySelector(".dark-light"),
       searchBox = document.querySelector(".searchBox"),
       open = document.querySelector(".open"),
       close = document.querySelector(".close");
      

       // nav bar scroll up and down with windows

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

   // Stopwatch Logic
   let timer;
   let elapsedTime = 0;
   let isRunning = false;

   function formatTime(ms) {
       const date = new Date(ms);
       return date.toISOString().substr(11, 8);
   }

   function startStopwatch() {
       if (!isRunning) {
           isRunning = true;
           timer = setInterval(() => {
               elapsedTime += 1000;
               document.getElementById('time').textContent = formatTime(elapsedTime);
           }, 1000);
       }
   }

   function pauseStopwatch() {
       if (isRunning) {
           clearInterval(timer);
           timer = null;
           isRunning = false;
       }
   }

   function resetStopwatch() {
       // Store the current time in the input field
       document.getElementById('timeInput').value = formatTime(elapsedTime);

       // Reset the stopwatch
       pauseStopwatch();
       elapsedTime = 0;
       document.getElementById('time').textContent = formatTime(elapsedTime);
   }

   function calculateCost() {
       const timeInput = document.getElementById('timeInput').value;
       const rate = parseFloat(document.getElementById('rate').value);

       if (!timeInput || isNaN(rate)) {
           alert('Please make sure time and rate are valid.');
           return;
       }

       // Convert timeInput (HH:MM:SS) to total hours
       const [hours, minutes, seconds] = timeInput.split(':').map(Number);
       const totalHours = hours + minutes / 60 + seconds / 3600;

       // Calculate cost
       const cost = totalHours * rate;

       // Update the totalRupees field with the calculated cost
       document.getElementById('totalRupees').value = cost.toFixed(2);
   }

   document.getElementById('play').addEventListener('click', startStopwatch);
   document.getElementById('pause').addEventListener('click', pauseStopwatch);
   document.getElementById('reset').addEventListener('click', resetStopwatch);
   document.getElementById('calculate').addEventListener('click', calculateCost);

   // Prevent multiple form submissions
   document.getElementById('registerForm').addEventListener('submit', async (event) => {
       event.preventDefault();

       const submitBtn = document.getElementById('submitBtn');
       const loadingIndicator = document.getElementById('loading');

       // Disable the submit button
       submitBtn.disabled = true;
       // Show the loading indicator
       loadingIndicator.style.display = 'block';

       const totalRupees = document.getElementById('totalRupees').value;
       const sheetName = document.getElementById('sheetName').value;
       const timeInput = document.getElementById('timeInput').value;
       const rate = document.getElementById('rate').value;
       const type = document.getElementById('type').value;

       try {
           const response = await fetch('https://script.google.com/macros/s/AKfycbwW8OuQLwCS7wKIZNCrUJia9lDOiQ4Ukgr98k6tKTvHhqAfj7w0hAC-goF_er3spTdojg/exec?action=submitData', { // Replace with your deployment URL
               method: 'POST',
               body: JSON.stringify({ type, totalRupees, sheetName, timeInput, rate })
           });

           const result = await response.json();
           alert(result.message);
           window.location.reload();
       } catch (error) {
           console.error('Error submitting data:', error);
           alert('Failed to submit data');
       } finally {
           // Enable the submit button and hide the loading indicator
           submitBtn.disabled = false;
           loadingIndicator.style.display = 'none';
       }
   });

   // Fetch sheet names
   const fetchSheetNames = async () => {
       try {
           const response = await fetch('https://script.google.com/macros/s/AKfycbwW8OuQLwCS7wKIZNCrUJia9lDOiQ4Ukgr98k6tKTvHhqAfj7w0hAC-goF_er3spTdojg/exec?action=getSheetNames'); // Replace with your deployment URL
           const data = await response.json();
           const select = document.getElementById('sheetName');
           data.sheetNames.forEach(sheet => {
               const option = document.createElement('option');
               option.value = sheet.name;
               option.textContent = sheet.name;
               select.appendChild(option);
           });
       } catch (error) {
           console.error('Error fetching sheet names:', error);
       }
   };

   fetchSheetNames();

   // Handle "Bojha" selection
   document.getElementById('type').addEventListener('change', function() {
       if (this.value === 'Bojha') {
           // Disable stopwatch and auto-fill Time and Rate with '00'
           document.getElementById('play').disabled = true;
           document.getElementById('pause').disabled = true;
           document.getElementById('reset').disabled = true;
           document.getElementById('timeInput').value = '00:00:00';
           document.getElementById('rate').value = '0.00';
           document.getElementById('totalRupees').disabled = false;
       } else {
           // Enable stopwatch and clear the fields
           document.getElementById('play').disabled = false;
           document.getElementById('pause').disabled = false;
           document.getElementById('reset').disabled = false;
           document.getElementById('timeInput').value = '';
           document.getElementById('rate').value = '';
           document.getElementById('totalRupees').disabled = true;
       }
   });
