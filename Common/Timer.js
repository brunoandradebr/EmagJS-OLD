function Timer(){

    this.count = 0;

    this.started = false;
    this.paused = false;

}
Timer.prototype.constructor = Timer;

Timer.prototype.start = function(dt){

    if(this.paused)
        return true;

    this.started = true;

    this.count += dt;

}

Timer.prototype.pause = function(){
    this.paused = true;
}

Timer.prototype.resume = function(){
    this.paused = false;
}
