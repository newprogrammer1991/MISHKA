(function () {
    let btn_cart = document.querySelector("#cart");
    let btn_cart_close=document.querySelector(".drawer__fallback-btn");
    let body = document.querySelector("body");
    //let drawers = document.querySelector(".drawer");
    //let page_container=document.querySelector(".is-moved-by-drawer");
    btn_cart.addEventListener("click", shows);
    btn_cart_close.addEventListener("click", shows);
    function shows(event) {
        body.classList.toggle("js-open-right");
        //drawers.classList.add("drawer--open");
        //page_container.classList.add("is-transitionend");
       // event.preventDefault();
    }
})();