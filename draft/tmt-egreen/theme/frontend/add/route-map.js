;(() => {
    const DEFAULT_STYLE = {
        strokeColor: "#1a73e8",
        strokeOpacity: 0.95,
        strokeWeight: 4,
        geodesic: true
    };

    class RouteMap {
        /**
         * @param {HTMLElement|string} container - DOM element hoặc selector
         * @param {Object} [opts]
         * @param {Object} [opts.mapOptions] - Tuỳ chọn Google Map (center, zoom...)
         * @param {Object} [opts.routeStyle] - Style polyline
         * @param {boolean} [opts.showMarkers=true] - Hiện marker A/B
         * @param {number} [opts.fitPadding=40] - Padding khi fitBounds
         */
        constructor(container, opts = {}) {
            // Resolve container
            this.el = typeof container === "string" ? document.querySelector(container) : container;
            if (!this.el) throw new Error("RouteMap: container not found");

            // Check Google Maps loaded
            if (!(window.google && google.maps && google.maps.Map)) {
                throw new Error("RouteMap: Google Maps JS chưa sẵn sàng. Hãy load script trước.");
            }

            this.opts = {
                mapOptions: {
                    mapTypeId: "roadmap",
                    clickableIcons: false,
                    ...(opts.mapOptions || {})
                },
                routeStyle: {
                    ...DEFAULT_STYLE,
                    ...(opts.routeStyle || {})
                },
                showMarkers: opts.showMarkers !== false,
                fitPadding: typeof opts.fitPadding === "number" ? opts.fitPadding : 40
            };

            // Init map
            this.map = new google.maps.Map(this.el, this.opts.mapOptions);

            // Prepare polyline
            this.polyline = new google.maps.Polyline({
                path: [],
                ...this.opts.routeStyle,
                map: this.map
            });

            this.startMarker = null;
            this.endMarker = null;
        }

        /**
         * Cập nhật tuyến đường bằng mảng toạ độ [{lat,lng}, ...]
         * @param {Array<{lat:number,lng:number}>} coords
         * @param {boolean} [fit=true]
         */
        setCoordinates(coords, fit = true) {
            if (!Array.isArray(coords) || coords.length < 2) {
                throw new Error("RouteMap.setCoordinates: cần >= 2 điểm {lat,lng}");
            }
            const path = coords.map(p => new google.maps.LatLng(p.lat, p.lng));
            this._applyPath(path, fit);
        }

        /**
         * Cập nhật tuyến đường bằng overview_polyline (chuỗi encoded)
         * Cần nạp Google Maps với libraries=geometry
         * @param {string} encoded
         * @param {boolean} [fit=true]
         */
        setEncodedPolyline(encoded, fit = true) {
            if (!encoded || !(google.maps.geometry && google.maps.geometry.encoding)) {
                throw new Error("RouteMap.setEncodedPolyline: cần libraries=geometry & chuỗi hợp lệ");
            }
            const path = google.maps.geometry.encoding.decodePath(encoded);
            if (!path || path.length < 2) {
                throw new Error("RouteMap.setEncodedPolyline: path không hợp lệ");
            }
            this._applyPath(path, fit);
        }

        /**
         * Fit bản đồ vào tuyến hiện tại
         */
        fit() {
            const path = this.polyline.getPath();
            if (!path || path.getLength() < 1) return;
            const bounds = new google.maps.LatLngBounds();
            for (let i = 0; i < path.getLength(); i++) bounds.extend(path.getAt(i));
            this.map.fitBounds(bounds, this.opts.fitPadding);
        }

        /**
         * Xoá tuyến + marker
         */
        clear() {
            this.polyline.setPath([]);
            if (this.startMarker) {
                this.startMarker.setMap(null);
                this.startMarker = null;
            }
            if (this.endMarker) {
                this.endMarker.setMap(null);
                this.endMarker = null;
            }
        }

        /**
         * Huỷ map (nếu cần)
         */
        destroy() {
            this.clear();
            this.map = null;
            this.polyline = null;
            this.el = null;
        }

        // ---------- private ----------
        _applyPath(path, fit) {
            // Set polyline
            this.polyline.setPath(path);

            // Markers
            if (this.opts.showMarkers) {
                const start = path[0];
                const end = path[path.length - 1];

                if (!this.startMarker) {
                    this.startMarker = new google.maps.Marker({
                        map: this.map,
                        label: {
                            text: "A",
                            color: "#fff"
                        },
                        title: "Điểm đầu"
                    });
                }
                if (!this.endMarker) {
                    this.endMarker = new google.maps.Marker({
                        map: this.map,
                        label: {
                            text: "B",
                            color: "#fff"
                        },
                        title: "Điểm cuối"
                    });
                }
                this.startMarker.setPosition(start);
                this.endMarker.setPosition(end);
            } else {
                if (this.startMarker) {
                    this.startMarker.setMap(null);
                    this.startMarker = null;
                }
                if (this.endMarker) {
                    this.endMarker.setMap(null);
                    this.endMarker = null;
                }
            }

            // Fit
            if (fit) this.fit();
        }
    }

    // UMD export
    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = RouteMap;
    } else {
        window.RouteMap = RouteMap;
    }
})();