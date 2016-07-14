class Class {

		add(element:HTMLElement,className:string){
			//adds the class
			element.classList.add(className);
		}
		remove(element:HTMLElement,className:string){
			//removes the class
			element.classList.remove(className)
		}
		has(element:HTMLElement,className:string){
			// returns true or false
			return element.classList.contains(className);
		}
}
class PageSlider {
    private _container: HTMLElement;
		private _wrapper:Element;
		private _sections:Array<HTMLElement>;
		private _sectionsCount:number;
		private _class:Class = new Class;
		private _current:number;
		public isSliding:Boolean = false;

    constructor() {
			this._container = document.getElementById('ps-container');
			this._wrapper = this._container.querySelector('div.ps-wrapper');
			this._sections = Array.prototype.slice.call(this._wrapper.querySelectorAll('section'));
			this._sectionsCount = this._sections.length;


			// console.log(this._container,this._wrapper,this._sectionsCount);
    }//constructor

		initalize(){
			this._current = 0;
			// Setup Left Right Navigation
			var that = this,
					navLeft = document.createElement('div'),
					navRight = document.createElement('div'),
					nav = document.createElement('nav');

					navLeft.className = 'ps-nav-left';
					navRight.className = 'ps-nav-right';
					nav.className = 'ps-nav';

					nav.appendChild(navLeft);
					nav.appendChild(navRight);

					this._container.insertBefore(nav,this._wrapper);

					navLeft.addEventListener('click',function(){
						that.navigate('left')
					});
					navRight.addEventListener('click',function(){
						that.navigate('right')
					});

			//Setup initial Classes to the PageSlider
					this._class.add(this._sections[this._current],'pg-current');
					this._class.add (this._sections[this._current + 1],'pg-right');
					this._class.add (this._sections[this._sectionsCount - 1],'pg-left');
					// console.log(nav);

		}

		navigate(direction:string){
			//check if transition is still happening
			if(this.isSliding){
				// console.log('sliding');
				return false;
			}
			this.isSliding = true;

				var left = this._current == 0 ? this._sectionsCount - 1 : this._current - 1,
        right = this._current < this._sectionsCount - 1 ? this._current + 1 : 0,
        mvDir = direction === 'right' ? 'left' : 'right',
        that = this,
        transitions = {
            "transition": "transitionend",
            "OTransition": "oTransitionEnd",
            "MozTransition": "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        },
        nextSection;

    //Finds which transtionEnd is happening
    function transitionFinder() {
        for (var t in transitions) {
            if (that._container.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }
    var transition = transitionFinder();
    // console.log(transition);
	if( direction === 'right' ) {
		nextSection = right < this._sectionsCount - 1 ? right + 1 : 0;

	}
	else if( direction === 'left' ) {
		nextSection = left > 0 ? left - 1 : this._sectionsCount - 1;
		// console.log('sliding right')
	}
	this._class.add(this._container, 'move-' + mvDir);
	this._class.add(this._sections[nextSection],'pg-'+ direction +'-outer');


    var transionEnd = function() {
		that._sections[that._current].removeEventListener(transition, transionEnd);
		that._sections.forEach(
			function(el , i){
				el.className = 'ps-page'
			}
		)
		// console.log('complete');
		if(direction === 'right'){
			// console.log('sliding left')
			that._class.add(that._sections[that._current],'pg-left');
			that._class.add(that._sections[right],'pg-current')
			that._class.add(that._sections[nextSection],'pg-right')
			that._current = that._current < that._sectionsCount -1 ? that._current + 1 : 0
		} else if (direction === 'left'){
			// console.log('sliding right')
			that._class.add(that._sections[that._current],'pg-right');
			that._class.add(that._sections[left],'pg-current');
			that._class.add(that._sections[nextSection],'pg-left')
			that._current = that._current > 0 ? that._current - 1 : that._sectionsCount - 1

		}
		that._class.remove(that._container, 'move-' + mvDir);
		that.isSliding = false;

    }
    this._sections[this._current].addEventListener(transition, transionEnd);
}//navigate

}

var pageSlider = new PageSlider;
pageSlider.initalize();
