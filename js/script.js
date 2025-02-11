const disableScroll = () => {
    $("html, body").css("overflow", "hidden");
    $("header").css({
        position: "fixed",
        top: Math.max(0, $("header").offset().top - $(window).scrollTop()),
    });
    $("main").css({
        marginTop: $("header").height(),
    });
};
const enableScroll = () => {
    $("html, body").css("overflow", "visible");
    $("header").css({
        position: "sticky",
        top: 0,
    });
    $("main").css({
        marginTop: 0,
    });
    console.log("first");
};

$(document).ready(function () {
    //=================== Таймер в хедере ============

    function startTimer($timerElement) {
        const targetDate = new Date($timerElement.data("timer"));

        function updateTimer() {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                clearInterval(interval); // Остановить таймер
                $(".header__sale-banner").slideUp(300);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Обновляем значения в HTML
            const $daysSpans = $timerElement.find(
                ".header__sale-banner-timer-group-days span"
            );
            const $hoursSpans = $timerElement.find(
                ".header__sale-banner-timer-group-hours span"
            );
            const $minutesSpans = $timerElement.find(
                ".header__sale-banner-timer-group-minutes span"
            );
            const $secondsSpans = $timerElement.find(
                ".header__sale-banner-timer-group-seconds span"
            );

            $daysSpans.eq(0).text(Math.floor(days / 10)); // Первая цифра
            $daysSpans.eq(1).text(days % 10); // Вторая цифра
            $hoursSpans.eq(0).text(Math.floor(hours / 10));
            $hoursSpans.eq(1).text(hours % 10);
            $minutesSpans.eq(0).text(Math.floor(minutes / 10));
            $minutesSpans.eq(1).text(minutes % 10);
            $secondsSpans.eq(0).text(Math.floor(seconds / 10));
            $secondsSpans.eq(1).text(seconds % 10);
        }

        // Обновляем таймер каждую секунду
        const interval = setInterval(updateTimer, 1000);
        updateTimer(); // Первоначальный вызов
    }

    // Находим элемент таймера и запускаем его
    const $timerElement = $(".header__sale-banner-timer");
    if ($timerElement.length) {
        startTimer($timerElement);
    }

    //=================== Переключение тени у стики хедера ============

    const stickyHeader = $(".header__main");
    const scrollToTopButton = $(".float__item_to-top");

    let isStuck = false; // Флаг для отслеживания состояния

    $(window).on("scroll", function () {
        const rect = stickyHeader[0].getBoundingClientRect(); // Получаем размеры и положение элемента

        if (rect.top <= 0 && !isStuck) {
            stickyHeader.css("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.1)");
            isStuck = true;
            if ($("body").hasClass("product-page")) {
                $(".sticky").addClass("active");
            }
        } else if (rect.top > 0 && isStuck) {
            stickyHeader.css("box-shadow", "none");
            isStuck = false;
            if ($("body").hasClass("product-page")) {
                $(".sticky").removeClass("active");
            }
        }

        if (window.scrollY > $("body").height() / 2 || window.scrollY > 1000) {
            scrollToTopButton.fadeIn(200);
        } else {
            scrollToTopButton.fadeOut(200);
        }
    });

    //=================== Прокрутка вверх страницы ============

    scrollToTopButton.on("click", function (e) {
        window.scrollTo(0, 0);
    });

    //=================== Скрытие баннера ============

    const storageKey = "is_hidden";

    // Функция сброса в 00:00
    function resetStorageAtMidnight() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0); // Следующая полночь
        const timeUntilMidnight = midnight - now;

        setTimeout(() => {
            localStorage.setItem(storageKey, "false");
            resetStorageAtMidnight(); // Перезапускаем таймер на следующую полночь
        }, timeUntilMidnight);
    }

    // Ставим таймер сброса
    resetStorageAtMidnight();

    let isBannerHidden;

    const checkIsBannerHidden = () => {
        isBannerHidden =
            localStorage.getItem(storageKey) &&
            localStorage.getItem(storageKey) !== "false";
    };

    checkIsBannerHidden();

    $("#bannerClose").click(function () {
        $(this).parent().slideUp(300);
        localStorage.setItem(storageKey, "true");
        checkIsBannerHidden();
        updateHeaderHeight();
    });

    if (!isBannerHidden) {
        $(".header__sale-banner").slideDown(300);
    }

    //=================== Слайдер в оффере на главной ============

    const offerSlider = new Swiper(".offer-slider", {
        loop: true,
        spaceBetween: 20,
        speed: 800,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },

        navigation: {
            nextEl: ".offer-slider-next",
            prevEl: ".offer-slider-prev",
        },
        pagination: {
            el: ".offer__inner .swiper-pagination",
        },
    });

    //=================== Слайдр каталога ============

    const menuSlider = new Swiper(".menu-slider", {
        spaceBetween: 20,
        initialSlide: 0,
        speed: 600,
        slidesPerView: 7,
        grabCursor: true,
        navigation: {
            nextEl: ".slider__menu .offer-slider-next",
            prevEl: ".slider__menu .offer-slider-prev",
        },
        scrollbar: {
            el: ".slider__menu .swiper-scrollbar",
        },
        breakpoints: {
            0: {
                grid: {
                    rows: 2,
                    fill: "row",
                },
                slidesPerView: "auto",
                spaceBetween: 10,
            },
            601: {
                grid: {
                    rows: 1,
                },
                spaceBetween: 10,
                slidesPerView: 7,
            },
            1026: {
                spaceBetween: 20,
            },
        },
    });

    //=================== Слайдр товаров ============

    $(".products:has(.products__slider)").each(function (index, elem) {
        const block = $(elem);
        const swiperContainer = block.find(".products__slider");
        const slider = new Swiper(swiperContainer[0], {
            spaceBetween: 20,
            speed: 600,
            slidesPerView: 5,
            grabCursor: true,
            navigation: {
                nextEl: block.find(".slider-next")[0],
                prevEl: block.find(".slider-prev")[0],
            },
            scrollbar: {
                el: block.find(".swiper-scrollbar")[0],
            },
            breakpoints: {
                0: {
                    slidesPerView: "auto",
                    spaceBetween: 10,
                },
                1025: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
            },
        });
    });

    function sliderMouseSlideInit() {
        document.addEventListener("mousemove", function (e) {
            const targetElement = e.target;
            if (targetElement.closest("[data-mousemove-swipe]")) {
                const sliderElement = targetElement.closest(
                    "[data-mousemove-swipe]"
                );
                const sliderItem =
                    sliderElement.swiper.slides[getIndex(sliderElement)];
                const sliderLength = sliderElement.swiper.slides.length;
                if (sliderLength > 1) {
                    const sliderWidth = sliderItem.offsetWidth;
                    const sliderPath = Math.round(sliderWidth / sliderLength);
                    const sliderMousePos = e.clientX - sliderElement.offsetLeft;
                    const sliderSlide = Math.floor(sliderMousePos / sliderPath);
                    sliderElement.swiper.slideTo(sliderSlide);
                }
            }
        });

        // Добавляем событие для отслеживания ухода мыши с элемента слайдера
        document
            .querySelectorAll("[data-mousemove-swipe]")
            .forEach(function (sliderElement) {
                sliderElement.addEventListener("mouseleave", function () {
                    sliderElement.swiper.slideTo(0); // Возвращаем на первый слайд
                });
            });

        function getIndex(el) {
            return Array.from(el.parentNode.children).indexOf(el);
        }
    }

    if (document.querySelector("[data-mousemove-swipe]")) {
        sliderMouseSlideInit();
    }

    //=================== Слайдре партнеров ============

    const partnersSlider = new Swiper(".partners-slider", {
        spaceBetween: 20,
        initialSlide: 0,
        speed: 600,
        slidesPerView: "auto",
        grabCursor: true,
        keyboard: {
            enabled: true,
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        scrollbar: {
            el: ".swiper-scrollbar-partners",
        },
        navigation: {
            nextEl: ".partners-slider-next",
            prevEl: ".partners-slider-prev",
        },

        breakpoints: {
            1200: {
                spaceBetween: 13,
            },
            1500: {
                spaceBetween: 16,
            },
            0: {
                spaceBetween: 10,
            },
        },
    });

    //=================== Маска номера телефона ============

    $(".phone-input").inputmask({
        mask: "+7 (999) 999 - 99 - 99",
        placeholder: "",
        showMaskOnHover: false,
        showMaskOnFocus: true,
    });

    //=================== Анимация у checkbox ============

    $(".check-label").on("click", function () {
        let isChecked = $(this).children("input").prop("checked");
        if (isChecked) {
            $(this).find(".fakecheck").addClass("checked");
        } else {
            $(this).find(".fakecheck").removeClass("checked");
        }
    });

    //=================== Фиксация фильтров в каталоге ============

    $("#filters").stickySidebar({
        containerSelector: ".catalog__inner",
        innerWrapperSelector: ".filters",
        topSpacing: 110,
        bottomSpacing: 20,
        minWidth: 602,
    });

    //=================== Диапазон цены в каталоге ============

    const priceMask = (val) => {
        if (!val) return;
        val = String(val);
        val = val.replace(/\D/g, "");
        val = val.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return val;
    };

    const onChangePrice = () => {
        const min = Number($("#slider-range").data("min"));
        const max = Number($("#slider-range").data("max"));

        const start = Number($("#start-range").val().replace(" ", ""));
        const end = Number($("#end-range").val().replace(" ", ""));

        if (start === min) {
            $("#start-range").closest("label").find("svg").fadeOut(200);
        } else {
            $("#start-range").closest("label").find("svg").fadeIn(200);
        }
        if (end === max) {
            $("#end-range").closest("label").find("svg").fadeOut(200);
        } else {
            $("#end-range").closest("label").find("svg").fadeIn(200);
        }

        if (end !== max || start !== min) {
            $(".price .filters__product-categorise-reset").fadeIn(200);
        } else {
            $(".price .filters__product-categorise-reset").fadeOut(200);
        }

        if (start > end) {
            $("#start-range").val(priceMask(end));
            $("#slider-range").slider("values", 0, end);
        }
        if (end > max) {
            $("#end-range").val(priceMask(max));
            $("#slider-range").slider("values", 1, max);
        }
    };

    $("#slider-range").slider({
        range: true,
        min: $("#slider-range").data("min"),
        max: $("#slider-range").data("max"),
        values: [
            $("#slider-range").data("min"),
            $("#slider-range").data("max"),
        ],
        slide: function (event, ui) {
            $("#start-range").val(priceMask(ui.values[0]));
            $("#end-range").val(priceMask(ui.values[1]));
            onChangePrice();
        },
    });
    $("#start-range").val(priceMask($("#slider-range").slider("values", 0)));
    $("#end-range").val(priceMask($("#slider-range").slider("values", 1)));

    $("#start-range").on("input", function () {
        const val = priceMask($(this).val());
        $(this).val(val);
        $("#slider-range").slider("values", 0, Number(val.replace(" ", "")));
        onChangePrice();
    });
    $("#end-range").on("input", function () {
        const val = priceMask($(this).val());
        $(this).val(val);
        $("#slider-range").slider("values", 1, Number(val.replace(" ", "")));
        onChangePrice();
    });

    const endReset = $("#end-range").closest("label").find("svg");
    const startReset = $("#start-range").closest("label").find("svg");

    const resetStartRange = () => {
        startReset.fadeOut(200);
        $("#start-range").val(priceMask($("#slider-range").data("min")));
        $("#slider-range").slider("values", 0, $("#slider-range").data("min"));

        onChangePrice();
    };
    const resetEndRange = () => {
        endReset.fadeOut(200);
        $("#end-range").val(priceMask($("#slider-range").data("max")));
        $("#slider-range").slider("values", 1, $("#slider-range").data("max"));
        onChangePrice();
    };

    startReset.on("click", resetStartRange);
    endReset.on("click", resetEndRange);

    $(".filters__product-categorise-reset").on("click", function (e) {
        e.preventDefault();
        if ($(this).closest(".price").length) {
            resetStartRange();
            resetEndRange();
        }

        $(this)
            .closest(".filters__product-categorise")
            .find("input[type='checkbox']")
            .prop("checked", false);

        $(this).fadeOut(200);
    });

    //=================== Кнопки сброса стандартных фильтров ============

    const resetCommonFilter = (categoryWrapper) => {
        if (!!categoryWrapper.find("input[type='checkbox']:checked").length) {
            categoryWrapper
                .find(".filters__product-categorise-reset")
                .fadeIn(200);
        } else {
            categoryWrapper
                .find(".filters__product-categorise-reset")
                .fadeOut(200);
        }
    };

    $(".filters__product-categorise input[type='checkbox']").on(
        "change",
        function () {
            resetCommonFilter($(this).closest(".filters__product-categorise"));
        }
    );

    $(".filters__product-categorise").each(function () {
        resetCommonFilter($(this));
    });

    //=================== Кнопка сброса всех фильтров ============

    $(".filters__reset").on("click", function (e) {
        e.preventDefault();
        resetStartRange();
        resetEndRange();

        $(".filters__product-categorise input[type='checkbox']").prop(
            "checked",
            false
        );
        $(
            ".filters__product-categorise .filters__product-categorise-reset"
        ).fadeOut(200);
    });

    //=================== Слайдер миниатюр в карточке каталога ============

    $(".catalog__item").each(function (index, elem) {
        const card = $(elem);
        const swiperContainer = card.find(".catalog__item-slider");
        const swiper = new Swiper(swiperContainer[0], {
            speed: 600,
            scrollbar: {
                el: card.find(".catalog__item-slider-scrollbar")[0],
            },
        });
    });

    function sliderMouseSlideInit() {
        document.addEventListener("mousemove", function (e) {
            const targetElement = e.target;
            if (targetElement.closest("[data-mousemove-swipe]")) {
                const sliderElement = targetElement.closest(
                    "[data-mousemove-swipe]"
                );
                const sliderItem =
                    sliderElement.swiper.slides[getIndex(sliderElement)];
                const sliderLength = sliderElement.swiper.slides.length;

                if (sliderLength > 1) {
                    const sliderWidth = sliderItem.offsetWidth;
                    const sliderPath = Math.round(sliderWidth / sliderLength);
                    const sliderMousePos =
                        e.clientX - $(sliderElement).offset().left;
                    const sliderSlide = Math.floor(sliderMousePos / sliderPath);
                    sliderElement.swiper.slideTo(sliderSlide);
                }
            }
        });

        // Добавляем событие для отслеживания ухода мыши с элемента слайдера
        document
            .querySelectorAll("[data-mousemove-swipe]")
            .forEach(function (sliderElement) {
                sliderElement.addEventListener("mouseleave", function () {
                    sliderElement.swiper.slideTo(0); // Возвращаем на первый слайд
                });
            });

        function getIndex(el) {
            return Array.from(el.parentNode.children).indexOf(el);
        }
    }

    if (document.querySelector("[data-mousemove-swipe]")) {
        sliderMouseSlideInit();
    }

    //=================== Кнопка добавить в корзину ============

    const animateAddToCartButton = (
        btn,
        parentSelector,
        width = "84px",
        bySelector = false
    ) => {
        const button = bySelector ? $(btn) : btn;
        const parent = button.closest(
            ".catalog__item-btns-row, .product__btns"
        );
        const quantitySelector = parent.find(".catalog__item-quantity");
        width =
            width !== "84px"
                ? width
                : parent.width() - quantitySelector.width() - 10;
        console.log(parent);
        if (button.closest(parentSelector).hasClass("added")) {
            button.animate(
                {
                    backgroundColor: "#ffffff",
                    borderColor: "#2bb41f",
                    width: width,
                },
                200
            );

            button.find("span").fadeOut(200);
            button.find("svg").animate(
                {
                    opacity: 1,
                },
                200
            );
        }
    };

    const animateAddToCartButtonRemoved = (
        btn,
        parentSelector,
        bySelector = false
    ) => {
        const button = bySelector ? $(btn) : btn;
        if (button.closest(parentSelector).hasClass("added")) {
            console.log(button);
            button.animate(
                {
                    backgroundColor: "#e94d11",
                    borderColor: "#e94d11",
                    width: "100%",
                },
                200
            );
            button.find("span").fadeIn(200);
            button.find("svg").animate(
                {
                    opacity: 0,
                },
                200
            );
        }
    };
    $(window).on("load", function () {
        $(".catalog__item-add-to-cart").each(function (index, btn) {
            animateAddToCartButton($(btn), ".catalog__item");
        });
    });

    $(".product-page .add-to-cart").each(function (index, btn) {
        animateAddToCartButton(".add-to-cart", ".product-page", "150px", true);
    });
    const showNotification = (notification) => {
        notification.addClass("show");
    };

    const hideNotification = (notification) => {
        notification.removeClass("show");
    };
    const closeNotification = (notification) => {
        const progress = $(".catalog-notification__progress");
        // Остановить текущий таймер, если он существует
        if (notificationTimeoutID) {
            clearTimeout(notificationTimeoutID);
            notificationTimeoutID = null; // Сброс переменной
        }
        hideNotification(notification);
        progress.stop(true, true);
    };

    let notificationTimeoutID;

    $(".add-to-cart-button").on("click", function () {
        if (
            $(this).closest(".catalog__item, .product-page").hasClass("added")
        ) {
            window.location.href = "/cart";
            return;
        }
        $(this).closest(".catalog__item, .product-page").addClass("added");
        const notification = $(".catalog-notification");
        const progress = $(".catalog-notification__progress");

        if (!!$(this).closest(".product-page").length) {
            const containers = $(".product__btns");
            let diff;
            containers.each(function (index, container) {
                const currentDiff =
                    $(container).width() -
                    $(container).find(".catalog__item-quantity").width();
                diff =
                    currentDiff == 0
                        ? diff
                        : !!currentDiff
                        ? currentDiff
                        : diff;
                const width = diff - 10 + "px";
                animateAddToCartButton(
                    $(container).find(".add-to-cart-button"),
                    ".product-page",
                    width
                );
            });
        } else {
            animateAddToCartButton($(this), ".catalog__item");
        }

        if (notification.hasClass("show")) {
            closeNotification(notification);
        }

        progress.css("width", "100%");
        progress.animate(
            {
                width: "0%",
            },
            3000
        );
        showNotification(notification);
        notificationTimeoutID = setTimeout(function () {
            hideNotification(notification);
        }, 3000);
    });

    $(".catalog-notification__header svg").on("click", function () {
        closeNotification($(".catalog-notification"));
    });

    $(".order-card-mini__add-to-cart-button").on("click", function () {
        if ($(this).closest(".order-card-mini").hasClass("added")) {
            window.location.href = "/cart";
            return;
        }
        $(this).closest(".order-card-mini").addClass("added");
        const notification = $(".catalog-notification");
        const progress = $(".catalog-notification__progress");

        if (notification.hasClass("show")) {
            closeNotification(notification);
        }

        progress.css("width", "100%");
        progress.animate(
            {
                width: "0%",
            },
            3000
        );
        showNotification(notification);
        notificationTimeoutID = setTimeout(function () {
            hideNotification(notification);
        }, 3000);
    });

    // ================== Выбор количества товара ============

    const checkAvailableQuantityRange = (btn) => {
        const quantity = btn
            .closest(".catalog__item-quantity")
            .data("quantity");
        const isProductPage = !!btn.closest(".product-page").length;
        const counter = isProductPage
            ? $(".catalog__item-quantity span")
            : btn.closest(".catalog__item-quantity").find("span");
        let currentQuantity = isProductPage
            ? Number(counter.eq(0).text())
            : Number(counter.text());

        if (currentQuantity !== 1) {
            if (!isProductPage) {
                btn.closest(".catalog__item-quantity")
                    .find(".catalog__item-quantity-btn_minus")
                    .removeClass("disabled");
            } else {
                $(".catalog__item-quantity-btn_minus").removeClass("disabled");
            }
        }

        if (currentQuantity === quantity) {
            if (!isProductPage) {
                btn.closest(".catalog__item-quantity")
                    .find(".catalog__item-quantity-btn_plus")
                    .addClass("disabled");
            } else {
                $(".catalog__item-quantity-btn_plus").addClass("disabled");
            }
        } else {
            if (!isProductPage) {
                btn.closest(".catalog__item-quantity")
                    .find(".catalog__item-quantity-btn_plus")
                    .removeClass("disabled");
            } else {
                $(".catalog__item-quantity-btn_plus").removeClass("disabled");
            }
        }
    };

    $(".catalog__item-quantity-btn").each(function (index, btn) {
        checkAvailableQuantityRange($(btn));
    });

    $(".catalog__item-quantity-btn").on("click", function () {
        const quantity = $(this)
            .closest(".catalog__item-quantity")
            .data("quantity");
        const isProductPage = !!$(this).closest(".product-page").length;
        const counter = isProductPage
            ? $(".catalog__item-quantity span")
            : $(this).closest(".catalog__item-quantity").find("span");
        let currentQuantity = isProductPage
            ? Number(counter.eq(0).text())
            : Number(counter.text());

        if ($(this).hasClass("disabled")) return;

        if ($(this).hasClass("catalog__item-quantity-btn_plus")) {
            currentQuantity++;
            counter.text(currentQuantity);
        } else {
            currentQuantity--;
            counter.text(currentQuantity);
        }

        checkAvailableQuantityRange($(this));
        if (currentQuantity <= 1) {
            counter.text(1);
            checkAvailableQuantityRange($(this));

            animateAddToCartButtonRemoved(
                $(this)
                    .closest(".catalog__item-btns-row")
                    .find(".add-to-cart-button"),
                ".catalog__item"
            );
            $(this).closest(".catalog__item").removeClass("added");
            if (!!$(".product-page")) {
                $(".add-to-cart-button").each(function (index, button) {
                    animateAddToCartButtonRemoved($(button), ".product-page");
                });
                $(".product-page").removeClass("added");
            }
        }

        if (currentQuantity > quantity) {
            counter.text(quantity);
        }
    });

    // ================== Кнопка добавить в избранное ============

    $(".catalog__item-fav").click(function () {
        if (!!$(this).closest(".product-page").length) {
            $(".product-page").toggleClass("fav");
            $(".catalog__item-fav").toggleClass("active");
        } else {
            $(this)
                .closest(".catalog__item, .cart__item, .order-card-mini")
                .toggleClass("fav");
            $(this).toggleClass("active");
        }
    });

    //=================== Удаление товаров из корзины ============

    const animateRemoveFromCart = (itemSelector, wrapperSelector) => {
        $(itemSelector)
            .closest(wrapperSelector)
            .animate(
                {
                    left: "-200%",
                },
                300,
                function () {
                    $(this)
                        .closest("li")
                        .animate(
                            {
                                height: 0,
                            },
                            100,
                            function () {
                                $(this).remove();
                            }
                        );
                }
            );
    };

    $(".cart__item-remove").on("click", function () {
        animateRemoveFromCart(this, ".cart__item");
    });

    $(".cart__checkbox-all input").on("change", function () {
        if ($(this).prop("checked")) {
            $(".cart__item input").prop("checked", true);
        } else {
            $(".cart__item input").prop("checked", false);
        }
    });

    $(".cart__delete-selected").on("click", function () {
        const selectedItems = $(".cart__item input:checked");

        selectedItems.each(function (index, item) {
            setTimeout(function () {
                animateRemoveFromCart(item, ".cart__item");
            }, 100 * index);
        });
    });

    //=================== Удаление товаров из заказов ============

    $(".order-card__remove").on("click", function () {
        animateRemoveFromCart(this, ".order-card");
    });

    //=================== Удаление организации из списка ============

    $(".account__content-legal-item-header-options-remove").on(
        "click",
        function () {
            animateRemoveFromCart(this, ".account__content-legal-item");
        }
    );

    //=================== Промокоды ============

    $(".cart__buy-promo input").on("input", function () {
        if ($(this).val()) {
            $(".cart__buy-promo").addClass("typing").removeClass("activated");
        } else {
            $(".cart__buy-promo")
                .removeClass("typing")
                .removeClass("activated");
        }
    });

    $(".cart__buy-promo button").on("click", function () {
        const input = $(".cart__buy-promo input");
        if (input.val()) {
            $(".cart__buy-promo").addClass("activated").removeClass("typing");
        }
    });

    //=================== Форма получателя ============

    $(
        ".cart__recipient-form input, .cart__delivery-courier input, .cart__delivery-courier textarea, .auth__input input"
    ).on("input", function () {
        if ($(this).val()) {
            $(this).addClass("typing");
        } else {
            $(this).removeClass("typing");
        }
    });

    const recipientOptions = [
        {
            id: 0,
            name: 'ООО "АРБИ-М"',
            tel: "",
            isOrganization: true,
        },
        {
            id: 1,
            name: "Имя покупателя",
            tel: "+7 (978) 777 - 77 - 77",
            isOrganization: false,
        },
    ];

    const createListRecipients = (id) => {
        const filteredOptions = recipientOptions.filter(
            (option) => option.id !== id
        );
        $(".cart__recipient-selector ul").empty();
        filteredOptions.forEach((option) => {
            $(".cart__recipient-selector ul").append(`
            <li data-is-organization="${option.isOrganization}" data-id="${
                option.id
            }">
                <strong>${option.name}</strong>
                ${option.tel ? `<span>${option.tel}</span>` : ""}
            </li>
        `);
        });

        $(".cart__recipient-selector li").on("click", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            console.log("id");
            $(this)
                .closest(".cart__recipient-selector")
                .find("p")
                .attr("data-id", id)
                .text($(this).find("strong").text());

            if (!$(this).data("is-organization")) {
                $(this)
                    .closest(".cart__recipient-select")
                    .find("label:has(input[type='tel'])")
                    .fadeIn(200)
                    .find("input")
                    .addClass("typing")
                    .val($(this).find("span").text());
                $(".cart__recipient-alert").slideUp(200);
                $(".cart__recipient-switch").slideDown(200);
                onSwitchRecipient();
            } else {
                $(this)
                    .closest(".cart__recipient-select")
                    .find("label:has(input[type='tel'])")
                    .fadeOut(200);
                $(".cart__recipient-alert").slideDown(200);

                $(".cart__recipient-another, .cart__recipient-switch").slideUp(
                    200
                );
            }
            createListRecipients(id);
        });
    };

    createListRecipients($(".cart__recipient-selector p").data("id"));

    $(".cart__recipient-selector").on("click", function (e) {
        $(this).toggleClass("open").find("ul").fadeToggle(200);
    });

    const onSwitchRecipient = () => {
        if ($(".cart__recipient-switch input").prop("checked")) {
            $(".cart__recipient-another").slideDown(200);
        } else {
            $(".cart__recipient-another").slideUp(200);
        }
    };
    onSwitchRecipient();

    $(".cart__recipient-switch input").on("change", function () {
        onSwitchRecipient();
    });

    //=================== Радио боксы в корзине ============

    $(".radio-box").on("click", function () {
        $(this).find("input").prop("checked", true);
    });
    $(".radio-box input").on("click", function () {
        $(this).prop("checked", true);
    });

    //=================== Переключение типа доставки ============

    $(".cart__delivery-radio-box").on("click", function () {
        const type = $(this).find("input").val();
        if (type === "courier") {
            $(".cart__delivery-point, .cart__delivery-date").slideUp(200);
            $(".cart__delivery-courier").slideDown(200);
        } else {
            $(".cart__delivery-point, .cart__delivery-date").slideDown(200);
            $(".cart__delivery-courier").slideUp(200);
        }
    });

    //=================== Слайдер логотипов оригиналов ============

    const origsSlider = new Swiper(".origs__slider .swiper", {
        slidesPerView: 6,
        spaceBetween: 20,
        loop: true,
        speed: 800,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },

        navigation: {
            nextEl: ".origs__slider .slider-next",
            prevEl: ".origs__slider .slider-prev",
        },
    });

    //=================== Галлерея товара ============

    const productThumbsSlider = new Swiper(".product__slider-thumbs .swiper", {
        slidesPerView: 6,
        direction: "vertical",
        spaceBetween: 10,
        freeMode: false,
        watchSlidesProgress: true,
        navigation: {
            nextEl: ".product__slider-thumbs .slider-next",
            prevEl: ".product__slider-thumbs .slider-prev",
        },
        breakpoints: {
            0: {
                direction: "horizontal",
                slidesPerView: "auto",
                freeMode: true,
                spaceBetween: 4,
            },
            601: {
                direction: "vertical",
                slidesPerView: 6,
                freeMode: false,
                spaceBetween: 10,
            },
        },
    });
    const productSlider = new Swiper(".product__slider", {
        slidesPerView: 1,
        spaceBetween: 10,
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
        thumbs: {
            swiper: productThumbsSlider,
        },
    });

    //=================== Подключение табов для товара ============

    $(".product__all-chatacteristics").on("click", function (e) {
        e.preventDefault();
        window.scrollTo(0, $("#product-tabs").offset().top - 100);

        $("#product-tabs").tabs("option", "active", 1);
    });

    $("#product-tabs").tabs({
        show: { effect: "fade", duration: 200 },
        hide: { effect: "fade", duration: 200 },

        load: function (event, ui) {},
    });

    //=================== Галлерея отзывов ============

    const reviewsSlider = new Swiper(".reviews__slider .swiper", {
        spaceBetween: 10,
        freeMode: true,
        slidesPerGroup: 5,
        slidesPerView: "auto",
        speed: 400,
        navigation: {
            nextEl: ".reviews__slider .slider-next",
            prevEl: ".reviews__slider .slider-prev",
        },
    });
    //=================== Подключение fancybox ============

    Fancybox.bind("[data-fancybox]", {
        // Your custom options
    });
    $("#product-tabs").on("tabsload", function (event, ui) {
        Fancybox.bind("[data-fancybox='reviews']", {
            // Your custom options
        });
    });

    //=================== Сортировка отзывов ============
    $(
        ".sorter-item[data-sort='asc'] svg, .sorter-item[data-sort='desc'] svg"
    ).fadeIn(200);
    $(".sorter-item").on("click", function () {
        const siblings = $(".sorter-item").not(this);
        siblings.attr("data-sort", "");
        siblings.find("svg").fadeOut(200);
        const currentSort = $(this).attr("data-sort");

        if ($(this).hasClass("one-dir")) {
            $(this).attr("data-sort", "desc");
            return;
        }

        if (currentSort === "asc") {
            $(this).attr("data-sort", "desc");
            $(this).find("svg").fadeIn(200);
        } else {
            $(this).attr("data-sort", "asc");
            $(this).find("svg").fadeIn(200);
        }
    });

    //=================== Инпуты контактов в ЛК ============

    $(".account__content-profile-row_contacts input").on("input", function () {
        if ($(this).val()) {
            $(this)
                .closest(".input")
                .addClass("typing")
                .removeClass("activated");
        } else {
            $(this)
                .closest(".input")
                .removeClass("typing")
                .removeClass("activated");
        }
    });

    $(".account__content-profile-row_contacts button").on("click", function () {
        const input = $(this).closest(".input").find("input");
        if (input.val()) {
            $(this)
                .closest(".input")
                .addClass("activated")
                .removeClass("typing");
        }
    });

    $(".account__content-profile-row_contacts .tip-mark").on(
        "click",
        function (e) {
            e.preventDefault();
            e.stopPropagation();

            $(".tip-mark").removeClass("opened");
            $(this).toggleClass("opened");
        }
    );

    //=================== Якорные ссылки ============

    $(".scroll-to").on("click", function (e) {
        e.preventDefault();
        const target = $(this).attr("href");
        window.scrollTo(0, $(target).offset().top - 100);
    });

    //=================== Меню в личном кабинете ============

    $(".account__nav a").on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("active")) return;
        $(".account__nav a").not(this).removeClass("active");
        $(this).addClass("active");

        const targetId = $(this).attr("href");

        if ($(window).width() <= 600) {
            $(".account aside").slideUp(200);
        }

        if (!targetId.split("#")[0]) {
            window.scrollTo(0, 0);
            const accountContent = $(targetId);
            history.pushState(null, null, targetId);
            $(".account__content-item").removeClass("active").slideUp(200);
            $(accountContent).addClass("active").slideDown(200);
            const hash = window.location.hash;
            if (hash.split("#")[1] === "history") {
                setTimeout(function () {
                    $(".catalog__item-add-to-cart").each(function (index, btn) {
                        animateAddToCartButton($(btn), ".catalog__item");
                    });
                }, 200);
            }
        } else {
            window.scrollTo(0, 0);
            window.location.href = targetId;
        }
    });

    function showElementFromHash() {
        if (window.location.pathname === "/account") {
            const hash = window.location.hash;

            if (hash) {
                const target = $(hash);
                $(".account__nav a").removeClass("active");
                $(".account__nav a[href='" + hash + "']").addClass("active");
                if (target.length) {
                    $(".account__content-item").not(target).slideUp(200);
                    target.slideDown(200);
                }

                if ($(window).width() <= 600) {
                    $(".account aside").slideUp(200);
                }
            } else {
                window.scrollTo(0, 0);
                $(".account__nav a").removeClass("active");
                $(".account__content-item").slideUp(200);

                if ($(window).width() > 600) {
                    $("#profile").addClass("active").slideDown(200);
                    $(".account__nav a[href='#profile']").addClass("active");
                }
                if ($(window).width() <= 600) {
                    $(".account aside").slideDown(200);
                }
            }
        }
    }

    showElementFromHash();

    $(window).on("hashchange", function (e) {
        e.preventDefault();
        window.scrollTo(0, 0);

        showElementFromHash();
    });
    if (
        window.location.pathname.includes("about") ||
        window.location.pathname.includes("account")
    ) {
        const hash = window.location.hash;
        history.replaceState(null, null, window.location.pathname);

        $(window).on("load", function (e) {
            window.location.hash = hash;
        });
    }

    $("a").click(function (e) {
        if (window.location.href === this.href) {
            e.preventDefault();
        }
    });

    //=================== Мобильное меню в личном кабинете ============

    $(
        ".account__content-item h1, .account__content-item h2, .account__content-item h3.back"
    ).click(function () {
        const hash = window.location.hash;
        if (hash && $(window).width() <= 600) {
            $(".account aside").addClass("active");
            window.location = window.location.pathname + "#";
        }
    });

    //=================== Карточка заказа ============

    $(".order-card").each(function () {
        const goods = $(this).find(".order-card__product");
        const goodsCount = goods.length;
        if (goodsCount > 6 && $(window).width() > 600) {
            const overlay = $("<span>");
            overlay.text(goodsCount - 6 + "+");
            goods.eq(3).append(overlay);
        }
        if (goodsCount > 8 && $(window).width() <= 600) {
            const overlay = $("<span>");
            overlay.text(goodsCount - 8 + "+");
            goods.eq(4).append(overlay);
        }
    });

    //=================== Опции юр лица ============

    $(".account__content-legal-item-header-btn").on("click", function () {
        $(this)
            .closest(".account__content-legal-item")
            .find(".account__content-legal-item-header-options")
            .fadeToggle(200);
    });
    $(".account__content-legal-item-header-options a").on("click", function () {
        $(this)
            .closest(".account__content-legal-item-header-options")
            .fadeToggle(200);
    });

    //=================== Инпут загрузки документа юр лица ============

    $(".account__content-legal-edit-doc input").on("change", function (e) {
        const file = e.target.files[0];
        const parent = $(this).closest(".account__content-legal-edit-doc");
        const button = parent.find("strong");

        const fileNameBlock = $(
            ".account__content-legal-edit-filename span:first-child"
        );
        const fileTypeBlock = $(
            ".account__content-legal-edit-filename span:last-child"
        );
        fileNameBlock.empty();
        fileTypeBlock.empty();
        parent.removeClass("success");
        button.find("span").text("Прикрепить документ");
        button.find(".success").hide();
        button.find(".default").fadeIn(200);

        if (!file) {
            fileNameBlock.text("Файл не выбран");
            return;
        }

        const lastDotIndex = file.name.lastIndexOf(".");
        if (lastDotIndex !== -1) {
            const name = file.name.slice(0, lastDotIndex);
            const type = file.name.slice(lastDotIndex + 1);
            fileNameBlock.text(name);
            fileTypeBlock.text(type);
        } else {
            fileNameBlock.text(file.name);
        }

        parent.addClass("success");
        button.find("span").text("Документ получен!");
        button.find(".default").hide();
        button.find(".success").fadeIn(200);
    });

    //=================== Инпуты юр лица ============

    $(".address-equal").on("change", function () {
        const hiddenInput = $(this)
            .closest(".account__content-item")
            .find(".account__content-legal-edit-row_physical-address-wrapper");
        if ($(this).is(":checked")) {
            hiddenInput.slideUp(200);
        } else {
            hiddenInput.slideDown(200);
        }
    });

    $(".account__content input").on("input", function () {
        if ($(this).val()) {
            $(this).addClass("typing");
        } else {
            $(this).removeClass("typing");
        }
    });

    $(".account__content-legal-add-block_accordion p").on("click", function () {
        $(this).parent().toggleClass("active");
        $(this)
            .parent()
            .find(".account__content-legal-add-block_accordion-content")
            .slideToggle(200);
    });

    $(".account__content-legal-add-save").hide();
    $(".account__content-legal-add-block_select input").on(
        "input",
        function () {
            if ($(this).hasClass("typing")) {
                $(".account__content-legal-add-block_select ul").slideDown(200);
            } else {
                $(".account__content-legal-add-block_select ul").slideUp(200);
                $(".account__content-legal-add-block_info").slideUp(200);
                $(".account__content-legal-add-block_accordion").slideUp(200);
                $(".account__content-legal-add-save").slideUp(200);
            }
        }
    );

    $(".account__content-legal-add-block_select li").on("click", function () {
        $(".account__content-legal-add-block_select ul").slideUp(200);

        if (!$(this).hasClass("another")) {
            $(".account__content-legal-add-block_info").slideDown(200);
            $(".account__content-legal-add-block_accordion").slideDown(200);
            $(".account__content-legal-add-save").slideDown(200);
        }
    });

    //=================== Меню на странице "О нас" ============

    $(".about__nav a").on("click", function (e) {
        e.preventDefault();
        //=================== Мобильное меню на странице "О нас" ============

        if ($(window).width() <= 600) {
            if ($(this).hasClass("active")) {
                $(".about__nav a").not(this).parent().slideToggle(200);
                $(this).toggleClass("opened");
            } else {
                $(".about__nav a").not(this).parent().slideUp(200);
                $(".about__nav a").removeClass("opened");
            }
        }
        if ($(this).hasClass("active")) return;
        $(".about__nav a").not(this).removeClass("active");
        $(this).addClass("active");

        const targetId = $(this).attr("href");

        if (!targetId.split("#")[0]) {
            const aboutContent = $(targetId);
            history.pushState(null, null, targetId);
            $(".about__item").removeClass("active").slideUp(200);
            $(aboutContent).addClass("active").slideDown(200);
            const hash = window.location.hash;
            window.scrollTo(0, 0);
        } else {
            window.location.href = targetId;
        }
    });

    function showAboutElementFromHash() {
        if (window.location.pathname === "/about") {
            const hash = window.location.hash;

            if (hash) {
                const target = $(hash);
                $(".about__nav a").removeClass("active");
                $(".about__nav a[href='" + hash + "']").addClass("active");
                if (target.length) {
                    $(".about__item").not(target).slideUp(200);
                    target.slideDown(200);
                }
            } else {
                $(".about__nav a").removeClass("active");
                $(".about__item").slideUp(200);

                $("#about").addClass("active").slideDown(200);
                $(".about__nav a[href='#about']").addClass("active");
            }
        }
    }

    showAboutElementFromHash();

    $(window).on("hashchange", function () {
        showAboutElementFromHash();
    });

    //=================== Слайдер благодарственных писем ============

    const thxLetterSlider = new Swiper(".about__slider .swiper", {
        slidesPerView: 4,
        spaceBetween: 20,
        speed: 400,

        navigation: {
            nextEl: ".about__slider .slider-next",
            prevEl: ".about__slider .slider-prev",
        },
        scrollbar: {
            el: ".about__slider .swiper-scrollbar",
        },

        breakpoints: {
            0: {
                slidesPerView: "auto",
                spaceBetween: 10,
                freeMode: true,
            },
            601: {
                freeMode: false,
            },
            1026: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
        },
    });

    //=================== Автособираемое содержание статьи ============

    const articleNav = $(".article__nav ul");
    const content = $(".article__content");

    articleNav.empty();

    content.find("h1, h2, h3, h4, h5, h6").each(function (index) {
        const headingText = $(this).text();
        const headingId = `heading-${index}`;

        $(this).attr("id", headingId);

        const link = $(
            `<li>
                <a href="#${headingId}">
                   <span>${headingText}</span>
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 1L10 7L4 13"
                            stroke="#28272D"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </a>
            </li>`
        );

        articleNav.append(link);
    });

    $(".article__nav a").on("click", function (e) {
        e.preventDefault();
        const target = $(this).attr("href");

        window.scrollTo(0, $(target).offset().top - 120);
    });

    //=================== Отслеживание высоты хедера ============

    function updateHeaderHeight() {
        $(".catalog__menu-inner").css({
            height: `calc(100vh - ${$(".header").height()}px + 20px)`,
        });

        if ($(window).width() <= 600) {
            const offset = isBannerHidden ? 0 : 50;

            $(".city-popup, .search").css({
                paddingTop: `${offset}px`,
            });
        } else if ($(window).width() <= 767) {
            const offset = isBannerHidden ? 0 : 60;

            $(".city-popup, .search").css({
                paddingTop: `${offset}px`,
            });
            // $(".city-popup__wrapper").css({
            //     marginTop: `${$(".header").height()}px`,
            // });
        }
    }

    updateHeaderHeight();

    $(window).on("resize", updateHeaderHeight);

    //=================== Мега меню ============

    $(".mega-menu-btn").click(function () {
        $(".mega-menu-btn").toggleClass("open");
        $("#catalogContent").toggleClass("open");
        $(this).find(".swich-icon").toggleClass("open");
        $(this).find(".cross-icon").toggleClass("open");
        $(".header__overlay").fadeToggle(300);

        if ($(".catalog__menu").hasClass("open") && $(window).width() <= 767) {
            resetMobileMenu();
            $("#catalogContent")
                .css("display", "block")
                .animate({ left: 0 }, 200);
        } else if ($(window).width() <= 767) {
            $("#catalogContent").animate({ left: "-100%" }, 200, function () {
                $("#catalogContent").removeAttr("style");
            });
        }
    });

    $(".catalog__navigation a").click(function (e) {
        $(".mega-menu-btn").removeClass("open");
        $("#catalogContent").removeClass("open");
        $(this).find(".swich-icon").removeClass("open");
        $(this).find(".cross-icon").removeClass("open");
        $(".header__overlay").fadeOut(300);
        $("#catalogContent").animate({ left: "-100%" }, 200, function () {
            $("#catalogContent").removeAttr("style");
        });
    });

    const showMegaMenuCategory = (element) => {
        $(element).addClass("active").siblings().removeClass("active");
        $(".catalog__category")
            .filter("#" + $(element).data("category"))
            .slideDown(300)
            .siblings(".catalog__category")
            .slideUp(300);
    };

    showMegaMenuCategory(".category-btn.active");

    $(".category-btn").bind("click mouseover", function () {
        showMegaMenuCategory(this);

        if ($(window).width() <= 767) {
            $(".catalog__menu-content aside").fadeOut(200);
            $(".catalog__category-wrapper").fadeIn(200);
        }
    });

    //=================== Мобильное меню ============

    const resetMobileMenu = () => {
        $(".catalog__category-wrapper").fadeOut(200);
        $(".catalog__menu-content aside").fadeOut(200);
        showMenuItem(".catalog__navigation");
    };

    const hideMenuItem = (element) => {
        $(element).css("pointer-events", "none").animate(
            {
                height: 0,
                opacity: 0,
            },
            200
        );
    };

    const showMenuItem = (element) => {
        $(element).css("pointer-events", "auto").animate(
            {
                height: "100%",
                opacity: 1,
            },
            200
        );
    };

    $(".mobile-menu-catalog-open").click(function () {
        hideMenuItem(".catalog__navigation");
        $(".catalog__menu-content aside").fadeIn(200);
    });

    $(".catalog__category h2").click(function (e) {
        if ($(window).width() <= 767) {
            e.preventDefault();
            $(".catalog__menu-content aside").fadeIn(200);
            $(".catalog__category-wrapper").fadeOut(200);
        }
    });

    $(".catalog__menu-content aside h2").click(function (e) {
        if ($(window).width() <= 767) {
            e.preventDefault();
            $(".catalog__menu-content aside").fadeOut(200);
            showMenuItem(".catalog__navigation");
        }
    });

    //=================== Попапы ============

    $(".popup-btn").click(function () {
        const popup = $($(this).data("popup"));
        popup.fadeToggle(300).addClass("open");
        $(".overlay").fadeToggle(300);
    });

    $(".popup-close").click(function () {
        $(".overlay").fadeOut(300);
        $(this).closest(".popup").fadeOut(300).removeClass("open");
    });

    // Пример функции для закрытия попапа
    function closePopup() {
        $(".popup").fadeOut(); // Скрываем попап
        $(".overlay").fadeOut(300);
    }

    //=================== Аккордион в футере ============

    $(".footer__inner-col-accordeon").click(function () {
        const col = $(this).closest(".footer__inner-col");
        col.toggleClass("opened");

        if (col.hasClass("opened")) {
            col.find("ul").slideDown(300);
        } else {
            col.find("ul").slideUp(300);
        }
    });

    //=================== Кнопки фильтрации каталога на мобильных устройствах ============

    $(".catalog__list-row-button_sorter").click(function () {
        const sorter = $(this).closest(".filters-row").find(".sorter");
        console.log($(this));
        sorter.fadeToggle(300);
        $(this).toggleClass("opened");
    });

    $(".catalog__list-row-button_filters").click(function () {
        const filters = $("#filters");
        disableScroll();
        filters.addClass("opened");
        $(".catalog__overlay").fadeIn(300);
    });

    $(".sorter .sorter-item").click(function () {
        if ($(window).width() <= 600) {
            const sorter = $(this).closest(".filters-row").find(".sorter");
            sorter.fadeOut(300);
            $(".catalog__list-row-button_sorter")
                .removeClass("opened")
                .find("span")
                .text($(this).text());
        }
    });

    //=================== Фильтр меню на мобильных устройствах ============

    $("#filters").on("scroll", function () {
        if ($(this).scrollTop() === 0) {
            $("#filters").removeClass("opened");
            $(".catalog__overlay").fadeOut(300);
            $(".catalog__list-row-button_filters").removeClass("opened");
            enableScroll();
        }
    });

    //=================== Поиск ============
    const openSearch = () => {
        $(".search").addClass("opened").fadeIn(300);
        $(".search #search").focus();
        disableScroll();
    };
    const closeSearch = () => {
        $(".search").removeClass("opened").fadeOut(300);
        enableScroll();
    };
    const closeAndClearSearch = () => {
        $(".search #search, #header-search-anchor").val("");
        $(".search__results").slideUp(300);
        closeSearch();
    };

    const checkSearchInputs = () => {
        if ($(".search #search").val().length > 0) {
            $(".search__results").slideDown(300);
        } else {
            $(".search__results").slideUp(300);
        }
    };

    $(".search__input-clean").click(closeAndClearSearch);

    $(".search #search").on("input", function () {
        $("#header-search-anchor").val($(this).val());
        checkSearchInputs();
    });

    $(".header-search:has(#header-search-anchor)").click(openSearch);

    $("#header-search-anchor").on("input", function () {
        $(".search #search").val($(this).val());
        checkSearchInputs();
    });

    //=================== Поиск города ============

    $(".city-popup .search-input input").on("input", function () {
        const val = $(this).val().toLowerCase();
        $(".city-popup__body label").each(function () {
            const text = $(this).find("span")[0].innerText.toLowerCase();
            if (text.includes(val)) {
                $(this).slideDown(200);
            } else {
                $(this).slideUp(200);
            }
        });
    });

    $(".city-popup-btn").click(function () {
        disableScroll();
        $(".city-popup").fadeIn(300).addClass("open");

        $(".mega-menu-btn").removeClass("open");
        $("#catalogContent").toggleClass("open");
        $(".mega-menu-btn").find(".swich-icon").toggleClass("open");
        $(".mega-menu-btn").find(".cross-icon").toggleClass("open");
        $(".header__overlay").fadeToggle(300);

        if ($(window).width() <= 767) {
            $("#catalogContent").animate({ left: "-100%" }, 200, function () {
                $("#catalogContent").removeAttr("style");
            });
        }
    });

    $(".city-popup__close").click(function () {
        $(".city-popup .search-input input").val("");
        $(".city-popup__body label").slideDown(200);
        $(".city-popup").fadeOut(300).removeClass("open");
        enableScroll();
    });

    //=================== Нажатие на ESC ============

    $(document).on("keydown", function (event) {
        if (event.key === "Escape" || event.keyCode === 27) {
            // Проверяем, нажата ли клавиша ESC
            closePopup(); // Вызов функции для закрытия попапа

            $(".mega-menu-btn").removeClass("open");
            $("#catalogContent").removeClass("open");
            $(".mega-menu-btn").find(".swich-icon").removeClass("open");
            $(".mega-menu-btn").find(".cross-icon").removeClass("open");
            $(".header__overlay").fadeOut(300);
            $(".city-popup").fadeOut(300).removeClass("open");
            $(".auth").fadeOut(200).removeClass("opened");
            closeSearch();

            if ($(window).width() <= 767) {
                $("#catalogContent").animate(
                    { left: "-100%" },
                    200,
                    function () {
                        $("#catalogContent").removeAttr("style");
                    }
                );
            }

            $(".catalog__list-filters").fadeOut(300);
        }
    });

    //=================== Клик вне попапа ============

    $(document).on("click", function (event) {
        var target = $(event.target);
        if (
            !target.closest("#catalogContent").length &&
            !target.closest(".mega-menu-btn").length &&
            $("#catalogContent").hasClass("open")
        ) {
            $(".mega-menu-btn").removeClass("open");
            $("#catalogContent").toggleClass("open");
            $(".mega-menu-btn").find(".swich-icon").toggleClass("open");
            $(".mega-menu-btn").find(".cross-icon").toggleClass("open");
            $(".header__overlay").fadeToggle(300);

            if ($(window).width() <= 767) {
                $("#catalogContent").animate(
                    { left: "-100%" },
                    200,
                    function () {
                        $("#catalogContent").removeAttr("style");
                    }
                );
            }
            enableScroll();
        }

        if (
            !target.closest(".popup.open .popup-wrapper").length &&
            !target.closest(".popup-btn").length
        ) {
            $(".popup.open").removeClass("open").fadeToggle(300);
            $(".overlay").fadeOut(300);
        }

        if (
            !target.closest(".search__wrapper").length &&
            !target.closest(".header-search:has(#header-search-anchor)")
                .length &&
            $(".search").hasClass("opened")
        ) {
            closeSearch();
        }

        if (
            !target.closest(".city-popup").length &&
            !target.closest(".city-popup-btn").length &&
            $(".city-popup-btn").hasClass("open")
        ) {
            $(".city-popup .search-input input").val("");
            $(".city-popup__body label").slideDown(200);
            $(".city-popup").fadeOut(300).removeClass("open");
            enableScroll();
        }

        if (
            !target.closest(".auth__wrapper").length &&
            !target.closest(".header__main-group-item_account.not-loggined")
                .length &&
            $(".auth").hasClass("opened")
        ) {
            $(".auth").fadeOut(200).removeClass("opened");
            enableScroll();
        }

        if (
            !target.closest(".catalog__list-filters").length &&
            !target.closest(".catalog__list-row-button_sorter").length &&
            $(".catalog__list-row-button_sorter").hasClass("opened") &&
            $(window).width() <= 600
        ) {
            $(".sorter").fadeOut(300);
            $(".catalog__list-row-button_sorter").removeClass("opened");
        }
        if (
            !target.closest("#filters .filters__wrapper").length &&
            !target.closest(".catalog__list-row-button_filters").length &&
            !target.closest(".catalog-notification").length &&
            $("#filters").hasClass("opened") &&
            $(window).width() <= 600
        ) {
            $("#filters").removeClass("opened");
            $(".catalog__overlay").fadeOut(300);
            $(".catalog__list-row-button_filters").removeClass("opened");
            enableScroll();
        }

        if (
            !target.closest(".tip").length &&
            !target.closest(".tip-mark").length &&
            $(".tip-mark").hasClass("opened")
        ) {
            $(".tip-mark").removeClass("opened");
        }
    });

    //=================== Промокоды ============

    $(".account__content-promocodes-list-item-bottom a").click(function (e) {
        e.preventDefault();
        $(this)
            .closest(".account__content-promocodes-list-item")
            .addClass("used")
            .find(".account__content-promocodes-list-item-top-info span")
            .text("Уже использован!");
    });

    //========================================================
    //=================== Авторизация ========================
    //========================================================

    //=================== Валидация ============
    const validateEmail = (email) => {
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const validatePhone = (phone) => {
        var phonePattern = /^\+?\d{11}$/;
        return phonePattern.test(phone);
    };

    function validatePassword(password) {
        let passwordPattern = /^[a-zA-Z\d!@#$%^&*()_+{}\[\]:;<>,.?/~`-]{8,}$/;
        return passwordPattern.test(password);
    }

    const validateInput = (input) => {
        const value = input.val().trim();
        if (value === "") {
            return false;
        }

        if (input[0].hasAttribute("data-form-text")) {
            return value.length < 20;
        }

        if (input[0].hasAttribute("data-form-email-or-phone")) {
            return validateEmail(value) || validatePhone(value);
        }

        if (input[0].hasAttribute("data-form-email")) {
            return validateEmail(value);
        }

        if (input[0].hasAttribute("data-form-password")) {
            return validatePassword(value);
        }

        if (input[0].hasAttribute("data-form-password-confirm")) {
            return (
                value ===
                input.closest("form").find("[data-form-password]").val().trim()
            );
        }

        if (input.attr("type") === "checkbox") {
            return input.prop("checked");
        }

        return true;
    };

    let authInputsArray = $(".auth__form input[required]")
        .map(function (index, elem) {
            return {
                input: $(elem).attr("name"),
                isValid: false,
                form: $(this).closest(".auth__form").attr("id"),
            };
        })
        .get();

    $(".auth__form input[required]").on("input", function () {
        const formId = $(this).closest(".auth__form").attr("id");
        const elem = authInputsArray.find(
            (item) => item.input === $(this).attr("name")
        );

        const isValid = validateInput($(this));
        if (isValid) $(this).removeClass("error");

        elem.isValid = isValid;

        const isFormValid = authInputsArray
            .filter((item) => item.form === formId)
            .every((item) => item.isValid);

        const button = $("#" + formId).find(".auth__btn");
        if (isFormValid) {
            button.removeClass("disabled");
        } else {
            button.addClass("disabled");
        }
    });

    const authForms = {
        "initial-form": [],
        "login-form": [],
        "register-form": [],
    };

    $(".auth__form button[type='submit']").on("click", function (e) {
        e.preventDefault();
        const form = $(this).closest("form");
        const isFormValid = authInputsArray
            .filter((item) => item.form === form.attr("id"))
            .every((item) => item.isValid);

        if (isFormValid) {
            // form.submit();
            const formData = form
                .find("[required]")
                .map((index, item) => {
                    return {
                        name: $(item).attr("name"),
                        value: $(item).val().trim(),
                    };
                })
                .get();
            authForms[form.attr("id")] = formData;
            console.log(authForms);

            if (form.attr("id") === "initial-form") {
                $("#initial-form").slideUp(200);
                $("#login-form").slideDown(200);
            }
            if (form.attr("id") === "login-form") {
                $("#login-form").slideUp(200);
                $("#register-form").slideDown(200);
            }
            if (form.attr("id") === "register-form") {
                window.location.href = "/account";
            }
        } else {
            const requires = authInputsArray
                .filter(
                    (item) => item.form === form.attr("id") && !item.isValid
                )
                .map((item) => item.input);

            requires.forEach((item) => {
                form.find("input[name='" + item + "']").addClass("error");
            });

            console.log("Form is not valid");
        }
    });

    //=================== Логика попапа ========================

    $(".auth__form h4 a").click(function (e) {
        e.preventDefault();
        $(this).closest(".auth__form").slideUp(200);
        $("#initial-form").slideDown(200);
    });

    $(".header__main-group-item_account.not-loggined").click(function (e) {
        e.preventDefault();
        $(".auth").fadeIn(200).addClass("opened");
        disableScroll();
    });

    $(".auth__close").click(function () {
        $(".auth").fadeOut(200).removeClass("opened");
        enableScroll();
    });

    //========================================================
    //========================================================
    //========================================================
});
