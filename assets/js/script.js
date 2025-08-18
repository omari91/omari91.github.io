/*!
=========================================================
* Meyawo Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com
=========================================================
*/

// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link[href^='#']").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });

    // Bootstrap navbar collapse for mobile
    $('.navbar-toggler').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('data-target');
        $(target).toggleClass('show');
        $(this).toggleClass('collapsed');
        $(this).attr('aria-expanded', function(i, attr) {
            return attr === 'true' ? 'false' : 'true';
        });
    });

    // Close mobile menu when clicking on nav links
    $('.navbar-nav .nav-link').on('click', function(){
        $('.navbar-collapse').removeClass('show');
        $('.navbar-toggler').addClass('collapsed');
        $('.navbar-toggler').attr('aria-expanded', 'false');
    });
    
    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.navbar').length) {
            $('.navbar-collapse').removeClass('show');
            $('.navbar-toggler').addClass('collapsed');
            $('.navbar-toggler').attr('aria-expanded', 'false');
        }
    });
    
    // Prevent navbar collapse from closing when clicking inside
    $('.navbar-collapse').on('click', function(e) {
        e.stopPropagation();
    });

    // fade-in-on-scroll animation
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade-in-on-scroll").forEach(el => {
        observer.observe(el);
    });
});
