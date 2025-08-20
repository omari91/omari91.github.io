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

    // Mobile Navigation Handler
    let mobileMenuOpen = false;
    
    function toggleMobileMenu() {
        const $toggler = $('.navbar-toggler');
        const $collapse = $('.navbar-collapse');
        const $overlay = $('.mobile-menu-overlay');
        
        if (!mobileMenuOpen) {
            // Open menu
            mobileMenuOpen = true;
            $('body').addClass('mobile-menu-open');
            
            // Create overlay if it doesn't exist
            if ($overlay.length === 0) {
                $('body').append('<div class="mobile-menu-overlay"></div>');
            }
            
            $collapse.addClass('show');
            $('.mobile-menu-overlay').addClass('show');
            $toggler.removeClass('collapsed').attr('aria-expanded', 'true');
            
        } else {
            // Close menu
            closeMobileMenu();
        }
    }
    
    function closeMobileMenu() {
        if (mobileMenuOpen) {
            mobileMenuOpen = false;
            $('body').removeClass('mobile-menu-open');
            $('.navbar-collapse').removeClass('show');
            $('.mobile-menu-overlay').removeClass('show');
            $('.navbar-toggler').addClass('collapsed').attr('aria-expanded', 'false');
            
            // Remove overlay after animation
            setTimeout(() => {
                $('.mobile-menu-overlay').remove();
            }, 300);
        }
    }
    
    // Navbar toggler click handler
    $('.navbar-toggler').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when clicking nav links
    $('.navbar-nav .nav-link').on('click', function(e) {
        if ($(window).width() <= 991) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking overlay
    $(document).on('click', '.mobile-menu-overlay', function() {
        closeMobileMenu();
    });
    
    // Close menu when clicking outside navbar
    $(document).on('click', function(e) {
        if (mobileMenuOpen && !$(e.target).closest('.navbar').length) {
            closeMobileMenu();
        }
    });
    
    // Prevent menu from closing when clicking inside navbar-collapse
    $('.navbar-collapse').on('click', function(e) {
        e.stopPropagation();
    });
    
    // Handle window resize
    $(window).on('resize', function() {
        if ($(window).width() > 991 && mobileMenuOpen) {
            closeMobileMenu();
        }
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
