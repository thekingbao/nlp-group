let dataSearchStationProvince = [];
let dataSearchStationWard = [];

// Hàm bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD") // tách dấu
        .replace(/[\u0300-\u036f]/g, "") // xóa dấu
        .replace(/đ/g, "d").replace(/Đ/g, "D")
}

var AJAX_CALL_API = (function () {
    var initCustomSelect = () => {
        const selects = document.querySelectorAll('.custom-select')
        if (!selects.length) return
        selects.forEach(select => {
            const selectProvince = select.querySelector("select[name=province]")
            const selectDistrict = select.querySelector("select[name=ward]")
            let slimDistrict
            // Khởi tạo District ngay từ đầu (với option render sẵn)
            if (selectDistrict)
            {
                slimDistrict = new SlimSelect({
                    select: selectDistrict,
                    settings: {
                        placeholderText: 'Nhập từ tìm kiếm...', // 👈 text placeholder mới
                        searchPlaceholder: 'Nhập từ tìm kiếm...' // 👈 placeholder trong ô search
                    },
                })
                slimDistrict.disable()
            }

            // Khởi tạo Province
            if (selectProvince)
            {
                slimProvince = new SlimSelect({
                    select: selectProvince,
                    settings: {
                        placeholderText: 'Nhập từ tìm kiếm...', // 👈 text placeholder mới
                        searchPlaceholder: 'Nhập từ tìm kiếm...' // 👈 placeholder trong ô search
                    },
                    events: {
                        afterChange: (newVal) => {
                            slimDistrict.disable()
                            const provinceVal = newVal[0].value
                            XHR.send({
                                url: selectProvince.dataset.action,
                                method: "GET",
                                data: { province: provinceVal },
                            }).then((res) => {
                                selectDistrict.innerHTML = res.html
                                selectDistrict.value = ''

                                // Destroy SlimSelect cũ
                                if (slimDistrict) slimDistrict.destroy()

                                // Re-init SlimSelect với option mới
                                slimDistrict = new SlimSelect({
                                    select: selectDistrict,
                                    settings: {
                                        placeholderText: 'Nhập từ tìm kiếm...', // 👈 text placeholder mới
                                        searchPlaceholder: 'Nhập từ tìm kiếm...' // 👈 placeholder trong ô search
                                    },
                                    // events: {
                                    //     afterChange: (newVal) => {
                                    //         const districtVal = newVal[0].value
                                    //     }
                                    // },
                                })
                                slimDistrict.enable()
                            });
                        }
                    }
                })
            }
        })
    }

    var initModuleSearchLocation = () => {
        const modules = document.querySelectorAll(".module-search-location")
        if (modules.length > 0)
        {
            modules.forEach(module => {
                module.querySelector("input").addEventListener("focus", () => {
                    module.classList.add("active")
                })
                module.querySelector("input").addEventListener("blur", (e) => {
                    // nếu ấn vào module thì không remove
                    if (e.target.closest(".module-search-location"))
                    {
                        return;
                    }
                    module.classList.remove("active")
                })
            })
        }
    }

    var initModulePopupChargingStationDetail = (el) => {
        var action = el.getAttribute('data-action');
        XHR.send({
            url: action,
            method: "GET"
        }).then((res) => {
            NOTIFICATION.toastrMessage(res);
            if (res.code == 200)
            {
                const modal = document.querySelector("#popup-charging-station-details");
                modal.innerHTML = res.html;
                modal.classList.add("active");

                setTimeout(function () {
                    if (window.mapDetail && typeof window.mapDetail.destroy === 'function')
                    {
                        window.mapDetail.destroy();
                        window.mapDetail = null;
                    }
                    requestAnimationFrame(() => {
                        const mapEl = modal.querySelector('#map_station_detail');
                        const listEl = modal.querySelector('#list_station_detail'); // lấy trong modal
                        if (!mapEl || !listEl)
                        {
                            console.warn('Không tìm thấy mapEl hoặc listEl trong modal.');
                            return;
                        }

                        const lat = Number(mapEl.getAttribute('data-lat') || '0');
                        const lng = Number(mapEl.getAttribute('data-lng') || '0');
                        window.mapDetail = new MapShowroom({
                            mapEl, // truyền element
                            listEl, // truyền element
                            defaultCenter: {
                                lat,
                                lng
                            },
                            defaultZoom: 15,
                            focusZoom: 15,
                            mobileScrollOffset: 100
                        });
                        window.mapDetail.init();
                    });
                }, 500);
            }
        });
    }

    var initSlideImage = () => {
        const modules = document.querySelectorAll(".swiper-thumb-view-details ");
        if (modules.length > 0)
        {
            modules.forEach(module => {
                var swiper = new Swiper(module.querySelector(".swiper-image-view-details"), {
                    spaceBetween: 8,
                    slidesPerView: 3,
                    freeMode: true,
                    watchSlidesProgress: true,
                });
                new Swiper(module.querySelector(".swiper-map-details"), {
                    spaceBetween: 8,
                    thumbs: {
                        swiper: swiper,
                    },
                });
            });
        }
    }

    var initDataSearchStationProvince = () => {
        const province = document.querySelector(".box_province")
        // lấy data từ các thẻ li trong province
        // dataSearchStationProvince sẽ lưu dưới dạng array ['hà nội', 'hồ chí minh', 'đà nẵng',...]
        if (province)
        {
            const listProvince = province.querySelectorAll('li')
            dataSearchStationProvince = Array.from(listProvince).map(item => ({
                el: item,
                text: removeVietnameseTones(item.textContent.trim().toLowerCase())
            }))
        }
    }

    var handleInputProvince = (el) => {
        const keyword = removeVietnameseTones(el.value.trim().toLowerCase())

        if (!dataSearchStationProvince) return

        dataSearchStationProvince.forEach(item => {
            if (keyword === '' || item.text.includes(keyword))
            {
                item.el.style.display = '' // hiện
            } else
            {
                item.el.style.display = 'none' // ẩn
            }
        })
    }

    var handleSelectProvince = (el) => {
        const province = el.closest(".box_province")
        province.querySelectorAll('li').forEach(item => {
            item.style.backgroundColor = ""
            item.style.pointerEvents = "auto"
        })
        el.style.backgroundColor = "#f8fafc"
        el.style.pointerEvents = "none"
        
        // Update input and label
        const input = province.querySelector("input");
        if(input) input.value = el.textContent;
        const nameSpan = province.querySelector(".province-name");
        if(nameSpan) nameSpan.textContent = el.textContent;

        const box = el.closest(".box-location-near-station")
        const district = box.querySelector(".box_district")
        const btnBack = box.querySelector(".btn-back")

        function handleActiveDistrict() {
            if (window.innerWidth < 1025) {
                district.classList.add("active_optimized")
                district.classList.remove("opacity-40", "pointer-events-none", "grayscale")
                const dInput = district.querySelector('input')
                if (dInput) dInput.value = ''
            } else {
                province.classList.add("no-active")
                district.classList.add("active")
                const dInput = district.querySelector('input')
                if (dInput) dInput.value = ''
            }
        }

        var input_address_search_station = document.getElementById('input_address_search_station');

        input_address_search_station.setAttribute('data-province', el.text);
        input_address_search_station.setAttribute('data-lat', el.dataset.lat);
        input_address_search_station.setAttribute('data-lng', el.dataset.lng);
        input_address_search_station.setAttribute('data-item-type', 'province');
        // Loc theo dia gioi: gui province_id, xoa ward_id cua lan chon truoc
        input_address_search_station.setAttribute('data-province-id', el.dataset.id || '');
        input_address_search_station.setAttribute('data-ward-id', '');
        SEARCH_MAP.submitSearchStation();
        XHR.send({
            url: el.dataset.action,
            method: "GET",
            data: {
                province: el.dataset.id,
                html_type: 'ul'
            }
        }).then((res) => {
            district.querySelector('.list_ward').innerHTML = res.html
            if(btnBack) btnBack.classList.add("active")
            
            dataSearchStationWard = Array.from(district.querySelectorAll('li')).map(item => ({
                el: item,
                text: removeVietnameseTones(item.textContent.trim().toLowerCase())
            }))
            handleActiveDistrict()
        });

        // Hide dropdown
        const contentBox = province.querySelector(".box_province-content");
        if (contentBox) contentBox.classList.add("hidden");
    }

    var handleInputDistrict = (el) => {
        const keyword = removeVietnameseTones(el.value.trim().toLowerCase())
        if (!dataSearchStationWard) return
        dataSearchStationWard.forEach(item => {
            if (keyword === '' || item.text.includes(keyword))
            {
                item.el.style.display = '' // hiện
            } else
            {
                item.el.style.display = 'none' // ẩn
            }
        })
    }

    var handleSelectDistrict = (el) => {
        const district = el.closest(".box_district")
        district.querySelectorAll('li').forEach(item => {
            item.style.backgroundColor = ""
            item.style.pointerEvents = "auto"
        })
        el.style.backgroundColor = "#f8fafc"
        el.style.pointerEvents = "none"
        
        // Update input and label
        const input = district.querySelector("input");
        if(input) input.value = el.textContent;
        const nameSpan = district.querySelector(".district-name");
        if(nameSpan) nameSpan.textContent = el.textContent;

        var input_address_search_station = document.getElementById('input_address_search_station');

        input_address_search_station.setAttribute('data-province', el.text);
        input_address_search_station.setAttribute('data-lat', el.dataset.lat);
        input_address_search_station.setAttribute('data-lng', el.dataset.lng);
        input_address_search_station.setAttribute('data-item-type', 'ward');
        // Giu nguyen province_id da chon o buoc truoc, chi bo sung ward_id
        input_address_search_station.setAttribute('data-ward-id', el.dataset.id || '');
        SEARCH_MAP.submitSearchStation();

        // Hide dropdown
        const contentBox = district.querySelector(".box_district-content");
        if (contentBox) contentBox.classList.add("hidden");
    }

    var handleBackProvince = (el) => {
        const box = el.closest(".box-location-near-station")
        const province = box.querySelector(".box_province")
        province.classList.remove("no-active")
        const district = box.querySelector(".box_district")
        district.classList.remove("active")
        const btnBack = box.querySelector(".btn-back")
        btnBack.classList.remove("active");

        var input_address_search_station = document.getElementById('input_address_search_station');
        document.querySelector('.box-location-near-station .box_province input').value = '';
        input_address_search_station.setAttribute('data-province', '');
        input_address_search_station.setAttribute('data-lat', '');
        input_address_search_station.setAttribute('data-lng', '');
        input_address_search_station.setAttribute('data-item-type', 'all');
        // Phai xoa ca id dia gioi, neu khong bo loc cu van con hieu luc
        input_address_search_station.setAttribute('data-province-id', '');
        input_address_search_station.setAttribute('data-ward-id', '');
        SEARCH_MAP.submitSearchStation();
        var list_option_province = document.querySelectorAll('.box_province ul li');
        if(list_option_province != undefined && list_option_province != null){
            list_option_province.forEach(function(item){
                item.style.pointerEvents = 'auto';
                item.style.backgroundColor = '';
            });
        }
    }

    var initClickOutsideMobile = () => {
        if (window.innerWidth >= 1025) return;
        document.addEventListener("click", function (e) {
            // Province list
            const boxProvince = document.querySelector(".box_province");
            if (boxProvince && !boxProvince.contains(e.target)) {
                const content = boxProvince.querySelector(".box_province-content");
                if (content) content.classList.add("hidden");
            }
            // District list
            const boxDistrict = document.querySelector(".box_district");
            if (boxDistrict && !boxDistrict.contains(e.target)) {
                const content = boxDistrict.querySelector(".box_district-content");
                if (content) content.classList.add("hidden");
            }
            // Keyword Search results
            const moduleSearch = document.querySelector(".module-search-location");
            if (moduleSearch && !moduleSearch.contains(e.target)) {
                moduleSearch.classList.remove("active");
            }
        });
    }

    return {
        _: function () {
            initCustomSelect()
            initModuleSearchLocation()
            initDataSearchStationProvince()
            initClickOutsideMobile()
        },
        initModulePopupChargingStationDetail: function (el) {
            initModulePopupChargingStationDetail(el);
        },
        initSlideImage: function () {
            initSlideImage();
        },
        handleInputProvince: function (el) {
            handleInputProvince(el);
        },
        handleSelectProvince: function (el) {
            handleSelectProvince(el);
        },
        handleInputDistrict: function (el) {
            handleInputDistrict(el);
        },
        handleSelectDistrict: function (el) {
            handleSelectDistrict(el);
        },
        handleBackProvince: function (el) {
            handleBackProvince(el);
        }
    }
})()

document.addEventListener("DOMContentLoaded", function () {
    AJAX_CALL_API._()
})