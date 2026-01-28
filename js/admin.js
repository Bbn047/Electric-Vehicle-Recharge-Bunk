const sidebar = document.querySelector(".left-section");
const menuIcon = document.querySelector("#menu-icon");
const closeIcon= document.querySelector("#close-icon");


closeIcon.addEventListener("click", () =>{
    sidebar.style.display = "none";
    menuIcon.style.display = "block";
})

menuIcon.addEventListener("click", () =>{
    sidebar.style.display = "flex";
    menuIcon.style.display = "none";
});

window.addEventListener("resize", () =>{
    if(window.innerWidth>991){
        sidebar.classList.remove("active");
    }
});