/*! blueleaf 23-03-2015 */
function getFirstKeyInArray(a){for(var b in a)return b}function CSSParser(a){this.css=a,this.token={ENABLE:/\/\*! blueleaf \*\//,SELECTOR:/^([^{}@\/]+)(?={)/,MEDIA_DIRECTIVE:/^@media ([^{}\/]+)(?={)/,IGNORE:/^@[^{}@\/]+(?={)/,BLOCK_OPEN:/^{/,BLOCK_CLOSE:/^}/,BLOCK_CONTENT:/^((\/\*[^]*\*\/|[^{}])*)/,COMMENT_OPEN:/^\/\*/,COMMENT_CLOSE:/^\*\//,COMMENT_CONTENT:/^((?!\*\/)[^])+/,RULE:/^([^\/{}:;\n]+:[^{}:;\n]+;)/,COMMENT_CONTENT_JSON_DATA:/^! customrule: /},this.position=0,this.tree=new Object,this.error=!1,this.currentMediaQuery="all",this.currentSelector=""}Map=function(){this._dict=[]},Map.prototype._get=function(a){for(var b,c=0;b=this._dict[c];c++)if(b[0]===a)return b;return void 0},Map.prototype.put=function(a,b){var c=this._get(a);return c?c[1]=b:this._dict.push([a,b]),this},Map.prototype.get=function(a){var b=this._get(a);return b?b[1]:void 0},Map.prototype.remove=function(a){for(var b,c=0;b=this._dict[c];c++)if(b[0]===a)return void this._dict.splice(c,1)},Map.prototype.each=function(a){for(var b,c=0;b=this._dict[c];c++)a(b[0],b[1])};var uuid=0;jQuery.fn.uniqueId=function(){return this.each(function(){this.id||(this.id="uuid-"+ ++uuid)})};var Plugins={REQUIRED:"_required_argument",fn:{},use:function(a,b,c,d){var e=jQuery.data(a,"data-instances");void 0==e&&(e={}),jQuery.data(a,"data-instances",e);var f=Plugins.fn[b];if(void 0==f)throw"Plugin API: Plugin "+b+" not found.";var g={};for(var h in f.args)if(void 0==c[h]){var i=f.args[h];if(i==Plugins.REQUIRED)throw"Plugin API: Plugin "+b+" could not be instanciated because parameter "+h+" was invalid";g[h]=i}else g[h]=c[h];for(var j=b,k=0;k<f.key.length;k++)j+="~"+g[f.key[k]];var l=e[j];0==d&&void 0!=l?(l.disable(),delete e[j]):1==d&&void 0==l&&(l=f.bind(a)(g),null!=l&&(e[j]=l,l.enable()))}},ElementProperty={properties:new Map,on:function(a,b,c){var d=this.properties.get(a);void 0==d&&(d={},this.properties.put(a,d)),void 0==d[b]&&(d[b]={value:this.getProperty(a,b),listener:[]}),d[b].listener.push(c)},off:function(a,b,c){var d=this.properties.get(a);if(void 0!=d&&void 0!=d[b]){d[b].listener=jQuery.grep(d[b].listener,function(a){return a!=c}),0==d[b].listener.length&&delete d[b];var e=0;for(var f in d)d.hasOwnProperty(f)&&e++;0==e&&delete this.properties.remove(a)}},fire:function(a,b,c,d){var e=this.properties.get(a);if(void 0!=e&&void 0!=e[b])for(var f=0;f<e[b].listener.length;f++)e[b].listener[f](c,d)},getProperty:function(a,b){var c=b.split(".");if("css"==c[0])return jQuery(a).css(c[1]);if("offset"==c[0])return jQuery(a).offset()[c[1]];if("position"==c[0])return jQuery(a).position()[c[1]];if("width"==c[0]){if(void 0==c[1])return jQuery(a).width();if("inner"==c[1])return jQuery(a).innerWidth();if("outer"==c[1])return jQuery(a).outerWidth();if("outerWithMargin"==c[1])return jQuery(a).outerWidth(!0)}else if("height"==c[0]){if(void 0==c[1])return jQuery(a).height();if("inner"==c[1])return jQuery(a).innerHeight();if("outer"==c[1])return jQuery(a).outerHeight();if("outerWithMargin"==c[1])return jQuery(a).outerHeight(!0)}else if("scroll"==c[0]){if("top"==c[1])return jQuery(a).scrollTop();if("left"==c[1])return jQuery(a).scrollLeft()}return null},check:function(a,b){if(void 0==a){var c=this;this.properties.each(function(a){c.check(a,b)})}else{var d=this.properties.get(a);if(void 0==b&&void 0!=d){var e=[];for(var f in d)e.push(f);this.check(a,e)}else if(void 0!=d)for(var g=0;g<b.length;g++)if(void 0!=d[b[g]]){var h=this.getProperty(a,b[g]);d[b[g]].value!=h&&(this.fire(a,b[g],h,d[b[g]].value),d[b[g]].value=h)}}},start:function(){!function(a){var b=new MutationObserver(function(b){for(var c=0;c<b.length;c++)for(var d=b[c].target;d!=document&&null!=d;)a.check(d),d=d.parentNode});b.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0}),jQuery(window).on("resize",function(){a.check()})}(this)}};jQuery(function(){ElementProperty.start()});var Selectors={generate:function(a,b){var c=$(b);c.uniqueId();for(var d,a=a.replace(/{this}/g,"#"+c.attr("id"));null!=(d=/{parent-([0-9]+)}/g.exec(a));){for(var e=$("#"+c.attr("id")),f=0;f<d[1];f++)e=e.parent();e.uniqueId();var a=a.replace(new RegExp("{parent-"+d[1]+"}"),"#"+e.attr("id"))}for(var g;null!=(g=/{attr-([0-9a-zA-Z_\-]+)}/g.exec(a));)var a=a.replace(new RegExp("{attr-"+g[1]+"}"),c.attr(g[1]));return a}},Variables={addVariable:function(a,b,c,d){var e=jQuery.data(a,"variables");null==e&&(e={},jQuery.data(a,"variables",e)),e[b]="simple"==d?{initial:c,value:c,type:d}:"group"==d?{initial:c,value:c,type:d}:{initial:c,value:[c],type:d},this.checkfire(a,b)},removeVariable:function(a,b){var c=jQuery.data(a,"variables");null!=c&&(delete c[b],this.checkfire(a,b))},getVariable:function(a,b){var c=jQuery.data(a,"variables");return null==c?void 0:c[b]},setVariable:function(a,b,c){var d=b.split("."),e=this.getVariable(a,d[0]);if(void 0==e){if(a!=document.documentElement)return!1;this.addVariable(a,b,c,"simple"),e=this.getVariable(a,b)}return this.setVal(e,d[1],c),this.checkfire(a,d[0]),!0},getVal:function(a,b){return"simple"==a.type?a.value:"group"==a.type?a.value==b:a.value[a.value.length-1]==b},setVal:function(a,b,c){"simple"==a.type?a.value=c:"group"==a.type?a.value=c?b:a.initial:c?a.value[a.value.length-1]!=b&&a.value.push(b):a.value=jQuery.grep(a.value,function(a){return a!=b})},get:function(a,b){for(var c=a,d=b.split(".");c!=document;){var e;if(void 0!=(e=this.getVariable(c,d[0])))return this.getVal(e,d[1]);c=c.parentNode}return!1},_expr_get_var_paths:function(a){for(var b=a.replace(/(&&|\|\||!|\(|\))/g," ").split(" "),c=[],d=0;d<b.length;d++)b[d]=b[d].trim(),""!==b[d]&&"true"!==b[d]&&"false"!==b[d]&&-1==jQuery.inArray(b[d],c)&&c.push(b[d]);return c},eval:function(context,expression){for(var re=/[^(&&|\|\||!|\(|\))]+(?=(|&&|\|\||!|\(|\)))/g,offset=0,matches=[],match;null!=(match=re.exec(expression));)matches.push(match);for(var i=0;i<matches.length;i++)if("true"!==matches[i][0]&&"false"!==matches[i][0]){var value=this.get(context,matches[i][0])+"";expression=expression.substring(0,matches[i].index+offset)+value+expression.substring(matches[i].index+offset+matches[i][0].length,expression.length),offset+=value.length-matches[i][0].length}return eval(expression)},set:function(a,b,c){for(var d=a;d!=document;){if(this.setVariable(d,b,c))return;d=d.parentNode}},on:function(a,b,c){var d=jQuery.data(a,"variables-listener");null==d&&(d={},jQuery.data(a,"variables-listener",d));for(var e={expression:b,fn:c,lastval:!1},f=this._expr_get_var_paths(b),g=0;g<f.length;g++){var h=f[g].split(".")[0],i=d[h];void 0==i&&(i=[],d[h]=i),i.push(e)}e.last=this.eval(a,b),c(e.last)},off:function(a,b,c){var d=jQuery.data(a,"variables-listener");if(null!=d){for(var e=this._expr_get_var_paths(b),f=0;f<e.length;f++){var g=e[f].split(".")[0];if(void 0==d[g])return;d[g]=jQuery.grep(d[g],function(a){return a.expression!=b&&a.fn!=c})}this.eval(a,b)&&c(!1)}},checkfire:function(a,b){var c=jQuery.data(a,"variables-listener");if(null!=c){var d=c[b];if(null!=d)for(var e=0;e<d.length;e++){var f=this.eval(a,d[e].expression);d[e].last!=f&&(d[e].last=f,d[e].fn(f))}}for(var g=a.children,e=0;e<g.length;e++)void 0==this.getVariable(g[e],b)&&this.checkfire(g[e],b)}};!function(a){Plugins.fn.container_aspectratio=function(b){function c(){"width"==b.adjust?a(d).width(a(d).height()*b.factor):a(d).height(a(d).width()*b.factor)}var d=this;return{enable:function(){c(),"width"==b.adjust?ElementProperty.on(d,"height",c):ElementProperty.on(d,"width",c)},disable:function(){a(d).css({width:"",height:""}),"width"==b.adjust?ElementProperty.off(d,"height",c):ElementProperty.off(d,"width",c)}}},Plugins.fn.container_aspectratio.args={adjust:"width",factor:Plugins.REQUIRED},Plugins.fn.container_aspectratio.key=[]}(jQuery),function(a){Plugins.fn.expressionlistener_class=function(b){var c=this,d=function(d){d?(a(c).addClass(b.element_class),a(c).removeClass(b.element_class+"_off")):(a(c).removeClass(b.element_class),a(c).addClass(b.element_class+"_off"))};return b.expression=Selectors.generate(b.expression,c),{enable:function(){Variables.on(c,b.expression,d)},disable:function(){Variables.off(c,b.expression,d)}}},Plugins.fn.expressionlistener_class.args={element_class:Plugins.REQUIRED,expression:Plugins.REQUIRED},Plugins.fn.expressionlistener_class.key=["element_class"],Plugins.fn.expressionlistener_focus=function(b){var c=this,d=function(b){b&&a(c).focus()};return b.expression=Selectors.generate(b.expression,c),{enable:function(){Variables.on(c,b.expression,d)},disable:function(){Variables.off(c,b.expression,d)}}},Plugins.fn.expressionlistener_focus.args={expression:Plugins.REQUIRED},Plugins.fn.expressionlistener_focus.key=["expression"],Plugins.fn.expressionlistener_set=function(a){for(var b=this,c=a.key.split(","),d=0;d<c.length;d++)c[d]=Selectors.generate(c[d],b);a.value_expression=Selectors.generate(a.value_expression,b),a.expression=Selectors.generate(a.expression,b);var e=function(){for(var d=Variables.eval(b,a.value_expression),e=0;e<c.length;e++)Variables.set(b,c[e],d)};return{enable:function(){Variables.on(b,a.expression,e)},disable:function(){Variables.off(b,a.expression,e)}}},Plugins.fn.expressionlistener_set.args={expression:Plugins.REQUIRED,key:Plugins.REQUIRED,value_expression:Plugins.REQUIRED},Plugins.fn.expressionlistener_set.key=["expression","key"]}(jQuery),function(a){Plugins.fn.grid_offset=function(b){var c=this,d=a("<div />");return d.css({width:b.width,height:b.height,display:"block",visibility:"hidden"}),{enable:function(){a(c).before(d)},disable:function(){d.detach()}}},Plugins.fn.grid_offset.args={width:Plugins.REQUIRED,height:Plugins.REQUIRED},Plugins.fn.grid_offset.key=[]}(jQuery),function(a){var b=null,c=function(d){1!=d.which&&(a(b).removeClass(a(b).data("resizable-class")),b=null,a(document).off("mousemove",c)),null!=b&&(-1!=a(b).data("resizable-moveX")&&a(b).width(d.pageX-a(b).offset().left+a(b).data("resizable-moveX")),-1!=a(b).data("resizable-moveY")&&a(b).height(d.pageY-a(b).offset().top+a(b).data("resizable-moveY")))},d=function(d){if(1==d.which){var e=a(this).offset().left+a(this).width()-d.pageX,f=a(this).offset().top+a(this).height()-d.pageY;e<=a(this).data("resizable-clickspacing")&&a(this).data("resizable-moveX",e),f<=a(this).data("resizable-clickspacing")&&a(this).data("resizable-moveY",f),(-1!=a(this).data("resizable-moveX")||-1!=a(this).data("resizable-moveY"))&&(b=this,a(this).addClass(a(this).data("resizable-class")),a(document).on("mousemove",c))}},e=function(){a(this).data("resizable-moveX",-1),a(this).data("resizable-moveY",-1),b=null,a(this).removeClass(a(this).data("resizable-class")),a(document).off("mousemove",c)};Plugins.fn.resizable=function(f){var g=a(this);return{enable:function(){g.data("resizable-clickspacing",f.click_spacing),g.data("resizable-class",f.resize_class),g.data("resizable-moveX",-1),g.data("resizable-moveY",-1),g.on("mousedown",d),g.on("mouseup",e)},disable:function(){g.off("mousedown",d),g.off("mouseup",e),b==this&&(b=null,a(this).removeClass(a(this).data("resizable-class")),a(document).off("mousemove",c))}}},Plugins.fn.resizable.args={resize_class:Plugins.REQUIRED,click_spacing:Plugins.REQUIRED},Plugins.fn.resizable.key=[]}(jQuery),function(a){Plugins.fn.smoothscrolling=function(b){var c=this,d=function(c){if(location.pathname.replace(/^\//,"")==this.pathname.replace(/^\//,"")&&location.hostname==this.hostname){var d=this.hash,e=a(this.hash);e=e.length?e:a("[name="+this.hash.slice(1)+"]"),e.length?(a("html,body").animate({scrollTop:e.offset().top},b.time,"swing",function(){location.hash=d}),c.preventDefault()):""==this.hash&&(a("html,body").animate({scrollTop:0},b.time,"swing",function(){location.hash=d}),c.preventDefault())}};return{enable:function(){a(c).on("click",d)},disable:function(){a(c).off("click",d)}}},Plugins.fn.smoothscrolling.args={time:500},Plugins.fn.smoothscrolling.key=[]}(jQuery),function(a){Plugins.fn.sticky=function(b){function c(){y||(y=!0,o.css({width:i.outerWidth(!0),height:i.outerHeight(!0),display:i.css("display"),"vertical-align":i.css("vertical-align"),"float":i.css("float"),position:i.css("position"),visibility:"hidden"}),i.after(o))}function d(){y&&(y=!1,o.detach())}function e(a){a!==x&&(x=a,a==w.OFF?(i.css({position:"",top:"",width:"",height:"",bottom:""}),null!=n&&n.css("position",""),i.removeClass(m)):(i.addClass(m),a==w.VIEWPORT_TOP?i.css({position:"viewport"==k?"fixed":"absolute",top:0,bottom:"",width:"border-box"===i.css("box-sizing")?i.outerWidth()+"px":i.width()+"px",height:"border-box"===i.css("box-sizing")?i.outerHeight()+"px":i.height()+"px"}):a==w.VIEWPORT_BOTTOM?i.css({position:"viewport"==k?"fixed":"absolute",top:"",bottom:0,width:"border-box"===i.css("box-sizing")?i.outerWidth()+"px":i.width()+"px",height:"border-box"===i.css("box-sizing")?i.outerHeight()+"px":i.height()+"px"}):a==w.PARENT_TOP&&null!=n?i.css({position:"absolute",top:n.css("padding-top"),bottom:"",width:"border-box"===i.css("box-sizing")?i.outerWidth()+"px":i.width()+"px",height:"border-box"===i.css("box-sizing")?i.outerHeight()+"px":i.height()+"px"}):a==w.PARENT_BOTTOM&&null!=n&&i.css({position:"absolute",top:"",bottom:n.css("padding-bottom"),width:"border-box"===i.css("box-sizing")?i.outerWidth()+"px":i.width()+"px",height:"border-box"===i.css("box-sizing")?i.outerHeight()+"px":i.height()+"px"}),null!=n&&"static"===n.css("position")&&n.css("position","relative")))}function f(){d(),e(w.OFF);var a=p.scrollTop();p.scrollTop(0),v="viewport"==k?0:p.offset().top+parseInt(p.css("border-top-width"))+parseInt(p.css("padding-top")),u=p.height(),q=i.offset().top-v,r=i.outerHeight(!0),null!=n?(s=n.offset().top+parseInt(n.css("border-top-width"))+parseInt(n.css("padding-top")),t=n.height()):(s=null,t=null),i.addClass(m),q-=parseInt(i.css("margin-top")),r+=parseInt(i.css("margin-top"))+parseInt(i.css("margin-bottom")),i.removeClass(m),p.scrollTop(a),g()}function g(){var a=p.scrollTop();a>q&&j.top?null!=n&&a+r>s+t?(c(),e(w.PARENT_BOTTOM)):(c(),e(w.VIEWPORT_TOP),"viewport"!=k&&i.css("top",a)):q+r>a+u&&j.bottom?null!=n&&s+r>a+u?(c(),e(w.PARENT_TOP)):(c(),e(w.VIEWPORT_BOTTOM),"viewport"!=k&&i.css("top",u-r+a)):(d(),e(w.OFF))}var h=this,i=a(h),j=b.directions,k=b.scrollarea_sel,l=b.container_sel,m=b.sticky_class;"_null"==l&&(l=null);var n,o,p,q,r,s,t,u,v,w={OFF:0,VIEWPORT_TOP:1,VIEWPORT_BOTTOM:2,PARENT_TOP:3,PARENT_BOTTOM:4},x=w.OFF,y=!1;if(p=i.parent(),"viewport"==k?p=a(window):null!==k&&(p=p.closest(k)),!p.length)throw"failed to find scrollarea";if(null==l)n=null;else if(n=i.parent(),n=n.closest(l),!n.length)throw"failed to find container";return o=a("<div />"),{enable:function(){f(),p.on("touchmove",g),p.on("scroll",g),"viewport"==k?a(window).on("resize",f):(ElementProperty.on(p,"width",f),ElementProperty.on(p,"height",f))},disable:function(){p.off("scroll",g),p.off("touchmove",g),"viewport"==k?a(window).off("resize",f):(ElementProperty.off(p,"width",f),ElementProperty.off(p,"height",f)),e(w.OFF),d(),o.remove()}}},Plugins.fn.sticky.args={directions:{top:!0,bottom:!1},scrollarea_sel:"viewport",container_sel:null,sticky_class:"sticky"},Plugins.fn.sticky.key=[]}(jQuery),function(a){Plugins.fn.stickyfooter=function(b){function c(a){0==a?(e.css({position:"",bottom:"",width:"",height:""}),f.css("position","")):(c(!1),e.css({position:"absolute",bottom:0,width:"border-box"===e.css("box-sizing")?e.outerWidth()+"px":e.width()+"px",height:"border-box"===e.css("box-sizing")?e.outerHeight()+"px":e.height()+"px"}),"static"===f.css("position")&&f.css("position","relative"))}function d(){f.css("height","auto"),f.css("min-height","0");var a=f.height();f.css("height",""),f.css("min-height",""),c(a<f.height()?!0:!1)}var e=a(this),f=e.parent();if(null!=b.scrollarea&&(f=f.closest(b.scrollarea)),!f.length)throw"Stickyfooter: failed to find scroll area";return{enable:function(){d(),a(window).on("resize",d)},disable:function(){a(window).off("resize",d),c(!1)}}},Plugins.fn.stickyfooter.args={scrollarea:null},Plugins.fn.stickyfooter.key=[]}(jQuery),function(a){var b=new Object;a(document).on("click mouseover mouseout",function(a){var c=a.target.id+"-"+a.type;if(void 0!=b[c]){for(var d=0;d<b[c].length;d++)for(var e=b[c][d],f=Variables.eval(e.context,e.value_expression),g=0;g<e.keyList.length;g++)Variables.set(e.context,e.keyList[g],f);delete b[c]}});var c=function(a,c,d,e,f){void 0==b[f]&&(b[f]=new Array);var g={keyList:c,value_expression:d,priority:e,context:a};b[f].push({key:"trololol"});for(var h=b[f].length-1;h>=0;h--){if(!(0!=h&&g.priority<b[f][h-1].priority)){b[f][h]=g;break}b[f][h]=b[f][h-1]}};Plugins.fn.trigger=function(b){var d=this;a(d).uniqueId();for(var e=b.key.split(","),f=0;f<e.length;f++)e[f]=Selectors.generate(e[f],d);b.value_expression=Selectors.generate(b.value_expression,d);var g=function(a){if("focus"==b.event_type||"blur"==b.event_type){for(var f=Variables.eval(d,b.value_expression),g=0;g<e.length;g++)Variables.set(d,e[g],f);return!0}return c(d,e,b.value_expression,b.priority,a.target.id+"-"+a.type),!0};return{enable:function(){a(d).on(b.event_type,g)},disable:function(){a(d).off(b.event_type,g)}}},Plugins.fn.trigger.args={key:Plugins.REQUIRED,event_type:"click",value_expression:"true",priority:0},Plugins.fn.trigger.key=["key","event_type"],Plugins.fn.trigger_bind=function(b){var c=this;a(c).uniqueId();for(var d=b.key.split(","),e=0;e<d.length;e++)d[e]=Selectors.generate(d[e],c);var f={listener_on:function(){for(var a=0;a<d.length;a++)Variables.set(c,d[a],!0);return!0},listener_off:function(){for(var a=0;a<d.length;a++)Variables.set(c,d[a],!1);return!0}};return{enable:function(){"hover"==b.status_type?(a(c).on("mouseover",f.listener_on),a(c).on("mouseout",f.listener_off)):"focus"==b.status_type&&(a(c).on("focus",f.listener_on),a(c).on("blur",f.listener_off))},disable:function(){"hover"==b.status_type?(a(c).off("mouseover",f.listener_on),a(c).off("mouseout",f.listener_off)):"focus"==b.status_type&&(a(c).off("focus",f.listener_on),a(c).off("blur",f.listener_off))}}},Plugins.fn.trigger_bind.args={key:Plugins.REQUIRED,status_type:"hover"},Plugins.fn.trigger_bind.key=["key","status_type"],Plugins.fn.trigger_bind_scrollposition=function(b){for(var c=this,d=b.key.split(","),e=0;e<d.length;e++)d[e]=Selectors.generate(d[e],c);var f={top:0,right:0,bottom:0,left:0};jQuery.extend(f,b.offset);var g=!1,h=a("window"==b.scrollarea?window:Selectors.generate(b.scrollarea,c)),i=function(){var e=h.scrollTop(),i=h.scrollLeft(),j=h.innerWidth(),k=h.innerHeight(),l="window"==b.scrollarea?0:h.offset().top+parseInt(h.css("border-top-width"))+parseInt(h.css("padding-top")),m="window"==b.scrollarea?0:h.offset().left+parseInt(h.css("border-left-width"))+parseInt(h.css("padding-left")),n=a(c).offset();"window"!=b.scrollarea&&(n.top+=e-l),"window"!=b.scrollarea&&(n.left+=i-m);var o=a(c).outerWidth(),p=a(c).outerHeight(),q={};if(("top"==b.scroll_status||"visible"==b.scroll_status)&&(q.top=e+f.top>=n.top-1),("bottom"==b.scroll_status||"visible"==b.scroll_status)&&(q.bottom=e+k-f.bottom<=n.top+p+1),("left"==b.scroll_status||"visible"==b.scroll_status)&&(q.left=i+f.left>=n.left-1),("right"==b.scroll_status||"visible"==b.scroll_status)&&(q.right=i+j-f.right<=n.left+o+1),"visible"==b.scroll_status&&(q.visible=!(q.top||q.bottom||q.left||q.right)),q[b.scroll_status]!=g){g=q[b.scroll_status];for(var r=0;r<d.length;r++)Variables.set(c,d[r],g)}};return{enable:function(){h.on("touchmove",i),h.on("scroll",i),h.on("resize",i),i()},disable:function(){h.off("touchmove",i),h.off("scroll",i),h.off("resize",i);for(var a=0;a<d.length;a++)Variables.set(c,d[a],!1)}}},Plugins.fn.trigger_bind_scrollposition.args={key:Plugins.REQUIRED,scroll_status:"top",scrollarea:"window",offset:{}},Plugins.fn.trigger_bind_scrollposition.key=["key"]}(jQuery),function(){Plugins.fn.variable_init=function(a){var b=this;return a.variable=Selectors.generate(a.variable,b),"simple"!=a.type&&(a.value=Selectors.generate(a.value,b)),{enable:function(){Variables.addVariable(b,a.variable,a.value,a.type)},disable:function(){Variables.removeVariable(b,a.variable)}}},Plugins.fn.variable_init.args={variable:Plugins.REQUIRED,value:!1,type:"simple"},Plugins.fn.variable_init.key=["variable"]}(jQuery),CSSParser.prototype.requireToken=function(a){a instanceof Array||(a=new Array(a));var b=/^[\s\n]*/,c=b.exec(this.css.substring(this.position));null!=c&&(this.position+=c.index+c[0].length);for(var d=0;d<a.length;d++){var e=this.token[a[d]].exec(this.css.substring(this.position));if(null!=e)return this.position+=e.index+e[0].length,{type:a[d],match:e}}return null},CSSParser.prototype.parse=function(){function a(a){for(var b;null!=(b=a.requireToken(["RULE","COMMENT_OPEN"]));)if("COMMENT_OPEN"==b.type){if(null!=a.requireToken("COMMENT_CONTENT_JSON_DATA")){var c=a.requireToken("COMMENT_CONTENT");if(null!=c){var d=JSON.parse(c.match[0]);void 0==a.tree[a.currentMediaQuery]&&(a.tree[a.currentMediaQuery]=new Object),void 0==a.tree[a.currentMediaQuery][a.currentSelector]&&(a.tree[a.currentMediaQuery][a.currentSelector]=new Array),a.tree[a.currentMediaQuery][a.currentSelector].push(d)}}if(a.requireToken("COMMENT_CONTENT"),null==a.requireToken("COMMENT_CLOSE"))return a.error=!0,!1}return!0}function b(a){for(var c;null!=(c=a.requireToken(["SELECTOR","IGNORE","BLOCK_CONTENT"]));){if("BLOCK_CONTENT"==c.type)return!0;if(null==a.requireToken("BLOCK_OPEN"))return!1;if(!b(a))return!1;if(null==a.requireToken("BLOCK_CLOSE"))return!1}return!0}if(null==this.requireToken("ENABLE"))return!1;for(var c;null!=(c=this.requireToken(["SELECTOR","MEDIA_DIRECTIVE","IGNORE","COMMENT_OPEN"]));)if("SELECTOR"==c.type){if(this.currentSelector=c.match[1],null==this.requireToken("BLOCK_OPEN"))return this.error=!0,!1;if(0==a(this))return!1;if(null==this.requireToken("BLOCK_CLOSE"))return this.error=!0,!1;this.currentSelector=""}else if("MEDIA_DIRECTIVE"==c.type){if(this.currentMediaQuery=c.match[1],null==this.requireToken("BLOCK_OPEN"))return this.error=!0,!1;for(var d;null!=(d=this.requireToken(["SELECTOR","IGNORE","COMMENT_OPEN"]));)if("SELECTOR"==d.type){if(this.currentSelector=d.match[1],null==this.requireToken("BLOCK_OPEN"))return this.error=!0,!1;if(0==a(this))return!1;if(null==this.requireToken("BLOCK_CLOSE"))return this.error=!0,!1;this.currentSelector=""}else if("IGNORE"==d.type){if(null==this.requireToken("BLOCK_OPEN"))return this.error=!0,!1;if(!b(this))return this.error=!0,!1;if(null==this.requireToken("BLOCK_CLOSE"))return this.error=!0,!1}else if("COMMENT_OPEN"==d.type){if(null==this.requireToken("COMMENT_CONTENT"))return this.error=!0,!1;if(null==this.requireToken("COMMENT_CLOSE"))return this.error=!0,!1}if(null==this.requireToken("BLOCK_CLOSE"))return this.error=!0,!1;this.currentMediaQuery="all"}else if("IGNORE"==c.type){if(null==this.requireToken("BLOCK_OPEN"))return this.error=!0,!1;if(!b(this))return this.error=!0,!1;if(null==this.requireToken("BLOCK_CLOSE"))return this.error=!0,!1}else if("COMMENT_OPEN"==c.type){if(null==this.requireToken("COMMENT_CONTENT"))return this.error=!0,!1;if(null==this.requireToken("COMMENT_CLOSE"))return this.error=!0,!1}return!0};var blueleaf={cutomrules:{ruleslist:{},properties:{},enabledProperties:new Map,addRule:function(a,b){this.ruleslist[a]=b},addProperty:function(a,b,c,d){void 0==this.properties[a]&&(this.properties[a]={selectors:{},active:!1}),void 0==this.properties[a].selectors[b]&&(this.properties[a].selectors[b]=new Array),this.properties[a].selectors[b].push({rule:c,options:d})},parseStyleSheet:function(a){var b=new CSSParser(a);if(b.parse())for(var c in b.tree)for(var d in b.tree[c])for(var e=0;e<b.tree[c][d].length;e++){var f=getFirstKeyInArray(b.tree[c][d][e]);this.addProperty(c,d,f,b.tree[c][d][e][f])}},enableProperty:function(a,b,c,d){var e=this.enabledProperties.get(a);void 0==e&&(e=[],this.enabledProperties.put(a,e)),jQuery.inArray(b+"~"+c+"~"+d,e)>-1||void 0!=this.ruleslist[this.properties[b].selectors[c][d].rule]&&(this.ruleslist[this.properties[b].selectors[c][d].rule].enable(a,this.properties[b].selectors[c][d].options),e.push(b+"~"+c+"~"+d))},disableProperty:function(a,b,c,d){var e=this.enabledProperties.get(a);void 0!=e&&-1!=jQuery.inArray(b+"~"+c+"~"+d,e)&&void 0!=this.ruleslist[this.properties[b].selectors[c][d].rule]&&(this.ruleslist[this.properties[b].selectors[c][d].rule].disable(a,this.properties[b].selectors[c][d].options),this.enabledProperties.put(a,jQuery.grep(e,function(a){return a!==b+"~"+c+"~"+d})))},apply:function(){for(var a in enquire.queries)enquire.queries[a].assess()},init:function(){function a(b,c){c(b);var d=b.children;if(void 0!=d)for(var e=0;e<d.length;e++)a(d[e],c)}for(var b in this.properties)!function(a,b,c,d){enquire.register(a,{match:function(){b.active=!0;for(var e in b.selectors)for(var f=0;f<b.selectors[e].length;f++)void 0!=c[b.selectors[e][f].rule]&&jQuery(e).each(function(){d.enableProperty(this,a,e,f)})},unmatch:function(){b.active=!1;for(var e in b.selectors)for(var f=0;f<b.selectors[e].length;f++)void 0!=c[b.selectors[e][f].rule]&&jQuery(e).each(function(){d.disableProperty(this,a,e,f)})}})}(b,this.properties[b],this.ruleslist,this);var c=this,d=new MutationObserver(function(b){for(var d=0;d<b.length;d++)if("attributes"==b[d].type){var e=b[d].target,f=[];for(var g in c.properties)if(1==c.properties[g].active)for(var h in c.properties[g].selectors)if(jQuery(e).is(h))for(var i=0;i<c.properties[g].selectors[h].length;i++)c.enableProperty(e,g,h,i),f.push(g+"~"+h+"~"+i);var j=c.enabledProperties.get(e);if(void 0!=j)for(var k=0;k<j.length;k++)if(-1==jQuery.inArray(j[k],f)){var l=j[k].split("~");c.disableProperty(e,l[0],l[1],l[2])}}else if("childList"==b[d].type){for(var k=0;k<b[d].addedNodes.length;k++)a(b[d].addedNodes.item(k),function(a){for(var b in c.properties)if(1==c.properties[b].active)for(var d in c.properties[b].selectors)if(jQuery(a).is(d))for(var e=0;e<c.properties[b].selectors[d].length;e++)c.enableProperty(a,b,d,e)});for(var k=0;k<b[d].removedNodes.length;k++)a(b[d].removedNodes.item(k),function(a){var b=c.enabledProperties.get(a);if(void 0!=b)for(var d=0;d<b.length;d++){var e=b[d].split("~");c.disableProperty(a,e[0],e[1],e[2])}})}});d.observe(document,{attributes:!0,childList:!0,subtree:!0})}}};!function(a){for(var b in Plugins.fn)!function(a){blueleaf.cutomrules.addRule(a,{enable:function(b,c){Plugins.use(b,a,c,!0)},disable:function(b,c){Plugins.use(b,a,c,!1)}})}(b);a(function(){function a(){for(var a=document.getElementsByTagName("link"),b=[],c=0;c<a.length;c++)a[c].rel.match(/stylesheet/)&&b.push(a[c].href);return b}function b(){d++,d==c.length&&blueleaf.cutomrules.init()}for(var c=a(),d=0,e=0;e<c.length;e++)jQuery.get(c[e],null,function(a){blueleaf.cutomrules.parseStyleSheet(a),b()})})}(jQuery);