(function ($,Plugins) {
    Plugins.fn.smoothscrolling = function (args) {
        var elm = this;
        
        var listener = function(event) {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var lehash=this.hash;
                if (lehash != "") {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, args.time,"swing",function() {
                            location.hash=lehash;
                        });
                        event.preventDefault();
                    }
                }
                else {
                    $('html,body').animate({
                        scrollTop: 0
                    }, args.time,"swing",function() {
                        location.hash=lehash;
                    });
                    event.preventDefault();
                }
            }
        };
        
        return {
            enable: function () {
                $(elm).on("click",listener);
            },
            disable: function () {
                $(elm).off("click",listener);
            }
        }
    }
    
    Plugins.fn.smoothscrolling.args = {
        time: 500
    };
    Plugins.fn.smoothscrolling.key = [];
}(jQuery,blue.Plugins));
