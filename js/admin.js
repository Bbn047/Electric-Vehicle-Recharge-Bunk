const sidebar = document.querySelector(".left-section");
const menuIcon = document.querySelector("#menu-icon");
const closeIcon= document.querySelector("#close-icon");

menuIcon.addEventListener("click", () =>{
    sidebar.style.display = "flex";
    menuIcon.style.display = "none";
});

closeIcon.addEventListener("click", () =>{
    sidebar.style.display = "none";
    menuIcon.style.display = "block";
})

function displaySize(){
    if(window.innerWidth >=992){
        sidebar.style.display = "flex";
    }else{
        sidebar.style.display= "none";
    }
}


displaySize();

window.addEventListener("resize", displaySize);