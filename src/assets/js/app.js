@@include('./utils.js')
@@include('./scripts.js')

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
    @@include('../../sections/header/header.js')
    @@include('../../sections/portfolio/portfolio.js')
    // ==== // sections =====================================================

    // ==== libs =====================================================
    @@include('../../libs/spoiler/spoiler.js')
    // ==== // libs =====================================================


    document.body.classList.add('page-loaded');
}); 
