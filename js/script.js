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

    let isStuck = false; // Флаг для отслеживания состояния

    $(window).on("scroll", function () {
        const rect = stickyHeader[0].getBoundingClientRect(); // Получаем размеры и положение элемента

        if (rect.top <= 0 && !isStuck) {
            stickyHeader.css("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.1)");
            isStuck = true;
            if ($("body").hasClass("product-page")) {
                $(".sticky").addClass("active");
                stickyHeader
                    .css("pointer-events", "none")
                    .animate({ opacity: 0 }, 50);
            }
        } else if (rect.top > 0 && isStuck) {
            stickyHeader.css("box-shadow", "none");
            isStuck = false;
            if ($("body").hasClass("product-page")) {
                $(".sticky").removeClass("active");
                stickyHeader
                    .css("pointer-events", "auto")
                    .animate({ opacity: 1 }, 50);
            }
        }
    });

    //=================== Слайдер в оффере на главной ============

    const offerSlider = new Swiper(".offer-slider", {
        loop: true,
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

    //=================== Слайдр товаров ============

    const bestsellersSlider = new Swiper(".bestsellers .products__slider", {
        spaceBetween: 20,
        speed: 600,
        slidesPerView: 5,
        grabCursor: true,
        navigation: {
            nextEl: ".bestsellers .slider-next",
            prevEl: ".bestsellers .slider-prev",
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
    const noveltiesSlider = new Swiper(".novelties .products__slider", {
        spaceBetween: 20,
        speed: 600,
        slidesPerView: 5,
        grabCursor: true,
        navigation: {
            nextEl: ".novelties .slider-next",
            prevEl: ".novelties .slider-prev",
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

    //=================== Часто задаваемые вопросы ============

    // // Сначала скроем все ответы
    // $(".faq__item-answer").slideUp();

    // $(".faq__item").click(function () {
    //     // Уберем класс rotate-faq у всех SVG в заголовках вопросов
    //     $(".faq__item-question svg").removeClass("rotate-faq");

    //     // Применим исходные стили к всем элементам
    //     $(this).find(".faq__item-question").css("border", "1px solid #E8E8E8");
    //     $(this)
    //         .find(".faq__item-question span, .faq__item-question p")
    //         .css("color", "#000");
    //     $(".faq__item").css("border", "1px solid transparent");

    //     // Находим текущий вопрос и ответ
    //     let $currentAnswer = $(this).find(".faq__item-answer");
    //     let $currentQuestion = $(this).find(".faq__item-question");

    //     // Если текущий ответ виден, скроем его
    //     if ($currentAnswer.is(":visible")) {
    //         $currentAnswer.slideUp();
    //     } else {
    //         // Скроем все ответы, кроме текущего
    //         $(".faq__item-answer").not($currentAnswer).slideUp();

    //         // Раскроем только текущий ответ
    //         $currentAnswer.slideDown();

    //         // Изменяем стиль для текущего вопроса
    //         $(this)
    //             .find(".faq__item-question")
    //             .css("border", "1px solid transparent");
    //         $(this)
    //             .parent()
    //             .find(".faq__item-question span, .faq__item-question p")
    //             .css("color", "#000");
    //         $(this)
    //             .find(".faq__item-question span, .faq__item-question p")
    //             .css("color", "#DA0916");
    //         $(this).css("border", "1px solid #E8E8E8");

    //         // Добавляем класс rotate-faq к SVG текущего вопроса
    //         $currentQuestion.find("svg").addClass("rotate-faq");
    //     }
    // });

    //=================== Анимация у checkbox ============

    $(".check-label").on("click", function () {
        let isChecked = $(this).children("input").prop("checked");
        if (isChecked) {
            $(this).find(".fakecheck").addClass("checked");
        } else {
            $(this).find(".fakecheck").removeClass("checked");
        }
    });

    //=================== Вы смотрели ============

    // const wachedSlider = new Swiper(".wached__slider", {
    //     spaceBetween: 20,
    //     initialSlide: 0,
    //     speed: 600,
    //     slidesPerView: "auto",
    //     // grabCursor: true,
    //     // autoplay: {
    //     //   delay: 4000,
    //     //   disableOnInteraction: false,
    //     // },
    //     scrollbar: {
    //         el: ".swiper-scrollbar-recommendation",
    //     },
    //     navigation: {
    //         nextEl: ".wached-slider-next",
    //         prevEl: ".wached-slider-prev",
    //     },

    //     breakpoints: {
    //         1200: {
    //             spaceBetween: 13,
    //         },
    //         1500: {
    //             spaceBetween: 16,
    //         },
    //         601: {
    //             slidesPerView: "auto",
    //         },
    //         310: {
    //             slidesPerView: 2,
    //             spaceBetween: 10,
    //         },
    //     },
    // });

    //=================== Слайдер партнеров ============

    // const productGallery = new Swiper(".product-gallery", {
    //     loop: true,
    //     speed: 600,
    //     slidesPerView: "auto",
    //     centeredSlides: true,
    //     spaceBetween: 30,
    //     // grabCursor: true,
    //     navigation: {
    //         nextEl: ".product-slider-next",
    //         prevEl: ".product-slider-prev",
    //     },

    //     breakpoints: {
    //         1200: {
    //             spaceBetween: 13,
    //         },
    //         1500: {
    //             spaceBetween: 16,
    //         },
    //         0: {
    //             spaceBetween: 5,
    //         },
    //     },
    //     on: {
    //         slideChangeTransitionStart: function () {},
    //         transitionEnd: function () {
    //             let activeSlideImgLink = this.slides[this.activeIndex].src;
    //             $(".product__photo>img").attr("src", activeSlideImgLink);
    //         },
    //     },
    // });

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

    $(".catalog__item").each(function (index, card) {
        const $card = $(card);
        const $swiperContainer = $card.find(".catalog__item-slider");
        // Инициализация Swiper для каждой карточки
        const swiper = new Swiper($swiperContainer[0], {
            loop: true,
            autoplay: {
                delay: 1000,
                disableOnInteraction: false,
            },
            speed: 600,
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: $card.find(".swiper-pagination")[0],
                type: "bullets",
            },
        });

        swiper.autoplay.stop();

        // Привязка событий к карточке
        $card.on("mouseenter", function () {
            swiper.autoplay.start();
        });

        $card.on("mouseleave", function () {
            swiper.autoplay.stop();
        });
    });

    //=================== Кнопка добавить в корзину ============

    const animateAddToCartButton = (
        btn,
        parentSelector,
        width = "84px",
        bySelector = false
    ) => {
        const button = bySelector ? $(btn) : btn;
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
        } else {
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

    $(".catalog__item-add-to-cart").each(function (index, btn) {
        animateAddToCartButton($(btn), ".catalog__item");
    });

    $(".product-page .add-to-cart").each(function (index, btn) {
        animateAddToCartButton(".add-to-cart", ".product-page", "150px", true);
    });

    //=================== Уведомление о добавлении в корзину ============

    /**
     * Показывает уведомление, добавляя класс "show" и выполняя анимацию его появления.
     *
     * @param {jQuery} notification - jQuery элемент уведомления, который нужно показать.
     */

    const showNotification = (notification) => {
        notification.addClass("show");
        $({ offset: 150 }).animate(
            { offset: 0 }, // Конечное значение
            {
                duration: 300,
                step: function (now) {
                    notification.css(
                        "-moz-transform",
                        "translate(" + now + "%, 0)"
                    );
                    notification.css(
                        "-ms-transform",
                        "translate(" + now + "%, 0)"
                    );
                    notification.css(
                        "-webkit-transform",
                        "translate(" + now + "%, 0)"
                    );
                    notification.css(
                        "-o-transform",
                        "translate(" + now + "%, 0)"
                    );
                    notification.css("transform", "translate(" + now + "%, 0)");
                },
            }
        );
    };

    /**
     * Скрывает уведомление, удаляя класс "show" и выполняя анимацию его исчезновения.
     *
     * @param {jQuery} notification - jQuery элемент уведомления, который нужно скрыть.
     */

    const hideNotification = (notification) => {
        notification.removeClass("show");
        $({ offset: 0 }).animate(
            { offset: 150 }, // Конечное значение
            {
                duration: 300,
                step: function (now) {
                    notification.css(
                        "-moz-transform",
                        "translate(" + now + "%, 0)"
                    );
                    notification.css(
                        "-ms-transform",
                        "translate(" + now + "%, 0)"
                    );
                    notification.css(
                        "-webkit-transform",
                        "translate(" + now + "%, 0)"
                    );
                    notification.css(
                        "-o-transform",
                        "translate(" + now + "%, 0)"
                    );
                    notification.css("transform", "translate(" + now + "%, 0)");
                },
            }
        );
    };
    /**
     * Закрывает уведомление, останавливая таймер закрытия уведомления,
     * если он существует, и скрывая уведомление.
     *
     * !!!ВАЖНО!!! Вызывать только для предотварщения уже сработавшей
     * анимации показа уведомления
     *
     * @param {jQuery} notification - jQuery элемент уведомления, которое нужно закрыть.
     */
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
        $(this).closest(".catalog__item, .product-page").toggleClass("added");
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
                console.log(width);
                animateAddToCartButton(
                    $(container).find(".add-to-cart-button"),
                    ".product-page",
                    width
                );
            });
        } else {
            animateAddToCartButton($(this), ".catalog__item");
        }

        if (!$(this).closest(".catalog__item, .product-page").hasClass("added"))
            return;

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

        if (currentQuantity === 1) {
            if (!isProductPage) {
                btn.closest(".catalog__item-quantity")
                    .find(".catalog__item-quantity-btn_minus")
                    .addClass("disabled");
            } else {
                $(".catalog__item-quantity-btn_minus").addClass("disabled");
            }
        } else {
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
        if (currentQuantity < 1) {
            counter.text(1);
        }

        if (currentQuantity > quantity) {
            counter.text(quantity);
        }
    });

    // ================== Кнопка добавить в избранное ============

    $(".catalog__item-fav").on("click", function () {
        if (!!$(this).closest(".product-page").length) {
            $(".product-page").toggleClass("fav");
        } else {
            $(this).closest(".catalog__item").toggleClass("fav");
        }
    });

    $(".catalog__item-fav").click(function () {
        if (!!$(this).closest(".product-page").length) {
            $(".product-page").toggleClass("fav");
            $(".catalog__item-fav").toggleClass("active");
        } else {
            $(this).closest(".catalog__item").toggleClass("fav");
            $(this).toggleClass("active");
        }
    });

    //=================== Выбор цвета у товара ============
    let defaultColor = $(
        ".product__info-selector-color .product__info-selector-item input"
    )
        .first()
        .attr("value");
    $(".product__info-selector-color p span").text(defaultColor);

    $(".product__info-selector-color .product__info-selector-item").on(
        "click",
        function () {
            let currentColor = $(this).find("input").attr("value");
            $(this).parent().parent().find("p span").text(currentColor);
        }
    );

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

    //=================== Прокрутка вверх страницы ============

    $(".float__item_to-top").on("click", function (e) {
        window.scrollTo(0, 0);
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
    });
    const productSlider = new Swiper(".product__slider", {
        slidesPerView: 1,
        direction: "vertical",
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

    $("#product-tabs").tabs({
        show: { effect: "fade", duration: 200 },
        hide: { effect: "fade", duration: 200 },

        load: function (event, ui) {},
    });

    //=================== Галлерея отзывов ============

    const reviewsSlider = new Swiper(".reviews__slider .swiper", {
        spaceBetween: 10,
        freeMode: true,
        slidesPerView: "auto",
        speed: 600,
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
        ".reviews__sorter-item[data-sort='asc'] svg, .reviews__sorter-item[data-sort='desc'] svg"
    ).fadeIn(200);
    $(".reviews__sorter-item").on("click", function () {
        const siblings = $(".reviews__sorter-item").not(this);
        siblings.attr("data-sort", "");
        siblings.find("svg").fadeOut(200);
        const currentSort = $(this).attr("data-sort");

        switch (currentSort) {
            case "asc":
                $(this).attr("data-sort", "desc");
                break;
            case "desc":
                $(this).attr("data-sort", "");
                $(this).find("svg").fadeOut(200);
                break;
            default:
                $(this).attr("data-sort", "asc");
                $(this).find("svg").fadeIn(200);
                $(this).addClass("active");
        }
    });

    //=================== Выбор цвета у товара ============

    let defaultСrosspiece = $(
        ".product__info-selector-crosspiece .product__info-selector-item input"
    )
        .first()
        .attr("value");
    $(".product__info-selector-crosspiece p span").text(defaultСrosspiece);

    $(".product__info-selector-crosspiece .product__info-selector-item").on(
        "click",
        function () {
            let currentColor = $(this).find("input").attr("value");
            $(this).parent().parent().find("p span").text(currentColor);
        }
    );

    //=================== Выбор характеристики товара у первого типа карточки ============

    $(".product__full-info-tabs span").on("click", function () {
        $(".product__full-info-tabs span").removeClass("active");
        $(this).toggleClass("active");
    });

    //=================== Dropdown инструкции в карточке товара ============
    $(".product__full-info-manual button").on("click", function () {
        $(".product__full-info-manual-files").slideToggle(300);

        $(this).find("svg").toggleClass("active");
    });

    $(".product__full-info-specifications").slideDown();
    $(".product__full-info-collection").slideUp();

    $("#product__full-info-tabs-specifications").on("click", function () {
        $(".product__full-info-specifications").slideDown();
        $(".product__full-info-collection").slideUp();
    });

    $("#product__full-info-tabs-collection").on("click", function () {
        $(".product__full-info-specifications").slideUp();
        $(".product__full-info-collection").slideDown();
    });

    //=================== Слайдер "Коллекции товара" ============

    const collectionSlider = new Swiper(".product-collection-slider", {
        spaceBetween: 20,
        initialSlide: 0,
        speed: 600,
        slidesPerView: "auto",
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".product-collection-slider-next",
            prevEl: ".product-collection-slider-prev",
        },

        breakpoints: {
            1200: {
                spaceBetween: 13,
            },
            1500: {
                spaceBetween: 16,
            },
        },
    });

    //=================== Меню в личерм кабинете ============

    $(".account__content-item").slideUp();
    $(".account__content-profile").slideDown();
    //  $('.account__content-discounts').slideDown();
    $("#profile").addClass("active");

    $(".account aside nav ul li").on("click", function () {
        $(".account aside nav ul li").removeClass("active");
        $(this).addClass("active");
        let munudId = $(this).attr("id");
        let accountContent =
            '[class^="account__content-"][class$="' + munudId + '"]';
        $(".account__content-item").slideUp();
        $(accountContent).slideDown();
    });

    //=================== Слайдр каталога ============

    const docsSlider = new Swiper(".docs-slider", {
        spaceBetween: 20,
        initialSlide: 0,
        speed: 600,
        slidesPerView: "auto",
        grabCursor: true,
        keyboard: {
            enabled: true,
        },
        scrollbar: {
            el: ".swiper-scrollbar",
        },
        breakpoints: {
            1200: {
                spaceBetween: 13,
            },
            1500: {
                spaceBetween: 16,
            },
        },
    });

    //=================== Смена текста на странице оформления карты ============

    $(".gift__card-form-info-content").slideUp();
    $("#1").addClass("active");
    $(".gift__card-form-info-content-1").slideDown();

    $(".gift__card-form-info-swich span").on("click", function () {
        $(".gift__card-form-info-swich span").removeClass("active");
        $(this).addClass("active");

        let munudId = $(this).attr("id");
        let content =
            '[class^="gift__card-form-info-content"][class$="' + munudId + '"]';
        $(".gift__card-form-info-content").slideUp();
        $(content).slideDown();
    });

    $("#burger_menu").click(function () {
        $(this).toggleClass("open");
        $("#catalogContentAdaptive").toggleClass("open");
    });

    $("#catalog").click(function () {
        $("#catalog").toggleClass("open");
        $("#catalogContent").toggleClass("open");
        $(this).find(".swich-icon").toggleClass("open");
        $(this).find(".cross-icon").toggleClass("open");
        $(".header__overlay").fadeToggle(300);
    });

    $(document).on("click", function (event) {
        var target = $(event.target);
        if (
            !target.closest("#catalogContent").length &&
            !target.closest("#catalog").length &&
            $("#catalogContent").hasClass("open")
        ) {
            $("#catalog").removeClass("open");
            $("#catalogContent").toggleClass("open");
            $("#catalog").find(".swich-icon").toggleClass("open");
            $("#catalog").find(".cross-icon").toggleClass("open");
            $(".header__overlay").fadeToggle(300);
        }
    });

    $("#bannerClose").click(function () {
        $(this).parent().slideUp(300);
    });

    const showMegaMenuCategory = (element) => {
        console.log($(element));
        $(element).addClass("active").siblings().removeClass("active");
        $(".catalog__category")
            .filter("#" + $(element).data("category"))
            .slideDown(300)
            .siblings(".catalog__category")
            .slideUp(300);
    };

    showMegaMenuCategory(".category-btn.active");

    $(".category-btn").click(function () {
        showMegaMenuCategory(this);
    });

    $(".popup-btn").click(function () {
        const popup = $($(this).data("popup"));
        popup.fadeToggle(300).addClass("open");
        $(".overlay").fadeToggle(300);
    });

    $(document).on("click", function (event) {
        var target = $(event.target);
        if (
            !target.closest(".popup.open .popup-wrapper").length &&
            !target.closest(".popup-btn").length
        ) {
            $(".popup.open").removeClass("open").fadeToggle(300);
            $(".overlay").fadeOut(300);
        }
    });

    $(".popup-close").click(function () {
        $(".overlay").fadeOut(300);
        $(this).closest(".popup").fadeOut(300).removeClass("open");
    });

    $(document).on("keydown", function (event) {
        if (event.key === "Escape" || event.keyCode === 27) {
            // Проверяем, нажата ли клавиша ESC
            closePopup(); // Вызов функции для закрытия попапа

            $("#catalog").removeClass("open");
            $("#catalogContent").removeClass("open");
            $("#catalog").find(".swich-icon").removeClass("open");
            $("#catalog").find(".cross-icon").removeClass("open");
            $(".header__overlay").fadeOut(300);
        }
    });

    // Пример функции для закрытия попапа
    function closePopup() {
        $(".popup").fadeOut(); // Скрываем попап
        $(".overlay").fadeOut(300);
    }
});
