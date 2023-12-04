// copied from minimal-mistakes theme.
jQuery(document).ready(function ($) {
    // Magnific-Popup options
    $(".gallery-popup").magnificPopup({
        delegate: 'a',
        type: "image",
        tLoading: "Loading image #%curr%...",
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            tError: '<a href="%url%">Image #%curr%</a> could not be loaded.'
        },
        // removalDelay: 500, // Delay in milliseconds before popup is removed
        // Class that is added to body when popup is open.
        // make it unique to apply your CSS animations just to this exact popup
        mainClass: "mfp-zoom-in",
        callbacks: {
            beforeOpen: function () {
                // just a hack that adds mfp-anim class to markup
                this.st.image.markup = this.st.image.markup.replace(
                    "mfp-figure",
                    "mfp-figure mfp-with-anim"
                );
            }
        },
        closeOnContentClick: true,
        midClick: true, // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });

    $(".single-image-popup").magnificPopup({
        delegate: 'a',
        type: "image",
        tLoading: "Loading image #%curr%...",
        image: {
            tError: '<a href="%url%">Image #%curr%</a> could not be loaded.'
        },
        // removalDelay: 500, // Delay in milliseconds before popup is removed
        // Class that is added to body when popup is open.
        // make it unique to apply your CSS animations just to this exact popup
        mainClass: "mfp-zoom-in",
        callbacks: {
            beforeOpen: function () {
                // just a hack that adds mfp-anim class to markup
                this.st.image.markup = this.st.image.markup.replace(
                    "mfp-figure",
                    "mfp-figure mfp-with-anim"
                );
            }
        },
        closeOnContentClick: true,
        midClick: true, // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
});