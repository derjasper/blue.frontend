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
    
    Plugins.fn.trigger = function (args) {
        var elm = this;
        
        $(elm).uniqueId();
                
        // process key
        var keyList = args.key.split(",");
        for (var i=0;i<keyList.length;i++) {
            keyList[i] = Selectors.generate(keyList[i],elm);
        }

        // process expression
        args.value_expression = Selectors.generate(args.value_expression,elm);

        var listener = function(event) {
            if (args.event_type=="focus" || args.event_type=="blur") {
                var val=Variables.eval(elm,args.value_expression);
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],val);
                }
                return true;
            }
            handleEvent(elm,keyList,args.value_expression,args.priority,event.target.id+"-"+event.type);
            return true;
        }
        
        return {
            enable: function () {
                $(elm).on(args.event_type,listener);
            },
            disable: function () {
                $(elm).off(args.event_type,listener);
            }
        }
    }
    Plugins.fn.trigger.args = {
        key: Plugins.REQUIRED,
        event_type: "click", // event_type: click, mouseover, mouseout, focus, blur
        value_expression: "true",
        priority: 0
    };
    Plugins.fn.trigger.key = ["key","event_type"];
    
    
    Plugins.fn.trigger_bind = function (args) {
        var elm = this;
        
        $(elm).uniqueId();

        var keyList = args.key.split(",");
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
        
        
        return {
            enable: function () {
                if (args.status_type=="hover") {
                    $(elm).on("mouseover",data.listener_on);
                    $(elm).on("mouseout",data.listener_off);
                }
                else if (args.status_type=="focus") {
                    $(elm).on("focus",data.listener_on);
                    $(elm).on("blur",data.listener_off);
                }
            },
            disable: function () {
                if (args.status_type=="hover") {
                    $(elm).off("mouseover",data.listener_on);
                    $(elm).off("mouseout",data.listener_off);
                }
                else if (args.status_type=="focus") {
                    $(elm).off("focus",data.listener_on);
                    $(elm).off("blur",data.listener_off);
                }
            }
        }
    }
    Plugins.fn.trigger_bind.args = {
        key: Plugins.REQUIRED,
        status_type: "hover" // status_type: hover, focus
    };
    Plugins.fn.trigger_bind.key = ["key","status_type"];
    
    
    Plugins.fn.trigger_bind_scrollposition = function (args) { 
        var elm = this;
        
        // preprocess key
        var keyList = args.key.split(",");
        for (var i=0;i<keyList.length;i++) {
            keyList[i] = Selectors.generate(keyList[i],elm);
        }
        
        var d_offset = {top:0,right:0,bottom:0,left:0};
        jQuery.extend(d_offset,args.offset);
        var status = false;
        var scrollarea_elm = (args.scrollarea=="window") ? $(window) : $(Selectors.generate(args.scrollarea,elm));

        var listener = function() {
            var scrollTop = scrollarea_elm.scrollTop();
            var scrollLeft = scrollarea_elm.scrollLeft();
            var width = scrollarea_elm.innerWidth();
            var height = scrollarea_elm.innerHeight();
            var containerTop = (args.scrollarea=="window") ? 0 : scrollarea_elm.offset().top + parseInt(scrollarea_elm.css("border-top-width")) + parseInt(scrollarea_elm.css("padding-top"));
            var containerLeft = (args.scrollarea=="window") ? 0 : scrollarea_elm.offset().left + parseInt(scrollarea_elm.css("border-left-width")) + parseInt(scrollarea_elm.css("padding-left"));

            var elmOff = $(elm).offset();
            if (args.scrollarea!="window") elmOff.top+=scrollTop-containerTop;
            if (args.scrollarea!="window") elmOff.left+=scrollLeft-containerLeft;
            var elmWidth = $(elm).outerWidth();
            var elmHeight = $(elm).outerHeight();

            var currentStatus={};

            if (args.scroll_status=="top" || args.scroll_status=="visible")
                currentStatus.top = (scrollTop+d_offset.top >= elmOff.top-1);

            if (args.scroll_status=="bottom" || args.scroll_status=="visible")
                currentStatus.bottom=(scrollTop+height-d_offset.bottom <= elmOff.top+elmHeight+1);

            if (args.scroll_status=="left" || args.scroll_status=="visible")
                currentStatus.left=(scrollLeft+d_offset.left >= elmOff.left-1);

            if (args.scroll_status=="right" || args.scroll_status=="visible")
                currentStatus.right=(scrollLeft+width-d_offset.right <= elmOff.left+elmWidth+1);

            if (args.scroll_status=="visible")
                currentStatus.visible= !currentStatus.top && !currentStatus.bottom && !currentStatus.left && !currentStatus.right;

            if (currentStatus[args.scroll_status] != status) {
                status = currentStatus[args.scroll_status];
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],status);
                }
            }
        };
        
        return {
            enable: function () {
                scrollarea_elm.on("touchmove", listener);
                scrollarea_elm.on("scroll", listener);
                scrollarea_elm.on("resize", listener);
                
                listener();
            },
            disable: function () {
                scrollarea_elm.off("touchmove", listener);
                scrollarea_elm.off("scroll", listener);
                scrollarea_elm.off("resize", listener);  
                
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],false);
                }
            }
        }
    }
    Plugins.fn.trigger_bind_scrollposition.args = {
        key: Plugins.REQUIRED,
        scroll_status: "top", // scroll_status: visible, top, bottom, left, right
        scrollarea: "window",
        offset: {} // offset: {top:,right:,bottom:,left:}
    };
    Plugins.fn.trigger_bind_scrollposition.key = ["key"];
}(jQuery));