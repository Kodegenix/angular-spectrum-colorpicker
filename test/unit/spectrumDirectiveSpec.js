/* jshint unused: false */
/* global initGlobals, $, $compile, $rootScope, console, createDirective */
describe('SpectrumDirective', function() {
  'use strict';

  it('should be able to find the angular module', function() {
    expect(angular.module('angularSpectrumColorpicker')).toBeDefined();
  });

  describe('legacy', function() {

    beforeEach(function() {
      initGlobals();
    });

    it('should initialize spectrum when compiling the directive tag', function() {
      var d = createDirective({
        'ng-model': 'targetColor'
      });

      expect(d.elm.find('input').length > 0).toBe(true);
      expect($('.sp-container').length > 0).toBe(true);
    });


    it('should update the model when changing the color in the colorpicker', function() {
      $rootScope.targetColor = 'green';
      var d = createDirective({
        'ng-model': 'targetColor'
      });

      // set value within the colorpicker
      $('input.sp-input').val('#0000ff').trigger('change');

      // scope should have been changed!
      expect($rootScope.targetColor).toBe('#0000ff');

      // preview should have been updated!
      expect(d.elm.find('.sp-preview-inner').css('background-color')).toEqual('rgb(0, 0, 255)');
    });

    it('should initialize the colorpicker with the correct default color', function() {
      var defaultColor = '#123456';
      var defaultColorRgb = 'rgb(18, 52, 86)';
      $rootScope.targetColor = 'green';
      $rootScope.options = {
        color: defaultColor
      };
      var d = createDirective({
        'ng-model': 'targetColor',
        'options': 'options'
      });

      expect($rootScope.targetColor).toBe(defaultColor);
      expect(d.elm.find('.sp-preview-inner').css('background-color')).toEqual(defaultColorRgb);
    });


    it('should use via the directive given options', function() {
      $rootScope.options = {
        showInput: true
      };
      var d = createDirective({
        'ng-model': 'targetColor',
        'options': 'options'
      });

      expect($('.sp-container').hasClass('sp-input-disabled')).toBe(false);
    });

    it('should understand the disabled option', function() {
      $rootScope.options = {
        disabled: true
      };
      var d = createDirective({
        'ng-model': 'targetColor',
        'options': 'options'
      });
      expect(d.elm.find('input').attr('disabled')).toBe('disabled');
    });

    describe('trigger handler', function() {
      var $label;
      beforeEach(function() {
        $label = $('<label id="theTrigger">Click here to toggle!</label>');
        $(document.body).append($label);
      });

      afterEach(function() {
        $label.remove();
      });

      it('should toggle the colorpicker, when the given trigger is clicked', function() {
        $rootScope.options = {
          showInput: true
        };
        var d = createDirective({
          'ng-model': 'targetColor',
          'trigger-id': 'theTrigger',
          'options': 'options'
        });

        $label.trigger('click');
        expect(d.elm.find('.sp-replacer').hasClass('sp-active')).toBe(true);
      });

      function getClickEventNumber() {
        var eventN = 0;
        var events = $._data(document.body, 'events');
        if (events && events.click) {
          eventN = events.click.length;
        }
        return eventN;
      }

      it('should deregister the handler on directive destroy', function() {
        var initialEvents = getClickEventNumber();
        var d = createDirective({
          'ng-model': 'targetColor',
          'trigger-id': 'theTrigger',
        });
        expect(getClickEventNumber()).toBe(initialEvents + 1);
        $label.trigger('click');
        expect(d.elm.find('.sp-active').length).toBe(1);
        d.scope.$destroy();
        expect(getClickEventNumber()).toBe(initialEvents);
		expect(d.elm.find('.sp-active').length).toBe(1);
      });
    });


    it('should destroy the spectrum picker when destroying the directive', function() {
      $rootScope.options = {
        showInput: true
      };
      var d = createDirective({
        'ng-model': 'targetColor',
        'options': 'options'
      });
      expect($('.sp-container').length).toBe(1);
     d.elm.trigger('$destroy');
      expect($('.sp-container').length).toBe(0);
    });

    it('should cope with falsy color values', function() {
      $rootScope.targetColor = false;
      $rootScope.options = {
        allowEmpty: true
      };
      var d = createDirective({
        'ng-model': 'targetColor',
        'options': 'options'
      });

      d.elm.find('input').spectrum('show');
      $('.sp-cancel').click();
      expect($rootScope.targetColor).toBe(null);
    });

    it('should reset the color to the fallback value, if provided', function() {
      var fallback = {};
      $rootScope.fallbackValue = fallback;
      $rootScope.targetColor = false;
      $rootScope.options = {
        allowEmpty: true
      };
      var d = createDirective({
        'ng-model': 'targetColor',
        'fallback-value': 'fallbackValue',
        'options': 'options'
      });

      d.elm.find('input').spectrum('show');
      $('.sp-cancel').click();
      expect($rootScope.targetColor).toBe(fallback);
    });

    it('should return hex-values when format is set to hex', function() {
      $rootScope.targetColor = 'green';
      $rootScope.format = 'hex';
      var d = createDirective({
        'ng-model': 'targetColor',
        'format': 'format'
      });

      // set value to an rgba-color
      $('input.sp-input').val('rgba(255, 0, 0, 0.6)').trigger('change');

      // since format is set to hex, we should still get hex back, not rgba
      expect($rootScope.targetColor.toString()).toBe('#ff0000');
    });

    it('should return rgb-values when format is set to rgb via evaluated value', function() {
      $rootScope.targetColor = 'green';
      $rootScope.format = 'rgb';
      var d = createDirective({
        'ng-model': 'targetColor',
        'format': 'format'
      });

      // set value to an hsv-color
      $('input.sp-input').val('hsv(0, 100%, 100%)').trigger('change');
      // since format is now set to an evaluated value of rgb, we should now get rgb back
      expect($rootScope.targetColor.toString()).toBe('rgb(255, 0, 0)');
    });

    it('should return the same value if there is no format set', function() {
      $rootScope.targetColor = 'green';
      var d = createDirective({
        'ng-model': 'targetColor'
      });

      var formats = [
        'rgba(255, 0, 0, 0.6)',
        'rgb(255, 0, 0)',
        '#f0f0f0',
        'hsv(0, 100%, 100%)'
      ];

      for (var i = 0; i < formats.length; i++) {
        $('input.sp-input').val(formats[i]).trigger('change');
        expect($rootScope.targetColor.toString()).toBe(formats[i]);
      }
    });
  });

  describe('eventing', function() {
    beforeEach(function() {
      initGlobals();
    });

    it('should correctly emit change event', function() {
      $rootScope.eventSpy = jasmine.createSpy('change');
      var d = createDirective({
        'ng-model': 'targetColor',
        'on-change': 'eventSpy()'
      });

      $rootScope.targetColor = 'blue';
      expect($rootScope.eventSpy).toHaveBeenCalled();
    });

    it('should correctly emit show event', function() {
      $rootScope.eventSpy = jasmine.createSpy('show');
      var d = createDirective({
        'ng-model': 'targetColor',
        'on-show': 'eventSpy()'
      });
      d.elm.find('input').spectrum('show');
      expect($rootScope.eventSpy).toHaveBeenCalled();
    });

    it('should correctly emit hide event', function() {
      $rootScope.eventSpy = jasmine.createSpy('hide');
      var d = createDirective({
        'ng-model': 'targetColor',
        'on-hide': 'eventSpy()'
      });
      d.elm.find('input').spectrum('show');
      d.elm.find('input').spectrum('hide');
      expect($rootScope.eventSpy).toHaveBeenCalled();
    });

    it('should correctly emit beforeShow event', function() {
      $rootScope.eventSpy = jasmine.createSpy('beforeShow');
      var d = createDirective({
        'ng-model': 'targetColor',
        'on-before-show': 'eventSpy()'
      });
      d.elm.find('input').spectrum('show');
      expect($rootScope.eventSpy).toHaveBeenCalled();
    });

    it('should prevent opening if beforeShow returns false', function() {
      $rootScope.beforeShowSpy = jasmine.createSpy('beforeShow').and.returnValue(false);
      $rootScope.showSpy = jasmine.createSpy('show');
      var d = createDirective({
        'ng-model': 'targetColor',
        'on-before-show': 'beforeShowSpy()',
        'on-show': 'showSpy()'
      });
      d.elm.find('input').spectrum('show');
      expect($rootScope.showSpy).not.toHaveBeenCalled();
    });

    it('should correctly emit move event', function() {
      $rootScope.eventSpy = jasmine.createSpy('move');
      var d = createDirective({
        'ng-model': 'targetColor',
        'on-move': 'eventSpy()'
      });
      d.elm.find('input').spectrum('show');
      $(document).find('.sp-clear').click();
      expect($rootScope.eventSpy).toHaveBeenCalled();
    });

  });

});
