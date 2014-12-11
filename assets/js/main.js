/**
 * Created by Sam on 5/27/14.
 */

var sidebarLoaded = false;
var tocVisibleHeader = '';
var ajaxLoad = false;

/* Binding onload() code to a custom event in case we need to manually call it */
$(document).bind('pageinit', function(){
    $('body').removeClass('no-js');

    $('.js-masonry').masonry();

    var msnryElement = document.querySelector('.featuredtags-container');
    if (msnryElement != null) {
        var msnry = Masonry.data(msnryElement);
        msnry.layout();
    }

    // article image zoom on click
    $('.post-content img').each(function() {
        var imageSource = $(this).attr('src');
        $(this).wrap('<a class="fancyimage" data-fancybox-group="gallery" title="" href="' + imageSource + '"></a>');
    });

    $('a.fancyimage').fancybox();

    /* Trigger events that have effect on the page style */
    $(window).trigger('scroll');
    $(window).trigger('resize');
});

var flowtypeMainHeader = function(elements) {
    if ($(elements).length > 0) {
        $(elements).flowtype({
            minFont : 12,
            maxFont : 18
        });
    }
};

var flowtypePostPreview = function(elements) {
    if ($(elements).length > 0) {
        $(elements).flowtype({
            fontRatio : 22,
            minFont: 10,
            maxFont: 18
        });
    }
};

var flowtypeTagHeader = function(elements) {
    if ($(elements).length > 0) {
        $(elements).flowtype({
            fontRatio : 50,
            minFont : 10,
            maxFont : 18
        });
    }
};

var flowtypePostContent = function(elements) {
    if ($(elements).length > 0) {
        $(elements).flowtype({
            fontRatio : 30,
            minFont : 12,
            maxFont : 18
        });
    }
};

/* BEHOLD
 * The big, phat document.ready()
 * Tremble, actually good coders, and despair :(
 */
$(document).ready(function() {
    console.log('ready!');

    /* Ajaxify all in-site links and navigation */
    $('#content-wrapper').ajaxify({
        selector : 'a.ajax',
        requestDelay : 400,
        previewoff : true,
        memoryoff : false,
        turbo : true
    });

    /*$(window).on('pronto.render', initPage)
     .on('pronto.load', destroyPage)
     .on('pronto.request', transitionPage);
     */
    $(window).on('pronto.request', transitionPage)
        .on('pronto.render', initPage)
        .on('pronto.load', endTransitionPage);

    function transitionPage(e)
    {
        $('#main-content').stop().animate({opacity:0},400);
        $('#pageTransitionSpinner').addClass('showSpinner');
    }

    function endTransitionPage(e) {
        $('#pageTransitionSpinner').removeClass('showSpinner');
        ajaxLoad = true;
    }

    function initPage(e)
    {
        if (ajaxLoad) {
            $("html, body").animate({ scrollTop: 0 }, "slow");
            ga('send', 'pageview', {'page': location.pathname,'title': document.title});
            ajaxLoad = false;
        }
        $('#main-content').stop().animate({opacity:1}, 1000);

        function createTableOfContents() {
            if ($('#tableOfContents').length > 0) {
                var tocHtml = '<ul>';
                tocHtml += '<li><a href="#body-top">Top</a></li>';

                var headerSelector = '.post-content h1, .post-content h2, .post-content h3';

                $(headerSelector).each(function() {
                    if ($(this).attr("id") !== "") {
                        tocHtml += '<li><a id="toc-' + $(this).attr("id") + '" href="#' + $(this).attr("id") + '">' + $(this).text() + '</a></li>';
                    }
                });
                tocHtml += '<li><a href="#disqus_thread"><i class="fa fa-comment"></i> Comments</a></li>'
                tocHtml += '</ul>';
                $('#tableOfContents').append(tocHtml);
                $('#tableOfContentsToggle').click(function(e) {
                    $('#tableOfContents ul').toggle('fast');
                    e.preventDefault();
                });
                $('#tableOfContents').removeClass('no-js');

                function setHighlightHeader() {
                    $('#tableOfContents li a').removeClass('toc-highlight');
                    $(tocVisibleHeader).addClass('toc-highlight');
                }

                /* Enable scrollspy for TOC tracking */
                $(headerSelector).on('scrollSpy:enter', function() {
                    tocVisibleHeader = '#toc-' + $(this).attr('id');
                    setHighlightHeader();
                });

                $(headerSelector).on('scrollSpy:exit', function() {
                    // Check if element has scrolled past the bottom, so whatever it heads is also no longer visible
                    if ('#toc-' + $(this).attr('id') === tocVisibleHeader) {
                        var docViewTop = $(window).scrollTop();
                        var docViewBottom = docViewTop + $(window).height();
                        var elemTop = $(this).offset().top;
                        if (elemTop > docViewBottom) {
                            // Select the previous header link
                            var previousElem = $(tocVisibleHeader).parent().prev().find('a');
                            if (previousElem.length > 0) {
                                tocVisibleHeader = '#' + previousElem.attr('id');
                                setHighlightHeader();
                            }
                        }
                    }
                });

                $(headerSelector).scrollSpy();

                /* Add smooth scrolling to all same-page navigation links */
                $('#tableOfContents a').smoothScroll();
            }
        }
        createTableOfContents();

        flowtypePostPreview('.mason-block');
        flowtypeTagHeader('.tag-archive-header');
        flowtypePostContent('.post');
        flowtypePostContent('.page-about');
        resetInfiniteScroll();
        $(document).trigger('pageinit');
    }

    /* Use URL information to decide whether or not enable infinite post scrolling */
    //if (window.location.pathname === '/') {
        enableInfiniteScroll();
    //}

    /* Resize fonts to keep good typography on any screen size */
    /*$('body').flowtype({
     minimum : 500,
     maximum : 1200,
     minFont   : 12,
     maxFont   : 20,
     fontRatio : 30
     });*/

    flowtypeMainHeader('#navigation-wrapper');

    /*
    $('#main-content').flowtype({
        minFont : 12,
        maxFont : 20,
        maximum : (1200 - 300)
    });
    */

    /* Experimental recent-posts sidebar */
    /* Only loads when the screen is wide enough */
    /*
    $(window).resize(function() {
        if (!sidebarLoaded) {
            if ($(window).width() > 1200) {
                sidebarLoaded = true;
                //TODO: Insert loading spinner
                //TODO: We can load more pages if we need to, based on infinite scroll
                //TODO: Standardize url
                var url_blog = 'http://localhost:2368';
                $.get((url_blog +'/'),
                    function(content) {
                        $('#sidebar').append($(content).children('.content-wide').children('.post-preview-container').children('.mason-block'));
                    });
            }
        }
    });
    */

    /* Experimental mobile header menu fixes in place on scroll */
    $(window).scroll(function() {
        var scrollPos = $(window).scrollTop();
        if (scrollPos > 70) {
            $('#navigation-wrapper').addClass('scrolling-fixed');
        } else {
            $('#navigation-wrapper').removeClass('scrolling-fixed');
        }
    });


    /* Remove click delay from some mobile browsers */
    FastClick.attach(document.body);

    initPage(null);
});
