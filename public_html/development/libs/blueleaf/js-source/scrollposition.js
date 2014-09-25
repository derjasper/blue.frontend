(function($) {
    var groups=new Object();
    var groupsCurrent=new Object();
    var groupsOrder=new Object();
    
    var recalc = function() {
        $.each(groupsOrder,function(key){
            groupsOrder[key].sort(function(a,b){
                return $("#"+a).offset().top-$("#"+b).offset().top;
            });
        });
        tick();
    };
    var tick = function() {
        var scroll = $(window).scrollTop();
        $.each(groups,function(key,value){
            var newCurrent=null;
            $.each(value,function(elm) {
                var offset = ($("#"+elm).scrollareaoffset()) ? 0 : blueleaf.scrollarea.offset.top;
                if (scroll+offset >= $("#"+elm).offset().top-1) {
                    newCurrent=elm;
                }
                else {
                    return false;
                }
            });
            
            if (newCurrent != groupsCurrent[key]) {
                if (groupsCurrent[key]!=null && groupsCurrent[key]!= undefined) {
                    $.each(value[groupsCurrent[key]],function(target,clss) {
                        if (target!="_null") $(target).removeClass(clss.scrolled_class);
                    });
                }
                
                if (newCurrent!=null) {
                    $.each(value[newCurrent],function(target,clss) {
                        if (target!="_null") $(target).addClass(clss.scrolled_class);
                    });
                }
                
                groupsCurrent[key]=newCurrent;
            }
        });
    };
    
    $(window).on("touchmove", tick);
    $(window).on("scroll", tick);
    $(window).on("resize", recalc);  
    
    
    $.fn.scrollposition_enable = function(target_expr,group,scrolled_class) {
        _fn = function(elm) {
            if (elm.data("scrollposition-"+group+"-"+target)) return;
            elm.data("scrollposition-"+group+"-"+target,true);
                        
            elm.uniqueId();
            
            var target=target_expr;
            if (target=="_link") {
                target="a[href=#"+elm.attr("name")+"]";
            }
                        
            if (groups[group]==undefined) groups[group]=new Object();
            if (groups[group][elm.attr('id')]==undefined) groups[group][elm.attr('id')]=new Object();
            groups[group][elm.attr('id')][target]={scrolled_class: scrolled_class};
            
            if (groupsOrder[group]==undefined) groupsOrder[group]=new Array();
            groupsOrder[group].push(elm.attr('id'));
        }
    
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        
        recalc();
        
        return this;
    };
    
    $.fn.scrollposition_disable = function(target_expr,group) {
        _fn = function(elm) {
            if (!elm.data("scrollposition-"+group+"-"+target)) return;
            elm.removeData("scrollposition-"+group+"-"+target);
            
            var target=target_expr;
            if (target=="_link") {
                target="a[href=#"+elm.attr("name")+"]";
            }
            
            if (target!="_null") $(target).removeClass(groups[group][elm.attr('id')][target].scrolled_class);
            
            delete groups[group][elm.attr('id')][target];
            
            if (Object.keys(groups[group][elm.attr('id')]).length==0) {
                delete groups[group][elm.attr('id')];
                groupsOrder[group].splice($.inArray(elm.attr('id'), groupsOrder[group]),1);
            }
        }
        
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        
        recalc();
        
        return this;
    };
})(jQuery);