var MAP_INIT = (function() {
    var loadJSMap = function(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }
            if (!apiKey) {
                console.warn('[NLP-EGREEN] Google Maps API key chưa được cấu hình. Vào Admin > Cài đặt để thêm key.');
                reject(new Error('Missing Google Maps API key'));
                return;
            }
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&callback=_onGMapReady`;

            window._onGMapReady = () => {
                resolve();
                delete window._onGMapReady;
            };

            script.onerror = reject;
            document.body.appendChild(script);
        });
    };
    var initMap = function(){
        const mapA = new MapShowroom({
            mapEl: '#mapStationA',
            listEl: '#listStationA',
            defaultCenter: { lat: 20.960006705200506, lng: 105.740525463086 },
            defaultZoom: 5,
            focusZoom: 15,
            mobileScrollOffset: 100
        });
        window.mapNearStation = new MapShowroom({
            mapEl: '#map_near_station',
            listEl: '#result_near_station',
            defaultCenter: { lat: 20.960006705200506, lng: 105.740525463086 },
            defaultZoom: 5,
            focusZoom: 15,
            mobileScrollOffset: 100
        });
    };
    return {
        init: function() {
            initMap();
        },
        loadJSMap: function(apiKey) {
            return loadJSMap(apiKey);
        }
    };
})();

MAP_INIT.init();

// Đọc API key từ window.NLP_CONFIG (được inject bởi nlp-config.js)
// Để thay đổi key: vào Admin > Cài đặt Site > Google Maps API Key
(function() {
    var apiKey = (window.NLP_CONFIG && window.NLP_CONFIG.googleMapsKey) || '';
    MAP_INIT.loadJSMap(apiKey)
        .then(function() {
            MapShowroom.initAll();
        })
        .catch(function(err) {
            console.warn('[NLP-EGREEN] Google Maps không tải được:', err.message || err);
        });
})();
