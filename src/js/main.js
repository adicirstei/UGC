
require.config({
  shim: {
    'Box2dWeb': {
      exports: 'Box2D'
    },
    'easeljs': {
      exports: 'createjs'
    },
    'soundjs': {
      exports: 'createjs'
    },
    'preloadjs': {
      exports: 'createjs'
    }    
  },
  paths: {
    'Box2dWeb': '../components/box2dweb/Box2dWeb-2.1.a.3',
    'easeljs': '../components/easeljs/index',
    'soundjs': '../components/soundjs/index',
    'preloadjs': '../components/preloadjs/index'
  }
});


require(['app'], function (app) {
    'use strict';
});