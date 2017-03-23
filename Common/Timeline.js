function Timeline(loop, onComplete, repeat){

    this.tweens = [];
    this._tweenIndex = 0;
    this.loop = loop || false;
    this.completed = false;
    this.onComplete = onComplete || undefined;
    this.repeat = repeat || 1;
    this._repeatCount = 0;

}
Timeline.prototype.constructor = Timeline;

Timeline.prototype.add = function(label, frames, reverse){

    var tween = {
        label : label,
        frames : frames
    };
    
    this.tweens.push(tween);

    if(reverse)
        this._addReverse();

    return this;
}

Timeline.prototype._addReverse = function(){

    var lastTween = this.tweens[this.tweens.length - 1];

    var clones = [];

    lastTween.frames.forEach(function(tween){

        var clone = tween.copy();
        var tmpStart = clone.start;
        clone.start = clone.end;
        clone.end = tmpStart;
        clones.push(clone);
        
    });

    this.add(lastTween.label, clones);

}

Timeline.prototype.reset = function(){

    this._tweenIndex = 0;
    this.completed = false;

    for(var i in this.tweens){

        var tween = this.tweens[i];

        tween.frames.forEach(function(frame){

            frame.startTime = window.performance.now();
            frame.completed = false;
            
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

            for(var i in _this.tweens){

                var tween = _this.tweens[i];

                tween.frames.forEach(function(frame){

                    frame.startTime = window.performance.now();

                });
            }

            // completed animation
            if(!_this.tweens[_this._tweenIndex]){

                _this._repeatCount++;

                if(_this._repeatCount < _this.repeat)
                    _this._tweenIndex = 0;
                
                if(_this.loop)
                    _this._tweenIndex = 0;

                if(_this.onComplete){
                    _this.onComplete();
                }
                
                _this.completed = true;
                
            }
        }

    });
}

Timeline.prototype.update = function(label, frame, start, end){

    var _this = this;

    var tmpTween;

    _this.tweens.forEach(function(tween){

        if(tween.label === label){
            tmpTween = tween.frames[frame];
        }

    });

    tmpTween.start = start;
    tmpTween.end = end;

}
