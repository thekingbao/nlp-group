(function(global) {
    class MapShowroom {
        static _instances = [];

        constructor(options = {}) {
            const {
                mapEl,
                listEl,
                itemSelector = '.item',
                defaultCenter = {
                    lat: 16.0472484,
                    lng: 108.1716863
                },
                defaultZoom = 5,
                focusZoom = 15,
                mobileScrollOffset = 100
            } = options;

            this.mapEl = typeof mapEl === 'string' ? document.querySelector(mapEl) : mapEl;
            this.listEl = typeof listEl === 'string' ? document.querySelector(listEl) : listEl;
            this.itemSelector = itemSelector;
            this.defaultCenter = defaultCenter;
            this.defaultZoom = defaultZoom;
            this.focusZoom = focusZoom;
            this.mobileScrollOffset = mobileScrollOffset;

            this.map = null;
            this.markers = [];
            this.currentMarker = null;
            this._listClickBound = false;

            // ==== Tuyến & trạm gần tuyến ====
            this.routePolyline = null;
            this.stationMarkers = [];
            this.routeStyle = {
                strokeColor: '#1a73e8',
                strokeOpacity: 0.95,
                strokeWeight: 4,
                geodesic: true
            };

            // ==== NEW: điểm đầu–cuối tuyến ====
            this.routeEndpoints = {
                start: null,
                end: null
            };
            this.endpointStyle = {
                startLabel: 'A',
                endLabel: 'B',
                startIcon: null, // {url:'...', scaledSize: new google.maps.Size(32,32)}
                endIcon: null
            };

            MapShowroom._instances.push(this);
        }

        static initAll() {
            MapShowroom._instances.forEach(inst => inst.init());
        }

        // ===== public =====
        init() {
            if (!this.mapEl) return;
            this._initMap();
            this._renderAllMarkers();
            this._bindListClicks();
        }

        reload({
            center,
            zoom
        } = {}) {
            this._clearMarkers();
            if (center) this.map.setCenter(center);
            if (typeof zoom === 'number') this.map.setZoom(zoom);
            this._renderAllMarkers();
        }

        setListEl(listEl) {
            this.listEl = typeof listEl === 'string' ? document.querySelector(listEl) : listEl;
            this._bindListClicks(true);
        }

        destroy() {
            this._clearMarkers();
            this.clearRouteAndStations();
            const i = MapShowroom._instances.indexOf(this);
            if (i > -1) MapShowroom._instances.splice(i, 1);
            this.map = null;
        }

        // ===== vẽ tuyến & trạm gần tuyến =====
        setRouteByCoords(coords, fit = true) {
            if (!Array.isArray(coords) || coords.length < 2) return;
            const path = coords.map(p => new google.maps.LatLng(Number(p.lat), Number(p.lng)));
            this._applyRoutePath(path, fit);
        }

        setRouteByEncoded(encoded, fit = true) {
            if (!encoded || !(google.maps.geometry && google.maps.geometry.encoding)) return;
            const path = google.maps.geometry.encoding.decodePath(encoded);
            if (!path || path.length < 2) return;
            this._applyRoutePath(path, fit);
        }

        clearRouteAndStations() {
            if (this.routePolyline) {
                this.routePolyline.setMap(null);
                this.routePolyline = null;
            }
            this._clearStationMarkers();
            this._clearRouteEndpoints();
        }

        fetchStationsNearRoute(apiUrl, coords,stationType = 0, radiusM = 500) {
            if (!Array.isArray(coords) || coords.length < 2) return Promise.resolve();
            return XHR.send({
                url: apiUrl,
                method: 'POST',
                data: {
                    coordinates: JSON.stringify(coords), // bạn đang dùng form-encoded → stringify
                    radius_m: radiusM,
                    station_type:stationType
                }
            }).then((res) => {
                this.drawStationsFromData(res?.stations || []);
                return res;
            });
        }

        drawStationsFromData(items, clear = true) {
            if (clear) this._clearStationMarkers();
            const defaultIconUrl = this.mapEl.getAttribute('data-icon');
            items.forEach(s => {
                const lat = Number(s.lat),
                    lng = Number(s.lng);
                if (!lat || !lng) return;
                const iconUrl = s.icon_url || defaultIconUrl;
                const m = this._createMarkerBig(
                    new google.maps.LatLng(lat, lng),
                    s.name || '', s.address || '', s.id || '', iconUrl
                );
                this.stationMarkers.push(m);
            });
        }

        fitAll(padding = 40) {
            const bounds = new google.maps.LatLngBounds();
            let has = false;
            if (this.routePolyline && this.routePolyline.getPath().getLength() > 0) {
                const path = this.routePolyline.getPath();
                for (let i = 0; i < path.getLength(); i++) {
                    bounds.extend(path.getAt(i));
                    has = true;
                }
            }
            this.stationMarkers.forEach(m => {
                bounds.extend(m.getPosition());
                has = true;
            });
            if (this.routeEndpoints.start) {
                bounds.extend(this.routeEndpoints.start.getPosition());
                has = true;
            }
            if (this.routeEndpoints.end) {
                bounds.extend(this.routeEndpoints.end.getPosition());
                has = true;
            }
            if (has) this.map.fitBounds(bounds, padding);
        }

        // ===== private =====
        _initMap() {
            const silverStyle = [
                {
                    elementType: "geometry",
                    stylers: [{ color: "#f5f5f5" }]
                },
                {
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }]
                },
                {
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#616161" }]
                },
                {
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#f5f5f5" }]
                },
                {
                    featureType: "administrative",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#c9c9c9" }]
                },
                {
                    featureType: "administrative.land_parcel",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#dcdcdc" }]
                },
                {
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [{ color: "#eeeeee" }]
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#e5e5e5" }]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#ffffff" }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#757575" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#dadada" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#616161" }]
                },
                {
                    featureType: "road.local",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9e9e9e" }]
                },
                {
                    featureType: "transit.line",
                    elementType: "geometry",
                    stylers: [{ color: "#e5e5e5" }]
                },
                {
                    featureType: "transit.station",
                    elementType: "geometry",
                    stylers: [{ color: "#eeeeee" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#c9c9c9" }]
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9e9e9e" }]
                }
            ];

            this.map = new google.maps.Map(this.mapEl, {
                zoom: this.defaultZoom,
                center: this.defaultCenter,
                styles: silverStyle
            });
        }

        _clearMarkers() {
            this.markers.forEach(m => m.setMap(null));
            this.markers = [];
            if (this.currentMarker) {
                this.currentMarker.setMap(null);
                this.currentMarker = null;
            }
        }

        _collectItems() {
            if (!this.listEl) return [];
            const nodes = this.listEl.querySelectorAll(this.itemSelector);
            const items = [];
            nodes.forEach((el) => {
                const lat = Number(el.getAttribute('data-lat') || '0');
                const lng = Number(el.getAttribute('data-lng') || '0');
                const name = el.getAttribute('data-name') || el.querySelector('.name')?.textContent.trim() || '';
                const address = el.getAttribute('data-address') || el.querySelector('.address')?.textContent.trim() || '';
                const phone = el.getAttribute('data-phone') || el.querySelector('.phone')?.textContent.trim() || '';
                const icon_url = el.getAttribute('data-icon') || el.querySelector('.icon')?.textContent.trim() || '';
                items.push({
                    el,
                    lat,
                    lng,
                    name,
                    address,
                    phone,
                    icon_url
                });
            });
            return items;
        }

        _renderAllMarkers() {
            const data = this._collectItems();
            const defaultIconUrl = this.mapEl.getAttribute('data-icon');
            data.forEach((d) => {
                if (!d.lat || !d.lng) return;
                const currentIconUrl = d.icon_url || defaultIconUrl;
                const latlng = new google.maps.LatLng(d.lat, d.lng);
                const marker = this._createMarkerBig(latlng, d.name, d.address, d.phone, currentIconUrl);
                this.markers.push(marker);
            });
        }

        _bindListClicks(forceRebind = false) {
            if (!this.listEl) return;
            if (this._listClickBound && !forceRebind) return;

            if (this._listClickBound && forceRebind && this._listHandler) {
                this.listEl.removeEventListener('click', this._listHandler);
                this._listClickBound = false;
            }

            this._listHandler = (e) => {
                return;
                const item = e.target.closest(this.itemSelector);
                if (!item) return;
                e.preventDefault();

                const lat = Number(item.getAttribute('data-lat') || '0');
                const lng = Number(item.getAttribute('data-lng') || '0');

                if (!lat || !lng) {
                    this.map.setCenter(this.defaultCenter);
                    this.map.setZoom(this.defaultZoom);
                    return;
                }

                if (window.innerWidth < 991) {
                    const y = this.mapEl.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: y - this.mobileScrollOffset,
                        behavior: 'smooth'
                    });
                }

                this.listEl.querySelectorAll(this.itemSelector).forEach(el => el.classList.remove('act', 'active'));
                item.classList.add('act', 'active');

                this.map.setZoom(this.focusZoom);
                this.map.setCenter({
                    lat,
                    lng
                });

                if (this.currentMarker) this.currentMarker.setMap(null);
                const name = item.querySelector('.name')?.textContent.trim() || item.getAttribute('data-name') || '';
                const address = item.querySelector('.address')?.textContent.trim() || item.getAttribute('data-address') || '';
                const phone = item.querySelector('.phone')?.textContent.trim() || item.getAttribute('data-phone') || '';
                const latlng = new google.maps.LatLng(lat, lng);

                const iconUrl = this.mapEl.getAttribute('data-icon');
                this.currentMarker = this._createMarkerBig(latlng, name, address, phone, iconUrl);
            };

            this.listEl.addEventListener('click', this._listHandler);
            this._listClickBound = true;
        }

        _createMarkerBig(latlng, name, address, phone, iconUrl) {
            const image = iconUrl ? {
                url: iconUrl,
                scaledSize: new google.maps.Size(45, 55),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 45)
            } : null;

            const marker = new google.maps.Marker({
                position: latlng,
                icon: image || undefined,
                map: this.map,
                center: latlng,
                animation: google.maps.Animation.DROP
            });
            let html = '';
            if (window.innerWidth < 500) {
                html = `
                    <div class="flex flex-col gap-2 min-w-[220px]">
                        <h3 class="font-bold text-gray-800 text-[14px] leading-tight line-clamp-2" style="font-family: inherit;">${name || ''}</h3>
                        <p class="text-[12px] text-gray-500 mb-2 line-clamp-2" style="font-family: inherit;">${address || ''}</p>
                        <div class="flex gap-2 items-center">
                            <a href="javascript:void(0);" onclick="SEARCH_MAP.openDirection(this)" 
                               data-lat="${latlng.lat()}" data-lng="${latlng.lng()}" 
                               class="flex-1 bg-[var(--color-v1)] hover:opacity-90 text-white h-[34px] px-4 rounded-lg text-[12px] font-bold flex items-center justify-center whitespace-nowrap gap-2 transition-all shadow-sm" style="text-decoration:none;">
                               Chỉ đường
                               <i class="fa-solid fa-location-arrow"></i>
                            </a>
                            <a href="javascript:void(0);" onclick="AJAX_CALL_API.initModulePopupChargingStationDetail(this)" 
                               data-action="/station/detail/station/${phone}" 
                               class="flex-1 border border-[var(--color-v1)] hover:bg-[var(--color-v1)] bg-white text-[var(--color-v1)] hover:text-white h-[34px] px-4 rounded-lg whitespace-nowrap text-[12px] font-bold flex items-center justify-center gap-2 transition-all shadow-sm" style="text-decoration:none;">
                               Thông tin
                               <i class="fa-solid fa-circle-info"></i>
                            </a>
                        </div>
                    </div>`;
            } else {
                html =
                    '<div class="map-small">' +
                    '<div class="mb-2 name-info clgold fs-16 font-weight-bold">Tên: ' + (name || '') + '</div>' +
                    '<div class="mb-2 map-info">Địa chỉ: ' + (address || '') + '</div>' +
                    '<div class="flex mb-2 direction">' +
                    '<a href="javascript:void(0);" onclick="SEARCH_MAP.openDirection(this)" data-lat="' + latlng.lat() + '" data-lng="' + latlng.lng() + '" class="flex items-center px-2 py-2 mr-2 rounded-2xl border h-fit max-sm:w-fit border-main hover:bg-v1 hover:border-v1 hover:text-white group shrink-0">' +
                    'Chỉ đường <i class="ml-4 fa-solid fa-map text-v1 group-hover:text-white"></i>' +
                    '</a>' +
                    '<a href="javascript:void(0);" onclick="AJAX_CALL_API.initModulePopupChargingStationDetail(this)" data-action="/station/detail/station/' + phone + '" class="flex items-center px-2 py-2 rounded-2xl border h-fit max-sm:w-fit border-main hover:bg-v1 hover:border-v1 hover:text-white group shrink-0">' +
                    'Chi tiết <i class="ml-4 fa-solid fa-eye text-v1 group-hover:text-white"></i>' +
                    '</a>' +
                    '</div>' +
                    '</div>';
            }

            const infowindow = new google.maps.InfoWindow({
                content: html
            });
            marker.addListener('click', () => infowindow.open(this.map, marker));
            return marker;
        }

        // ===== helpers cho tuyến =====
        _applyRoutePath(path, fit) {
            if (!this.routePolyline) {
                this.routePolyline = new google.maps.Polyline({
                    path: [],
                    map: this.map,
                    ...this.routeStyle
                });
            }
            this.routePolyline.setPath(path);

            // cập nhật điểm đầu–cuối
            this._updateRouteEndpoints(path);

            if (fit) this.fitAll();
        }

        _updateRouteEndpoints(path) {
            if (!path || path.length < 2) {
                this._clearRouteEndpoints();
                return;
            }

            const startLatLng = path[0];
            const endLatLng = path[path.length - 1];

            // Start marker
            if (!this.routeEndpoints.start) {
                this.routeEndpoints.start = new google.maps.Marker({
                    position: startLatLng,
                    map: this.map,
                    icon: this.endpointStyle.startIcon || undefined,
                    label: this.endpointStyle.startIcon ? undefined : {
                        text: this.endpointStyle.startLabel,
                        fontWeight: '700',
                        color: 'white' // 👈 thêm màu trắng
                    }
                });
            } else {
                this.routeEndpoints.start.setPosition(startLatLng);
                this.routeEndpoints.start.setMap(this.map);
            }

            // End marker
            if (!this.routeEndpoints.end) {
                this.routeEndpoints.end = new google.maps.Marker({
                    position: endLatLng,
                    map: this.map,
                    icon: this.endpointStyle.endIcon || undefined,
                    label: this.endpointStyle.endIcon ? undefined : {
                        text: this.endpointStyle.endLabel,
                        fontWeight: '700',
                        color: 'white' // 👈 thêm màu trắng
                    }
                });
            } else {
                this.routeEndpoints.end.setPosition(endLatLng);
                this.routeEndpoints.end.setMap(this.map);
            }
        }

        _clearRouteEndpoints() {
            if (this.routeEndpoints.start) {
                this.routeEndpoints.start.setMap(null);
                this.routeEndpoints.start = null;
            }
            if (this.routeEndpoints.end) {
                this.routeEndpoints.end.setMap(null);
                this.routeEndpoints.end = null;
            }
        }

        _clearStationMarkers() {
            this.stationMarkers.forEach(m => m.setMap(null));
            this.stationMarkers = [];
        }
    }

    global.MapShowroom = MapShowroom;
})(window);