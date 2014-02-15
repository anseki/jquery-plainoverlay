/*
 * jQuery.plainOverlay
 * https://github.com/anseki/jquery-plainoverlay
 *
 * Copyright (c) 2014 anseki
 * Licensed under the MIT license.
 */

;(function($, undefined) {
'use strict';

// builtin progress element
var newProgress = (function() {
  var isLegacy,
    cssText = '.jQuery-plainOverlay-progress{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;height:100%;border-top:3px solid #17f29b;-webkit-border-radius:50%;-moz-border-radius:50%;-ms-border-radius:50%;-o-border-radius:50%;border-radius:50%;-webkit-tap-highlight-color:rgba(0,0,0,0);transform:translateZ(0);box-shadow:0 0 1px rgba(0,0,0,0);-webkit-animation-name:jQuery-plainOverlay-spin;-moz-animation-name:jQuery-plainOverlay-spin;-ms-animation-name:jQuery-plainOverlay-spin;-o-animation-name:jQuery-plainOverlay-spin;animation-name:jQuery-plainOverlay-spin;-webkit-animation-duration:1s;-moz-animation-duration:1s;-ms-animation-duration:1s;-o-animation-duration:1s;animation-duration:1s;-webkit-animation-timing-function:linear;-moz-animation-timing-function:linear;-ms-animation-timing-function:linear;-o-animation-timing-function:linear;animation-timing-function:linear;-webkit-animation-iteration-count:infinite;-moz-animation-iteration-count:infinite;-ms-animation-iteration-count:infinite;-o-animation-iteration-count:infinite;animation-iteration-count:infinite}@-moz-keyframes jQuery-plainOverlay-spin{from{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes jQuery-plainOverlay-spin{from{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@-o-keyframes jQuery-plainOverlay-spin{from{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@-ms-keyframes jQuery-plainOverlay-spin{from{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes jQuery-plainOverlay-spin{from{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}.jQuery-plainOverlay-progress-legacy{width:100%;height:50%;padding-top:25%;text-align:center;white-space:nowrap;*zoom:1}.jQuery-plainOverlay-progress-legacy:after,.jQuery-plainOverlay-progress-legacy:before{content:" ";display:table}.jQuery-plainOverlay-progress-legacy:after{clear:both}.jQuery-plainOverlay-progress-legacy div{width:18%;height:100%;margin:0 1%;background-color:#17f29b;float:left;visibility:hidden}.jQuery-plainOverlay-progress-1 div.jQuery-plainOverlay-progress-1,.jQuery-plainOverlay-progress-2 div.jQuery-plainOverlay-progress-1,.jQuery-plainOverlay-progress-2 div.jQuery-plainOverlay-progress-2,.jQuery-plainOverlay-progress-3 div.jQuery-plainOverlay-progress-1,.jQuery-plainOverlay-progress-3 div.jQuery-plainOverlay-progress-2,.jQuery-plainOverlay-progress-3 div.jQuery-plainOverlay-progress-3{visibility:visible}',

    adjustProgress = function() {
      var progressWH = Math.min(300, // max w/h
        (this.isBody ?
          Math.min(this.jqWin.width(), this.jqWin.height()) :
          Math.min(this.jqTarget.innerWidth(), this.jqTarget.innerHeight())) * 0.9);
      this.jqProgress.width(progressWH).height(progressWH);
      if (!this.showProgress) { // CSS Animations
        this.jqProgress.children('.jQuery-plainOverlay-progress').css('borderTopWidth',
          Math.max(3, progressWH / 30)); // min width
      }
    },

    showProgressLegacy = function(start) {
      var that = this;
      if (that.timer) { clearTimeout(that.timer); }
      if (that.progressCnt) {
        that.jqProgress.removeClass('jQuery-plainOverlay-progress-' + that.progressCnt);
      }
      if (that.isShown) {
        that.progressCnt = !start && that.progressCnt < 3 ? that.progressCnt + 1 : 0;
        if (that.progressCnt) {
          that.jqProgress.addClass('jQuery-plainOverlay-progress-' + that.progressCnt);
        }
        that.timer = setTimeout(function() { that.showProgress(); }, 500);
      }
    };

  return function(overlay) {
    var jqProgress, sheet;

    // Graceful Degradation
    if (typeof isLegacy !== 'boolean') {
      isLegacy = (function() { // similar to Modernizr
        function is(obj, type) { return typeof obj === type; }
        function contains(str, substr) { return !!~('' + str).indexOf(substr); }
        var res, feature,
          modElem = document.createElement('modernizr'),
          mStyle = modElem.style,
          omPrefixes = 'Webkit Moz O ms',
          cssomPrefixes = omPrefixes.split(' '),
          tests = {},
          _hasOwnProperty = ({}).hasOwnProperty,
          hasOwnProp = !is(_hasOwnProperty, 'undefined') &&
              !is(_hasOwnProperty.call, 'undefined') ?
            function (object, property) {
              return _hasOwnProperty.call(object, property);
            } :
            function (object, property) {
              return ((property in object) &&
                is(object.constructor.prototype[property], 'undefined'));
            };

        function testProps(props) {
          var i;
          for (i in props) {
            if (!contains(props[i], '-') && mStyle[props[i]] !== undefined) { return true; }
          }
          return false;
        }
        function testPropsAll(prop) {
          var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
              props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
          return testProps(props);
        }

        tests.borderradius = function() {
          return testPropsAll('borderRadius');
        };
        tests.cssanimations = function() {
          return testPropsAll('animationName');
        };
        tests.csstransforms = function() {
          return !!testPropsAll('transform');
        };

        res = false;
        for (feature in tests) {
          if (hasOwnProp(tests, feature) && !tests[feature]()) {
            res = true;
            break;
          }
        }
        mStyle.cssText = '';
        modElem = null;
        return res;
      })();
    }

    if (!overlay.elmDoc.getElementById('jQuery-plainOverlay')) { // Add style rules
      if (overlay.elmDoc.createStyleSheet) { // IE
        sheet = overlay.elmDoc.createStyleSheet();
        sheet.owningElement.id = 'jQuery-plainOverlay';
        sheet.cssText = cssText;
      } else {
        sheet = (overlay.elmDoc.getElementsByTagName('head')[0] || overlay.elmDoc.documentElement)
          .appendChild(overlay.elmDoc.createElement('style'));
        sheet.type = 'text/css';
        sheet.id = 'jQuery-plainOverlay';
        sheet.textContent = cssText;
      }
    }

    if (isLegacy) {
      jqProgress = $('<div><div class="jQuery-plainOverlay-progress-legacy">' +
        '<div class="jQuery-plainOverlay-progress-3" /><div class="jQuery-plainOverlay-progress-2" /><div class="jQuery-plainOverlay-progress-1" /><div class="jQuery-plainOverlay-progress-2" /><div class="jQuery-plainOverlay-progress-3" /></div></div>');
      overlay.showProgress = showProgressLegacy;
    } else {
      jqProgress = $('<div><div class="jQuery-plainOverlay-progress" /></div>');
    }
    overlay.adjustProgress = adjustProgress;
    return jqProgress;
  };
})();

function Overlay(jqTarget, options, curObject) {
  var that = this, elmTarget = jqTarget.get(0);
  that.duration = options.duration;
  that.opacity = options.opacity;
  that.isShown = false;

  // that.jqWin = that.jqTarget.ownerDocument.defaultView; // Not supported by IE
  if ($.isWindow(elmTarget) || elmTarget.nodeType === 9) { // window or document -> body
    that.jqTarget = $('body');
  } else if (elmTarget.nodeName.toLowerCase() === 'iframe' ||
      elmTarget.nodeName.toLowerCase() === 'frame') { // iframe/frame -> body of iframe
    // contentDocument not supported by IE
    that.jqWin = $(elmTarget.contentWindow);
    that.elmDoc = elmTarget.contentWindow.document;
    that.jqTarget = $('body', that.elmDoc);
    that.isFrame = true;
  } else {
    that.jqTarget = jqTarget;
  }
  that.jqWin = that.jqWin || $(window);
  that.elmDoc = that.elmDoc || document;
  that.isBody = that.jqTarget.get(0).nodeName.toLowerCase() === 'body';

  if (curObject) {
    // Remove jqProgress that exists always, because it may be replaced.
    if (curObject.jqProgress) {
      if (curObject.timer) { clearTimeout(curObject.timer); }
      curObject.jqProgress.remove(); delete curObject.jqProgress;
    }
    curObject.reset(true); // Restore styles
    curObject.jqOverlay.stop();
  }

  that.jqOverlay = (curObject && curObject.jqOverlay ||
    $('<div />').css({
      position:       that.isBody ? 'fixed' : 'absolute',
      left:           0,
      top:            0,
      display:        'none',
      zIndex:         9000
    }).appendTo(that.jqTarget)
  ).css('backgroundColor', options.color);

  if (that.jqProgress = options.progress === false ? undefined :
      (typeof options.progress === 'function' ?
        options.progress.call(that.jqTarget, options) : newProgress(that))) {
    that.jqProgress.css({
      position:       that.isBody ? 'fixed' : 'absolute',
      display:        'none',
      zIndex:         9001
    }).appendTo(that.jqTarget);
  }

  // Not shared methods for calling per object in event of one element.
  that.callAdjust = (function(that) {
    return that.adjustProgress ? function() {
      that.adjustProgress();
      that.adjust();
    } : function() { that.adjust(); };
  })(that);
  that.avoidFocus = (function(that) {
    return function(e) {
      $(that.elmDoc.activeElement).blur();
      e.preventDefault();
      return false;
    };
  })(that);
  that.avoidScroll = (function(that) {
    return function(e) {
      (function(jqView) {
        jqView.scrollLeft(that.scrLeft).scrollTop(that.scrTop);
      })(that.isBody ? that.jqWin : that.jqTarget);
      e.preventDefault();
      return false;
    };
  })(that);

  if (curObject) {
    if (curObject.timer) { clearTimeout(curObject.timer); }
    curObject = undefined; // Erase
  }
}

Overlay.prototype.show = function() {
  var that = this, inlineStyles, position, calMarginR, calMarginB, jqActive;
  that.reset(true); // Restore styles
  inlineStyles = that.jqTarget.get(0).style;

  that.orgPosition = inlineStyles.position;
  position = that.jqTarget.css('position');
  if (position !== 'relative' && position !== 'absolute' && position !== 'fixed') {
    that.jqTarget.css('position', 'relative');
  }

  that.orgOverflow = inlineStyles.overflow;
  calMarginR = that.jqTarget.prop('clientWidth');
  calMarginB = that.jqTarget.prop('clientHeight');
  that.jqTarget.css('overflow', 'hidden');
  calMarginR -= that.jqTarget.prop('clientWidth');
  calMarginB -= that.jqTarget.prop('clientHeight');
  that.addMarginR = that.addMarginB = 0;
  if (calMarginR < 0) { that.addMarginR = -calMarginR; }
  if (calMarginB < 0) { that.addMarginB = -calMarginB; }
  if (that.isBody) {
    if (that.addMarginR) {
      that.orgMarginR = inlineStyles.marginRight;
      that.jqTarget.css('marginRight', '+=' + that.addMarginR);
    }
    if (that.addMarginB) {
      that.orgMarginB = inlineStyles.marginBottom;
      that.jqTarget.css('marginBottom', '+=' + that.addMarginB);
    }
  } else { // change these in adjust()
    if (that.addMarginR) {
      that.orgMarginR = inlineStyles.paddingRight;
      that.orgWidth = inlineStyles.width;
    }
    if (that.addMarginB) {
      that.orgMarginB = inlineStyles.paddingBottom;
      that.orgHeight = inlineStyles.height;
    }
  }

  that.jqActive = undefined;
  jqActive = $(that.elmDoc.activeElement);
  if (that.isBody && !that.isFrame) { that.jqActive = jqActive.blur(); } // Save activeElement
  else if (that.jqTarget.has(jqActive.get(0)).length) { jqActive.blur(); }
  that.jqTarget.focusin(that.avoidFocus);
  (function(jqView) {
    that.scrLeft = jqView.scrollLeft();
    that.scrTop = jqView.scrollTop();
    jqView.scroll(that.avoidScroll);
  })(that.isBody ? that.jqWin : that.jqTarget);
  that.jqWin.resize(that.callAdjust);
  that.callAdjust();
  that.isShown = true;

  that.jqOverlay.stop().fadeTo(that.duration, that.opacity);
  if (that.jqProgress) {
    if (that.showProgress) { that.showProgress(true); }
    that.jqProgress.fadeIn(that.duration);
  }
};

Overlay.prototype.hide = function() {
  var that = this;
  if (!that.isShown) { return; }
  that.jqOverlay.stop().fadeOut(that.duration, function() { that.reset(); });
  if (that.jqProgress) { that.jqProgress.fadeOut(that.duration); }
};

Overlay.prototype.adjust = function() {
  var calW, calH;
  if (this.isBody) {
    // base of overlay size and progress position is window.
    calW = this.jqWin.width();
    calH = this.jqWin.height();
    this.jqOverlay.width(calW).height(calH);
    if (this.jqProgress) {
      this.jqProgress.css({
        left:   (calW - this.jqProgress.outerWidth()) / 2,
        top:    (calH - this.jqProgress.outerHeight()) / 2
      });
    }
  } else {
    if (this.addMarginR) {
      this.jqTarget.css('paddingRight', this.orgMarginR);
      this.jqTarget.css('width', this.orgWidth);
      calW = this.jqTarget.width(); // original size
      this.jqTarget.css('paddingRight', '+=' + this.addMarginR).width(calW - this.addMarginR);
    }
    if (this.addMarginB) {
      this.jqTarget.css('paddingBottom', this.orgMarginB);
      this.jqTarget.css('height', this.orgHeight);
      calH = this.jqTarget.height(); // original size
      this.jqTarget.css('paddingBottom', '+=' + this.addMarginB).height(calH - this.addMarginB);
    }

    // base of overlay size is element size that includes hidden area.
    calW = Math.max(this.jqTarget.prop('scrollWidth'), this.jqTarget.innerWidth()); // for IE bug
    calH = Math.max(this.jqTarget.prop('scrollHeight'), this.jqTarget.innerHeight());
    this.jqOverlay.width(calW).height(calH);
    if (this.jqProgress) {
      // base of progress position is element size that doesn't include hidden area.
      calW = this.jqTarget.innerWidth();
      calH = this.jqTarget.innerHeight();
      this.jqProgress.css({
        left:   (calW - this.jqProgress.outerWidth()) / 2 + this.scrLeft,
        top:    (calH - this.jqProgress.outerHeight()) / 2 + this.scrTop
      });
    }
  }
};

Overlay.prototype.reset = function(forceHide) {
  // default: display of jqOverlay and jqProgress is kept
  var that = this;
  if (forceHide) {
    that.jqOverlay.css('display', 'none');
    if (that.jqProgress) { that.jqProgress.css('display', 'none'); }
  }
  if (!that.isShown) { return; }
  that.jqTarget.css('position', that.orgPosition);
  that.jqTarget.css('overflow', that.orgOverflow);
  if (that.isBody) {
    if (that.addMarginR) { that.jqTarget.css('marginRight', that.orgMarginR); }
    if (that.addMarginB) { that.jqTarget.css('marginBottom', that.orgMarginB); }
  } else {
    if (that.addMarginR) {
      that.jqTarget.css('paddingRight', that.orgMarginR);
      that.jqTarget.css('width', that.orgWidth);
    }
    if (that.addMarginB) {
      that.jqTarget.css('paddingBottom', that.orgMarginB);
      that.jqTarget.css('height', that.orgHeight);
    }
  }
  that.jqTarget.off('focusin', that.avoidFocus);
  if (that.jqActive && that.jqActive.length) { that.jqActive.focus(); } // Restore activeElement
  (function(jqView) {
    jqView.off('scroll', that.avoidScroll);
    jqView.scrollLeft(that.scrLeft).scrollTop(that.scrTop);
  })(that.isBody ? that.jqWin : that.jqTarget);
  that.jqWin.off('resize', that.callAdjust);
  that.isShown = false;
};

function init(jq, options) {
  var opt = $.extend({
        duration:       200,
        color:          '#000',
        opacity:        0.3
        // progress
      }, options);
  return jq.each(function() {
    var that = $(this);
    that.data('plainOverlay', new Overlay(that, opt, that.data('plainOverlay')));
  });
}

function overlayShow(jq, options) {
  return jq.each(function() {
    var that = $(this), overlay;
    if (options || !(overlay = that.data('plainOverlay'))) {
      overlay = init(that, options).data('plainOverlay');
    }
    overlay.show();
  });
}

function overlayHide(jq) {
  return jq.each(function() {
    var overlay = $(this).data('plainOverlay');
    if (overlay) { overlay.hide(); }
  });
}

$.fn.plainOverlay = function(action, options) {
  return (
    action === 'show' ?   overlayShow(this, options) :
    action === 'hide' ?   overlayHide(this) :
                          init(this, action)); // options.
};

})(jQuery);
