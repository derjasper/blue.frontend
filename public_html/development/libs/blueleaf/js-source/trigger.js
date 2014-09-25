(function($) {
    var trigger=new Object();
    var actions=new Object();
    
    var triggerClass = function(target,class_name,mode) {
        if (target.hasClass(class_name) && (mode=="toggle" || mode=="off")) {
            target.removeClass(class_name);
            target.addClass(class_name+"_off");
        }
        else if (mode=="toggle" || mode=="on") {
            target.removeClass(class_name+"_off");
            target.addClass(class_name);
        }
    };
    
    var handleEvent = function(target,trigger_class,trigger_mode,priority,eventID) {
        if (actions[eventID]==undefined) actions[eventID] = new Array();
        
        var new_obj={
            target:target,
            trigger_class:trigger_class,
            trigger_mode:trigger_mode,
            priority:priority
        };        
        
        actions[eventID].push({target:"trololol"});
        
        for (var i=actions[eventID].length-1; i>=0; i--) {
            if (i!=0 && new_obj.priority<actions[eventID][i-1].priority) {
                actions[eventID][i]=actions[eventID][i-1];
            }
            else {
                actions[eventID][i]=new_obj;
                break;
            }
        }
    }
    
    $(document).on("click mouseover mouseout",function(event) {
        var eventID=event.target.id+"-"+event.type;
                
        if (actions[eventID]!=undefined) {            
            for (var i=0;i<actions[eventID].length;i++) {
                triggerClass($(actions[eventID][i].target),actions[eventID][i].trigger_class,actions[eventID][i].trigger_mode);
            }
            
            delete actions[eventID];
        }
    });
    
    $.fn.trigger_set = function(trigger_class,mode) {
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            triggerClass($(elm),trigger_class,mode);
        }
                
        return this;
    }

    $.fn.trigger_enable = function(type,target_expr,trigger_class,trigger_mode,priority) { // type: click,mouseout,mouseover; trigger_mode: on, off, toggle
        _fn = function(elm) {
            if (elm.data("trigger-"+type+"-"+target_expr+"-"+trigger_class)) return;
            elm.data("trigger-"+type+"-"+target_expr+"-"+trigger_class,true);
                        
            elm.uniqueId();
                                    
            if (trigger[elm.attr('id')]==undefined) trigger[elm.attr('id')]=new Object();
            if (trigger[elm.attr('id')][type]==undefined) trigger[elm.attr('id')][type]=new Object();
            if (trigger[elm.attr('id')][type][target_expr]==undefined) trigger[elm.attr('id')][type][target_expr]=new Object();
            trigger[elm.attr('id')][type][target_expr][trigger_class]={trigger_class: trigger_class, trigger_mode: trigger_mode, priority: priority};

            // {this}
            var target=target_expr.replace(/{this}/g, "#"+elm.attr('id'));
            
            // {parent-x}
            var parent_result;
            while((parent_result = /{parent-([0-9]+)}/g.exec(target))!=null) {
                var tmp_obj=$("#"+elm.attr('id'));
                for (var i=0; i<parent_result[1]; i++) {
                    tmp_obj=tmp_obj.parent();
                }
                tmp_obj.uniqueId();
                
                var target=target.replace(new RegExp("{parent-"+parent_result[1]+"}"), "#"+tmp_obj.attr('id'));          
            }
            
            // {attr-x}
            var attr_result;
            while((attr_result = /{attr-([0-9a-zA-Z_\-]+)}/g.exec(target))!=null) {
                var target=target.replace(new RegExp("{attr-"+attr_result[1]+"}"), elm.attr(attr_result[1]));          
            }
                                    
            elm.data("trigger-function-"+type+"-"+target_expr+"-"+trigger_class,function(event) {
                handleEvent(target,trigger_class,trigger_mode,priority,event.target.id+"-"+event.type);
                return true;
            });
            
            elm.on(type,elm.data("trigger-function-"+type+"-"+target_expr+"-"+trigger_class));
        }
    
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
                
        return this;
    };
    
    $.fn.trigger_disable = function(type,target_expr,trigger_class) {
        _fn = function(elm) {
            if (!elm.data("trigger-"+type+"-"+target_expr+"-"+trigger_class)) return;
            elm.removeData("trigger-"+type+"-"+target_expr+"-"+trigger_class);
            
            elm.off(type,elm.data("trigger-function-"+type+"-"+target_expr+"-"+trigger_class));
            elm.removeData("trigger-function-"+type+"-"+target_expr+"-"+trigger_class);
            
            delete trigger[elm.attr('id')][type][target_expr][target_expr][trigger_class];
            if (Object.keys(trigger[elm.attr('id')][type][target_expr]).length==0) {
                delete trigger[elm.attr('id')][type];
            }
            if (Object.keys(trigger[elm.attr('id')][type]).length==0) {
                delete trigger[elm.attr('id')][type];
            }
            if (Object.keys(trigger[elm.attr('id')]).length==0) {
                delete trigger[elm.attr('id')];
            }
        }
        
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        
        return this;
    };
})(jQuery);