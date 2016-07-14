/**
 * pgSlider.js v1.0.1
 * http://abhijeetbajracharya.com/demo/sliding-pages/
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2016, Abhijeet Bajracharya
 * http://abhijeetbajracharya.com
 */
var Class = (function () {
    function Class() {
    }
    Class.prototype.add = function (element, className) {
        //adds the class
        element.classList.add(className);
    };
    Class.prototype.remove = function (element, className) {
        //removes the class
        element.classList.remove(className);
    };
    Class.prototype.has = function (element, className) {
        // returns true or false
        return element.classList.contains(className);
    };
    return Class;
}());
var PageSlider = (function () {
    function PageSlider() {
        this._class = new Class;
        this.isSliding = false;
        this._container = document.getElementById('ps-container');
        this._wrapper = this._container.querySelector('div.ps-wrapper');
        this._sections = Array.prototype.slice.call(this._wrapper.querySelectorAll('section'));
        this._sectionsCount = this._sections.length;
        if (this._sectionsCount > 3) {
            this._class.add(this._container, 'ps-outer');
        }
    } //constructor
    PageSlider.prototype.initalize = function () {
        if (this._sectionsCount < 4) {
            return false;
        }
        this._current = 0;
        // Setup Left Right Navigation
        var that = this, navLeft = document.createElement('div'), navRight = document.createElement('div'), nav = document.createElement('nav');
        navLeft.className = 'ps-nav-left';
        navRight.className = 'ps-nav-right';
        nav.className = 'ps-nav';
        nav.appendChild(navLeft);
        nav.appendChild(navRight);
        this._container.insertBefore(nav, this._wrapper);
        navLeft.addEventListener('click', function () {
            that.navigate('left');
        });
        navRight.addEventListener('click', function () {
            that.navigate('right');
        });
        //Setup initial Classes to the PageSlider
        this._class.add(this._sections[this._current], 'pg-current');
        this._class.add(this._sections[this._current + 1], 'pg-right');
        this._class.add(this._sections[this._sectionsCount - 1], 'pg-left');
    };
    PageSlider.prototype.navigate = function (direction) {
        //check if transition is still happening
        if (this.isSliding) {
            return false;
        }
        this.isSliding = true;
        var left = this._current == 0 ? this._sectionsCount - 1 : this._current - 1, right = this._current < this._sectionsCount - 1 ? this._current + 1 : 0, mvDir = direction === 'right' ? 'left' : 'right', that = this, transitions = {
            "transition": "transitionend",
            "OTransition": "oTransitionEnd",
            "MozTransition": "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        }, nextSection;
        //Finds which transtionEnd is happening
        function transitionFinder() {
            for (var t in transitions) {
                if (that._container.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }
        var transition = transitionFinder();
        if (direction === 'right') {
            nextSection = right < this._sectionsCount - 1 ? right + 1 : 0;
        }
        else if (direction === 'left') {
            nextSection = left > 0 ? left - 1 : this._sectionsCount - 1;
        }
        this._class.add(this._container, 'move-' + mvDir);
        this._class.add(this._sections[nextSection], 'pg-' + direction + '-outer');
        var transionEnd = function () {
            that._sections[that._current].removeEventListener(transition, transionEnd);
            that._sections.forEach(function (el, i) {
                el.className = 'ps-page';
            });
            if (direction === 'right') {
                that._class.add(that._sections[that._current], 'pg-left');
                that._class.add(that._sections[right], 'pg-current');
                that._class.add(that._sections[nextSection], 'pg-right');
                that._current = that._current < that._sectionsCount - 1 ? that._current + 1 : 0;
            }
            else if (direction === 'left') {
                that._class.add(that._sections[that._current], 'pg-right');
                that._class.add(that._sections[left], 'pg-current');
                that._class.add(that._sections[nextSection], 'pg-left');
                that._current = that._current > 0 ? that._current - 1 : that._sectionsCount - 1;
            }
            that._class.remove(that._container, 'move-' + mvDir);
            that.isSliding = false;
        };
        this._sections[this._current].addEventListener(transition, transionEnd);
    }; //navigate
    return PageSlider;
}());
var pageSlider = new PageSlider;
pageSlider.initalize();
//# sourceMappingURL=pgSlider.js.map