(function () {
    let btn_menu = document.querySelector(".page-nav__hamburger-menu");
    let nav = document.querySelector(".page-nav");

    btn_menu.addEventListener("click", show);

    function show() {
        if (nav.classList.contains("page-nav--closed")) {
            nav.classList.remove("page-nav--closed");
            nav.classList.add("page-nav--open");
        }
        else {
            nav.classList.add("page-nav--closed");
            nav.classList.remove("page-nav--open");
        }
    }

})();
