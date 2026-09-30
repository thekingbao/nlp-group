var MAP_INIT = (function() {
    var loadJSMap = function(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
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
        init:function(){
            initMap();
        },
        loadJSMap: function(apiKey) {
            // PHẢI return Promise ra ngoài
            return loadJSMap(apiKey);
        }
    };
})();
MAP_INIT.init();
MAP_INIT.loadJSMap('AIzaSyAroJbDC8tULXcBZGpmiM134Hm1T8Bfknk')
    .then(() => {
        MapShowroom.initAll();
    })
    .catch((err) => {
        console.error('Google Maps load failed:', err);
    });
    
