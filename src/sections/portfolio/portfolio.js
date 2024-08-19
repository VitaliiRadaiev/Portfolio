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