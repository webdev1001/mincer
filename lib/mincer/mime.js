/** internal
 *  mixin Mime
 *
 *  An internal mixin whose public methods are exposed on the [[Environment]]
 *  and [[Index]] classes.
 *
 *  Provides helpers to deal with mime types.
 **/


'use strict';


// 3rd-party
var _ = require('underscore');
var mime = require('mime');


// internal
var getter = require('./common').getter;


// get version of extensions to mimetype (and vice-vera) map
// that fits our needs
var generic_mime = new mime.Mime({
  loadBuiltins: true,
  defaultType:  mime.default_type,
  normalize:    require('./common').normalizeExtension
});


/**
 *  Mime#mimeTypes([ext]) -> String|Object
 *
 *  Returns a `Has` of registered mime types registered on the
 *  environment and those part of `mime` Node module.
 *
 *  If an `ext` is given, it will lookup the mime type for that extension.
 **/
module.exports.mimeTypes = function (ext) {
  if (!ext) {
    return _.extend({}, generic_mime.types, this.__mimeTypes__);
  }

  return this.__mimeTypes__.lookup(ext) || generic_mime.lookup(ext);
};


/**
 *  Mime#registeredMimeTypes -> Object
 *
 *  Returns a `Hash` of explicitly registered mime types.
 **/
getter(module.exports, 'registeredMimeTypes', function () {
  return _.clone(this.__mimeTypes__.types);
});


/**
 *  Mime#extensionForMimeType(type) -> String
 *
 *  Returns extension for mime `type`.
 **/
module.exports.extensionForMimeType = function (type) {
  return this.__mimeTypes__.extension(type) || generic_mime.extension(type);
};


/**
 *  Mime#registeredMimeTypes(type, ext) -> Void
 *
 *  Register new mime type.
 **/
module.exports.registerMimeType = function (mimeType, ext) {
  var map = {};

  map[mimeType] = [ext];

  this.__mimeTypes__.define(map);
};