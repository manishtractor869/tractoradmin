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


        
