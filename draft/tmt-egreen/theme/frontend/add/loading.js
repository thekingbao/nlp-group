var LOADING = (function(){
    var _initAddHTML = function(element,type){
    	if(type == 'wave'){
	        var div = document.createElement("div");
	        div.setAttribute('class', 'loader_wave_ajax');
	        div.innerHTML =`<div class="main"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div><div class="rect6"></div><div class="rect7"></div></div>`;
	        element.appendChild(div);
    	}
    };
    var _initRemoveHTML = function(element,type){
    	if(type == 'wave'){
    		element.querySelector('.loader_wave_ajax').remove();
    	}
    }
    var _initCss = function(){
        var styles = `.loader_wave_ajax{display:none;position:fixed;z-index:9999;top: 0;left: 0; bottom: 0;right:0;height: 100%;width: 100%;background:#0000008a;text-align:center}.loader_wave_ajax.show{display: block !important;}.loader_wave_ajax .main{width:60px;height:100px;font-size:10px;top:50%;position:absolute;margin-top:-50px;text-align:center;margin-left:-30px;left:50%}.loader_wave_ajax .main>div{margin: 0 1px;background-color:#fff;height:100%;width:6px;display:inline-block;-webkit-animation:sk-stretchdelay 1.2s infinite ease-in-out;animation:sk-stretchdelay 1.2s infinite ease-in-out}.loader_wave_ajax .main .rect2{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.loader_wave_ajax .main .rect3{-webkit-animation-delay:-1s;animation-delay:-1s}.loader_wave_ajax .main .rect4{-webkit-animation-delay:-.9s;animation-delay:-.9s}.loader_wave_ajax .main .rect5{-webkit-animation-delay:-.8s;animation-delay:-.8s}.loader_wave_ajax .main .rect6{-webkit-animation-delay:-.7s;animation-delay:-.7s}.loader_wave_ajax .main .rect7{-webkit-animation-delay:-.6s;animation-delay:-.6s}@-webkit-keyframes sk-stretchdelay{0%,100%,40%{-webkit-transform:scaleY(.4)}20%{-webkit-transform:scaleY(1)}}@keyframes sk-stretchdelay{0%,100%,40%{transform:scaleY(.4);-webkit-transform:scaleY(.4)}20%{transform:scaleY(1);-webkit-transform:scaleY(1)}}`;
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };
    return {
        init:function(){
            _initCss();
        },
        addHTML:function(element,type){
        	_initAddHTML(element,type);
        },
        removeHTML:function(element,type){
        	_initRemoveHTML(element,type);
        },
        fadeInWave:function(element){
        	LOADING.addHTML(element,'wave');
            element.querySelector('.loader_wave_ajax').classList.add('show');
        },
        fadeOutWave:function(element){
        	LOADING.removeHTML(element,'wave');
        }
    }
})();
LOADING.init();