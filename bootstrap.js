// get lib directory
var script = document.querySelector('script');
var libRoot = script.src;
var initScript = script.getAttribute('data-initScript');

var file = libRoot.split('/').pop();
var libRoot = libRoot.replace(file, '');


// add style.css
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = libRoot + 'style.css';
document.querySelector('head').insertBefore(style, document.querySelector('head').childNodes[document.querySelector('head').childNodes.length - 1]);





















/**
* AudioFx
*
* Handles audio using Web Audio Api
*
* @param Array samples - list with samples data buffer
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
function AudioFx(samples){

	this.samples = samples || [];

	this.context = 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();
	this.gainNode = this.context.createGain();
	this.gainNode.connect(this.context.destination);
}
AudioFx.prototype.constructor = AudioFx;

/**
* play
*
* Plays a sample
*
* @param  Arraybuffer sample - data buffer from audio file
* @param  Float volume - range from 0 to 1
* @param  Float time   - timeout to start playing
* @param  Boolean loop - default false
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
AudioFx.prototype.play = function(sample, volume, time, loop){

	if(!sample) return false;

	var time = time || 0;

	// create sound source - from a file
	var bufferSource = this.context.createBufferSource();
	bufferSource.buffer = sample;
	// create gainNode to controll source volume
	var gainNode = this.context.createGain();
	// connect sound source to it's gainNode
	bufferSource.connect(gainNode);
	// loop
	bufferSource.loop = loop || false;
	// connect gainNode to main gainNode
	gainNode.connect(this.gainNode);
	gainNode.gain.value = volume >= 0 ? volume : 1;
	// play the sound!
	bufferSource.start(this.context.currentTime + time);
}

/**
* setVolume
*
* Set main mixer volume
*
* @param Float volume - range from 0 to 1
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
AudioFx.prototype.setVolume = function(volume){

	this.gainNode.gain.value = volume;
}



































/**
* FileRequest
*
* Requests external files and hold all resources loaded
*
* @param Array ArUrl - resources url
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
function FileRequest(ArUrl){

	// current loaded
	this.loaded = 0;
	// total loaded
	this.total = ArUrl.length;
	// resources
	this.resource = {
		url    : [],
		script : [],
		audio  : [],
		image  : [],
		font   : []
	}
	// resources url
	this.resource.url = ArUrl;
	// request files!
	this.request();
}
FileRequest.prototype.constructor = FileRequest;

/**
* request
*
* Request a file
*
* @using XMLHttpRequest - https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
FileRequest.prototype.request = function(){

	// cache this instance
	var File = this;

	// js files loaded
	var _JsFiles = [];
	File.totalJsLoaded = 0;

	// audio files loaded
	var _AudioFiles = [];
	File.totalAudioLoaded = 0;

	// image files loaded
	var _ImageFiles = [];
	File.totalImageLoaded = 0;

	// font files loaded
	var _FontFiles = [];
	File.totalFontLoaded = 0;

	if(File.resource.url.length){
		File.resource.url.forEach(function(url){

			var Request = new XMLHttpRequest();

			// set response type based on file
			if(File.getFileType(url) === 'mp3'){
				Request.responseType = 'arraybuffer';
			}else{
				Request.responseType = 'text';
			}

			Request.onreadystatechange = function(e){

				var response = e.target;

				if(response.readyState == 4){

					switch(File.getFileType(response.responseURL)){

						case 'js' :
						_JsFiles[response.responseURL] = response.responseURL;
						_JsFiles.length++;
						File.resource.script[File.getFileName(response.responseURL)] = response.response;
						File.resource.script.length++;
						break;

						case 'mp3' :
						_AudioFiles.push({
							buffer : response.response,
							name : File.getFileName(response.responseURL),
							type : File.getFileType(response.responseURL)
						});
						break;

						case 'png' : case 'jpg' :
						_ImageFiles.push({
							src : response.responseURL,
							name : File.getFileName(response.responseURL),
							type : File.getFileType(response.responseURL)
						});
						File.resource.image.length++;
						break;

						case 'ttf' :
						_FontFiles.push({
							name : File.getFileName(response.responseURL),
							type : File.getFileType(response.responseURL),
							url  : response.responseURL,
							data : response.response
						});
						break;

					}

					File.loaded++;

				}

			}

			Request.onprogress = function(e){

				var file = e.target.responseURL.split('/').pop();

				var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				var i = parseInt(Math.floor(Math.log(e.loaded) / Math.log(1024)));
				var loaded = Math.round(e.loaded / Math.pow(1024, i), 2) + '' + sizes[i];
				var i = parseInt(Math.floor(Math.log(e.total) / Math.log(1024)));
				var total = Math.round(e.total / Math.pow(1024, i), 2) + '' + sizes[i];

				if(File.onprogress)
					File.onprogress(file, loaded, total);
			}

			Request.onload = function(e){

				if(File.loaded == File.total){

					// preload images files
					File.preloadImageFiles(_ImageFiles, function(){

						// preload fonts files
						File.preloadFontFiles(_FontFiles, function(){

							// preload audio files
							File.preloadAudioFiles(_AudioFiles, function(){

								// preload all js files
								File.preloadJsFiles(_JsFiles, function(){

									// if there is a onload method
									if(File.onload)
										File.onload();

								});
							});
						});
					});
				}
			}

			Request.open('GET', url, true);
			Request.send();

		});

	}else{

		// there is no file to be loaded
		// if there is a onload method
		setTimeout(function(){
			if(File.onload)
				File.onload();
		}, 11);

	}

}

/**
* getFileName
*
* extracts file name from url
*
* @param  String FileUrl
*
* @return String
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
FileRequest.prototype.getFileName = function(FileUrl){

	return FileUrl.split('/').pop().split('.')[0];
}

/**
* getFileType
*
* extracts file type from url
*
* @param  String FileUrl
*
* @return String
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
FileRequest.prototype.getFileType = function(FileUrl){

	return FileUrl.split('/').pop().split('.')[1];
}

/**
* preloadJsFiles
*
* forces preloading all javascript files
*
* @param  Array JsFiles - array containing files urls to be loaded - considers this order
* @param  Function callback
*
* @return Void
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
FileRequest.prototype.preloadJsFiles = function(JsFiles, callback){

	// cache this instance
	var File = this;

	// if there are files to be loaded
	if(JsFiles.length){

		// get only js files from all files that are been included - the order to be considered
		var ArJsFiles = File.resource.url.filter(function(file){
			return File.getFileType(file) === 'js';
		});

		// arranges include order
		var ArIncludeOrder = [];
		while(ArIncludeOrder.length != ArJsFiles.length){
			ArJsFiles.forEach(function(url, i){

				if(JsFiles[url])
					ArIncludeOrder.push(url);

			});
		}

		// preload js files
		ArIncludeOrder.forEach(function(url){

			// create script tag
			var scriptTag = document.createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.async = false;
			scriptTag.src = url;

			// append script tag to html head
			document.querySelector('head').appendChild(scriptTag);

			// load script
			scriptTag.onload = function(){

				File.totalJsLoaded++;

				// if all files are loaded
				if(File.totalJsLoaded == ArJsFiles.length && File.onload){

					document.querySelector('head').removeChild(document.querySelector('script'));

					if(callback)
						callback();

				}

				// removes script tag from head - security
				document.querySelector('head').removeChild(scriptTag);

			}
		});
	}else{
		if(callback)
			callback();
	}
}

/**
* preloadImageFiles
*
* forces preloading all images files
*
* @param  Array ImageFiles - array containing files urls to be loaded
* @param  Function callback
*
* @return Void
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
FileRequest.prototype.preloadImageFiles = function(ImageFiles, callback){

	var File = this;

	// if there is image files to be included
	if(ImageFiles.length){

		// preload image files
		ImageFiles.forEach(function(image){

			// create image tag to force preload
			var imageTag = new Image();
			imageTag.src = image.src;

			// load image
			imageTag.onload = function(){

				File.totalImageLoaded++;

				// add image to resource
				File.resource.image[image.name] = imageTag;

				// if all images are loaded
				if(File.totalImageLoaded == ImageFiles.length){
					if(callback)
						callback()
				}

			}
		});
	}else{
		if(callback)
			callback();
	}

}

/**
* preloadAudioFiles
*
* forces preloading all audio files
*
* @param  Array AudioFiles - array containing files urls to be loaded
* @param  Function callback
*
* @return Void
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
FileRequest.prototype.preloadAudioFiles = function(AudioFiles, callback){

	var File = this;

	// if there is audio files to be included
	if(AudioFiles.length){

		// preload audio files
		AudioFiles.forEach(function(file){

			// create audio context to preload audio files
			var Audio = 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();

			// load audio data
			Audio.decodeAudioData(file.buffer, function(buffer){

				File.totalAudioLoaded++;

				// add audio file to resource
				File.resource.audio[file.name] = buffer;
				File.resource.audio.length++;

				// if all audio files are loaded
				if(File.totalAudioLoaded == AudioFiles.length){
					if(callback)
						callback();
				}
			});

		});
	}else{
		if(callback)
			callback();
	}

}

/**
* preloadFontFiles
*
* forces preloading all font files
*
* @param  Array FontFiles - array containing files urls to be loaded
* @param  Function callback
*
* @uses FontFace [https://drafts.csswg.org/css-font-loading]
*
* @return Void
*
* @author Bruno Andrade <bruno.faria.andrade@gmail.com>
*
*/
FileRequest.prototype.preloadFontFiles = function(FontFiles, callback){

	var File = this;

	// if there is font files to be included
	if(FontFiles.length){

		// preload font files
		FontFiles.forEach(function(file){

			// create a new fontFace object
			var font = new FontFace(file.name, 'url(' + file.url + ')');

			// load font
			font.load().then(function(fontLoaded){

				// add fontFace to document fonts - without it won't work!
				document.fonts.add(fontLoaded);

				File.totalFontLoaded++;

				File.resource.font[file.name] = file.name;
				File.resource.font.length++;

				if(File.totalFontLoaded === FontFiles.length){
					if(callback)
						callback();
				}

			});

		});

	}else{
		if(callback)
			callback();
	}
}

































// load lib files
var libRequest = new FileRequest([
	libRoot + 'Common/Utils.js',
	libRoot + 'Common/FrameRate.js',
	libRoot + 'Common/Timer.js',
	libRoot + 'Common/Tween.js',
	libRoot + 'Common/Timeline.js',
	libRoot + 'Math/Vector.js',
	libRoot + 'Geom/Polygon.js',
	libRoot + 'Geom/Square.js',
	libRoot + 'Geom/Rectangle.js',
	libRoot + 'Geom/Triangle.js',
	libRoot + 'Geom/Circle.js',
	libRoot + 'Geom/Line.js',
	libRoot + 'Physics/CollisionHandler.js',
	libRoot + 'Physics/Body.js',
	libRoot + 'Physics/LengthConstraint.js',
	libRoot + 'Render/Text.js',
	libRoot + 'Render/Shape.js',
	libRoot + 'Render/Scene.js',
	libRoot + 'Render/Movie.js',
	libRoot + 'Render/Pattern.js',
	libRoot + 'Render/SpriteSheet.js',
	libRoot + 'Render/Sprite.js',
	libRoot + 'Resource/Font/pressStart.ttf',
	libRoot + 'Resource/Font/commodore.ttf',
	libRoot + 'Resource/Image/background.png',
	]); 






// and there was light...
libRequest.onload = function(){

	// add signature
	authorSignature();
	
	document.querySelector('body').style.backgroundImage = 'url('+ libRoot + 'Resource/Image/background.png' +')';

	new FileRequest([
		PROJECT_URL + initScript
		]);

}
