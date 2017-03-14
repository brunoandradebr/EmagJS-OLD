function Timeline(loop, onComplete, repeat){

    this.tweens = [];
    this._tweenIndex = 0;
    this.loop = loop || false;
    this.onComplete = onComplete || undefined;
    this.repeat = repeat || 1;
    this._repeatCount = 0;

}
Timeline.prototype.constructor = Timeline;

Timeline.prototype.add = function(label, frames){

    var tween = {
        label : label,
        frames : frames
    };
    
    this.tweens.push(tween);

    return this;
}

Timeline.prototype.reset = function(){
    for(var i in this.tweens){

        var tween = this.tweens[i];

        tween.frames.forEach(function(frame){

            frame.startTime = window.performance.now();
            
        });
    }
}

Timeline.prototype.play = function(){

    var _this = this;

    if(!_this.tweens[_this._tweenIndex])
        return false;

    var currentTween = _this.tweens[_this._tweenIndex];
    var currentTweenFrames = currentTween.frames;
    var currentTweenFramesLength = currentTweenFrames.length;
    
    var totalFramesPlayed = 0;
    currentTweenFrames.forEach(function(frame){

        frame.play();

        if(frame.completed){
            totalFramesPlayed++;
        }

        if(totalFramesPlayed == currentTweenFramesLength){

            if(_this.loop || _this.repeat > 1)
                frame.completed = false;
            
            _this._tweenIndex++;
            _this.reset();

            // completed animation
            if(!_this.tweens[_this._tweenIndex]){

                _this._repeatCount++;

                if(_this._repeatCount < _this.repeat)
                    _this._tweenIndex = 0;
                
                if(_this.loop)
                    _this._tweenIndex = 0;

                if(_this.onComplete)
                    _this.onComplete();
                
            }
        }

    });
}
