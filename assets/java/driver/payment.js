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

   //end of header
   

   const fetchSheetNames = async () => {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyT62Dj4t5f_ALj0hDXncpTZTke7u8fhC_HBT0GzMs3JubNJTrMHF_FMN6DDTJ9-hbdxA/exec?action=getSheetNames'); // Replace with your deployment URL
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

document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;

    const totalRs = document.getElementById('totalRs').value;
    const sheetName = document.getElementById('sheetName').value;

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyT62Dj4t5f_ALj0hDXncpTZTke7u8fhC_HBT0GzMs3JubNJTrMHF_FMN6DDTJ9-hbdxA/exec?action=submitData', { // Replace with your deployment URL
            method: 'POST',
            body: JSON.stringify({ totalRs, sheetName })
        });

        const result = await response.json();
        alert(result.message);
        window.location.reload();
    } catch (error) {
        console.error('Error submitting data:', error);
        alert('Failed to submit data');
    } finally {
        submitButton.disabled = false;
    }
});

fetchSheetNames();