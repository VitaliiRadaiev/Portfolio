function slideUp(target, duration = 500) {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target?.classList.remove('_slide');
    }, duration);
}
function slideDown(target, duration = 500) {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none')
        display = 'block';

    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target?.classList.remove('_slide');
    }, duration);
}
function slideToggle(target, duration = 500) {
    if (!target?.classList.contains('_slide')) {
        target?.classList.add('_slide');
        if (window.getComputedStyle(target).display === 'none') {
            return this.slideDown(target, duration);
        } else {
            return this.slideUp(target, duration);
        }
    }
}
function isSafari() {
    let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return isSafari;
}
function Android() {
    return navigator.userAgent.match(/Android/i);
}
function BlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
}
function iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}
function Opera() {
    return navigator.userAgent.match(/Opera Mini/i);
}
function Windows() {
    return navigator.userAgent.match(/IEMobile/i);
}
function isMobile() {
    return (Android() || BlackBerry() || iOS() || Opera() || Windows());
}

function toggleDisablePageScroll(state) {
    if (state) {
        const offsetValue = getScrollbarWidth();
        document.documentElement?.classList.add('overflow-hidden');
        document.body?.classList.add('overflow-hidden');
        document.documentElement.style.paddingRight = offsetValue + 'px';
    } else {
        document.documentElement?.classList.remove('overflow-hidden');
        document.body?.classList.remove('overflow-hidden');
        document.documentElement.style.removeProperty('padding-right');
    }
}
function getScrollbarWidth() {
    const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth;

    return lockPaddingValue;
}
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function buildThresholdList(threshold) { //threshold: number
    const array = [];
    for (let i = 1; i <= threshold; i++) {
        array.push(i / threshold);
    }
    return array;
}

// === create Animator usage ===

function createAnimator({ timing, draw, duration, onEnd }) {
    let start = null;
    let pausedAt = null;
    let rafId = null;

    const animate = time => {
        if (!start) start = time;
        if (pausedAt) {
            start += (time - pausedAt);
            pausedAt = null;
        }
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction);
        draw(progress);

        if (timeFraction < 1) {
            rafId = requestAnimationFrame(animate);
        } else {
            onEnd()
            start = null;
        }
    };

    return {
        start: () => {
            if (!rafId) {
                rafId = requestAnimationFrame(animate);
            }
        },
        pause: () => {
            if (rafId) {
                pausedAt = performance.now();
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        },
        reset: () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            start = null;
            pausedAt = null;
        }
    };
};

// const animation = createAnimator({
//     duration: 1000,
//     timing(timeFraction) {
//         return timeFraction; // linear
//     },
//     draw: (progress) => {

//     },
//     onEnd: () => {

//     }
// });

// =/== create Animator usage ===


function truncateString(el, stringLength = 0) {
    let str = el.innerText;
    if (str.length <= stringLength) return;
    el.innerText = str.slice(0, stringLength) + '...';
}

// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".content__column-garden,992,2"
// https://github.com/FreelancerLifeStyle/dynamic_adapt

class DynamicAdapt {
    constructor(type) {
        this.type = type;
    }

    init() {
        this.оbjects = [];
        this.daClassname = '_dynamic_adapt_';
        this.nodes = [...document.querySelectorAll('[data-da]')];

        this.nodes.forEach((node) => {
            const data = node.dataset.da.trim();
            const dataArray = data.split(',');
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
            оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        });

        this.arraySort(this.оbjects);

        this.mediaQueries = this.оbjects
            .map(({
                breakpoint
            }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
            .filter((item, index, self) => self.indexOf(item) === index);

        this.mediaQueries.forEach((media) => {
            const mediaSplit = media.split(',');
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];

            const оbjectsFilter = this.оbjects.filter(
                ({
                    breakpoint
                }) => breakpoint === mediaBreakpoint
            );
            matchMedia.addEventListener('change', () => {
                this.mediaHandler(matchMedia, оbjectsFilter);
            });
            this.mediaHandler(matchMedia, оbjectsFilter);
        });
    }

    mediaHandler(matchMedia, оbjects) {
        if (matchMedia.matches) {
            оbjects.forEach((оbject) => {
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            });
        } else {
            оbjects.forEach(
                ({ parent, element, index }) => {
                    if (element.classList.contains(this.daClassname)) {
                        this.moveBack(parent, element, index);
                    }
                }
            );
        }
    }

    moveTo(place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === 'last' || place >= destination.children.length) {
            destination.append(element);
            return;
        }
        if (place === 'first') {
            destination.prepend(element);
            return;
        }
        destination.children[place].before(element);
    }

    moveBack(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== undefined) {
            parent.children[index].before(element);
        } else {
            parent.append(element);
        }
    }

    indexInParent(parent, element) {
        return [...parent.children].indexOf(element);
    }

    arraySort(arr) {
        if (this.type === 'min') {
            arr.sort((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }
                    if (a.place === 'first' || b.place === 'last') {
                        return -1;
                    }
                    if (a.place === 'last' || b.place === 'first') {
                        return 1;
                    }
                    return a.place - b.place;
                }
                return a.breakpoint - b.breakpoint;
            });
        } else {
            arr.sort((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }
                    if (a.place === 'first' || b.place === 'last') {
                        return 1;
                    }
                    if (a.place === 'last' || b.place === 'first') {
                        return -1;
                    }
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            });
            return;
        }
    }
}

function replaceImageToInlineSvg(query) {
    const images = document.querySelectorAll(query);

    if (images.length) {
        images.forEach(img => {
            img?.classList.remove('img-svg');
            let xhr = new XMLHttpRequest();
            const src = img.getAttribute('data-src') || img.src;
            xhr.open('GET', src);
            xhr.onload = () => {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        let svg = xhr.responseXML.documentElement;
                        svg?.classList.add('_svg', ...Array.from(img.classList));
                        img.parentNode.replaceChild(svg, img);
                    }
                }
            }
            xhr.send(null);
        })
    }
}

function initToggleClassesByClick() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="remove-classes-by-click"]')) {
            const actionEl = e.target.closest('[data-action="remove-classes-by-click"]');

            let targetSelectors = actionEl.getAttribute('data-target').split(',').map(c => c.trim());
            const classes = actionEl.getAttribute('data-classes').split(',').map(c => c.trim());

            if (/_self/.test(targetSelectors)) {
                targetSelectors = targetSelectors.filter(c => c !== '_self');
                actionEl?.classList.remove(...classes);
            };

            if (!targetSelectors.length) return;
            const targetElements = document.querySelectorAll(targetSelectors);
            targetElements.forEach(targetEl => {
                targetEl?.classList.remove(...classes);
            })
        }

        if (e.target.closest('[data-action="add-classes-by-click"]')) {
            const actionEl = e.target.closest('[data-action="add-classes-by-click"]');

            let targetSelectors = actionEl.getAttribute('data-target').split(',').map(c => c.trim());
            const classes = actionEl.getAttribute('data-classes').split(',').map(c => c.trim());

            if (/_self/.test(targetSelectors)) {
                targetSelectors = targetSelectors.filter(c => c !== '_self');
                actionEl?.classList.add(...classes);
            };

            if (!targetSelectors.length) return;
            const targetElements = document.querySelectorAll(targetSelectors);
            targetElements.forEach(targetEl => {
                targetEl?.classList.add(...classes);
            })
        }
    })
}

function initToggleClassByMatchReqExp() {
    const elements = document.querySelectorAll('[data-action="toggle-class-by-match-req-exp"]');
    elements.forEach(el => {
        const input = el.querySelector('input[type="text"], input[type="email"]');
        if (!input) return;

        const classes = el.getAttribute('data-classes').split(',').map(c => c.trim());

        let regExp;
        if (el.getAttribute('data-reg-exp') === 'email') {
            regExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
        } else {
            regExp = new RegExp(el.getAttribute('data-reg-exp'), 'i');
        }

        let targetSelectors = el.getAttribute('data-target').split(',').map(c => c.trim());
        let targetElements = [];

        if (!targetSelectors.length) return;

        if (/_self/.test(targetSelectors)) {
            targetSelectors = targetSelectors.filter(c => c !== '_self');
            targetElements.push(el);
        };

        targetElements.push(...document.querySelectorAll(targetSelectors));

        input.addEventListener('input', (e) => {
            if (regExp.test(e.target.value)) {
                targetElements.forEach(targetEl => {
                    targetEl?.classList.remove(...classes);
                })
            } else {
                targetElements.forEach(targetEl => {
                    targetEl?.classList.add(...classes);
                })
            }
        })
    })
}

function initAddClassByChangeEvent() {
    const elements = document.querySelectorAll('[data-action="add-classes-by-change-event"]');
    elements.forEach(el => {
        const input = el.querySelector('input[type="radio"]', 'input[type="checkbox"]');
        if (!input) return;

        const classes = el.getAttribute('data-classes').split(',').map(c => c.trim());
        let targetSelectors = el.getAttribute('data-target').split(',').map(c => c.trim());

        let targetElements = [];

        if (!targetSelectors.length) return;

        if (/_self/.test(targetSelectors)) {
            targetSelectors = targetSelectors.filter(c => c !== '_self');
            targetElements.push(el);
        };

        targetElements.push(...document.querySelectorAll(targetSelectors));

        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                targetElements.forEach(targetEl => {
                    targetEl?.classList.add(...classes);
                })
            }
        })
    })
}

function initRemoveClassByChangeEvent() {
    const elements = document.querySelectorAll('[data-action="remove-classes-by-change-event"]');
    elements.forEach(el => {
        const input = el.querySelector('input[type="radio"]', 'input[type="checkbox"]');
        if (!input) return;

        const classes = el.getAttribute('data-classes').split(',').map(c => c.trim());
        let targetSelectors = el.getAttribute('data-target').split(',').map(c => c.trim());

        let targetElements = [];

        if (!targetSelectors.length) return;

        if (/_self/.test(targetSelectors)) {
            targetSelectors = targetSelectors.filter(c => c !== '_self');
            targetElements.push(el);
        };

        targetElements.push(...document.querySelectorAll(targetSelectors));

        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                targetElements.forEach(targetEl => {
                    targetEl?.classList.remove(...classes);
                })
            }
        })
    })
}

function initToggleCollapse() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-toggle-collapse]')) {
            e.preventDefault();
            const el = e.target.closest('[data-toggle-collapse]');

            const selector = el.getAttribute('data-toggle-collapse').trim();
            let targetEl;
            if (/next-element-sibling/.test(selector)) {
                targetEl = el.nextElementSibling;
            } else {
                targetEl = document.querySelector(selector);
            }
            if (!targetEl) return;

            if (el?.classList.contains('active')) {
                el?.classList.remove('active');
                slideUp(targetEl, 300);
            } else {
                el?.classList.add('active');
                slideDown(targetEl, 300);
            }
        }
    })
}

function initToggleCollapseByCheckbox() {
    const elements = document.querySelectorAll('[data-action="toggle-collapse-by-checkbox-change-event"]');
    elements.forEach(el => {
        const input = el.querySelector('input[type="checkbox"]');
        if (!input) return;

        let targetSelectors = el.getAttribute('data-target').split(',').map(c => c.trim());

        let targetElements = [];

        if (!targetSelectors.length) return;

        if (/_self/.test(targetSelectors)) {
            targetSelectors = targetSelectors.filter(c => c !== '_self');
            targetElements.push(el);
        };

        targetElements.push(...document.querySelectorAll(targetSelectors));

        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                targetElements.forEach(targetEl => {
                    slideDown(targetEl, 300);
                })
            } else {
                targetElements.forEach(targetEl => {
                    slideUp(targetEl, 300);
                })
            }
        })
    })
}

function initSmoothScrollByAnchors() {
    let anchors = document.querySelectorAll('a[href^="#"]:not([data-action="open-popup"]):not([data-action="page-reload"])');
    if (anchors.length) {
        let header = document.querySelector('[data-header]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href')
                const id = href.length > 1 ? href : null;
                if (!id) return;
                let el = document.querySelector(href);

                if (el) {
                    e.preventDefault();
                    let top = Math.abs(document.body.getBoundingClientRect().top) + el.getBoundingClientRect().top;

                    if (header) {
                        top = top - header.clientHeight;
                    }

                    window.scrollTo({
                        top: top - 20,
                        behavior: 'smooth',
                    })
                }
            })

        })
    }
}

function initAnchorsLinkOffset() {
    let header = document.querySelector('[data-header]');
    const hash = window.location.hash;
    if (hash) {
        const element = document.querySelector(hash);
        if (element) {
            let top = Math.abs(document.body.getBoundingClientRect().top) + element.getBoundingClientRect().top;

            if (header) {
                top = top - header.clientHeight;
            }

            setTimeout(() => {
                window.scrollTo({
                    top: top - 20,
                    behavior: 'smooth',
                })
            }, 0);
        }
    }
}

function initTruncateText() {
    const truncateString = (el, stringLength = 0) => {
        let str = el.innerText.trim();
        if (str.length <= stringLength) return;
        el.innerText = str.slice(0, stringLength) + '...';
    }

    const truncateTextBoxes = document.querySelectorAll('[data-truncate-text]');
    truncateTextBoxes.forEach(truncateTextBox => {
        truncateString(truncateTextBox, +truncateTextBox.getAttribute('data-truncate-text'))
    })
}

function initScrollTopByClick() {
    const elements = document.querySelectorAll('[data-action="scroll-top-by-click"]');
    elements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                // behavior: 'smooth',
            })
        })
    })
}

function initPageReload() {
    const buttons = document.querySelectorAll('[data-action="page-reload"]');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if(btn.href) {
                history.pushState({}, '', btn.href)
            } 
            location.reload();
        })
    })
}

function initHandlerDocumentClick() {
    const cbList = [];

    window.handleDocumentClick = (cb) => {
        cbList.push(cb);
    }

    document.addEventListener('click', (e) => cbList.forEach(cb => cb(e)));
}

window.addEventListener("DOMContentLoaded", () => {
    if (isMobile()) {
        document.body.classList.add('mobile');
    }

    if (iOS()) {
        document.body.classList.add('mobile-ios');
    }

    if (isSafari()) {
        document.body.classList.add('safari');
    }
    initHandlerDocumentClick();
    replaceImageToInlineSvg('.img-svg');
    initSmoothScrollByAnchors();
    initAnchorsLinkOffset();

    // ==== components =====================================================

    // ==== // components =====================================================


    // ==== sections =====================================================
    
    {
    const $portfolioList = document.querySelector('.portfolio__list');
    if ($portfolioList) {
        initLoadMore();

        const initAndStartVideo = ($li) => {
            const src = $li.videoContainer.getAttribute('data-video-src');
            if (!src) return;

            if ($li.player) {
                if($li.player.paused()) {
                    $li.player.play();
                }
            } else {
                $li.loader.classList.add('active');
                const $video = document.createElement('video');
                $video.setAttribute('loop', '');
                $video.setAttribute('muted', 'muted');
                $video.setAttribute('playsinline', 'playsinline');
                $video.setAttribute('disablepictureinpicture', '');
                $video.setAttribute('controlslist', 'nodownload noplaybackrate');
                $video.setAttribute('type', 'video/mp4');

                $li.videoContainer.append($video);

                let player = videojs($video);
                player.src({
                    type: 'video/mp4',
                    src: src
                });
                player.ready(() => {
                    player.play()
                    $li.player = player;
                });

                player.on('playing', function () {
                    $li.loader.classList.remove('active');
                });
            }
        }

        function initCard($li) {
            const $card = $li.querySelector('[data-portfolio-card]');
            const $cardBody = $card.querySelector('.portfolio-card__body');
            const $imageContainer = $card.querySelector('.portfolio-card__poster');
            const $videoContainer = $card.querySelector('.portfolio-card__video');
            const $loader = $card.querySelector('.portfolio-card__loader');
            $li.videoContainer = $videoContainer;
            $li.loader = $loader;
            $li.imageContainer = $imageContainer;

            const $img = document.createElement('img');
            $img.onload = () => {
                $card.classList.add('_img-loaded');
                $loader.classList.remove('active');
                $imageContainer.style.setProperty('opacity', '1');
            }
            $img.src = $imageContainer.getAttribute('data-img-src');
            $imageContainer.append($img);

            let timeId = null;

            if (!isMobile()) {
                $cardBody.addEventListener('mouseenter', () => {
                    timeId = setTimeout(() => {
                        initAndStartVideo($li);
                    }, 500);
                })
                $cardBody.addEventListener('mouseleave', () => {
                    clearTimeout(timeId);
                    $li?.player?.pause();
                })
            }
        }

        async function initLoadMore() {
            const $loadMoreTrigger = document.querySelector('[data-load-more-trigger]');
            if (!$loadMoreTrigger) return;

            const res = await fetch('./portfolioData.json', {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const { data } = await res.json();

            addCards(data, $portfolioList);

            const options = {
                root: null,
                rootMargin: "0px 0px 50% 0px",
                threshold: 1.0,
            };

            const callback = function (entries, observer) {
                if (entries[0].isIntersecting) {
                    addCards(data, $portfolioList);
                }
            };
            const observer = new IntersectionObserver(callback, options);

            observer.observe($loadMoreTrigger)
        }

        function addCards(data, $container) {
            const loadedItemsCount = $container.children.length;
            if (loadedItemsCount === data.length) return;

            const loadDataItems = data.slice(loadedItemsCount, loadedItemsCount + 4);

            loadDataItems.forEach(data => {
                const $li = document.createElement('li');
                $li.insertAdjacentHTML('beforeend', `
                    <div class="portfolio-card" data-portfolio-card >
                        <a href="${data.linkToHome}" target="_blank" class="portfolio-card__body">
                            <div class="portfolio-card__poster" data-img-src="${data.imageSrc}"></div>
                            <div class="portfolio-card__video" data-video-src="${data.videoSrc}"></div>
                            <div class="portfolio-card__loader active">
                                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                            </div>
                        </a>
                        <div class="portfolio-card__footer">
                            <div class="portfolio-card__stack-list">
                                <span>Stack:</span>
                                ${data.stackList.map(i => `<span>${i}</span>`).join('')}
                            </div>

                            ${data.linkToAllPages
                        ? `
                                    <a href="${data.linkToAllPages}" target="_blank" class="portfolio-card__link-to-all">
                                        Show all pages
                                    </a>
                                `
                        : ""
                    }
                            ${data.linkToGitHub
                        ? `
                                    <a href="${data.linkToGitHub}" target="_blank" class="portfolio-card__link-to-all">
                                        GitHub
                                    </a>
                                `
                        : ""
                    }
                            ${data.linkToLiveSite
                        ? `
                                    <a href="${data.linkToLiveSite}" target="_blank" class="portfolio-card__link-to-all">
                                        Live site
                                    </a>
                                `
                        : ""
                    }
                        </div>
                    </div>
                `);
                $container.append($li);
                initCard($li);
            })
        }

        const calculateCenterZone = () => {
            const centerScreen = window.innerHeight / 2;
            const upperBound = centerScreen - (window.innerHeight * 0.25);
            const lowerBound = centerScreen + (window.innerHeight * 0.25);
            return { upperBound, lowerBound };
        };

        function checkVideoVisibility() {
            const { upperBound, lowerBound } = calculateCenterZone();
            let $closestVideoContainer = null;
            let closestDistance = Infinity;

            for (let index = 0; index < $portfolioList.children.length; index++) {
                const $videoContainer = $portfolioList.children[index];
                
                const rect = $videoContainer.getBoundingClientRect();
                const videoCenter = rect.top + rect.height / 2;

                if (videoCenter >= upperBound && videoCenter <= lowerBound) {
                    const distanceToCenter = Math.abs(videoCenter - (window.innerHeight / 2));

                    if (distanceToCenter < closestDistance) {
                        closestDistance = distanceToCenter;
                        $closestVideoContainer = $videoContainer;
                    }
                }
            }


            for (let index = 0; index < $portfolioList.children.length; index++) {
                const $videoContainer = $portfolioList.children[index];
                
                if ($videoContainer === $closestVideoContainer) {
                    if(!$videoContainer.timeId) {
                        $videoContainer.timeId = setTimeout(() => {
                            initAndStartVideo($videoContainer);
                            $videoContainer?.imageContainer?.classList.add('hide');
                        }, 800);
                    }
                } else {
                    clearTimeout($videoContainer.timeId);
                    $videoContainer.timeId = null;
                    $videoContainer?.player?.pause();
                    $videoContainer?.imageContainer?.classList.remove('hide');
                }
            }            
        }

        const scrollHandler = throttle(() => {
            checkVideoVisibility();
        }, 200);

        if (isMobile()) {
            window.addEventListener('scroll', scrollHandler);
        }
    }
}
    // ==== // sections =====================================================

    // ==== libs =====================================================
    {
    const spoilers = document.querySelectorAll('[data-spoiler]');
    if (spoilers.length) {
        spoilers.forEach(spoiler => {
            const swiper = spoiler.closest('[data-scroll-container]')?.swiper;
            let isOneActiveItem = spoiler.dataset.spoiler.trim() === 'one' ? true : false;
            let triggers = spoiler.querySelectorAll('[data-spoiler-trigger]');
            if (triggers.length) {
                triggers.forEach(trigger => {
                    let parent = trigger.parentElement;
                    let content = trigger.nextElementSibling;

                    // init
                    if (trigger.classList.contains('active')) {
                        content.style.display = 'block';
                        parent.classList.add('active');
                    }

                    trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        parent.classList.toggle('active');
                        trigger.classList.toggle('active');
                        content && slideToggle(content, 300);
                        swiper && setTimeout(() => swiper.update(), 300);

                        if (isOneActiveItem) {
                            triggers.forEach(i => {
                                if (i === trigger) return;

                                let parent = i.parentElement;
                                let content = i.nextElementSibling;

                                parent.classList.remove('active');
                                i.classList.remove('active');
                                content && slideUp(content, 300);
                                swiper && setTimeout(() => swiper.update(), 300);
                            })
                        }
                    })
                })
            }
        })
    }

    const radioSpoilers = document.querySelectorAll('[data-radio-spoiler]');
    radioSpoilers.forEach(radioSpoiler => {
        let triggers = Array.from(radioSpoiler.querySelectorAll('[data-radio-trigger]'))
            .map(el => {
                return {
                    wrapper: el,
                    input: el.querySelector('input[type="radio"]')
                }
            });
        
        triggers.forEach(trigger => trigger.input?.checked && trigger.wrapper.nextElementSibling.style.setProperty('display', 'block'));

        radioSpoiler.addEventListener('change', (e) => {
            const isEventFromTrigger = triggers.find(t => t.input === e.target);
            if(isEventFromTrigger) {
                triggers.forEach(trigger => {
                    if(trigger.input?.checked) {
                        slideDown(trigger.wrapper.nextElementSibling, 300);
                    } else {
                        slideUp(trigger.wrapper.nextElementSibling, 300);
                    }
                })
            }
        })
    })
}
    // ==== // libs =====================================================


    document.body.classList.add('page-loaded');

    // let animationId;

    // function smoothScroll() {
    //     document.documentElement.style.setProperty('scroll-behavior', 'auto');

    //     function scroll() {
    //         window.scrollBy(0, 6);
            
    //         animationId = requestAnimationFrame(scroll); 
    //     }

    //     scroll();
    // }

    // window.addEventListener('keydown', (e) => {
    //     if (e.key === 'ArrowDown') {
    //         e.preventDefault();
    //         smoothScroll();
    //     }

    //     if(e.key === 'ArrowUp') {
    //         e.preventDefault();
    //         cancelAnimationFrame(animationId);
    //         animationId = null; 
    //     }
    // });
}); 
