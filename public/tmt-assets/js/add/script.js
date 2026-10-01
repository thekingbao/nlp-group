var TMT_FUNCTION = (function () {
    var initAddress = function () {
        var listSelectProvince = document.querySelectorAll(
            "select[name=province]"
        );
        if (listSelectProvince != undefined && listSelectProvince != null)
        {
            listSelectProvince.forEach(function (selectProvince) {
                selectProvince.addEventListener("change", function () {
                    XHR.send({
                        url: selectProvince.dataset.action,
                        method: "GET",
                        data: { province: selectProvince.value },
                    }).then((res) => {
                        var selectWard = selectProvince
                            .closest("form")
                            .querySelector("select[name=ward]");
                        if (selectWard)
                        {
                            selectWard.disabled = false;
                            selectWard.readOnly = false;
                            selectWard.innerHTML = res.html;
                            selectWard.dispatchEvent(new Event("change"));
                        }
                    });
                });
            });
        }
    }
    var calculateProfit = function () {
        var list_item_calculate_profit = document.querySelectorAll('.item_calculate_profit');
        if (list_item_calculate_profit && list_item_calculate_profit.length)
        {
            function _recalc() {
                var chargingHourEl = document.getElementById('input_charging_hour');
                var chargingHour = TMT_FUNCTION._toNumber(chargingHourEl ? chargingHourEl.value : 0);
                var monthTotal = 0;
                var yearTotal = 0;

                // cộng dồn các loại sạc đã thêm
                document.querySelectorAll('.charger-item').forEach(function (row) {
                    var unit = TMT_FUNCTION._toNumber(row.getAttribute('data-unit-price'));
                    var profit = TMT_FUNCTION._toNumber(row.getAttribute('data-unit-profit'));
                    var performance = row.getAttribute('data-unit-performance');
                    var qtyEl = row.querySelector('.qty-input');
                    var qty = TMT_FUNCTION._toNumber(qtyEl ? qtyEl.value : 0);
                    var dayTotal = unit * chargingHour * profit * performance * qty;

                    monthTotal += dayTotal * 30;
                    yearTotal += dayTotal * 365;
                });

                
                var revMonth = document.getElementById('revenue_month');
                var revYear = document.getElementById('revenue_year');

                if (revMonth){
                    var rawMonthTotal = TMT_FUNCTION._toNumber(revMonth.getAttribute('data-provisional-profit'));
                    console.log(monthTotal,rawMonthTotal);
                    // revMonth.innerText = TMT_FUNCTION._number_format(monthTotal+rawMonthTotal) + ' VNĐ';
                    revMonth.innerText = TMT_FUNCTION._number_format(monthTotal+rawMonthTotal);
                }
                if (revYear){
                    var rawYearTotal = TMT_FUNCTION._toNumber(revYear.getAttribute('data-provisional-profit'));
                    console.log(yearTotal,rawYearTotal);
                    // revYear.innerText = TMT_FUNCTION._number_format(yearTotal+rawYearTotal) + ' VNĐ';
                    revYear.innerText = TMT_FUNCTION._number_format(yearTotal+rawYearTotal);
                }
            };

            list_item_calculate_profit.forEach(function (input) {
                input.addEventListener('change', _recalc);
                input.addEventListener('input', _recalc);
            });

            _recalc();
        }
    }

    var _number_format = function (number) {
        return new Intl.NumberFormat().format(number).replaceAll(".", ",");
    }

    var _toNumber = function (v) {
        if (typeof v === 'number') return v;
        if (!v) return 0;
        var cleaned = String(v).replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
        var n = parseFloat(cleaned);
        return isNaN(n) ? 0 : n;
    }
    var showOrHiddenToc = function () {

        var button_show_or_hidden_toc = document.querySelector('.show_or_hidden_toc');

        if(button_show_or_hidden_toc == null || button_show_or_hidden_toc == undefined){

            return true;

        }

        var toc_list = document.querySelector('.toc_list');

        button_show_or_hidden_toc.addEventListener("click", function(){

            var _this = this;

            if (_this.classList.contains("show")) {

                _this.classList.remove("show");

                toc_list.classList.add('hidden');

            } else {

                _this.classList.add("show");

                toc_list.classList.remove('hidden');

            }

        });

    };


    return {
        init: function () {
            calculateProfit();
            showOrHiddenToc();
        },
        _number_format: function (number) {
            return _number_format(number);
        },
        calculateProfit: function () {
            calculateProfit();
        },
        _toNumber: function (number) {
            return _toNumber(number);
        }
    }
})();
TMT_FUNCTION.init();


(function () {
    var selectEl = document.getElementById("select_charger_type");
    var qtyEl = document.getElementById("input_number_type");
    var btnAdd = document.getElementById("btn_add_charger");
    var listContainer = document.getElementById("charger_type_list");

    function getSelectedNames() {
        return Array.from(listContainer.querySelectorAll('.charger-item select'))
            .map(sel => sel.value);
    }

    function refreshMainSelect() {
        const selectedNames = getSelectedNames();
        Array.from(selectEl.options).forEach(opt => {
            if (!opt.value) return;
            opt.disabled = selectedNames.includes(opt.text.trim());
        });
    }

    function buildSelectHTML(selectedName) {
        let html = `<select class="px-2 py-1 pr-10 bg-white rounded border select-charger max-xs:w-full">`;
        html += `<option value="" hidden>Chọn loại sạc</option>`;
        Array.from(selectEl.options).forEach(opt => {
            if (!opt.value) return;
            const disabled = opt.text.trim() !== selectedName && getSelectedNames().includes(opt.text.trim());
            const selected = opt.text.trim() === selectedName ? 'selected' : '';
            html += `<option value="${opt.text.trim()}" ${disabled ? 'disabled' : ''} ${selected}>${opt.text.trim()}</option>`;
        });
        html += `</select>`;
        return html;
    }

    function addRow(name, unitPrice,unitProfit, unitPerformance,qty) {
        var row = document.createElement("div");
        row.className = "charger-item flex max-xs:flex-wrap gap-y-2 items-center justify-between bg-white rounded-[1.25rem] p-4 relative";
        row.setAttribute("data-unit-price", unitPrice);
        row.setAttribute("data-unit-profit", unitProfit);
        row.setAttribute("data-unit-performance", unitPerformance);

        row.innerHTML = `
            <div class="flex gap-2 items-center max-xs:w-full">
                ${buildSelectHTML(name)}
            </div>
            <div class="flex gap-2 items-center max-xs:w-full max-xs:justify-between">
                <span>Số lượng</span>
                <input type="number" value="${qty}" class="w-12 text-center rounded border qty-input item_calculate_profit" />
            </div>
            <button type="button" class="text-red-600 hover:underline btn-remove max-xs:absolute max-xs:-top-3 max-xs:-right-3 max-xs:z-[1]">
                <span class="max-xs:hidden">Xóa</span>
                <span class="xs:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="size-8"><path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z" fill="currentColor"/></svg>
                </span>
            </button>
        `;

        // Xử lý xóa
        row.querySelector(".btn-remove").addEventListener("click", function () {
            listContainer.removeChild(row);
            refreshMainSelect();
            TMT_FUNCTION.calculateProfit();
        });

        // Khi đổi loại sạc trong select
        row.querySelector("select").addEventListener("change", function () {
            const selectedText = this.value.trim();
            const matchedOpt = Array.from(selectEl.options).find(opt => opt.text.trim() === selectedText);
            const newUnit = matchedOpt ? TMT_FUNCTION._toNumber(matchedOpt.value) : 0;
            const newProfit = matchedOpt ? TMT_FUNCTION._toNumber(matchedOpt.getAttribute('data-profit')) : 0;
            const newPerformance = matchedOpt ? matchedOpt.getAttribute('data-performance') : 0;
            row.setAttribute('data-unit-price', newUnit);
            row.setAttribute('data-unit-profit', newProfit);
            row.setAttribute('data-unit-performance', newPerformance);
            refreshMainSelect();
            TMT_FUNCTION.calculateProfit();
        });

        // Khi đổi số lượng
        row.querySelector(".qty-input").addEventListener("input", TMT_FUNCTION.calculateProfit);
        row.querySelector(".qty-input").addEventListener("change", TMT_FUNCTION.calculateProfit);

        listContainer.appendChild(row);
        refreshMainSelect();
        const revMonth = document.getElementById('revenue_month');
        const revYear = document.getElementById('revenue_year');
        if (revMonth) revMonth.setAttribute('data-provisional-profit',0);
        if (revYear) revYear.setAttribute('data-provisional-profit',0);
        TMT_FUNCTION.calculateProfit();
    }

    if (btnAdd)
    {
        btnAdd.addEventListener("click", function () {
            var opt = selectEl.options[selectEl.selectedIndex];
            if (!opt || !opt.value) return;

            var name = opt.text.trim();
            var unitPrice = TMT_FUNCTION._toNumber(opt.value);
            var unitProfit = TMT_FUNCTION._toNumber(opt.getAttribute('data-profit'));
            var unitPerformance = opt.getAttribute('data-performance');
            var qty = TMT_FUNCTION._toNumber(qtyEl.value) || 1;

            // Không thêm trùng
            if (getSelectedNames().includes(name))
            {
                alert("Loại sạc này đã được thêm.");
                return;
            }

            addRow(name, unitPrice, unitProfit,unitPerformance,qty);

            selectEl.value = "";
            qtyEl.value = 1;
        });
    }

    function provisionalProfit(){
        var opt = selectEl.options[selectEl.selectedIndex];

        const unitPrice = TMT_FUNCTION._toNumber(opt.value);
        const unitProfit = TMT_FUNCTION._toNumber(opt.getAttribute('data-profit'));
        const unitPerformance = opt.getAttribute('data-performance');

        const qty = TMT_FUNCTION._toNumber(qtyEl.value) || 1;

        const chargingHourEl = document.getElementById('input_charging_hour');
        const chargingHour = TMT_FUNCTION._toNumber(chargingHourEl ? chargingHourEl.value : 0);
        const dayTotal = unitProfit * unitPerformance * unitPrice * qty * chargingHour;

        const monthTotal = dayTotal * 30;
        const yearTotal = dayTotal * 365;

        const revMonth = document.getElementById('revenue_month');
        const revYear = document.getElementById('revenue_year');
        if (revMonth) revMonth.setAttribute('data-provisional-profit',monthTotal);
        if (revYear) revYear.setAttribute('data-provisional-profit',yearTotal);
        setTimeout(function(){
            TMT_FUNCTION.calculateProfit();
        },100);
    }
    if(selectEl){
        selectEl.addEventListener('change',function(){
            provisionalProfit();
        });
    }
    if(qtyEl){
        ['input', 'change'].forEach(evt =>
            qtyEl.addEventListener(evt, provisionalProfit)
        );
    }
    const chargingHourEl = document.getElementById('input_charging_hour');
    if (chargingHourEl) {
        ['input', 'change'].forEach(evt =>
            chargingHourEl.addEventListener(evt, provisionalProfit)
        );
    }
})();

(async function () {
    const CACHE_KEY = 'user_location_cache';
    const CACHE_TTL = 1000 * 60 * 30; // 30 phút
    // Đọc cache từ localStorage
    function readCache() {
        try
        {
            const item = JSON.parse(localStorage.getItem(CACHE_KEY));
            if (!item) return null;
            if (Date.now() - item.time > CACHE_TTL)
            {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }
            return item.data;
        } catch
        {
            return null;
        }
    }

    // Lưu cache
    function saveCache(data) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            time: Date.now()
        }));
    }

    // Lấy vị trí GPS (nếu user cho phép)
    function getGPS() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) reject('Trình duyệt không hỗ trợ geolocation');
            navigator.geolocation.getCurrentPosition(
                pos => {
                    resolve({
                        source: 'gps',
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy
                    });
                },
                () => reject('Người dùng từ chối hoặc không thể xác định vị trí.'), {
                enableHighAccuracy: true,
                timeout: 8000
            }
            );
        });
    }

    // Fallback theo IP nếu bị từ chối GPS
    async function getIPLocation() {
        try
        {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            return {
                source: 'ip',
                lat: data.latitude,
                lng: data.longitude,
                city: data.city,
                region: data.region,
                country: data.country_name
            };
        } catch
        {
                        return { source: 'default', lat: 21.0278, lng: 105.8342, city: 'Ha Noi', region: 'Ha Noi', country: 'Vietnam' };
        }
    }

    // Luồng chính
    async function getUserLocation() {
        const cached = readCache();
        if (cached)
        {
            console.log('📦 Dùng vị trí trong cache:', cached);
            return cached;
        }

        try
        {
            const gps = await getGPS();
            saveCache(gps);
            console.log('📍 Lấy từ GPS:', gps);
            return gps;
        } catch (err)
        {
            console.warn('⚠️ GPS thất bại:', err);
            const ip = await getIPLocation();
            if (ip)
            {
                saveCache(ip);
                console.log('🌐 Lấy từ IP:', ip);
                return ip;
            } else
            {
                const fallback = {
                    source: 'unknown',
                    note: 'Không thể xác định vị trí'
                };
                console.log('❌ Fallback:', fallback);
                return fallback;
            }
        }
    }


    // Gọi hàm chính
    const locationData = await getUserLocation();
    if (!locationData || !locationData.lat || !locationData.lng)
    {
        console.warn("Không lấy được vị trí hợp lệ.");
        return; // hoặc hiển thị thông báo cho user
    }
    var input_address_search_station = document.getElementById('input_address_search_station');
    if (input_address_search_station != undefined && input_address_search_station != null)
    {
        // input_address_search_station.setAttribute('data-lat', locationData.lat);
        // input_address_search_station.setAttribute('data-lng', locationData.lng);
    }
    var input_pickup = document.getElementById('input_pickup');
    if (input_pickup != undefined && input_pickup != null)
    {
        input_pickup.setAttribute('data-lat', locationData.lat);
        input_pickup.setAttribute('data-lng', locationData.lng);
    }
    XHR.send({
        url: '/location/current',
        method: "GET",
        data: {
            lat: locationData.lat,
            lng: locationData.lng
        },
    }).then((res) => { });
    // 👉 Ví dụ: hiển thị lên console hoặc gửi về server
    console.log('Vị trí người dùng:', locationData);
})();

(function () {
    var selectElMobile = document.getElementById("select_charger_type_mobile");
    var qtyElMobile = document.getElementById("input_number_type_mobile");
    var chargingHourElMobile = document.getElementById("input_charging_hour_mobile");
    var btnCalcMobile = document.getElementById("btn_calc_profit_mobile");

    var revMonthMobile = document.getElementById('revenue_month_mobile');
    var revYearMobile = document.getElementById('revenue_year_mobile');
    
    // Nếu không tìm thấy các element mobile thì thôi
    if (!selectElMobile || !qtyElMobile || !chargingHourElMobile) return;

    function calculateMobileProfit() {
        var opt = selectElMobile.options[selectElMobile.selectedIndex];
        
        var unitPrice = 0;
        var unitProfit = 0;
        var unitPerformance = 0;

        if (opt && opt.value) {
            unitPrice = TMT_FUNCTION._toNumber(opt.value);
            unitProfit = TMT_FUNCTION._toNumber(opt.getAttribute('data-profit'));
            unitPerformance = parseFloat(opt.getAttribute('data-performance'));
            if (isNaN(unitPerformance)) unitPerformance = 0;
        }

        var qty = TMT_FUNCTION._toNumber(qtyElMobile.value);
        if (qty < 1) qty = 0;

        var chargingHour = TMT_FUNCTION._toNumber(chargingHourElMobile.value);

        // Công thức: 
        var dayTotal = unitPrice * chargingHour * unitProfit * unitPerformance * qty;
        
        var monthTotal = dayTotal * 30;
        var yearTotal = dayTotal * 365;

        if (revMonthMobile) {
            revMonthMobile.innerText = TMT_FUNCTION._number_format(monthTotal) + ' VNĐ';
        }
        if (revYearMobile) {
            revYearMobile.innerText = TMT_FUNCTION._number_format(yearTotal) + ' VNĐ';
        }
    }

    // Các event listener
    if (btnCalcMobile) {
        btnCalcMobile.addEventListener('click', function(e) {
            e.preventDefault();
            calculateMobileProfit();
        });
    }

    // Chạy lần đầu
    calculateMobileProfit();

})();