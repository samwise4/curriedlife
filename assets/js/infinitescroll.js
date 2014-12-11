/* Adapted for optional enabling from https://github.com/z0pe/ghost-blog-infinite-scroll */
/* Enable infinite scroll */
var page;
var waitingForResponse = false;
var resetInfiniteScroll = function() {
    page = 2;
    waitingForResponse = false;
}

var debounceMasonry = debounce(function() {
        var msnryElement = document.querySelector('.post-preview-container');
        if (msnryElement != null) {
            var msnry = Masonry.data(msnryElement);
            msnry.layout();
        }
    }, 500);

var removeTrailingSlashes = function(url) {
    return url.replace(/\/+$/, "");
};

var enableInfiniteScroll = function() {
    resetInfiniteScroll();

     function scrollInfinite() {
         //console.log('scroll fired - top: ' + $(window).scrollTop() + ', docheight: ' + $(document).height());

         // Ensure we don't mess up the order of posts by making multiple Ajax requests simultaneously
         if (waitingForResponse) {
             return;
         }
         if($(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
             //console.log('ready to scroll');
             // Re-layout the Masonry if we scrolled recently
             debounceMasonry();

             if (page <= max_pages) {
                 //TODO: Insert loading spinner
                 var url_blog = removeTrailingSlashes(window.location.toString());
                 //console.log(url_blog);
                 //url_blog=window.location;
                 var pageToLoad = page;
                 waitingForResponse = true;

                 //console.log('getting page ' + pageToLoad);
                 // Show loading spinner
                 $('#infiniteScrollSpinner').addClass('showSpinner');

                 $.get((url_blog.toString() +'/page/'+pageToLoad+'/'),
                 function(content) {
                     $('.pagination').hide();
                     // .content-wrapper > #main-content > .post-preview-container > .mason-block
                     var newElements = $(content).children('#main-content').children('.post-preview-container').children('.mason-block');

                     // Get masonry instance
                     var msnry = Masonry.data(document.querySelector('.post-preview-container'));

                     // The masonry instance may be gone if the Get finished after a page transition
                     if (msnry != null) {
                         $('.post-preview-container').append(newElements);

                         msnry.appended(newElements);

                         flowtypePostPreview(newElements);

                         page = page + 1;

                         // Re-layout the Masonry if we scrolled recently
                         debounceMasonry();
                     }

                     waitingForResponse = false;

                     // Hide loading spinner
                     $('#infiniteScrollSpinner').removeClass('showSpinner');

                     // Upon successful loading, check to see if there's still more space on the page
                     scrollInfinite();
                 });
             }
         }
     }

     $(window).scroll(scrollInfinite);
     $(window).resize(scrollInfinite);
}