$(function () {
  $('input[type="tel"]').mask('+7 (999) 999 99 99');

  $('.burger').on('click', function () {
    $(this).toggleClass('burger-active');
    $('.header-mobile').slideToggle();
    $('.overlay').toggleClass('show');
  });

  $('.overlay').on('click', function () {
    $(this).removeClass('show');
    $('.header-mobile').slideUp();
    $('.burger').toggleClass('burger-active');
  });

  // Header mobile menu

  $('.header-mobile-menu svg').on('click', function (e) {
    e.preventDefault();
    $(this).closest('div').next('ul').slideToggle();
    $(this).closest('div').toggleClass('active');
  });

  // Бегущая строка

  $(document).ready(function () {
    let $wrapper = $('.marquee-wrapper');
    let $content = $('.marquee-content');

    if ($wrapper.length === 0 || $content.length === 0) {
      return;
    }

    let speed = 0.4;
    let text = $content.html();

    for (let i = 0; i < 11; i++) {
      $content.append(text);
    }

    let contentWidth = $content.width();
    $wrapper.css({ width: contentWidth + 'px' });

    function animateMarquee() {
      let currentLeft =
        parseFloat($wrapper.css('transform').split(',')[4]) || 0;

      if (Math.abs(currentLeft) >= contentWidth / 3) {
        $wrapper.css('transform', 'translateX(0)');
        requestAnimationFrame(animateMarquee);
        return;
      }

      $wrapper.css('transform', 'translateX(' + (currentLeft - speed) + 'px)');
      requestAnimationFrame(animateMarquee);
    }

    animateMarquee();
  });

  // Плагин До/после

  $('.portfolio-card').each(function () {
    let dragging = false;
    let wrapper = $(this).find('.portfolio-card-images');
    let slider = $(this).find('.portfolio-card-slider');
    let afterImg = $(this).find('.after-img');
    let positionPercent = 0.5;

    function updatePosition(position) {
      let maxWidth = wrapper.width();
      if (position < 0) position = 0;
      if (position > maxWidth) position = maxWidth;

      positionPercent = position / maxWidth;
      slider.css('left', position + 'px');
      afterImg.css('clip-path', `inset(0 ${maxWidth - position}px 0 0)`);
    }

    slider.on('mousedown touchstart', function (e) {
      e.preventDefault();
      dragging = true;
    });

    $(document).on('mousemove touchmove', function (e) {
      if (!dragging) return;

      let offsetX = e.pageX || e.originalEvent.touches[0].pageX;
      let position = offsetX - wrapper.offset().left;
      updatePosition(position);
    });

    $(document).on('mouseup touchend', function () {
      dragging = false;
    });

    $(window).on('resize', function () {
      requestAnimationFrame(() => {
        let newWidth = wrapper.width();
        let newPosition = positionPercent * newWidth;
        updatePosition(newPosition);
      });
    });

    updatePosition(wrapper.width() * positionPercent);
  });

  // Tabs

  $(document).ready(function () {
    var activeTabIndex = 0;
    var isMobileVersion = isMobile();
    var lastWindowWidth = $(window).width();

    function isMobile() {
      return $(window).width() < 992;
    }

    function initializeTabsAndAccordion() {
      $('.tabs').each(function () {
        var $tabWrap = $(this);
        var $menuItems = $tabWrap.find('.tabs-menu li');
        var $contentItems = $tabWrap.find('.tabs-content-item');

        if (isMobile()) {
          $menuItems.each(function (index) {
            var $contentItem = $contentItems.eq(index);
            $contentItem.hide().appendTo($(this));
            if (index === activeTabIndex) {
              $(this).addClass('active');
              $contentItem.show();
            }
          });
        } else {
          $contentItems.each(function () {
            $(this).appendTo($tabWrap.find('.tabs-content')).hide();
          });

          $contentItems.hide().eq(activeTabIndex).show();
          $menuItems
            .removeClass('active')
            .eq(activeTabIndex)
            .addClass('active');
        }

        $menuItems.off('click').on('click', function () {
          var index = $menuItems.index(this);
          var $contentItem = $contentItems.eq(index);

          if (isMobile()) {
            if ($(this).hasClass('active')) {
              $contentItem.slideUp();
              $(this).removeClass('active');
              activeTabIndex = -1;
            } else {
              $contentItems.slideUp();
              $menuItems.removeClass('active');
              $(this).addClass('active');
              $contentItem.appendTo($(this)).slideDown();
              activeTabIndex = index;
            }
          } else {
            $contentItems.hide();
            $contentItem.show();
            $menuItems.removeClass('active');
            $(this).addClass('active');
            activeTabIndex = index;
          }
        });
      });
    }

    // Инициализация
    initializeTabsAndAccordion();

    // Слежение за изменением размера окна
    $(window).resize(function () {
      var currentWidth = $(window).width();
      var wasMobile = isMobileVersion;
      isMobileVersion = isMobile();

      // Если был мобильный режим, а теперь десктоп, то восстанавливаем порядок контента
      if (wasMobile && !isMobileVersion) {
        $('.tabs').each(function () {
          var $tabWrap = $(this);
          var $contentItems = $tabWrap.find('.tabs-content-item');

          $contentItems.each(function () {
            $(this).appendTo($tabWrap.find('.tabs-content')).hide();
          });
        });
      }

      // Если был десктоп, а теперь мобильный режим
      if (!wasMobile && isMobileVersion) {
        activeTabIndex = -1; // При переходе в мобильный режим сбрасываем активный таб
      }

      // Перезапуск табов
      initializeTabsAndAccordion();

      // Обновляем сохраненный размер окна
      lastWindowWidth = currentWidth;
    });
  });

  $('.tabs-content').each(function () {
    $(this)
      .find('.tabs-content-item')
      .each(function (index) {
        $(this)
          .find('.technologies-banner-num')
          .text(String(index + 1).padStart(2, '0'));
      });
  });

  // Stages

  $(document).ready(function () {
    $('.stages-item').slice(1).hide();
    $('.stages-btn').click(function () {
      let items = $('.stages-item').slice(1);
      if (items.is(':visible')) {
        items.hide();
        $(this).text('Показать еще');
      } else {
        items.show();
        $(this).text('Скрыть');
      }
    });
  });

  // Video, Shorts more btn

  $(document).ready(function () {
    function setupToggleMoreContent(
      wrapperSelector,
      buttonSelector,
      visibleCount,
      showText,
      hideText
    ) {
      $(wrapperSelector).each(function () {
        let $wrapper = $(this);
        let $columns = $wrapper.find('.row > *');
        let $button = $wrapper.find(buttonSelector);

        $columns.slice(visibleCount).hide();

        $button.on('click', function () {
          let isExpanded = $columns.slice(visibleCount).is(':visible');

          $columns.slice(visibleCount).toggle();
          $(this).text(isExpanded ? showText : hideText);
        });
      });
    }

    setupToggleMoreContent(
      '.videos-wrap',
      '.videos-more-btn',
      3,
      'Смотреть все видео',
      'Скрыть видео'
    );
    setupToggleMoreContent(
      '.shorts-wrap',
      '.shorts-more-btn',
      8,
      'Смотреть еще',
      'Скрыть shorts'
    );
  });

  // Swiper

  var teamSlider = new Swiper('.team-slider', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 600,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });

  var testimonialsSlider = new Swiper('.testimonials-slider', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 600,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });

  var gallerySlider = new Swiper('.gallery-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    speed: 600,
    navigation: {
      nextEl: '.slider-btn-next',
      prevEl: '.slider-btn-prev',
    },
    slidesPerGroup: 1,
    breakpoints: {
      991: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      1199: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
    },
  });

  var doctorsSlider = new Swiper('.doctors-slider', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 600,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
  });

  var certificatesSlider = new Swiper('.certificates-slider', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 600,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
  });

  var testimonialsSlider2 = new Swiper('.testimonials-slider-2', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 600,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
  });

  // Mixitup

  function initMixitup(selector, config) {
    var container = document.querySelector(selector);
    if (container) {
      return mixitup(container, config);
    }
    return null;
  }

  var mixerAppointments = initMixitup('[data-ref="appointments"]', {
    controls: {
      scope: 'local',
    },
    classNames: {
      block: 'appointments',
      elementFilter: 'btn',
    },
    selectors: {
      control: '.appointments-btn',
      target: '.appointments-item',
    },
    animation: {
      enable: false,
    },
    load: {
      filter: '.appointments-item-1',
    },
  });

  var mixerPrice = initMixitup('[data-ref="price"]', {
    controls: {
      scope: 'local',
    },
    classNames: {
      block: 'price',
      elementFilter: 'btn',
    },
    selectors: {
      control: '.price-btn',
      target: '.price-item',
    },
    animation: {
      enable: false,
    },
  });

  var mixerDoctors = initMixitup('[data-ref="doctors"]', {
    controls: {
      scope: 'local',
    },
    classNames: {
      block: 'doctors',
      elementFilter: 'btn',
    },
    selectors: {
      control: '.doctors-btn',
      target: '.doctors-item',
    },
    animation: {
      enable: false,
    },
    callbacks: {
      onMixEnd: function () {
        doctorsSlider.update();
      },
    },
  });

  var testimonialsDoctors = initMixitup('[data-ref="testimonials"]', {
    controls: {
      scope: 'local',
    },
    classNames: {
      block: 'testimonials',
      elementFilter: 'btn',
    },
    selectors: {
      control: '.testimonials-btn',
      target: '.testimonials-item',
    },
    animation: {
      enable: false,
    },
    callbacks: {
      onMixEnd: function () {
        testimonialsSlider2.update();
      },
    },
  });

  var mixerVacancy = initMixitup('[data-ref="vacancy"]', {
    controls: {
      scope: 'local',
    },
    classNames: {
      block: 'vacancy',
      elementFilter: 'btn',
    },
    selectors: {
      control: '.vacancy-btn',
      target: '.vacancy-item',
    },
    animation: {
      enable: false,
    },
    load: {
      filter: '.vacancy-item-1',
    },
  });

  var mixerPortfolio = initMixitup('[data-ref="portfolio"]', {
    controls: {
      scope: 'local',
    },
    classNames: {
      block: 'portfolio',
      elementFilter: 'btn',
    },
    selectors: {
      control: '.portfolio-btn',
      target: '.portfolio-item',
    },
    animation: {
      enable: false,
    },
  });
});
