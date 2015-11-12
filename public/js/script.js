
$.fn.offScreen = function(distance){
    var $this = $(this),
        $window = $(window),
        viewTop = $window.scrollTop(),
        viewBottom = viewTop + $window.height(),
        _top = $this.offset().top - distance,
        _bottom = $this.offset().top + $this.height() + distance,
        opacity = ($this.offset().top - viewTop) / $window.height() + .5;

    return {
        top: _bottom <= viewTop,
        bottom: _top >= viewBottom,
        opacity: opacity
    }
};

$('.ios7 p, .ios7 dt').each(function() {
    var $this = $(this);
        
    if (!$this.offScreen(150).top && !$this.offScreen(150).bottom) {
        $this.removeClass('visible past future');
    } else {
        if ($this.offScreen(150).top) {
            $this.addClass('past');
        } else {
            $this.addClass('future');
        }
    }
});

$(window).on('scroll resize', function() {
    $('.ios7 p, .ios7 dt').each(function() {
        var $this = $(this);
        
        if (!$this.offScreen(150).top && !$this.offScreen(150).bottom) {
            $this.removeClass('visible past future');
            if ($this.parent().hasClass('to')) {
                $this.fadeTo(0,$this.offScreen(150).opacity);
            }
        } else {
            if ($this.offScreen(150).top) {
                $this.addClass('past').removeAttr('style');
            } else {
                $this.addClass('future').removeAttr('style');
            }
        }
    });
});

$(window).trigger('scroll');

$(function() {
  var wtf    = $('#messages');
  var height = wtf.scrollHeight;
  wtf.scrollTop(height);
});