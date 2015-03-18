(function ($) {
    var trigger_actions=new Object();
    
    $(document).on("click mouseover mouseout",function(event) {
        var eventID=event.target.id+"-"+event.type;
                        
        if (trigger_actions[eventID]!=undefined) {            
            for (var i=0;i<trigger_actions[eventID].length;i++) {
                var a = trigger_actions[eventID][i];
                
                var val=Variables.eval(a.context,a.value_expression);
                for (var j=0;j<a.keyList.length;j++) {
                    Variables.set(a.context,a.keyList[j],val);
                }
                
            }
            
            delete trigger_actions[eventID];
        }
    });
    
    var handleEvent = function(context,keyList,value_expression,priority,eventID) {
        if (trigger_actions[eventID]==undefined) trigger_actions[eventID] = new Array();
        
        var new_obj={
            keyList:keyList,
            value_expression:value_expression,
            priority:priority,
            context:context
        };        
        
        trigger_actions[eventID].push({key:"trololol"});
        
        for (var i=trigger_actions[eventID].length-1; i>=0; i--) {
            if (i!=0 && new_obj.priority<trigger_actions[eventID][i-1].priority) {
                trigger_actions[eventID][i]=trigger_actions[eventID][i-1];
            }
            else {
                trigger_actions[eventID][i]=new_obj;
                break;
            }
        }
    }
    
    
    Plugins.fn.trigger = function (key,event_type,value_expression,priority) {
        // event_type: click, mouseover, mouseout, focus, blur
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("trigger-"+key+"-"+event_type)!=undefined) return;
                
                $(elm).uniqueId();
                
                // process key
                var keyList = key.split(",");
                for (var i=0;i<keyList.length;i++) {
                    keyList[i] = Selectors.generate(keyList[i],elm);
                }
                
                // process expression
                value_expression = Selectors.generate(value_expression,elm);

                var listener = function(event) {
                    if (event_type=="focus" || event_type=="blur") {
                        var val=Variables.eval(elm,value_expression);
                        for (var i=0;i<keyList.length;i++) {
                            Variables.set(elm,keyList[i],val);
                        }
                        return true;
                    }
                    handleEvent(elm,keyList,value_expression,priority,event.target.id+"-"+event.type);
                    return true;
                }
                
                $(elm).data("trigger-"+key+"-"+event_type,listener);

                $(elm).on(event_type,listener);
            },
            disable: function () {
                if ($(elm).data("trigger-"+key+"-"+event_type) == undefined) return;

                $(elm).off(event_type,$(elm).data("trigger-"+key+"-"+event_type));
                
                $(elm).removeData("trigger-"+key+"-"+event_type);
            }
        }
    }
    
    
    Plugins.fn.trigger_bind = function (key,status_type) {
        // status_type: hover, focus
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("trigger-bind-"+key+"-"+status_type)!=undefined) return;
                
                $(elm).uniqueId();

                var keyList = key.split(",");
                for (var i=0;i<keyList.length;i++) {
                    keyList[i] = Selectors.generate(keyList[i],elm);
                }

                var data = {
                    listener_on: function() {
                        for (var i=0;i<keyList.length;i++) {
                            Variables.set(elm,keyList[i],true);
                        }
                        return true;
                    },
                    listener_off: function() {
                        for (var i=0;i<keyList.length;i++) {
                            Variables.set(elm,keyList[i],false);
                        }
                        return true;
                    }
                };
                
                $(elm).data("trigger-bind-"+key+"-"+status_type,data);

                if (status_type=="hover") {
                    $(elm).on("mouseover",data.listener_on);
                    $(elm).on("mouseout",data.listener_off);
                }
                else if (status_type=="focus") {
                    $(elm).on("focus",data.listener_on);
                    $(elm).on("blur",data.listener_off);
                }
            },
            disable: function () {
                var data = (elm).data("trigger-bind-"+key+"-"+status_type);
                if (data == undefined) return;

                if (status_type=="hover") {
                    $(elm).off("mouseover",data.listener_on);
                    $(elm).off("mouseout",data.listener_off);
                }
                else if (status_type=="focus") {
                    $(elm).off("focus",data.listener_on);
                    $(elm).off("blur",data.listener_off);
                }
                
                $(elm).removeData("trigger-bind-"+key+"-"+status_type);
            }
        }
    }
    
    
    Plugins.fn.trigger_bind_scrollposition = function (key,scroll_status,scrollarea,offset) { // scroll_status: visible, top, bottom, left, right; offset: {top:,right:,bottom:,left:}
        var elm = this.elm;
        
        // preprocess key
        var keyList = key.split(",");
        for (var i=0;i<keyList.length;i++) {
            keyList[i] = Selectors.generate(keyList[i],elm);
        }
        
        return {
            enable: function () {
                if (jQuery.data(elm,"trigger-bind-scrollposition-"+key)!=undefined) return;
                
                var d_offset = {top:0,right:0,bottom:0,left:0};
                jQuery.extend(d_offset,offset);
                var status = false;
                var scrollarea_elm = (scrollarea=="window") ? $(window) : $(Selectors.generate(scrollarea,elm));
                                                                
                var data = {
                    listener: function() {
                        var scrollTop = scrollarea_elm.scrollTop();
                        var scrollLeft = scrollarea_elm.scrollLeft();
                        var width = scrollarea_elm.innerWidth();
                        var height = scrollarea_elm.innerHeight();
                        var containerTop = (scrollarea=="window") ? 0 : scrollarea_elm.offset().top + parseInt(scrollarea_elm.css("border-top-width")) + parseInt(scrollarea_elm.css("padding-top"));
                        var containerLeft = (scrollarea=="window") ? 0 : scrollarea_elm.offset().left + parseInt(scrollarea_elm.css("border-left-width")) + parseInt(scrollarea_elm.css("padding-left"));

                        var elmOff = $(elm).offset();
                        if (scrollarea!="window") elmOff.top+=scrollTop-containerTop;
                        if (scrollarea!="window") elmOff.left+=scrollLeft-containerLeft;
                        var elmWidth = $(elm).outerWidth();
                        var elmHeight = $(elm).outerHeight();
                        
                        var currentStatus={};
                        
                        if (scroll_status=="top" || scroll_status=="visible")
                            currentStatus.top = (scrollTop+d_offset.top >= elmOff.top-1);
                        
                        if (scroll_status=="bottom" || scroll_status=="visible")
                            currentStatus.bottom=(scrollTop+height-d_offset.bottom <= elmOff.top+elmHeight+1);
                        
                        if (scroll_status=="left" || scroll_status=="visible")
                            currentStatus.left=(scrollLeft+d_offset.left >= elmOff.left-1);
                        
                        if (scroll_status=="right" || scroll_status=="visible")
                            currentStatus.right=(scrollLeft+width-d_offset.right <= elmOff.left+elmWidth+1);
                            
                        if (scroll_status=="visible")
                            currentStatus.visible= !currentStatus.top && !currentStatus.bottom && !currentStatus.left && !currentStatus.right;
                                                              
                        if (currentStatus[scroll_status] != status) {
                            status = currentStatus[scroll_status];
                            for (var i=0;i<keyList.length;i++) {
                                Variables.set(elm,keyList[i],status);
                            }
                        }
                    },
                    scrollarea_elm: scrollarea_elm
                };
                
                jQuery.data(elm,"trigger-bind-scrollposition-"+key,data);

                data.scrollarea_elm.on("touchmove", data.listener);
                data.scrollarea_elm.on("scroll", data.listener);
                data.scrollarea_elm.on("resize", data.listener);
                
                data.listener();
            },
            disable: function () {
                var data = jQuery.data(elm,"trigger-bind-scrollposition-"+key);
                if (data==undefined) return;
                
                data.scrollarea_elm.off("touchmove", data.listener);
                data.scrollarea_elm.off("scroll", data.listener);
                data.scrollarea_elm.off("resize", data.listener);  
                
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],false);
                }
                
                jQuery.removeData(elm,"trigger-bind-scrollposition-"+key);
            }
        }
    }
}(jQuery));