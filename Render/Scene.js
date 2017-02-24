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

    this.ID = ID;

    // Scene appearance settings
    this.x = SettingsObject.x || 0;
    this.y = SettingsObject.y || 0;
    this.width = SettingsObject.width != null ? SettingsObject.width : DEVICE_WIDTH;
    this.height = SettingsObject.height != null ? SettingsObject.height : DEVICE_HEIGHT;
    this.backgroundColor = SettingsObject.backgroundColor || 'transparent';
    this.autoResize = SettingsObject.autoResize || false;
    // Scene states
    this.onEnter = SettingsObject.onEnter;
    this.onLoop = SettingsObject.onLoop;
    this.onLeave = SettingsObject.onLeave;
    this.onUpdateScreen = SettingsObject.onUpdateScreen;
    // Scene canvas and context
    this.canvas = document.createElement('canvas');
    this.canvas.id = ID;
    this.graphics = this.canvas.getContext('2d');
    // Scene canvas appearance
    this.canvas.style.backgroundColor = this.backgroundColor;
    this.canvas.style.left = this.x + 'px';
    this.canvas.style.top = this.y + 'px';
    //this.canvas.style.width = this.width + 'px';
    //this.canvas.style.height = this.height + 'px';
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // append canvas to body
    document.querySelector('body').appendChild(this.canvas);

    // execute onEnter only once
    this.initialized = false;

}
Scene.prototype.constructor = Scene;
