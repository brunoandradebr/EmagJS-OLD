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
    _this.frameRate = new FrameRate();

    // Scene appearance settings
    _this.x = SettingsObject.x || 0;
    _this.y = SettingsObject.y || 0;
    _this.width = SettingsObject.width != null ? SettingsObject.width : DEVICE_WIDTH;
    _this.height = SettingsObject.height != null ? SettingsObject.height : DEVICE_HEIGHT;
    _this.backgroundColor = SettingsObject.backgroundColor || 'transparent';
    _this.fullScreen = SettingsObject.fullScreen || true;
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

    //_this.canvas.style.width = _this.width + 'px';
    //_this.canvas.style.height = _this.height + 'px';
    _this.canvas.width = _this.width;
    _this.canvas.height = _this.height;

    // append canvas to body
    document.querySelector('body').appendChild(_this.canvas);

    // execute onEnter only once
    _this.initialized = false;

    // scene mouse object
    _this.mouse = new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y);
    window.addEventListener('mousemove', function(e){
        _this.mouse.update(e.clientX, e.clientY);
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
    this.canvas.style.top = DEVICE_CENTER_Y - this.height * 0.5 + 'px';
    this.canvas.style.left = DEVICE_CENTER_X - this.width * 0.5 + 'px';
}
