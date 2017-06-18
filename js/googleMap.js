
    function initMap() {
        let icons = {
            main_address: {
                icon: "../img/icons-svg/icon-map-pin.svg"
            }
        };
        let uluru = {lat: 59.9387942, lng: 30.3244322802915};
        let map = new google.maps.Map(document.getElementById("map"), {
            center: uluru,
            scrollwheel: false,
            zoom: 13
        });

        let marker = new google.maps.Marker({
            position: uluru,
            map: map,
            icon: icons.main_address.icon
        });

        google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });
    }
