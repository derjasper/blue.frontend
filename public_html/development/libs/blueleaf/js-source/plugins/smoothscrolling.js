(function ($) {
    Plugins.fn.smoothscrolling = function (time) {
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("smoothscrolling")!=undefined) return;
                
                var listener = function(event) {
                    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                        var lehash=this.hash;
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                        if (target.length) {
                            console.log(target.offset().top);
                            $('html,body').animate({
                                scrollTop: target.offset().top
                            }, time,"swing",function() {
                                location.hash=lehash;
                            });
                            event.preventDefault();
                        }
                        else if(this.hash=="") {
                            $('html,body').animate({
                                scrollTop: 0
                            }, time,"swing",function() {
                                location.hash=lehash;
                            });
                            event.preventDefault();
                        }
                    }
                };
                
                $(elm).data("smoothscrolling",listener);
                $(elm).on("click",listener);
            },
            disable: function () {
                var listener = $(elm).data("smoothscrolling")
                if (listener==undefined) return;
                $(elm).off("click",listener);
                $(elm).removeData("smoothscrolling");
            }
        }
    }
}(jQuery));