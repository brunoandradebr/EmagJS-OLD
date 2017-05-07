# EmagJS 
A game engine made from the scratch for the purpose of studying game development. current prototype <a target="_blank" href="http://www.acobaia.com.br/prototipo">here</a>


## Usage

**Create your project structure** : <br>
* **App/**
  * Index.html
  * Script.js
  * EmagJs/
  
<br>

**App/index.html** :

```html
<html>

<head>
  <script src="../EmagJS/bootstrap.js" data-initScript="Script.js"></script>
</head>

<body> <!-- Nothing goes here --> </body>

</html>
```
**data-initScript** indicates the very first script to execute after EmagJS lib is loaded. <br>

That's all you need to start using the engine :D
<br>

## Hello World!

**App/Script.js**
```js
// create a movie handler
var MainMovie = new Movie();

// add a new scene to the movie
MainMovie.addScene('main', {

    // ever you enter the main scene
    onEnter : function(scene){
        
        // create a sprite
        scene.box = new Sprite();
        scene.box.position.update(DEVICE_CENTER_X, DEVICE_CENTER_Y);
        scene.box.fillColor = 'orange';
        
    },

    // main scene loop. where everything happens =)
    onLoop : function(scene, dt){

        // draw the sprite
        scene.box.draw(scene.graphics, dt);

    },
  
    // ever change orientation or resize screen
    onUpdateScreen : function(scene){

        scene.box.position.update(DEVICE_CENTER_X, DEVICE_CENTER_Y);

    }

});

// play movie's scenes. there's only the main scene, so, it's the scene to play
MainMovie.playMovie();
