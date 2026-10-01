var SEARCH_MAP = (function(){
    let typingTimer; // lưu timer toàn cục trong module
    const debounceDelay = 400; // 800ms = 0.8s, có thể chỉnh 2000ms = 2s
    let routeMapInstance = null;
    var getProvinceAndWardForNearestStation = function(){
        var find_nearest_station_province = document.querySelector('.find_nearest_station_province');
        var find_nearest_station_province_ward = document.querySelector('.find_nearest_station_province_ward');
        if(find_nearest_station_province != undefined && find_nearest_station_province != null){
            document.querySelector('.find_nearest_station_province')
                .addEventListener("change", function () {
                    var selectedOption = this.options[this.selectedIndex];
                    var input_address_search_station = document.getElementById('input_address_search_station');
                    if (selectedOption) {
                        if(selectedOption.text != 'Chọn tỉnh/thành phố'){
                            input_address_search_station.setAttribute('data-province', selectedOption.text);
                            input_address_search_station.setAttribute('data-lat', selectedOption.getAttribute('data-lat'));
                            input_address_search_station.setAttribute('data-lng', selectedOption.getAttribute('data-lng'));
                            input_address_search_station.setAttribute('data-item-type', 'province');
                            input_address_search_station.setAttribute('data-province-id', selectedOption.value || '');
                            input_address_search_station.setAttribute('data-ward-id', '');
                        }
                        else{
                            input_address_search_station.setAttribute('data-province', '');
                            input_address_search_station.setAttribute('data-lat', '');
                            input_address_search_station.setAttribute('data-lng', '');
                            input_address_search_station.setAttribute('data-item-type', 'all');
                            input_address_search_station.setAttribute('data-province-id', '');
                            input_address_search_station.setAttribute('data-ward-id', '');
                        }
                    }
                    else{

                        input_address_search_station.setAttribute('data-province', '');
                        input_address_search_station.setAttribute('data-lat', '');
                        input_address_search_station.setAttribute('data-lng', '');
                        input_address_search_station.setAttribute('data-item-type', 'all');
                        input_address_search_station.setAttribute('data-province-id', '');
                        input_address_search_station.setAttribute('data-ward-id', '');
                    }
                    SEARCH_MAP.submitSearchStation();
                });
        }
        if(find_nearest_station_province_ward != undefined && find_nearest_station_province_ward != null){
            // chọn phường
            document.querySelector('.find_nearest_station_province_ward')
                .addEventListener("change", function () {
                    var selectedOption = this.options[this.selectedIndex];
                    var input_address_search_station = document.getElementById('input_address_search_station');
                    if (selectedOption) {
                        
                        if(selectedOption.text != 'Chọn phường/xã'){
                            input_address_search_station.setAttribute('data-ward', selectedOption.text);
                            input_address_search_station.setAttribute('data-lat', selectedOption.getAttribute('data-lat'));
                            input_address_search_station.setAttribute('data-lng', selectedOption.getAttribute('data-lng'));
                            input_address_search_station.setAttribute('data-item-type', 'ward');
                            input_address_search_station.setAttribute('data-ward-id', selectedOption.value || '');
                        }   
                        else{
                            if(find_nearest_station_province != undefined && find_nearest_station_province != null){
                                var selectedOption = find_nearest_station_province.options[find_nearest_station_province.selectedIndex];
                                input_address_search_station.setAttribute('data-province', selectedOption.text);
                                input_address_search_station.setAttribute('data-lat', selectedOption.getAttribute('data-lat'));
                                input_address_search_station.setAttribute('data-lng', selectedOption.getAttribute('data-lng'));
                                input_address_search_station.setAttribute('data-item-type', 'province');
                                input_address_search_station.setAttribute('data-province-id', selectedOption.value || '');
                                input_address_search_station.setAttribute('data-ward-id', '');
                            }
                        }
                    }
                    SEARCH_MAP.submitSearchStation();
                });
        }
    }

    var searchByName = function(element,result_box){
        clearTimeout(typingTimer);
        
        typingTimer = setTimeout(function(){
            var action = element.getAttribute('data-action');
            var address = element.value.trim();
            var province = element.getAttribute('data-province');
            var ward = element.getAttribute('data-ward');
            if(ward != ''){
                address += ' '+ward;
            }

            if(province != ''){
                address += ' '+province;
            }


            if(address.length === 0) {
                result_box.innerHTML = ""; 
                return;
            }

            XHR.send({
                url: action,
                method: "GET",
                data: { address: address },
            }).then((res) => {
                result_box.innerHTML = res.html;
            });
        }, debounceDelay);
    };

    var getLocationCurrent = function(element,result_box){
        var list_result_location = result_box.querySelector('.list-inside');
        if(list_result_location == undefined || list_result_location == null){
            XHR.send({
                url: element.getAttribute('data-action-location-current'),
                method: "GET",
                data: { 
                    lat: element.getAttribute('data-lat'),
                    lng: element.getAttribute('data-lng') 
                },
            }).then((res) => { 
                result_box.innerHTML = res.html;
            });
        }
    }

    var chooseAddress = function(element){
        var _this = element;
        var box_item_search_map = element.closest('.box_item_search_map');
        var input = box_item_search_map.querySelector('input');
        var address = element.getAttribute('data-name');
        var lat = element.getAttribute('data-lat');
        var lng = element.getAttribute('data-lng');
        input.value = address;
        input.setAttribute('data-lat',lat);
        input.setAttribute('data-lng',lng);
        input.setAttribute('data-item-type', 'detail');
        box_item_search_map.classList.remove('active');
        var input_address_search_station = document.getElementById('input_address_search_station');
        if(input_address_search_station != undefined && input_address_search_station != null){
            SEARCH_MAP.submitSearchStation();
        }
    };

    var submitSearchStation = function(){
        var input_address_search_station = document.getElementById('input_address_search_station');
        var result_near_station = document.getElementById('result_near_station');
        LOADING.fadeInWave(document.querySelector('body'));
        var action = input_address_search_station.getAttribute('data-action-search');
        var lat = input_address_search_station.getAttribute('data-lat');
        var lng = input_address_search_station.getAttribute('data-lng');
        var item_type = input_address_search_station.getAttribute('data-item-type');
        // Id dia gioi hanh chinh: backend loc theo province_id/ward_id thay vi ban kinh
        var province_id = input_address_search_station.getAttribute('data-province-id') || '';
        var ward_id = input_address_search_station.getAttribute('data-ward-id') || '';
        var station_type = document.querySelector('input[name="station_type"]:checked')?.value;
        var input_filter_active = document.querySelector('input[name="filter_active"]:checked');
        var select_filter_active = document.querySelector('select[name="filter_active"]');
        var filter_active = 0; 
        // console.log(input_filter_active,select_filter_active);
        if(input_filter_active != undefined && input_filter_active != null){
            filter_active = document.querySelector('input[name="filter_active"]:checked')?.value;
        }
        else if(select_filter_active != undefined && select_filter_active != null){
            filter_active = select_filter_active?.value;
        }
        
        XHR.send({
            url: action,
            method: "GET",
            data: { 
                lat: lat,
                lng: lng,
                station_type:station_type,
                filter_active:filter_active,
                item_type:item_type,
                province_id:province_id,
                ward_id:ward_id
            }
        }).then((res) => {
            result_near_station.innerHTML = res.html;
            
            setTimeout(function(){
                var input_address_search_station = document.getElementById('input_address_search_station');
                var lat = input_address_search_station.getAttribute('data-lat');
                var lng = input_address_search_station.getAttribute('data-lng');
                if((lat != null && lat != undefined && lat != '') && (lng != null && lng != undefined && lng != '')){
                    var zoom = 8;
                    if(item_type == 'ward'){
                        var zoom = 11;
                    }
                    else if(item_type == 'detail'){
                        var zoom = 14;
                    }
                    window.mapNearStation.defaultCenter =  { lat: parseFloat(lat), lng: parseFloat(lng) };
                    window.mapNearStation.reload({
                        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
                        zoom: zoom
                    });
                }
                else if(item_type == 'all'){
                    var zoom = 5;
                    var lat = 20.960006705200506;
                    var lng = 105.740525463086;
                    window.mapNearStation.defaultCenter =  { lat: parseFloat(lat), lng: parseFloat(lng) };
                    window.mapNearStation.reload({
                        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
                        zoom: zoom
                    });
                }
                else{
                    window.mapNearStation.reload({});
                }
                LOADING.fadeOutWave(document.querySelector('body'));
                SLIDER.runSliderFindStation();
            },2000);
        });
    }

    var openDirection = function(btn){
        var destLat = parseFloat(btn.getAttribute("data-lat"));
        var destLng = parseFloat(btn.getAttribute("data-lng"));

        if (isNaN(destLat) || isNaN(destLng)) {
            console.error("Thiếu toạ độ trạm");
            return;
        }

        // Hàm lấy vị trí hiện tại (Promise)
        var getPosition = function(){
            return new Promise(function(resolve, reject){
                if (!("geolocation" in navigator)) return reject("NO_GEO");
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 8000,
                    maximumAge: 0
                });
            });
        };

        // Kiểm tra iOS (Apple Maps)
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        // Hàm mở map
        var openMaps = function(origin){
            if (isIOS) {
                var url = origin
                  ? `maps://?saddr=${origin.lat},${origin.lng}&daddr=${destLat},${destLng}`
                  : `maps://?daddr=${destLat},${destLng}`;
                window.location.href = url;
            } else {
                var url = origin
                  ? `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destLat},${destLng}&travelmode=driving`
                  : `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
                window.open(url, "_blank");
            }
        };

        // Gọi geolocation
        btn.disabled = true;
        btn.textContent = "Đang lấy vị trí...";

        getPosition().then(function(pos){
            var origin = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            openMaps(origin);
        }).catch(function(){
            // Nếu bị từ chối thì chỉ dẫn tới điểm đích
            openMaps(null);
        }).finally(function(){
            btn.disabled = false;
            btn.textContent = "Chỉ đường";
        });
    };
    var searchMapByRoute = function(element){
        
        var input_pickup = document.getElementById('input_pickup');
        var input_destination = document.getElementById('input_destination');
        var action = element.getAttribute('data-action');
        var lat_pickup = input_pickup.getAttribute('data-lat');
        var lng_pickup = input_pickup.getAttribute('data-lng');
        var lat_destination = input_destination.getAttribute('data-lat');
        var lng_destination = input_destination.getAttribute('data-lng');
        var station_type = document.querySelector('input[name="station_type"]:checked')?.value;
        if (lat_pickup && lng_pickup && lat_destination && lng_destination) {
            LOADING.fadeInWave(document.querySelector('body'));
            XHR.send({
                url: action,
                method: "GET",
                data: { 
                    lat_pickup: lat_pickup,
                    lng_pickup: lng_pickup,
                    lat_destination: lat_destination,
                    lng_destination: lng_destination
                }
            }).then((res) => {
                LOADING.fadeOutWave(document.querySelector('body'));
                if (res.extra && Array.isArray(res.extra.coordinates)) {
                    window.mapNearStationRoute = new MapShowroom({
                        mapEl: '#mapStationA',
                        defaultCenter: { lat: 20.960006705200506, lng: 105.740525463086 },
                        defaultZoom: 5,
                        focusZoom: 15,
                        mobileScrollOffset: 100
                    });
                    window.mapNearStationRoute.init();
                    window.mapNearStationRoute.setRouteByCoords(res.extra.coordinates);
                    window.mapNearStationRoute.fetchStationsNearRoute('/station/near/route', res.extra.coordinates,station_type, 50000);
                    setTimeout(() => window.mapNearStationRoute.fitAll(48), 0);
                }
                else {
                    NOTIFICATION.showNotify(100, 'Không tìm thấy dữ liệu tuyến đường!');
                }
            });
        }
        else{
            NOTIFICATION.showNotify(100,'Vui lòng chọn điểm đầu và điểm cuối hợp lệ!');
        }
    };

    return{
        init:function(){
            getProvinceAndWardForNearestStation();
        },
        searchByName:function(element,result_box){
            searchByName(element,result_box);
        },
        chooseAddress:function(element){
            chooseAddress(element);
        },
        submitSearchStation:function(){
            submitSearchStation();
        },
        openDirection:function(btn){
            openDirection(btn);
        },
        searchMapByRoute:function(element){
            searchMapByRoute(element);
        },
        getLocationCurrent:function(element,result_box){
            getLocationCurrent(element,result_box);
        }
    }
})();
SEARCH_MAP.init();