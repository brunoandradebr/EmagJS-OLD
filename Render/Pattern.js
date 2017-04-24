function Pattern(image, repetition){

    var repetition = repetition || 'repeat';

    var tmpCanvas = document.createElement('canvas');
    var tmpContext = tmpCanvas.getContext('2d');

    this.fill = tmpContext.createPattern(image, repetition);
}
Pattern.prototype.constructor = Pattern;
