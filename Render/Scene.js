/**
* Scene
*
* render hendler.
*
* Creates and add to body a canvas element to draw stuffs.
*
* Handled by Movie.
*
* @property String ID
* @property Object SettingsObject
*
* @author  Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
function Scene(ID, SettingsObject){

    var _this = this;
    
    _this.ID = ID;
    

    // frame rate debug
    if(SettingsObject.showFrameRate){
        _this.showFrameRate = SettingsObject.showFrameRate || false;
    }
    
    _this.frameRate = new FrameRate();

    // Scene appearance settings
    _this.x = SettingsObject.x || 0;
    _this.y = SettingsObject.y || 0;
    _this.width = SettingsObject.width != null ? SettingsObject.width : DEVICE_WIDTH;
    _this.height = SettingsObject.height != null ? SettingsObject.height : DEVICE_HEIGHT;
    _this.backgroundColor = SettingsObject.backgroundColor || 'transparent';
    _this.fullScreen = SettingsObject.fullScreen == null ? true : SettingsObject.fullScreen;
    // Scene states
    _this.onEnter = SettingsObject.onEnter;
    _this.onLoop = SettingsObject.onLoop;
    _this.onLeave = SettingsObject.onLeave;
    _this.onUpdateScreen = SettingsObject.onUpdateScreen;
    // Scene canvas and context
    _this.canvas = document.createElement('canvas');
    _this.canvas.id = ID;
    _this.graphics = _this.canvas.getContext('2d');
    // Scene canvas appearance
    _this.canvas.style.backgroundColor = _this.backgroundColor;
    _this.canvas.style.left = _this.x + 'px';
    _this.canvas.style.top = _this.y + 'px';
    
    // center scene
    if(SettingsObject.autoCenter){
        _this.center();
    }

    _this.canvas.width = _this.width;
    _this.canvas.height = _this.height;

    _this.centerX = _this.x + _this.width * 0.5;
    _this.centerY = _this.y + _this.height * 0.5;

    // append canvas to body
    document.querySelector('body').appendChild(_this.canvas);

    // execute onEnter only once
    _this.initialized = false;

    // scene mouse object
    _this.mouse = new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y);
    window.addEventListener('mousemove', function(e){
        if(!MOBILE)
            _this.mouse.update(e.clientX - _this.x, e.clientY - _this.y);
    });
    _this.canvas.addEventListener('mousedown', function(e){
        if(!MOBILE)
            _this.mouse.update(e.clientX - _this.x, e.clientY - _this.y);
    });
    _this.canvas.addEventListener('touchstart', function(e){
        _this.mouse.update(e.touches[0].clientX, e.touches[0].clientY);
    });
    _this.canvas.addEventListener('touchmove', function(e){
        _this.mouse.update(e.touches[0].clientX, e.touches[0].clientY);
    });

}
Scene.prototype.constructor = Scene;

Scene.prototype.center = function(){
    var top = DEVICE_CENTER_Y - this.height * 0.5;
    var left = DEVICE_CENTER_X - this.width * 0.5;
    this.canvas.style.top = top + 'px';
    this.canvas.style.left = left + 'px';
    this.x = left;
    this.y = top;
}
