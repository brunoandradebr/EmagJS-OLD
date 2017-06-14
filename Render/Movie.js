/**
* Movie
*
* Scene handler. play, pause and resume a scene.
* May have many scenes. Scenes can play all together or solo.
* All scenes share the same RequestAnimationFrame
*
* @property Array scenes
* @property Array pausedScenes
* @property String RAFID - RequestAnimationFrame
*
* author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
function Movie(fps){

    this.fps = fps || 60;
    this.ifps = 1 / this.fps;
    this.scenes = [];
    this.pausedScenes = [];
    this.RAFID = undefined;

}
Movie.prototype.constructor = Movie;


/**
* [public] addScene()
*
* Add a Scene Object to be handled by Movie.
* Receives a Object and create a new Scene Object.
*
* @param String SceneID
* @param Scene  Object
*
* @return Void
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
Movie.prototype.addScene = function(SceneID, SceneObject){

    this.scenes[SceneID] = new Scene(SceneID, SceneObject);
    this.scenes.length++;

}


/**
* [public] playScene()
*
* Run onEnter and onLoop states.
*
* @param Array ArSceneID
*
* @return Void
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
Movie.prototype.playScene = function(ArSceneID){

    var _this = this;

    var scenes = [];

    for(var i = 0; i < ArSceneID.length; i++){

        var Scene = _this.scenes[ArSceneID[i]];

        if(Scene.onEnter && !Scene.initialized){

            window.addEventListener('resize', function(e){

                if(Scene.fullScreen){
                    Scene.width = DEVICE_WIDTH;
                    Scene.height = DEVICE_HEIGHT;
                    Scene.canvas.width = Scene.width;
                    Scene.canvas.height = Scene.height;
                }

                Scene.center();

                if(Scene.onUpdateScreen){
                    Scene.onUpdateScreen(Scene);
                }
            });

            Scene.onEnter(Scene);
        }

        if(Scene.onLoop)
            scenes.push(Scene);

        Scene.initialized = true;

    }

    var last = window.performance.now();

    (Loop = function(){

        var dt = window.performance.now() - last;

        // limit max fps to _this.fps
        dt = Math.min(dt, _this.ifps * 1000);

        scenes.forEach(function(Scene, i){

            var paused = false;

            _this.pausedScenes.forEach(function(pausedSceneID){
                if(pausedSceneID === Scene.ID)
                    paused = true;
            });

            requestAnimationFrame(function(){
                if(!paused){
                    Scene.graphics.clearRect(0, 0, Scene.graphics.canvas.width, Scene.graphics.canvas.height);
                    Scene.onLoop(Scene, (dt * 0.001 /* dt / 1000 */) * _this.fps);
                    if(Scene.frameRate && Scene.showFrameRate)
                        Scene.frameRate.draw(Scene.graphics);
                }
            });

        });

        last = window.performance.now();

        _this.RAFID = requestAnimationFrame(Loop);
    });
    _this.RAFID = requestAnimationFrame(Loop);

}


/**
* [public] pauseScene()
*
* Pauses a scene.
*
* @param  String SceneID
*
* @return Void
*
* Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
Movie.prototype.pauseScene = function(SceneID){

    var _this = this;

    // if there are repeated scenes to pause, pause only one
    if(_this.pausedScenes.length){
        _this.pausedScenes.forEach(function(pausedSceneID){
            if(pausedSceneID != SceneID)
                _this.pausedScenes.push(SceneID);
        });
    }else{
        _this.pausedScenes.push(SceneID);
    }
}


/**
* [public] resumeScene()
*
* Resume a paused scene.
*
* @param  String SceneID [description]
*
* @return Void
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
Movie.prototype.resumeScene = function(SceneID){
    var _this = this;
    _this.pausedScenes.forEach(function(pausedSceneID, i){
        if(pausedSceneID === SceneID)
            _this.pausedScenes.splice(i, 1);
    });
}


/**
* [public] getScene()
*
* @param  String SceneID
* @param  String property - Scene property name
*
* @return [Scene || mixed scene property name]
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
Movie.prototype.getScene = function(SceneID, property){
    var _return = (property) ? this.scenes[SceneID][property] : this.scenes[SceneID];
    return _return;
}


/**
* playMovie()
*
* Plays all scenes that were paused
*
* @return Void
*
* @author Bruno Faria de Andrade <bruno.faria.andrade@gmail.com>
*
*/
Movie.prototype.playMovie = function(){

    // if already playing; skip
    if(this.RAFID)
        return false;

    var scenesID = [];

    for(var i in this.scenes){
        var Scene = this.scenes[i];
        scenesID.push(Scene.ID);
    }

    this.playScene(scenesID);

}


/**
* stopMovie()
*
* Stop all scenes that were playing before
*
* @return Void
*
* @author Bruno Faria de Andrade <bruno.faria.andrade@gmail.com>
*
*/
Movie.prototype.stopMovie = function(){
    cancelAnimationFrame(this.RAFID);
    this.RAFID = undefined;
}


/**
* destroy()
*
* Stop all scenes that were playing and remove scene canvas
*
* @return Void
*
* @author Bruno Faria de Andrade <bruno.faria.andrade@gmail.com>
*
*/
Movie.prototype.destroy = function(){

    this.stopMovie();

    for(var i in this.scenes){
        var Scene = this.scenes[i];
        Scene.destroyed = true;
        var sceneCanvas = document.querySelector('#' + this.scenes[i].ID);
        sceneCanvas.parentNode.removeChild(sceneCanvas);
    }

}
