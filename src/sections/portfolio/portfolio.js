{
    const $portfolioList = document.querySelector('.portfolio__list');
    if ($portfolioList) {

        initLoadMore();

        function initCard($li) {
            const $card = $li.querySelector('[data-portfolio-card]');
            const $cardBody = $card.querySelector('.portfolio-card__body');
            const $imageContainer = $card.querySelector('.portfolio-card__poster');
            const $videoContainer = $card.querySelector('.portfolio-card__video');
            const $loader = $card.querySelector('.portfolio-card__loader');

            const $img = document.createElement('img');
            $img.onload = () => {
                $card.classList.add('_img-loaded');
                $loader.classList.remove('active');
                $imageContainer.style.setProperty('opacity', '1');
            }
            $img.src = $imageContainer.getAttribute('data-img-src');
            $imageContainer.append($img);

            let timeId = null;
            let player = null;

            const initAndStartVideo = () => {
                const src = $videoContainer.getAttribute('data-video-src');
                if (!src) return;

                if (player) {
                    player.play();
                } else {
                    $loader.classList.add('active');
                    const $video = document.createElement('video');
                    $video.setAttribute('loop', '');
                    $video.setAttribute('muted', 'muted');
                    $video.setAttribute('playsinline', 'playsinline');
                    $video.setAttribute('disablepictureinpicture', '');
                    $video.setAttribute('controlslist', 'nodownload noplaybackrate');
                    $video.setAttribute('type', 'video/mp4');

                    $videoContainer.append($video);

                    player = videojs($video);
                    player.src({
                        type: 'video/mp4',
                        src: src
                    });
                    player.ready(() => {
                        player.play()
                        $videoContainer.player = player;
                    });

                    player.on('playing', function () {
                        $loader.classList.remove('active');
                    });
                }
            }

            if (!isMobile()) {
                $cardBody.addEventListener('mouseenter', () => {
                    timeId = setTimeout(() => {
                        initAndStartVideo();
                    }, 500);
                })
                $cardBody.addEventListener('mouseleave', () => {
                    clearTimeout(timeId);
                    $videoContainer?.player?.pause();
                })
            } else {
                const options = {
                    root: null,
                    rootMargin: "49% 0px -49% 0px",
                    threshold: buildThresholdList(20),
                };

                const callback = function (entries, observer) {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const rect = entry.target.getBoundingClientRect();
                            const screenCenter = window.innerHeight / 2;

                            const distanceTop = screenCenter - rect.top;
                            const distanceBottom = rect.bottom - screenCenter;

                            const elementHeight = rect.height;

                            let progress;

                            if (distanceTop >= 0 && distanceBottom >= 0) {
                                progress = (distanceTop / elementHeight) * 100;
                            } else if (distanceTop < 0) {
                                progress = 0;
                            } else {
                                progress = 100;
                            }

                            if (progress.toFixed(2) > 20 && progress.toFixed(2) < 80) {

                                if ($videoContainer?.player && !$videoContainer?.player?.paused()) return;

                                if (timeId) return;

                                timeId = setTimeout(() => {
                                    initAndStartVideo();
                                    $imageContainer.classList.add('hide');
                                }, 600);

                            } else {
                                clearTimeout(timeId);
                                timeId = null;
                                $videoContainer?.player?.pause();
                                $imageContainer.classList.remove('hide');
                            }
                        }
                    });
                };

                const observer = new IntersectionObserver(callback, options);
                observer.observe($li)

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
    }
}