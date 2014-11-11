function CSSParser (css) {
    this.css=css;
    this.token={
        'ENABLE': /\/\*! blueleaf \*\//,
        
        'SELECTOR': /^([^{}@\/]+)/,
        'MEDIA_DIRECTIVE': /^@media ([^{}\/]+)/,
        'IGNORE': /^@[^{}@\/]+/,
        
        'BLOCK_OPEN': /^{/,
        'BLOCK_CLOSE': /^}/,
        'BLOCK_CONTENT': /^((\/\*[^]*\*\/|[^{}])*)/, 
                
        'COMMENT_OPEN':/^\/\*/,
        'COMMENT_CLOSE': /^\*\//,
        'COMMENT_CONTENT': /^((?!\*\/)[^])+/,
        
        'RULE': /^([^\/{}:;\n]+:[^\/{}:;\n]+;)/,
        
        'COMMENT_CONTENT_JSON_DATA': /^! customrule: /
    };
    this.position=0;
    this.tree=new Object();
    this.error=false;
    
    this.currentMediaQuery='all';
    this.currentSelector='';
}

CSSParser.prototype.requireToken = function(tokens) {
    if (!(tokens instanceof Array)) tokens=new Array(tokens);
        
    var skip=/^[\s\n]*/;
    var match1=skip.exec(this.css.substring(this.position));
    if (match1 != null) {
        this.position+=match1.index+match1[0].length;
    }
        
    for (var i=0;i<tokens.length;i++) {
        var match = this.token[tokens[i]].exec(this.css.substring(this.position));
        
        if (match != null) {
            this.position+=match.index+match[0].length;
            
            return {
                type: tokens[i],
                match: match
            };
        }
    }
    
    return null;
};
 
CSSParser.prototype.parse = function() {
    function parseBlockContent(that) {
        var current;
        
        while((current=that.requireToken(['RULE', 'COMMENT_OPEN']))!=null) {
            if (current.type=='COMMENT_OPEN') {
                if (that.requireToken('COMMENT_CONTENT_JSON_DATA')!=null) {
                    var res=that.requireToken('COMMENT_CONTENT');
                    if (res!=null) {
                        var obj = JSON.parse(res.match[0]);
                        
                        if (that.tree[that.currentMediaQuery]==undefined)
                            that.tree[that.currentMediaQuery]=new Object();
                        
                        if (that.tree[that.currentMediaQuery][that.currentSelector]==undefined) {
                            that.tree[that.currentMediaQuery][that.currentSelector]=new Array();
                        }
                        
                        that.tree[that.currentMediaQuery][that.currentSelector].push(obj);
                    }
                }
                that.requireToken('COMMENT_CONTENT');
                if (that.requireToken('COMMENT_CLOSE')==null) {that.error=true; return false;}
            }
        }
                
        return true;
    }
    
    if (this.requireToken('ENABLE')==null) {
        return false;
    }
    
    var current;
    while((current=this.requireToken(['SELECTOR','MEDIA_DIRECTIVE', 'IGNORE', 'COMMENT_OPEN']))!=null) {
        if (current.type=='SELECTOR') {
            this.currentSelector=current.match[1];
            if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}
            if (parseBlockContent(this)==false) {return false;}
            if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
            this.currentSelector='';
        }
        else if (current.type=='MEDIA_DIRECTIVE') {
            this.currentMediaQuery=current.match[1];
            if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}

            var current2;
            while((current2=this.requireToken(['SELECTOR', 'IGNORE', 'COMMENT_OPEN']))!=null) {
                if (current2.type=='SELECTOR') {
                    this.currentSelector=current2.match[1];
                    if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}
                    if (parseBlockContent(this)==false) {return false;}
                    if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
                    this.currentSelector='';
                }
                else if (current2.type=='IGNORE') {
                    if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}
                    if (this.requireToken('BLOCK_CONTENT')==null) {this.error=true; return false;}
                    if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
                }
                else if (current2.type=='COMMENT_OPEN') {
                    if (this.requireToken('COMMENT_CONTENT')==null) {this.error=true; return false;}
                    if (this.requireToken('COMMENT_CLOSE')==null) {this.error=true; return false;}
                }
            }
            
            if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
            this.currentMediaQuery='all';
        }
        else if (current.type=='IGNORE') {
            if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}
            if (this.requireToken('BLOCK_CONTENT')==null) {this.error=true; return false;}
            if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
        }
        else if (current.type=='COMMENT_OPEN') {
            if (this.requireToken('COMMENT_CONTENT')==null) {this.error=true; return false;}
            if (this.requireToken('COMMENT_CLOSE')==null) {this.error=true; return false;}
        }
    }
    
    return true;
};

