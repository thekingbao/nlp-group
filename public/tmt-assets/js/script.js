var GUI = (function () {
  var menu = function () {
    document.querySelectorAll(".btn-menu-mobile, .main-menu-overlay").forEach((btn) => {
      btn.addEventListener("click", function () {
        document.querySelector("header").classList.toggle("active-menu");
        document.querySelector(".btn-menu-mobile").classList.toggle("is-active");
        document.body.classList.toggle("no-scroll");
      });
    });

    var menuItems = document.querySelectorAll(
      ".main-menu ul > li"
    );
    menuItems.forEach(function (menuItem) {
      var submenu = menuItem.querySelector("ul");
      if (submenu)
      {
        var span = document.createElement("span");
        span.className = "btn-down-menu";
        span.innerHTML = '<i class="fa-solid fa-angle-down"></i>';
        span.addEventListener("click", function () {
          slideToggle(submenu, 400)
          span.classList.toggle("active");
        });
        menuItem.appendChild(span);
      }
    });
    // document.querySelectorAll(".main-menu > ul >li >a").forEach(el => {
    //   if (window.innerWidth > 960)
    //   {
    //     el.style.width = el.scrollWidth + 5 + "px";
    //   }
    // })
  }

  var fixedHeader = () => {
    const header = document.querySelector("header");
    const scrollWatcher = document.querySelector(".header-scroll-watcher");
    // const scrollWatcherBannerAll = document.querySelector(".banner__all-scroll-watcher");

    if (!header || !scrollWatcher) return;

    const body = document.body;

    // Tính toán chiều cao của header
    const adjustBodyMargin = () => {
      body.style.setProperty("--header-height", `${header.offsetHeight}px`);
      body.style.paddingTop = `${header.offsetHeight}px`;
      header.classList.add("header-fixed");
    };

    // Observer blur
    const handleIntersection = (entries) => {
      const entry = entries[0];
      // if (window.innerWidth > 768)
      // {
      header.classList.toggle("header-shadow", !entry.isIntersecting);
      // } else
      // {
      //   header.classList.remove("header-shadow");
      // }
    };

    // Observer custom
    // if (scrollWatcherBannerAll)
    // {
    //   const handleIntersectionCustom = (entries) => {
    //     const entry = entries[0];
    //     if (window.innerWidth > 960)
    //     {
    //       header.classList.toggle("header__custom", entry.isIntersecting);
    //     }
    //   };

    //   new IntersectionObserver(handleIntersectionCustom).observe(scrollWatcherBannerAll);
    // }

    // Resize observer
    new ResizeObserver(adjustBodyMargin).observe(header);

    // Init
    adjustBodyMargin();
    new IntersectionObserver(handleIntersection).observe(scrollWatcher);
  };


  var runWowJS = function () {
    if (document.querySelector(".wow"))
    {
      new WOW().init({
        mobile: true
      })
    }
  }

  var backToTop = () => {
    var backToTopButton = document.querySelector(".btn-to-top");
    if (backToTopButton)
    {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 600)
        {
          backToTopButton.style.display = "flex";
        } else
        {
          backToTopButton.style.display = "none";
        }
      });
      backToTopButton.addEventListener("click", function () {
        var scrollOptions = {
          top: 0,
          behavior: "smooth",
        };
        if ("scrollBehavior" in document.documentElement.style)
        {
          window.scrollTo(scrollOptions);
        } else
        {
          var scrollInterval = setInterval(function () {
            if (window.scrollY <= 0)
            {
              clearInterval(scrollInterval);
            } else
            {
              window.scrollBy(0, -20);
            }
          }, 16);
        }
        return false;
      });
    }
  };

  var clickTab = function () {
    if (document.querySelectorAll(".module-tabs").length > 0)
    {
      document.querySelectorAll(".module-tabs").forEach((module) => {
        var tabLinks = module.querySelectorAll(".tab-link")
        var tabContents = module.querySelectorAll(".tab-content")
        tabLinks.forEach((el) => {
          el.addEventListener("click", function () {
            openTabContent(el)
          })
        })

        function openTabContent(btn) {
          tabContents.forEach((el) => {
            tabLinks.forEach((i) => i.classList.remove("active"))
            btn.classList.add("active")
            el.classList.remove("active")
            if (el.id === btn.getAttribute("data-electronic"))
            {
              el.classList.add("active")
            }
          })
        }
      })
    }
  }

  var initCountUp = () => {
    var listCountNumber = document.querySelectorAll(".module-statis")
    if (listCountNumber.length === 0) return false
    listCountNumber.forEach((el) => {
      var capacityStatus = 0
      var heightWindow =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      function handleCountUp() {
        if (
          capacityStatus === 0 &&
          window.pageYOffset > el.offsetTop - heightWindow
        )
        {
          const itemCounts = el.querySelectorAll(".count")
          if (itemCounts.length === 0) return
          /* setup thá»i gian nháº£y sá»‘ */
          const animationDuration = 5000
          const frameDuration = 1000 / 30
          const totalFrames = Math.round(animationDuration / frameDuration)
          itemCounts.forEach(function (element, index) {
            const easeOutQuad = (t) => t * (2 - t)
            const animateCountUp = (el) => {
              let frame = 0
              const countTo = el.getAttribute("tech5s-number")
              const counter = setInterval(() => {
                frame++
                const countToNumber = parseInt(
                  countTo.replace(/([^0-9])+/i, ""),
                  10
                )
                const progress = easeOutQuad(frame / totalFrames)
                const currentCount = Math.round(countToNumber * progress)
                if (parseInt(el.textContent, 10) !== currentCount)
                {
                  var textTarget = currentCount
                  if (currentCount < 10)
                  {
                    textTarget = "0" + textTarget
                  }
                  el.textContent = textTarget
                }
                if (frame === totalFrames)
                {
                  el.textContent = countTo
                  clearInterval(counter)
                }
              }, frameDuration)
            }
            animateCountUp(element)
          })
          capacityStatus = 1
        }
      }
      window.addEventListener(
        "scroll",
        function () {
          handleCountUp()
        },
        false
      )
      // check nếu nó đã ở trong viewport
      if (el.offsetTop < window.pageYOffset + heightWindow)
      {
        handleCountUp()
      }
    })
  }

  var showMenuToggleSocial = function () {
    var btnShowMenuToggleSocial = document.querySelector(".btn-show-menu-toggle-social");
    var menuToggleSocial = document.querySelector("#menu-toggle-social");
    if (btnShowMenuToggleSocial)
    {
      btnShowMenuToggleSocial.addEventListener("click", function () {
        menuToggleSocial.classList.toggle("active");
      });
    }
  }

  var changeInputNumber = function () {
    var module = document.querySelectorAll(".form-change-input-number");
    if (module.length > 0)
    {
      module.forEach((el) => {
        var input = el.querySelector("input");
        el.querySelector(".input-number-minus").addEventListener("click", function () {
          if (parseInt(input.value) > 0)
          {
            input.value = parseInt(input.value) - 1;
            input.dispatchEvent(new Event('change'));
          }
        });
        el.querySelector(".input-number-plus").addEventListener("click", function () {
          input.value = parseInt(input.value) + 1;
          input.dispatchEvent(new Event('change'));
        });
      });
    }
  }

  var openModal = function () {
    if (document.querySelector(".module-modal"))
    {
      var modals = document.querySelectorAll(".module-modal[popup-module]")
      var clickBtns = document.querySelectorAll("[modal-click-target]")
      clickBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
          event.preventDefault()
          var target = btn.getAttribute("modal-click-target")
          var modal = document.querySelector(
            `.module-modal#${target}`
          )
          modals.forEach((i) => i.classList.remove("active"))
          if (modal)
          {
            modal.classList.add("active")
          }
        })
      })
      modals.forEach((modal) => {
        var closeBtns = modal.querySelectorAll(".close-modal[modal-close]")
        closeBtns.forEach((closeBtn) => {
          closeBtn.addEventListener("click", () => {
            modal.classList.remove("active")
          })
        })
        modal.addEventListener("click", (e) => {
          if (!e.target.closest(".modal-content"))
          {
            modal.classList.remove("active")
          }
        })
      })
    }
  }

  return {
    _: function () {
      menu()
      fixedHeader()
      runWowJS()
      backToTop()
      clickTab()
      initCountUp()
      showMenuToggleSocial()
      changeInputNumber()
      openModal()
    },
  }
})()

var SLIDER = (function () {
  var sliderBannerHome = function () { }

  var sliderChargingPost = function () {
    if (document.querySelectorAll(".swiper-info-charging-post").length > 0)
    {
      document.querySelectorAll(".swiper-info-charging-post").forEach((el) => {
        new Swiper(el.querySelector(".swiper"), {
          slidesPerView: 1,
          spaceBetween: 10,
          pagination: {
            el: el.querySelector(".swiper-pagination-charging-post"),
            clickable: true,
          },
          navigation: {
            nextEl: el.querySelector(".swiper-button-next-charging-post"),
            prevEl: el.querySelector(".swiper-button-prev-charging-post"),
          },
        })
      })
    }
  }

  var sliderCar = function () {
    if (document.querySelector(".swiper-car"))
    {
      new Swiper(".swiper-car", {
        slidesPerView: 0.5,
        spaceBetween: 10,
        loop: true,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
        breakpoints: {
          1344: {
            slidesPerView: 1.5,
          },
          576: {
            slidesPerView: 1,
          },
        },
        speed: 6000,
      })
    }
  }

  var sliderPartner = function () {
    if (document.querySelector(".swiper-partner"))
    {
      new Swiper(".swiper-partner", {
        slidesPerView: 2,
        spaceBetween: 14,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false
        },
        loop: true,
        speed: 6000,
        breakpoints: {
          1152: {
            slidesPerView: 5,
          },
          960: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 3,
          },
          576: {
            slidesPerView: 2,
          },
        },
      })
    }
  }

  var sliderNews = function () {
    if (document.querySelector(".swiper-news"))
    {
      new Swiper(".swiper-news", {
        slidesPerView: 1,
        spaceBetween: 32,
        pagination: {
          el: ".swiper-pagination-news",
          clickable: true,
        },
        breakpoints: {
          // 1344: {
          //   slidesPerView: 4,
          // },
          960: {
            slidesPerView: 3,
          },
          576: {
            slidesPerView: 2,
          },
        },
      })
    }
  }

  var sliderInfoCompany = function () {
    if (document.querySelectorAll(".swiper-info-company").length > 0)
    {
      document.querySelectorAll(".swiper-info-company").forEach((el) => {
        var swiper = new Swiper(el.querySelector(".swiper-image-small-view"), {
          spaceBetween: 12,
          slidesPerView: 2,
          freeMode: true,
          watchSlidesProgress: true,
        });
        new Swiper(el.querySelector(".swiper-image-big-view"), {
          spaceBetween: 12,
          thumbs: {
            swiper: swiper,
          },
        });
      })
    }
  }

  var sliderFindStation = function () {
    var swiper_find_station = document.querySelector(".swiper-find-station");
    if (swiper_find_station != null && swiper_find_station != undefined)
    {
      new Swiper(".swiper-find-station", {
        slidesPerView: 1,
        grid: {
          rows: 2,
          fill: "row",
        },
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination-find-station",
          clickable: true,
        },
      });
    }
  }

  return {
    _: function () {
      sliderBannerHome()
      sliderChargingPost()
      sliderCar()
      sliderPartner()
      sliderNews()
      sliderInfoCompany()
      sliderFindStation()
    },
    runSliderFindStation: function () {
      sliderFindStation();
    }
  }
})()

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    GUI._()
    SLIDER._()
    if (document.querySelector("#modal-form-register"))
    {
      setTimeout(function () {
        document.querySelector("#modal-form-register").classList.add("active")
        // delay 3s
      }, timeShowModalPartner)
    }
  }, 100)
})

function slideToggle(element, duration = 300) {
  if (window.getComputedStyle(element).display === 'none')
  {
    return slideDown(element, duration);
  } else
  {
    return slideUp(element, duration);
  }
}

function slideUp(element, duration) {
  return new Promise(function (resolve) {
    element.style.height = element.offsetHeight + 'px';
    element.style.transitionProperty = 'height, margin, padding';
    element.style.transitionDuration = duration + 'ms';
    element.offsetHeight;
    element.style.overflow = 'hidden';
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    window.setTimeout(function () {
      element.style.display = 'none';
      element.style.removeProperty('height');
      element.style.removeProperty('padding-top');
      element.style.removeProperty('padding-bottom');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition-duration');
      element.style.removeProperty('transition-property');
      resolve(false);
    }, duration);
  });
}

function slideDown(element, duration) {
  return new Promise(function (resolve) {
    element.style.removeProperty('display');
    let display = window.getComputedStyle(element).display;
    if (display === 'none') display = 'block';
    element.style.display = display;
    let height = element.offsetHeight;
    element.style.overflow = 'hidden';
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    element.offsetHeight;
    element.style.transitionProperty = 'height, margin, padding';
    element.style.transitionDuration = duration + 'ms';
    element.style.height = height + 'px';
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    window.setTimeout(function () {
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition-duration');
      element.style.removeProperty('transition-property');
      resolve(true);
    }, duration);
  });
}

function changeImageChargingPost(index) {
  document.querySelectorAll(".image-charging-post-moblie .item").forEach((el) => {
    el.classList.remove("active");
  });
  document.querySelector(`#image-charging-post-${index}`).classList.add("active");
}