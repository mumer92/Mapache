/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "a1649461513762c8d65b"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3000/assets/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(24)(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/*!***********************************************************!*\
  !*** ../node_modules/html-entities/lib/html5-entities.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 2 */
/*!*************************************!*\
  !*** ./build/helpers/hmr-client.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var hotMiddlewareScript = __webpack_require__(/*! webpack-hot-middleware/client?noInfo=true&timeout=20000&reload=true */ 3);

hotMiddlewareScript.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});


/***/ }),
/* 3 */
/*!**********************************************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/client.js?noInfo=true&timeout=20000&reload=true ***!
  \**********************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true,
  overlayStyles: {},
  overlayWarnings: false,
  ansiColors: {}
};
if (true) {
  var querystring = __webpack_require__(/*! querystring */ 5);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }

  if (overrides.ansiColors) options.ansiColors = JSON.parse(overrides.ansiColors);
  if (overrides.overlayStyles) options.overlayStyles = JSON.parse(overrides.overlayStyles);

  if (overrides.overlayWarnings) {
    options.overlayWarnings = overrides.overlayWarnings == 'true';
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(/*! strip-ansi */ 8);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(/*! ./client-overlay */ 10)({
      ansiColors: options.ansiColors,
      overlayStyles: options.overlayStyles
    });
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay) {
        if (options.overlayWarnings || type === 'errors') {
          overlay.showProblems(type, obj[type]);
          return false;
        }
        overlay.clear();
      }
      return true;
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(/*! ./process-update */ 15);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      var applyUpdate = true;
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
        applyUpdate = false;
      } else if (obj.warnings.length > 0) {
        if (reporter) {
          var overlayShown = reporter.problems('warnings', obj);
          applyUpdate = overlayShown;
        }
      } else {
        if (reporter) {
          reporter.cleanProblemsCache();
          reporter.success();
        }
      }
      if (applyUpdate) {
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?noInfo=true&timeout=20000&reload=true", __webpack_require__(/*! ./../webpack/buildin/module.js */ 4)(module)))

/***/ }),
/* 4 */
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/module.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 5 */
/*!************************************************!*\
  !*** ../node_modules/querystring-es3/index.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 6);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 7);


/***/ }),
/* 6 */
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/decode.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 7 */
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/encode.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 8 */
/*!*******************************************!*\
  !*** ../node_modules/strip-ansi/index.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ 9)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 9 */
/*!*******************************************!*\
  !*** ../node_modules/ansi-regex/index.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 10 */
/*!****************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/client-overlay.js ***!
  \****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};

var ansiHTML = __webpack_require__(/*! ansi-html */ 11);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};

var Entities = __webpack_require__(/*! html-entities */ 12).AllHtmlEntities;
var entities = new Entities();

function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
}

function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
}

function problemType (type) {
  var problemColors = {
    errors: colors.red,
    warnings: colors.yellow
  };
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}

module.exports = function(options) {
  for (var color in options.overlayColors) {
    if (color in colors) {
      colors[color] = options.overlayColors[color];
    }
    ansiHTML.setColors(colors);
  }

  for (var style in options.overlayStyles) {
    styles[style] = options.overlayStyles[style];
  }

  for (var key in styles) {
    clientOverlay.style[key] = styles[key];
  }

  return {
    showProblems: showProblems,
    clear: clear
  }
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),
/* 11 */
/*!******************************************!*\
  !*** ../node_modules/ansi-html/index.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 12 */
/*!**********************************************!*\
  !*** ../node_modules/html-entities/index.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(/*! ./lib/xml-entities.js */ 13),
  Html4Entities: __webpack_require__(/*! ./lib/html4-entities.js */ 14),
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 1),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 1)
};


/***/ }),
/* 13 */
/*!*********************************************************!*\
  !*** ../node_modules/html-entities/lib/xml-entities.js ***!
  \*********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 14 */
/*!***********************************************************!*\
  !*** ../node_modules/html-entities/lib/html4-entities.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 15 */
/*!****************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/process-update.js ***!
  \****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 16 */
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 17 */
/*!**************************************!*\
  !*** ./scripts/app/app.lazy-load.js ***!
  \**************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vanilla_lazyload__ = __webpack_require__(/*! vanilla-lazyload */ 41);


var lazyLoadOptions = {
  elements_selector: '.lazy-load-image',
  threshold: 0,
}

/* harmony default export */ __webpack_exports__["a"] = (function () { return new __WEBPACK_IMPORTED_MODULE_0_vanilla_lazyload__["a" /* default */](lazyLoadOptions) });


/***/ }),
/* 18 */
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/cache-loader/dist/cjs.js!../node_modules/css-loader?{"sourceMap":true}!../node_modules/postcss-loader/lib?{"config":{"path":"C://Users//Smigol//Projects//ghost//content//themes//mapache//src//build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]","paths":{"root":"C://Users//Smigol//Projects//ghost//content//themes//mapache","assets":"C://Users//Smigol//Projects//ghost//content//themes//mapache//src","dist":"C://Users//Smigol//Projects//ghost//content//themes//mapache//assets"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":["**_/*.hbs"],"entry":{"main":["./scripts/main.js","./styles/main.scss"],"amp":["./scripts/amp.js","./styles/amp.scss"]},"publicPath":"/assets/","devUrl":"http://localhost:2368","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!../node_modules/resolve-url-loader?{"sourceMap":true}!../node_modules/sass-loader/lib/loader.js?{"sourceMap":true,"sourceComments":true}!../node_modules/import-glob!./styles/main.scss ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(/*! ../../node_modules/css-loader/lib/url/escape.js */ 52);
exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ 19)(true);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n\n/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n/* line 11, node_modules/normalize.css/normalize.css */\n\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\n/* line 23, node_modules/normalize.css/normalize.css */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\n/* line 31, node_modules/normalize.css/normalize.css */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\n/* line 40, node_modules/normalize.css/normalize.css */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\n/* line 53, node_modules/normalize.css/normalize.css */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 64, node_modules/normalize.css/normalize.css */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\n/* line 76, node_modules/normalize.css/normalize.css */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\n/* line 85, node_modules/normalize.css/normalize.css */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\n/* line 95, node_modules/normalize.css/normalize.css */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 105, node_modules/normalize.css/normalize.css */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\n/* line 116, node_modules/normalize.css/normalize.css */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\n/* line 125, node_modules/normalize.css/normalize.css */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\n/* line 133, node_modules/normalize.css/normalize.css */\n\nsub {\n  bottom: -0.25em;\n}\n\n/* line 137, node_modules/normalize.css/normalize.css */\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\n/* line 148, node_modules/normalize.css/normalize.css */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\n/* line 160, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\n/* line 176, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\n/* line 186, node_modules/normalize.css/normalize.css */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\n/* line 195, node_modules/normalize.css/normalize.css */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\n/* line 206, node_modules/normalize.css/normalize.css */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\n/* line 218, node_modules/normalize.css/normalize.css */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\n/* line 229, node_modules/normalize.css/normalize.css */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\n/* line 240, node_modules/normalize.css/normalize.css */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\n/* line 253, node_modules/normalize.css/normalize.css */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\n/* line 261, node_modules/normalize.css/normalize.css */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n/* line 270, node_modules/normalize.css/normalize.css */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n/* line 280, node_modules/normalize.css/normalize.css */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n/* line 290, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n/* line 299, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n/* line 308, node_modules/normalize.css/normalize.css */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\n/* line 320, node_modules/normalize.css/normalize.css */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\n/* line 328, node_modules/normalize.css/normalize.css */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\n/* line 339, node_modules/normalize.css/normalize.css */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n/* line 347, node_modules/normalize.css/normalize.css */\n\n[hidden] {\n  display: none;\n}\n\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\n/* line 7, node_modules/prismjs/themes/prism.css */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none;\n}\n\n/* line 30, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::-moz-selection,\npre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection,\ncode[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n/* line 36, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::selection,\npre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection,\ncode[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n@media print {\n  /* line 43, node_modules/prismjs/themes/prism.css */\n\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none;\n  }\n}\n\n/* Code blocks */\n\n/* line 50, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n}\n\n/* line 56, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0;\n}\n\n/* Inline code */\n\n/* line 62, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal;\n}\n\n/* line 68, node_modules/prismjs/themes/prism.css */\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray;\n}\n\n/* line 75, node_modules/prismjs/themes/prism.css */\n\n.token.punctuation {\n  color: #999;\n}\n\n/* line 79, node_modules/prismjs/themes/prism.css */\n\n.namespace {\n  opacity: .7;\n}\n\n/* line 83, node_modules/prismjs/themes/prism.css */\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905;\n}\n\n/* line 93, node_modules/prismjs/themes/prism.css */\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690;\n}\n\n/* line 102, node_modules/prismjs/themes/prism.css */\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #9a6e3a;\n  background: rgba(255, 255, 255, 0.5);\n}\n\n/* line 111, node_modules/prismjs/themes/prism.css */\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a;\n}\n\n/* line 117, node_modules/prismjs/themes/prism.css */\n\n.token.function,\n.token.class-name {\n  color: #DD4A68;\n}\n\n/* line 122, node_modules/prismjs/themes/prism.css */\n\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90;\n}\n\n/* line 128, node_modules/prismjs/themes/prism.css */\n\n.token.important,\n.token.bold {\n  font-weight: bold;\n}\n\n/* line 132, node_modules/prismjs/themes/prism.css */\n\n.token.italic {\n  font-style: italic;\n}\n\n/* line 136, node_modules/prismjs/themes/prism.css */\n\n.token.entity {\n  cursor: help;\n}\n\n/* line 1, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\n/* line 7, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n/* line 12, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n/* line 29, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n/* line 35, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n/* line 1, src/styles/common/_mixins.scss */\n\n.link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n/* line 7, src/styles/common/_mixins.scss */\n\n.link--accent {\n  color: var(--primary-color);\n  text-decoration: none;\n}\n\n/* line 22, src/styles/common/_mixins.scss */\n\n.u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n/* line 30, src/styles/common/_mixins.scss */\n\n.u-textColorDarker {\n  color: rgba(0, 0, 0, 0.8) !important;\n  fill: rgba(0, 0, 0, 0.8) !important;\n}\n\n/* line 35, src/styles/common/_mixins.scss */\n\n.warning::before,\n.note::before,\n.success::before,\n[class^=\"i-\"]::before,\n[class*=\" i-\"]::before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* line 2, src/styles/autoload/_zoom.scss */\n\nimg[data-action=\"zoom\"] {\n  cursor: -webkit-zoom-in;\n  cursor: zoom-in;\n}\n\n/* line 5, src/styles/autoload/_zoom.scss */\n\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  transition: all 300ms;\n}\n\n/* line 13, src/styles/autoload/_zoom.scss */\n\nimg.zoom-img {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: -moz-zoom-out;\n}\n\n/* line 18, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  filter: \"alpha(opacity=0)\";\n  opacity: 0;\n  -webkit-transition: opacity 300ms;\n  -o-transition: opacity 300ms;\n  transition: opacity 300ms;\n}\n\n/* line 33, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open .zoom-overlay {\n  filter: \"alpha(opacity=100)\";\n  opacity: 1;\n}\n\n/* line 37, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open,\n.zoom-overlay-transitioning {\n  cursor: default;\n}\n\n/* line 1, src/styles/common/_global.scss */\n\n:root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d;\n}\n\n/* line 15, src/styles/common/_global.scss */\n\n*,\n*::before,\n*::after {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n/* line 19, src/styles/common/_global.scss */\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* line 23, src/styles/common/_global.scss */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* line 29, src/styles/common/_global.scss */\n\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px;\n}\n\n/* line 42, src/styles/common/_global.scss */\n\nblockquote p:first-of-type {\n  margin-top: 0;\n}\n\n/* line 45, src/styles/common/_global.scss */\n\nbody {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 16px;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden;\n}\n\n/* line 59, src/styles/common/_global.scss */\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  font-size: 16px;\n}\n\n/* line 64, src/styles/common/_global.scss */\n\nfigure {\n  margin: 0;\n}\n\n/* line 68, src/styles/common/_global.scss */\n\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  -webkit-font-feature-settings: \"liga\" on, \"lnum\" on;\n          font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 0.9375rem;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n/* line 89, src/styles/common/_global.scss */\n\nkbd,\nsamp,\ncode {\n  background: #f7f7f7;\n  border-radius: 4px;\n  color: #c7254e;\n  font-family: \"Roboto Mono\", Dank Mono, Fira Mono, monospace !important;\n  font-size: 15px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\n/* line 99, src/styles/common/_global.scss */\n\npre {\n  background-color: #f7f7f7 !important;\n  border-radius: 4px;\n  font-family: \"Roboto Mono\", Dank Mono, Fira Mono, monospace !important;\n  font-size: 15px;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal;\n}\n\n/* line 111, src/styles/common/_global.scss */\n\npre code {\n  background: transparent;\n  color: #37474f;\n  padding: 0;\n  text-shadow: 0 1px #fff;\n}\n\n/* line 119, src/styles/common/_global.scss */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #37474f;\n  line-height: 1.4;\n}\n\n/* line 124, src/styles/common/_global.scss */\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\n/* line 126, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\n/* line 129, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\n/* line 140, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\n/* line 145, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\n/* line 155, src/styles/common/_global.scss */\n\nhr:not(.hr-list) {\n  margin: 40px auto 10px;\n  height: 1px;\n  background-color: #ddd;\n  border: 0;\n  max-width: 100%;\n}\n\n/* line 163, src/styles/common/_global.scss */\n\n.post-footer-hr {\n  margin: 32px 0;\n}\n\n/* line 170, src/styles/common/_global.scss */\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\n/* line 176, src/styles/common/_global.scss */\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n/* line 181, src/styles/common/_global.scss */\n\ni {\n  vertical-align: middle;\n}\n\n/* line 186, src/styles/common/_global.scss */\n\ninput {\n  border: none;\n  outline: 0;\n}\n\n/* line 191, src/styles/common/_global.scss */\n\nol,\nul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\n/* line 198, src/styles/common/_global.scss */\n\nmark {\n  background-color: transparent !important;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#d7fdd3), to(#d7fdd3));\n  background-image: -webkit-linear-gradient(top, #d7fdd3, #d7fdd3);\n  background-image: -o-linear-gradient(top, #d7fdd3, #d7fdd3);\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 204, src/styles/common/_global.scss */\n\nq {\n  color: rgba(0, 0, 0, 0.44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left;\n}\n\n/* line 216, src/styles/common/_global.scss */\n\nq::before,\nq::after {\n  display: none;\n}\n\n/* line 219, src/styles/common/_global.scss */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n/* line 234, src/styles/common/_global.scss */\n\ntable th,\ntable td {\n  padding: 6px 13px;\n  border: 1px solid #dfe2e5;\n}\n\n/* line 240, src/styles/common/_global.scss */\n\ntable tr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\n/* line 244, src/styles/common/_global.scss */\n\ntable th {\n  letter-spacing: 0.2px;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n\n/* line 258, src/styles/common/_global.scss */\n\n.link--underline:active,\n.link--underline:focus,\n.link--underline:hover {\n  text-decoration: underline;\n}\n\n/* line 268, src/styles/common/_global.scss */\n\n.main {\n  margin-bottom: 4em;\n  min-height: 90vh;\n}\n\n/* line 270, src/styles/common/_global.scss */\n\n.main,\n.footer {\n  -webkit-transition: -webkit-transform .5s ease;\n  transition: -webkit-transform .5s ease;\n  -o-transition: -o-transform .5s ease;\n  transition: transform .5s ease;\n  transition: transform .5s ease, -webkit-transform .5s ease, -o-transform .5s ease;\n}\n\n/* line 275, src/styles/common/_global.scss */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n/* line 278, src/styles/common/_global.scss */\n\n.warning::before {\n  content: \"\\E002\";\n}\n\n/* line 281, src/styles/common/_global.scss */\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n/* line 284, src/styles/common/_global.scss */\n\n.note::before {\n  content: \"\\E907\";\n}\n\n/* line 287, src/styles/common/_global.scss */\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n/* line 290, src/styles/common/_global.scss */\n\n.success::before {\n  color: #00bfa5;\n  content: \"\\E86C\";\n}\n\n/* line 293, src/styles/common/_global.scss */\n\n.warning,\n.note,\n.success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px;\n}\n\n/* line 300, src/styles/common/_global.scss */\n\n.warning a,\n.note a,\n.success a {\n  color: inherit;\n  text-decoration: underline;\n}\n\n/* line 305, src/styles/common/_global.scss */\n\n.warning::before,\n.note::before,\n.success::before {\n  float: left;\n  font-size: 24px;\n  margin-left: -36px;\n  margin-top: -5px;\n}\n\n/* line 318, src/styles/common/_global.scss */\n\n.tag-description {\n  max-width: 700px;\n  font-size: 1.2rem;\n  font-weight: 300;\n  line-height: 1.4;\n}\n\n/* line 324, src/styles/common/_global.scss */\n\n.tag.has--image {\n  min-height: 350px;\n}\n\n/* line 329, src/styles/common/_global.scss */\n\n.with-tooltip {\n  overflow: visible;\n  position: relative;\n}\n\n/* line 333, src/styles/common/_global.scss */\n\n.with-tooltip::after {\n  background: rgba(0, 0, 0, 0.85);\n  border-radius: 4px;\n  color: #fff;\n  content: attr(data-tooltip);\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 600;\n  left: 50%;\n  line-height: 1.25;\n  min-width: 130px;\n  opacity: 0;\n  padding: 4px 8px;\n  pointer-events: none;\n  position: absolute;\n  text-align: center;\n  text-transform: none;\n  top: -30px;\n  will-change: opacity, transform;\n  z-index: 1;\n}\n\n/* line 355, src/styles/common/_global.scss */\n\n.with-tooltip:hover::after {\n  -webkit-animation: tooltip .1s ease-out both;\n       -o-animation: tooltip .1s ease-out both;\n          animation: tooltip .1s ease-out both;\n}\n\n/* line 362, src/styles/common/_global.scss */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n}\n\n/* line 365, src/styles/common/_global.scss */\n\n.errorPage-link {\n  left: -5px;\n  padding: 24px 60px;\n  top: -6px;\n}\n\n/* line 371, src/styles/common/_global.scss */\n\n.errorPage-text {\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n/* line 376, src/styles/common/_global.scss */\n\n.errorPage-wrap {\n  color: rgba(0, 0, 0, 0.4);\n  padding: 7vw 4vw;\n}\n\n/* line 384, src/styles/common/_global.scss */\n\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%;\n}\n\n/* line 393, src/styles/common/_global.scss */\n\n.video-responsive iframe {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 403, src/styles/common/_global.scss */\n\n.video-responsive video {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 414, src/styles/common/_global.scss */\n\n.kg-embed-card .video-responsive {\n  margin-top: 0;\n}\n\n/* line 420, src/styles/common/_global.scss */\n\n.kg-gallery-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  max-width: 100%;\n  width: 100%;\n}\n\n/* line 427, src/styles/common/_global.scss */\n\n.kg-gallery-row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 432, src/styles/common/_global.scss */\n\n.kg-gallery-row:not(:first-of-type) {\n  margin: 0.75em 0 0 0;\n}\n\n/* line 436, src/styles/common/_global.scss */\n\n.kg-gallery-image img {\n  display: block;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n}\n\n/* line 443, src/styles/common/_global.scss */\n\n.kg-gallery-image:not(:first-of-type) {\n  margin: 0 0 0 0.75em;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-facebook {\n  color: #3b5998 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-facebook,\n.sideNav-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-twitter {\n  color: #55acee !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-twitter,\n.sideNav-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-google {\n  color: #dd4b39 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-google,\n.sideNav-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-instagram {\n  color: #306088 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-instagram,\n.sideNav-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-youtube {\n  color: #e52d27 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-youtube,\n.sideNav-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-github {\n  color: #555 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-github,\n.sideNav-follow .i-github {\n  background-color: #555 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-linkedin {\n  color: #007bb6 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-linkedin,\n.sideNav-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-spotify {\n  color: #2ebd59 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-spotify,\n.sideNav-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-codepen {\n  color: #222 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-codepen,\n.sideNav-follow .i-codepen {\n  background-color: #222 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-behance {\n  color: #131418 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-behance,\n.sideNav-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-dribbble {\n  color: #ea4c89 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-dribbble,\n.sideNav-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-flickr {\n  color: #0063dc !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-flickr,\n.sideNav-follow .i-flickr {\n  background-color: #0063dc !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-reddit {\n  color: #ff4500 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-reddit,\n.sideNav-follow .i-reddit {\n  background-color: #ff4500 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-pocket {\n  color: #f50057 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-pocket,\n.sideNav-follow .i-pocket {\n  background-color: #f50057 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-pinterest {\n  color: #bd081c !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-pinterest,\n.sideNav-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-whatsapp {\n  color: #64d448 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-whatsapp,\n.sideNav-follow .i-whatsapp {\n  background-color: #64d448 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-telegram {\n  color: #08c !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-telegram,\n.sideNav-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-discord {\n  color: #7289da !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-discord,\n.sideNav-follow .i-discord {\n  background-color: #7289da !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-rss {\n  color: orange !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-rss,\n.sideNav-follow .i-rss {\n  background-color: orange !important;\n}\n\n/* line 474, src/styles/common/_global.scss */\n\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5;\n}\n\n/* line 482, src/styles/common/_global.scss */\n\n.rocket:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 487, src/styles/common/_global.scss */\n\n.svgIcon {\n  display: inline-block;\n}\n\n/* line 491, src/styles/common/_global.scss */\n\nsvg {\n  height: auto;\n  width: 100%;\n}\n\n/* line 499, src/styles/common/_global.scss */\n\n.load-more {\n  max-width: 70% !important;\n}\n\n/* line 504, src/styles/common/_global.scss */\n\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  z-index: 800;\n}\n\n/* line 516, src/styles/common/_global.scss */\n\n.is-loading .loadingBar {\n  -webkit-animation: loading-bar 1s ease-in-out infinite;\n       -o-animation: loading-bar 1s ease-in-out infinite;\n          animation: loading-bar 1s ease-in-out infinite;\n  -webkit-animation-delay: .8s;\n       -o-animation-delay: .8s;\n          animation-delay: .8s;\n  display: block;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 525, src/styles/common/_global.scss */\n\n  blockquote {\n    margin-left: -5px;\n    font-size: 1.125rem;\n  }\n\n  /* line 527, src/styles/common/_global.scss */\n\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px;\n  }\n}\n\n/* line 2, src/styles/components/_grid.scss */\n\n.extreme-container {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 100%;\n}\n\n/* line 26, src/styles/components/_grid.scss */\n\n.col-left,\n.cc-video-left {\n  -ms-flex-preferred-size: 0;\n      flex-basis: 0;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px;\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 39, src/styles/components/_grid.scss */\n\n  .col-left {\n    max-width: calc(100% - 340px);\n  }\n\n  /* line 40, src/styles/components/_grid.scss */\n\n  .cc-video-left {\n    max-width: calc(100% - 320px);\n  }\n\n  /* line 41, src/styles/components/_grid.scss */\n\n  .cc-video-right {\n    -ms-flex-preferred-size: 320px !important;\n        flex-basis: 320px !important;\n    max-width: 320px !important;\n  }\n\n  /* line 42, src/styles/components/_grid.scss */\n\n  body.is-article .col-left {\n    padding-right: 40px;\n  }\n}\n\n/* line 45, src/styles/components/_grid.scss */\n\n.col-right {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  padding-left: 12px;\n  padding-right: 12px;\n  width: 330px;\n}\n\n/* line 53, src/styles/components/_grid.scss */\n\n.row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  margin-left: -12px;\n  margin-right: -12px;\n}\n\n/* line 61, src/styles/components/_grid.scss */\n\n.row .col {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding-left: 12px;\n  padding-right: 12px;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s1 {\n  -ms-flex-preferred-size: 8.33333%;\n      flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s2 {\n  -ms-flex-preferred-size: 16.66667%;\n      flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s3 {\n  -ms-flex-preferred-size: 25%;\n      flex-basis: 25%;\n  max-width: 25%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s4 {\n  -ms-flex-preferred-size: 33.33333%;\n      flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s5 {\n  -ms-flex-preferred-size: 41.66667%;\n      flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s6 {\n  -ms-flex-preferred-size: 50%;\n      flex-basis: 50%;\n  max-width: 50%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s7 {\n  -ms-flex-preferred-size: 58.33333%;\n      flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s8 {\n  -ms-flex-preferred-size: 66.66667%;\n      flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s9 {\n  -ms-flex-preferred-size: 75%;\n      flex-basis: 75%;\n  max-width: 75%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s10 {\n  -ms-flex-preferred-size: 83.33333%;\n      flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s11 {\n  -ms-flex-preferred-size: 91.66667%;\n      flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s12 {\n  -ms-flex-preferred-size: 100%;\n      flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n/* line 3, src/styles/common/_typography.scss */\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  color: inherit;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  margin: 0;\n}\n\n/* line 10, src/styles/common/_typography.scss */\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\n/* line 16, src/styles/common/_typography.scss */\n\nh1 {\n  font-size: 2rem;\n}\n\n/* line 17, src/styles/common/_typography.scss */\n\nh2 {\n  font-size: 1.875rem;\n}\n\n/* line 18, src/styles/common/_typography.scss */\n\nh3 {\n  font-size: 1.6rem;\n}\n\n/* line 19, src/styles/common/_typography.scss */\n\nh4 {\n  font-size: 1.4rem;\n}\n\n/* line 20, src/styles/common/_typography.scss */\n\nh5 {\n  font-size: 1.2rem;\n}\n\n/* line 21, src/styles/common/_typography.scss */\n\nh6 {\n  font-size: 1rem;\n}\n\n/* line 23, src/styles/common/_typography.scss */\n\np {\n  margin: 0;\n}\n\n/* line 2, src/styles/common/_utilities.scss */\n\n.u-textColorNormal {\n  color: #999999 !important;\n  fill: #999999 !important;\n}\n\n/* line 9, src/styles/common/_utilities.scss */\n\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important;\n}\n\n/* line 14, src/styles/common/_utilities.scss */\n\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, 0.6);\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 19, src/styles/common/_utilities.scss */\n\n.u-accentColor--iconNormal {\n  color: #1C9963;\n  fill: #1C9963;\n}\n\n/* line 25, src/styles/common/_utilities.scss */\n\n.u-bgColor {\n  background-color: var(--primary-color);\n}\n\n/* line 30, src/styles/common/_utilities.scss */\n\n.u-relative {\n  position: relative;\n}\n\n/* line 31, src/styles/common/_utilities.scss */\n\n.u-absolute {\n  position: absolute;\n}\n\n/* line 33, src/styles/common/_utilities.scss */\n\n.u-fixed {\n  position: fixed !important;\n}\n\n/* line 35, src/styles/common/_utilities.scss */\n\n.u-block {\n  display: block !important;\n}\n\n/* line 36, src/styles/common/_utilities.scss */\n\n.u-inlineBlock {\n  display: inline-block;\n}\n\n/* line 39, src/styles/common/_utilities.scss */\n\n.u-backgroundDark {\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n/* line 50, src/styles/common/_utilities.scss */\n\n.u-bgGradient {\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(29%, rgba(0, 0, 0, 0.3)), color-stop(81%, rgba(0, 0, 0, 0.7)));\n  background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.3) 29%, rgba(0, 0, 0, 0.7) 81%);\n  background: -o-linear-gradient(top, rgba(0, 0, 0, 0.3) 29%, rgba(0, 0, 0, 0.7) 81%);\n  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 29%, rgba(0, 0, 0, 0.7) 81%);\n}\n\n/* line 52, src/styles/common/_utilities.scss */\n\n.u-bgBlack {\n  background-color: #000;\n}\n\n/* line 54, src/styles/common/_utilities.scss */\n\n.u-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(20%, transparent), to(#000));\n  background: -webkit-linear-gradient(top, transparent 20%, #000 100%);\n  background: -o-linear-gradient(top, transparent 20%, #000 100%);\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1;\n}\n\n/* line 65, src/styles/common/_utilities.scss */\n\n.zindex1 {\n  z-index: 1;\n}\n\n/* line 66, src/styles/common/_utilities.scss */\n\n.zindex2 {\n  z-index: 2;\n}\n\n/* line 67, src/styles/common/_utilities.scss */\n\n.zindex3 {\n  z-index: 3;\n}\n\n/* line 68, src/styles/common/_utilities.scss */\n\n.zindex4 {\n  z-index: 4;\n}\n\n/* line 71, src/styles/common/_utilities.scss */\n\n.u-backgroundWhite {\n  background-color: #fafafa;\n}\n\n/* line 72, src/styles/common/_utilities.scss */\n\n.u-backgroundColorGrayLight {\n  background-color: #f0f0f0 !important;\n}\n\n/* line 75, src/styles/common/_utilities.scss */\n\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* line 82, src/styles/common/_utilities.scss */\n\n.u-fontSizeMicro {\n  font-size: 11px;\n}\n\n/* line 83, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmallest {\n  font-size: 12px;\n}\n\n/* line 84, src/styles/common/_utilities.scss */\n\n.u-fontSize13 {\n  font-size: 13px;\n}\n\n/* line 85, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmaller {\n  font-size: 14px;\n}\n\n/* line 86, src/styles/common/_utilities.scss */\n\n.u-fontSize15 {\n  font-size: 15px;\n}\n\n/* line 87, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmall {\n  font-size: 16px;\n}\n\n/* line 88, src/styles/common/_utilities.scss */\n\n.u-fontSizeBase {\n  font-size: 18px;\n}\n\n/* line 89, src/styles/common/_utilities.scss */\n\n.u-fontSize20 {\n  font-size: 20px;\n}\n\n/* line 90, src/styles/common/_utilities.scss */\n\n.u-fontSize21 {\n  font-size: 21px;\n}\n\n/* line 91, src/styles/common/_utilities.scss */\n\n.u-fontSize22 {\n  font-size: 22px;\n}\n\n/* line 92, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarge {\n  font-size: 24px;\n}\n\n/* line 93, src/styles/common/_utilities.scss */\n\n.u-fontSize26 {\n  font-size: 26px;\n}\n\n/* line 94, src/styles/common/_utilities.scss */\n\n.u-fontSize28 {\n  font-size: 28px;\n}\n\n/* line 95, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarger,\n.media-type {\n  font-size: 32px;\n}\n\n/* line 96, src/styles/common/_utilities.scss */\n\n.u-fontSize36 {\n  font-size: 36px;\n}\n\n/* line 97, src/styles/common/_utilities.scss */\n\n.u-fontSize40 {\n  font-size: 40px;\n}\n\n/* line 98, src/styles/common/_utilities.scss */\n\n.u-fontSizeLargest {\n  font-size: 44px;\n}\n\n/* line 99, src/styles/common/_utilities.scss */\n\n.u-fontSizeJumbo {\n  font-size: 50px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 102, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeBase {\n    font-size: 18px;\n  }\n\n  /* line 103, src/styles/common/_utilities.scss */\n\n  .u-md-fontSize22 {\n    font-size: 22px;\n  }\n\n  /* line 104, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeLarger {\n    font-size: 32px;\n  }\n}\n\n/* line 120, src/styles/common/_utilities.scss */\n\n.u-fontWeightThin {\n  font-weight: 300;\n}\n\n/* line 121, src/styles/common/_utilities.scss */\n\n.u-fontWeightNormal {\n  font-weight: 400;\n}\n\n/* line 122, src/styles/common/_utilities.scss */\n\n.u-fontWeightMedium {\n  font-weight: 500;\n}\n\n/* line 123, src/styles/common/_utilities.scss */\n\n.u-fontWeightSemibold {\n  font-weight: 600;\n}\n\n/* line 124, src/styles/common/_utilities.scss */\n\n.u-fontWeightBold {\n  font-weight: 700;\n}\n\n/* line 126, src/styles/common/_utilities.scss */\n\n.u-textUppercase {\n  text-transform: uppercase;\n}\n\n/* line 127, src/styles/common/_utilities.scss */\n\n.u-textCapitalize {\n  text-transform: capitalize;\n}\n\n/* line 128, src/styles/common/_utilities.scss */\n\n.u-textAlignCenter {\n  text-align: center;\n}\n\n/* line 130, src/styles/common/_utilities.scss */\n\n.u-textShadow {\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n}\n\n/* line 132, src/styles/common/_utilities.scss */\n\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n/* line 139, src/styles/common/_utilities.scss */\n\n.u-marginAuto {\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 140, src/styles/common/_utilities.scss */\n\n.u-marginTop20 {\n  margin-top: 20px;\n}\n\n/* line 141, src/styles/common/_utilities.scss */\n\n.u-marginTop30 {\n  margin-top: 30px;\n}\n\n/* line 142, src/styles/common/_utilities.scss */\n\n.u-marginBottom10 {\n  margin-bottom: 10px;\n}\n\n/* line 143, src/styles/common/_utilities.scss */\n\n.u-marginBottom15 {\n  margin-bottom: 15px;\n}\n\n/* line 144, src/styles/common/_utilities.scss */\n\n.u-marginBottom20 {\n  margin-bottom: 20px !important;\n}\n\n/* line 145, src/styles/common/_utilities.scss */\n\n.u-marginBottom30 {\n  margin-bottom: 30px;\n}\n\n/* line 146, src/styles/common/_utilities.scss */\n\n.u-marginBottom40 {\n  margin-bottom: 40px;\n}\n\n/* line 149, src/styles/common/_utilities.scss */\n\n.u-padding0 {\n  padding: 0 !important;\n}\n\n/* line 150, src/styles/common/_utilities.scss */\n\n.u-padding20 {\n  padding: 20px;\n}\n\n/* line 151, src/styles/common/_utilities.scss */\n\n.u-padding15 {\n  padding: 15px !important;\n}\n\n/* line 152, src/styles/common/_utilities.scss */\n\n.u-paddingBottom2 {\n  padding-bottom: 2px;\n}\n\n/* line 153, src/styles/common/_utilities.scss */\n\n.u-paddingBottom30 {\n  padding-bottom: 30px;\n}\n\n/* line 154, src/styles/common/_utilities.scss */\n\n.u-paddingBottom20 {\n  padding-bottom: 20px;\n}\n\n/* line 155, src/styles/common/_utilities.scss */\n\n.u-paddingRight10 {\n  padding-right: 10px;\n}\n\n/* line 156, src/styles/common/_utilities.scss */\n\n.u-paddingLeft15 {\n  padding-left: 15px;\n}\n\n/* line 158, src/styles/common/_utilities.scss */\n\n.u-paddingTop2 {\n  padding-top: 2px;\n}\n\n/* line 159, src/styles/common/_utilities.scss */\n\n.u-paddingTop5 {\n  padding-top: 5px;\n}\n\n/* line 160, src/styles/common/_utilities.scss */\n\n.u-paddingTop10 {\n  padding-top: 10px;\n}\n\n/* line 161, src/styles/common/_utilities.scss */\n\n.u-paddingTop15 {\n  padding-top: 15px;\n}\n\n/* line 162, src/styles/common/_utilities.scss */\n\n.u-paddingTop20 {\n  padding-top: 20px;\n}\n\n/* line 163, src/styles/common/_utilities.scss */\n\n.u-paddingTop30 {\n  padding-top: 30px;\n}\n\n/* line 165, src/styles/common/_utilities.scss */\n\n.u-paddingBottom15 {\n  padding-bottom: 15px;\n}\n\n/* line 167, src/styles/common/_utilities.scss */\n\n.u-paddingRight20 {\n  padding-right: 20px;\n}\n\n/* line 168, src/styles/common/_utilities.scss */\n\n.u-paddingLeft20 {\n  padding-left: 20px;\n}\n\n/* line 170, src/styles/common/_utilities.scss */\n\n.u-contentTitle {\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-style: normal;\n  font-weight: 700;\n  letter-spacing: -.028em;\n}\n\n/* line 178, src/styles/common/_utilities.scss */\n\n.u-lineHeight1 {\n  line-height: 1;\n}\n\n/* line 179, src/styles/common/_utilities.scss */\n\n.u-lineHeightTight {\n  line-height: 1.2;\n}\n\n/* line 182, src/styles/common/_utilities.scss */\n\n.u-overflowHidden {\n  overflow: hidden;\n}\n\n/* line 185, src/styles/common/_utilities.scss */\n\n.u-floatRight {\n  float: right;\n}\n\n/* line 186, src/styles/common/_utilities.scss */\n\n.u-floatLeft {\n  float: left;\n}\n\n/* line 189, src/styles/common/_utilities.scss */\n\n.u-flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 190, src/styles/common/_utilities.scss */\n\n.u-flexCenter,\n.media-type {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 191, src/styles/common/_utilities.scss */\n\n.u-flexContentCenter,\n.media-type {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 193, src/styles/common/_utilities.scss */\n\n.u-flex1 {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n\n/* line 194, src/styles/common/_utilities.scss */\n\n.u-flex0 {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n}\n\n/* line 195, src/styles/common/_utilities.scss */\n\n.u-flexWrap {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n/* line 197, src/styles/common/_utilities.scss */\n\n.u-flexColumn {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 203, src/styles/common/_utilities.scss */\n\n.u-flexEnd {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n/* line 208, src/styles/common/_utilities.scss */\n\n.u-flexColumnTop {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n}\n\n/* line 215, src/styles/common/_utilities.scss */\n\n.u-bgCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover;\n}\n\n/* line 222, src/styles/common/_utilities.scss */\n\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 16px;\n  padding-right: 16px;\n}\n\n/* line 229, src/styles/common/_utilities.scss */\n\n.u-maxWidth1200 {\n  max-width: 1200px;\n}\n\n/* line 230, src/styles/common/_utilities.scss */\n\n.u-maxWidth1000 {\n  max-width: 1000px;\n}\n\n/* line 231, src/styles/common/_utilities.scss */\n\n.u-maxWidth740 {\n  max-width: 740px;\n}\n\n/* line 232, src/styles/common/_utilities.scss */\n\n.u-maxWidth1040 {\n  max-width: 1040px;\n}\n\n/* line 233, src/styles/common/_utilities.scss */\n\n.u-sizeFullWidth {\n  width: 100%;\n}\n\n/* line 234, src/styles/common/_utilities.scss */\n\n.u-sizeFullHeight {\n  height: 100%;\n}\n\n/* line 237, src/styles/common/_utilities.scss */\n\n.u-borderLighter {\n  border: 1px solid rgba(0, 0, 0, 0.15);\n}\n\n/* line 238, src/styles/common/_utilities.scss */\n\n.u-round,\n.avatar-image,\n.media-type {\n  border-radius: 50%;\n}\n\n/* line 239, src/styles/common/_utilities.scss */\n\n.u-borderRadius2 {\n  border-radius: 2px;\n}\n\n/* line 241, src/styles/common/_utilities.scss */\n\n.u-boxShadowBottom {\n  -webkit-box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05);\n}\n\n/* line 246, src/styles/common/_utilities.scss */\n\n.u-height540 {\n  height: 540px;\n}\n\n/* line 247, src/styles/common/_utilities.scss */\n\n.u-height280 {\n  height: 280px;\n}\n\n/* line 248, src/styles/common/_utilities.scss */\n\n.u-height260 {\n  height: 260px;\n}\n\n/* line 249, src/styles/common/_utilities.scss */\n\n.u-height100 {\n  height: 100px;\n}\n\n/* line 250, src/styles/common/_utilities.scss */\n\n.u-borderBlackLightest {\n  border: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n/* line 253, src/styles/common/_utilities.scss */\n\n.u-hide {\n  display: none !important;\n}\n\n/* line 256, src/styles/common/_utilities.scss */\n\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.09);\n  border-radius: 3px;\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px;\n}\n\n/* line 267, src/styles/common/_utilities.scss */\n\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n/* line 272, src/styles/common/_utilities.scss */\n\n.title-line::before {\n  content: '';\n  background: rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  position: absolute;\n  left: 0;\n  bottom: 50%;\n  width: 100%;\n  height: 1px;\n  z-index: 0;\n}\n\n/* line 286, src/styles/common/_utilities.scss */\n\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 15px;\n  font-weight: 500;\n  letter-spacing: 0.03em;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  -webkit-transform: skewX(-15deg);\n       -o-transform: skewX(-15deg);\n          transform: skewX(-15deg);\n}\n\n/* line 299, src/styles/common/_utilities.scss */\n\n.no-avatar {\n  background-image: url(" + escape(__webpack_require__(/*! ./../images/avatar.png */ 53)) + ") !important;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 304, src/styles/common/_utilities.scss */\n\n  .u-hide-before-md {\n    display: none !important;\n  }\n\n  /* line 305, src/styles/common/_utilities.scss */\n\n  .u-md-heightAuto {\n    height: auto;\n  }\n\n  /* line 306, src/styles/common/_utilities.scss */\n\n  .u-md-height170 {\n    height: 170px;\n  }\n\n  /* line 307, src/styles/common/_utilities.scss */\n\n  .u-md-relative {\n    position: relative;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 310, src/styles/common/_utilities.scss */\n\n  .u-hide-before-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 313, src/styles/common/_utilities.scss */\n\n  .u-hide-after-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 315, src/styles/common/_utilities.scss */\n\n  .u-hide-after-lg {\n    display: none !important;\n  }\n}\n\n/* line 1, src/styles/components/_form.scss */\n\n.button {\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: rgba(0, 0, 0, 0.44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n/* line 45, src/styles/components/_form.scss */\n\n.button--large {\n  font-size: 15px;\n  height: 44px;\n  line-height: 42px;\n  padding: 0 18px;\n}\n\n/* line 52, src/styles/components/_form.scss */\n\n.button--dark {\n  background: rgba(0, 0, 0, 0.84);\n  border-color: rgba(0, 0, 0, 0.84);\n  color: rgba(255, 255, 255, 0.97);\n}\n\n/* line 57, src/styles/components/_form.scss */\n\n.button--dark:hover {\n  background: #1C9963;\n  border-color: #1C9963;\n}\n\n/* line 65, src/styles/components/_form.scss */\n\n.button--primary {\n  border-color: #1C9963;\n  color: #1C9963;\n}\n\n/* line 111, src/styles/components/_form.scss */\n\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px;\n}\n\n/* line 124, src/styles/components/_form.scss */\n\n.tag-button {\n  background: rgba(0, 0, 0, 0.05);\n  border: none;\n  color: rgba(0, 0, 0, 0.68);\n  font-weight: 500;\n  margin: 0 8px 8px 0;\n}\n\n/* line 131, src/styles/components/_form.scss */\n\n.tag-button:hover {\n  background: rgba(0, 0, 0, 0.1);\n  color: rgba(0, 0, 0, 0.68);\n}\n\n/* line 139, src/styles/components/_form.scss */\n\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 500;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  -webkit-transition: color 0.3s ease, -webkit-box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  transition: color 0.3s ease, -webkit-box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  -o-transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955), -webkit-box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  width: 100%;\n}\n\n/* line 150, src/styles/components/_form.scss */\n\n.button--dark-line:hover {\n  color: #fff;\n  -webkit-box-shadow: inset 0 -50px 8px -4px #000;\n          box-shadow: inset 0 -50px 8px -4px #000;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(" + escape(__webpack_require__(/*! ./../fonts/mapache.eot */ 23)) + ");\n  src: url(" + escape(__webpack_require__(/*! ./../fonts/mapache.eot */ 23)) + ") format(\"embedded-opentype\"), url(" + escape(__webpack_require__(/*! ./../fonts/mapache.ttf */ 54)) + ") format(\"truetype\"), url(" + escape(__webpack_require__(/*! ./../fonts/mapache.woff */ 55)) + ") format(\"woff\"), url(" + escape(__webpack_require__(/*! ./../fonts/mapache.svg */ 56)) + ") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n/* line 17, src/styles/components/_icons.scss */\n\n.i-tag:before {\n  content: \"\\E911\";\n}\n\n/* line 20, src/styles/components/_icons.scss */\n\n.i-discord:before {\n  content: \"\\E90A\";\n}\n\n/* line 23, src/styles/components/_icons.scss */\n\n.i-arrow-round-next:before {\n  content: \"\\E90C\";\n}\n\n/* line 26, src/styles/components/_icons.scss */\n\n.i-arrow-round-prev:before {\n  content: \"\\E90D\";\n}\n\n/* line 29, src/styles/components/_icons.scss */\n\n.i-arrow-round-up:before {\n  content: \"\\E90E\";\n}\n\n/* line 32, src/styles/components/_icons.scss */\n\n.i-arrow-round-down:before {\n  content: \"\\E90F\";\n}\n\n/* line 35, src/styles/components/_icons.scss */\n\n.i-photo:before {\n  content: \"\\E90B\";\n}\n\n/* line 38, src/styles/components/_icons.scss */\n\n.i-send:before {\n  content: \"\\E909\";\n}\n\n/* line 41, src/styles/components/_icons.scss */\n\n.i-audio:before {\n  content: \"\\E901\";\n}\n\n/* line 44, src/styles/components/_icons.scss */\n\n.i-rocket:before {\n  content: \"\\E902\";\n  color: #999;\n}\n\n/* line 48, src/styles/components/_icons.scss */\n\n.i-comments-line:before {\n  content: \"\\E900\";\n}\n\n/* line 51, src/styles/components/_icons.scss */\n\n.i-globe:before {\n  content: \"\\E906\";\n}\n\n/* line 54, src/styles/components/_icons.scss */\n\n.i-star:before {\n  content: \"\\E907\";\n}\n\n/* line 57, src/styles/components/_icons.scss */\n\n.i-link:before {\n  content: \"\\E908\";\n}\n\n/* line 60, src/styles/components/_icons.scss */\n\n.i-star-line:before {\n  content: \"\\E903\";\n}\n\n/* line 63, src/styles/components/_icons.scss */\n\n.i-more:before {\n  content: \"\\E904\";\n}\n\n/* line 66, src/styles/components/_icons.scss */\n\n.i-search:before {\n  content: \"\\E905\";\n}\n\n/* line 69, src/styles/components/_icons.scss */\n\n.i-chat:before {\n  content: \"\\E910\";\n}\n\n/* line 72, src/styles/components/_icons.scss */\n\n.i-arrow-left:before {\n  content: \"\\E314\";\n}\n\n/* line 75, src/styles/components/_icons.scss */\n\n.i-arrow-right:before {\n  content: \"\\E315\";\n}\n\n/* line 78, src/styles/components/_icons.scss */\n\n.i-play:before {\n  content: \"\\E037\";\n}\n\n/* line 81, src/styles/components/_icons.scss */\n\n.i-location:before {\n  content: \"\\E8B4\";\n}\n\n/* line 84, src/styles/components/_icons.scss */\n\n.i-check-circle:before {\n  content: \"\\E86C\";\n}\n\n/* line 87, src/styles/components/_icons.scss */\n\n.i-close:before {\n  content: \"\\E5CD\";\n}\n\n/* line 90, src/styles/components/_icons.scss */\n\n.i-favorite:before {\n  content: \"\\E87D\";\n}\n\n/* line 93, src/styles/components/_icons.scss */\n\n.i-warning:before {\n  content: \"\\E002\";\n}\n\n/* line 96, src/styles/components/_icons.scss */\n\n.i-rss:before {\n  content: \"\\E0E5\";\n}\n\n/* line 99, src/styles/components/_icons.scss */\n\n.i-share:before {\n  content: \"\\E80D\";\n}\n\n/* line 102, src/styles/components/_icons.scss */\n\n.i-email:before {\n  content: \"\\F0E0\";\n}\n\n/* line 105, src/styles/components/_icons.scss */\n\n.i-google:before {\n  content: \"\\F1A0\";\n}\n\n/* line 108, src/styles/components/_icons.scss */\n\n.i-telegram:before {\n  content: \"\\F2C6\";\n}\n\n/* line 111, src/styles/components/_icons.scss */\n\n.i-reddit:before {\n  content: \"\\F281\";\n}\n\n/* line 114, src/styles/components/_icons.scss */\n\n.i-twitter:before {\n  content: \"\\F099\";\n}\n\n/* line 117, src/styles/components/_icons.scss */\n\n.i-github:before {\n  content: \"\\F09B\";\n}\n\n/* line 120, src/styles/components/_icons.scss */\n\n.i-linkedin:before {\n  content: \"\\F0E1\";\n}\n\n/* line 123, src/styles/components/_icons.scss */\n\n.i-youtube:before {\n  content: \"\\F16A\";\n}\n\n/* line 126, src/styles/components/_icons.scss */\n\n.i-stack-overflow:before {\n  content: \"\\F16C\";\n}\n\n/* line 129, src/styles/components/_icons.scss */\n\n.i-instagram:before {\n  content: \"\\F16D\";\n}\n\n/* line 132, src/styles/components/_icons.scss */\n\n.i-flickr:before {\n  content: \"\\F16E\";\n}\n\n/* line 135, src/styles/components/_icons.scss */\n\n.i-dribbble:before {\n  content: \"\\F17D\";\n}\n\n/* line 138, src/styles/components/_icons.scss */\n\n.i-behance:before {\n  content: \"\\F1B4\";\n}\n\n/* line 141, src/styles/components/_icons.scss */\n\n.i-spotify:before {\n  content: \"\\F1BC\";\n}\n\n/* line 144, src/styles/components/_icons.scss */\n\n.i-codepen:before {\n  content: \"\\F1CB\";\n}\n\n/* line 147, src/styles/components/_icons.scss */\n\n.i-facebook:before {\n  content: \"\\F230\";\n}\n\n/* line 150, src/styles/components/_icons.scss */\n\n.i-pinterest:before {\n  content: \"\\F231\";\n}\n\n/* line 153, src/styles/components/_icons.scss */\n\n.i-whatsapp:before {\n  content: \"\\F232\";\n}\n\n/* line 156, src/styles/components/_icons.scss */\n\n.i-snapchat:before {\n  content: \"\\F2AC\";\n}\n\n/* line 2, src/styles/components/_animated.scss */\n\n.animated {\n  -webkit-animation-duration: 1s;\n       -o-animation-duration: 1s;\n          animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n       -o-animation-fill-mode: both;\n          animation-fill-mode: both;\n}\n\n/* line 6, src/styles/components/_animated.scss */\n\n.animated.infinite {\n  -webkit-animation-iteration-count: infinite;\n       -o-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n}\n\n/* line 12, src/styles/components/_animated.scss */\n\n.bounceIn {\n  -webkit-animation-name: bounceIn;\n       -o-animation-name: bounceIn;\n          animation-name: bounceIn;\n}\n\n/* line 13, src/styles/components/_animated.scss */\n\n.bounceInDown {\n  -webkit-animation-name: bounceInDown;\n       -o-animation-name: bounceInDown;\n          animation-name: bounceInDown;\n}\n\n/* line 14, src/styles/components/_animated.scss */\n\n.pulse {\n  -webkit-animation-name: pulse;\n       -o-animation-name: pulse;\n          animation-name: pulse;\n}\n\n/* line 15, src/styles/components/_animated.scss */\n\n.slideInUp {\n  -webkit-animation-name: slideInUp;\n       -o-animation-name: slideInUp;\n          animation-name: slideInUp;\n}\n\n/* line 16, src/styles/components/_animated.scss */\n\n.slideOutDown {\n  -webkit-animation-name: slideOutDown;\n       -o-animation-name: slideOutDown;\n          animation-name: slideOutDown;\n}\n\n@-webkit-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n       animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n         -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n            animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n            transform: none;\n  }\n}\n\n@-o-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -o-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n       animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -o-transform: none;\n       transform: none;\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n         -o-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n            animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n         -o-transform: none;\n            transform: none;\n  }\n}\n\n@-webkit-keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.2, 1.2, 1.2);\n            transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.2, 1.2, 1.2);\n            transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0);\n            transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-o-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -o-transform: translateY(0);\n       transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    -o-transform: translateY(10px);\n       transform: translateY(10px);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0);\n         -o-transform: translateY(0);\n            transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n         -o-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-webkit-keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@-o-keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-o-keyframes spin {\n  from {\n    -o-transform: rotate(0deg);\n       transform: rotate(0deg);\n  }\n\n  to {\n    -o-transform: rotate(360deg);\n       transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n         -o-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n         -o-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes tooltip {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(-50%, 6px);\n            transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(-50%, 0);\n            transform: translate(-50%, 0);\n  }\n}\n\n@-o-keyframes tooltip {\n  0% {\n    opacity: 0;\n    -o-transform: translate(-50%, 6px);\n       transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    -o-transform: translate(-50%, 0);\n       transform: translate(-50%, 0);\n  }\n}\n\n@keyframes tooltip {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(-50%, 6px);\n         -o-transform: translate(-50%, 6px);\n            transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(-50%, 0);\n         -o-transform: translate(-50%, 0);\n            transform: translate(-50%, 0);\n  }\n}\n\n@-webkit-keyframes loading-bar {\n  0% {\n    -webkit-transform: translateX(-100%);\n            transform: translateX(-100%);\n  }\n\n  40% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  60% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  100% {\n    -webkit-transform: translateX(100%);\n            transform: translateX(100%);\n  }\n}\n\n@-o-keyframes loading-bar {\n  0% {\n    -o-transform: translateX(-100%);\n       transform: translateX(-100%);\n  }\n\n  40% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n  }\n\n  60% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n  }\n\n  100% {\n    -o-transform: translateX(100%);\n       transform: translateX(100%);\n  }\n}\n\n@keyframes loading-bar {\n  0% {\n    -webkit-transform: translateX(-100%);\n         -o-transform: translateX(-100%);\n            transform: translateX(-100%);\n  }\n\n  40% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  60% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  100% {\n    -webkit-transform: translateX(100%);\n         -o-transform: translateX(100%);\n            transform: translateX(100%);\n  }\n}\n\n@-webkit-keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(-100%);\n            transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-o-keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -o-transform: translateX(-100%);\n       transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(-100%);\n         -o-transform: translateX(-100%);\n            transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(100%);\n            transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-o-keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -o-transform: translateX(100%);\n       transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(100%);\n         -o-transform: translateX(100%);\n            transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-o-keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-webkit-keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n@-o-keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n/* line 4, src/styles/layouts/_header.scss */\n\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15;\n}\n\n/* line 10, src/styles/layouts/_header.scss */\n\n.header {\n  -webkit-box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n          box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: -webkit-sticky;\n  position: sticky;\n  top: 0;\n  -webkit-transition: all .3s ease-in-out;\n  -o-transition: all .3s ease-in-out;\n  transition: all .3s ease-in-out;\n  z-index: 10;\n}\n\n/* line 18, src/styles/layouts/_header.scss */\n\n.header-wrap {\n  height: 50px;\n}\n\n/* line 20, src/styles/layouts/_header.scss */\n\n.header-logo {\n  color: #fff !important;\n  height: 30px;\n}\n\n/* line 24, src/styles/layouts/_header.scss */\n\n.header-logo img {\n  max-height: 100%;\n}\n\n/* line 32, src/styles/layouts/_header.scss */\n\n.header-line {\n  height: 50px;\n  border-right: 1px solid rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  margin-right: 10px;\n}\n\n/* line 41, src/styles/layouts/_header.scss */\n\n.follow-more {\n  -webkit-transition: width .4s ease;\n  -o-transition: width .4s ease;\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0;\n}\n\n/* line 48, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-more {\n  width: auto;\n}\n\n/* line 49, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle {\n  color: var(--header-color-hover);\n}\n\n/* line 50, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle::before {\n  content: \"\\E5CD\";\n}\n\n/* line 56, src/styles/layouts/_header.scss */\n\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden;\n}\n\n/* line 62, src/styles/layouts/_header.scss */\n\n.nav ul {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  margin-right: 20px;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n/* line 70, src/styles/layouts/_header.scss */\n\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 400;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle;\n}\n\n/* line 82, src/styles/layouts/_header.scss */\n\n.header-left a.active,\n.header-left a:hover,\n.nav ul li a.active,\n.nav ul li a:hover {\n  color: var(--header-color-hover);\n}\n\n/* line 89, src/styles/layouts/_header.scss */\n\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  -webkit-transition: -webkit-transform .4s;\n  transition: -webkit-transform .4s;\n  -o-transition: -o-transform .4s;\n  transition: transform .4s;\n  transition: transform .4s, -webkit-transform .4s, -o-transform .4s;\n  width: 48px;\n}\n\n/* line 95, src/styles/layouts/_header.scss */\n\n.menu--toggle span {\n  background-color: var(--header-color);\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  -webkit-transition: .4s;\n  -o-transition: .4s;\n  transition: .4s;\n  width: 20px;\n}\n\n/* line 106, src/styles/layouts/_header.scss */\n\n.menu--toggle span:first-child {\n  -webkit-transform: translate(0, -6px);\n       -o-transform: translate(0, -6px);\n          transform: translate(0, -6px);\n}\n\n/* line 107, src/styles/layouts/_header.scss */\n\n.menu--toggle span:last-child {\n  -webkit-transform: translate(0, 6px);\n       -o-transform: translate(0, 6px);\n          transform: translate(0, 6px);\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 115, src/styles/layouts/_header.scss */\n\n  .header-left {\n    -webkit-box-flex: 1 !important;\n        -ms-flex-positive: 1 !important;\n            flex-grow: 1 !important;\n  }\n\n  /* line 116, src/styles/layouts/_header.scss */\n\n  .header-logo span {\n    font-size: 24px;\n  }\n\n  /* line 119, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  /* line 122, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .sideNav {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  /* line 124, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle {\n    border: 0;\n    -webkit-transform: rotate(90deg);\n         -o-transform: rotate(90deg);\n            transform: rotate(90deg);\n  }\n\n  /* line 128, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:first-child {\n    -webkit-transform: rotate(45deg) translate(0, 0);\n         -o-transform: rotate(45deg) translate(0, 0);\n            transform: rotate(45deg) translate(0, 0);\n  }\n\n  /* line 129, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:nth-child(2) {\n    -webkit-transform: scaleX(0);\n         -o-transform: scaleX(0);\n            transform: scaleX(0);\n  }\n\n  /* line 130, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:last-child {\n    -webkit-transform: rotate(-45deg) translate(0, 0);\n         -o-transform: rotate(-45deg) translate(0, 0);\n            transform: rotate(-45deg) translate(0, 0);\n  }\n\n  /* line 133, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    -webkit-transform: translateX(-25%) !important;\n         -o-transform: translateX(-25%) !important;\n            transform: translateX(-25%) !important;\n  }\n}\n\n/* line 4, src/styles/layouts/_footer.scss */\n\n.footer {\n  color: #888;\n}\n\n/* line 7, src/styles/layouts/_footer.scss */\n\n.footer a {\n  color: var(--footer-color-link);\n}\n\n/* line 9, src/styles/layouts/_footer.scss */\n\n.footer a:hover {\n  color: #fff;\n}\n\n/* line 12, src/styles/layouts/_footer.scss */\n\n.footer-links {\n  padding: 3em 0 2.5em;\n  background-color: #131313;\n}\n\n/* line 17, src/styles/layouts/_footer.scss */\n\n.footer .follow > a {\n  background: #333;\n  border-radius: 50%;\n  color: inherit;\n  display: inline-block;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 5px 8px;\n  text-align: center;\n  width: 40px;\n}\n\n/* line 28, src/styles/layouts/_footer.scss */\n\n.footer .follow > a:hover {\n  background: transparent;\n  -webkit-box-shadow: inset 0 0 0 2px #333;\n          box-shadow: inset 0 0 0 2px #333;\n}\n\n/* line 34, src/styles/layouts/_footer.scss */\n\n.footer-copy {\n  padding: 3em 0;\n  background-color: #000;\n}\n\n/* line 41, src/styles/layouts/_footer.scss */\n\n.footer-menu li {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 8px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 47, src/styles/layouts/_footer.scss */\n\n.footer-menu li a {\n  color: #888;\n}\n\n/* line 3, src/styles/layouts/_homepage.scss */\n\n.hmCover {\n  padding: 4px;\n}\n\n/* line 6, src/styles/layouts/_homepage.scss */\n\n.hmCover .st-cover {\n  padding: 4px;\n}\n\n/* line 9, src/styles/layouts/_homepage.scss */\n\n.hmCover .st-cover.firts {\n  height: 500px;\n}\n\n/* line 11, src/styles/layouts/_homepage.scss */\n\n.hmCover .st-cover.firts .st-cover-title {\n  font-size: 2rem;\n}\n\n/* line 18, src/styles/layouts/_homepage.scss */\n\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh;\n}\n\n/* line 22, src/styles/layouts/_homepage.scss */\n\n.hm-cover-title {\n  font-size: 2.5rem;\n  font-weight: 900;\n  line-height: 1;\n}\n\n/* line 28, src/styles/layouts/_homepage.scss */\n\n.hm-cover-des {\n  max-width: 600px;\n  font-size: 1.25rem;\n}\n\n/* line 34, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  -webkit-transition: all .3s;\n  -o-transition: all .3s;\n  transition: all .3s;\n  width: 100%;\n}\n\n/* line 49, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe:hover {\n  -webkit-box-shadow: inset 0 0 0 2px #fff;\n          box-shadow: inset 0 0 0 2px #fff;\n}\n\n/* line 54, src/styles/layouts/_homepage.scss */\n\n.hm-down {\n  -webkit-animation-duration: 1.2s !important;\n       -o-animation-duration: 1.2s !important;\n          animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n/* line 65, src/styles/layouts/_homepage.scss */\n\n.hm-down svg {\n  display: block;\n  fill: currentcolor;\n  height: auto;\n  width: 100%;\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 77, src/styles/layouts/_homepage.scss */\n\n  .hmCover {\n    height: 70vh;\n  }\n\n  /* line 80, src/styles/layouts/_homepage.scss */\n\n  .hmCover .st-cover {\n    height: 50%;\n    width: 33.33333%;\n  }\n\n  /* line 84, src/styles/layouts/_homepage.scss */\n\n  .hmCover .st-cover.firts {\n    height: 100%;\n    width: 66.66666%;\n  }\n\n  /* line 87, src/styles/layouts/_homepage.scss */\n\n  .hmCover .st-cover.firts .st-cover-title {\n    font-size: 2.8rem;\n  }\n\n  /* line 93, src/styles/layouts/_homepage.scss */\n\n  .hm-cover-title {\n    font-size: 3.5rem;\n  }\n}\n\n/* line 6, src/styles/layouts/_post.scss */\n\n.post-title {\n  color: #000;\n  line-height: 1.2;\n  max-width: 1000px;\n}\n\n/* line 12, src/styles/layouts/_post.scss */\n\n.post-excerpt {\n  color: #555;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  letter-spacing: -.012em;\n  line-height: 1.6;\n}\n\n/* line 21, src/styles/layouts/_post.scss */\n\n.post-author-social {\n  vertical-align: middle;\n  margin-left: 2px;\n  padding: 0 3px;\n}\n\n/* line 27, src/styles/layouts/_post.scss */\n\n.post-image {\n  margin-top: 30px;\n}\n\n/* line 34, src/styles/layouts/_post.scss */\n\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle;\n}\n\n/* line 40, src/styles/layouts/_post.scss */\n\n.avatar-image--smaller {\n  width: 50px;\n  height: 50px;\n}\n\n/* line 48, src/styles/layouts/_post.scss */\n\n.post-inner {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n}\n\n/* line 54, src/styles/layouts/_post.scss */\n\n.post-inner a {\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(50%, rgba(0, 0, 0, 0.68)), color-stop(50%, transparent));\n  background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.68) 50%, transparent 50%);\n  background-image: -o-linear-gradient(top, rgba(0, 0, 0, 0.68) 50%, transparent 50%);\n  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.68) 50%, transparent 50%);\n  background-position: 0 1.12em;\n  background-repeat: repeat-x;\n  background-size: 2px .2em;\n  text-decoration: none;\n  word-break: break-word;\n}\n\n/* line 62, src/styles/layouts/_post.scss */\n\n.post-inner a:hover {\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(50%, black), color-stop(50%, transparent));\n  background-image: -webkit-linear-gradient(top, black 50%, transparent 50%);\n  background-image: -o-linear-gradient(top, black 50%, transparent 50%);\n  background-image: linear-gradient(to bottom, black 50%, transparent 50%);\n}\n\n/* line 65, src/styles/layouts/_post.scss */\n\n.post-inner img {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 71, src/styles/layouts/_post.scss */\n\n.post-inner h1,\n.post-inner h2,\n.post-inner h3,\n.post-inner h4,\n.post-inner h5,\n.post-inner h6 {\n  margin-top: 30px;\n  font-style: normal;\n  color: #000;\n  letter-spacing: -.02em;\n  line-height: 1.2;\n}\n\n/* line 79, src/styles/layouts/_post.scss */\n\n.post-inner h2 {\n  margin-top: 35px;\n}\n\n/* line 81, src/styles/layouts/_post.scss */\n\n.post-inner p {\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin-top: 25px;\n}\n\n/* line 89, src/styles/layouts/_post.scss */\n\n.post-inner ul,\n.post-inner ol {\n  counter-reset: post;\n  font-size: 1.125rem;\n  margin-top: 20px;\n}\n\n/* line 95, src/styles/layouts/_post.scss */\n\n.post-inner ul li,\n.post-inner ol li {\n  letter-spacing: -.003em;\n  margin-bottom: 14px;\n  margin-left: 30px;\n}\n\n/* line 100, src/styles/layouts/_post.scss */\n\n.post-inner ul li::before,\n.post-inner ol li::before {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  display: inline-block;\n  margin-left: -78px;\n  position: absolute;\n  text-align: right;\n  width: 78px;\n}\n\n/* line 111, src/styles/layouts/_post.scss */\n\n.post-inner ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n  padding-top: 3px;\n}\n\n/* line 118, src/styles/layouts/_post.scss */\n\n.post-inner ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px;\n}\n\n/* line 124, src/styles/layouts/_post.scss */\n\n.post-inner h1,\n.post-inner h2,\n.post-inner h3,\n.post-inner h4,\n.post-inner h5,\n.post-inner h6,\n.post-inner p,\n.post-inner ol,\n.post-inner ul,\n.post-inner hr,\n.post-inner pre,\n.post-inner dl,\n.post-inner blockquote,\n.post-inner table,\n.post-inner .kg-embed-card {\n  min-width: 100%;\n}\n\n/* line 129, src/styles/layouts/_post.scss */\n\n.post-inner > ul,\n.post-inner > iframe,\n.post-inner > img,\n.post-inner .kg-image-card,\n.post-inner .kg-card,\n.post-inner .kg-gallery-card,\n.post-inner .kg-embed-card {\n  margin-top: 30px !important;\n}\n\n/* line 142, src/styles/layouts/_post.scss */\n\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  -webkit-transition: all .4s;\n  -o-transition: all .4s;\n  transition: all .4s;\n  top: 30px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 150, src/styles/layouts/_post.scss */\n\n.sharePost a {\n  color: #fff;\n  margin: 8px 0 0;\n  display: block;\n}\n\n/* line 156, src/styles/layouts/_post.scss */\n\n.sharePost .i-chat {\n  background-color: #fff;\n  border: 2px solid #bbb;\n  color: #bbb;\n}\n\n/* line 162, src/styles/layouts/_post.scss */\n\n.sharePost .share-inner {\n  -webkit-transition: visibility 0s linear 0s, opacity .3s 0s;\n  -o-transition: visibility 0s linear 0s, opacity .3s 0s;\n  transition: visibility 0s linear 0s, opacity .3s 0s;\n}\n\n/* line 165, src/styles/layouts/_post.scss */\n\n.sharePost .share-inner.is-hidden {\n  visibility: hidden;\n  opacity: 0;\n  -webkit-transition: visibility 0s linear .3s, opacity .3s 0s;\n  -o-transition: visibility 0s linear .3s, opacity .3s 0s;\n  transition: visibility 0s linear .3s, opacity .3s 0s;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 176, src/styles/layouts/_post.scss */\n\n.mob-share .mapache-share {\n  height: 40px;\n  color: #fff;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-shadow: none !important;\n          box-shadow: none !important;\n}\n\n/* line 185, src/styles/layouts/_post.scss */\n\n.mob-share .share-title {\n  font-size: 14px;\n  margin-left: 10px;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 195, src/styles/layouts/_post.scss */\n\n.prev-next-span {\n  color: var(--composite-color);\n  font-weight: 700;\n  font-size: 13px;\n}\n\n/* line 200, src/styles/layouts/_post.scss */\n\n.prev-next-span i {\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -webkit-transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n  -o-transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n  transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n}\n\n/* line 206, src/styles/layouts/_post.scss */\n\n.prev-next-title {\n  margin: 0 !important;\n  font-size: 16px;\n  height: 2em;\n  overflow: hidden;\n  line-height: 1 !important;\n  text-overflow: ellipsis !important;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  display: -webkit-box !important;\n}\n\n/* line 219, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-right {\n  -webkit-animation: arrow-move-right 0.5s ease-in-out forwards;\n       -o-animation: arrow-move-right 0.5s ease-in-out forwards;\n          animation: arrow-move-right 0.5s ease-in-out forwards;\n}\n\n/* line 220, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-left {\n  -webkit-animation: arrow-move-left 0.5s ease-in-out forwards;\n       -o-animation: arrow-move-left 0.5s ease-in-out forwards;\n          animation: arrow-move-left 0.5s ease-in-out forwards;\n}\n\n/* line 226, src/styles/layouts/_post.scss */\n\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000;\n}\n\n/* line 231, src/styles/layouts/_post.scss */\n\n.cc-image-header {\n  right: 0;\n  bottom: 10%;\n  left: 0;\n}\n\n/* line 237, src/styles/layouts/_post.scss */\n\n.cc-image-figure img {\n  -o-object-fit: cover;\n     object-fit: cover;\n  width: 100%;\n}\n\n/* line 243, src/styles/layouts/_post.scss */\n\n.cc-image .post-header {\n  max-width: 800px;\n}\n\n/* line 245, src/styles/layouts/_post.scss */\n\n.cc-image .post-title,\n.cc-image .post-excerpt {\n  color: #fff;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);\n}\n\n/* line 254, src/styles/layouts/_post.scss */\n\n.cc-video {\n  background-color: #121212;\n  padding: 80px 0 30px;\n}\n\n/* line 258, src/styles/layouts/_post.scss */\n\n.cc-video .post-excerpt {\n  color: #aaa;\n  font-size: 1rem;\n}\n\n/* line 259, src/styles/layouts/_post.scss */\n\n.cc-video .post-title {\n  color: #fff;\n  font-size: 1.8rem;\n}\n\n/* line 260, src/styles/layouts/_post.scss */\n\n.cc-video .kg-embed-card,\n.cc-video .video-responsive {\n  margin-top: 0;\n}\n\n/* line 262, src/styles/layouts/_post.scss */\n\n.cc-video-subscribe {\n  background-color: #121212;\n  color: #fff;\n  line-height: 1;\n  padding: 0 10px;\n  z-index: 1;\n}\n\n/* line 273, src/styles/layouts/_post.scss */\n\nbody.is-article .main {\n  margin-bottom: 0;\n}\n\n/* line 274, src/styles/layouts/_post.scss */\n\nbody.share-margin .sharePost {\n  top: -60px;\n}\n\n/* line 276, src/styles/layouts/_post.scss */\n\nbody.has-cover .post-primary-tag {\n  display: block !important;\n}\n\n/* line 279, src/styles/layouts/_post.scss */\n\nbody.is-article-single .post-body-wrap {\n  margin-left: 0 !important;\n}\n\n/* line 280, src/styles/layouts/_post.scss */\n\nbody.is-article-single .sharePost {\n  left: -100px;\n}\n\n/* line 281, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-full .kg-image {\n  max-width: 100vw;\n}\n\n/* line 282, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-wide .kg-image {\n  max-width: 1040px;\n}\n\n/* line 284, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-gallery-container {\n  max-width: 1040px;\n  width: 100vw;\n}\n\n/* line 296, src/styles/layouts/_post.scss */\n\nbody.is-video .story-small h3 {\n  font-weight: 400;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 302, src/styles/layouts/_post.scss */\n\n  .post-inner q {\n    font-size: 20px !important;\n    letter-spacing: -.008em !important;\n    line-height: 1.4 !important;\n  }\n\n  /* line 308, src/styles/layouts/_post.scss */\n\n  .post-inner ol,\n  .post-inner ul,\n  .post-inner p {\n    font-size: 1rem;\n    letter-spacing: -.004em;\n    line-height: 1.58;\n  }\n\n  /* line 314, src/styles/layouts/_post.scss */\n\n  .post-inner iframe {\n    width: 100% !important;\n  }\n\n  /* line 318, src/styles/layouts/_post.scss */\n\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%;\n  }\n\n  /* line 324, src/styles/layouts/_post.scss */\n\n  .cc-image-header {\n    bottom: 24px;\n  }\n\n  /* line 325, src/styles/layouts/_post.scss */\n\n  .cc-image .post-excerpt {\n    font-size: 18px;\n  }\n\n  /* line 328, src/styles/layouts/_post.scss */\n\n  .cc-video {\n    padding: 20px 0;\n  }\n\n  /* line 331, src/styles/layouts/_post.scss */\n\n  .cc-video-embed {\n    margin-left: -16px;\n    margin-right: -15px;\n  }\n\n  /* line 336, src/styles/layouts/_post.scss */\n\n  .cc-video .post-header {\n    margin-top: 10px;\n  }\n\n  /* line 340, src/styles/layouts/_post.scss */\n\n  .kg-width-wide .kg-image {\n    width: 100% !important;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 345, src/styles/layouts/_post.scss */\n\n  body.is-article .col-left {\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 352, src/styles/layouts/_post.scss */\n\n  .cc-image .post-title {\n    font-size: 3.2rem;\n  }\n\n  /* line 353, src/styles/layouts/_post.scss */\n\n  .prev-next-link {\n    margin: 0 !important;\n  }\n\n  /* line 354, src/styles/layouts/_post.scss */\n\n  .prev-next-right {\n    text-align: right;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 358, src/styles/layouts/_post.scss */\n\n  body.is-article .post-body-wrap {\n    margin-left: 70px;\n  }\n\n  /* line 362, src/styles/layouts/_post.scss */\n\n  body.is-video .post-author,\n  body.is-image .post-author {\n    margin-left: 70px;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  /* line 369, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-embed {\n    bottom: 20px;\n    -webkit-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    height: 203px;\n    padding-bottom: 0;\n    position: fixed;\n    right: 20px;\n    width: 360px;\n    z-index: 8;\n  }\n\n  /* line 380, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-close {\n    background: #000;\n    border-radius: 50%;\n    color: #fff;\n    cursor: pointer;\n    display: block !important;\n    font-size: 14px;\n    height: 24px;\n    left: -10px;\n    line-height: 1;\n    padding-top: 5px;\n    position: absolute;\n    text-align: center;\n    top: -10px;\n    width: 24px;\n    z-index: 5;\n  }\n\n  /* line 398, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-cont {\n    height: 465px;\n  }\n\n  /* line 400, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-image-header {\n    bottom: 20%;\n  }\n}\n\n/* line 3, src/styles/layouts/_story.scss */\n\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0;\n}\n\n/* line 10, src/styles/layouts/_story.scss */\n\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px;\n}\n\n/* line 15, src/styles/layouts/_story.scss */\n\n.media-type {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9;\n}\n\n/* line 33, src/styles/layouts/_story.scss */\n\n.image-hover {\n  -webkit-transition: -webkit-transform .7s;\n  transition: -webkit-transform .7s;\n  -o-transition: -o-transform .7s;\n  transition: transform .7s;\n  transition: transform .7s, -webkit-transform .7s, -o-transform .7s;\n  -webkit-transform: translateZ(0);\n          transform: translateZ(0);\n}\n\n/* line 45, src/styles/layouts/_story.scss */\n\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 500;\n  margin-bottom: 10px;\n}\n\n/* line 50, src/styles/layouts/_story.scss */\n\n.flow-meta-cat {\n  color: rgba(0, 0, 0, 0.84);\n}\n\n/* line 51, src/styles/layouts/_story.scss */\n\n.flow-meta .point {\n  margin: 0 5px;\n}\n\n/* line 58, src/styles/layouts/_story.scss */\n\n.story-image {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 44%;\n          flex: 0 0 44%;\n  height: 235px;\n  margin-right: 30px;\n}\n\n/* line 63, src/styles/layouts/_story.scss */\n\n.story-image:hover .image-hover {\n  -webkit-transform: scale(1.03);\n       -o-transform: scale(1.03);\n          transform: scale(1.03);\n}\n\n/* line 66, src/styles/layouts/_story.scss */\n\n.story-lower {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n}\n\n/* line 68, src/styles/layouts/_story.scss */\n\n.story-excerpt {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  line-height: 1.5;\n}\n\n/* line 75, src/styles/layouts/_story.scss */\n\n.story h2 a:hover {\n  opacity: .6;\n}\n\n/* line 89, src/styles/layouts/_story.scss */\n\n.story--grid .story {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  margin-bottom: 30px;\n}\n\n/* line 93, src/styles/layouts/_story.scss */\n\n.story--grid .story-image {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  margin-right: 0;\n  height: 220px;\n}\n\n/* line 100, src/styles/layouts/_story.scss */\n\n.story--grid .media-type {\n  font-size: 24px;\n  height: 40px;\n  width: 40px;\n}\n\n/* line 110, src/styles/layouts/_story.scss */\n\n.st-cover {\n  overflow: hidden;\n  height: 300px;\n  width: 100%;\n}\n\n/* line 115, src/styles/layouts/_story.scss */\n\n.st-cover-inner {\n  height: 100%;\n}\n\n/* line 116, src/styles/layouts/_story.scss */\n\n.st-cover-img {\n  -webkit-transition: all .25s;\n  -o-transition: all .25s;\n  transition: all .25s;\n}\n\n/* line 117, src/styles/layouts/_story.scss */\n\n.st-cover .flow-meta-cat {\n  color: var(--story-cover-category-color);\n}\n\n/* line 118, src/styles/layouts/_story.scss */\n\n.st-cover .flow-meta {\n  color: #fff;\n}\n\n/* line 120, src/styles/layouts/_story.scss */\n\n.st-cover-header {\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding: 50px 3.846153846% 20px;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, transparent), color-stop(50%, rgba(0, 0, 0, 0.7)), to(rgba(0, 0, 0, 0.9)));\n  background-image: -webkit-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: -o-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 128, src/styles/layouts/_story.scss */\n\n.st-cover:hover .st-cover-img {\n  opacity: .8;\n}\n\n/* line 134, src/styles/layouts/_story.scss */\n\n.story--card {\n  /* stylelint-disable-next-line */\n}\n\n/* line 135, src/styles/layouts/_story.scss */\n\n.story--card .story {\n  margin-top: 0 !important;\n}\n\n/* line 140, src/styles/layouts/_story.scss */\n\n.story--card .story-image {\n  border: 1px solid rgba(0, 0, 0, 0.04);\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  border-radius: 2px;\n  background-color: #fff !important;\n  -webkit-transition: all 150ms ease-in-out;\n  -o-transition: all 150ms ease-in-out;\n  transition: all 150ms ease-in-out;\n  overflow: hidden;\n  height: 200px !important;\n}\n\n/* line 149, src/styles/layouts/_story.scss */\n\n.story--card .story-image .story-img-bg {\n  margin: 10px;\n}\n\n/* line 151, src/styles/layouts/_story.scss */\n\n.story--card .story-image:hover {\n  -webkit-box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1);\n          box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1);\n}\n\n/* line 154, src/styles/layouts/_story.scss */\n\n.story--card .story-image:hover .story-img-bg {\n  -webkit-transform: none;\n       -o-transform: none;\n          transform: none;\n}\n\n/* line 158, src/styles/layouts/_story.scss */\n\n.story--card .story-lower {\n  display: none !important;\n}\n\n/* line 160, src/styles/layouts/_story.scss */\n\n.story--card .story-body {\n  padding: 15px 5px;\n  margin: 0 !important;\n}\n\n/* line 164, src/styles/layouts/_story.scss */\n\n.story--card .story-body h2 {\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  color: rgba(0, 0, 0, 0.9);\n  display: -webkit-box !important;\n  max-height: 2.4em !important;\n  overflow: hidden;\n  text-overflow: ellipsis !important;\n  margin: 0;\n}\n\n/* line 181, src/styles/layouts/_story.scss */\n\n.story-small {\n  /* stylelint-disable-next-line */\n}\n\n/* line 182, src/styles/layouts/_story.scss */\n\n.story-small h3 {\n  color: #fff;\n  max-height: 2.5em;\n  overflow: hidden;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n}\n\n/* line 192, src/styles/layouts/_story.scss */\n\n.story-small-img {\n  height: 170px;\n}\n\n/* line 197, src/styles/layouts/_story.scss */\n\n.story-small .media-type {\n  height: 34px;\n  width: 34px;\n}\n\n/* line 206, src/styles/layouts/_story.scss */\n\n.story--hover {\n  /* stylelint-disable-next-line */\n}\n\n/* line 208, src/styles/layouts/_story.scss */\n\n.story--hover .lazy-load-image,\n.story--hover h2,\n.story--hover h3 {\n  -webkit-transition: all .25s;\n  -o-transition: all .25s;\n  transition: all .25s;\n}\n\n/* line 211, src/styles/layouts/_story.scss */\n\n.story--hover:hover .lazy-load-image {\n  opacity: .8;\n}\n\n/* line 212, src/styles/layouts/_story.scss */\n\n.story--hover:hover h3,\n.story--hover:hover h2 {\n  opacity: .6;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 222, src/styles/layouts/_story.scss */\n\n  .story--grid .story-lower {\n    max-height: 3em;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    display: -webkit-box;\n    line-height: 1.1;\n    text-overflow: ellipsis;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 237, src/styles/layouts/_story.scss */\n\n  .cover--firts .story-cover {\n    height: 500px;\n  }\n\n  /* line 240, src/styles/layouts/_story.scss */\n\n  .story {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    margin-top: 20px;\n  }\n\n  /* line 244, src/styles/layouts/_story.scss */\n\n  .story-image {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n    margin-right: 0;\n  }\n\n  /* line 245, src/styles/layouts/_story.scss */\n\n  .story-body {\n    margin-top: 10px;\n  }\n}\n\n/* line 4, src/styles/layouts/_author.scss */\n\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, 0.6);\n  min-height: 350px;\n}\n\n/* line 9, src/styles/layouts/_author.scss */\n\n.author-avatar {\n  height: 80px;\n  width: 80px;\n}\n\n/* line 14, src/styles/layouts/_author.scss */\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 25px 16px 0;\n  opacity: .8;\n  word-wrap: break-word;\n}\n\n/* line 23, src/styles/layouts/_author.scss */\n\n.author-bio {\n  max-width: 700px;\n  font-size: 1.2rem;\n  font-weight: 300;\n  line-height: 1.4;\n}\n\n/* line 30, src/styles/layouts/_author.scss */\n\n.author-name {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 31, src/styles/layouts/_author.scss */\n\n.author-meta a:hover {\n  opacity: .8 !important;\n}\n\n/* line 34, src/styles/layouts/_author.scss */\n\n.cover-opacity {\n  opacity: .5;\n}\n\n/* line 36, src/styles/layouts/_author.scss */\n\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n}\n\n/* line 40, src/styles/layouts/_author.scss */\n\n.author.has--image a,\n.author.has--image .author-name {\n  color: #fff;\n}\n\n/* line 43, src/styles/layouts/_author.scss */\n\n.author.has--image .author-follow a {\n  border: 2px solid;\n  border-color: rgba(255, 255, 255, 0.5) !important;\n  font-size: 16px;\n}\n\n/* line 49, src/styles/layouts/_author.scss */\n\n.author.has--image .u-accentColor--iconNormal {\n  fill: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 53, src/styles/layouts/_author.scss */\n\n  .author-meta span {\n    display: block;\n  }\n\n  /* line 54, src/styles/layouts/_author.scss */\n\n  .author-header {\n    display: block;\n  }\n\n  /* line 55, src/styles/layouts/_author.scss */\n\n  .author-avatar {\n    margin: 0 auto 20px;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 59, src/styles/layouts/_author.scss */\n\n  body.has-cover .author {\n    min-height: 600px;\n  }\n}\n\n/* line 4, src/styles/layouts/_search.scss */\n\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateY(-100%);\n       -o-transform: translateY(-100%);\n          transform: translateY(-100%);\n  -webkit-transition: -webkit-transform .3s ease;\n  transition: -webkit-transform .3s ease;\n  -o-transition: -o-transform .3s ease;\n  transition: transform .3s ease;\n  transition: transform .3s ease, -webkit-transform .3s ease, -o-transform .3s ease;\n  z-index: 9;\n}\n\n/* line 16, src/styles/layouts/_search.scss */\n\n.search-form {\n  max-width: 680px;\n  margin-top: 80px;\n}\n\n/* line 20, src/styles/layouts/_search.scss */\n\n.search-form::before {\n  background: #eee;\n  bottom: 0;\n  content: '';\n  display: block;\n  height: 2px;\n  left: 0;\n  position: absolute;\n  width: 100%;\n  z-index: 1;\n}\n\n/* line 32, src/styles/layouts/_search.scss */\n\n.search-form input {\n  border: none;\n  display: block;\n  line-height: 40px;\n  padding-bottom: 8px;\n}\n\n/* line 38, src/styles/layouts/_search.scss */\n\n.search-form input:focus {\n  outline: 0;\n}\n\n/* line 43, src/styles/layouts/_search.scss */\n\n.search-results {\n  max-height: calc(100% - 100px);\n  max-width: 680px;\n  overflow: auto;\n}\n\n/* line 48, src/styles/layouts/_search.scss */\n\n.search-results a {\n  padding: 10px 20px;\n  background: rgba(0, 0, 0, 0.05);\n  color: rgba(0, 0, 0, 0.7);\n  text-decoration: none;\n  display: block;\n  border-bottom: 1px solid #fff;\n  -webkit-transition: all 0.3s ease-in-out;\n  -o-transition: all 0.3s ease-in-out;\n  transition: all 0.3s ease-in-out;\n}\n\n/* line 57, src/styles/layouts/_search.scss */\n\n.search-results a:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n/* line 62, src/styles/layouts/_search.scss */\n\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px;\n}\n\n/* line 68, src/styles/layouts/_search.scss */\n\nbody.is-search {\n  overflow: hidden;\n}\n\n/* line 71, src/styles/layouts/_search.scss */\n\nbody.is-search .search {\n  -webkit-transform: translateY(0);\n       -o-transform: translateY(0);\n          transform: translateY(0);\n}\n\n/* line 72, src/styles/layouts/_search.scss */\n\nbody.is-search .search-toggle {\n  background-color: rgba(255, 255, 255, 0.25);\n}\n\n/* line 2, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n}\n\n/* line 5, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title span {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n  padding-bottom: 10px;\n  margin-bottom: -1px;\n}\n\n/* line 14, src/styles/layouts/_sidebar.scss */\n\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, 0.2);\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n/* line 23, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n  min-height: 60px;\n}\n\n/* line 29, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post h3 {\n  padding: 10px;\n}\n\n/* line 31, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:hover .sidebar-border {\n  background-color: #e5eff5;\n}\n\n/* line 33, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n) .sidebar-border {\n  border-color: #f59e00;\n}\n\n/* line 34, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n+2) .sidebar-border {\n  border-color: #26a8ed;\n}\n\n/* line 2, src/styles/layouts/_sidenav.scss */\n\n.sideNav {\n  color: rgba(0, 0, 0, 0.8);\n  height: 100vh;\n  padding: 50px 20px;\n  position: fixed !important;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transition: 0.4s;\n  -o-transition: 0.4s;\n  transition: 0.4s;\n  will-change: transform;\n  z-index: 8;\n}\n\n/* line 13, src/styles/layouts/_sidenav.scss */\n\n.sideNav-menu a {\n  padding: 10px 20px;\n}\n\n/* line 15, src/styles/layouts/_sidenav.scss */\n\n.sideNav-wrap {\n  background: #eee;\n  overflow: auto;\n  padding: 20px 0;\n  top: 50px;\n}\n\n/* line 22, src/styles/layouts/_sidenav.scss */\n\n.sideNav-section {\n  border-bottom: solid 1px #ddd;\n  margin-bottom: 8px;\n  padding-bottom: 8px;\n}\n\n/* line 28, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow {\n  border-top: 1px solid #ddd;\n  margin: 15px 0;\n}\n\n/* line 32, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow a {\n  color: #fff;\n  display: inline-block;\n  height: 36px;\n  line-height: 20px;\n  margin: 0 5px 5px 0;\n  min-width: 36px;\n  padding: 8px;\n  text-align: center;\n  vertical-align: middle;\n}\n\n/* line 17, src/styles/layouts/helper.scss */\n\n.has-cover-padding {\n  padding-top: 100px;\n}\n\n/* line 20, src/styles/layouts/helper.scss */\n\nbody.has-cover .header {\n  position: fixed;\n}\n\n/* line 23, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header {\n  background: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n/* line 29, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header-left a,\nbody.has-cover.is-transparency:not(.is-search) .nav ul li a {\n  color: #fff;\n}\n\n/* line 30, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .menu--toggle span {\n  background-color: #fff;\n}\n\n/* line 5, src/styles/layouts/subscribe.scss */\n\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%;\n}\n\n/* line 10, src/styles/layouts/subscribe.scss */\n\n.subscribe-card {\n  background-color: #D7EFEE;\n  -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  width: 900px;\n  height: 550px;\n  padding: 50px;\n  margin: 5px;\n}\n\n/* line 20, src/styles/layouts/subscribe.scss */\n\n.subscribe form {\n  max-width: 300px;\n}\n\n/* line 24, src/styles/layouts/subscribe.scss */\n\n.subscribe-form {\n  height: 100%;\n}\n\n/* line 28, src/styles/layouts/subscribe.scss */\n\n.subscribe-input {\n  background: 0 0;\n  border: 0;\n  border-bottom: 1px solid #cc5454;\n  border-radius: 0;\n  padding: 7px 5px;\n  height: 45px;\n  outline: 0;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n}\n\n/* line 38, src/styles/layouts/subscribe.scss */\n\n.subscribe-input::-webkit-input-placeholder {\n  color: #cc5454;\n}\n\n.subscribe-input::-ms-input-placeholder {\n  color: #cc5454;\n}\n\n.subscribe-input::placeholder {\n  color: #cc5454;\n}\n\n/* line 43, src/styles/layouts/subscribe.scss */\n\n.subscribe .main-error {\n  color: #cc5454;\n  font-size: 16px;\n  margin-top: 15px;\n}\n\n/* line 65, src/styles/layouts/subscribe.scss */\n\n.subscribe-success .subscribe-card {\n  background-color: #E8F3EC;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 71, src/styles/layouts/subscribe.scss */\n\n  .subscribe-card {\n    height: auto;\n    width: auto;\n  }\n}\n\n/* line 4, src/styles/layouts/_comments.scss */\n\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  font-size: 14px;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transition: .2s;\n  -o-transition: .2s;\n  transition: .2s;\n  will-change: transform;\n}\n\n/* line 21, src/styles/layouts/_comments.scss */\n\n.post-comments-header {\n  padding: 20px;\n  border-bottom: 1px solid #ddd;\n}\n\n/* line 25, src/styles/layouts/_comments.scss */\n\n.post-comments-header .toggle-comments {\n  font-size: 24px;\n  line-height: 1;\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 17px;\n  cursor: pointer;\n}\n\n/* line 36, src/styles/layouts/_comments.scss */\n\n.post-comments-overlay {\n  position: fixed !important;\n  background-color: rgba(0, 0, 0, 0.2);\n  display: none;\n  -webkit-transition: background-color .4s linear;\n  -o-transition: background-color .4s linear;\n  transition: background-color .4s linear;\n  z-index: 8;\n  cursor: pointer;\n}\n\n/* line 46, src/styles/layouts/_comments.scss */\n\nbody.has-comments {\n  overflow: hidden;\n}\n\n/* line 49, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments-overlay {\n  display: block;\n}\n\n/* line 50, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments {\n  -webkit-transform: translateX(0);\n       -o-transform: translateX(0);\n          transform: translateX(0);\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 54, src/styles/layouts/_comments.scss */\n\n  .post-comments {\n    left: auto;\n    max-width: 700px;\n    min-width: 500px;\n    top: 50px;\n    z-index: 9;\n  }\n}\n\n/* line 2, src/styles/layouts/_topic.scss */\n\n.topic-img {\n  -webkit-transition: -webkit-transform .7s;\n  transition: -webkit-transform .7s;\n  -o-transition: -o-transform .7s;\n  transition: transform .7s;\n  transition: transform .7s, -webkit-transform .7s, -o-transform .7s;\n  -webkit-transform: translateZ(0);\n          transform: translateZ(0);\n}\n\n/* line 7, src/styles/layouts/_topic.scss */\n\n.topic-items {\n  height: 320px;\n  padding: 30px;\n}\n\n/* line 12, src/styles/layouts/_topic.scss */\n\n.topic-items:hover .topic-img {\n  -webkit-transform: scale(1.03);\n       -o-transform: scale(1.03);\n          transform: scale(1.03);\n}\n\n/* line 16, src/styles/layouts/_topic.scss */\n\n.topic-c {\n  background-color: var(--primary-color);\n  color: #fff;\n}\n\n/* line 1, src/styles/common/_modal.scss */\n\n.modal {\n  opacity: 0;\n  -webkit-transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  -o-transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden;\n}\n\n/* line 8, src/styles/common/_modal.scss */\n\n.modal-shader {\n  background-color: rgba(255, 255, 255, 0.65);\n}\n\n/* line 11, src/styles/common/_modal.scss */\n\n.modal-close {\n  color: rgba(0, 0, 0, 0.54);\n  position: absolute;\n  top: 0;\n  right: 0;\n  line-height: 1;\n  padding: 15px;\n}\n\n/* line 21, src/styles/common/_modal.scss */\n\n.modal-inner {\n  background-color: #E8F3EC;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  max-width: 700px;\n  height: 100%;\n  max-height: 400px;\n  opacity: 0;\n  padding: 72px 5% 56px;\n  -webkit-transform: scale(0.6);\n       -o-transform: scale(0.6);\n          transform: scale(0.6);\n  -webkit-transition: opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -webkit-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  transition: opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -webkit-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  -o-transition: opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -o-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -webkit-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -o-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  width: 100%;\n}\n\n/* line 36, src/styles/common/_modal.scss */\n\n.modal .form-group {\n  width: 76%;\n  margin: 0 auto 30px;\n}\n\n/* line 41, src/styles/common/_modal.scss */\n\n.modal .form--input {\n  display: inline-block;\n  margin-bottom: 10px;\n  vertical-align: top;\n  height: 40px;\n  line-height: 40px;\n  background-color: transparent;\n  padding: 17px 6px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n  width: 100%;\n}\n\n/* line 71, src/styles/common/_modal.scss */\n\nbody.has-modal {\n  overflow: hidden;\n}\n\n/* line 74, src/styles/common/_modal.scss */\n\nbody.has-modal .modal {\n  opacity: 1;\n  visibility: visible;\n  -webkit-transition: opacity .3s ease;\n  -o-transition: opacity .3s ease;\n  transition: opacity .3s ease;\n}\n\n/* line 79, src/styles/common/_modal.scss */\n\nbody.has-modal .modal-inner {\n  opacity: 1;\n  -webkit-transform: scale(1);\n       -o-transform: scale(1);\n          transform: scale(1);\n  -webkit-transition: -webkit-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  transition: -webkit-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  -o-transition: -o-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96), -webkit-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96), -o-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n}\n\n/* line 4, src/styles/common/_widget.scss */\n\n.instagram-hover {\n  background-color: rgba(0, 0, 0, 0.3);\n  opacity: 0;\n}\n\n/* line 10, src/styles/common/_widget.scss */\n\n.instagram-img {\n  height: 264px;\n}\n\n/* line 13, src/styles/common/_widget.scss */\n\n.instagram-img:hover > .instagram-hover {\n  opacity: 1;\n}\n\n/* line 16, src/styles/common/_widget.scss */\n\n.instagram-name {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  z-index: 3;\n}\n\n/* line 22, src/styles/common/_widget.scss */\n\n.instagram-name a {\n  background-color: #fff;\n  color: #000 !important;\n  font-size: 18px !important;\n  font-weight: 900 !important;\n  min-width: 200px;\n  padding-left: 10px !important;\n  padding-right: 10px !important;\n  text-align: center !important;\n}\n\n/* line 34, src/styles/common/_widget.scss */\n\n.instagram-col {\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n/* line 39, src/styles/common/_widget.scss */\n\n.instagram-wrap {\n  margin: 0 !important;\n}\n\n/* line 44, src/styles/common/_widget.scss */\n\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative;\n}\n\n/* line 50, src/styles/common/_widget.scss */\n\n.witget-subscribe::before {\n  content: \"\";\n  border: 5px solid #f5f5f5;\n  -webkit-box-shadow: inset 0 0 0 1px #d7d7d7;\n          box-shadow: inset 0 0 0 1px #d7d7d7;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  display: block;\n  height: calc(100% + 10px);\n  left: -5px;\n  pointer-events: none;\n  position: absolute;\n  top: -5px;\n  width: calc(100% + 10px);\n  z-index: 1;\n}\n\n/* line 65, src/styles/common/_widget.scss */\n\n.witget-subscribe input {\n  background: #fff;\n  border: 1px solid #e5e5e5;\n  color: rgba(0, 0, 0, 0.54);\n  height: 41px;\n  outline: 0;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 75, src/styles/common/_widget.scss */\n\n.witget-subscribe button {\n  background: var(--composite-color);\n  border-radius: 0;\n  width: 100%;\n}\n\n", "", {"version":3,"sources":["C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/main.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/node_modules/normalize.css/normalize.css","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/main.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/node_modules/prismjs/themes/prism.css","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_mixins.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/autoload/_zoom.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_global.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/components/_grid.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_typography.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_utilities.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/components/_form.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/components/_icons.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/components/_animated.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_header.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_footer.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_homepage.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_post.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_story.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_author.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_search.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_sidebar.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_sidenav.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/helper.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/subscribe.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_comments.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_topic.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_modal.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_widget.scss"],"names":[],"mappings":"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A;;AOtkBE;;EAAsB,qCAAA;CL87BvB;;AFpXD,8CAAA;;AO3kBE;EAAqB,0BAAA;CLq8BtB;;AFtXD,8CAAA;;AO9kBE;;EAAsB,qCAAA;CL28BvB;;AFzXD,8CAAA;;AOnlBE;EAAqB,0BAAA;CLk9BtB;;AF3XD,8CAAA;;AOtlBE;;EAAsB,qCAAA;CLw9BvB;;AF9XD,8CAAA;;AO3lBE;EAAqB,uBAAA;CL+9BtB;;AFhYD,8CAAA;;AO9lBE;;EAAsB,kCAAA;CLq+BvB;;AFnYD,8CAAA;;AOnmBE;EAAqB,0BAAA;CL4+BtB;;AFrYD,8CAAA;;AOtmBE;;EAAsB,qCAAA;CLk/BvB;;AFxYD,8CAAA;;AO3mBE;EAAqB,0BAAA;CLy/BtB;;AF1YD,8CAAA;;AO9mBE;;EAAsB,qCAAA;CL+/BvB;;AF7YD,8CAAA;;AOnnBE;EAAqB,uBAAA;CLsgCtB;;AF/YD,8CAAA;;AOtnBE;;EAAsB,kCAAA;CL4gCvB;;AFlZD,8CAAA;;AO3nBE;EAAqB,0BAAA;CLmhCtB;;AFpZD,8CAAA;;AO9nBE;;EAAsB,qCAAA;CLyhCvB;;AFvZD,8CAAA;;AOnoBE;EAAqB,0BAAA;CLgiCtB;;AFzZD,8CAAA;;AOtoBE;;EAAsB,qCAAA;CLsiCvB;;AF5ZD,8CAAA;;AO3oBE;EAAqB,0BAAA;CL6iCtB;;AF9ZD,8CAAA;;AO9oBE;;EAAsB,qCAAA;CLmjCvB;;AFjaD,8CAAA;;AOnpBE;EAAqB,0BAAA;CL0jCtB;;AFnaD,8CAAA;;AOtpBE;;EAAsB,qCAAA;CLgkCvB;;AFtaD,8CAAA;;AO3pBE;EAAqB,0BAAA;CLukCtB;;AFxaD,8CAAA;;AO9pBE;;EAAsB,qCAAA;CL6kCvB;;AF3aD,8CAAA;;AOnqBE;EAAqB,0BAAA;CLolCtB;;AF7aD,8CAAA;;AOtqBE;;EAAsB,qCAAA;CL0lCvB;;AFhbD,8CAAA;;AO3qBE;EAAqB,0BAAA;CLimCtB;;AFlbD,8CAAA;;AO9qBE;;EAAsB,qCAAA;CLumCvB;;AFrbD,8CAAA;;AOnrBE;EAAqB,uBAAA;CL8mCtB;;AFvbD,8CAAA;;AOtrBE;;EAAsB,kCAAA;CLonCvB;;AF1bD,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;CV69FD;;AF/6BD,gDAAA;;AY5iEA;EACE,iBAAA;CVg+FD;;AFj7BD,gDAAA;;AY7iEA;EACE,iBAAA;CVm+FD;;AFn7BD,gDAAA;;AY9iEA;EACE,iBAAA;CVs+FD;;AFr7BD,gDAAA;;AY/iEA;EACE,iBAAA;CVy+FD;;AFv7BD,gDAAA;;AYhjEA;EACE,iBAAA;CV4+FD;;AFz7BD,gDAAA;;AYjjEA;EACE,iBAAA;CV++FD;;AF37BD,gDAAA;;AYljEA;EACE,iBAAA;CVk/FD;;AF77BD,gDAAA;;AYnjEA;EACE,iBAAA;CVq/FD;;AF/7BD,gDAAA;;AYpjEA;EACE,iBAAA;CVw/FD;;AFj8BD,gDAAA;;AYrjEA;EACE,iBAAA;CV2/FD;;AFn8BD,gDAAA;;AYtjEA;EACE,iBAAA;CV8/FD;;AFr8BD,gDAAA;;AYvjEA;EACE,iBAAA;CVigGD;;AFv8BD,gDAAA;;AYxjEA;EACE,iBAAA;CVogGD;;AFz8BD,gDAAA;;AYzjEA;EACE,iBAAA;CVugGD;;AF38BD,gDAAA;;AY1jEA;EACE,iBAAA;CV0gGD;;AF78BD,gDAAA;;AY3jEA;EACE,iBAAA;CV6gGD;;AF/8BD,gDAAA;;AY5jEA;EACE,iBAAA;CVghGD;;AFj9BD,iDAAA;;AY7jEA;EACE,iBAAA;CVmhGD;;AFn9BD,iDAAA;;AY9jEA;EACE,iBAAA;CVshGD;;AFr9BD,iDAAA;;AY/jEA;EACE,iBAAA;CVyhGD;;AFv9BD,iDAAA;;AYhkEA;EACE,iBAAA;CV4hGD;;AFz9BD,iDAAA;;AYjkEA;EACE,iBAAA;CV+hGD;;AF39BD,iDAAA;;AYlkEA;EACE,iBAAA;CVkiGD;;AF79BD,iDAAA;;AYnkEA;EACE,iBAAA;CVqiGD;;AF/9BD,iDAAA;;AYpkEA;EACE,iBAAA;CVwiGD;;AFj+BD,iDAAA;;AYrkEA;EACE,iBAAA;CV2iGD;;AFn+BD,iDAAA;;AYtkEA;EACE,iBAAA;CV8iGD;;AFr+BD,iDAAA;;AYvkEA;EACE,iBAAA;CVijGD;;AFv+BD,iDAAA;;AYxkEA;EACE,iBAAA;CVojGD;;AFz+BD,iDAAA;;AYzkEA;EACE,iBAAA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","file":"main.scss","sourcesContent":["@charset \"UTF-8\";\n/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n/* Document\n   ========================================================================== */\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n/* line 11, node_modules/normalize.css/normalize.css */\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/* Sections\n   ========================================================================== */\n/**\n * Remove the margin in all browsers.\n */\n/* line 23, node_modules/normalize.css/normalize.css */\nbody {\n  margin: 0; }\n\n/**\n * Render the `main` element consistently in IE.\n */\n/* line 31, node_modules/normalize.css/normalize.css */\nmain {\n  display: block; }\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n/* line 40, node_modules/normalize.css/normalize.css */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n/* line 53, node_modules/normalize.css/normalize.css */\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */ }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n/* line 64, node_modules/normalize.css/normalize.css */\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Remove the gray background on active links in IE 10.\n */\n/* line 76, node_modules/normalize.css/normalize.css */\na {\n  background-color: transparent; }\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n/* line 85, node_modules/normalize.css/normalize.css */\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */ }\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n/* line 95, node_modules/normalize.css/normalize.css */\nb,\nstrong {\n  font-weight: bolder; }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n/* line 105, node_modules/normalize.css/normalize.css */\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/**\n * Add the correct font size in all browsers.\n */\n/* line 116, node_modules/normalize.css/normalize.css */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n/* line 125, node_modules/normalize.css/normalize.css */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\n/* line 133, node_modules/normalize.css/normalize.css */\nsub {\n  bottom: -0.25em; }\n\n/* line 137, node_modules/normalize.css/normalize.css */\nsup {\n  top: -0.5em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove the border on images inside links in IE 10.\n */\n/* line 148, node_modules/normalize.css/normalize.css */\nimg {\n  border-style: none; }\n\n/* Forms\n   ========================================================================== */\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n/* line 160, node_modules/normalize.css/normalize.css */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */ }\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n/* line 176, node_modules/normalize.css/normalize.css */\nbutton,\ninput {\n  /* 1 */\n  overflow: visible; }\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n/* line 186, node_modules/normalize.css/normalize.css */\nbutton,\nselect {\n  /* 1 */\n  text-transform: none; }\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n/* line 195, node_modules/normalize.css/normalize.css */\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n/* line 206, node_modules/normalize.css/normalize.css */\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0; }\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n/* line 218, node_modules/normalize.css/normalize.css */\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText; }\n\n/**\n * Correct the padding in Firefox.\n */\n/* line 229, node_modules/normalize.css/normalize.css */\nfieldset {\n  padding: 0.35em 0.75em 0.625em; }\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n/* line 240, node_modules/normalize.css/normalize.css */\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */ }\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n/* line 253, node_modules/normalize.css/normalize.css */\nprogress {\n  vertical-align: baseline; }\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n/* line 261, node_modules/normalize.css/normalize.css */\ntextarea {\n  overflow: auto; }\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n/* line 270, node_modules/normalize.css/normalize.css */\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n/* line 280, node_modules/normalize.css/normalize.css */\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n/* line 290, node_modules/normalize.css/normalize.css */\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */ }\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n/* line 299, node_modules/normalize.css/normalize.css */\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n/* line 308, node_modules/normalize.css/normalize.css */\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */ }\n\n/* Interactive\n   ========================================================================== */\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n/* line 320, node_modules/normalize.css/normalize.css */\ndetails {\n  display: block; }\n\n/*\n * Add the correct display in all browsers.\n */\n/* line 328, node_modules/normalize.css/normalize.css */\nsummary {\n  display: list-item; }\n\n/* Misc\n   ========================================================================== */\n/**\n * Add the correct display in IE 10+.\n */\n/* line 339, node_modules/normalize.css/normalize.css */\ntemplate {\n  display: none; }\n\n/**\n * Add the correct display in IE 10.\n */\n/* line 347, node_modules/normalize.css/normalize.css */\n[hidden] {\n  display: none; }\n\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n/* line 7, node_modules/prismjs/themes/prism.css */\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none; }\n\n/* line 30, node_modules/prismjs/themes/prism.css */\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc; }\n\n/* line 36, node_modules/prismjs/themes/prism.css */\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc; }\n\n@media print {\n  /* line 43, node_modules/prismjs/themes/prism.css */\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none; } }\n\n/* Code blocks */\n/* line 50, node_modules/prismjs/themes/prism.css */\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto; }\n\n/* line 56, node_modules/prismjs/themes/prism.css */\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0; }\n\n/* Inline code */\n/* line 62, node_modules/prismjs/themes/prism.css */\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal; }\n\n/* line 68, node_modules/prismjs/themes/prism.css */\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray; }\n\n/* line 75, node_modules/prismjs/themes/prism.css */\n.token.punctuation {\n  color: #999; }\n\n/* line 79, node_modules/prismjs/themes/prism.css */\n.namespace {\n  opacity: .7; }\n\n/* line 83, node_modules/prismjs/themes/prism.css */\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905; }\n\n/* line 93, node_modules/prismjs/themes/prism.css */\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690; }\n\n/* line 102, node_modules/prismjs/themes/prism.css */\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #9a6e3a;\n  background: rgba(255, 255, 255, 0.5); }\n\n/* line 111, node_modules/prismjs/themes/prism.css */\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a; }\n\n/* line 117, node_modules/prismjs/themes/prism.css */\n.token.function,\n.token.class-name {\n  color: #DD4A68; }\n\n/* line 122, node_modules/prismjs/themes/prism.css */\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90; }\n\n/* line 128, node_modules/prismjs/themes/prism.css */\n.token.important,\n.token.bold {\n  font-weight: bold; }\n\n/* line 132, node_modules/prismjs/themes/prism.css */\n.token.italic {\n  font-style: italic; }\n\n/* line 136, node_modules/prismjs/themes/prism.css */\n.token.entity {\n  cursor: help; }\n\n/* line 1, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\npre[class*=\"language-\"].line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber; }\n\n/* line 7, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\npre[class*=\"language-\"].line-numbers > code {\n  position: relative;\n  white-space: inherit; }\n\n/* line 12, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n/* line 29, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber; }\n\n/* line 35, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right; }\n\n/* line 1, src/styles/common/_mixins.scss */\n.link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none; }\n\n/* line 7, src/styles/common/_mixins.scss */\n.link--accent {\n  color: var(--primary-color);\n  text-decoration: none; }\n\n/* line 22, src/styles/common/_mixins.scss */\n.u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0; }\n\n/* line 30, src/styles/common/_mixins.scss */\n.u-textColorDarker {\n  color: rgba(0, 0, 0, 0.8) !important;\n  fill: rgba(0, 0, 0, 0.8) !important; }\n\n/* line 35, src/styles/common/_mixins.scss */\n.warning::before, .note::before, .success::before, [class^=\"i-\"]::before, [class*=\" i-\"]::before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n/* line 2, src/styles/autoload/_zoom.scss */\nimg[data-action=\"zoom\"] {\n  cursor: zoom-in; }\n\n/* line 5, src/styles/autoload/_zoom.scss */\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  transition: all 300ms; }\n\n/* line 13, src/styles/autoload/_zoom.scss */\nimg.zoom-img {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: -moz-zoom-out; }\n\n/* line 18, src/styles/autoload/_zoom.scss */\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  filter: \"alpha(opacity=0)\";\n  opacity: 0;\n  -webkit-transition: opacity 300ms;\n  -o-transition: opacity 300ms;\n  transition: opacity 300ms; }\n\n/* line 33, src/styles/autoload/_zoom.scss */\n.zoom-overlay-open .zoom-overlay {\n  filter: \"alpha(opacity=100)\";\n  opacity: 1; }\n\n/* line 37, src/styles/autoload/_zoom.scss */\n.zoom-overlay-open,\n.zoom-overlay-transitioning {\n  cursor: default; }\n\n/* line 1, src/styles/common/_global.scss */\n:root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d; }\n\n/* line 15, src/styles/common/_global.scss */\n*, *::before, *::after {\n  box-sizing: border-box; }\n\n/* line 19, src/styles/common/_global.scss */\na {\n  color: inherit;\n  text-decoration: none; }\n  /* line 23, src/styles/common/_global.scss */\n  a:active, a:hover {\n    outline: 0; }\n\n/* line 29, src/styles/common/_global.scss */\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px; }\n  /* line 42, src/styles/common/_global.scss */\n  blockquote p:first-of-type {\n    margin-top: 0; }\n\n/* line 45, src/styles/common/_global.scss */\nbody {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 16px;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden; }\n\n/* line 59, src/styles/common/_global.scss */\nhtml {\n  box-sizing: border-box;\n  font-size: 16px; }\n\n/* line 64, src/styles/common/_global.scss */\nfigure {\n  margin: 0; }\n\n/* line 68, src/styles/common/_global.scss */\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 0.9375rem;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%; }\n\n/* line 89, src/styles/common/_global.scss */\nkbd, samp, code {\n  background: #f7f7f7;\n  border-radius: 4px;\n  color: #c7254e;\n  font-family: \"Roboto Mono\", Dank Mono, Fira Mono, monospace !important;\n  font-size: 15px;\n  padding: 4px 6px;\n  white-space: pre-wrap; }\n\n/* line 99, src/styles/common/_global.scss */\npre {\n  background-color: #f7f7f7 !important;\n  border-radius: 4px;\n  font-family: \"Roboto Mono\", Dank Mono, Fira Mono, monospace !important;\n  font-size: 15px;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal; }\n  /* line 111, src/styles/common/_global.scss */\n  pre code {\n    background: transparent;\n    color: #37474f;\n    padding: 0;\n    text-shadow: 0 1px #fff; }\n\n/* line 119, src/styles/common/_global.scss */\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #37474f;\n  line-height: 1.4; }\n  /* line 124, src/styles/common/_global.scss */\n  code[class*=language-] .token.comment,\n  pre[class*=language-] .token.comment {\n    opacity: .8; }\n  /* line 126, src/styles/common/_global.scss */\n  code[class*=language-].line-numbers,\n  pre[class*=language-].line-numbers {\n    padding-left: 58px; }\n    /* line 129, src/styles/common/_global.scss */\n    code[class*=language-].line-numbers::before,\n    pre[class*=language-].line-numbers::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0;\n      background: #F0EDEE;\n      width: 40px;\n      height: 100%; }\n  /* line 140, src/styles/common/_global.scss */\n  code[class*=language-] .line-numbers-rows,\n  pre[class*=language-] .line-numbers-rows {\n    border-right: none;\n    top: -3px;\n    left: -58px; }\n    /* line 145, src/styles/common/_global.scss */\n    code[class*=language-] .line-numbers-rows > span::before,\n    pre[class*=language-] .line-numbers-rows > span::before {\n      padding-right: 0;\n      text-align: center;\n      opacity: .8; }\n\n/* line 155, src/styles/common/_global.scss */\nhr:not(.hr-list) {\n  margin: 40px auto 10px;\n  height: 1px;\n  background-color: #ddd;\n  border: 0;\n  max-width: 100%; }\n\n/* line 163, src/styles/common/_global.scss */\n.post-footer-hr {\n  margin: 32px 0; }\n\n/* line 170, src/styles/common/_global.scss */\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto; }\n  /* line 176, src/styles/common/_global.scss */\n  img:not([src]) {\n    visibility: hidden; }\n\n/* line 181, src/styles/common/_global.scss */\ni {\n  vertical-align: middle; }\n\n/* line 186, src/styles/common/_global.scss */\ninput {\n  border: none;\n  outline: 0; }\n\n/* line 191, src/styles/common/_global.scss */\nol, ul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0; }\n\n/* line 198, src/styles/common/_global.scss */\nmark {\n  background-color: transparent !important;\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8); }\n\n/* line 204, src/styles/common/_global.scss */\nq {\n  color: rgba(0, 0, 0, 0.44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left; }\n  /* line 216, src/styles/common/_global.scss */\n  q::before, q::after {\n    display: none; }\n\n/* line 219, src/styles/common/_global.scss */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch; }\n  /* line 234, src/styles/common/_global.scss */\n  table th,\n  table td {\n    padding: 6px 13px;\n    border: 1px solid #dfe2e5; }\n  /* line 240, src/styles/common/_global.scss */\n  table tr:nth-child(2n) {\n    background-color: #f6f8fa; }\n  /* line 244, src/styles/common/_global.scss */\n  table th {\n    letter-spacing: 0.2px;\n    text-transform: uppercase;\n    font-weight: 600; }\n\n/* line 258, src/styles/common/_global.scss */\n.link--underline:active, .link--underline:focus, .link--underline:hover {\n  text-decoration: underline; }\n\n/* line 268, src/styles/common/_global.scss */\n.main {\n  margin-bottom: 4em;\n  min-height: 90vh; }\n\n/* line 270, src/styles/common/_global.scss */\n.main,\n.footer {\n  transition: transform .5s ease; }\n\n/* line 275, src/styles/common/_global.scss */\n.warning {\n  background: #fbe9e7;\n  color: #d50000; }\n  /* line 278, src/styles/common/_global.scss */\n  .warning::before {\n    content: \"\"; }\n\n/* line 281, src/styles/common/_global.scss */\n.note {\n  background: #e1f5fe;\n  color: #0288d1; }\n  /* line 284, src/styles/common/_global.scss */\n  .note::before {\n    content: \"\"; }\n\n/* line 287, src/styles/common/_global.scss */\n.success {\n  background: #e0f2f1;\n  color: #00897b; }\n  /* line 290, src/styles/common/_global.scss */\n  .success::before {\n    color: #00bfa5;\n    content: \"\"; }\n\n/* line 293, src/styles/common/_global.scss */\n.warning, .note, .success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px; }\n  /* line 300, src/styles/common/_global.scss */\n  .warning a, .note a, .success a {\n    color: inherit;\n    text-decoration: underline; }\n  /* line 305, src/styles/common/_global.scss */\n  .warning::before, .note::before, .success::before {\n    float: left;\n    font-size: 24px;\n    margin-left: -36px;\n    margin-top: -5px; }\n\n/* line 318, src/styles/common/_global.scss */\n.tag-description {\n  max-width: 700px;\n  font-size: 1.2rem;\n  font-weight: 300;\n  line-height: 1.4; }\n\n/* line 324, src/styles/common/_global.scss */\n.tag.has--image {\n  min-height: 350px; }\n\n/* line 329, src/styles/common/_global.scss */\n.with-tooltip {\n  overflow: visible;\n  position: relative; }\n  /* line 333, src/styles/common/_global.scss */\n  .with-tooltip::after {\n    background: rgba(0, 0, 0, 0.85);\n    border-radius: 4px;\n    color: #fff;\n    content: attr(data-tooltip);\n    display: inline-block;\n    font-size: 12px;\n    font-weight: 600;\n    left: 50%;\n    line-height: 1.25;\n    min-width: 130px;\n    opacity: 0;\n    padding: 4px 8px;\n    pointer-events: none;\n    position: absolute;\n    text-align: center;\n    text-transform: none;\n    top: -30px;\n    will-change: opacity, transform;\n    z-index: 1; }\n  /* line 355, src/styles/common/_global.scss */\n  .with-tooltip:hover::after {\n    animation: tooltip .1s ease-out both; }\n\n/* line 362, src/styles/common/_global.scss */\n.errorPage {\n  font-family: 'Roboto Mono', monospace; }\n  /* line 365, src/styles/common/_global.scss */\n  .errorPage-link {\n    left: -5px;\n    padding: 24px 60px;\n    top: -6px; }\n  /* line 371, src/styles/common/_global.scss */\n  .errorPage-text {\n    margin-top: 60px;\n    white-space: pre-wrap; }\n  /* line 376, src/styles/common/_global.scss */\n  .errorPage-wrap {\n    color: rgba(0, 0, 0, 0.4);\n    padding: 7vw 4vw; }\n\n/* line 384, src/styles/common/_global.scss */\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%; }\n  /* line 393, src/styles/common/_global.scss */\n  .video-responsive iframe {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%; }\n  /* line 403, src/styles/common/_global.scss */\n  .video-responsive video {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%; }\n\n/* line 414, src/styles/common/_global.scss */\n.kg-embed-card .video-responsive {\n  margin-top: 0; }\n\n/* line 420, src/styles/common/_global.scss */\n.kg-gallery-container {\n  display: flex;\n  flex-direction: column;\n  max-width: 100%;\n  width: 100%; }\n\n/* line 427, src/styles/common/_global.scss */\n.kg-gallery-row {\n  display: flex;\n  flex-direction: row;\n  justify-content: center; }\n  /* line 432, src/styles/common/_global.scss */\n  .kg-gallery-row:not(:first-of-type) {\n    margin: 0.75em 0 0 0; }\n\n/* line 436, src/styles/common/_global.scss */\n.kg-gallery-image img {\n  display: block;\n  margin: 0;\n  width: 100%;\n  height: 100%; }\n\n/* line 443, src/styles/common/_global.scss */\n.kg-gallery-image:not(:first-of-type) {\n  margin: 0 0 0 0.75em; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-facebook {\n  color: #3b5998 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-facebook, .sideNav-follow .i-facebook {\n  background-color: #3b5998 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-twitter {\n  color: #55acee !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-twitter, .sideNav-follow .i-twitter {\n  background-color: #55acee !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-google {\n  color: #dd4b39 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-google, .sideNav-follow .i-google {\n  background-color: #dd4b39 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-instagram {\n  color: #306088 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-instagram, .sideNav-follow .i-instagram {\n  background-color: #306088 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-youtube {\n  color: #e52d27 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-youtube, .sideNav-follow .i-youtube {\n  background-color: #e52d27 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-github {\n  color: #555 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-github, .sideNav-follow .i-github {\n  background-color: #555 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-linkedin {\n  color: #007bb6 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-linkedin, .sideNav-follow .i-linkedin {\n  background-color: #007bb6 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-spotify {\n  color: #2ebd59 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-spotify, .sideNav-follow .i-spotify {\n  background-color: #2ebd59 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-codepen {\n  color: #222 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-codepen, .sideNav-follow .i-codepen {\n  background-color: #222 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-behance {\n  color: #131418 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-behance, .sideNav-follow .i-behance {\n  background-color: #131418 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-dribbble {\n  color: #ea4c89 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-dribbble, .sideNav-follow .i-dribbble {\n  background-color: #ea4c89 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-flickr {\n  color: #0063dc !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-flickr, .sideNav-follow .i-flickr {\n  background-color: #0063dc !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-reddit {\n  color: #ff4500 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-reddit, .sideNav-follow .i-reddit {\n  background-color: #ff4500 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-pocket {\n  color: #f50057 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-pocket, .sideNav-follow .i-pocket {\n  background-color: #f50057 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-pinterest {\n  color: #bd081c !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-pinterest, .sideNav-follow .i-pinterest {\n  background-color: #bd081c !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-whatsapp {\n  color: #64d448 !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-whatsapp, .sideNav-follow .i-whatsapp {\n  background-color: #64d448 !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-telegram {\n  color: #08c !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-telegram, .sideNav-follow .i-telegram {\n  background-color: #08c !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-discord {\n  color: #7289da !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-discord, .sideNav-follow .i-discord {\n  background-color: #7289da !important; }\n\n/* line 450, src/styles/common/_global.scss */\n.c-rss {\n  color: orange !important; }\n\n/* line 451, src/styles/common/_global.scss */\n.bg-rss, .sideNav-follow .i-rss {\n  background-color: orange !important; }\n\n/* line 474, src/styles/common/_global.scss */\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5; }\n  /* line 482, src/styles/common/_global.scss */\n  .rocket:hover svg path {\n    fill: rgba(0, 0, 0, 0.6); }\n\n/* line 487, src/styles/common/_global.scss */\n.svgIcon {\n  display: inline-block; }\n\n/* line 491, src/styles/common/_global.scss */\nsvg {\n  height: auto;\n  width: 100%; }\n\n/* line 499, src/styles/common/_global.scss */\n.load-more {\n  max-width: 70% !important; }\n\n/* line 504, src/styles/common/_global.scss */\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  z-index: 800; }\n\n/* line 516, src/styles/common/_global.scss */\n.is-loading .loadingBar {\n  animation: loading-bar 1s ease-in-out infinite;\n  animation-delay: .8s;\n  display: block; }\n\n@media only screen and (max-width: 766px) {\n  /* line 525, src/styles/common/_global.scss */\n  blockquote {\n    margin-left: -5px;\n    font-size: 1.125rem; }\n  /* line 527, src/styles/common/_global.scss */\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px; } }\n\n/* line 2, src/styles/components/_grid.scss */\n.extreme-container {\n  box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 100%; }\n\n/* line 26, src/styles/components/_grid.scss */\n.col-left,\n.cc-video-left {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px; }\n\n@media only screen and (min-width: 1000px) {\n  /* line 39, src/styles/components/_grid.scss */\n  .col-left {\n    max-width: calc(100% - 340px); }\n  /* line 40, src/styles/components/_grid.scss */\n  .cc-video-left {\n    max-width: calc(100% - 320px); }\n  /* line 41, src/styles/components/_grid.scss */\n  .cc-video-right {\n    flex-basis: 320px !important;\n    max-width: 320px !important; }\n  /* line 42, src/styles/components/_grid.scss */\n  body.is-article .col-left {\n    padding-right: 40px; } }\n\n/* line 45, src/styles/components/_grid.scss */\n.col-right {\n  display: flex;\n  flex-direction: column;\n  padding-left: 12px;\n  padding-right: 12px;\n  width: 330px; }\n\n/* line 53, src/styles/components/_grid.scss */\n.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  flex: 0 1 auto;\n  margin-left: -12px;\n  margin-right: -12px; }\n  /* line 61, src/styles/components/_grid.scss */\n  .row .col {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n    padding-left: 12px;\n    padding-right: 12px; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s1 {\n      flex-basis: 8.33333%;\n      max-width: 8.33333%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s2 {\n      flex-basis: 16.66667%;\n      max-width: 16.66667%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s3 {\n      flex-basis: 25%;\n      max-width: 25%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s4 {\n      flex-basis: 33.33333%;\n      max-width: 33.33333%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s5 {\n      flex-basis: 41.66667%;\n      max-width: 41.66667%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s6 {\n      flex-basis: 50%;\n      max-width: 50%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s7 {\n      flex-basis: 58.33333%;\n      max-width: 58.33333%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s8 {\n      flex-basis: 66.66667%;\n      max-width: 66.66667%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s9 {\n      flex-basis: 75%;\n      max-width: 75%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s10 {\n      flex-basis: 83.33333%;\n      max-width: 83.33333%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s11 {\n      flex-basis: 91.66667%;\n      max-width: 91.66667%; }\n    /* line 72, src/styles/components/_grid.scss */\n    .row .col.s12 {\n      flex-basis: 100%;\n      max-width: 100%; }\n    @media only screen and (min-width: 766px) {\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      /* line 87, src/styles/components/_grid.scss */\n      .row .col.m12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n    @media only screen and (min-width: 1000px) {\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      /* line 103, src/styles/components/_grid.scss */\n      .row .col.l12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n\n/* line 3, src/styles/common/_typography.scss */\nh1, h2, h3, h4, h5, h6 {\n  color: inherit;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  margin: 0; }\n  /* line 10, src/styles/common/_typography.scss */\n  h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\n    color: inherit;\n    line-height: inherit; }\n\n/* line 16, src/styles/common/_typography.scss */\nh1 {\n  font-size: 2rem; }\n\n/* line 17, src/styles/common/_typography.scss */\nh2 {\n  font-size: 1.875rem; }\n\n/* line 18, src/styles/common/_typography.scss */\nh3 {\n  font-size: 1.6rem; }\n\n/* line 19, src/styles/common/_typography.scss */\nh4 {\n  font-size: 1.4rem; }\n\n/* line 20, src/styles/common/_typography.scss */\nh5 {\n  font-size: 1.2rem; }\n\n/* line 21, src/styles/common/_typography.scss */\nh6 {\n  font-size: 1rem; }\n\n/* line 23, src/styles/common/_typography.scss */\np {\n  margin: 0; }\n\n/* line 2, src/styles/common/_utilities.scss */\n.u-textColorNormal {\n  color: #999999 !important;\n  fill: #999999 !important; }\n\n/* line 9, src/styles/common/_utilities.scss */\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important; }\n\n/* line 14, src/styles/common/_utilities.scss */\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, 0.6);\n  fill: rgba(0, 0, 0, 0.6); }\n\n/* line 19, src/styles/common/_utilities.scss */\n.u-accentColor--iconNormal {\n  color: #1C9963;\n  fill: #1C9963; }\n\n/* line 25, src/styles/common/_utilities.scss */\n.u-bgColor {\n  background-color: var(--primary-color); }\n\n/* line 30, src/styles/common/_utilities.scss */\n.u-relative {\n  position: relative; }\n\n/* line 31, src/styles/common/_utilities.scss */\n.u-absolute {\n  position: absolute; }\n\n/* line 33, src/styles/common/_utilities.scss */\n.u-fixed {\n  position: fixed !important; }\n\n/* line 35, src/styles/common/_utilities.scss */\n.u-block {\n  display: block !important; }\n\n/* line 36, src/styles/common/_utilities.scss */\n.u-inlineBlock {\n  display: inline-block; }\n\n/* line 39, src/styles/common/_utilities.scss */\n.u-backgroundDark {\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1; }\n\n/* line 50, src/styles/common/_utilities.scss */\n.u-bgGradient {\n  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 29%, rgba(0, 0, 0, 0.7) 81%); }\n\n/* line 52, src/styles/common/_utilities.scss */\n.u-bgBlack {\n  background-color: #000; }\n\n/* line 54, src/styles/common/_utilities.scss */\n.u-gradient {\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1; }\n\n/* line 65, src/styles/common/_utilities.scss */\n.zindex1 {\n  z-index: 1; }\n\n/* line 66, src/styles/common/_utilities.scss */\n.zindex2 {\n  z-index: 2; }\n\n/* line 67, src/styles/common/_utilities.scss */\n.zindex3 {\n  z-index: 3; }\n\n/* line 68, src/styles/common/_utilities.scss */\n.zindex4 {\n  z-index: 4; }\n\n/* line 71, src/styles/common/_utilities.scss */\n.u-backgroundWhite {\n  background-color: #fafafa; }\n\n/* line 72, src/styles/common/_utilities.scss */\n.u-backgroundColorGrayLight {\n  background-color: #f0f0f0 !important; }\n\n/* line 75, src/styles/common/_utilities.scss */\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n/* line 82, src/styles/common/_utilities.scss */\n.u-fontSizeMicro {\n  font-size: 11px; }\n\n/* line 83, src/styles/common/_utilities.scss */\n.u-fontSizeSmallest {\n  font-size: 12px; }\n\n/* line 84, src/styles/common/_utilities.scss */\n.u-fontSize13 {\n  font-size: 13px; }\n\n/* line 85, src/styles/common/_utilities.scss */\n.u-fontSizeSmaller {\n  font-size: 14px; }\n\n/* line 86, src/styles/common/_utilities.scss */\n.u-fontSize15 {\n  font-size: 15px; }\n\n/* line 87, src/styles/common/_utilities.scss */\n.u-fontSizeSmall {\n  font-size: 16px; }\n\n/* line 88, src/styles/common/_utilities.scss */\n.u-fontSizeBase {\n  font-size: 18px; }\n\n/* line 89, src/styles/common/_utilities.scss */\n.u-fontSize20 {\n  font-size: 20px; }\n\n/* line 90, src/styles/common/_utilities.scss */\n.u-fontSize21 {\n  font-size: 21px; }\n\n/* line 91, src/styles/common/_utilities.scss */\n.u-fontSize22 {\n  font-size: 22px; }\n\n/* line 92, src/styles/common/_utilities.scss */\n.u-fontSizeLarge {\n  font-size: 24px; }\n\n/* line 93, src/styles/common/_utilities.scss */\n.u-fontSize26 {\n  font-size: 26px; }\n\n/* line 94, src/styles/common/_utilities.scss */\n.u-fontSize28 {\n  font-size: 28px; }\n\n/* line 95, src/styles/common/_utilities.scss */\n.u-fontSizeLarger, .media-type {\n  font-size: 32px; }\n\n/* line 96, src/styles/common/_utilities.scss */\n.u-fontSize36 {\n  font-size: 36px; }\n\n/* line 97, src/styles/common/_utilities.scss */\n.u-fontSize40 {\n  font-size: 40px; }\n\n/* line 98, src/styles/common/_utilities.scss */\n.u-fontSizeLargest {\n  font-size: 44px; }\n\n/* line 99, src/styles/common/_utilities.scss */\n.u-fontSizeJumbo {\n  font-size: 50px; }\n\n@media only screen and (max-width: 766px) {\n  /* line 102, src/styles/common/_utilities.scss */\n  .u-md-fontSizeBase {\n    font-size: 18px; }\n  /* line 103, src/styles/common/_utilities.scss */\n  .u-md-fontSize22 {\n    font-size: 22px; }\n  /* line 104, src/styles/common/_utilities.scss */\n  .u-md-fontSizeLarger {\n    font-size: 32px; } }\n\n/* line 120, src/styles/common/_utilities.scss */\n.u-fontWeightThin {\n  font-weight: 300; }\n\n/* line 121, src/styles/common/_utilities.scss */\n.u-fontWeightNormal {\n  font-weight: 400; }\n\n/* line 122, src/styles/common/_utilities.scss */\n.u-fontWeightMedium {\n  font-weight: 500; }\n\n/* line 123, src/styles/common/_utilities.scss */\n.u-fontWeightSemibold {\n  font-weight: 600; }\n\n/* line 124, src/styles/common/_utilities.scss */\n.u-fontWeightBold {\n  font-weight: 700; }\n\n/* line 126, src/styles/common/_utilities.scss */\n.u-textUppercase {\n  text-transform: uppercase; }\n\n/* line 127, src/styles/common/_utilities.scss */\n.u-textCapitalize {\n  text-transform: capitalize; }\n\n/* line 128, src/styles/common/_utilities.scss */\n.u-textAlignCenter {\n  text-align: center; }\n\n/* line 130, src/styles/common/_utilities.scss */\n.u-textShadow {\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33); }\n\n/* line 132, src/styles/common/_utilities.scss */\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important; }\n\n/* line 139, src/styles/common/_utilities.scss */\n.u-marginAuto {\n  margin-left: auto;\n  margin-right: auto; }\n\n/* line 140, src/styles/common/_utilities.scss */\n.u-marginTop20 {\n  margin-top: 20px; }\n\n/* line 141, src/styles/common/_utilities.scss */\n.u-marginTop30 {\n  margin-top: 30px; }\n\n/* line 142, src/styles/common/_utilities.scss */\n.u-marginBottom10 {\n  margin-bottom: 10px; }\n\n/* line 143, src/styles/common/_utilities.scss */\n.u-marginBottom15 {\n  margin-bottom: 15px; }\n\n/* line 144, src/styles/common/_utilities.scss */\n.u-marginBottom20 {\n  margin-bottom: 20px !important; }\n\n/* line 145, src/styles/common/_utilities.scss */\n.u-marginBottom30 {\n  margin-bottom: 30px; }\n\n/* line 146, src/styles/common/_utilities.scss */\n.u-marginBottom40 {\n  margin-bottom: 40px; }\n\n/* line 149, src/styles/common/_utilities.scss */\n.u-padding0 {\n  padding: 0 !important; }\n\n/* line 150, src/styles/common/_utilities.scss */\n.u-padding20 {\n  padding: 20px; }\n\n/* line 151, src/styles/common/_utilities.scss */\n.u-padding15 {\n  padding: 15px !important; }\n\n/* line 152, src/styles/common/_utilities.scss */\n.u-paddingBottom2 {\n  padding-bottom: 2px; }\n\n/* line 153, src/styles/common/_utilities.scss */\n.u-paddingBottom30 {\n  padding-bottom: 30px; }\n\n/* line 154, src/styles/common/_utilities.scss */\n.u-paddingBottom20 {\n  padding-bottom: 20px; }\n\n/* line 155, src/styles/common/_utilities.scss */\n.u-paddingRight10 {\n  padding-right: 10px; }\n\n/* line 156, src/styles/common/_utilities.scss */\n.u-paddingLeft15 {\n  padding-left: 15px; }\n\n/* line 158, src/styles/common/_utilities.scss */\n.u-paddingTop2 {\n  padding-top: 2px; }\n\n/* line 159, src/styles/common/_utilities.scss */\n.u-paddingTop5 {\n  padding-top: 5px; }\n\n/* line 160, src/styles/common/_utilities.scss */\n.u-paddingTop10 {\n  padding-top: 10px; }\n\n/* line 161, src/styles/common/_utilities.scss */\n.u-paddingTop15 {\n  padding-top: 15px; }\n\n/* line 162, src/styles/common/_utilities.scss */\n.u-paddingTop20 {\n  padding-top: 20px; }\n\n/* line 163, src/styles/common/_utilities.scss */\n.u-paddingTop30 {\n  padding-top: 30px; }\n\n/* line 165, src/styles/common/_utilities.scss */\n.u-paddingBottom15 {\n  padding-bottom: 15px; }\n\n/* line 167, src/styles/common/_utilities.scss */\n.u-paddingRight20 {\n  padding-right: 20px; }\n\n/* line 168, src/styles/common/_utilities.scss */\n.u-paddingLeft20 {\n  padding-left: 20px; }\n\n/* line 170, src/styles/common/_utilities.scss */\n.u-contentTitle {\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-style: normal;\n  font-weight: 700;\n  letter-spacing: -.028em; }\n\n/* line 178, src/styles/common/_utilities.scss */\n.u-lineHeight1 {\n  line-height: 1; }\n\n/* line 179, src/styles/common/_utilities.scss */\n.u-lineHeightTight {\n  line-height: 1.2; }\n\n/* line 182, src/styles/common/_utilities.scss */\n.u-overflowHidden {\n  overflow: hidden; }\n\n/* line 185, src/styles/common/_utilities.scss */\n.u-floatRight {\n  float: right; }\n\n/* line 186, src/styles/common/_utilities.scss */\n.u-floatLeft {\n  float: left; }\n\n/* line 189, src/styles/common/_utilities.scss */\n.u-flex {\n  display: flex; }\n\n/* line 190, src/styles/common/_utilities.scss */\n.u-flexCenter, .media-type {\n  align-items: center;\n  display: flex; }\n\n/* line 191, src/styles/common/_utilities.scss */\n.u-flexContentCenter, .media-type {\n  justify-content: center; }\n\n/* line 193, src/styles/common/_utilities.scss */\n.u-flex1 {\n  flex: 1 1 auto; }\n\n/* line 194, src/styles/common/_utilities.scss */\n.u-flex0 {\n  flex: 0 0 auto; }\n\n/* line 195, src/styles/common/_utilities.scss */\n.u-flexWrap {\n  flex-wrap: wrap; }\n\n/* line 197, src/styles/common/_utilities.scss */\n.u-flexColumn {\n  display: flex;\n  flex-direction: column;\n  justify-content: center; }\n\n/* line 203, src/styles/common/_utilities.scss */\n.u-flexEnd {\n  align-items: center;\n  justify-content: flex-end; }\n\n/* line 208, src/styles/common/_utilities.scss */\n.u-flexColumnTop {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start; }\n\n/* line 215, src/styles/common/_utilities.scss */\n.u-bgCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover; }\n\n/* line 222, src/styles/common/_utilities.scss */\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 16px;\n  padding-right: 16px; }\n\n/* line 229, src/styles/common/_utilities.scss */\n.u-maxWidth1200 {\n  max-width: 1200px; }\n\n/* line 230, src/styles/common/_utilities.scss */\n.u-maxWidth1000 {\n  max-width: 1000px; }\n\n/* line 231, src/styles/common/_utilities.scss */\n.u-maxWidth740 {\n  max-width: 740px; }\n\n/* line 232, src/styles/common/_utilities.scss */\n.u-maxWidth1040 {\n  max-width: 1040px; }\n\n/* line 233, src/styles/common/_utilities.scss */\n.u-sizeFullWidth {\n  width: 100%; }\n\n/* line 234, src/styles/common/_utilities.scss */\n.u-sizeFullHeight {\n  height: 100%; }\n\n/* line 237, src/styles/common/_utilities.scss */\n.u-borderLighter {\n  border: 1px solid rgba(0, 0, 0, 0.15); }\n\n/* line 238, src/styles/common/_utilities.scss */\n.u-round, .avatar-image, .media-type {\n  border-radius: 50%; }\n\n/* line 239, src/styles/common/_utilities.scss */\n.u-borderRadius2 {\n  border-radius: 2px; }\n\n/* line 241, src/styles/common/_utilities.scss */\n.u-boxShadowBottom {\n  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05); }\n\n/* line 246, src/styles/common/_utilities.scss */\n.u-height540 {\n  height: 540px; }\n\n/* line 247, src/styles/common/_utilities.scss */\n.u-height280 {\n  height: 280px; }\n\n/* line 248, src/styles/common/_utilities.scss */\n.u-height260 {\n  height: 260px; }\n\n/* line 249, src/styles/common/_utilities.scss */\n.u-height100 {\n  height: 100px; }\n\n/* line 250, src/styles/common/_utilities.scss */\n.u-borderBlackLightest {\n  border: 1px solid rgba(0, 0, 0, 0.1); }\n\n/* line 253, src/styles/common/_utilities.scss */\n.u-hide {\n  display: none !important; }\n\n/* line 256, src/styles/common/_utilities.scss */\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.09);\n  border-radius: 3px;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px; }\n\n/* line 267, src/styles/common/_utilities.scss */\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%; }\n  /* line 272, src/styles/common/_utilities.scss */\n  .title-line::before {\n    content: '';\n    background: rgba(255, 255, 255, 0.3);\n    display: inline-block;\n    position: absolute;\n    left: 0;\n    bottom: 50%;\n    width: 100%;\n    height: 1px;\n    z-index: 0; }\n\n/* line 286, src/styles/common/_utilities.scss */\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 15px;\n  font-weight: 500;\n  letter-spacing: 0.03em;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  transform: skewX(-15deg); }\n\n/* line 299, src/styles/common/_utilities.scss */\n.no-avatar {\n  background-image: url(\"../images/avatar.png\") !important; }\n\n@media only screen and (max-width: 766px) {\n  /* line 304, src/styles/common/_utilities.scss */\n  .u-hide-before-md {\n    display: none !important; }\n  /* line 305, src/styles/common/_utilities.scss */\n  .u-md-heightAuto {\n    height: auto; }\n  /* line 306, src/styles/common/_utilities.scss */\n  .u-md-height170 {\n    height: 170px; }\n  /* line 307, src/styles/common/_utilities.scss */\n  .u-md-relative {\n    position: relative; } }\n\n@media only screen and (max-width: 1000px) {\n  /* line 310, src/styles/common/_utilities.scss */\n  .u-hide-before-lg {\n    display: none !important; } }\n\n@media only screen and (min-width: 766px) {\n  /* line 313, src/styles/common/_utilities.scss */\n  .u-hide-after-md {\n    display: none !important; } }\n\n@media only screen and (min-width: 1000px) {\n  /* line 315, src/styles/common/_utilities.scss */\n  .u-hide-after-lg {\n    display: none !important; } }\n\n/* line 1, src/styles/components/_form.scss */\n.button {\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  box-sizing: border-box;\n  color: rgba(0, 0, 0, 0.44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  /* line 45, src/styles/components/_form.scss */\n  .button--large {\n    font-size: 15px;\n    height: 44px;\n    line-height: 42px;\n    padding: 0 18px; }\n  /* line 52, src/styles/components/_form.scss */\n  .button--dark {\n    background: rgba(0, 0, 0, 0.84);\n    border-color: rgba(0, 0, 0, 0.84);\n    color: rgba(255, 255, 255, 0.97); }\n    /* line 57, src/styles/components/_form.scss */\n    .button--dark:hover {\n      background: #1C9963;\n      border-color: #1C9963; }\n\n/* line 65, src/styles/components/_form.scss */\n.button--primary {\n  border-color: #1C9963;\n  color: #1C9963; }\n\n/* line 111, src/styles/components/_form.scss */\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px; }\n\n/* line 124, src/styles/components/_form.scss */\n.tag-button {\n  background: rgba(0, 0, 0, 0.05);\n  border: none;\n  color: rgba(0, 0, 0, 0.68);\n  font-weight: 500;\n  margin: 0 8px 8px 0; }\n  /* line 131, src/styles/components/_form.scss */\n  .tag-button:hover {\n    background: rgba(0, 0, 0, 0.1);\n    color: rgba(0, 0, 0, 0.68); }\n\n/* line 139, src/styles/components/_form.scss */\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 500;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  width: 100%; }\n  /* line 150, src/styles/components/_form.scss */\n  .button--dark-line:hover {\n    color: #fff;\n    box-shadow: inset 0 -50px 8px -4px #000; }\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"../fonts/mapache.eot?25764j\");\n  src: url(\"../fonts/mapache.eot?25764j#iefix\") format(\"embedded-opentype\"), url(\"../fonts/mapache.ttf?25764j\") format(\"truetype\"), url(\"../fonts/mapache.woff?25764j\") format(\"woff\"), url(\"../fonts/mapache.svg?25764j#mapache\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n/* line 17, src/styles/components/_icons.scss */\n.i-tag:before {\n  content: \"\\e911\"; }\n\n/* line 20, src/styles/components/_icons.scss */\n.i-discord:before {\n  content: \"\\e90a\"; }\n\n/* line 23, src/styles/components/_icons.scss */\n.i-arrow-round-next:before {\n  content: \"\\e90c\"; }\n\n/* line 26, src/styles/components/_icons.scss */\n.i-arrow-round-prev:before {\n  content: \"\\e90d\"; }\n\n/* line 29, src/styles/components/_icons.scss */\n.i-arrow-round-up:before {\n  content: \"\\e90e\"; }\n\n/* line 32, src/styles/components/_icons.scss */\n.i-arrow-round-down:before {\n  content: \"\\e90f\"; }\n\n/* line 35, src/styles/components/_icons.scss */\n.i-photo:before {\n  content: \"\\e90b\"; }\n\n/* line 38, src/styles/components/_icons.scss */\n.i-send:before {\n  content: \"\\e909\"; }\n\n/* line 41, src/styles/components/_icons.scss */\n.i-audio:before {\n  content: \"\\e901\"; }\n\n/* line 44, src/styles/components/_icons.scss */\n.i-rocket:before {\n  content: \"\\e902\";\n  color: #999; }\n\n/* line 48, src/styles/components/_icons.scss */\n.i-comments-line:before {\n  content: \"\\e900\"; }\n\n/* line 51, src/styles/components/_icons.scss */\n.i-globe:before {\n  content: \"\\e906\"; }\n\n/* line 54, src/styles/components/_icons.scss */\n.i-star:before {\n  content: \"\\e907\"; }\n\n/* line 57, src/styles/components/_icons.scss */\n.i-link:before {\n  content: \"\\e908\"; }\n\n/* line 60, src/styles/components/_icons.scss */\n.i-star-line:before {\n  content: \"\\e903\"; }\n\n/* line 63, src/styles/components/_icons.scss */\n.i-more:before {\n  content: \"\\e904\"; }\n\n/* line 66, src/styles/components/_icons.scss */\n.i-search:before {\n  content: \"\\e905\"; }\n\n/* line 69, src/styles/components/_icons.scss */\n.i-chat:before {\n  content: \"\\e910\"; }\n\n/* line 72, src/styles/components/_icons.scss */\n.i-arrow-left:before {\n  content: \"\\e314\"; }\n\n/* line 75, src/styles/components/_icons.scss */\n.i-arrow-right:before {\n  content: \"\\e315\"; }\n\n/* line 78, src/styles/components/_icons.scss */\n.i-play:before {\n  content: \"\\e037\"; }\n\n/* line 81, src/styles/components/_icons.scss */\n.i-location:before {\n  content: \"\\e8b4\"; }\n\n/* line 84, src/styles/components/_icons.scss */\n.i-check-circle:before {\n  content: \"\\e86c\"; }\n\n/* line 87, src/styles/components/_icons.scss */\n.i-close:before {\n  content: \"\\e5cd\"; }\n\n/* line 90, src/styles/components/_icons.scss */\n.i-favorite:before {\n  content: \"\\e87d\"; }\n\n/* line 93, src/styles/components/_icons.scss */\n.i-warning:before {\n  content: \"\\e002\"; }\n\n/* line 96, src/styles/components/_icons.scss */\n.i-rss:before {\n  content: \"\\e0e5\"; }\n\n/* line 99, src/styles/components/_icons.scss */\n.i-share:before {\n  content: \"\\e80d\"; }\n\n/* line 102, src/styles/components/_icons.scss */\n.i-email:before {\n  content: \"\\f0e0\"; }\n\n/* line 105, src/styles/components/_icons.scss */\n.i-google:before {\n  content: \"\\f1a0\"; }\n\n/* line 108, src/styles/components/_icons.scss */\n.i-telegram:before {\n  content: \"\\f2c6\"; }\n\n/* line 111, src/styles/components/_icons.scss */\n.i-reddit:before {\n  content: \"\\f281\"; }\n\n/* line 114, src/styles/components/_icons.scss */\n.i-twitter:before {\n  content: \"\\f099\"; }\n\n/* line 117, src/styles/components/_icons.scss */\n.i-github:before {\n  content: \"\\f09b\"; }\n\n/* line 120, src/styles/components/_icons.scss */\n.i-linkedin:before {\n  content: \"\\f0e1\"; }\n\n/* line 123, src/styles/components/_icons.scss */\n.i-youtube:before {\n  content: \"\\f16a\"; }\n\n/* line 126, src/styles/components/_icons.scss */\n.i-stack-overflow:before {\n  content: \"\\f16c\"; }\n\n/* line 129, src/styles/components/_icons.scss */\n.i-instagram:before {\n  content: \"\\f16d\"; }\n\n/* line 132, src/styles/components/_icons.scss */\n.i-flickr:before {\n  content: \"\\f16e\"; }\n\n/* line 135, src/styles/components/_icons.scss */\n.i-dribbble:before {\n  content: \"\\f17d\"; }\n\n/* line 138, src/styles/components/_icons.scss */\n.i-behance:before {\n  content: \"\\f1b4\"; }\n\n/* line 141, src/styles/components/_icons.scss */\n.i-spotify:before {\n  content: \"\\f1bc\"; }\n\n/* line 144, src/styles/components/_icons.scss */\n.i-codepen:before {\n  content: \"\\f1cb\"; }\n\n/* line 147, src/styles/components/_icons.scss */\n.i-facebook:before {\n  content: \"\\f230\"; }\n\n/* line 150, src/styles/components/_icons.scss */\n.i-pinterest:before {\n  content: \"\\f231\"; }\n\n/* line 153, src/styles/components/_icons.scss */\n.i-whatsapp:before {\n  content: \"\\f232\"; }\n\n/* line 156, src/styles/components/_icons.scss */\n.i-snapchat:before {\n  content: \"\\f2ac\"; }\n\n/* line 2, src/styles/components/_animated.scss */\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both; }\n  /* line 6, src/styles/components/_animated.scss */\n  .animated.infinite {\n    animation-iteration-count: infinite; }\n\n/* line 12, src/styles/components/_animated.scss */\n.bounceIn {\n  animation-name: bounceIn; }\n\n/* line 13, src/styles/components/_animated.scss */\n.bounceInDown {\n  animation-name: bounceInDown; }\n\n/* line 14, src/styles/components/_animated.scss */\n.pulse {\n  animation-name: pulse; }\n\n/* line 15, src/styles/components/_animated.scss */\n.slideInUp {\n  animation-name: slideInUp; }\n\n/* line 16, src/styles/components/_animated.scss */\n.slideOutDown {\n  animation-name: slideOutDown; }\n\n@keyframes bounceIn {\n  0%,\n  20%,\n  40%,\n  60%,\n  80%,\n  100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3); }\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1); }\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9); }\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03); }\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97); }\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes bounceInDown {\n  0%,\n  60%,\n  75%,\n  90%,\n  100% {\n    animation-timing-function: cubic-bezier(215, 610, 355, 1); }\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0); }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0); }\n  75% {\n    transform: translate3d(0, -10px, 0); }\n  90% {\n    transform: translate3d(0, 5px, 0); }\n  100% {\n    transform: none; } }\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1); }\n  50% {\n    transform: scale3d(1.2, 1.2, 1.2); }\n  to {\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes scroll {\n  0% {\n    opacity: 0; }\n  10% {\n    opacity: 1;\n    transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(10px); } }\n\n@keyframes opacity {\n  0% {\n    opacity: 0; }\n  50% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg); } }\n\n@keyframes tooltip {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, 6px); }\n  100% {\n    opacity: 1;\n    transform: translate(-50%, 0); } }\n\n@keyframes loading-bar {\n  0% {\n    transform: translateX(-100%); }\n  40% {\n    transform: translateX(0); }\n  60% {\n    transform: translateX(0); }\n  100% {\n    transform: translateX(100%); } }\n\n@keyframes arrow-move-right {\n  0% {\n    opacity: 0; }\n  10% {\n    transform: translateX(-100%);\n    opacity: 0; }\n  100% {\n    transform: translateX(0);\n    opacity: 1; } }\n\n@keyframes arrow-move-left {\n  0% {\n    opacity: 0; }\n  10% {\n    transform: translateX(100%);\n    opacity: 0; }\n  100% {\n    transform: translateX(0);\n    opacity: 1; } }\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible; }\n  to {\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0); } }\n\n/* line 4, src/styles/layouts/_header.scss */\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15; }\n\n/* line 10, src/styles/layouts/_header.scss */\n.header {\n  box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: sticky;\n  top: 0;\n  transition: all .3s ease-in-out;\n  z-index: 10; }\n  /* line 18, src/styles/layouts/_header.scss */\n  .header-wrap {\n    height: 50px; }\n  /* line 20, src/styles/layouts/_header.scss */\n  .header-logo {\n    color: #fff !important;\n    height: 30px; }\n    /* line 24, src/styles/layouts/_header.scss */\n    .header-logo img {\n      max-height: 100%; }\n\n/* line 32, src/styles/layouts/_header.scss */\n.header-line {\n  height: 50px;\n  border-right: 1px solid rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  margin-right: 10px; }\n\n/* line 41, src/styles/layouts/_header.scss */\n.follow-more {\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0; }\n\n/* line 48, src/styles/layouts/_header.scss */\nbody.is-showFollowMore .follow-more {\n  width: auto; }\n\n/* line 49, src/styles/layouts/_header.scss */\nbody.is-showFollowMore .follow-toggle {\n  color: var(--header-color-hover); }\n\n/* line 50, src/styles/layouts/_header.scss */\nbody.is-showFollowMore .follow-toggle::before {\n  content: \"\\e5cd\"; }\n\n/* line 56, src/styles/layouts/_header.scss */\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden; }\n  /* line 62, src/styles/layouts/_header.scss */\n  .nav ul {\n    display: flex;\n    margin-right: 20px;\n    overflow: hidden;\n    white-space: nowrap; }\n\n/* line 70, src/styles/layouts/_header.scss */\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 400;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle; }\n  /* line 82, src/styles/layouts/_header.scss */\n  .header-left a.active, .header-left a:hover,\n  .nav ul li a.active,\n  .nav ul li a:hover {\n    color: var(--header-color-hover); }\n\n/* line 89, src/styles/layouts/_header.scss */\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px; }\n  /* line 95, src/styles/layouts/_header.scss */\n  .menu--toggle span {\n    background-color: var(--header-color);\n    display: block;\n    height: 2px;\n    left: 14px;\n    margin-top: -1px;\n    position: absolute;\n    top: 50%;\n    transition: .4s;\n    width: 20px; }\n    /* line 106, src/styles/layouts/_header.scss */\n    .menu--toggle span:first-child {\n      transform: translate(0, -6px); }\n    /* line 107, src/styles/layouts/_header.scss */\n    .menu--toggle span:last-child {\n      transform: translate(0, 6px); }\n\n@media only screen and (max-width: 1000px) {\n  /* line 115, src/styles/layouts/_header.scss */\n  .header-left {\n    flex-grow: 1 !important; }\n  /* line 116, src/styles/layouts/_header.scss */\n  .header-logo span {\n    font-size: 24px; }\n  /* line 119, src/styles/layouts/_header.scss */\n  body.is-showNavMob {\n    overflow: hidden; }\n    /* line 122, src/styles/layouts/_header.scss */\n    body.is-showNavMob .sideNav {\n      transform: translateX(0); }\n    /* line 124, src/styles/layouts/_header.scss */\n    body.is-showNavMob .menu--toggle {\n      border: 0;\n      transform: rotate(90deg); }\n      /* line 128, src/styles/layouts/_header.scss */\n      body.is-showNavMob .menu--toggle span:first-child {\n        transform: rotate(45deg) translate(0, 0); }\n      /* line 129, src/styles/layouts/_header.scss */\n      body.is-showNavMob .menu--toggle span:nth-child(2) {\n        transform: scaleX(0); }\n      /* line 130, src/styles/layouts/_header.scss */\n      body.is-showNavMob .menu--toggle span:last-child {\n        transform: rotate(-45deg) translate(0, 0); }\n    /* line 133, src/styles/layouts/_header.scss */\n    body.is-showNavMob .main, body.is-showNavMob .footer {\n      transform: translateX(-25%) !important; } }\n\n/* line 4, src/styles/layouts/_footer.scss */\n.footer {\n  color: #888; }\n  /* line 7, src/styles/layouts/_footer.scss */\n  .footer a {\n    color: var(--footer-color-link); }\n    /* line 9, src/styles/layouts/_footer.scss */\n    .footer a:hover {\n      color: #fff; }\n  /* line 12, src/styles/layouts/_footer.scss */\n  .footer-links {\n    padding: 3em 0 2.5em;\n    background-color: #131313; }\n  /* line 17, src/styles/layouts/_footer.scss */\n  .footer .follow > a {\n    background: #333;\n    border-radius: 50%;\n    color: inherit;\n    display: inline-block;\n    height: 40px;\n    line-height: 40px;\n    margin: 0 5px 8px;\n    text-align: center;\n    width: 40px; }\n    /* line 28, src/styles/layouts/_footer.scss */\n    .footer .follow > a:hover {\n      background: transparent;\n      box-shadow: inset 0 0 0 2px #333; }\n  /* line 34, src/styles/layouts/_footer.scss */\n  .footer-copy {\n    padding: 3em 0;\n    background-color: #000; }\n\n/* line 41, src/styles/layouts/_footer.scss */\n.footer-menu li {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 8px;\n  /* stylelint-disable-next-line */ }\n  /* line 47, src/styles/layouts/_footer.scss */\n  .footer-menu li a {\n    color: #888; }\n\n/* line 3, src/styles/layouts/_homepage.scss */\n.hmCover {\n  padding: 4px; }\n  /* line 6, src/styles/layouts/_homepage.scss */\n  .hmCover .st-cover {\n    padding: 4px; }\n    /* line 9, src/styles/layouts/_homepage.scss */\n    .hmCover .st-cover.firts {\n      height: 500px; }\n      /* line 11, src/styles/layouts/_homepage.scss */\n      .hmCover .st-cover.firts .st-cover-title {\n        font-size: 2rem; }\n\n/* line 18, src/styles/layouts/_homepage.scss */\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh; }\n  /* line 22, src/styles/layouts/_homepage.scss */\n  .hm-cover-title {\n    font-size: 2.5rem;\n    font-weight: 900;\n    line-height: 1; }\n  /* line 28, src/styles/layouts/_homepage.scss */\n  .hm-cover-des {\n    max-width: 600px;\n    font-size: 1.25rem; }\n\n/* line 34, src/styles/layouts/_homepage.scss */\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all .3s;\n  width: 100%; }\n  /* line 49, src/styles/layouts/_homepage.scss */\n  .hm-subscribe:hover {\n    box-shadow: inset 0 0 0 2px #fff; }\n\n/* line 54, src/styles/layouts/_homepage.scss */\n.hm-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100; }\n  /* line 65, src/styles/layouts/_homepage.scss */\n  .hm-down svg {\n    display: block;\n    fill: currentcolor;\n    height: auto;\n    width: 100%; }\n\n@media only screen and (min-width: 1000px) {\n  /* line 77, src/styles/layouts/_homepage.scss */\n  .hmCover {\n    height: 70vh; }\n    /* line 80, src/styles/layouts/_homepage.scss */\n    .hmCover .st-cover {\n      height: 50%;\n      width: 33.33333%; }\n      /* line 84, src/styles/layouts/_homepage.scss */\n      .hmCover .st-cover.firts {\n        height: 100%;\n        width: 66.66666%; }\n        /* line 87, src/styles/layouts/_homepage.scss */\n        .hmCover .st-cover.firts .st-cover-title {\n          font-size: 2.8rem; }\n  /* line 93, src/styles/layouts/_homepage.scss */\n  .hm-cover-title {\n    font-size: 3.5rem; } }\n\n/* line 6, src/styles/layouts/_post.scss */\n.post-title {\n  color: #000;\n  line-height: 1.2;\n  max-width: 1000px; }\n\n/* line 12, src/styles/layouts/_post.scss */\n.post-excerpt {\n  color: #555;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  letter-spacing: -.012em;\n  line-height: 1.6; }\n\n/* line 21, src/styles/layouts/_post.scss */\n.post-author-social {\n  vertical-align: middle;\n  margin-left: 2px;\n  padding: 0 3px; }\n\n/* line 27, src/styles/layouts/_post.scss */\n.post-image {\n  margin-top: 30px; }\n\n/* line 34, src/styles/layouts/_post.scss */\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle; }\n  /* line 40, src/styles/layouts/_post.scss */\n  .avatar-image--smaller {\n    width: 50px;\n    height: 50px; }\n\n/* line 48, src/styles/layouts/_post.scss */\n.post-inner {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif; }\n  /* line 54, src/styles/layouts/_post.scss */\n  .post-inner a {\n    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.68) 50%, transparent 50%);\n    background-position: 0 1.12em;\n    background-repeat: repeat-x;\n    background-size: 2px .2em;\n    text-decoration: none;\n    word-break: break-word; }\n    /* line 62, src/styles/layouts/_post.scss */\n    .post-inner a:hover {\n      background-image: linear-gradient(to bottom, black 50%, transparent 50%); }\n  /* line 65, src/styles/layouts/_post.scss */\n  .post-inner img {\n    display: block;\n    margin-left: auto;\n    margin-right: auto; }\n  /* line 71, src/styles/layouts/_post.scss */\n  .post-inner h1, .post-inner h2, .post-inner h3, .post-inner h4, .post-inner h5, .post-inner h6 {\n    margin-top: 30px;\n    font-style: normal;\n    color: #000;\n    letter-spacing: -.02em;\n    line-height: 1.2; }\n  /* line 79, src/styles/layouts/_post.scss */\n  .post-inner h2 {\n    margin-top: 35px; }\n  /* line 81, src/styles/layouts/_post.scss */\n  .post-inner p {\n    font-size: 1.125rem;\n    font-weight: 400;\n    letter-spacing: -.003em;\n    line-height: 1.7;\n    margin-top: 25px; }\n  /* line 89, src/styles/layouts/_post.scss */\n  .post-inner ul,\n  .post-inner ol {\n    counter-reset: post;\n    font-size: 1.125rem;\n    margin-top: 20px; }\n    /* line 95, src/styles/layouts/_post.scss */\n    .post-inner ul li,\n    .post-inner ol li {\n      letter-spacing: -.003em;\n      margin-bottom: 14px;\n      margin-left: 30px; }\n      /* line 100, src/styles/layouts/_post.scss */\n      .post-inner ul li::before,\n      .post-inner ol li::before {\n        box-sizing: border-box;\n        display: inline-block;\n        margin-left: -78px;\n        position: absolute;\n        text-align: right;\n        width: 78px; }\n  /* line 111, src/styles/layouts/_post.scss */\n  .post-inner ul li::before {\n    content: '\\2022';\n    font-size: 16.8px;\n    padding-right: 15px;\n    padding-top: 3px; }\n  /* line 118, src/styles/layouts/_post.scss */\n  .post-inner ol li::before {\n    content: counter(post) \".\";\n    counter-increment: post;\n    padding-right: 12px; }\n  /* line 124, src/styles/layouts/_post.scss */\n  .post-inner h1, .post-inner h2, .post-inner h3, .post-inner h4, .post-inner h5, .post-inner h6, .post-inner p,\n  .post-inner ol, .post-inner ul, .post-inner hr, .post-inner pre, .post-inner dl, .post-inner blockquote, .post-inner table, .post-inner .kg-embed-card {\n    min-width: 100%; }\n  /* line 129, src/styles/layouts/_post.scss */\n  .post-inner > ul,\n  .post-inner > iframe,\n  .post-inner > img,\n  .post-inner .kg-image-card,\n  .post-inner .kg-card,\n  .post-inner .kg-gallery-card,\n  .post-inner .kg-embed-card {\n    margin-top: 30px !important; }\n\n/* line 142, src/styles/layouts/_post.scss */\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  transition: all .4s;\n  top: 30px;\n  /* stylelint-disable-next-line */ }\n  /* line 150, src/styles/layouts/_post.scss */\n  .sharePost a {\n    color: #fff;\n    margin: 8px 0 0;\n    display: block; }\n  /* line 156, src/styles/layouts/_post.scss */\n  .sharePost .i-chat {\n    background-color: #fff;\n    border: 2px solid #bbb;\n    color: #bbb; }\n  /* line 162, src/styles/layouts/_post.scss */\n  .sharePost .share-inner {\n    transition: visibility 0s linear 0s, opacity .3s 0s; }\n    /* line 165, src/styles/layouts/_post.scss */\n    .sharePost .share-inner.is-hidden {\n      visibility: hidden;\n      opacity: 0;\n      transition: visibility 0s linear .3s, opacity .3s 0s; }\n\n/* stylelint-disable-next-line */\n/* line 176, src/styles/layouts/_post.scss */\n.mob-share .mapache-share {\n  height: 40px;\n  color: #fff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  box-shadow: none !important; }\n\n/* line 185, src/styles/layouts/_post.scss */\n.mob-share .share-title {\n  font-size: 14px;\n  margin-left: 10px; }\n\n/* stylelint-disable-next-line */\n/* line 195, src/styles/layouts/_post.scss */\n.prev-next-span {\n  color: var(--composite-color);\n  font-weight: 700;\n  font-size: 13px; }\n  /* line 200, src/styles/layouts/_post.scss */\n  .prev-next-span i {\n    display: inline-flex;\n    transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1); }\n\n/* line 206, src/styles/layouts/_post.scss */\n.prev-next-title {\n  margin: 0 !important;\n  font-size: 16px;\n  height: 2em;\n  overflow: hidden;\n  line-height: 1 !important;\n  text-overflow: ellipsis !important;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  display: -webkit-box !important; }\n\n/* line 219, src/styles/layouts/_post.scss */\n.prev-next-link:hover .arrow-right {\n  animation: arrow-move-right 0.5s ease-in-out forwards; }\n\n/* line 220, src/styles/layouts/_post.scss */\n.prev-next-link:hover .arrow-left {\n  animation: arrow-move-left 0.5s ease-in-out forwards; }\n\n/* line 226, src/styles/layouts/_post.scss */\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000; }\n  /* line 231, src/styles/layouts/_post.scss */\n  .cc-image-header {\n    right: 0;\n    bottom: 10%;\n    left: 0; }\n  /* line 237, src/styles/layouts/_post.scss */\n  .cc-image-figure img {\n    object-fit: cover;\n    width: 100%; }\n  /* line 243, src/styles/layouts/_post.scss */\n  .cc-image .post-header {\n    max-width: 800px; }\n  /* line 245, src/styles/layouts/_post.scss */\n  .cc-image .post-title, .cc-image .post-excerpt {\n    color: #fff;\n    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8); }\n\n/* line 254, src/styles/layouts/_post.scss */\n.cc-video {\n  background-color: #121212;\n  padding: 80px 0 30px; }\n  /* line 258, src/styles/layouts/_post.scss */\n  .cc-video .post-excerpt {\n    color: #aaa;\n    font-size: 1rem; }\n  /* line 259, src/styles/layouts/_post.scss */\n  .cc-video .post-title {\n    color: #fff;\n    font-size: 1.8rem; }\n  /* line 260, src/styles/layouts/_post.scss */\n  .cc-video .kg-embed-card, .cc-video .video-responsive {\n    margin-top: 0; }\n  /* line 262, src/styles/layouts/_post.scss */\n  .cc-video-subscribe {\n    background-color: #121212;\n    color: #fff;\n    line-height: 1;\n    padding: 0 10px;\n    z-index: 1; }\n\n/* line 273, src/styles/layouts/_post.scss */\nbody.is-article .main {\n  margin-bottom: 0; }\n\n/* line 274, src/styles/layouts/_post.scss */\nbody.share-margin .sharePost {\n  top: -60px; }\n\n/* line 276, src/styles/layouts/_post.scss */\nbody.has-cover .post-primary-tag {\n  display: block !important; }\n\n/* line 279, src/styles/layouts/_post.scss */\nbody.is-article-single .post-body-wrap {\n  margin-left: 0 !important; }\n\n/* line 280, src/styles/layouts/_post.scss */\nbody.is-article-single .sharePost {\n  left: -100px; }\n\n/* line 281, src/styles/layouts/_post.scss */\nbody.is-article-single .kg-width-full .kg-image {\n  max-width: 100vw; }\n\n/* line 282, src/styles/layouts/_post.scss */\nbody.is-article-single .kg-width-wide .kg-image {\n  max-width: 1040px; }\n\n/* line 284, src/styles/layouts/_post.scss */\nbody.is-article-single .kg-gallery-container {\n  max-width: 1040px;\n  width: 100vw; }\n\n/* line 296, src/styles/layouts/_post.scss */\nbody.is-video .story-small h3 {\n  font-weight: 400; }\n\n@media only screen and (max-width: 766px) {\n  /* line 302, src/styles/layouts/_post.scss */\n  .post-inner q {\n    font-size: 20px !important;\n    letter-spacing: -.008em !important;\n    line-height: 1.4 !important; }\n  /* line 308, src/styles/layouts/_post.scss */\n  .post-inner ol, .post-inner ul, .post-inner p {\n    font-size: 1rem;\n    letter-spacing: -.004em;\n    line-height: 1.58; }\n  /* line 314, src/styles/layouts/_post.scss */\n  .post-inner iframe {\n    width: 100% !important; }\n  /* line 318, src/styles/layouts/_post.scss */\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%; }\n  /* line 324, src/styles/layouts/_post.scss */\n  .cc-image-header {\n    bottom: 24px; }\n  /* line 325, src/styles/layouts/_post.scss */\n  .cc-image .post-excerpt {\n    font-size: 18px; }\n  /* line 328, src/styles/layouts/_post.scss */\n  .cc-video {\n    padding: 20px 0; }\n    /* line 331, src/styles/layouts/_post.scss */\n    .cc-video-embed {\n      margin-left: -16px;\n      margin-right: -15px; }\n    /* line 336, src/styles/layouts/_post.scss */\n    .cc-video .post-header {\n      margin-top: 10px; }\n  /* line 340, src/styles/layouts/_post.scss */\n  .kg-width-wide .kg-image {\n    width: 100% !important; } }\n\n@media only screen and (max-width: 1000px) {\n  /* line 345, src/styles/layouts/_post.scss */\n  body.is-article .col-left {\n    max-width: 100%; } }\n\n@media only screen and (min-width: 766px) {\n  /* line 352, src/styles/layouts/_post.scss */\n  .cc-image .post-title {\n    font-size: 3.2rem; }\n  /* line 353, src/styles/layouts/_post.scss */\n  .prev-next-link {\n    margin: 0 !important; }\n  /* line 354, src/styles/layouts/_post.scss */\n  .prev-next-right {\n    text-align: right; } }\n\n@media only screen and (min-width: 1000px) {\n  /* line 358, src/styles/layouts/_post.scss */\n  body.is-article .post-body-wrap {\n    margin-left: 70px; }\n  /* line 362, src/styles/layouts/_post.scss */\n  body.is-video .post-author,\n  body.is-image .post-author {\n    margin-left: 70px; } }\n\n@media only screen and (min-width: 1230px) {\n  /* line 369, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-video-embed {\n    bottom: 20px;\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    height: 203px;\n    padding-bottom: 0;\n    position: fixed;\n    right: 20px;\n    width: 360px;\n    z-index: 8; }\n  /* line 380, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-video-close {\n    background: #000;\n    border-radius: 50%;\n    color: #fff;\n    cursor: pointer;\n    display: block !important;\n    font-size: 14px;\n    height: 24px;\n    left: -10px;\n    line-height: 1;\n    padding-top: 5px;\n    position: absolute;\n    text-align: center;\n    top: -10px;\n    width: 24px;\n    z-index: 5; }\n  /* line 398, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-video-cont {\n    height: 465px; }\n  /* line 400, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-image-header {\n    bottom: 20%; } }\n\n/* line 3, src/styles/layouts/_story.scss */\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0; }\n\n/* line 10, src/styles/layouts/_story.scss */\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px; }\n\n/* line 15, src/styles/layouts/_story.scss */\n.media-type {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9; }\n\n/* line 33, src/styles/layouts/_story.scss */\n.image-hover {\n  transition: transform .7s;\n  transform: translateZ(0); }\n\n/* line 45, src/styles/layouts/_story.scss */\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 500;\n  margin-bottom: 10px; }\n  /* line 50, src/styles/layouts/_story.scss */\n  .flow-meta-cat {\n    color: rgba(0, 0, 0, 0.84); }\n  /* line 51, src/styles/layouts/_story.scss */\n  .flow-meta .point {\n    margin: 0 5px; }\n\n/* line 58, src/styles/layouts/_story.scss */\n.story-image {\n  flex: 0 0 44%;\n  height: 235px;\n  margin-right: 30px; }\n  /* line 63, src/styles/layouts/_story.scss */\n  .story-image:hover .image-hover {\n    transform: scale(1.03); }\n\n/* line 66, src/styles/layouts/_story.scss */\n.story-lower {\n  flex-grow: 1; }\n\n/* line 68, src/styles/layouts/_story.scss */\n.story-excerpt {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  line-height: 1.5; }\n\n/* line 75, src/styles/layouts/_story.scss */\n.story h2 a:hover {\n  opacity: .6; }\n\n/* line 89, src/styles/layouts/_story.scss */\n.story--grid .story {\n  flex-direction: column;\n  margin-bottom: 30px; }\n  /* line 93, src/styles/layouts/_story.scss */\n  .story--grid .story-image {\n    flex: 0 0 auto;\n    margin-right: 0;\n    height: 220px; }\n\n/* line 100, src/styles/layouts/_story.scss */\n.story--grid .media-type {\n  font-size: 24px;\n  height: 40px;\n  width: 40px; }\n\n/* line 110, src/styles/layouts/_story.scss */\n.st-cover {\n  overflow: hidden;\n  height: 300px;\n  width: 100%; }\n  /* line 115, src/styles/layouts/_story.scss */\n  .st-cover-inner {\n    height: 100%; }\n  /* line 116, src/styles/layouts/_story.scss */\n  .st-cover-img {\n    transition: all .25s; }\n  /* line 117, src/styles/layouts/_story.scss */\n  .st-cover .flow-meta-cat {\n    color: var(--story-cover-category-color); }\n  /* line 118, src/styles/layouts/_story.scss */\n  .st-cover .flow-meta {\n    color: #fff; }\n  /* line 120, src/styles/layouts/_story.scss */\n  .st-cover-header {\n    bottom: 0;\n    left: 0;\n    right: 0;\n    padding: 50px 3.846153846% 20px;\n    background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%); }\n  /* line 128, src/styles/layouts/_story.scss */\n  .st-cover:hover .st-cover-img {\n    opacity: .8; }\n\n/* line 134, src/styles/layouts/_story.scss */\n.story--card {\n  /* stylelint-disable-next-line */ }\n  /* line 135, src/styles/layouts/_story.scss */\n  .story--card .story {\n    margin-top: 0 !important; }\n  /* line 140, src/styles/layouts/_story.scss */\n  .story--card .story-image {\n    border: 1px solid rgba(0, 0, 0, 0.04);\n    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n    border-radius: 2px;\n    background-color: #fff !important;\n    transition: all 150ms ease-in-out;\n    overflow: hidden;\n    height: 200px !important; }\n    /* line 149, src/styles/layouts/_story.scss */\n    .story--card .story-image .story-img-bg {\n      margin: 10px; }\n    /* line 151, src/styles/layouts/_story.scss */\n    .story--card .story-image:hover {\n      box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1); }\n      /* line 154, src/styles/layouts/_story.scss */\n      .story--card .story-image:hover .story-img-bg {\n        transform: none; }\n  /* line 158, src/styles/layouts/_story.scss */\n  .story--card .story-lower {\n    display: none !important; }\n  /* line 160, src/styles/layouts/_story.scss */\n  .story--card .story-body {\n    padding: 15px 5px;\n    margin: 0 !important; }\n    /* line 164, src/styles/layouts/_story.scss */\n    .story--card .story-body h2 {\n      -webkit-box-orient: vertical !important;\n      -webkit-line-clamp: 2 !important;\n      color: rgba(0, 0, 0, 0.9);\n      display: -webkit-box !important;\n      max-height: 2.4em !important;\n      overflow: hidden;\n      text-overflow: ellipsis !important;\n      margin: 0; }\n\n/* line 181, src/styles/layouts/_story.scss */\n.story-small {\n  /* stylelint-disable-next-line */ }\n  /* line 182, src/styles/layouts/_story.scss */\n  .story-small h3 {\n    color: #fff;\n    max-height: 2.5em;\n    overflow: hidden;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    text-overflow: ellipsis;\n    display: -webkit-box; }\n  /* line 192, src/styles/layouts/_story.scss */\n  .story-small-img {\n    height: 170px; }\n  /* line 197, src/styles/layouts/_story.scss */\n  .story-small .media-type {\n    height: 34px;\n    width: 34px; }\n\n/* line 206, src/styles/layouts/_story.scss */\n.story--hover {\n  /* stylelint-disable-next-line */ }\n  /* line 208, src/styles/layouts/_story.scss */\n  .story--hover .lazy-load-image, .story--hover h2, .story--hover h3 {\n    transition: all .25s; }\n  /* line 211, src/styles/layouts/_story.scss */\n  .story--hover:hover .lazy-load-image {\n    opacity: .8; }\n  /* line 212, src/styles/layouts/_story.scss */\n  .story--hover:hover h3, .story--hover:hover h2 {\n    opacity: .6; }\n\n@media only screen and (min-width: 766px) {\n  /* line 222, src/styles/layouts/_story.scss */\n  .story--grid .story-lower {\n    max-height: 3em;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    display: -webkit-box;\n    line-height: 1.1;\n    text-overflow: ellipsis; } }\n\n@media only screen and (max-width: 766px) {\n  /* line 237, src/styles/layouts/_story.scss */\n  .cover--firts .story-cover {\n    height: 500px; }\n  /* line 240, src/styles/layouts/_story.scss */\n  .story {\n    flex-direction: column;\n    margin-top: 20px; }\n    /* line 244, src/styles/layouts/_story.scss */\n    .story-image {\n      flex: 0 0 auto;\n      margin-right: 0; }\n    /* line 245, src/styles/layouts/_story.scss */\n    .story-body {\n      margin-top: 10px; } }\n\n/* line 4, src/styles/layouts/_author.scss */\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, 0.6);\n  min-height: 350px; }\n  /* line 9, src/styles/layouts/_author.scss */\n  .author-avatar {\n    height: 80px;\n    width: 80px; }\n  /* line 14, src/styles/layouts/_author.scss */\n  .author-meta span {\n    display: inline-block;\n    font-size: 17px;\n    font-style: italic;\n    margin: 0 25px 16px 0;\n    opacity: .8;\n    word-wrap: break-word; }\n  /* line 23, src/styles/layouts/_author.scss */\n  .author-bio {\n    max-width: 700px;\n    font-size: 1.2rem;\n    font-weight: 300;\n    line-height: 1.4; }\n  /* line 30, src/styles/layouts/_author.scss */\n  .author-name {\n    color: rgba(0, 0, 0, 0.8); }\n  /* line 31, src/styles/layouts/_author.scss */\n  .author-meta a:hover {\n    opacity: .8 !important; }\n\n/* line 34, src/styles/layouts/_author.scss */\n.cover-opacity {\n  opacity: .5; }\n\n/* line 36, src/styles/layouts/_author.scss */\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33); }\n  /* line 40, src/styles/layouts/_author.scss */\n  .author.has--image a,\n  .author.has--image .author-name {\n    color: #fff; }\n  /* line 43, src/styles/layouts/_author.scss */\n  .author.has--image .author-follow a {\n    border: 2px solid;\n    border-color: rgba(255, 255, 255, 0.5) !important;\n    font-size: 16px; }\n  /* line 49, src/styles/layouts/_author.scss */\n  .author.has--image .u-accentColor--iconNormal {\n    fill: #fff; }\n\n@media only screen and (max-width: 766px) {\n  /* line 53, src/styles/layouts/_author.scss */\n  .author-meta span {\n    display: block; }\n  /* line 54, src/styles/layouts/_author.scss */\n  .author-header {\n    display: block; }\n  /* line 55, src/styles/layouts/_author.scss */\n  .author-avatar {\n    margin: 0 auto 20px; } }\n\n@media only screen and (min-width: 766px) {\n  /* line 59, src/styles/layouts/_author.scss */\n  body.has-cover .author {\n    min-height: 600px; } }\n\n/* line 4, src/styles/layouts/_search.scss */\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  transform: translateY(-100%);\n  transition: transform .3s ease;\n  z-index: 9; }\n  /* line 16, src/styles/layouts/_search.scss */\n  .search-form {\n    max-width: 680px;\n    margin-top: 80px; }\n    /* line 20, src/styles/layouts/_search.scss */\n    .search-form::before {\n      background: #eee;\n      bottom: 0;\n      content: '';\n      display: block;\n      height: 2px;\n      left: 0;\n      position: absolute;\n      width: 100%;\n      z-index: 1; }\n    /* line 32, src/styles/layouts/_search.scss */\n    .search-form input {\n      border: none;\n      display: block;\n      line-height: 40px;\n      padding-bottom: 8px; }\n      /* line 38, src/styles/layouts/_search.scss */\n      .search-form input:focus {\n        outline: 0; }\n  /* line 43, src/styles/layouts/_search.scss */\n  .search-results {\n    max-height: calc(100% - 100px);\n    max-width: 680px;\n    overflow: auto; }\n    /* line 48, src/styles/layouts/_search.scss */\n    .search-results a {\n      padding: 10px 20px;\n      background: rgba(0, 0, 0, 0.05);\n      color: rgba(0, 0, 0, 0.7);\n      text-decoration: none;\n      display: block;\n      border-bottom: 1px solid #fff;\n      transition: all 0.3s ease-in-out; }\n      /* line 57, src/styles/layouts/_search.scss */\n      .search-results a:hover {\n        background: rgba(0, 0, 0, 0.1); }\n\n/* line 62, src/styles/layouts/_search.scss */\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px; }\n\n/* line 68, src/styles/layouts/_search.scss */\nbody.is-search {\n  overflow: hidden; }\n  /* line 71, src/styles/layouts/_search.scss */\n  body.is-search .search {\n    transform: translateY(0); }\n  /* line 72, src/styles/layouts/_search.scss */\n  body.is-search .search-toggle {\n    background-color: rgba(255, 255, 255, 0.25); }\n\n/* line 2, src/styles/layouts/_sidebar.scss */\n.sidebar-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785); }\n  /* line 5, src/styles/layouts/_sidebar.scss */\n  .sidebar-title span {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n    padding-bottom: 10px;\n    margin-bottom: -1px; }\n\n/* line 14, src/styles/layouts/_sidebar.scss */\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, 0.2);\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888; }\n\n/* line 23, src/styles/layouts/_sidebar.scss */\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n  min-height: 60px; }\n  /* line 29, src/styles/layouts/_sidebar.scss */\n  .sidebar-post h3 {\n    padding: 10px; }\n  /* line 31, src/styles/layouts/_sidebar.scss */\n  .sidebar-post:hover .sidebar-border {\n    background-color: #e5eff5; }\n  /* line 33, src/styles/layouts/_sidebar.scss */\n  .sidebar-post:nth-child(3n) .sidebar-border {\n    border-color: #f59e00; }\n  /* line 34, src/styles/layouts/_sidebar.scss */\n  .sidebar-post:nth-child(3n+2) .sidebar-border {\n    border-color: #26a8ed; }\n\n/* line 2, src/styles/layouts/_sidenav.scss */\n.sideNav {\n  color: rgba(0, 0, 0, 0.8);\n  height: 100vh;\n  padding: 50px 20px;\n  position: fixed !important;\n  transform: translateX(100%);\n  transition: 0.4s;\n  will-change: transform;\n  z-index: 8; }\n  /* line 13, src/styles/layouts/_sidenav.scss */\n  .sideNav-menu a {\n    padding: 10px 20px; }\n  /* line 15, src/styles/layouts/_sidenav.scss */\n  .sideNav-wrap {\n    background: #eee;\n    overflow: auto;\n    padding: 20px 0;\n    top: 50px; }\n  /* line 22, src/styles/layouts/_sidenav.scss */\n  .sideNav-section {\n    border-bottom: solid 1px #ddd;\n    margin-bottom: 8px;\n    padding-bottom: 8px; }\n  /* line 28, src/styles/layouts/_sidenav.scss */\n  .sideNav-follow {\n    border-top: 1px solid #ddd;\n    margin: 15px 0; }\n    /* line 32, src/styles/layouts/_sidenav.scss */\n    .sideNav-follow a {\n      color: #fff;\n      display: inline-block;\n      height: 36px;\n      line-height: 20px;\n      margin: 0 5px 5px 0;\n      min-width: 36px;\n      padding: 8px;\n      text-align: center;\n      vertical-align: middle; }\n\n/* line 17, src/styles/layouts/helper.scss */\n.has-cover-padding {\n  padding-top: 100px; }\n\n/* line 20, src/styles/layouts/helper.scss */\nbody.has-cover .header {\n  position: fixed; }\n\n/* line 23, src/styles/layouts/helper.scss */\nbody.has-cover.is-transparency:not(.is-search) .header {\n  background: transparent;\n  box-shadow: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1); }\n\n/* line 29, src/styles/layouts/helper.scss */\nbody.has-cover.is-transparency:not(.is-search) .header-left a, body.has-cover.is-transparency:not(.is-search) .nav ul li a {\n  color: #fff; }\n\n/* line 30, src/styles/layouts/helper.scss */\nbody.has-cover.is-transparency:not(.is-search) .menu--toggle span {\n  background-color: #fff; }\n\n/* line 5, src/styles/layouts/subscribe.scss */\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%; }\n  /* line 10, src/styles/layouts/subscribe.scss */\n  .subscribe-card {\n    background-color: #D7EFEE;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n    border-radius: 4px;\n    width: 900px;\n    height: 550px;\n    padding: 50px;\n    margin: 5px; }\n  /* line 20, src/styles/layouts/subscribe.scss */\n  .subscribe form {\n    max-width: 300px; }\n  /* line 24, src/styles/layouts/subscribe.scss */\n  .subscribe-form {\n    height: 100%; }\n  /* line 28, src/styles/layouts/subscribe.scss */\n  .subscribe-input {\n    background: 0 0;\n    border: 0;\n    border-bottom: 1px solid #cc5454;\n    border-radius: 0;\n    padding: 7px 5px;\n    height: 45px;\n    outline: 0;\n    font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; }\n    /* line 38, src/styles/layouts/subscribe.scss */\n    .subscribe-input::placeholder {\n      color: #cc5454; }\n  /* line 43, src/styles/layouts/subscribe.scss */\n  .subscribe .main-error {\n    color: #cc5454;\n    font-size: 16px;\n    margin-top: 15px; }\n\n/* line 65, src/styles/layouts/subscribe.scss */\n.subscribe-success .subscribe-card {\n  background-color: #E8F3EC; }\n\n@media only screen and (max-width: 766px) {\n  /* line 71, src/styles/layouts/subscribe.scss */\n  .subscribe-card {\n    height: auto;\n    width: auto; } }\n\n/* line 4, src/styles/layouts/_comments.scss */\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  font-size: 14px;\n  transform: translateX(100%);\n  transition: .2s;\n  will-change: transform; }\n  /* line 21, src/styles/layouts/_comments.scss */\n  .post-comments-header {\n    padding: 20px;\n    border-bottom: 1px solid #ddd; }\n    /* line 25, src/styles/layouts/_comments.scss */\n    .post-comments-header .toggle-comments {\n      font-size: 24px;\n      line-height: 1;\n      position: absolute;\n      left: 0;\n      top: 0;\n      padding: 17px;\n      cursor: pointer; }\n  /* line 36, src/styles/layouts/_comments.scss */\n  .post-comments-overlay {\n    position: fixed !important;\n    background-color: rgba(0, 0, 0, 0.2);\n    display: none;\n    transition: background-color .4s linear;\n    z-index: 8;\n    cursor: pointer; }\n\n/* line 46, src/styles/layouts/_comments.scss */\nbody.has-comments {\n  overflow: hidden; }\n  /* line 49, src/styles/layouts/_comments.scss */\n  body.has-comments .post-comments-overlay {\n    display: block; }\n  /* line 50, src/styles/layouts/_comments.scss */\n  body.has-comments .post-comments {\n    transform: translateX(0); }\n\n@media only screen and (min-width: 766px) {\n  /* line 54, src/styles/layouts/_comments.scss */\n  .post-comments {\n    left: auto;\n    max-width: 700px;\n    min-width: 500px;\n    top: 50px;\n    z-index: 9; } }\n\n/* line 2, src/styles/layouts/_topic.scss */\n.topic-img {\n  transition: transform .7s;\n  transform: translateZ(0); }\n\n/* line 7, src/styles/layouts/_topic.scss */\n.topic-items {\n  height: 320px;\n  padding: 30px; }\n  /* line 12, src/styles/layouts/_topic.scss */\n  .topic-items:hover .topic-img {\n    transform: scale(1.03); }\n\n/* line 16, src/styles/layouts/_topic.scss */\n.topic-c {\n  background-color: var(--primary-color);\n  color: #fff; }\n\n/* line 1, src/styles/common/_modal.scss */\n.modal {\n  opacity: 0;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden; }\n  /* line 8, src/styles/common/_modal.scss */\n  .modal-shader {\n    background-color: rgba(255, 255, 255, 0.65); }\n  /* line 11, src/styles/common/_modal.scss */\n  .modal-close {\n    color: rgba(0, 0, 0, 0.54);\n    position: absolute;\n    top: 0;\n    right: 0;\n    line-height: 1;\n    padding: 15px; }\n  /* line 21, src/styles/common/_modal.scss */\n  .modal-inner {\n    background-color: #E8F3EC;\n    border-radius: 4px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n    max-width: 700px;\n    height: 100%;\n    max-height: 400px;\n    opacity: 0;\n    padding: 72px 5% 56px;\n    transform: scale(0.6);\n    transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n    width: 100%; }\n  /* line 36, src/styles/common/_modal.scss */\n  .modal .form-group {\n    width: 76%;\n    margin: 0 auto 30px; }\n  /* line 41, src/styles/common/_modal.scss */\n  .modal .form--input {\n    display: inline-block;\n    margin-bottom: 10px;\n    vertical-align: top;\n    height: 40px;\n    line-height: 40px;\n    background-color: transparent;\n    padding: 17px 6px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n    width: 100%; }\n\n/* line 71, src/styles/common/_modal.scss */\nbody.has-modal {\n  overflow: hidden; }\n  /* line 74, src/styles/common/_modal.scss */\n  body.has-modal .modal {\n    opacity: 1;\n    visibility: visible;\n    transition: opacity .3s ease; }\n    /* line 79, src/styles/common/_modal.scss */\n    body.has-modal .modal-inner {\n      opacity: 1;\n      transform: scale(1);\n      transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96); }\n\n/* line 4, src/styles/common/_widget.scss */\n.instagram-hover {\n  background-color: rgba(0, 0, 0, 0.3);\n  opacity: 0; }\n\n/* line 10, src/styles/common/_widget.scss */\n.instagram-img {\n  height: 264px; }\n  /* line 13, src/styles/common/_widget.scss */\n  .instagram-img:hover > .instagram-hover {\n    opacity: 1; }\n\n/* line 16, src/styles/common/_widget.scss */\n.instagram-name {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 3; }\n  /* line 22, src/styles/common/_widget.scss */\n  .instagram-name a {\n    background-color: #fff;\n    color: #000 !important;\n    font-size: 18px !important;\n    font-weight: 900 !important;\n    min-width: 200px;\n    padding-left: 10px !important;\n    padding-right: 10px !important;\n    text-align: center !important; }\n\n/* line 34, src/styles/common/_widget.scss */\n.instagram-col {\n  padding: 0 !important;\n  margin: 0 !important; }\n\n/* line 39, src/styles/common/_widget.scss */\n.instagram-wrap {\n  margin: 0 !important; }\n\n/* line 44, src/styles/common/_widget.scss */\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative; }\n  /* line 50, src/styles/common/_widget.scss */\n  .witget-subscribe::before {\n    content: \"\";\n    border: 5px solid #f5f5f5;\n    box-shadow: inset 0 0 0 1px #d7d7d7;\n    box-sizing: border-box;\n    display: block;\n    height: calc(100% + 10px);\n    left: -5px;\n    pointer-events: none;\n    position: absolute;\n    top: -5px;\n    width: calc(100% + 10px);\n    z-index: 1; }\n  /* line 65, src/styles/common/_widget.scss */\n  .witget-subscribe input {\n    background: #fff;\n    border: 1px solid #e5e5e5;\n    color: rgba(0, 0, 0, 0.54);\n    height: 41px;\n    outline: 0;\n    padding: 0 16px;\n    width: 100%; }\n  /* line 75, src/styles/common/_widget.scss */\n  .witget-subscribe button {\n    background: var(--composite-color);\n    border-radius: 0;\n    width: 100%; }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMvbWFpbi5zY3NzIiwibm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcyIsIm5vZGVfbW9kdWxlcy9wcmlzbWpzL3RoZW1lcy9wcmlzbS5jc3MiLCJub2RlX21vZHVsZXMvcHJpc21qcy9wbHVnaW5zL2xpbmUtbnVtYmVycy9wcmlzbS1saW5lLW51bWJlcnMuY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX3ZhcmlhYmxlcy5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX21peGlucy5zY3NzIiwic3JjL3N0eWxlcy9hdXRvbG9hZC9fem9vbS5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX2dsb2JhbC5zY3NzIiwic3JjL3N0eWxlcy9jb21wb25lbnRzL19ncmlkLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fdHlwb2dyYXBoeS5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX3V0aWxpdGllcy5zY3NzIiwic3JjL3N0eWxlcy9jb21wb25lbnRzL19mb3JtLnNjc3MiLCJzcmMvc3R5bGVzL2NvbXBvbmVudHMvX2ljb25zLnNjc3MiLCJzcmMvc3R5bGVzL2NvbXBvbmVudHMvX2FuaW1hdGVkLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2hlYWRlci5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19mb290ZXIuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9faG9tZXBhZ2Uuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fcG9zdC5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19zdG9yeS5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19hdXRob3Iuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fc2VhcmNoLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX3NpZGViYXIuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fc2lkZW5hdi5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL2hlbHBlci5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL3N1YnNjcmliZS5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19jb21tZW50cy5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL190b3BpYy5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX21vZGFsLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fd2lkZ2V0LnNjc3MiXSwic291cmNlc0NvbnRlbnQiOlsiQGNoYXJzZXQgXCJVVEYtOFwiO1xuXG5AaW1wb3J0IFwifm5vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplXCI7XG5AaW1wb3J0IFwifnByaXNtanMvdGhlbWVzL3ByaXNtXCI7XG5AaW1wb3J0IFwifnByaXNtanMvcGx1Z2lucy9saW5lLW51bWJlcnMvcHJpc20tbGluZS1udW1iZXJzXCI7XG5cbi8vIE1peGlucyAmIFZhcmlhYmxlc1xuQGltcG9ydCBcImNvbW1vbi92YXJpYWJsZXNcIjtcbkBpbXBvcnQgXCJjb21tb24vbWl4aW5zXCI7XG5cbi8vIEltcG9ydCBucG0gZGVwZW5kZW5jaWVzXG4vLyB6b29tIGltZ1xuQGltcG9ydCBcImF1dG9sb2FkL3pvb21cIjtcblxuLy8gY29tbW9uXG5AaW1wb3J0IFwiY29tbW9uL2dsb2JhbFwiO1xuQGltcG9ydCBcImNvbXBvbmVudHMvZ3JpZFwiO1xuQGltcG9ydCBcImNvbW1vbi90eXBvZ3JhcGh5XCI7XG5AaW1wb3J0IFwiY29tbW9uL3V0aWxpdGllc1wiO1xuXG4vLyBjb21wb25lbnRzXG5AaW1wb3J0IFwiY29tcG9uZW50cy9mb3JtXCI7XG5AaW1wb3J0IFwiY29tcG9uZW50cy9pY29uc1wiO1xuQGltcG9ydCBcImNvbXBvbmVudHMvYW5pbWF0ZWRcIjtcblxuLy9sYXlvdXRzXG5AaW1wb3J0IFwibGF5b3V0cy9oZWFkZXJcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL2Zvb3RlclwiO1xuQGltcG9ydCBcImxheW91dHMvaG9tZXBhZ2VcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL3Bvc3RcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL3N0b3J5XCI7XG5AaW1wb3J0IFwibGF5b3V0cy9hdXRob3JcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL3NlYXJjaFwiO1xuQGltcG9ydCBcImxheW91dHMvc2lkZWJhclwiO1xuQGltcG9ydCBcImxheW91dHMvc2lkZW5hdlwiO1xuQGltcG9ydCBcImxheW91dHMvaGVscGVyXCI7XG5AaW1wb3J0IFwibGF5b3V0cy9zdWJzY3JpYmVcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL2NvbW1lbnRzXCI7XG5AaW1wb3J0IFwibGF5b3V0cy90b3BpY1wiO1xuQGltcG9ydCBcImNvbW1vbi9tb2RhbFwiO1xuQGltcG9ydCBcImNvbW1vbi93aWRnZXRcIjtcbiIsIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG4gIG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cbiAqL1xuXG5tYWluIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAqL1xuXG5oMSB7XG4gIGZvbnQtc2l6ZTogMmVtO1xuICBtYXJnaW46IDAuNjdlbSAwO1xufVxuXG4vKiBHcm91cGluZyBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cbiAqL1xuXG5ociB7XG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXG4gIGhlaWdodDogMDsgLyogMSAqL1xuICBvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxucHJlIHtcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXG59XG5cbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5hIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5cbi8qKlxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXG4gKi9cblxuYWJiclt0aXRsZV0ge1xuICBib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gKi9cblxuYixcbnN0cm9uZyB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5jb2RlLFxua2JkLFxuc2FtcCB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnNtYWxsIHtcbiAgZm9udC1zaXplOiA4MCU7XG59XG5cbi8qKlxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gKiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3ViLFxuc3VwIHtcbiAgZm9udC1zaXplOiA3NSU7XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcbiAgYm90dG9tOiAtMC4yNWVtO1xufVxuXG5zdXAge1xuICB0b3A6IC0wLjVlbTtcbn1cblxuLyogRW1iZWRkZWQgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmltZyB7XG4gIGJvcmRlci1zdHlsZTogbm9uZTtcbn1cblxuLyogRm9ybXNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQsXG5vcHRncm91cCxcbnNlbGVjdCxcbnRleHRhcmVhIHtcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIG1hcmdpbjogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uLFxuc2VsZWN0IHsgLyogMSAqL1xuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcblt0eXBlPVwiYnV0dG9uXCJdLFxuW3R5cGU9XCJyZXNldFwiXSxcblt0eXBlPVwic3VibWl0XCJdIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cImJ1dHRvblwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwicmVzZXRcIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInN1Ym1pdFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XG4gIGJvcmRlci1zdHlsZTogbm9uZTtcbiAgcGFkZGluZzogMDtcbn1cblxuLyoqXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXG4gKi9cblxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJidXR0b25cIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInJlc2V0XCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJzdWJtaXRcIl06LW1vei1mb2N1c3Jpbmcge1xuICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmZpZWxkc2V0IHtcbiAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5sZWdlbmQge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXG4gIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXG4gIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xuICBwYWRkaW5nOiAwOyAvKiAzICovXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxuICovXG5cbnByb2dyZXNzIHtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxuICovXG5cbnRleHRhcmVhIHtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXG4gKi9cblxuW3R5cGU9XCJjaGVja2JveFwiXSxcblt0eXBlPVwicmFkaW9cIl0ge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXG4gKi9cblxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cbiAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXG4gKi9cblxuW3R5cGU9XCJzZWFyY2hcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cbiAqL1xuXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xufVxuXG4vKiBJbnRlcmFjdGl2ZVxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gKi9cblxuZGV0YWlscyB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1bW1hcnkge1xuICBkaXNwbGF5OiBsaXN0LWl0ZW07XG59XG5cbi8qIE1pc2NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxuICovXG5cbnRlbXBsYXRlIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cbiAqL1xuXG5baGlkZGVuXSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4iLCIvKipcbiAqIHByaXNtLmpzIGRlZmF1bHQgdGhlbWUgZm9yIEphdmFTY3JpcHQsIENTUyBhbmQgSFRNTFxuICogQmFzZWQgb24gZGFiYmxldCAoaHR0cDovL2RhYmJsZXQuY29tKVxuICogQGF1dGhvciBMZWEgVmVyb3VcbiAqL1xuXG5jb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXSxcbnByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0ge1xuXHRjb2xvcjogYmxhY2s7XG5cdGJhY2tncm91bmQ6IG5vbmU7XG5cdHRleHQtc2hhZG93OiAwIDFweCB3aGl0ZTtcblx0Zm9udC1mYW1pbHk6IENvbnNvbGFzLCBNb25hY28sICdBbmRhbGUgTW9ubycsICdVYnVudHUgTW9ubycsIG1vbm9zcGFjZTtcblx0dGV4dC1hbGlnbjogbGVmdDtcblx0d2hpdGUtc3BhY2U6IHByZTtcblx0d29yZC1zcGFjaW5nOiBub3JtYWw7XG5cdHdvcmQtYnJlYWs6IG5vcm1hbDtcblx0d29yZC13cmFwOiBub3JtYWw7XG5cdGxpbmUtaGVpZ2h0OiAxLjU7XG5cblx0LW1vei10YWItc2l6ZTogNDtcblx0LW8tdGFiLXNpemU6IDQ7XG5cdHRhYi1zaXplOiA0O1xuXG5cdC13ZWJraXQtaHlwaGVuczogbm9uZTtcblx0LW1vei1oeXBoZW5zOiBub25lO1xuXHQtbXMtaHlwaGVuczogbm9uZTtcblx0aHlwaGVuczogbm9uZTtcbn1cblxucHJlW2NsYXNzKj1cImxhbmd1YWdlLVwiXTo6LW1vei1zZWxlY3Rpb24sIHByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0gOjotbW96LXNlbGVjdGlvbixcbmNvZGVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdOjotbW96LXNlbGVjdGlvbiwgY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0gOjotbW96LXNlbGVjdGlvbiB7XG5cdHRleHQtc2hhZG93OiBub25lO1xuXHRiYWNrZ3JvdW5kOiAjYjNkNGZjO1xufVxuXG5wcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdOjpzZWxlY3Rpb24sIHByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0gOjpzZWxlY3Rpb24sXG5jb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXTo6c2VsZWN0aW9uLCBjb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXSA6OnNlbGVjdGlvbiB7XG5cdHRleHQtc2hhZG93OiBub25lO1xuXHRiYWNrZ3JvdW5kOiAjYjNkNGZjO1xufVxuXG5AbWVkaWEgcHJpbnQge1xuXHRjb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXSxcblx0cHJlW2NsYXNzKj1cImxhbmd1YWdlLVwiXSB7XG5cdFx0dGV4dC1zaGFkb3c6IG5vbmU7XG5cdH1cbn1cblxuLyogQ29kZSBibG9ja3MgKi9cbnByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0ge1xuXHRwYWRkaW5nOiAxZW07XG5cdG1hcmdpbjogLjVlbSAwO1xuXHRvdmVyZmxvdzogYXV0bztcbn1cblxuOm5vdChwcmUpID4gY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0sXG5wcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIHtcblx0YmFja2dyb3VuZDogI2Y1ZjJmMDtcbn1cblxuLyogSW5saW5lIGNvZGUgKi9cbjpub3QocHJlKSA+IGNvZGVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIHtcblx0cGFkZGluZzogLjFlbTtcblx0Ym9yZGVyLXJhZGl1czogLjNlbTtcblx0d2hpdGUtc3BhY2U6IG5vcm1hbDtcbn1cblxuLnRva2VuLmNvbW1lbnQsXG4udG9rZW4ucHJvbG9nLFxuLnRva2VuLmRvY3R5cGUsXG4udG9rZW4uY2RhdGEge1xuXHRjb2xvcjogc2xhdGVncmF5O1xufVxuXG4udG9rZW4ucHVuY3R1YXRpb24ge1xuXHRjb2xvcjogIzk5OTtcbn1cblxuLm5hbWVzcGFjZSB7XG5cdG9wYWNpdHk6IC43O1xufVxuXG4udG9rZW4ucHJvcGVydHksXG4udG9rZW4udGFnLFxuLnRva2VuLmJvb2xlYW4sXG4udG9rZW4ubnVtYmVyLFxuLnRva2VuLmNvbnN0YW50LFxuLnRva2VuLnN5bWJvbCxcbi50b2tlbi5kZWxldGVkIHtcblx0Y29sb3I6ICM5MDU7XG59XG5cbi50b2tlbi5zZWxlY3Rvcixcbi50b2tlbi5hdHRyLW5hbWUsXG4udG9rZW4uc3RyaW5nLFxuLnRva2VuLmNoYXIsXG4udG9rZW4uYnVpbHRpbixcbi50b2tlbi5pbnNlcnRlZCB7XG5cdGNvbG9yOiAjNjkwO1xufVxuXG4udG9rZW4ub3BlcmF0b3IsXG4udG9rZW4uZW50aXR5LFxuLnRva2VuLnVybCxcbi5sYW5ndWFnZS1jc3MgLnRva2VuLnN0cmluZyxcbi5zdHlsZSAudG9rZW4uc3RyaW5nIHtcblx0Y29sb3I6ICM5YTZlM2E7XG5cdGJhY2tncm91bmQ6IGhzbGEoMCwgMCUsIDEwMCUsIC41KTtcbn1cblxuLnRva2VuLmF0cnVsZSxcbi50b2tlbi5hdHRyLXZhbHVlLFxuLnRva2VuLmtleXdvcmQge1xuXHRjb2xvcjogIzA3YTtcbn1cblxuLnRva2VuLmZ1bmN0aW9uLFxuLnRva2VuLmNsYXNzLW5hbWUge1xuXHRjb2xvcjogI0RENEE2ODtcbn1cblxuLnRva2VuLnJlZ2V4LFxuLnRva2VuLmltcG9ydGFudCxcbi50b2tlbi52YXJpYWJsZSB7XG5cdGNvbG9yOiAjZTkwO1xufVxuXG4udG9rZW4uaW1wb3J0YW50LFxuLnRva2VuLmJvbGQge1xuXHRmb250LXdlaWdodDogYm9sZDtcbn1cbi50b2tlbi5pdGFsaWMge1xuXHRmb250LXN0eWxlOiBpdGFsaWM7XG59XG5cbi50b2tlbi5lbnRpdHkge1xuXHRjdXJzb3I6IGhlbHA7XG59XG4iLCJwcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdLmxpbmUtbnVtYmVycyB7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0cGFkZGluZy1sZWZ0OiAzLjhlbTtcblx0Y291bnRlci1yZXNldDogbGluZW51bWJlcjtcbn1cblxucHJlW2NsYXNzKj1cImxhbmd1YWdlLVwiXS5saW5lLW51bWJlcnMgPiBjb2RlIHtcblx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHR3aGl0ZS1zcGFjZTogaW5oZXJpdDtcbn1cblxuLmxpbmUtbnVtYmVycyAubGluZS1udW1iZXJzLXJvd3Mge1xuXHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXHR0b3A6IDA7XG5cdGZvbnQtc2l6ZTogMTAwJTtcblx0bGVmdDogLTMuOGVtO1xuXHR3aWR0aDogM2VtOyAvKiB3b3JrcyBmb3IgbGluZS1udW1iZXJzIGJlbG93IDEwMDAgbGluZXMgKi9cblx0bGV0dGVyLXNwYWNpbmc6IC0xcHg7XG5cdGJvcmRlci1yaWdodDogMXB4IHNvbGlkICM5OTk7XG5cblx0LXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcblx0LW1vei11c2VyLXNlbGVjdDogbm9uZTtcblx0LW1zLXVzZXItc2VsZWN0OiBub25lO1xuXHR1c2VyLXNlbGVjdDogbm9uZTtcblxufVxuXG5cdC5saW5lLW51bWJlcnMtcm93cyA+IHNwYW4ge1xuXHRcdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdGNvdW50ZXItaW5jcmVtZW50OiBsaW5lbnVtYmVyO1xuXHR9XG5cblx0XHQubGluZS1udW1iZXJzLXJvd3MgPiBzcGFuOmJlZm9yZSB7XG5cdFx0XHRjb250ZW50OiBjb3VudGVyKGxpbmVudW1iZXIpO1xuXHRcdFx0Y29sb3I6ICM5OTk7XG5cdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdHBhZGRpbmctcmlnaHQ6IDAuOGVtO1xuXHRcdFx0dGV4dC1hbGlnbjogcmlnaHQ7XG5cdFx0fVxuIiwiLy8gMS4gQ29sb3JzXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4kcHJpbWFyeS1jb2xvcjogIzFDOTk2MztcclxuLy8gJHByaW1hcnktY29sb3I6ICMwMEEwMzQ7XHJcbiRwcmltYXJ5LWNvbG9yLWhvdmVyOiAjMDBhYjZiO1xyXG5cclxuLy8gJHByaW1hcnktY29sb3I6ICMzMzY2OGM7XHJcbiRwcmltYXJ5LWNvbG9yLWRhcms6ICAgIzE5NzZkMjtcclxuXHJcbiRwcmltYXJ5LXRleHQtY29sb3I6ICAgcmdiYSgwLCAwLCAwLCAuODQpO1xyXG5cclxuLy8gJHByaW1hcnktY29sb3ItbGlnaHQ6XHJcbi8vICRwcmltYXJ5LWNvbG9yLXRleHQ6XHJcbi8vICRhY2NlbnQtY29sb3I6XHJcbi8vICRwcmltYXJ5LXRleHQtY29sb3I6XHJcbi8vICRzZWNvbmRhcnktdGV4dC1jb2xvcjpcclxuLy8gJGRpdmlkZXItY29sb3I6XHJcblxyXG4vLyBzb2NpYWwgY29sb3JzXHJcbiRzb2NpYWwtY29sb3JzOiAoXHJcbiAgZmFjZWJvb2s6ICAgIzNiNTk5OCxcclxuICB0d2l0dGVyOiAgICAjNTVhY2VlLFxyXG4gIGdvb2dsZTogICAgICNkZDRiMzksXHJcbiAgaW5zdGFncmFtOiAgIzMwNjA4OCxcclxuICB5b3V0dWJlOiAgICAjZTUyZDI3LFxyXG4gIGdpdGh1YjogICAgICM1NTUsXHJcbiAgbGlua2VkaW46ICAgIzAwN2JiNixcclxuICBzcG90aWZ5OiAgICAjMmViZDU5LFxyXG4gIGNvZGVwZW46ICAgICMyMjIsXHJcbiAgYmVoYW5jZTogICAgIzEzMTQxOCxcclxuICBkcmliYmJsZTogICAjZWE0Yzg5LFxyXG4gIGZsaWNrcjogICAgICMwMDYzZGMsXHJcbiAgcmVkZGl0OiAgICAgI2ZmNDUwMCxcclxuICBwb2NrZXQ6ICAgICAjZjUwMDU3LFxyXG4gIHBpbnRlcmVzdDogICNiZDA4MWMsXHJcbiAgd2hhdHNhcHA6ICAgIzY0ZDQ0OCxcclxuICB0ZWxlZ3JhbTogICAjMDhjLFxyXG4gIGRpc2NvcmQ6ICM3Mjg5ZGEsXHJcbiAgcnNzOiAgICAgICAgICBvcmFuZ2VcclxuKTtcclxuXHJcbi8vIDIuIEZvbnRzXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4kcHJpbWFyeS1mb250OiAgICAnUm9ib3RvJyxXaGl0bmV5IFNTbSBBLFdoaXRuZXkgU1NtIEIsLWFwcGxlLXN5c3RlbSxCbGlua01hY1N5c3RlbUZvbnQsU2Vnb2UgVUksT3h5Z2VuLFVidW50dSxDYW50YXJlbGwsT3BlbiBTYW5zLEhlbHZldGljYSBOZXVlLHNhbnMtc2VyaWY7IC8vIGZvbnQgZGVmYXVsdCBwYWdlIGFuZCB0aXRsZXNcclxuJHNlY3VuZGFyeS1mb250OiAgJ01lcnJpd2VhdGhlcicsTWVyY3VyeSBTU20gQSxNZXJjdXJ5IFNTbSBCLEdlb3JnaWEsc2VyaWY7IC8vIGZvbnQgZm9yIGNvbnRlbnRcclxuJGNvZGUtZm9udDogICAgICAgJ1JvYm90byBNb25vJywgRGFuayBNb25vLCBGaXJhIE1vbm8sIG1vbm9zcGFjZTsgLy8gZm9udCBmb3IgY29kZSBhbmQgcHJlXHJcblxyXG4kZm9udC1zaXplLWJhc2U6IDE2cHg7XHJcblxyXG4vLyAzLiBUeXBvZ3JhcGh5XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4kZm9udC1zaXplLXJvb3Q6ICAxNnB4O1xyXG5cclxuJGZvbnQtc2l6ZS1oMTogICAgMnJlbTtcclxuJGZvbnQtc2l6ZS1oMjogICAgMS44NzVyZW07XHJcbiRmb250LXNpemUtaDM6ICAgIDEuNnJlbTtcclxuJGZvbnQtc2l6ZS1oNDogICAgMS40cmVtO1xyXG4kZm9udC1zaXplLWg1OiAgICAxLjJyZW07XHJcbiRmb250LXNpemUtaDY6ICAgIDFyZW07XHJcblxyXG4kaGVhZGluZ3MtZm9udC1mYW1pbHk6ICAgICAkcHJpbWFyeS1mb250O1xyXG4kaGVhZGluZ3MtZm9udC13ZWlnaHQ6ICAgICA3MDA7XHJcbiRoZWFkaW5ncy1saW5lLWhlaWdodDogICAgIDEuMTtcclxuJGhlYWRpbmdzLWNvbG9yOiAgICAgICAgICAgaW5oZXJpdDtcclxuXHJcbi8vIENvbnRhaW5lclxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuJGNvbnRhaW5lci1zbTogICAgICAgICAgICAgNTc2cHg7XHJcbiRjb250YWluZXItbWQ6ICAgICAgICAgICAgIDc2OHB4O1xyXG4kY29udGFpbmVyLWxnOiAgICAgICAgICAgICA5NzBweDtcclxuJGNvbnRhaW5lci14bDogICAgICAgICAgICAgMTIwMHB4O1xyXG5cclxuLy8gSGVhZGVyXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiRoZWFkZXItY29sb3I6ICNCQkYxQjk7XHJcbiRoZWFkZXItY29sb3ItaG92ZXI6ICNFRUZGRUE7XHJcbiRoZWFkZXItaGVpZ2h0OiA1MHB4O1xyXG5cclxuLy8gMy4gTWVkaWEgUXVlcnkgUmFuZ2VzXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4kbnVtLWNvbHM6IDEyO1xyXG4kY29udGFpbmVyLWd1dHRlci13aWR0aDogMTJweDtcclxuXHJcbi8vIDMuIE1lZGlhIFF1ZXJ5IFJhbmdlc1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuJHNtOiAgICAgICAgICAgIDY0MHB4O1xyXG4kbWQ6ICAgICAgICAgICAgNzY2cHg7XHJcbiRsZzogICAgICAgICAgICAxMDAwcHg7XHJcbiR4bDogICAgICAgICAgICAxMjMwcHg7XHJcblxyXG4kc20tYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHNtfSlcIjtcclxuJG1kLWFuZC11cDogICAgIFwib25seSBzY3JlZW4gYW5kIChtaW4td2lkdGggOiAjeyRtZH0pXCI7XHJcbiRsZy1hbmQtdXA6ICAgICBcIm9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoIDogI3skbGd9KVwiO1xyXG4keGwtYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHhsfSlcIjtcclxuXHJcbiRzbS1hbmQtZG93bjogICBcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoIDogI3skc219KVwiO1xyXG4kbWQtYW5kLWRvd246ICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aCA6ICN7JG1kfSlcIjtcclxuJGxnLWFuZC1kb3duOiAgIFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiAjeyRsZ30pXCI7XHJcblxyXG4vLyBDb2RlIENvbG9yXHJcbiRjb2RlLWJnLWNvbG9yOiAgICNmN2Y3Zjc7XHJcbiRmb250LXNpemUtY29kZTogIDE1cHg7XHJcbiRjb2RlLWNvbG9yOiAgICAgICNjNzI1NGU7XHJcbiRwcmUtY29kZS1jb2xvcjogICMzNzQ3NGY7XHJcblxyXG4vLyBpY29uc1xyXG5cclxuJGktY29kZTogXCJcXGYxMjFcIjtcclxuJGktd2FybmluZzogXCJcXGUwMDJcIjtcclxuJGktY2hlY2s6IFwiXFxlODZjXCI7XHJcbiRpLXN0YXI6IFwiXFxlOTA3XCI7XHJcbiIsIiVsaW5rIHtcclxuICBjb2xvcjogaW5oZXJpdDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG59XHJcblxyXG4lbGluay0tYWNjZW50IHtcclxuICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gIC8vICY6aG92ZXIgeyBjb2xvcjogJHByaW1hcnktY29sb3ItaG92ZXI7IH1cclxufVxyXG5cclxuJWNvbnRlbnQtYWJzb2x1dGUtYm90dG9tIHtcclxuICBib3R0b206IDA7XHJcbiAgbGVmdDogMDtcclxuICBtYXJnaW46IDMwcHg7XHJcbiAgbWF4LXdpZHRoOiA2MDBweDtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgei1pbmRleDogMjtcclxufVxyXG5cclxuJXUtYWJzb2x1dGUwIHtcclxuICBib3R0b206IDA7XHJcbiAgbGVmdDogMDtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgcmlnaHQ6IDA7XHJcbiAgdG9wOiAwO1xyXG59XHJcblxyXG4ldS10ZXh0LWNvbG9yLWRhcmtlciB7XHJcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjgpICFpbXBvcnRhbnQ7XHJcbiAgZmlsbDogcmdiYSgwLCAwLCAwLCAuOCkgIWltcG9ydGFudDtcclxufVxyXG5cclxuJWZvbnRzLWljb25zIHtcclxuICAvKiB1c2UgIWltcG9ydGFudCB0byBwcmV2ZW50IGlzc3VlcyB3aXRoIGJyb3dzZXIgZXh0ZW5zaW9ucyB0aGF0IGNoYW5nZSBmb250cyAqL1xyXG4gIGZvbnQtZmFtaWx5OiAnbWFwYWNoZScgIWltcG9ydGFudDsgLyogc3R5bGVsaW50LWRpc2FibGUtbGluZSAqL1xyXG4gIHNwZWFrOiBub25lO1xyXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcclxuICBmb250LXdlaWdodDogbm9ybWFsO1xyXG4gIGZvbnQtdmFyaWFudDogbm9ybWFsO1xyXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xyXG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xyXG5cclxuICAvKiBCZXR0ZXIgRm9udCBSZW5kZXJpbmcgPT09PT09PT09PT0gKi9cclxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcclxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xyXG59XHJcbiIsIi8vIHN0eWxlbGludC1kaXNhYmxlXHJcbmltZ1tkYXRhLWFjdGlvbj1cInpvb21cIl0ge1xyXG4gIGN1cnNvcjogem9vbS1pbjtcclxufVxyXG4uem9vbS1pbWcsXHJcbi56b29tLWltZy13cmFwIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgei1pbmRleDogNjY2O1xyXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYWxsIDMwMG1zO1xyXG4gICAgICAgLW8tdHJhbnNpdGlvbjogYWxsIDMwMG1zO1xyXG4gICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDMwMG1zO1xyXG59XHJcbmltZy56b29tLWltZyB7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIGN1cnNvcjogLXdlYmtpdC16b29tLW91dDtcclxuICBjdXJzb3I6IC1tb3otem9vbS1vdXQ7XHJcbn1cclxuLnpvb20tb3ZlcmxheSB7XHJcbiAgei1pbmRleDogNDIwO1xyXG4gIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHRvcDogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIGJvdHRvbTogMDtcclxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICBmaWx0ZXI6IFwiYWxwaGEob3BhY2l0eT0wKVwiO1xyXG4gIG9wYWNpdHk6IDA7XHJcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAgICAgIG9wYWNpdHkgMzAwbXM7XHJcbiAgICAgICAtby10cmFuc2l0aW9uOiAgICAgIG9wYWNpdHkgMzAwbXM7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgIG9wYWNpdHkgMzAwbXM7XHJcbn1cclxuLnpvb20tb3ZlcmxheS1vcGVuIC56b29tLW92ZXJsYXkge1xyXG4gIGZpbHRlcjogXCJhbHBoYShvcGFjaXR5PTEwMClcIjtcclxuICBvcGFjaXR5OiAxO1xyXG59XHJcbi56b29tLW92ZXJsYXktb3BlbixcclxuLnpvb20tb3ZlcmxheS10cmFuc2l0aW9uaW5nIHtcclxuICBjdXJzb3I6IGRlZmF1bHQ7XHJcbn1cclxuIiwiOnJvb3Qge1xuICAtLWJsYWNrOiAjMDAwO1xuICAtLXdoaXRlOiAjZmZmO1xuICAtLXByaW1hcnktY29sb3I6ICMxQzk5NjM7XG4gIC0tc2Vjb25kYXJ5LWNvbG9yOiAjMmFkODhkO1xuICAtLWhlYWRlci1jb2xvcjogI0JCRjFCOTtcbiAgLS1oZWFkZXItY29sb3ItaG92ZXI6ICNFRUZGRUE7XG4gIC0tcG9zdC1jb2xvci1saW5rOiAjMmFkODhkO1xuICAtLXN0b3J5LWNvdmVyLWNhdGVnb3J5LWNvbG9yOiAjMmFkODhkO1xuICAtLWNvbXBvc2l0ZS1jb2xvcjogI0NDMTE2RTtcbiAgLS1mb290ZXItY29sb3ItbGluazogIzJhZDg4ZDtcbiAgLS1tZWRpYS10eXBlLWNvbG9yOiAjMmFkODhkO1xufVxuXG4qLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuYSB7XG4gIGNvbG9yOiBpbmhlcml0O1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG5cbiAgJjphY3RpdmUsXG4gICY6aG92ZXIge1xuICAgIG91dGxpbmU6IDA7XG4gIH1cbn1cblxuYmxvY2txdW90ZSB7XG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWQgIzAwMDtcbiAgY29sb3I6ICMwMDA7XG4gIGZvbnQtZmFtaWx5OiAkc2VjdW5kYXJ5LWZvbnQ7XG4gIGZvbnQtc2l6ZTogMS4xODc1cmVtO1xuICBmb250LXN0eWxlOiBpdGFsaWM7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxldHRlci1zcGFjaW5nOiAtLjAwM2VtO1xuICBsaW5lLWhlaWdodDogMS43O1xuICBtYXJnaW46IDMwcHggMCAwIC0xMnB4O1xuICBwYWRkaW5nLWJvdHRvbTogMnB4O1xuICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG5cbiAgcDpmaXJzdC1vZi10eXBlIHsgbWFyZ2luLXRvcDogMCB9XG59XG5cbmJvZHkge1xuICBjb2xvcjogJHByaW1hcnktdGV4dC1jb2xvcjtcbiAgZm9udC1mYW1pbHk6ICRwcmltYXJ5LWZvbnQ7XG4gIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1iYXNlO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxldHRlci1zcGFjaW5nOiAwO1xuICBsaW5lLWhlaWdodDogMS40O1xuICBtYXJnaW46IDAgYXV0bztcbiAgdGV4dC1yZW5kZXJpbmc6IG9wdGltaXplTGVnaWJpbGl0eTtcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xufVxuXG4vL0RlZmF1bHQgc3R5bGVzXG5odG1sIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZm9udC1zaXplOiAkZm9udC1zaXplLXJvb3Q7XG59XG5cbmZpZ3VyZSB7XG4gIG1hcmdpbjogMDtcbn1cblxuZmlnY2FwdGlvbiB7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC42OCk7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcbiAgZm9udC1mZWF0dXJlLXNldHRpbmdzOiBcImxpZ2FcIiBvbiwgXCJsbnVtXCIgb247XG4gIGZvbnQtc2l6ZTogMC45Mzc1cmVtO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxlZnQ6IDA7XG4gIGxldHRlci1zcGFjaW5nOiAwO1xuICBsaW5lLWhlaWdodDogMS40O1xuICBtYXJnaW4tdG9wOiAxMHB4O1xuICBvdXRsaW5lOiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdG9wOiAwO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLy8gQ29kZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmtiZCwgc2FtcCwgY29kZSB7XG4gIGJhY2tncm91bmQ6ICRjb2RlLWJnLWNvbG9yO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGNvbG9yOiAkY29kZS1jb2xvcjtcbiAgZm9udC1mYW1pbHk6ICRjb2RlLWZvbnQgIWltcG9ydGFudDtcbiAgZm9udC1zaXplOiAkZm9udC1zaXplLWNvZGU7XG4gIHBhZGRpbmc6IDRweCA2cHg7XG4gIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbn1cblxucHJlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogJGNvZGUtYmctY29sb3IgIWltcG9ydGFudDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBmb250LWZhbWlseTogJGNvZGUtZm9udCAhaW1wb3J0YW50O1xuICBmb250LXNpemU6ICRmb250LXNpemUtY29kZTtcbiAgbWFyZ2luLXRvcDogMzBweCAhaW1wb3J0YW50O1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBhZGRpbmc6IDFyZW07XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd29yZC13cmFwOiBub3JtYWw7XG5cbiAgY29kZSB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgY29sb3I6ICRwcmUtY29kZS1jb2xvcjtcbiAgICBwYWRkaW5nOiAwO1xuICAgIHRleHQtc2hhZG93OiAwIDFweCAjZmZmO1xuICB9XG59XG5cbmNvZGVbY2xhc3MqPWxhbmd1YWdlLV0sXG5wcmVbY2xhc3MqPWxhbmd1YWdlLV0ge1xuICBjb2xvcjogJHByZS1jb2RlLWNvbG9yO1xuICBsaW5lLWhlaWdodDogMS40O1xuXG4gIC50b2tlbi5jb21tZW50IHsgb3BhY2l0eTogLjg7IH1cblxuICAmLmxpbmUtbnVtYmVycyB7XG4gICAgcGFkZGluZy1sZWZ0OiA1OHB4O1xuXG4gICAgJjo6YmVmb3JlIHtcbiAgICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBsZWZ0OiAwO1xuICAgICAgdG9wOiAwO1xuICAgICAgYmFja2dyb3VuZDogI0YwRURFRTtcbiAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cbiAgfVxuXG4gIC5saW5lLW51bWJlcnMtcm93cyB7XG4gICAgYm9yZGVyLXJpZ2h0OiBub25lO1xuICAgIHRvcDogLTNweDtcbiAgICBsZWZ0OiAtNThweDtcblxuICAgICYgPiBzcGFuOjpiZWZvcmUge1xuICAgICAgcGFkZGluZy1yaWdodDogMDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIG9wYWNpdHk6IC44O1xuICAgIH1cbiAgfVxufVxuXG4vLyBoclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmhyOm5vdCguaHItbGlzdCkge1xuICBtYXJnaW46IDQwcHggYXV0byAxMHB4O1xuICBoZWlnaHQ6IDFweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcbiAgYm9yZGVyOiAwO1xuICBtYXgtd2lkdGg6IDEwMCU7XG59XG5cbi5wb3N0LWZvb3Rlci1ociB7XG4gIC8vIGhlaWdodDogMXB4O1xuICBtYXJnaW46IDMycHggMDtcbiAgLy8gYm9yZGVyOiAwO1xuICAvLyBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xufVxuXG5pbWcge1xuICBoZWlnaHQ6IGF1dG87XG4gIG1heC13aWR0aDogMTAwJTtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgd2lkdGg6IGF1dG87XG5cbiAgJjpub3QoW3NyY10pIHtcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIH1cbn1cblxuaSB7XG4gIC8vIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuaW5wdXQge1xuICBib3JkZXI6IG5vbmU7XG4gIG91dGxpbmU6IDA7XG59XG5cbm9sLCB1bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG4gIGxpc3Qtc3R5bGUtaW1hZ2U6IG5vbmU7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbn1cblxubWFyayB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMjE1LCAyNTMsIDIxMSwgMSksIHJnYmEoMjE1LCAyNTMsIDIxMSwgMSkpO1xuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuOCk7XG59XG5cbnEge1xuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNDQpO1xuICBkaXNwbGF5OiBibG9jaztcbiAgZm9udC1zaXplOiAyOHB4O1xuICBmb250LXN0eWxlOiBpdGFsaWM7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxldHRlci1zcGFjaW5nOiAtLjAxNGVtO1xuICBsaW5lLWhlaWdodDogMS40ODtcbiAgcGFkZGluZy1sZWZ0OiA1MHB4O1xuICBwYWRkaW5nLXRvcDogMTVweDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcblxuICAmOjpiZWZvcmUsICY6OmFmdGVyIHsgZGlzcGxheTogbm9uZTsgfVxufVxuXG50YWJsZSB7XG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gIGJvcmRlci1zcGFjaW5nOiAwO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZiwgXCJBcHBsZSBDb2xvciBFbW9qaVwiLCBcIlNlZ29lIFVJIEVtb2ppXCIsIFwiU2Vnb2UgVUkgU3ltYm9sXCI7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgbWFyZ2luOiAyMHB4IDAgMDtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBvdmVyZmxvdy14OiBhdXRvO1xuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB3aWR0aDogYXV0bztcbiAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xuXG4gIHRoLFxuICB0ZCB7XG4gICAgcGFkZGluZzogNnB4IDEzcHg7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2RmZTJlNTtcbiAgfVxuXG4gIHRyOm50aC1jaGlsZCgybikge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmNmY4ZmE7XG4gIH1cblxuICB0aCB7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMnB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgfVxufVxuXG4vLyBMaW5rcyBjb2xvclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi5saW5rLS1hY2NlbnQgeyBAZXh0ZW5kICVsaW5rLS1hY2NlbnQ7IH1cblxuLmxpbmsgeyBAZXh0ZW5kICVsaW5rOyB9XG5cbi5saW5rLS11bmRlcmxpbmUge1xuICAmOmFjdGl2ZSxcbiAgJjpmb2N1cyxcbiAgJjpob3ZlciB7XG4gICAgLy8gY29sb3I6IGluaGVyaXQ7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gIH1cbn1cblxuLy8gQW5pbWF0aW9uIG1haW4gcGFnZSBhbmQgZm9vdGVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLm1haW4geyBtYXJnaW4tYm90dG9tOiA0ZW07IG1pbi1oZWlnaHQ6IDkwdmggfVxuXG4ubWFpbixcbi5mb290ZXIgeyB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjVzIGVhc2U7IH1cblxuLy8gd2FybmluZyBzdWNjZXNzIGFuZCBOb3RlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLndhcm5pbmcge1xuICBiYWNrZ3JvdW5kOiAjZmJlOWU3O1xuICBjb2xvcjogI2Q1MDAwMDtcbiAgJjo6YmVmb3JlIHsgY29udGVudDogJGktd2FybmluZzsgfVxufVxuXG4ubm90ZSB7XG4gIGJhY2tncm91bmQ6ICNlMWY1ZmU7XG4gIGNvbG9yOiAjMDI4OGQxO1xuICAmOjpiZWZvcmUgeyBjb250ZW50OiAkaS1zdGFyOyB9XG59XG5cbi5zdWNjZXNzIHtcbiAgYmFja2dyb3VuZDogI2UwZjJmMTtcbiAgY29sb3I6ICMwMDg5N2I7XG4gICY6OmJlZm9yZSB7IGNvbG9yOiAjMDBiZmE1OyBjb250ZW50OiAkaS1jaGVjazsgfVxufVxuXG4ud2FybmluZywgLm5vdGUsIC5zdWNjZXNzIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtc2l6ZTogMThweCAhaW1wb3J0YW50O1xuICBsaW5lLWhlaWdodDogMS41OCAhaW1wb3J0YW50O1xuICBtYXJnaW4tdG9wOiAyOHB4O1xuICBwYWRkaW5nOiAxMnB4IDI0cHggMTJweCA2MHB4O1xuXG4gIGEge1xuICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICB9XG5cbiAgJjo6YmVmb3JlIHtcbiAgICBAZXh0ZW5kICVmb250cy1pY29ucztcblxuICAgIGZsb2F0OiBsZWZ0O1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICBtYXJnaW4tbGVmdDogLTM2cHg7XG4gICAgbWFyZ2luLXRvcDogLTVweDtcbiAgfVxufVxuXG4vLyBQYWdlIFRhZ3Ncbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4udGFnIHtcbiAgJi1kZXNjcmlwdGlvbiB7XG4gICAgbWF4LXdpZHRoOiA3MDBweDtcbiAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICBmb250LXdlaWdodDogMzAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gIH1cbiAgJi5oYXMtLWltYWdlIHsgbWluLWhlaWdodDogMzUwcHggfVxufVxuXG4vLyB0b2x0aXBcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4ud2l0aC10b29sdGlwIHtcbiAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmOjphZnRlciB7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuODUpO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBjb250ZW50OiBhdHRyKGRhdGEtdG9vbHRpcCk7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGxlZnQ6IDUwJTtcbiAgICBsaW5lLWhlaWdodDogMS4yNTtcbiAgICBtaW4td2lkdGg6IDEzMHB4O1xuICAgIG9wYWNpdHk6IDA7XG4gICAgcGFkZGluZzogNHB4IDhweDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xuICAgIHRvcDogLTMwcHg7XG4gICAgd2lsbC1jaGFuZ2U6IG9wYWNpdHksIHRyYW5zZm9ybTtcbiAgICB6LWluZGV4OiAxO1xuICB9XG5cbiAgJjpob3Zlcjo6YWZ0ZXIge1xuICAgIGFuaW1hdGlvbjogdG9vbHRpcCAuMXMgZWFzZS1vdXQgYm90aDtcbiAgfVxufVxuXG4vLyBFcnJvciBwYWdlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmVycm9yUGFnZSB7XG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvIE1vbm8nLCBtb25vc3BhY2U7XG5cbiAgJi1saW5rIHtcbiAgICBsZWZ0OiAtNXB4O1xuICAgIHBhZGRpbmc6IDI0cHggNjBweDtcbiAgICB0b3A6IC02cHg7XG4gIH1cblxuICAmLXRleHQge1xuICAgIG1hcmdpbi10b3A6IDYwcHg7XG4gICAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xuICB9XG5cbiAgJi13cmFwIHtcbiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNCk7XG4gICAgcGFkZGluZzogN3Z3IDR2dztcbiAgfVxufVxuXG4vLyBWaWRlbyBSZXNwb25zaXZlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLnZpZGVvLXJlc3BvbnNpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbiAgaGVpZ2h0OiAwO1xuICBtYXJnaW4tdG9wOiAzMHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBwYWRkaW5nOiAwIDAgNTYuMjUlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiAxMDAlO1xuXG4gIGlmcmFtZSB7XG4gICAgYm9yZGVyOiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgbGVmdDogMDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG5cbiAgdmlkZW8ge1xuICAgIGJvcmRlcjogMDtcbiAgICBib3R0b206IDA7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGxlZnQ6IDA7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxufVxuXG4ua2ctZW1iZWQtY2FyZCAudmlkZW8tcmVzcG9uc2l2ZSB7IG1hcmdpbi10b3A6IDAgfVxuXG4vLyBHYWxsZXJ5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4ua2ctZ2FsbGVyeSB7XG4gICYtY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG5cbiAgJi1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAgICY6bm90KDpmaXJzdC1vZi10eXBlKSB7IG1hcmdpbjogMC43NWVtIDAgMCAwIH1cbiAgfVxuXG4gICYtaW1hZ2Uge1xuICAgIGltZyB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cblxuICAgICY6bm90KDpmaXJzdC1vZi10eXBlKSB7IG1hcmdpbjogMCAwIDAgMC43NWVtIH1cbiAgfVxufVxuXG4vLyBTb2NpYWwgTWVkaWEgQ29sb3Jcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5AZWFjaCAkc29jaWFsLW5hbWUsICRjb2xvciBpbiAkc29jaWFsLWNvbG9ycyB7XG4gIC5jLSN7JHNvY2lhbC1uYW1lfSB7IGNvbG9yOiAkY29sb3IgIWltcG9ydGFudDsgfVxuICAuYmctI3skc29jaWFsLW5hbWV9IHsgYmFja2dyb3VuZC1jb2xvcjogJGNvbG9yICFpbXBvcnRhbnQ7IH1cbn1cblxuLy8gRmFjZWJvb2sgU2F2ZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIC5mYlNhdmUge1xuLy8gICAmLWRyb3Bkb3duIHtcbi8vICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuLy8gICAgIGJvcmRlcjogMXB4IHNvbGlkICNlMGUwZTA7XG4vLyAgICAgYm90dG9tOiAxMDAlO1xuLy8gICAgIGRpc3BsYXk6IG5vbmU7XG4vLyAgICAgbWF4LXdpZHRoOiAyMDBweDtcbi8vICAgICBtaW4td2lkdGg6IDEwMHB4O1xuLy8gICAgIHBhZGRpbmc6IDhweDtcbi8vICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAwKTtcbi8vICAgICB6LWluZGV4OiAxMDtcblxuLy8gICAgICYuaXMtdmlzaWJsZSB7IGRpc3BsYXk6IGJsb2NrOyB9XG4vLyAgIH1cbi8vIH1cblxuLy8gUm9ja2V0IGZvciByZXR1cm4gdG9wIHBhZ2Vcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4ucm9ja2V0IHtcbiAgYm90dG9tOiA1MHB4O1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHJpZ2h0OiAyMHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHdpZHRoOiA2MHB4O1xuICB6LWluZGV4OiA1O1xuXG4gICY6aG92ZXIgc3ZnIHBhdGgge1xuICAgIGZpbGw6IHJnYmEoMCwgMCwgMCwgLjYpO1xuICB9XG59XG5cbi5zdmdJY29uIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuXG5zdmcge1xuICBoZWlnaHQ6IGF1dG87XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4vLyBQYWdpbmF0aW9uIEluZmluaXRlIFNjcm9sbFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLmxvYWQtbW9yZSB7IG1heC13aWR0aDogNzAlICFpbXBvcnRhbnQgfVxuXG4vLyBsb2FkaW5nQmFyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4ubG9hZGluZ0JhciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICM0OGU3OWE7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGhlaWdodDogMnB4O1xuICBsZWZ0OiAwO1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDA7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTtcbiAgei1pbmRleDogODAwO1xufVxuXG4uaXMtbG9hZGluZyAubG9hZGluZ0JhciB7XG4gIGFuaW1hdGlvbjogbG9hZGluZy1iYXIgMXMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG4gIGFuaW1hdGlvbi1kZWxheTogLjhzO1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLy8gTWVkaWEgUXVlcnkgcmVzcG9uc2ludmVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5AbWVkaWEgI3skbWQtYW5kLWRvd259IHtcbiAgYmxvY2txdW90ZSB7IG1hcmdpbi1sZWZ0OiAtNXB4OyBmb250LXNpemU6IDEuMTI1cmVtIH1cblxuICAua2ctaW1hZ2UtY2FyZCxcbiAgLmtnLWVtYmVkLWNhcmQge1xuICAgIG1hcmdpbi1yaWdodDogLTIwcHg7XG4gICAgbWFyZ2luLWxlZnQ6IC0yMHB4O1xuICB9XG59XG4iLCIvLyBDb250YWluZXJcbi5leHRyZW1lLWNvbnRhaW5lciB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBtYXgtd2lkdGg6IDEyMDBweDtcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xuICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xuICB3aWR0aDogMTAwJTtcbn1cblxuLy8gQG1lZGlhICN7JGxnLWFuZC11cH0ge1xuLy8gICAuY29udGVudCB7XG4vLyAgICAgLy8gZmxleDogMSAhaW1wb3J0YW50O1xuLy8gICAgIG1heC13aWR0aDogY2FsYygxMDAlIC0gMzQwcHgpICFpbXBvcnRhbnQ7XG4vLyAgICAgLy8gb3JkZXI6IDE7XG4vLyAgICAgLy8gb3ZlcmZsb3c6IGhpZGRlbjtcbi8vICAgfVxuXG4vLyAgIC5zaWRlYmFyIHtcbi8vICAgICB3aWR0aDogMzQwcHggIWltcG9ydGFudDtcbi8vICAgICAvLyBmbGV4OiAwIDAgMzQwcHggIWltcG9ydGFudDtcbi8vICAgICAvLyBvcmRlcjogMjtcbi8vICAgfVxuLy8gfVxuXG4uY29sLWxlZnQsXG4uY2MtdmlkZW8tbGVmdCB7XG4gIGZsZXgtYmFzaXM6IDA7XG4gIGZsZXgtZ3JvdzogMTtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xuICBwYWRkaW5nLWxlZnQ6IDEwcHg7XG59XG5cbi8vIEBtZWRpYSAjeyRtZC1hbmQtdXB9IHtcbi8vIH1cblxuQG1lZGlhICN7JGxnLWFuZC11cH0ge1xuICAuY29sLWxlZnQgeyBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDM0MHB4KSB9XG4gIC5jYy12aWRlby1sZWZ0IHsgbWF4LXdpZHRoOiBjYWxjKDEwMCUgLSAzMjBweCkgfVxuICAuY2MtdmlkZW8tcmlnaHQgeyBmbGV4LWJhc2lzOiAzMjBweCAhaW1wb3J0YW50OyBtYXgtd2lkdGg6IDMyMHB4ICFpbXBvcnRhbnQ7IH1cbiAgYm9keS5pcy1hcnRpY2xlIC5jb2wtbGVmdCB7IHBhZGRpbmctcmlnaHQ6IDQwcHggfVxufVxuXG4uY29sLXJpZ2h0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcGFkZGluZy1sZWZ0OiAkY29udGFpbmVyLWd1dHRlci13aWR0aDtcbiAgcGFkZGluZy1yaWdodDogJGNvbnRhaW5lci1ndXR0ZXItd2lkdGg7XG4gIHdpZHRoOiAzMzBweDtcbn1cblxuLnJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgZmxleDogMCAxIGF1dG87XG4gIG1hcmdpbi1sZWZ0OiAtICRjb250YWluZXItZ3V0dGVyLXdpZHRoO1xuICBtYXJnaW4tcmlnaHQ6IC0gJGNvbnRhaW5lci1ndXR0ZXItd2lkdGg7XG5cbiAgLmNvbCB7XG4gICAgZmxleDogMCAwIGF1dG87XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBwYWRkaW5nLWxlZnQ6ICRjb250YWluZXItZ3V0dGVyLXdpZHRoO1xuICAgIHBhZGRpbmctcmlnaHQ6ICRjb250YWluZXItZ3V0dGVyLXdpZHRoO1xuXG4gICAgJGk6IDE7XG5cbiAgICBAd2hpbGUgJGkgPD0gJG51bS1jb2xzIHtcbiAgICAgICRwZXJjOiB1bnF1b3RlKCgxMDAgLyAoJG51bS1jb2xzIC8gJGkpKSArIFwiJVwiKTtcblxuICAgICAgJi5zI3skaX0ge1xuICAgICAgICBmbGV4LWJhc2lzOiAkcGVyYztcbiAgICAgICAgbWF4LXdpZHRoOiAkcGVyYztcbiAgICAgIH1cblxuICAgICAgJGk6ICRpICsgMTtcbiAgICB9XG5cbiAgICBAbWVkaWEgI3skbWQtYW5kLXVwfSB7XG5cbiAgICAgICRpOiAxO1xuXG4gICAgICBAd2hpbGUgJGkgPD0gJG51bS1jb2xzIHtcbiAgICAgICAgJHBlcmM6IHVucXVvdGUoKDEwMCAvICgkbnVtLWNvbHMgLyAkaSkpICsgXCIlXCIpO1xuXG4gICAgICAgICYubSN7JGl9IHtcbiAgICAgICAgICBmbGV4LWJhc2lzOiAkcGVyYztcbiAgICAgICAgICBtYXgtd2lkdGg6ICRwZXJjO1xuICAgICAgICB9XG5cbiAgICAgICAgJGk6ICRpICsgMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBAbWVkaWEgI3skbGctYW5kLXVwfSB7XG5cbiAgICAgICRpOiAxO1xuXG4gICAgICBAd2hpbGUgJGkgPD0gJG51bS1jb2xzIHtcbiAgICAgICAgJHBlcmM6IHVucXVvdGUoKDEwMCAvICgkbnVtLWNvbHMgLyAkaSkpICsgXCIlXCIpO1xuXG4gICAgICAgICYubCN7JGl9IHtcbiAgICAgICAgICBmbGV4LWJhc2lzOiAkcGVyYztcbiAgICAgICAgICBtYXgtd2lkdGg6ICRwZXJjO1xuICAgICAgICB9XG5cbiAgICAgICAgJGk6ICRpICsgMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8vIEhlYWRpbmdzXHJcblxyXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcclxuICBjb2xvcjogJGhlYWRpbmdzLWNvbG9yO1xyXG4gIGZvbnQtZmFtaWx5OiAkaGVhZGluZ3MtZm9udC1mYW1pbHk7XHJcbiAgZm9udC13ZWlnaHQ6ICRoZWFkaW5ncy1mb250LXdlaWdodDtcclxuICBsaW5lLWhlaWdodDogJGhlYWRpbmdzLWxpbmUtaGVpZ2h0O1xyXG4gIG1hcmdpbjogMDtcclxuXHJcbiAgYSB7XHJcbiAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xyXG4gIH1cclxufVxyXG5cclxuaDEgeyBmb250LXNpemU6ICRmb250LXNpemUtaDE7IH1cclxuaDIgeyBmb250LXNpemU6ICRmb250LXNpemUtaDI7IH1cclxuaDMgeyBmb250LXNpemU6ICRmb250LXNpemUtaDM7IH1cclxuaDQgeyBmb250LXNpemU6ICRmb250LXNpemUtaDQ7IH1cclxuaDUgeyBmb250LXNpemU6ICRmb250LXNpemUtaDU7IH1cclxuaDYgeyBmb250LXNpemU6ICRmb250LXNpemUtaDY7IH1cclxuXHJcbnAge1xyXG4gIG1hcmdpbjogMDtcclxufVxyXG4iLCIvLyBjb2xvclxuLnUtdGV4dENvbG9yTm9ybWFsIHtcbiAgLy8gY29sb3I6IHJnYmEoMCwgMCwgMCwgLjQ0KSAhaW1wb3J0YW50O1xuICAvLyBmaWxsOiByZ2JhKDAsIDAsIDAsIC40NCkgIWltcG9ydGFudDtcbiAgY29sb3I6IHJnYmEoMTUzLCAxNTMsIDE1MywgMSkgIWltcG9ydGFudDtcbiAgZmlsbDogcmdiYSgxNTMsIDE1MywgMTUzLCAxKSAhaW1wb3J0YW50O1xufVxuXG4udS10ZXh0Q29sb3JXaGl0ZSB7XG4gIGNvbG9yOiAjZmZmICFpbXBvcnRhbnQ7XG4gIGZpbGw6ICNmZmYgIWltcG9ydGFudDtcbn1cblxuLnUtaG92ZXJDb2xvck5vcm1hbDpob3ZlciB7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC42KTtcbiAgZmlsbDogcmdiYSgwLCAwLCAwLCAuNik7XG59XG5cbi51LWFjY2VudENvbG9yLS1pY29uTm9ybWFsIHtcbiAgY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xuICBmaWxsOiAkcHJpbWFyeS1jb2xvcjtcbn1cblxuLy8gIGJhY2tncm91bmQgY29sb3Jcbi51LWJnQ29sb3IgeyBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTsgfVxuXG4udS10ZXh0Q29sb3JEYXJrZXIgeyBAZXh0ZW5kICV1LXRleHQtY29sb3ItZGFya2VyOyB9XG5cbi8vIFBvc2l0aW9uc1xuLnUtcmVsYXRpdmUgeyBwb3NpdGlvbjogcmVsYXRpdmU7IH1cbi51LWFic29sdXRlIHsgcG9zaXRpb246IGFic29sdXRlOyB9XG4udS1hYnNvbHV0ZTAgeyBAZXh0ZW5kICV1LWFic29sdXRlMDsgfVxuLnUtZml4ZWQgeyBwb3NpdGlvbjogZml4ZWQgIWltcG9ydGFudDsgfVxuXG4udS1ibG9jayB7IGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQgfVxuLnUtaW5saW5lQmxvY2sgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgfVxuXG4vLyAgQmFja2dyb3VuZFxuLnUtYmFja2dyb3VuZERhcmsge1xuICAvLyBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDAsIDAsIDAsIC4zKSAyOSUsIHJnYmEoMCwgMCwgMCwgLjYpIDgxJSk7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwZDBmMTA7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgdG9wOiAwO1xuICB6LWluZGV4OiAxO1xufVxuXG4udS1iZ0dyYWRpZW50IHsgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgcmdiYSgwLCAwLCAwLCAuMykgMjklLCByZ2JhKDAsIDAsIDAsIC43KSA4MSUpIH1cblxuLnUtYmdCbGFjayB7IGJhY2tncm91bmQtY29sb3I6ICMwMDAgfVxuXG4udS1ncmFkaWVudCB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHRyYW5zcGFyZW50IDIwJSwgIzAwMCAxMDAlKTtcbiAgYm90dG9tOiAwO1xuICBoZWlnaHQ6IDkwJTtcbiAgbGVmdDogMDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgei1pbmRleDogMTtcbn1cblxuLy8gemluZGV4XG4uemluZGV4MSB7IHotaW5kZXg6IDEgfVxuLnppbmRleDIgeyB6LWluZGV4OiAyIH1cbi56aW5kZXgzIHsgei1pbmRleDogMyB9XG4uemluZGV4NCB7IHotaW5kZXg6IDQgfVxuXG4vLyAudS1iYWNrZ3JvdW5kLXdoaXRlIHsgYmFja2dyb3VuZC1jb2xvcjogI2VlZWZlZTsgfVxuLnUtYmFja2dyb3VuZFdoaXRlIHsgYmFja2dyb3VuZC1jb2xvcjogI2ZhZmFmYSB9XG4udS1iYWNrZ3JvdW5kQ29sb3JHcmF5TGlnaHQgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmMGYwICFpbXBvcnRhbnQ7IH1cblxuLy8gQ2xlYXJcbi51LWNsZWFyOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGRpc3BsYXk6IHRhYmxlO1xuICBjbGVhcjogYm90aDtcbn1cblxuLy8gZm9udCBzaXplXG4udS1mb250U2l6ZU1pY3JvIHsgZm9udC1zaXplOiAxMXB4IH1cbi51LWZvbnRTaXplU21hbGxlc3QgeyBmb250LXNpemU6IDEycHggfVxuLnUtZm9udFNpemUxMyB7IGZvbnQtc2l6ZTogMTNweCB9XG4udS1mb250U2l6ZVNtYWxsZXIgeyBmb250LXNpemU6IDE0cHggfVxuLnUtZm9udFNpemUxNSB7IGZvbnQtc2l6ZTogMTVweCB9XG4udS1mb250U2l6ZVNtYWxsIHsgZm9udC1zaXplOiAxNnB4IH1cbi51LWZvbnRTaXplQmFzZSB7IGZvbnQtc2l6ZTogMThweCB9XG4udS1mb250U2l6ZTIwIHsgZm9udC1zaXplOiAyMHB4IH1cbi51LWZvbnRTaXplMjEgeyBmb250LXNpemU6IDIxcHggfVxuLnUtZm9udFNpemUyMiB7IGZvbnQtc2l6ZTogMjJweCB9XG4udS1mb250U2l6ZUxhcmdlIHsgZm9udC1zaXplOiAyNHB4IH1cbi51LWZvbnRTaXplMjYgeyBmb250LXNpemU6IDI2cHggfVxuLnUtZm9udFNpemUyOCB7IGZvbnQtc2l6ZTogMjhweCB9XG4udS1mb250U2l6ZUxhcmdlciB7IGZvbnQtc2l6ZTogMzJweCB9XG4udS1mb250U2l6ZTM2IHsgZm9udC1zaXplOiAzNnB4IH1cbi51LWZvbnRTaXplNDAgeyBmb250LXNpemU6IDQwcHggfVxuLnUtZm9udFNpemVMYXJnZXN0IHsgZm9udC1zaXplOiA0NHB4IH1cbi51LWZvbnRTaXplSnVtYm8geyBmb250LXNpemU6IDUwcHggfVxuXG5AbWVkaWEgI3skbWQtYW5kLWRvd259IHtcbiAgLnUtbWQtZm9udFNpemVCYXNlIHsgZm9udC1zaXplOiAxOHB4IH1cbiAgLnUtbWQtZm9udFNpemUyMiB7IGZvbnQtc2l6ZTogMjJweCB9XG4gIC51LW1kLWZvbnRTaXplTGFyZ2VyIHsgZm9udC1zaXplOiAzMnB4IH1cbn1cblxuLy8gQG1lZGlhIChtYXgtd2lkdGg6IDc2N3B4KSB7XG4vLyAgIC51LXhzLWZvbnRTaXplQmFzZSB7Zm9udC1zaXplOiAxOHB4fVxuLy8gICAudS14cy1mb250U2l6ZTEzIHtmb250LXNpemU6IDEzcHh9XG4vLyAgIC51LXhzLWZvbnRTaXplU21hbGxlciB7Zm9udC1zaXplOiAxNHB4fVxuLy8gICAudS14cy1mb250U2l6ZVNtYWxsIHtmb250LXNpemU6IDE2cHh9XG4vLyAgIC51LXhzLWZvbnRTaXplMjIge2ZvbnQtc2l6ZTogMjJweH1cbi8vICAgLnUteHMtZm9udFNpemVMYXJnZSB7Zm9udC1zaXplOiAyNHB4fVxuLy8gICAudS14cy1mb250U2l6ZTQwIHtmb250LXNpemU6IDQwcHh9XG4vLyAgIC51LXhzLWZvbnRTaXplTGFyZ2VyIHtmb250LXNpemU6IDMycHh9XG4vLyAgIC51LXhzLWZvbnRTaXplU21hbGxlc3Qge2ZvbnQtc2l6ZTogMTJweH1cbi8vIH1cblxuLy8gZm9udCB3ZWlnaHRcbi51LWZvbnRXZWlnaHRUaGluIHsgZm9udC13ZWlnaHQ6IDMwMCB9XG4udS1mb250V2VpZ2h0Tm9ybWFsIHsgZm9udC13ZWlnaHQ6IDQwMCB9XG4udS1mb250V2VpZ2h0TWVkaXVtIHsgZm9udC13ZWlnaHQ6IDUwMCB9XG4udS1mb250V2VpZ2h0U2VtaWJvbGQgeyBmb250LXdlaWdodDogNjAwIH1cbi51LWZvbnRXZWlnaHRCb2xkIHsgZm9udC13ZWlnaHQ6IDcwMCB9XG5cbi51LXRleHRVcHBlcmNhc2UgeyB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlIH1cbi51LXRleHRDYXBpdGFsaXplIHsgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemUgfVxuLnUtdGV4dEFsaWduQ2VudGVyIHsgdGV4dC1hbGlnbjogY2VudGVyIH1cblxuLnUtdGV4dFNoYWRvdyB7IHRleHQtc2hhZG93OiAwIDAgMTBweCByZ2JhKDAsIDAsIDAsIDAuMzMpIH1cblxuLnUtbm9XcmFwV2l0aEVsbGlwc2lzIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcyAhaW1wb3J0YW50O1xuICB3aGl0ZS1zcGFjZTogbm93cmFwICFpbXBvcnRhbnQ7XG59XG5cbi8vIE1hcmdpblxuLnUtbWFyZ2luQXV0byB7IG1hcmdpbi1sZWZ0OiBhdXRvOyBtYXJnaW4tcmlnaHQ6IGF1dG87IH1cbi51LW1hcmdpblRvcDIwIHsgbWFyZ2luLXRvcDogMjBweCB9XG4udS1tYXJnaW5Ub3AzMCB7IG1hcmdpbi10b3A6IDMwcHggfVxuLnUtbWFyZ2luQm90dG9tMTAgeyBtYXJnaW4tYm90dG9tOiAxMHB4IH1cbi51LW1hcmdpbkJvdHRvbTE1IHsgbWFyZ2luLWJvdHRvbTogMTVweCB9XG4udS1tYXJnaW5Cb3R0b20yMCB7IG1hcmdpbi1ib3R0b206IDIwcHggIWltcG9ydGFudCB9XG4udS1tYXJnaW5Cb3R0b20zMCB7IG1hcmdpbi1ib3R0b206IDMwcHggfVxuLnUtbWFyZ2luQm90dG9tNDAgeyBtYXJnaW4tYm90dG9tOiA0MHB4IH1cblxuLy8gcGFkZGluZ1xuLnUtcGFkZGluZzAgeyBwYWRkaW5nOiAwICFpbXBvcnRhbnQgfVxuLnUtcGFkZGluZzIwIHsgcGFkZGluZzogMjBweCB9XG4udS1wYWRkaW5nMTUgeyBwYWRkaW5nOiAxNXB4ICFpbXBvcnRhbnQ7IH1cbi51LXBhZGRpbmdCb3R0b20yIHsgcGFkZGluZy1ib3R0b206IDJweDsgfVxuLnUtcGFkZGluZ0JvdHRvbTMwIHsgcGFkZGluZy1ib3R0b206IDMwcHg7IH1cbi51LXBhZGRpbmdCb3R0b20yMCB7IHBhZGRpbmctYm90dG9tOiAyMHB4IH1cbi51LXBhZGRpbmdSaWdodDEwIHsgcGFkZGluZy1yaWdodDogMTBweCB9XG4udS1wYWRkaW5nTGVmdDE1IHsgcGFkZGluZy1sZWZ0OiAxNXB4IH1cblxuLnUtcGFkZGluZ1RvcDIgeyBwYWRkaW5nLXRvcDogMnB4IH1cbi51LXBhZGRpbmdUb3A1IHsgcGFkZGluZy10b3A6IDVweDsgfVxuLnUtcGFkZGluZ1RvcDEwIHsgcGFkZGluZy10b3A6IDEwcHg7IH1cbi51LXBhZGRpbmdUb3AxNSB7IHBhZGRpbmctdG9wOiAxNXB4OyB9XG4udS1wYWRkaW5nVG9wMjAgeyBwYWRkaW5nLXRvcDogMjBweDsgfVxuLnUtcGFkZGluZ1RvcDMwIHsgcGFkZGluZy10b3A6IDMwcHg7IH1cblxuLnUtcGFkZGluZ0JvdHRvbTE1IHsgcGFkZGluZy1ib3R0b206IDE1cHg7IH1cblxuLnUtcGFkZGluZ1JpZ2h0MjAgeyBwYWRkaW5nLXJpZ2h0OiAyMHB4IH1cbi51LXBhZGRpbmdMZWZ0MjAgeyBwYWRkaW5nLWxlZnQ6IDIwcHggfVxuXG4udS1jb250ZW50VGl0bGUge1xuICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXdlaWdodDogNzAwO1xuICBsZXR0ZXItc3BhY2luZzogLS4wMjhlbTtcbn1cblxuLy8gbGluZS1oZWlnaHRcbi51LWxpbmVIZWlnaHQxIHsgbGluZS1oZWlnaHQ6IDE7IH1cbi51LWxpbmVIZWlnaHRUaWdodCB7IGxpbmUtaGVpZ2h0OiAxLjIgfVxuXG4vLyBvdmVyZmxvd1xuLnUtb3ZlcmZsb3dIaWRkZW4geyBvdmVyZmxvdzogaGlkZGVuIH1cblxuLy8gZmxvYXRcbi51LWZsb2F0UmlnaHQgeyBmbG9hdDogcmlnaHQ7IH1cbi51LWZsb2F0TGVmdCB7IGZsb2F0OiBsZWZ0OyB9XG5cbi8vICBmbGV4XG4udS1mbGV4IHsgZGlzcGxheTogZmxleDsgfVxuLnUtZmxleENlbnRlciB7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGRpc3BsYXk6IGZsZXg7IH1cbi51LWZsZXhDb250ZW50Q2VudGVyIHsganVzdGlmeS1jb250ZW50OiBjZW50ZXIgfVxuLy8gLnUtZmxleC0tMSB7IGZsZXg6IDEgfVxuLnUtZmxleDEgeyBmbGV4OiAxIDEgYXV0bzsgfVxuLnUtZmxleDAgeyBmbGV4OiAwIDAgYXV0bzsgfVxuLnUtZmxleFdyYXAgeyBmbGV4LXdyYXA6IHdyYXAgfVxuXG4udS1mbGV4Q29sdW1uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi51LWZsZXhFbmQge1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xufVxuXG4udS1mbGV4Q29sdW1uVG9wIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xufVxuXG4vLyBCYWNrZ3JvdW5kXG4udS1iZ0NvdmVyIHtcbiAgYmFja2dyb3VuZC1vcmlnaW46IGJvcmRlci1ib3g7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3Zlcjtcbn1cblxuLy8gbWF4IHdpZGh0XG4udS1jb250YWluZXIge1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICBwYWRkaW5nLWxlZnQ6IDE2cHg7XG4gIHBhZGRpbmctcmlnaHQ6IDE2cHg7XG59XG5cbi51LW1heFdpZHRoMTIwMCB7IG1heC13aWR0aDogMTIwMHB4IH1cbi51LW1heFdpZHRoMTAwMCB7IG1heC13aWR0aDogMTAwMHB4IH1cbi51LW1heFdpZHRoNzQwIHsgbWF4LXdpZHRoOiA3NDBweCB9XG4udS1tYXhXaWR0aDEwNDAgeyBtYXgtd2lkdGg6IDEwNDBweCB9XG4udS1zaXplRnVsbFdpZHRoIHsgd2lkdGg6IDEwMCUgfVxuLnUtc2l6ZUZ1bGxIZWlnaHQgeyBoZWlnaHQ6IDEwMCUgfVxuXG4vLyBib3JkZXJcbi51LWJvcmRlckxpZ2h0ZXIgeyBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIC4xNSk7IH1cbi51LXJvdW5kIHsgYm9yZGVyLXJhZGl1czogNTAlIH1cbi51LWJvcmRlclJhZGl1czIgeyBib3JkZXItcmFkaXVzOiAycHggfVxuXG4udS1ib3hTaGFkb3dCb3R0b20ge1xuICBib3gtc2hhZG93OiAwIDRweCAycHggLTJweCByZ2JhKDAsIDAsIDAsIC4wNSk7XG59XG5cbi8vIEhlaW5naHRcbi51LWhlaWdodDU0MCB7IGhlaWdodDogNTQwcHggfVxuLnUtaGVpZ2h0MjgwIHsgaGVpZ2h0OiAyODBweCB9XG4udS1oZWlnaHQyNjAgeyBoZWlnaHQ6IDI2MHB4IH1cbi51LWhlaWdodDEwMCB7IGhlaWdodDogMTAwcHggfVxuLnUtYm9yZGVyQmxhY2tMaWdodGVzdCB7IGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjEpIH1cblxuLy8gaGlkZSBnbG9iYWxcbi51LWhpZGUgeyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfVxuXG4vLyBjYXJkXG4udS1jYXJkIHtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuMDkpO1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIC8vIGJveC1zaGFkb3c6IDAgMXB4IDRweCByZ2JhKDAsIDAsIDAsIC4wNCk7XG4gIGJveC1zaGFkb3c6IDAgMXB4IDdweCByZ2JhKDAsIDAsIDAsIC4wNSk7XG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gIHBhZGRpbmc6IDEwcHggMjBweCAxNXB4O1xufVxuXG4vLyB0aXRsZSBMaW5lXG4udGl0bGUtbGluZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcblxuICAmOjpiZWZvcmUge1xuICAgIGNvbnRlbnQ6ICcnO1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjMpO1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICBib3R0b206IDUwJTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDFweDtcbiAgICB6LWluZGV4OiAwO1xuICB9XG59XG5cbi8vIE9iYmxpcXVlXG4udS1vYmxpcXVlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29tcG9zaXRlLWNvbG9yKTtcbiAgY29sb3I6ICNmZmY7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgZm9udC1zaXplOiAxNXB4O1xuICBmb250LXdlaWdodDogNTAwO1xuICBsZXR0ZXItc3BhY2luZzogMC4wM2VtO1xuICBsaW5lLWhlaWdodDogMTtcbiAgcGFkZGluZzogNXB4IDEzcHg7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIHRyYW5zZm9ybTogc2tld1goLTE1ZGVnKTtcbn1cblxuLm5vLWF2YXRhciB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vaW1hZ2VzL2F2YXRhci5wbmcnKSAhaW1wb3J0YW50XG59XG5cbkBtZWRpYSAjeyRtZC1hbmQtZG93bn0ge1xuICAudS1oaWRlLWJlZm9yZS1tZCB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9XG4gIC51LW1kLWhlaWdodEF1dG8geyBoZWlnaHQ6IGF1dG87IH1cbiAgLnUtbWQtaGVpZ2h0MTcwIHsgaGVpZ2h0OiAxNzBweCB9XG4gIC51LW1kLXJlbGF0aXZlIHsgcG9zaXRpb246IHJlbGF0aXZlIH1cbn1cblxuQG1lZGlhICN7JGxnLWFuZC1kb3dufSB7IC51LWhpZGUtYmVmb3JlLWxnIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH0gfVxuXG4vLyBoaWRlIGFmdGVyXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7IC51LWhpZGUtYWZ0ZXItbWQgeyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfSB9XG5cbkBtZWRpYSAjeyRsZy1hbmQtdXB9IHsgLnUtaGlkZS1hZnRlci1sZyB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9IH1cbiIsIi5idXR0b24ge1xyXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMCk7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuMTUpO1xyXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC40NCk7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xyXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgaGVpZ2h0OiAzN3B4O1xyXG4gIGxldHRlci1zcGFjaW5nOiAwO1xyXG4gIGxpbmUtaGVpZ2h0OiAzNXB4O1xyXG4gIHBhZGRpbmc6IDAgMTZweDtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICB0ZXh0LXJlbmRlcmluZzogb3B0aW1pemVMZWdpYmlsaXR5O1xyXG4gIHVzZXItc2VsZWN0OiBub25lO1xyXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuXHJcbiAgLy8gJi0tY2hyb21lbGVzcyB7XHJcbiAgLy8gICBib3JkZXItcmFkaXVzOiAwO1xyXG4gIC8vICAgYm9yZGVyLXdpZHRoOiAwO1xyXG4gIC8vICAgYm94LXNoYWRvdzogbm9uZTtcclxuICAvLyAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC40NCk7XHJcbiAgLy8gICBoZWlnaHQ6IGF1dG87XHJcbiAgLy8gICBsaW5lLWhlaWdodDogaW5oZXJpdDtcclxuICAvLyAgIHBhZGRpbmc6IDA7XHJcbiAgLy8gICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gIC8vICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xyXG4gIC8vICAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcclxuXHJcbiAgLy8gICAmOmFjdGl2ZSxcclxuICAvLyAgICY6aG92ZXIsXHJcbiAgLy8gICAmOmZvY3VzIHtcclxuICAvLyAgICAgYm9yZGVyLXdpZHRoOiAwO1xyXG4gIC8vICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNik7XHJcbiAgLy8gICB9XHJcbiAgLy8gfVxyXG5cclxuICAmLS1sYXJnZSB7XHJcbiAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICBoZWlnaHQ6IDQ0cHg7XHJcbiAgICBsaW5lLWhlaWdodDogNDJweDtcclxuICAgIHBhZGRpbmc6IDAgMThweDtcclxuICB9XHJcblxyXG4gICYtLWRhcmsge1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuODQpO1xyXG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC44NCk7XHJcbiAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuOTcpO1xyXG5cclxuICAgICY6aG92ZXIge1xyXG4gICAgICBiYWNrZ3JvdW5kOiAkcHJpbWFyeS1jb2xvcjtcclxuICAgICAgYm9yZGVyLWNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIFByaW1hcnlcclxuLmJ1dHRvbi0tcHJpbWFyeSB7XHJcbiAgYm9yZGVyLWNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcclxuICBjb2xvcjogJHByaW1hcnktY29sb3I7XHJcbn1cclxuXHJcbi8vIC5idXR0b24tLWxhcmdlLmJ1dHRvbi0tY2hyb21lbGVzcyxcclxuLy8gLmJ1dHRvbi0tbGFyZ2UuYnV0dG9uLS1saW5rIHtcclxuLy8gICBwYWRkaW5nOiAwO1xyXG4vLyB9XHJcblxyXG4vLyAuYnV0dG9uU2V0IHtcclxuLy8gICA+IC5idXR0b24ge1xyXG4vLyAgICAgbWFyZ2luLXJpZ2h0OiA4cHg7XHJcbi8vICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG4vLyAgIH1cclxuXHJcbi8vICAgPiAuYnV0dG9uOmxhc3QtY2hpbGQge1xyXG4vLyAgICAgbWFyZ2luLXJpZ2h0OiAwO1xyXG4vLyAgIH1cclxuXHJcbi8vICAgLmJ1dHRvbi0tY2hyb21lbGVzcyB7XHJcbi8vICAgICBoZWlnaHQ6IDM3cHg7XHJcbi8vICAgICBsaW5lLWhlaWdodDogMzVweDtcclxuLy8gICB9XHJcblxyXG4vLyAgIC5idXR0b24tLWxhcmdlLmJ1dHRvbi0tY2hyb21lbGVzcyxcclxuLy8gICAuYnV0dG9uLS1sYXJnZS5idXR0b24tLWxpbmsge1xyXG4vLyAgICAgaGVpZ2h0OiA0NHB4O1xyXG4vLyAgICAgbGluZS1oZWlnaHQ6IDQycHg7XHJcbi8vICAgfVxyXG5cclxuLy8gICAmID4gLmJ1dHRvbi0tY2hyb21lbGVzczpub3QoLmJ1dHRvbi0tY2lyY2xlKSB7XHJcbi8vICAgICBtYXJnaW4tcmlnaHQ6IDA7XHJcbi8vICAgICBwYWRkaW5nLXJpZ2h0OiA4cHg7XHJcbi8vICAgfVxyXG5cclxuLy8gICAmID4gLmJ1dHRvbi0tY2hyb21lbGVzczpsYXN0LWNoaWxkIHtcclxuLy8gICAgIHBhZGRpbmctcmlnaHQ6IDA7XHJcbi8vICAgfVxyXG5cclxuLy8gICAmID4gLmJ1dHRvbi0tY2hyb21lbGVzcyArIC5idXR0b24tLWNocm9tZWxlc3M6bm90KC5idXR0b24tLWNpcmNsZSkge1xyXG4vLyAgICAgbWFyZ2luLWxlZnQ6IDA7XHJcbi8vICAgICBwYWRkaW5nLWxlZnQ6IDhweDtcclxuLy8gICB9XHJcbi8vIH1cclxuXHJcbi5idXR0b24tLWNpcmNsZSB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICBjb2xvcjogI2ZmZjtcclxuICBoZWlnaHQ6IDQwcHg7XHJcbiAgbGluZS1oZWlnaHQ6IDM4cHg7XHJcbiAgcGFkZGluZzogMDtcclxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgd2lkdGg6IDQwcHg7XHJcbn1cclxuXHJcbi8vIEJ0biBmb3IgdGFnIGNsb3VkIG9yIGNhdGVnb3J5XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi50YWctYnV0dG9uIHtcclxuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC4wNSk7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC42OCk7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICBtYXJnaW46IDAgOHB4IDhweCAwO1xyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgLjEpO1xyXG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjY4KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGJ1dHRvbiBkYXJrIGxpbmVcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLmJ1dHRvbi0tZGFyay1saW5lIHtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjMDAwO1xyXG4gIGNvbG9yOiAjMDAwO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgbWFyZ2luOiA1MHB4IGF1dG8gMDtcclxuICBtYXgtd2lkdGg6IDMwMHB4O1xyXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgdHJhbnNpdGlvbjogY29sb3IgLjNzIGVhc2UsIGJveC1zaGFkb3cgLjNzIGN1YmljLWJlemllciguNDU1LCAuMDMsIC41MTUsIC45NTUpO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAtNTBweCA4cHggLTRweCAjMDAwO1xyXG4gIH1cclxufVxyXG4iLCIvLyBzdHlsZWxpbnQtZGlzYWJsZVxyXG5AZm9udC1mYWNlIHtcclxuICBmb250LWZhbWlseTogJ21hcGFjaGUnO1xyXG4gIHNyYzogIHVybCgnLi4vZm9udHMvbWFwYWNoZS5lb3Q/MjU3NjRqJyk7XHJcbiAgc3JjOiAgdXJsKCcuLi9mb250cy9tYXBhY2hlLmVvdD8yNTc2NGojaWVmaXgnKSBmb3JtYXQoJ2VtYmVkZGVkLW9wZW50eXBlJyksXHJcbiAgICB1cmwoJy4uL2ZvbnRzL21hcGFjaGUudHRmPzI1NzY0aicpIGZvcm1hdCgndHJ1ZXR5cGUnKSxcclxuICAgIHVybCgnLi4vZm9udHMvbWFwYWNoZS53b2ZmPzI1NzY0aicpIGZvcm1hdCgnd29mZicpLFxyXG4gICAgdXJsKCcuLi9mb250cy9tYXBhY2hlLnN2Zz8yNTc2NGojbWFwYWNoZScpIGZvcm1hdCgnc3ZnJyk7XHJcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcclxuICBmb250LXN0eWxlOiBub3JtYWw7XHJcbn1cclxuXHJcbltjbGFzc149XCJpLVwiXTo6YmVmb3JlLCBbY2xhc3MqPVwiIGktXCJdOjpiZWZvcmUge1xyXG4gIEBleHRlbmQgJWZvbnRzLWljb25zO1xyXG59XHJcblxyXG4uaS10YWc6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkxMVwiO1xyXG59XHJcbi5pLWRpc2NvcmQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwYVwiO1xyXG59XHJcbi5pLWFycm93LXJvdW5kLW5leHQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwY1wiO1xyXG59XHJcbi5pLWFycm93LXJvdW5kLXByZXY6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwZFwiO1xyXG59XHJcbi5pLWFycm93LXJvdW5kLXVwOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MGVcIjtcclxufVxyXG4uaS1hcnJvdy1yb3VuZC1kb3duOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MGZcIjtcclxufVxyXG4uaS1waG90bzpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTBiXCI7XHJcbn1cclxuLmktc2VuZDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTA5XCI7XHJcbn1cclxuLmktYXVkaW86YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwMVwiO1xyXG59XHJcbi5pLXJvY2tldDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTAyXCI7XHJcbiAgY29sb3I6ICM5OTk7XHJcbn1cclxuLmktY29tbWVudHMtbGluZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTAwXCI7XHJcbn1cclxuLmktZ2xvYmU6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwNlwiO1xyXG59XHJcbi5pLXN0YXI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwN1wiO1xyXG59XHJcbi5pLWxpbms6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwOFwiO1xyXG59XHJcbi5pLXN0YXItbGluZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTAzXCI7XHJcbn1cclxuLmktbW9yZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTA0XCI7XHJcbn1cclxuLmktc2VhcmNoOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MDVcIjtcclxufVxyXG4uaS1jaGF0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MTBcIjtcclxufVxyXG4uaS1hcnJvdy1sZWZ0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUzMTRcIjtcclxufVxyXG4uaS1hcnJvdy1yaWdodDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMzE1XCI7XHJcbn1cclxuLmktcGxheTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMDM3XCI7XHJcbn1cclxuLmktbG9jYXRpb246YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZThiNFwiO1xyXG59XHJcbi5pLWNoZWNrLWNpcmNsZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlODZjXCI7XHJcbn1cclxuLmktY2xvc2U6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTVjZFwiO1xyXG59XHJcbi5pLWZhdm9yaXRlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4N2RcIjtcclxufVxyXG4uaS13YXJuaW5nOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUwMDJcIjtcclxufVxyXG4uaS1yc3M6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTBlNVwiO1xyXG59XHJcbi5pLXNoYXJlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4MGRcIjtcclxufVxyXG4uaS1lbWFpbDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMGUwXCI7XHJcbn1cclxuLmktZ29vZ2xlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYTBcIjtcclxufVxyXG4uaS10ZWxlZ3JhbTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMmM2XCI7XHJcbn1cclxuLmktcmVkZGl0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYyODFcIjtcclxufVxyXG4uaS10d2l0dGVyOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYwOTlcIjtcclxufVxyXG4uaS1naXRodWI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjA5YlwiO1xyXG59XHJcbi5pLWxpbmtlZGluOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYwZTFcIjtcclxufVxyXG4uaS15b3V0dWJlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxNmFcIjtcclxufVxyXG4uaS1zdGFjay1vdmVyZmxvdzpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMTZjXCI7XHJcbn1cclxuLmktaW5zdGFncmFtOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxNmRcIjtcclxufVxyXG4uaS1mbGlja3I6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjE2ZVwiO1xyXG59XHJcbi5pLWRyaWJiYmxlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxN2RcIjtcclxufVxyXG4uaS1iZWhhbmNlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYjRcIjtcclxufVxyXG4uaS1zcG90aWZ5OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYmNcIjtcclxufVxyXG4uaS1jb2RlcGVuOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxY2JcIjtcclxufVxyXG4uaS1mYWNlYm9vazpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMjMwXCI7XHJcbn1cclxuLmktcGludGVyZXN0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYyMzFcIjtcclxufVxyXG4uaS13aGF0c2FwcDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMjMyXCI7XHJcbn1cclxuLmktc25hcGNoYXQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjJhY1wiO1xyXG59XHJcbiIsIi8vIGFuaW1hdGVkIEdsb2JhbFxyXG4uYW5pbWF0ZWQge1xyXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXM7XHJcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcclxuXHJcbiAgJi5pbmZpbml0ZSB7XHJcbiAgICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGFuaW1hdGVkIEFsbFxyXG4uYm91bmNlSW4geyBhbmltYXRpb24tbmFtZTogYm91bmNlSW47IH1cclxuLmJvdW5jZUluRG93biB7IGFuaW1hdGlvbi1uYW1lOiBib3VuY2VJbkRvd247IH1cclxuLnB1bHNlIHsgYW5pbWF0aW9uLW5hbWU6IHB1bHNlOyB9XHJcbi5zbGlkZUluVXAgeyBhbmltYXRpb24tbmFtZTogc2xpZGVJblVwIH1cclxuLnNsaWRlT3V0RG93biB7IGFuaW1hdGlvbi1uYW1lOiBzbGlkZU91dERvd24gfVxyXG5cclxuLy8gYWxsIGtleWZyYW1lcyBBbmltYXRlc1xyXG4vLyBib3VuY2VJblxyXG5Aa2V5ZnJhbWVzIGJvdW5jZUluIHtcclxuICAwJSxcclxuICAyMCUsXHJcbiAgNDAlLFxyXG4gIDYwJSxcclxuICA4MCUsXHJcbiAgMTAwJSB7IGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllciguMjE1LCAuNjEsIC4zNTUsIDEpOyB9XHJcbiAgMCUgeyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHNjYWxlM2QoLjMsIC4zLCAuMyk7IH1cclxuICAyMCUgeyB0cmFuc2Zvcm06IHNjYWxlM2QoMS4xLCAxLjEsIDEuMSk7IH1cclxuICA0MCUgeyB0cmFuc2Zvcm06IHNjYWxlM2QoLjksIC45LCAuOSk7IH1cclxuICA2MCUgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHNjYWxlM2QoMS4wMywgMS4wMywgMS4wMyk7IH1cclxuICA4MCUgeyB0cmFuc2Zvcm06IHNjYWxlM2QoLjk3LCAuOTcsIC45Nyk7IH1cclxuICAxMDAlIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiBzY2FsZTNkKDEsIDEsIDEpOyB9XHJcbn1cclxuXHJcbi8vIGJvdW5jZUluRG93blxyXG5Aa2V5ZnJhbWVzIGJvdW5jZUluRG93biB7XHJcbiAgMCUsXHJcbiAgNjAlLFxyXG4gIDc1JSxcclxuICA5MCUsXHJcbiAgMTAwJSB7IGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigyMTUsIDYxMCwgMzU1LCAxKTsgfVxyXG4gIDAlIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMzAwMHB4LCAwKTsgfVxyXG4gIDYwJSB7IG9wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMjVweCwgMCk7IH1cclxuICA3NSUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIC0xMHB4LCAwKTsgfVxyXG4gIDkwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgNXB4LCAwKTsgfVxyXG4gIDEwMCUgeyB0cmFuc2Zvcm06IG5vbmU7IH1cclxufVxyXG5cclxuQGtleWZyYW1lcyBwdWxzZSB7XHJcbiAgZnJvbSB7IHRyYW5zZm9ybTogc2NhbGUzZCgxLCAxLCAxKTsgfVxyXG4gIDUwJSB7IHRyYW5zZm9ybTogc2NhbGUzZCgxLjIsIDEuMiwgMS4yKTsgfVxyXG4gIHRvIHsgdHJhbnNmb3JtOiBzY2FsZTNkKDEsIDEsIDEpOyB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2Nyb2xsIHtcclxuICAwJSB7IG9wYWNpdHk6IDA7IH1cclxuICAxMCUgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgfVxyXG4gIDEwMCUgeyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTBweCk7IH1cclxufVxyXG5cclxuQGtleWZyYW1lcyBvcGFjaXR5IHtcclxuICAwJSB7IG9wYWNpdHk6IDA7IH1cclxuICA1MCUgeyBvcGFjaXR5OiAwOyB9XHJcbiAgMTAwJSB7IG9wYWNpdHk6IDE7IH1cclxufVxyXG5cclxuLy8gIHNwaW4gZm9yIHBhZ2luYXRpb25cclxuQGtleWZyYW1lcyBzcGluIHtcclxuICBmcm9tIHsgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7IH1cclxuICB0byB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH1cclxufVxyXG5cclxuQGtleWZyYW1lcyB0b29sdGlwIHtcclxuICAwJSB7IG9wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDZweCk7IH1cclxuICAxMDAlIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgMCk7IH1cclxufVxyXG5cclxuQGtleWZyYW1lcyBsb2FkaW5nLWJhciB7XHJcbiAgMCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTEwMCUpIH1cclxuICA0MCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCkgfVxyXG4gIDYwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKSB9XHJcbiAgMTAwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKSB9XHJcbn1cclxuXHJcbi8vIEFycm93IG1vdmUgbGVmdFxyXG5Aa2V5ZnJhbWVzIGFycm93LW1vdmUtcmlnaHQge1xyXG4gIDAlIHsgb3BhY2l0eTogMCB9XHJcbiAgMTAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xMDAlKTsgb3BhY2l0eTogMCB9XHJcbiAgMTAwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTsgb3BhY2l0eTogMSB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgYXJyb3ctbW92ZS1sZWZ0IHtcclxuICAwJSB7IG9wYWNpdHk6IDAgfVxyXG4gIDEwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTsgb3BhY2l0eTogMCB9XHJcbiAgMTAwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTsgb3BhY2l0eTogMSB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2xpZGVJblVwIHtcclxuICBmcm9tIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMTAwJSwgMCk7XHJcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xyXG4gIH1cclxuXHJcbiAgdG8ge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcclxuICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2xpZGVPdXREb3duIHtcclxuICBmcm9tIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7XHJcbiAgfVxyXG5cclxuICB0byB7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDIwJSwgMCk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIEhlYWRlclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLmhlYWRlci1sb2dvLFxuLm1lbnUtLXRvZ2dsZSxcbi5zZWFyY2gtdG9nZ2xlIHtcbiAgei1pbmRleDogMTU7XG59XG5cbi5oZWFkZXIge1xuICBib3gtc2hhZG93OiAwIDFweCAxNnB4IDAgcmdiYSgwLCAwLCAwLCAwLjMpO1xuICBwYWRkaW5nOiAwIDE2cHg7XG4gIHBvc2l0aW9uOiBzdGlja3k7XG4gIHRvcDogMDtcbiAgdHJhbnNpdGlvbjogYWxsIC4zcyBlYXNlLWluLW91dDtcbiAgei1pbmRleDogMTA7XG5cbiAgJi13cmFwIHsgaGVpZ2h0OiAkaGVhZGVyLWhlaWdodDsgfVxuXG4gICYtbG9nbyB7XG4gICAgY29sb3I6ICNmZmYgIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6IDMwcHg7XG5cbiAgICBpbWcgeyBtYXgtaGVpZ2h0OiAxMDAlOyB9XG4gIH1cbn1cblxuLy8gbm90IGhhdmUgbG9nb1xuLy8gLm5vdC1sb2dvIC5oZWFkZXItbG9nbyB7IGhlaWdodDogYXV0byAhaW1wb3J0YW50IH1cblxuLy8gSGVhZGVyIGxpbmUgc2VwYXJhdGVcbi5oZWFkZXItbGluZSB7XG4gIGhlaWdodDogJGhlYWRlci1oZWlnaHQ7XG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgLjMpO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIG1hcmdpbi1yaWdodDogMTBweDtcbn1cblxuLy8gSGVhZGVyIEZvbGxvdyBNb3JlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmZvbGxvdy1tb3JlIHtcbiAgdHJhbnNpdGlvbjogd2lkdGggLjRzIGVhc2U7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAwO1xufVxuXG5ib2R5LmlzLXNob3dGb2xsb3dNb3JlIHtcbiAgLmZvbGxvdy1tb3JlIHsgd2lkdGg6IGF1dG8gfVxuICAuZm9sbG93LXRvZ2dsZSB7IGNvbG9yOiB2YXIoLS1oZWFkZXItY29sb3ItaG92ZXIpIH1cbiAgLmZvbGxvdy10b2dnbGU6OmJlZm9yZSB7IGNvbnRlbnQ6IFwiXFxlNWNkXCIgfVxufVxuXG4vLyBIZWFkZXIgbWVudVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLm5hdiB7XG4gIHBhZGRpbmctdG9wOiA4cHg7XG4gIHBhZGRpbmctYm90dG9tOiA4cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICB1bCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB9XG59XG5cbi5oZWFkZXItbGVmdCBhLFxuLm5hdiB1bCBsaSBhIHtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBjb2xvcjogdmFyKC0taGVhZGVyLWNvbG9yKTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LXdlaWdodDogNDAwO1xuICBsaW5lLWhlaWdodDogMzBweDtcbiAgcGFkZGluZzogMCA4cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcblxuICAmLmFjdGl2ZSxcbiAgJjpob3ZlciB7XG4gICAgY29sb3I6IHZhcigtLWhlYWRlci1jb2xvci1ob3Zlcik7XG4gIH1cbn1cblxuLy8gYnV0dG9uLW5hdlxuLm1lbnUtLXRvZ2dsZSB7XG4gIGhlaWdodDogNDhweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjRzO1xuICB3aWR0aDogNDhweDtcblxuICBzcGFuIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oZWFkZXItY29sb3IpO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGhlaWdodDogMnB4O1xuICAgIGxlZnQ6IDE0cHg7XG4gICAgbWFyZ2luLXRvcDogLTFweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiA1MCU7XG4gICAgdHJhbnNpdGlvbjogLjRzO1xuICAgIHdpZHRoOiAyMHB4O1xuXG4gICAgJjpmaXJzdC1jaGlsZCB7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIC02cHgpOyB9XG4gICAgJjpsYXN0LWNoaWxkIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgNnB4KTsgfVxuICB9XG59XG5cbi8vIEhlYWRlciBtZW51XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5AbWVkaWEgI3skbGctYW5kLWRvd259IHtcbiAgLmhlYWRlci1sZWZ0IHsgZmxleC1ncm93OiAxICFpbXBvcnRhbnQ7IH1cbiAgLmhlYWRlci1sb2dvIHNwYW4geyBmb250LXNpemU6IDI0cHggfVxuXG4gIC8vIHNob3cgbWVudSBtb2JpbGVcbiAgYm9keS5pcy1zaG93TmF2TW9iIHtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgLnNpZGVOYXYgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7IH1cblxuICAgIC5tZW51LS10b2dnbGUge1xuICAgICAgYm9yZGVyOiAwO1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xuXG4gICAgICBzcGFuOmZpcnN0LWNoaWxkIHsgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpIHRyYW5zbGF0ZSgwLCAwKTsgfVxuICAgICAgc3BhbjpudGgtY2hpbGQoMikgeyB0cmFuc2Zvcm06IHNjYWxlWCgwKTsgfVxuICAgICAgc3BhbjpsYXN0LWNoaWxkIHsgdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKSB0cmFuc2xhdGUoMCwgMCk7IH1cbiAgICB9XG5cbiAgICAubWFpbiwgLmZvb3RlciB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMjUlKSAhaW1wb3J0YW50IH1cbiAgfVxufVxuIiwiLy8gRm9vdGVyXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4uZm9vdGVyIHtcclxuICBjb2xvcjogIzg4ODtcclxuXHJcbiAgYSB7XHJcbiAgICBjb2xvcjogdmFyKC0tZm9vdGVyLWNvbG9yLWxpbmspO1xyXG4gICAgJjpob3ZlciB7IGNvbG9yOiAjZmZmIH1cclxuICB9XHJcblxyXG4gICYtbGlua3Mge1xyXG4gICAgcGFkZGluZzogM2VtIDAgMi41ZW07XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTMxMzEzO1xyXG4gIH1cclxuXHJcbiAgLmZvbGxvdyA+IGEge1xyXG4gICAgYmFja2dyb3VuZDogIzMzMztcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgaGVpZ2h0OiA0MHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDQwcHg7XHJcbiAgICBtYXJnaW46IDAgNXB4IDhweDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHdpZHRoOiA0MHB4O1xyXG5cclxuICAgICY6aG92ZXIge1xyXG4gICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMnB4ICMzMzM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLWNvcHkge1xyXG4gICAgcGFkZGluZzogM2VtIDA7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xyXG4gIH1cclxufVxyXG5cclxuLmZvb3Rlci1tZW51IHtcclxuICBsaSB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBsaW5lLWhlaWdodDogMjRweDtcclxuICAgIG1hcmdpbjogMCA4cHg7XHJcblxyXG4gICAgLyogc3R5bGVsaW50LWRpc2FibGUtbmV4dC1saW5lICovXHJcbiAgICBhIHsgY29sb3I6ICM4ODggfVxyXG4gIH1cclxufVxyXG4iLCIvLyBIb21lIFBhZ2UgLSBTdG9yeSBDb3ZlclxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4uaG1Db3ZlciB7XHJcbiAgcGFkZGluZzogNHB4O1xyXG5cclxuICAuc3QtY292ZXIge1xyXG4gICAgcGFkZGluZzogNHB4O1xyXG5cclxuICAgICYuZmlydHMge1xyXG4gICAgICBoZWlnaHQ6IDUwMHB4O1xyXG4gICAgICAuc3QtY292ZXItdGl0bGUgeyBmb250LXNpemU6IDJyZW0gfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gSG9tZSBQYWdlIFBlcnNvbmFsIENvdmVyIHBhZ2VcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLmhtLWNvdmVyIHtcclxuICBwYWRkaW5nOiAzMHB4IDA7XHJcbiAgbWluLWhlaWdodDogMTAwdmg7XHJcblxyXG4gICYtdGl0bGUge1xyXG4gICAgZm9udC1zaXplOiAyLjVyZW07XHJcbiAgICBmb250LXdlaWdodDogOTAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgfVxyXG5cclxuICAmLWRlcyB7XHJcbiAgICBtYXgtd2lkdGg6IDYwMHB4O1xyXG4gICAgZm9udC1zaXplOiAxLjI1cmVtO1xyXG4gIH1cclxufVxyXG5cclxuLmhtLXN1YnNjcmliZSB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xyXG4gIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDJweCBoc2xhKDAsIDAlLCAxMDAlLCAuNSk7XHJcbiAgY29sb3I6ICNmZmY7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgbGluZS1oZWlnaHQ6IDEuMjtcclxuICBtYXJnaW4tdG9wOiA1MHB4O1xyXG4gIG1heC13aWR0aDogMzAwcHg7XHJcbiAgcGFkZGluZzogMTVweCAxMHB4O1xyXG4gIHRyYW5zaXRpb246IGFsbCAuM3M7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICY6aG92ZXIge1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMnB4ICNmZmY7XHJcbiAgfVxyXG59XHJcblxyXG4uaG0tZG93biB7XHJcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxLjJzICFpbXBvcnRhbnQ7XHJcbiAgYm90dG9tOiA2MHB4O1xyXG4gIGNvbG9yOiBoc2xhKDAsIDAlLCAxMDAlLCAuNSk7XHJcbiAgbGVmdDogMDtcclxuICBtYXJnaW46IDAgYXV0bztcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgcmlnaHQ6IDA7XHJcbiAgd2lkdGg6IDcwcHg7XHJcbiAgei1pbmRleDogMTAwO1xyXG5cclxuICBzdmcge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBmaWxsOiBjdXJyZW50Y29sb3I7XHJcbiAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICB9XHJcbn1cclxuXHJcbi8vIE1lZGlhIFF1ZXJ5XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbkBtZWRpYSAjeyRsZy1hbmQtdXB9IHtcclxuICAvLyBIb21lIFN0b3J5LWNvdmVyXHJcbiAgLmhtQ292ZXIge1xyXG4gICAgaGVpZ2h0OiA3MHZoO1xyXG5cclxuICAgIC5zdC1jb3ZlciB7XHJcbiAgICAgIGhlaWdodDogNTAlO1xyXG4gICAgICB3aWR0aDogMzMuMzMzMzMlO1xyXG5cclxuICAgICAgJi5maXJ0cyB7XHJcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgIHdpZHRoOiA2Ni42NjY2NiU7XHJcbiAgICAgICAgLnN0LWNvdmVyLXRpdGxlIHsgZm9udC1zaXplOiAyLjhyZW0gfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBIb21lIHBhZ2VcclxuICAuaG0tY292ZXItdGl0bGUgeyBmb250LXNpemU6IDMuNXJlbSB9XHJcbn1cclxuIiwiLy8gcG9zdCBjb250ZW50XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4ucG9zdCB7XG4gIC8vIHRpdGxlXG4gICYtdGl0bGUge1xuICAgIGNvbG9yOiAjMDAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjI7XG4gICAgbWF4LXdpZHRoOiAxMDAwcHg7XG4gIH1cblxuICAmLWV4Y2VycHQge1xuICAgIGNvbG9yOiAjNTU1O1xuICAgIGZvbnQtZmFtaWx5OiAkc2VjdW5kYXJ5LWZvbnQ7XG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcbiAgICBsZXR0ZXItc3BhY2luZzogLS4wMTJlbTtcbiAgICBsaW5lLWhlaWdodDogMS42O1xuICB9XG5cbiAgLy8gYXV0aG9yXG4gICYtYXV0aG9yLXNvY2lhbCB7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICBtYXJnaW4tbGVmdDogMnB4O1xuICAgIHBhZGRpbmc6IDAgM3B4O1xuICB9XG5cbiAgJi1pbWFnZSB7IG1hcmdpbi10b3A6IDMwcHggfVxuXG4gIC8vICYtYm9keS13cmFwIHsgbWF4LXdpZHRoOiA3MDBweCB9XG59XG5cbi8vIEF2YXRhclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi5hdmF0YXItaW1hZ2Uge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG5cbiAgQGV4dGVuZCAudS1yb3VuZDtcblxuICAmLS1zbWFsbGVyIHtcbiAgICB3aWR0aDogNTBweDtcbiAgICBoZWlnaHQ6IDUwcHg7XG4gIH1cbn1cblxuLy8gcG9zdCBjb250ZW50IElubmVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLnBvc3QtaW5uZXIge1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBmb250LWZhbWlseTogJHNlY3VuZGFyeS1mb250O1xuXG4gIGEge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMCwgMCwgMCwgLjY4KSA1MCUsIHJnYmEoMCwgMCwgMCwgMCkgNTAlKTtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwIDEuMTJlbTtcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogcmVwZWF0LXg7XG4gICAgYmFja2dyb3VuZC1zaXplOiAycHggLjJlbTtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgd29yZC1icmVhazogYnJlYWstd29yZDtcblxuICAgICY6aG92ZXIgeyBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDAsIDAsIDAsIDEpIDUwJSwgcmdiYSgwLCAwLCAwLCAwKSA1MCUpOyB9XG4gIH1cblxuICBpbWcge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICAgIG1hcmdpbi1yaWdodDogYXV0bztcbiAgfVxuXG4gIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xuICAgIG1hcmdpbi10b3A6IDMwcHg7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGNvbG9yOiAjMDAwO1xuICAgIGxldHRlci1zcGFjaW5nOiAtLjAyZW07XG4gICAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgfVxuXG4gIGgyIHsgbWFyZ2luLXRvcDogMzVweCB9XG5cbiAgcCB7XG4gICAgZm9udC1zaXplOiAxLjEyNXJlbTtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICAgIGxldHRlci1zcGFjaW5nOiAtLjAwM2VtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjc7XG4gICAgbWFyZ2luLXRvcDogMjVweDtcbiAgfVxuXG4gIHVsLFxuICBvbCB7XG4gICAgY291bnRlci1yZXNldDogcG9zdDtcbiAgICBmb250LXNpemU6IDEuMTI1cmVtO1xuICAgIG1hcmdpbi10b3A6IDIwcHg7XG5cbiAgICBsaSB7XG4gICAgICBsZXR0ZXItc3BhY2luZzogLS4wMDNlbTtcbiAgICAgIG1hcmdpbi1ib3R0b206IDE0cHg7XG4gICAgICBtYXJnaW4tbGVmdDogMzBweDtcblxuICAgICAgJjo6YmVmb3JlIHtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICBtYXJnaW4tbGVmdDogLTc4cHg7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgICAgIHdpZHRoOiA3OHB4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVsIGxpOjpiZWZvcmUge1xuICAgIGNvbnRlbnQ6ICdcXDIwMjInO1xuICAgIGZvbnQtc2l6ZTogMTYuOHB4O1xuICAgIHBhZGRpbmctcmlnaHQ6IDE1cHg7XG4gICAgcGFkZGluZy10b3A6IDNweDtcbiAgfVxuXG4gIG9sIGxpOjpiZWZvcmUge1xuICAgIGNvbnRlbnQ6IGNvdW50ZXIocG9zdCkgXCIuXCI7XG4gICAgY291bnRlci1pbmNyZW1lbnQ6IHBvc3Q7XG4gICAgcGFkZGluZy1yaWdodDogMTJweDtcbiAgfVxuXG4gIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIHAsXG4gIG9sLCB1bCwgaHIsIHByZSwgZGwsIGJsb2NrcXVvdGUsIHRhYmxlLCAua2ctZW1iZWQtY2FyZCB7XG4gICAgbWluLXdpZHRoOiAxMDAlO1xuICB9XG5cbiAgJiA+IHVsLFxuICAmID4gaWZyYW1lLFxuICAmID4gaW1nLFxuICAua2ctaW1hZ2UtY2FyZCxcbiAgLmtnLWNhcmQsXG4gIC5rZy1nYWxsZXJ5LWNhcmQsXG4gIC5rZy1lbWJlZC1jYXJkIHtcbiAgICBtYXJnaW4tdG9wOiAzMHB4ICFpbXBvcnRhbnRcbiAgfVxufVxuXG4vLyBTaGFyZSBQb3N0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLnNoYXJlUG9zdCB7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiA0MHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGUgIWltcG9ydGFudDtcbiAgdHJhbnNpdGlvbjogYWxsIC40cztcbiAgdG9wOiAzMHB4O1xuXG4gIC8qIHN0eWxlbGludC1kaXNhYmxlLW5leHQtbGluZSAqL1xuICBhIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBtYXJnaW46IDhweCAwIDA7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cblxuICAuaS1jaGF0IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgIGJvcmRlcjogMnB4IHNvbGlkICNiYmI7XG4gICAgY29sb3I6ICNiYmI7XG4gIH1cblxuICAuc2hhcmUtaW5uZXIge1xuICAgIHRyYW5zaXRpb246IHZpc2liaWxpdHkgMHMgbGluZWFyIDBzLCBvcGFjaXR5IC4zcyAwcztcblxuICAgICYuaXMtaGlkZGVuIHtcbiAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgICAgIG9wYWNpdHk6IDA7XG4gICAgICB0cmFuc2l0aW9uOiB2aXNpYmlsaXR5IDBzIGxpbmVhciAuM3MsIG9wYWNpdHkgLjNzIDBzO1xuICAgIH1cbiAgfVxufVxuXG4vLyBQb3N0IG1vYmlsZSBzaGFyZVxuLyogc3R5bGVsaW50LWRpc2FibGUtbmV4dC1saW5lICovXG4ubW9iLXNoYXJlIHtcbiAgLm1hcGFjaGUtc2hhcmUge1xuICAgIGhlaWdodDogNDBweDtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm94LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xuICB9XG5cbiAgLnNoYXJlLXRpdGxlIHtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgbWFyZ2luLWxlZnQ6IDEwcHhcbiAgfVxufVxuXG4vLyBQcmV2aXVzIGFuZCBuZXh0IGFydGljbGVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKiBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmUgKi9cbi5wcmV2LW5leHQge1xuICAmLXNwYW4ge1xuICAgIGNvbG9yOiB2YXIoLS1jb21wb3NpdGUtY29sb3IpO1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuXG4gICAgaSB7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgIHRyYW5zaXRpb246IGFsbCAyNzdtcyBjdWJpYy1iZXppZXIoMC4xNiwgMC4wMSwgMC43NywgMSlcbiAgICB9XG4gIH1cblxuICAmLXRpdGxlIHtcbiAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgaGVpZ2h0OiAyZW07XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBsaW5lLWhlaWdodDogMSAhaW1wb3J0YW50O1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbCAhaW1wb3J0YW50O1xuICAgIC13ZWJraXQtbGluZS1jbGFtcDogMiAhaW1wb3J0YW50O1xuICAgIGRpc3BsYXk6IC13ZWJraXQtYm94ICFpbXBvcnRhbnQ7XG4gIH1cblxuICAmLWxpbms6aG92ZXIge1xuICAgIC5hcnJvdy1yaWdodCB7IGFuaW1hdGlvbjogYXJyb3ctbW92ZS1yaWdodCAwLjVzIGVhc2UtaW4tb3V0IGZvcndhcmRzIH1cbiAgICAuYXJyb3ctbGVmdCB7IGFuaW1hdGlvbjogYXJyb3ctbW92ZS1sZWZ0IDAuNXMgZWFzZS1pbi1vdXQgZm9yd2FyZHMgfVxuICB9XG59XG5cbi8vIEltYWdlIHBvc3QgRm9ybWF0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmNjLWltYWdlIHtcbiAgbWF4LWhlaWdodDogMTAwdmg7XG4gIG1pbi1oZWlnaHQ6IDYwMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuXG4gICYtaGVhZGVyIHtcbiAgICByaWdodDogMDtcbiAgICBib3R0b206IDEwJTtcbiAgICBsZWZ0OiAwO1xuICB9XG5cbiAgJi1maWd1cmUgaW1nIHtcbiAgICAvLyBvcGFjaXR5OiAuNDtcbiAgICBvYmplY3QtZml0OiBjb3ZlcjtcbiAgICB3aWR0aDogMTAwJVxuICB9XG5cbiAgLnBvc3QtaGVhZGVyIHsgbWF4LXdpZHRoOiA4MDBweCB9XG4gIC8vIC5wb3N0LXRpdGxlIHsgbGluZS1oZWlnaHQ6IDEuMSB9XG4gIC5wb3N0LXRpdGxlLCAucG9zdC1leGNlcnB0IHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICB0ZXh0LXNoYWRvdzogMCAwIDEwcHggcmdiYSgwLCAwLCAwLCAwLjgpO1xuICB9XG59XG5cbi8vIFZpZGVvIHBvc3QgRm9ybWF0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4uY2MtdmlkZW8ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTgsIDE4LCAxOCk7XG4gIHBhZGRpbmc6IDgwcHggMCAzMHB4O1xuXG4gIC5wb3N0LWV4Y2VycHQgeyBjb2xvcjogI2FhYTsgZm9udC1zaXplOiAxcmVtIH1cbiAgLnBvc3QtdGl0bGUgeyBjb2xvcjogI2ZmZjsgZm9udC1zaXplOiAxLjhyZW0gfVxuICAua2ctZW1iZWQtY2FyZCwgLnZpZGVvLXJlc3BvbnNpdmUgeyBtYXJnaW4tdG9wOiAwIH1cbiAgLy8gLnRpdGxlLWxpbmUgc3BhbiB7IGZvbnQtc2l6ZTogMTRweCB9XG4gICYtc3Vic2NyaWJlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTgsIDE4LCAxOCk7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgcGFkZGluZzogMCAxMHB4O1xuICAgIHotaW5kZXg6IDE7XG4gIH1cbn1cblxuLy8gY2hhbmdlIHRoZSBkZXNpZ24gYWNjb3JkaW5nIHRvIHRoZSBjbGFzc2VzIG9mIHRoZSBib2R5XG5ib2R5IHtcbiAgJi5pcy1hcnRpY2xlIC5tYWluIHsgbWFyZ2luLWJvdHRvbTogMCB9XG4gICYuc2hhcmUtbWFyZ2luIC5zaGFyZVBvc3QgeyB0b3A6IC02MHB4IH1cbiAgLy8gJi5zaG93LWNhdGVnb3J5IC5wb3N0LXByaW1hcnktdGFnIHsgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudCB9XG4gICYuaGFzLWNvdmVyIC5wb3N0LXByaW1hcnktdGFnIHsgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudCB9XG5cbiAgJi5pcy1hcnRpY2xlLXNpbmdsZSB7XG4gICAgLnBvc3QtYm9keS13cmFwIHsgbWFyZ2luLWxlZnQ6IDAgIWltcG9ydGFudCB9XG4gICAgLnNoYXJlUG9zdCB7IGxlZnQ6IC0xMDBweCB9XG4gICAgLmtnLXdpZHRoLWZ1bGwgLmtnLWltYWdlIHsgbWF4LXdpZHRoOiAxMDB2dyB9XG4gICAgLmtnLXdpZHRoLXdpZGUgLmtnLWltYWdlIHsgbWF4LXdpZHRoOiAxMDQwcHggfVxuXG4gICAgLmtnLWdhbGxlcnktY29udGFpbmVyIHtcbiAgICAgIG1heC13aWR0aDogMTA0MHB4O1xuICAgICAgd2lkdGg6IDEwMHZ3O1xuICAgIH1cbiAgfVxuXG4gIC8vIFZpZGVvXG4gICYuaXMtdmlkZW8ge1xuICAgIC8vIC5oZWFkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMzUsIDM1LCAzNSkgfVxuICAgIC8vIC5oZWFkZXItbGVmdCBhLCAubmF2IHVsIGxpIGEgeyBjb2xvcjogI2ZmZjsgfVxuICAgIC8vIC5tZW51LS10b2dnbGUgc3BhbiB7IGJhY2tncm91bmQtY29sb3I6ICNmZmYgfVxuICAgIC8vIC5wb3N0LXByaW1hcnktdGFnIHsgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudCB9XG4gICAgLnN0b3J5LXNtYWxsIGgzIHsgZm9udC13ZWlnaHQ6IDQwMCB9XG4gIH1cbn1cblxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XG4gIC5wb3N0LWlubmVyIHtcbiAgICBxIHtcbiAgICAgIGZvbnQtc2l6ZTogMjBweCAhaW1wb3J0YW50O1xuICAgICAgbGV0dGVyLXNwYWNpbmc6IC0uMDA4ZW0gIWltcG9ydGFudDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxLjQgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICBvbCwgdWwsIHAge1xuICAgICAgZm9udC1zaXplOiAxcmVtO1xuICAgICAgbGV0dGVyLXNwYWNpbmc6IC0uMDA0ZW07XG4gICAgICBsaW5lLWhlaWdodDogMS41ODtcbiAgICB9XG5cbiAgICBpZnJhbWUgeyB3aWR0aDogMTAwJSAhaW1wb3J0YW50OyB9XG4gIH1cblxuICAvLyBJbWFnZSBwb3N0IGZvcm1hdFxuICAuY2MtaW1hZ2UtZmlndXJlIHtcbiAgICB3aWR0aDogMjAwJTtcbiAgICBtYXgtd2lkdGg6IDIwMCU7XG4gICAgbWFyZ2luOiAwIGF1dG8gMCAtNTAlO1xuICB9XG5cbiAgLmNjLWltYWdlLWhlYWRlciB7IGJvdHRvbTogMjRweCB9XG4gIC5jYy1pbWFnZSAucG9zdC1leGNlcnB0IHsgZm9udC1zaXplOiAxOHB4OyB9XG5cbiAgLy8gdmlkZW8gcG9zdCBmb3JtYXRcbiAgLmNjLXZpZGVvIHtcbiAgICBwYWRkaW5nOiAyMHB4IDA7XG5cbiAgICAmLWVtYmVkIHtcbiAgICAgIG1hcmdpbi1sZWZ0OiAtMTZweDtcbiAgICAgIG1hcmdpbi1yaWdodDogLTE1cHg7XG4gICAgfVxuXG4gICAgLnBvc3QtaGVhZGVyIHsgbWFyZ2luLXRvcDogMTBweCB9XG4gIH1cblxuICAvLyBJbWFnZVxuICAua2ctd2lkdGgtd2lkZSAua2ctaW1hZ2UgeyB3aWR0aDogMTAwJSAhaW1wb3J0YW50IH1cbn1cblxuQG1lZGlhICN7JGxnLWFuZC1kb3dufSB7XG4gIGJvZHkuaXMtYXJ0aWNsZSB7XG4gICAgLmNvbC1sZWZ0IHsgbWF4LXdpZHRoOiAxMDAlIH1cbiAgICAvLyAuc2lkZWJhciB7IGRpc3BsYXk6IG5vbmU7IH1cbiAgfVxufVxuXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7XG4gIC8vIEltYWdlIHBvc3QgRm9ybWF0XG4gIC5jYy1pbWFnZSAucG9zdC10aXRsZSB7IGZvbnQtc2l6ZTogMy4ycmVtIH1cbiAgLnByZXYtbmV4dC1saW5rIHsgbWFyZ2luOiAwICFpbXBvcnRhbnQgfVxuICAucHJldi1uZXh0LXJpZ2h0IHsgdGV4dC1hbGlnbjogcmlnaHQgfVxufVxuXG5AbWVkaWEgI3skbGctYW5kLXVwfSB7XG4gIGJvZHkuaXMtYXJ0aWNsZSAucG9zdC1ib2R5LXdyYXAgeyBtYXJnaW4tbGVmdDogNzBweDsgfVxuXG4gIGJvZHkuaXMtdmlkZW8sXG4gIGJvZHkuaXMtaW1hZ2Uge1xuICAgIC5wb3N0LWF1dGhvciB7IG1hcmdpbi1sZWZ0OiA3MHB4IH1cbiAgICAvLyAuc2hhcmVQb3N0IHsgdG9wOiAtODVweCB9XG4gIH1cbn1cblxuQG1lZGlhICN7JHhsLWFuZC11cH0ge1xuICBib2R5Lmhhcy12aWRlby1maXhlZCB7XG4gICAgLmNjLXZpZGVvLWVtYmVkIHtcbiAgICAgIGJvdHRvbTogMjBweDtcbiAgICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4IDAgcmdiYSgwLCAwLCAwLCAuNSk7XG4gICAgICBoZWlnaHQ6IDIwM3B4O1xuICAgICAgcGFkZGluZy1ib3R0b206IDA7XG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICByaWdodDogMjBweDtcbiAgICAgIHdpZHRoOiAzNjBweDtcbiAgICAgIHotaW5kZXg6IDg7XG4gICAgfVxuXG4gICAgLmNjLXZpZGVvLWNsb3NlIHtcbiAgICAgIGJhY2tncm91bmQ6ICMwMDA7XG4gICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICBjb2xvcjogI2ZmZjtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICBsZWZ0OiAtMTBweDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgcGFkZGluZy10b3A6IDVweDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIHRvcDogLTEwcHg7XG4gICAgICB3aWR0aDogMjRweDtcbiAgICAgIHotaW5kZXg6IDU7XG4gICAgfVxuXG4gICAgLmNjLXZpZGVvLWNvbnQgeyBoZWlnaHQ6IDQ2NXB4OyB9XG5cbiAgICAuY2MtaW1hZ2UtaGVhZGVyIHsgYm90dG9tOiAyMCUgfVxuICB9XG59XG4iLCIvLyBzdHlsZXMgZm9yIHN0b3J5XHJcblxyXG4uaHItbGlzdCB7XHJcbiAgYm9yZGVyOiAwO1xyXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMDc4NSk7XHJcbiAgbWFyZ2luOiAyMHB4IDAgMDtcclxuICAvLyAmOmZpcnN0LWNoaWxkIHsgbWFyZ2luLXRvcDogNXB4IH1cclxufVxyXG5cclxuLnN0b3J5LWZlZWQgLnN0b3J5LWZlZWQtY29udGVudDpmaXJzdC1jaGlsZCAuaHItbGlzdDpmaXJzdC1jaGlsZCB7XHJcbiAgbWFyZ2luLXRvcDogNXB4O1xyXG59XHJcblxyXG4vLyBtZWRpYSB0eXBlIGljb24gKCB2aWRlbyAtIGltYWdlIClcclxuLm1lZGlhLXR5cGUge1xyXG4gIC8vIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0ZW4oJHByaW1hcnktY29sb3IsIDE1JSk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAuNyk7XHJcbiAgY29sb3I6ICNmZmY7XHJcbiAgaGVpZ2h0OiA0NXB4O1xyXG4gIGxlZnQ6IDE1cHg7XHJcbiAgdG9wOiAxNXB4O1xyXG4gIHdpZHRoOiA0NXB4O1xyXG4gIG9wYWNpdHk6IC45O1xyXG5cclxuICAvLyBAZXh0ZW5kIC51LWJnQ29sb3I7XHJcbiAgQGV4dGVuZCAudS1mb250U2l6ZUxhcmdlcjtcclxuICBAZXh0ZW5kIC51LXJvdW5kO1xyXG4gIEBleHRlbmQgLnUtZmxleENlbnRlcjtcclxuICBAZXh0ZW5kIC51LWZsZXhDb250ZW50Q2VudGVyO1xyXG59XHJcblxyXG4vLyBJbWFnZSBvdmVyXHJcbi5pbWFnZS1ob3ZlciB7XHJcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC43cztcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVooMClcclxufVxyXG5cclxuLy8gbm90IGltYWdlXHJcbi8vIC5ub3QtaW1hZ2Uge1xyXG4vLyAgIGJhY2tncm91bmQ6IHVybCgnLi4vaW1hZ2VzL25vdC1pbWFnZS5wbmcnKTtcclxuLy8gICBiYWNrZ3JvdW5kLXJlcGVhdDogcmVwZWF0O1xyXG4vLyB9XHJcblxyXG4vLyBNZXRhXHJcbi5mbG93LW1ldGEge1xyXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNTQpO1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuXHJcbiAgJi1jYXQgeyBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjg0KSB9XHJcbiAgLnBvaW50IHsgbWFyZ2luOiAwIDVweCB9XHJcbn1cclxuXHJcbi8vIFN0b3J5IERlZmF1bHQgbGlzdFxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLnN0b3J5IHtcclxuICAmLWltYWdlIHtcclxuICAgIGZsZXg6IDAgMCAgNDQlIC8qMzgwcHgqLztcclxuICAgIGhlaWdodDogMjM1cHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDMwcHg7XHJcblxyXG4gICAgJjpob3ZlciAuaW1hZ2UtaG92ZXIgeyB0cmFuc2Zvcm06IHNjYWxlKDEuMDMpIH1cclxuICB9XHJcblxyXG4gICYtbG93ZXIgeyBmbGV4LWdyb3c6IDEgfVxyXG5cclxuICAmLWV4Y2VycHQge1xyXG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44NCk7XHJcbiAgICBmb250LWZhbWlseTogJHNlY3VuZGFyeS1mb250O1xyXG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XHJcbiAgfVxyXG5cclxuICBoMiBhOmhvdmVyIHtcclxuICAgIC8vIGJveC1zaGFkb3c6IGluc2V0IDAgLTJweCAwIHJnYmEoMCwgMTcxLCAxMDcsIC41KTtcclxuICAgIC8vIGJveC1zaGFkb3c6IGluc2V0IDAgLTJweCAwIHJnYmEoJHByaW1hcnktY29sb3IsIC41KTtcclxuICAgIC8vIGJveC1zaGFkb3c6IGluc2V0IDAgLTJweCAwIHZhcigtLXN0b3J5LWNvbG9yLWhvdmVyKTtcclxuICAgIC8vIGJveC1zaGFkb3c6IGluc2V0IDAgLTJweCAwIHJnYmEoMCwgMCwgMCwgMC40KTtcclxuICAgIC8vIHRyYW5zaXRpb246IGFsbCAuMjVzO1xyXG4gICAgb3BhY2l0eTogLjY7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBTdG9yeSBHcmlkXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4uc3RvcnktLWdyaWQge1xyXG4gIC5zdG9yeSB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMzBweDtcclxuXHJcbiAgICAmLWltYWdlIHtcclxuICAgICAgZmxleDogMCAwIGF1dG87XHJcbiAgICAgIG1hcmdpbi1yaWdodDogMDtcclxuICAgICAgaGVpZ2h0OiAyMjBweDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC5tZWRpYS10eXBlIHtcclxuICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgIGhlaWdodDogNDBweDtcclxuICAgIHdpZHRoOiA0MHB4O1xyXG4gIH1cclxufVxyXG5cclxuLy8gc29yeSBjb3ZlciAtPiAuc3QtY292ZXJcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi5zdC1jb3ZlciB7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICBoZWlnaHQ6IDMwMHB4O1xyXG4gIHdpZHRoOiAxMDAlO1xyXG5cclxuICAmLWlubmVyIHsgaGVpZ2h0OiAxMDAlIH1cclxuICAmLWltZyB7IHRyYW5zaXRpb246IGFsbCAuMjVzOyB9XHJcbiAgLmZsb3ctbWV0YS1jYXQgeyBjb2xvcjogdmFyKC0tc3RvcnktY292ZXItY2F0ZWdvcnktY29sb3IpIH1cclxuICAuZmxvdy1tZXRhIHsgY29sb3I6ICNmZmYgfVxyXG5cclxuICAmLWhlYWRlciB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBwYWRkaW5nOiA1MHB4IDMuODQ2MTUzODQ2JSAyMHB4O1xyXG4gICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgcmdiYSgwLCAwLCAwLCAwKSAwLCByZ2JhKDAsIDAsIDAsIDAuNykgNTAlLCByZ2JhKDAsIDAsIDAsIC45KSAxMDAlKTtcclxuICB9XHJcblxyXG4gICY6aG92ZXIgLnN0LWNvdmVyLWltZyB7IG9wYWNpdHk6IC44IH1cclxufVxyXG5cclxuLy8gU3RvcnkgQ2FyZFxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLnN0b3J5LS1jYXJkIHtcclxuICAuc3Rvcnkge1xyXG4gICAgbWFyZ2luLXRvcDogMCAhaW1wb3J0YW50O1xyXG4gIH1cclxuXHJcbiAgLyogc3R5bGVsaW50LWRpc2FibGUtbmV4dC1saW5lICovXHJcbiAgLnN0b3J5LWltYWdlIHtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjA0KTtcclxuICAgIGJveC1zaGFkb3c6IDAgMXB4IDdweCByZ2JhKDAsIDAsIDAsIC4wNSk7XHJcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmICFpbXBvcnRhbnQ7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgMTUwbXMgZWFzZS1pbi1vdXQ7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgaGVpZ2h0OiAyMDBweCAhaW1wb3J0YW50O1xyXG5cclxuICAgIC5zdG9yeS1pbWctYmcgeyBtYXJnaW46IDEwcHggfVxyXG5cclxuICAgICY6aG92ZXIge1xyXG4gICAgICBib3gtc2hhZG93OiAwIDAgMTVweCA0cHggcmdiYSgwLCAwLCAwLCAuMSk7XHJcblxyXG4gICAgICAuc3RvcnktaW1nLWJnIHsgdHJhbnNmb3JtOiBub25lIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC5zdG9yeS1sb3dlciB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9XHJcblxyXG4gIC5zdG9yeS1ib2R5IHtcclxuICAgIHBhZGRpbmc6IDE1cHggNXB4O1xyXG4gICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XHJcblxyXG4gICAgaDIge1xyXG4gICAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsICFpbXBvcnRhbnQ7XHJcbiAgICAgIC13ZWJraXQtbGluZS1jbGFtcDogMiAhaW1wb3J0YW50O1xyXG4gICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuOSk7XHJcbiAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94ICFpbXBvcnRhbnQ7XHJcbiAgICAgIC8vIGxpbmUtaGVpZ2h0OiAxLjEgIWltcG9ydGFudDtcclxuICAgICAgbWF4LWhlaWdodDogMi40ZW0gIWltcG9ydGFudDtcclxuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXMgIWltcG9ydGFudDtcclxuICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gU3RvcnkgU21hbGxcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi5zdG9yeS1zbWFsbCB7XHJcbiAgaDMge1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBtYXgtaGVpZ2h0OiAyLjVlbTtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xyXG4gICAgLXdlYmtpdC1saW5lLWNsYW1wOiAyO1xyXG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XHJcbiAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcclxuICB9XHJcblxyXG4gICYtaW1nIHtcclxuICAgIGhlaWdodDogMTcwcHhcclxuICB9XHJcblxyXG4gIC8qIHN0eWxlbGludC1kaXNhYmxlLW5leHQtbGluZSAqL1xyXG4gIC5tZWRpYS10eXBlIHtcclxuICAgIGhlaWdodDogMzRweDtcclxuICAgIHdpZHRoOiAzNHB4O1xyXG4gIH1cclxufVxyXG5cclxuLy8gQWxsIFN0b3J5IEhvdmVyXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4uc3RvcnktLWhvdmVyIHtcclxuICAvKiBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmUgKi9cclxuICAubGF6eS1sb2FkLWltYWdlLCBoMiwgaDMgeyB0cmFuc2l0aW9uOiBhbGwgLjI1cyB9XHJcblxyXG4gICY6aG92ZXIge1xyXG4gICAgLmxhenktbG9hZC1pbWFnZSB7IG9wYWNpdHk6IC44IH1cclxuICAgIGgzLGgyIHsgb3BhY2l0eTogLjYgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gTWVkaWEgcXVlcnkgYWZ0ZXIgbWVkaXVtXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7XHJcbiAgLy8gc3RvcnkgZ3JpZFxyXG4gIC5zdG9yeS0tZ3JpZCB7XHJcbiAgICAuc3RvcnktbG93ZXIge1xyXG4gICAgICBtYXgtaGVpZ2h0OiAzZW07XHJcbiAgICAgIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XHJcbiAgICAgIC13ZWJraXQtbGluZS1jbGFtcDogMjtcclxuICAgICAgZGlzcGxheTogLXdlYmtpdC1ib3g7XHJcbiAgICAgIGxpbmUtaGVpZ2h0OiAxLjE7XHJcbiAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gTWVkaWEgcXVlcnkgYmVmb3JlIG1lZGl1bVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5AbWVkaWEgI3skbWQtYW5kLWRvd259IHtcclxuICAvLyBTdG9yeSBDb3ZlclxyXG4gIC5jb3Zlci0tZmlydHMgLnN0b3J5LWNvdmVyIHsgaGVpZ2h0OiA1MDBweCB9XHJcblxyXG4gIC8vIHN0b3J5IGRlZmF1bHQgbGlzdFxyXG4gIC5zdG9yeSB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgbWFyZ2luLXRvcDogMjBweDtcclxuXHJcbiAgICAmLWltYWdlIHsgZmxleDogMCAwIGF1dG87IG1hcmdpbi1yaWdodDogMCB9XHJcbiAgICAmLWJvZHkgeyBtYXJnaW4tdG9wOiAxMHB4IH1cclxuICB9XHJcbn1cclxuIiwiLy8gQXV0aG9yIHBhZ2VcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi5hdXRob3Ige1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjYpO1xyXG4gIG1pbi1oZWlnaHQ6IDM1MHB4O1xyXG5cclxuICAmLWF2YXRhciB7XHJcbiAgICBoZWlnaHQ6IDgwcHg7XHJcbiAgICB3aWR0aDogODBweDtcclxuICB9XHJcblxyXG4gICYtbWV0YSBzcGFuIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIGZvbnQtc2l6ZTogMTdweDtcclxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcclxuICAgIG1hcmdpbjogMCAyNXB4IDE2cHggMDtcclxuICAgIG9wYWNpdHk6IC44O1xyXG4gICAgd29yZC13cmFwOiBicmVhay13b3JkO1xyXG4gIH1cclxuXHJcbiAgJi1iaW8ge1xyXG4gICAgbWF4LXdpZHRoOiA3MDBweDtcclxuICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XHJcbiAgfVxyXG5cclxuICAmLW5hbWUgeyBjb2xvcjogcmdiYSgwLCAwLCAwLCAuOCkgfVxyXG4gICYtbWV0YSBhOmhvdmVyIHsgb3BhY2l0eTogLjggIWltcG9ydGFudCB9XHJcbn1cclxuXHJcbi5jb3Zlci1vcGFjaXR5IHsgb3BhY2l0eTogLjUgfVxyXG5cclxuLmF1dGhvci5oYXMtLWltYWdlIHtcclxuICBjb2xvcjogI2ZmZiAhaW1wb3J0YW50O1xyXG4gIHRleHQtc2hhZG93OiAwIDAgMTBweCByZ2JhKDAsIDAsIDAsIC4zMyk7XHJcblxyXG4gIGEsXHJcbiAgLmF1dGhvci1uYW1lIHsgY29sb3I6ICNmZmY7IH1cclxuXHJcbiAgLmF1dGhvci1mb2xsb3cgYSB7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZDtcclxuICAgIGJvcmRlci1jb2xvcjogaHNsYSgwLCAwJSwgMTAwJSwgLjUpICFpbXBvcnRhbnQ7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgfVxyXG5cclxuICAudS1hY2NlbnRDb2xvci0taWNvbk5vcm1hbCB7IGZpbGw6ICNmZmY7IH1cclxufVxyXG5cclxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XHJcbiAgLmF1dGhvci1tZXRhIHNwYW4geyBkaXNwbGF5OiBibG9jazsgfVxyXG4gIC5hdXRob3ItaGVhZGVyIHsgZGlzcGxheTogYmxvY2s7IH1cclxuICAuYXV0aG9yLWF2YXRhciB7IG1hcmdpbjogMCBhdXRvIDIwcHg7IH1cclxufVxyXG5cclxuQG1lZGlhICN7JG1kLWFuZC11cH0ge1xyXG4gIGJvZHkuaGFzLWNvdmVyIC5hdXRob3IgeyBtaW4taGVpZ2h0OiA2MDBweCB9XHJcbn1cclxuIiwiLy8gU2VhcmNoXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4uc2VhcmNoIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBoZWlnaHQ6IDEwMHZoO1xyXG4gIGxlZnQ6IDA7XHJcbiAgcGFkZGluZzogMCAxNnB4O1xyXG4gIHJpZ2h0OiAwO1xyXG4gIHRvcDogMDtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTEwMCUpO1xyXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuM3MgZWFzZTtcclxuICB6LWluZGV4OiA5O1xyXG5cclxuICAmLWZvcm0ge1xyXG4gICAgbWF4LXdpZHRoOiA2ODBweDtcclxuICAgIG1hcmdpbi10b3A6IDgwcHg7XHJcblxyXG4gICAgJjo6YmVmb3JlIHtcclxuICAgICAgYmFja2dyb3VuZDogI2VlZTtcclxuICAgICAgYm90dG9tOiAwO1xyXG4gICAgICBjb250ZW50OiAnJztcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIGhlaWdodDogMnB4O1xyXG4gICAgICBsZWZ0OiAwO1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICB6LWluZGV4OiAxO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0IHtcclxuICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgbGluZS1oZWlnaHQ6IDQwcHg7XHJcbiAgICAgIHBhZGRpbmctYm90dG9tOiA4cHg7XHJcblxyXG4gICAgICAmOmZvY3VzIHsgb3V0bGluZTogMDsgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gcmVzdWx0XHJcbiAgJi1yZXN1bHRzIHtcclxuICAgIG1heC1oZWlnaHQ6IGNhbGMoMTAwJSAtIDEwMHB4KTtcclxuICAgIG1heC13aWR0aDogNjgwcHg7XHJcbiAgICBvdmVyZmxvdzogYXV0bztcclxuXHJcbiAgICBhIHtcclxuICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xyXG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC4wNSk7XHJcbiAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC43KTtcclxuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNmZmY7XHJcbiAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UtaW4tb3V0O1xyXG5cclxuICAgICAgJjpob3ZlciB7IGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKSB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4uYnV0dG9uLXNlYXJjaC0tY2xvc2Uge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZSAhaW1wb3J0YW50O1xyXG4gIHJpZ2h0OiA1MHB4O1xyXG4gIHRvcDogMjBweDtcclxufVxyXG5cclxuYm9keS5pcy1zZWFyY2gge1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcblxyXG4gIC5zZWFyY2ggeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgfVxyXG4gIC5zZWFyY2gtdG9nZ2xlIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuMjUpIH1cclxufVxyXG4iLCIuc2lkZWJhciB7XG4gICYtdGl0bGUge1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIC4wNzg1KTtcblxuICAgIHNwYW4ge1xuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjU0KTtcbiAgICAgIHBhZGRpbmctYm90dG9tOiAxMHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogLTFweDtcbiAgICB9XG4gIH1cbn1cblxuLy8gYm9yZGVyIGZvciBwb3N0XG4uc2lkZWJhci1ib3JkZXIge1xuICBib3JkZXItbGVmdDogM3B4IHNvbGlkIHZhcigtLWNvbXBvc2l0ZS1jb2xvcik7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC4yKTtcbiAgcGFkZGluZzogMCAxMHB4O1xuICAtd2Via2l0LXRleHQtZmlsbC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIC13ZWJraXQtdGV4dC1zdHJva2Utd2lkdGg6IDEuNXB4O1xuICAtd2Via2l0LXRleHQtc3Ryb2tlLWNvbG9yOiAjODg4O1xufVxuXG4uc2lkZWJhci1wb3N0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4wNzg1KTtcbiAgYm94LXNoYWRvdzogMCAxcHggN3B4IHJnYmEoMCwgMCwgMCwgLjA3ODUpO1xuICBtaW4taGVpZ2h0OiA2MHB4O1xuXG4gIGgzIHsgcGFkZGluZzogMTBweCB9XG5cbiAgJjpob3ZlciB7IC5zaWRlYmFyLWJvcmRlciB7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjI5LCAyMzksIDI0NSwgMSkgfSB9XG5cbiAgJjpudGgtY2hpbGQoM24pIHsgLnNpZGViYXItYm9yZGVyIHsgYm9yZGVyLWNvbG9yOiBkYXJrZW4ob3JhbmdlLCAyJSk7IH0gfVxuICAmOm50aC1jaGlsZCgzbisyKSB7IC5zaWRlYmFyLWJvcmRlciB7IGJvcmRlci1jb2xvcjogIzI2YThlZCB9IH1cbn1cblxuLy8gQ2VudGVyZWQgbGluZSBhbmQgb2JsaXF1ZSBjb250ZW50XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gLmNlbnRlci1saW5lIHtcbi8vICAgZm9udC1zaXplOiAxNnB4O1xuLy8gICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuLy8gICBwb3NpdGlvbjogcmVsYXRpdmU7XG4vLyAgIHRleHQtYWxpZ246IGNlbnRlcjtcblxuLy8gICAmOjpiZWZvcmUge1xuLy8gICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgLjE1KTtcbi8vICAgICBib3R0b206IDUwJTtcbi8vICAgICBjb250ZW50OiAnJztcbi8vICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4vLyAgICAgaGVpZ2h0OiAxcHg7XG4vLyAgICAgbGVmdDogMDtcbi8vICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4vLyAgICAgd2lkdGg6IDEwMCU7XG4vLyAgICAgei1pbmRleDogMDtcbi8vICAgfVxuLy8gfVxuXG4vLyAub2JsaXF1ZSB7XG4vLyAgIGJhY2tncm91bmQ6ICNmZjAwNWI7XG4vLyAgIGNvbG9yOiAjZmZmO1xuLy8gICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4vLyAgIGZvbnQtc2l6ZTogMTZweDtcbi8vICAgZm9udC13ZWlnaHQ6IDcwMDtcbi8vICAgbGluZS1oZWlnaHQ6IDE7XG4vLyAgIHBhZGRpbmc6IDVweCAxM3B4O1xuLy8gICBwb3NpdGlvbjogcmVsYXRpdmU7XG4vLyAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4vLyAgIHRyYW5zZm9ybTogc2tld1goLTE1ZGVnKTtcbi8vICAgei1pbmRleDogMTtcbi8vIH1cbiIsIi8vIE5hdmlnYXRpb24gTW9iaWxlXHJcbi5zaWRlTmF2IHtcclxuICAvLyBiYWNrZ3JvdW5kLWNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcclxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjgpO1xyXG4gIGhlaWdodDogMTAwdmg7XHJcbiAgcGFkZGluZzogJGhlYWRlci1oZWlnaHQgMjBweDtcclxuICBwb3NpdGlvbjogZml4ZWQgIWltcG9ydGFudDtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSk7XHJcbiAgdHJhbnNpdGlvbjogMC40cztcclxuICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xyXG4gIHotaW5kZXg6IDg7XHJcblxyXG4gICYtbWVudSBhIHsgcGFkZGluZzogMTBweCAyMHB4OyB9XHJcblxyXG4gICYtd3JhcCB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZWVlO1xyXG4gICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgICBwYWRkaW5nOiAyMHB4IDA7XHJcbiAgICB0b3A6ICRoZWFkZXItaGVpZ2h0O1xyXG4gIH1cclxuXHJcbiAgJi1zZWN0aW9uIHtcclxuICAgIGJvcmRlci1ib3R0b206IHNvbGlkIDFweCAjZGRkO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDhweDtcclxuICB9XHJcblxyXG4gICYtZm9sbG93IHtcclxuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZGRkO1xyXG4gICAgbWFyZ2luOiAxNXB4IDA7XHJcblxyXG4gICAgYSB7XHJcbiAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIGhlaWdodDogMzZweDtcclxuICAgICAgbGluZS1oZWlnaHQ6IDIwcHg7XHJcbiAgICAgIG1hcmdpbjogMCA1cHggNXB4IDA7XHJcbiAgICAgIG1pbi13aWR0aDogMzZweDtcclxuICAgICAgcGFkZGluZzogOHB4O1xyXG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgICB9XHJcblxyXG4gICAgQGVhY2ggJHNvY2lhbC1uYW1lLCAkY29sb3IgaW4gJHNvY2lhbC1jb2xvcnMge1xyXG4gICAgICAuaS0jeyRzb2NpYWwtbmFtZX0ge1xyXG4gICAgICAgIEBleHRlbmQgLmJnLSN7JHNvY2lhbC1uYW1lfTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyAgRm9sbG93IG1lIGJ0biBpcyBwb3N0XG4vLyAubWFwYWNoZS1mb2xsb3cge1xuLy8gICAmOmhvdmVyIHtcbi8vICAgICAubWFwYWNoZS1ob3Zlci1oaWRkZW4geyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfVxuLy8gICAgIC5tYXBhY2hlLWhvdmVyLXNob3cgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgIWltcG9ydGFudCB9XG4vLyAgIH1cblxuLy8gICAmLWJ0biB7XG4vLyAgICAgaGVpZ2h0OiAxOXB4O1xuLy8gICAgIGxpbmUtaGVpZ2h0OiAxN3B4O1xuLy8gICAgIHBhZGRpbmc6IDAgMTBweDtcbi8vICAgfVxuLy8gfVxuXG4vLyBUcmFuc3BhcmVjZSBoZWFkZXIgYW5kIGNvdmVyIGltZ1xuXG4uaGFzLWNvdmVyLXBhZGRpbmcgeyBwYWRkaW5nLXRvcDogMTAwcHggfVxuXG5ib2R5Lmhhcy1jb3ZlciB7XG4gIC5oZWFkZXIgeyBwb3NpdGlvbjogZml4ZWQgfVxuXG4gICYuaXMtdHJhbnNwYXJlbmN5Om5vdCguaXMtc2VhcmNoKSB7XG4gICAgLmhlYWRlciB7XG4gICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgIGJveC1zaGFkb3c6IG5vbmU7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgaHNsYSgwLCAwJSwgMTAwJSwgLjEpO1xuICAgIH1cblxuICAgIC5oZWFkZXItbGVmdCBhLCAubmF2IHVsIGxpIGEgeyBjb2xvcjogI2ZmZjsgfVxuICAgIC5tZW51LS10b2dnbGUgc3BhbiB7IGJhY2tncm91bmQtY29sb3I6ICNmZmYgfVxuICB9XG59XG4iLCIvLyAuaXMtc3Vic2NyaWJlIC5mb290ZXIge1xyXG4vLyAgIGJhY2tncm91bmQtY29sb3I6ICNmMGYwZjA7XHJcbi8vIH1cclxuXHJcbi5zdWJzY3JpYmUge1xyXG4gIG1pbi1oZWlnaHQ6IDgwdmggIWltcG9ydGFudDtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbiAgLy8gYmFja2dyb3VuZC1jb2xvcjogI2YwZjBmMCAhaW1wb3J0YW50O1xyXG5cclxuICAmLWNhcmQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI0Q3RUZFRTtcclxuICAgIGJveC1zaGFkb3c6IDAgMnB4IDEwcHggcmdiYSgwLCAwLCAwLCAuMTUpO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgd2lkdGg6IDkwMHB4O1xyXG4gICAgaGVpZ2h0OiA1NTBweDtcclxuICAgIHBhZGRpbmc6IDUwcHg7XHJcbiAgICBtYXJnaW46IDVweDtcclxuICB9XHJcblxyXG4gIGZvcm0ge1xyXG4gICAgbWF4LXdpZHRoOiAzMDBweDtcclxuICB9XHJcblxyXG4gICYtZm9ybSB7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgfVxyXG5cclxuICAmLWlucHV0IHtcclxuICAgIGJhY2tncm91bmQ6IDAgMDtcclxuICAgIGJvcmRlcjogMDtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjY2M1NDU0O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMDtcclxuICAgIHBhZGRpbmc6IDdweCA1cHg7XHJcbiAgICBoZWlnaHQ6IDQ1cHg7XHJcbiAgICBvdXRsaW5lOiAwO1xyXG4gICAgZm9udC1mYW1pbHk6ICRwcmltYXJ5LWZvbnQ7XHJcblxyXG4gICAgJjo6cGxhY2Vob2xkZXIge1xyXG4gICAgICBjb2xvcjogI2NjNTQ1NDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC5tYWluLWVycm9yIHtcclxuICAgIGNvbG9yOiAjY2M1NDU0O1xyXG4gICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogMTVweDtcclxuICB9XHJcbn1cclxuXHJcbi8vIC5zdWJzY3JpYmUtYnRuIHtcclxuLy8gICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC44NCk7XHJcbi8vICAgYm9yZGVyLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC44NCk7XHJcbi8vICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjk3KTtcclxuLy8gICBib3gtc2hhZG93OiAwIDFweCA3cHggcmdiYSgwLCAwLCAwLCAuMDUpO1xyXG4vLyAgIGxldHRlci1zcGFjaW5nOiAxcHg7XHJcblxyXG4vLyAgICY6aG92ZXIge1xyXG4vLyAgICAgYmFja2dyb3VuZDogIzFDOTk2MztcclxuLy8gICAgIGJvcmRlci1jb2xvcjogIzFDOTk2MztcclxuLy8gICB9XHJcbi8vIH1cclxuXHJcbi8vIFN1Y2Nlc3NcclxuLnN1YnNjcmliZS1zdWNjZXNzIHtcclxuICAuc3Vic2NyaWJlLWNhcmQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI0U4RjNFQztcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAjeyRtZC1hbmQtZG93bn0ge1xyXG4gIC5zdWJzY3JpYmUtY2FyZCB7XHJcbiAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICB3aWR0aDogYXV0bztcclxuICB9XHJcbn1cclxuIiwiLy8gcG9zdCBDb21tZW50c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLnBvc3QtY29tbWVudHMge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgei1pbmRleDogMTU7XG4gIHdpZHRoOiAxMDAlO1xuICBsZWZ0OiAwO1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNmMWYxZjE7XG4gIGJveC1zaGFkb3c6IDAgMXB4IDdweCByZ2JhKDAsIDAsIDAsIC4wNSk7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpO1xuICB0cmFuc2l0aW9uOiAuMnM7XG4gIHdpbGwtY2hhbmdlOiB0cmFuc2Zvcm07XG5cbiAgJi1oZWFkZXIge1xuICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XG5cbiAgICAudG9nZ2xlLWNvbW1lbnRzIHtcbiAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgbGVmdDogMDtcbiAgICAgIHRvcDogMDtcbiAgICAgIHBhZGRpbmc6IDE3cHg7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgfVxuICB9XG5cbiAgJi1vdmVybGF5IHtcbiAgICBwb3NpdGlvbjogZml4ZWQgIWltcG9ydGFudDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4yKTtcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgLjRzIGxpbmVhcjtcbiAgICB6LWluZGV4OiA4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxufVxuXG5ib2R5Lmhhcy1jb21tZW50cyB7XG4gIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgLnBvc3QtY29tbWVudHMtb3ZlcmxheSB7IGRpc3BsYXk6IGJsb2NrIH1cbiAgLnBvc3QtY29tbWVudHMgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCkgfVxufVxuXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7XG4gIC5wb3N0LWNvbW1lbnRzIHtcbiAgICBsZWZ0OiBhdXRvO1xuICAgIG1heC13aWR0aDogNzAwcHg7XG4gICAgbWluLXdpZHRoOiA1MDBweDtcbiAgICB0b3A6ICRoZWFkZXItaGVpZ2h0O1xuICAgIHotaW5kZXg6IDk7XG4gIH1cbn1cbiIsIi50b3BpYyB7XG4gICYtaW1nIHtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjdzO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWigwKVxuICB9XG5cbiAgJi1pdGVtcyB7XG4gICAgaGVpZ2h0OiAzMjBweDtcbiAgICBwYWRkaW5nOiAzMHB4O1xuXG4gICAgJjpob3ZlciB7XG4gICAgICAudG9waWMtaW1nIHsgdHJhbnNmb3JtOiBzY2FsZSgxLjAzKTsgfVxuICAgIH1cbiAgfVxuXG4gICYtYyB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XG4gICAgY29sb3I6ICNmZmY7XG4gIH1cbn1cbiIsIi5tb2RhbCB7XHJcbiAgb3BhY2l0eTogMDtcclxuICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4ycyBlYXNlLW91dCAuMXMsIHZpc2liaWxpdHkgMHMgLjRzO1xyXG4gIHotaW5kZXg6IDEwMDtcclxuICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcblxyXG4gIC8vIFNoYWRlclxyXG4gICYtc2hhZGVyIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuNjUpIH1cclxuXHJcbiAgLy8gbW9kYWwgY2xvc2VcclxuICAmLWNsb3NlIHtcclxuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC41NCk7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgcGFkZGluZzogMTVweDtcclxuICB9XHJcblxyXG4gIC8vIElubmVyXHJcbiAgJi1pbm5lciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRThGM0VDO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgYm94LXNoYWRvdzogMCAycHggMTBweCByZ2JhKDAsIDAsIDAsIC4xNSk7XHJcbiAgICBtYXgtd2lkdGg6IDcwMHB4O1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgbWF4LWhlaWdodDogNDAwcHg7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG4gICAgcGFkZGluZzogNzJweCA1JSA1NnB4O1xyXG4gICAgdHJhbnNmb3JtOiBzY2FsZSguNik7XHJcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjNzIGN1YmljLWJlemllciguMDYsIC40NywgLjM4LCAuOTkpLCBvcGFjaXR5IC4zcyBjdWJpYy1iZXppZXIoLjA2LCAuNDcsIC4zOCwgLjk5KTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gIH1cclxuXHJcbiAgLy8gZm9ybVxyXG4gIC5mb3JtLWdyb3VwIHtcclxuICAgIHdpZHRoOiA3NiU7XHJcbiAgICBtYXJnaW46IDAgYXV0byAzMHB4O1xyXG4gIH1cclxuXHJcbiAgLmZvcm0tLWlucHV0IHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xyXG4gICAgaGVpZ2h0OiA0MHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDQwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICAgIHBhZGRpbmc6IDE3cHggNnB4O1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjE1KTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gIH1cclxuXHJcbiAgLy8gLmZvcm0tLWJ0biB7XHJcbiAgLy8gICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC44NCk7XHJcbiAgLy8gICBib3JkZXI6IDA7XHJcbiAgLy8gICBoZWlnaHQ6IDM3cHg7XHJcbiAgLy8gICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgLy8gICBsaW5lLWhlaWdodDogMzdweDtcclxuICAvLyAgIHBhZGRpbmc6IDAgMTZweDtcclxuICAvLyAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgLjNzIGVhc2UtaW4tb3V0O1xyXG4gIC8vICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcclxuICAvLyAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC45Nyk7XHJcbiAgLy8gICBjdXJzb3I6IHBvaW50ZXI7XHJcblxyXG4gIC8vICAgJjpob3ZlciB7IGJhY2tncm91bmQtY29sb3I6ICMxQzk5NjMgfVxyXG4gIC8vIH1cclxufVxyXG5cclxuLy8gaWYgaGFzIG1vZGFsXHJcblxyXG5ib2R5Lmhhcy1tb2RhbCB7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuXHJcbiAgLm1vZGFsIHtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xyXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuM3MgZWFzZTtcclxuXHJcbiAgICAmLWlubmVyIHtcclxuICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcclxuICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC44cyBjdWJpYy1iZXppZXIoLjI2LCAuNjMsIDAsIC45Nik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIEluc3RhZ3JhbSBGZWRkXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi5pbnN0YWdyYW0ge1xyXG4gICYtaG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAuMyk7XHJcbiAgICAvLyB0cmFuc2l0aW9uOiBvcGFjaXR5IDFzIGVhc2UtaW4tb3V0O1xyXG4gICAgb3BhY2l0eTogMDtcclxuICB9XHJcblxyXG4gICYtaW1nIHtcclxuICAgIGhlaWdodDogMjY0cHg7XHJcblxyXG4gICAgJjpob3ZlciA+IC5pbnN0YWdyYW0taG92ZXIgeyBvcGFjaXR5OiAxIH1cclxuICB9XHJcblxyXG4gICYtbmFtZSB7XHJcbiAgICBsZWZ0OiA1MCU7XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xyXG4gICAgei1pbmRleDogMztcclxuXHJcbiAgICBhIHtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICAgICAgY29sb3I6ICMwMDAgIWltcG9ydGFudDtcclxuICAgICAgZm9udC1zaXplOiAxOHB4ICFpbXBvcnRhbnQ7XHJcbiAgICAgIGZvbnQtd2VpZ2h0OiA5MDAgIWltcG9ydGFudDtcclxuICAgICAgbWluLXdpZHRoOiAyMDBweDtcclxuICAgICAgcGFkZGluZy1sZWZ0OiAxMHB4ICFpbXBvcnRhbnQ7XHJcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDEwcHggIWltcG9ydGFudDtcclxuICAgICAgdGV4dC1hbGlnbjogY2VudGVyICFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLWNvbCB7XHJcbiAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XHJcbiAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcclxuICB9XHJcblxyXG4gICYtd3JhcCB7IG1hcmdpbjogMCAhaW1wb3J0YW50IH1cclxufVxyXG5cclxuLy8gTmV3c2xldHRlciBTaWRlYmFyXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi53aXRnZXQtc3Vic2NyaWJlIHtcclxuICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gIGJvcmRlcjogNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG4gIHBhZGRpbmc6IDI4cHggMzBweDtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblxyXG4gICY6OmJlZm9yZSB7XHJcbiAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgYm9yZGVyOiA1cHggc29saWQgI2Y1ZjVmNTtcclxuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDFweCAjZDdkN2Q3O1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEwMCUgKyAxMHB4KTtcclxuICAgIGxlZnQ6IC01cHg7XHJcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogLTVweDtcclxuICAgIHdpZHRoOiBjYWxjKDEwMCUgKyAxMHB4KTtcclxuICAgIHotaW5kZXg6IDE7XHJcbiAgfVxyXG5cclxuICBpbnB1dCB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2U1ZTVlNTtcclxuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC41NCk7XHJcbiAgICBoZWlnaHQ6IDQxcHg7XHJcbiAgICBvdXRsaW5lOiAwO1xyXG4gICAgcGFkZGluZzogMCAxNnB4O1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG5cclxuICBidXR0b24ge1xyXG4gICAgYmFja2dyb3VuZDogdmFyKC0tY29tcG9zaXRlLWNvbG9yKTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDA7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUNBQSw0RUFBNEU7QUFFNUU7Z0ZBQ2dGO0FBRWhGOzs7R0FHRzs7QUFFSCxBQUFBLElBQUksQ0FBQztFQUNILFdBQVcsRUFBRSxJQUFJO0VBQUUsT0FBTztFQUMxQix3QkFBd0IsRUFBRSxJQUFJO0VBQUUsT0FBTyxFQUN4Qzs7QUFFRDtnRkFDZ0Y7QUFFaEY7O0dBRUc7O0FBRUgsQUFBQSxJQUFJLENBQUM7RUFDSCxNQUFNLEVBQUUsQ0FBQyxHQUNWOztB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 */","/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n","@charset \"UTF-8\";\n\n/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n/* line 11, node_modules/normalize.css/normalize.css */\n\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\n/* line 23, node_modules/normalize.css/normalize.css */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\n/* line 31, node_modules/normalize.css/normalize.css */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\n/* line 40, node_modules/normalize.css/normalize.css */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\n/* line 53, node_modules/normalize.css/normalize.css */\n\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 64, node_modules/normalize.css/normalize.css */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\n/* line 76, node_modules/normalize.css/normalize.css */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\n/* line 85, node_modules/normalize.css/normalize.css */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\n/* line 95, node_modules/normalize.css/normalize.css */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 105, node_modules/normalize.css/normalize.css */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\n/* line 116, node_modules/normalize.css/normalize.css */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\n/* line 125, node_modules/normalize.css/normalize.css */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\n/* line 133, node_modules/normalize.css/normalize.css */\n\nsub {\n  bottom: -0.25em;\n}\n\n/* line 137, node_modules/normalize.css/normalize.css */\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\n/* line 148, node_modules/normalize.css/normalize.css */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\n/* line 160, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\n/* line 176, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\n/* line 186, node_modules/normalize.css/normalize.css */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\n/* line 195, node_modules/normalize.css/normalize.css */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\n/* line 206, node_modules/normalize.css/normalize.css */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\n/* line 218, node_modules/normalize.css/normalize.css */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\n/* line 229, node_modules/normalize.css/normalize.css */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\n/* line 240, node_modules/normalize.css/normalize.css */\n\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\n/* line 253, node_modules/normalize.css/normalize.css */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\n/* line 261, node_modules/normalize.css/normalize.css */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n/* line 270, node_modules/normalize.css/normalize.css */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n/* line 280, node_modules/normalize.css/normalize.css */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n/* line 290, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n/* line 299, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n/* line 308, node_modules/normalize.css/normalize.css */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\n/* line 320, node_modules/normalize.css/normalize.css */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\n/* line 328, node_modules/normalize.css/normalize.css */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\n/* line 339, node_modules/normalize.css/normalize.css */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n/* line 347, node_modules/normalize.css/normalize.css */\n\n[hidden] {\n  display: none;\n}\n\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\n/* line 7, node_modules/prismjs/themes/prism.css */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none;\n}\n\n/* line 30, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::-moz-selection,\npre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection,\ncode[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n/* line 36, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::selection,\npre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection,\ncode[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n@media print {\n  /* line 43, node_modules/prismjs/themes/prism.css */\n\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none;\n  }\n}\n\n/* Code blocks */\n\n/* line 50, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n}\n\n/* line 56, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0;\n}\n\n/* Inline code */\n\n/* line 62, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal;\n}\n\n/* line 68, node_modules/prismjs/themes/prism.css */\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray;\n}\n\n/* line 75, node_modules/prismjs/themes/prism.css */\n\n.token.punctuation {\n  color: #999;\n}\n\n/* line 79, node_modules/prismjs/themes/prism.css */\n\n.namespace {\n  opacity: .7;\n}\n\n/* line 83, node_modules/prismjs/themes/prism.css */\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905;\n}\n\n/* line 93, node_modules/prismjs/themes/prism.css */\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690;\n}\n\n/* line 102, node_modules/prismjs/themes/prism.css */\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #9a6e3a;\n  background: rgba(255, 255, 255, 0.5);\n}\n\n/* line 111, node_modules/prismjs/themes/prism.css */\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a;\n}\n\n/* line 117, node_modules/prismjs/themes/prism.css */\n\n.token.function,\n.token.class-name {\n  color: #DD4A68;\n}\n\n/* line 122, node_modules/prismjs/themes/prism.css */\n\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90;\n}\n\n/* line 128, node_modules/prismjs/themes/prism.css */\n\n.token.important,\n.token.bold {\n  font-weight: bold;\n}\n\n/* line 132, node_modules/prismjs/themes/prism.css */\n\n.token.italic {\n  font-style: italic;\n}\n\n/* line 136, node_modules/prismjs/themes/prism.css */\n\n.token.entity {\n  cursor: help;\n}\n\n/* line 1, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\n/* line 7, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n/* line 12, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n/* line 29, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n/* line 35, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n/* line 1, src/styles/common/_mixins.scss */\n\n.link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n/* line 7, src/styles/common/_mixins.scss */\n\n.link--accent {\n  color: var(--primary-color);\n  text-decoration: none;\n}\n\n/* line 22, src/styles/common/_mixins.scss */\n\n.u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n/* line 30, src/styles/common/_mixins.scss */\n\n.u-textColorDarker {\n  color: rgba(0, 0, 0, 0.8) !important;\n  fill: rgba(0, 0, 0, 0.8) !important;\n}\n\n/* line 35, src/styles/common/_mixins.scss */\n\n.warning::before,\n.note::before,\n.success::before,\n[class^=\"i-\"]::before,\n[class*=\" i-\"]::before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* line 2, src/styles/autoload/_zoom.scss */\n\nimg[data-action=\"zoom\"] {\n  cursor: zoom-in;\n}\n\n/* line 5, src/styles/autoload/_zoom.scss */\n\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  transition: all 300ms;\n}\n\n/* line 13, src/styles/autoload/_zoom.scss */\n\nimg.zoom-img {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: -moz-zoom-out;\n}\n\n/* line 18, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  filter: \"alpha(opacity=0)\";\n  opacity: 0;\n  -webkit-transition: opacity 300ms;\n  -o-transition: opacity 300ms;\n  transition: opacity 300ms;\n}\n\n/* line 33, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open .zoom-overlay {\n  filter: \"alpha(opacity=100)\";\n  opacity: 1;\n}\n\n/* line 37, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open,\n.zoom-overlay-transitioning {\n  cursor: default;\n}\n\n/* line 1, src/styles/common/_global.scss */\n\n:root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d;\n}\n\n/* line 15, src/styles/common/_global.scss */\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/* line 19, src/styles/common/_global.scss */\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* line 23, src/styles/common/_global.scss */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* line 29, src/styles/common/_global.scss */\n\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px;\n}\n\n/* line 42, src/styles/common/_global.scss */\n\nblockquote p:first-of-type {\n  margin-top: 0;\n}\n\n/* line 45, src/styles/common/_global.scss */\n\nbody {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 16px;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden;\n}\n\n/* line 59, src/styles/common/_global.scss */\n\nhtml {\n  box-sizing: border-box;\n  font-size: 16px;\n}\n\n/* line 64, src/styles/common/_global.scss */\n\nfigure {\n  margin: 0;\n}\n\n/* line 68, src/styles/common/_global.scss */\n\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 0.9375rem;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n/* line 89, src/styles/common/_global.scss */\n\nkbd,\nsamp,\ncode {\n  background: #f7f7f7;\n  border-radius: 4px;\n  color: #c7254e;\n  font-family: \"Roboto Mono\", Dank Mono, Fira Mono, monospace !important;\n  font-size: 15px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\n/* line 99, src/styles/common/_global.scss */\n\npre {\n  background-color: #f7f7f7 !important;\n  border-radius: 4px;\n  font-family: \"Roboto Mono\", Dank Mono, Fira Mono, monospace !important;\n  font-size: 15px;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal;\n}\n\n/* line 111, src/styles/common/_global.scss */\n\npre code {\n  background: transparent;\n  color: #37474f;\n  padding: 0;\n  text-shadow: 0 1px #fff;\n}\n\n/* line 119, src/styles/common/_global.scss */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #37474f;\n  line-height: 1.4;\n}\n\n/* line 124, src/styles/common/_global.scss */\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\n/* line 126, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\n/* line 129, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\n/* line 140, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\n/* line 145, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\n/* line 155, src/styles/common/_global.scss */\n\nhr:not(.hr-list) {\n  margin: 40px auto 10px;\n  height: 1px;\n  background-color: #ddd;\n  border: 0;\n  max-width: 100%;\n}\n\n/* line 163, src/styles/common/_global.scss */\n\n.post-footer-hr {\n  margin: 32px 0;\n}\n\n/* line 170, src/styles/common/_global.scss */\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\n/* line 176, src/styles/common/_global.scss */\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n/* line 181, src/styles/common/_global.scss */\n\ni {\n  vertical-align: middle;\n}\n\n/* line 186, src/styles/common/_global.scss */\n\ninput {\n  border: none;\n  outline: 0;\n}\n\n/* line 191, src/styles/common/_global.scss */\n\nol,\nul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\n/* line 198, src/styles/common/_global.scss */\n\nmark {\n  background-color: transparent !important;\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 204, src/styles/common/_global.scss */\n\nq {\n  color: rgba(0, 0, 0, 0.44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left;\n}\n\n/* line 216, src/styles/common/_global.scss */\n\nq::before,\nq::after {\n  display: none;\n}\n\n/* line 219, src/styles/common/_global.scss */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n/* line 234, src/styles/common/_global.scss */\n\ntable th,\ntable td {\n  padding: 6px 13px;\n  border: 1px solid #dfe2e5;\n}\n\n/* line 240, src/styles/common/_global.scss */\n\ntable tr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\n/* line 244, src/styles/common/_global.scss */\n\ntable th {\n  letter-spacing: 0.2px;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n\n/* line 258, src/styles/common/_global.scss */\n\n.link--underline:active,\n.link--underline:focus,\n.link--underline:hover {\n  text-decoration: underline;\n}\n\n/* line 268, src/styles/common/_global.scss */\n\n.main {\n  margin-bottom: 4em;\n  min-height: 90vh;\n}\n\n/* line 270, src/styles/common/_global.scss */\n\n.main,\n.footer {\n  transition: transform .5s ease;\n}\n\n/* line 275, src/styles/common/_global.scss */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n/* line 278, src/styles/common/_global.scss */\n\n.warning::before {\n  content: \"\";\n}\n\n/* line 281, src/styles/common/_global.scss */\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n/* line 284, src/styles/common/_global.scss */\n\n.note::before {\n  content: \"\";\n}\n\n/* line 287, src/styles/common/_global.scss */\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n/* line 290, src/styles/common/_global.scss */\n\n.success::before {\n  color: #00bfa5;\n  content: \"\";\n}\n\n/* line 293, src/styles/common/_global.scss */\n\n.warning,\n.note,\n.success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px;\n}\n\n/* line 300, src/styles/common/_global.scss */\n\n.warning a,\n.note a,\n.success a {\n  color: inherit;\n  text-decoration: underline;\n}\n\n/* line 305, src/styles/common/_global.scss */\n\n.warning::before,\n.note::before,\n.success::before {\n  float: left;\n  font-size: 24px;\n  margin-left: -36px;\n  margin-top: -5px;\n}\n\n/* line 318, src/styles/common/_global.scss */\n\n.tag-description {\n  max-width: 700px;\n  font-size: 1.2rem;\n  font-weight: 300;\n  line-height: 1.4;\n}\n\n/* line 324, src/styles/common/_global.scss */\n\n.tag.has--image {\n  min-height: 350px;\n}\n\n/* line 329, src/styles/common/_global.scss */\n\n.with-tooltip {\n  overflow: visible;\n  position: relative;\n}\n\n/* line 333, src/styles/common/_global.scss */\n\n.with-tooltip::after {\n  background: rgba(0, 0, 0, 0.85);\n  border-radius: 4px;\n  color: #fff;\n  content: attr(data-tooltip);\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 600;\n  left: 50%;\n  line-height: 1.25;\n  min-width: 130px;\n  opacity: 0;\n  padding: 4px 8px;\n  pointer-events: none;\n  position: absolute;\n  text-align: center;\n  text-transform: none;\n  top: -30px;\n  will-change: opacity, transform;\n  z-index: 1;\n}\n\n/* line 355, src/styles/common/_global.scss */\n\n.with-tooltip:hover::after {\n  animation: tooltip .1s ease-out both;\n}\n\n/* line 362, src/styles/common/_global.scss */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n}\n\n/* line 365, src/styles/common/_global.scss */\n\n.errorPage-link {\n  left: -5px;\n  padding: 24px 60px;\n  top: -6px;\n}\n\n/* line 371, src/styles/common/_global.scss */\n\n.errorPage-text {\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n/* line 376, src/styles/common/_global.scss */\n\n.errorPage-wrap {\n  color: rgba(0, 0, 0, 0.4);\n  padding: 7vw 4vw;\n}\n\n/* line 384, src/styles/common/_global.scss */\n\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%;\n}\n\n/* line 393, src/styles/common/_global.scss */\n\n.video-responsive iframe {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 403, src/styles/common/_global.scss */\n\n.video-responsive video {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 414, src/styles/common/_global.scss */\n\n.kg-embed-card .video-responsive {\n  margin-top: 0;\n}\n\n/* line 420, src/styles/common/_global.scss */\n\n.kg-gallery-container {\n  display: flex;\n  flex-direction: column;\n  max-width: 100%;\n  width: 100%;\n}\n\n/* line 427, src/styles/common/_global.scss */\n\n.kg-gallery-row {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n}\n\n/* line 432, src/styles/common/_global.scss */\n\n.kg-gallery-row:not(:first-of-type) {\n  margin: 0.75em 0 0 0;\n}\n\n/* line 436, src/styles/common/_global.scss */\n\n.kg-gallery-image img {\n  display: block;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n}\n\n/* line 443, src/styles/common/_global.scss */\n\n.kg-gallery-image:not(:first-of-type) {\n  margin: 0 0 0 0.75em;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-facebook {\n  color: #3b5998 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-facebook,\n.sideNav-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-twitter {\n  color: #55acee !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-twitter,\n.sideNav-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-google {\n  color: #dd4b39 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-google,\n.sideNav-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-instagram {\n  color: #306088 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-instagram,\n.sideNav-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-youtube {\n  color: #e52d27 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-youtube,\n.sideNav-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-github {\n  color: #555 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-github,\n.sideNav-follow .i-github {\n  background-color: #555 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-linkedin {\n  color: #007bb6 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-linkedin,\n.sideNav-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-spotify {\n  color: #2ebd59 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-spotify,\n.sideNav-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-codepen {\n  color: #222 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-codepen,\n.sideNav-follow .i-codepen {\n  background-color: #222 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-behance {\n  color: #131418 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-behance,\n.sideNav-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-dribbble {\n  color: #ea4c89 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-dribbble,\n.sideNav-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-flickr {\n  color: #0063dc !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-flickr,\n.sideNav-follow .i-flickr {\n  background-color: #0063dc !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-reddit {\n  color: #ff4500 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-reddit,\n.sideNav-follow .i-reddit {\n  background-color: #ff4500 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-pocket {\n  color: #f50057 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-pocket,\n.sideNav-follow .i-pocket {\n  background-color: #f50057 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-pinterest {\n  color: #bd081c !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-pinterest,\n.sideNav-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-whatsapp {\n  color: #64d448 !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-whatsapp,\n.sideNav-follow .i-whatsapp {\n  background-color: #64d448 !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-telegram {\n  color: #08c !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-telegram,\n.sideNav-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-discord {\n  color: #7289da !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-discord,\n.sideNav-follow .i-discord {\n  background-color: #7289da !important;\n}\n\n/* line 450, src/styles/common/_global.scss */\n\n.c-rss {\n  color: orange !important;\n}\n\n/* line 451, src/styles/common/_global.scss */\n\n.bg-rss,\n.sideNav-follow .i-rss {\n  background-color: orange !important;\n}\n\n/* line 474, src/styles/common/_global.scss */\n\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5;\n}\n\n/* line 482, src/styles/common/_global.scss */\n\n.rocket:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 487, src/styles/common/_global.scss */\n\n.svgIcon {\n  display: inline-block;\n}\n\n/* line 491, src/styles/common/_global.scss */\n\nsvg {\n  height: auto;\n  width: 100%;\n}\n\n/* line 499, src/styles/common/_global.scss */\n\n.load-more {\n  max-width: 70% !important;\n}\n\n/* line 504, src/styles/common/_global.scss */\n\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  z-index: 800;\n}\n\n/* line 516, src/styles/common/_global.scss */\n\n.is-loading .loadingBar {\n  animation: loading-bar 1s ease-in-out infinite;\n  animation-delay: .8s;\n  display: block;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 525, src/styles/common/_global.scss */\n\n  blockquote {\n    margin-left: -5px;\n    font-size: 1.125rem;\n  }\n\n  /* line 527, src/styles/common/_global.scss */\n\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px;\n  }\n}\n\n/* line 2, src/styles/components/_grid.scss */\n\n.extreme-container {\n  box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 100%;\n}\n\n/* line 26, src/styles/components/_grid.scss */\n\n.col-left,\n.cc-video-left {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px;\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 39, src/styles/components/_grid.scss */\n\n  .col-left {\n    max-width: calc(100% - 340px);\n  }\n\n  /* line 40, src/styles/components/_grid.scss */\n\n  .cc-video-left {\n    max-width: calc(100% - 320px);\n  }\n\n  /* line 41, src/styles/components/_grid.scss */\n\n  .cc-video-right {\n    flex-basis: 320px !important;\n    max-width: 320px !important;\n  }\n\n  /* line 42, src/styles/components/_grid.scss */\n\n  body.is-article .col-left {\n    padding-right: 40px;\n  }\n}\n\n/* line 45, src/styles/components/_grid.scss */\n\n.col-right {\n  display: flex;\n  flex-direction: column;\n  padding-left: 12px;\n  padding-right: 12px;\n  width: 330px;\n}\n\n/* line 53, src/styles/components/_grid.scss */\n\n.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  flex: 0 1 auto;\n  margin-left: -12px;\n  margin-right: -12px;\n}\n\n/* line 61, src/styles/components/_grid.scss */\n\n.row .col {\n  flex: 0 0 auto;\n  box-sizing: border-box;\n  padding-left: 12px;\n  padding-right: 12px;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s1 {\n  flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s2 {\n  flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s3 {\n  flex-basis: 25%;\n  max-width: 25%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s4 {\n  flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s5 {\n  flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s6 {\n  flex-basis: 50%;\n  max-width: 50%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s7 {\n  flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s8 {\n  flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s9 {\n  flex-basis: 75%;\n  max-width: 75%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s10 {\n  flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s11 {\n  flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n/* line 72, src/styles/components/_grid.scss */\n\n.row .col.s12 {\n  flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 87, src/styles/components/_grid.scss */\n\n  .row .col.m12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 103, src/styles/components/_grid.scss */\n\n  .row .col.l12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n/* line 3, src/styles/common/_typography.scss */\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  color: inherit;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  margin: 0;\n}\n\n/* line 10, src/styles/common/_typography.scss */\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\n/* line 16, src/styles/common/_typography.scss */\n\nh1 {\n  font-size: 2rem;\n}\n\n/* line 17, src/styles/common/_typography.scss */\n\nh2 {\n  font-size: 1.875rem;\n}\n\n/* line 18, src/styles/common/_typography.scss */\n\nh3 {\n  font-size: 1.6rem;\n}\n\n/* line 19, src/styles/common/_typography.scss */\n\nh4 {\n  font-size: 1.4rem;\n}\n\n/* line 20, src/styles/common/_typography.scss */\n\nh5 {\n  font-size: 1.2rem;\n}\n\n/* line 21, src/styles/common/_typography.scss */\n\nh6 {\n  font-size: 1rem;\n}\n\n/* line 23, src/styles/common/_typography.scss */\n\np {\n  margin: 0;\n}\n\n/* line 2, src/styles/common/_utilities.scss */\n\n.u-textColorNormal {\n  color: #999999 !important;\n  fill: #999999 !important;\n}\n\n/* line 9, src/styles/common/_utilities.scss */\n\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important;\n}\n\n/* line 14, src/styles/common/_utilities.scss */\n\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, 0.6);\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 19, src/styles/common/_utilities.scss */\n\n.u-accentColor--iconNormal {\n  color: #1C9963;\n  fill: #1C9963;\n}\n\n/* line 25, src/styles/common/_utilities.scss */\n\n.u-bgColor {\n  background-color: var(--primary-color);\n}\n\n/* line 30, src/styles/common/_utilities.scss */\n\n.u-relative {\n  position: relative;\n}\n\n/* line 31, src/styles/common/_utilities.scss */\n\n.u-absolute {\n  position: absolute;\n}\n\n/* line 33, src/styles/common/_utilities.scss */\n\n.u-fixed {\n  position: fixed !important;\n}\n\n/* line 35, src/styles/common/_utilities.scss */\n\n.u-block {\n  display: block !important;\n}\n\n/* line 36, src/styles/common/_utilities.scss */\n\n.u-inlineBlock {\n  display: inline-block;\n}\n\n/* line 39, src/styles/common/_utilities.scss */\n\n.u-backgroundDark {\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n/* line 50, src/styles/common/_utilities.scss */\n\n.u-bgGradient {\n  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 29%, rgba(0, 0, 0, 0.7) 81%);\n}\n\n/* line 52, src/styles/common/_utilities.scss */\n\n.u-bgBlack {\n  background-color: #000;\n}\n\n/* line 54, src/styles/common/_utilities.scss */\n\n.u-gradient {\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1;\n}\n\n/* line 65, src/styles/common/_utilities.scss */\n\n.zindex1 {\n  z-index: 1;\n}\n\n/* line 66, src/styles/common/_utilities.scss */\n\n.zindex2 {\n  z-index: 2;\n}\n\n/* line 67, src/styles/common/_utilities.scss */\n\n.zindex3 {\n  z-index: 3;\n}\n\n/* line 68, src/styles/common/_utilities.scss */\n\n.zindex4 {\n  z-index: 4;\n}\n\n/* line 71, src/styles/common/_utilities.scss */\n\n.u-backgroundWhite {\n  background-color: #fafafa;\n}\n\n/* line 72, src/styles/common/_utilities.scss */\n\n.u-backgroundColorGrayLight {\n  background-color: #f0f0f0 !important;\n}\n\n/* line 75, src/styles/common/_utilities.scss */\n\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* line 82, src/styles/common/_utilities.scss */\n\n.u-fontSizeMicro {\n  font-size: 11px;\n}\n\n/* line 83, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmallest {\n  font-size: 12px;\n}\n\n/* line 84, src/styles/common/_utilities.scss */\n\n.u-fontSize13 {\n  font-size: 13px;\n}\n\n/* line 85, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmaller {\n  font-size: 14px;\n}\n\n/* line 86, src/styles/common/_utilities.scss */\n\n.u-fontSize15 {\n  font-size: 15px;\n}\n\n/* line 87, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmall {\n  font-size: 16px;\n}\n\n/* line 88, src/styles/common/_utilities.scss */\n\n.u-fontSizeBase {\n  font-size: 18px;\n}\n\n/* line 89, src/styles/common/_utilities.scss */\n\n.u-fontSize20 {\n  font-size: 20px;\n}\n\n/* line 90, src/styles/common/_utilities.scss */\n\n.u-fontSize21 {\n  font-size: 21px;\n}\n\n/* line 91, src/styles/common/_utilities.scss */\n\n.u-fontSize22 {\n  font-size: 22px;\n}\n\n/* line 92, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarge {\n  font-size: 24px;\n}\n\n/* line 93, src/styles/common/_utilities.scss */\n\n.u-fontSize26 {\n  font-size: 26px;\n}\n\n/* line 94, src/styles/common/_utilities.scss */\n\n.u-fontSize28 {\n  font-size: 28px;\n}\n\n/* line 95, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarger,\n.media-type {\n  font-size: 32px;\n}\n\n/* line 96, src/styles/common/_utilities.scss */\n\n.u-fontSize36 {\n  font-size: 36px;\n}\n\n/* line 97, src/styles/common/_utilities.scss */\n\n.u-fontSize40 {\n  font-size: 40px;\n}\n\n/* line 98, src/styles/common/_utilities.scss */\n\n.u-fontSizeLargest {\n  font-size: 44px;\n}\n\n/* line 99, src/styles/common/_utilities.scss */\n\n.u-fontSizeJumbo {\n  font-size: 50px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 102, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeBase {\n    font-size: 18px;\n  }\n\n  /* line 103, src/styles/common/_utilities.scss */\n\n  .u-md-fontSize22 {\n    font-size: 22px;\n  }\n\n  /* line 104, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeLarger {\n    font-size: 32px;\n  }\n}\n\n/* line 120, src/styles/common/_utilities.scss */\n\n.u-fontWeightThin {\n  font-weight: 300;\n}\n\n/* line 121, src/styles/common/_utilities.scss */\n\n.u-fontWeightNormal {\n  font-weight: 400;\n}\n\n/* line 122, src/styles/common/_utilities.scss */\n\n.u-fontWeightMedium {\n  font-weight: 500;\n}\n\n/* line 123, src/styles/common/_utilities.scss */\n\n.u-fontWeightSemibold {\n  font-weight: 600;\n}\n\n/* line 124, src/styles/common/_utilities.scss */\n\n.u-fontWeightBold {\n  font-weight: 700;\n}\n\n/* line 126, src/styles/common/_utilities.scss */\n\n.u-textUppercase {\n  text-transform: uppercase;\n}\n\n/* line 127, src/styles/common/_utilities.scss */\n\n.u-textCapitalize {\n  text-transform: capitalize;\n}\n\n/* line 128, src/styles/common/_utilities.scss */\n\n.u-textAlignCenter {\n  text-align: center;\n}\n\n/* line 130, src/styles/common/_utilities.scss */\n\n.u-textShadow {\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n}\n\n/* line 132, src/styles/common/_utilities.scss */\n\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n/* line 139, src/styles/common/_utilities.scss */\n\n.u-marginAuto {\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 140, src/styles/common/_utilities.scss */\n\n.u-marginTop20 {\n  margin-top: 20px;\n}\n\n/* line 141, src/styles/common/_utilities.scss */\n\n.u-marginTop30 {\n  margin-top: 30px;\n}\n\n/* line 142, src/styles/common/_utilities.scss */\n\n.u-marginBottom10 {\n  margin-bottom: 10px;\n}\n\n/* line 143, src/styles/common/_utilities.scss */\n\n.u-marginBottom15 {\n  margin-bottom: 15px;\n}\n\n/* line 144, src/styles/common/_utilities.scss */\n\n.u-marginBottom20 {\n  margin-bottom: 20px !important;\n}\n\n/* line 145, src/styles/common/_utilities.scss */\n\n.u-marginBottom30 {\n  margin-bottom: 30px;\n}\n\n/* line 146, src/styles/common/_utilities.scss */\n\n.u-marginBottom40 {\n  margin-bottom: 40px;\n}\n\n/* line 149, src/styles/common/_utilities.scss */\n\n.u-padding0 {\n  padding: 0 !important;\n}\n\n/* line 150, src/styles/common/_utilities.scss */\n\n.u-padding20 {\n  padding: 20px;\n}\n\n/* line 151, src/styles/common/_utilities.scss */\n\n.u-padding15 {\n  padding: 15px !important;\n}\n\n/* line 152, src/styles/common/_utilities.scss */\n\n.u-paddingBottom2 {\n  padding-bottom: 2px;\n}\n\n/* line 153, src/styles/common/_utilities.scss */\n\n.u-paddingBottom30 {\n  padding-bottom: 30px;\n}\n\n/* line 154, src/styles/common/_utilities.scss */\n\n.u-paddingBottom20 {\n  padding-bottom: 20px;\n}\n\n/* line 155, src/styles/common/_utilities.scss */\n\n.u-paddingRight10 {\n  padding-right: 10px;\n}\n\n/* line 156, src/styles/common/_utilities.scss */\n\n.u-paddingLeft15 {\n  padding-left: 15px;\n}\n\n/* line 158, src/styles/common/_utilities.scss */\n\n.u-paddingTop2 {\n  padding-top: 2px;\n}\n\n/* line 159, src/styles/common/_utilities.scss */\n\n.u-paddingTop5 {\n  padding-top: 5px;\n}\n\n/* line 160, src/styles/common/_utilities.scss */\n\n.u-paddingTop10 {\n  padding-top: 10px;\n}\n\n/* line 161, src/styles/common/_utilities.scss */\n\n.u-paddingTop15 {\n  padding-top: 15px;\n}\n\n/* line 162, src/styles/common/_utilities.scss */\n\n.u-paddingTop20 {\n  padding-top: 20px;\n}\n\n/* line 163, src/styles/common/_utilities.scss */\n\n.u-paddingTop30 {\n  padding-top: 30px;\n}\n\n/* line 165, src/styles/common/_utilities.scss */\n\n.u-paddingBottom15 {\n  padding-bottom: 15px;\n}\n\n/* line 167, src/styles/common/_utilities.scss */\n\n.u-paddingRight20 {\n  padding-right: 20px;\n}\n\n/* line 168, src/styles/common/_utilities.scss */\n\n.u-paddingLeft20 {\n  padding-left: 20px;\n}\n\n/* line 170, src/styles/common/_utilities.scss */\n\n.u-contentTitle {\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-style: normal;\n  font-weight: 700;\n  letter-spacing: -.028em;\n}\n\n/* line 178, src/styles/common/_utilities.scss */\n\n.u-lineHeight1 {\n  line-height: 1;\n}\n\n/* line 179, src/styles/common/_utilities.scss */\n\n.u-lineHeightTight {\n  line-height: 1.2;\n}\n\n/* line 182, src/styles/common/_utilities.scss */\n\n.u-overflowHidden {\n  overflow: hidden;\n}\n\n/* line 185, src/styles/common/_utilities.scss */\n\n.u-floatRight {\n  float: right;\n}\n\n/* line 186, src/styles/common/_utilities.scss */\n\n.u-floatLeft {\n  float: left;\n}\n\n/* line 189, src/styles/common/_utilities.scss */\n\n.u-flex {\n  display: flex;\n}\n\n/* line 190, src/styles/common/_utilities.scss */\n\n.u-flexCenter,\n.media-type {\n  align-items: center;\n  display: flex;\n}\n\n/* line 191, src/styles/common/_utilities.scss */\n\n.u-flexContentCenter,\n.media-type {\n  justify-content: center;\n}\n\n/* line 193, src/styles/common/_utilities.scss */\n\n.u-flex1 {\n  flex: 1 1 auto;\n}\n\n/* line 194, src/styles/common/_utilities.scss */\n\n.u-flex0 {\n  flex: 0 0 auto;\n}\n\n/* line 195, src/styles/common/_utilities.scss */\n\n.u-flexWrap {\n  flex-wrap: wrap;\n}\n\n/* line 197, src/styles/common/_utilities.scss */\n\n.u-flexColumn {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n/* line 203, src/styles/common/_utilities.scss */\n\n.u-flexEnd {\n  align-items: center;\n  justify-content: flex-end;\n}\n\n/* line 208, src/styles/common/_utilities.scss */\n\n.u-flexColumnTop {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n}\n\n/* line 215, src/styles/common/_utilities.scss */\n\n.u-bgCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover;\n}\n\n/* line 222, src/styles/common/_utilities.scss */\n\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 16px;\n  padding-right: 16px;\n}\n\n/* line 229, src/styles/common/_utilities.scss */\n\n.u-maxWidth1200 {\n  max-width: 1200px;\n}\n\n/* line 230, src/styles/common/_utilities.scss */\n\n.u-maxWidth1000 {\n  max-width: 1000px;\n}\n\n/* line 231, src/styles/common/_utilities.scss */\n\n.u-maxWidth740 {\n  max-width: 740px;\n}\n\n/* line 232, src/styles/common/_utilities.scss */\n\n.u-maxWidth1040 {\n  max-width: 1040px;\n}\n\n/* line 233, src/styles/common/_utilities.scss */\n\n.u-sizeFullWidth {\n  width: 100%;\n}\n\n/* line 234, src/styles/common/_utilities.scss */\n\n.u-sizeFullHeight {\n  height: 100%;\n}\n\n/* line 237, src/styles/common/_utilities.scss */\n\n.u-borderLighter {\n  border: 1px solid rgba(0, 0, 0, 0.15);\n}\n\n/* line 238, src/styles/common/_utilities.scss */\n\n.u-round,\n.avatar-image,\n.media-type {\n  border-radius: 50%;\n}\n\n/* line 239, src/styles/common/_utilities.scss */\n\n.u-borderRadius2 {\n  border-radius: 2px;\n}\n\n/* line 241, src/styles/common/_utilities.scss */\n\n.u-boxShadowBottom {\n  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05);\n}\n\n/* line 246, src/styles/common/_utilities.scss */\n\n.u-height540 {\n  height: 540px;\n}\n\n/* line 247, src/styles/common/_utilities.scss */\n\n.u-height280 {\n  height: 280px;\n}\n\n/* line 248, src/styles/common/_utilities.scss */\n\n.u-height260 {\n  height: 260px;\n}\n\n/* line 249, src/styles/common/_utilities.scss */\n\n.u-height100 {\n  height: 100px;\n}\n\n/* line 250, src/styles/common/_utilities.scss */\n\n.u-borderBlackLightest {\n  border: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n/* line 253, src/styles/common/_utilities.scss */\n\n.u-hide {\n  display: none !important;\n}\n\n/* line 256, src/styles/common/_utilities.scss */\n\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.09);\n  border-radius: 3px;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px;\n}\n\n/* line 267, src/styles/common/_utilities.scss */\n\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n/* line 272, src/styles/common/_utilities.scss */\n\n.title-line::before {\n  content: '';\n  background: rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  position: absolute;\n  left: 0;\n  bottom: 50%;\n  width: 100%;\n  height: 1px;\n  z-index: 0;\n}\n\n/* line 286, src/styles/common/_utilities.scss */\n\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 15px;\n  font-weight: 500;\n  letter-spacing: 0.03em;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  transform: skewX(-15deg);\n}\n\n/* line 299, src/styles/common/_utilities.scss */\n\n.no-avatar {\n  background-image: url(\"./../images/avatar.png\") !important;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 304, src/styles/common/_utilities.scss */\n\n  .u-hide-before-md {\n    display: none !important;\n  }\n\n  /* line 305, src/styles/common/_utilities.scss */\n\n  .u-md-heightAuto {\n    height: auto;\n  }\n\n  /* line 306, src/styles/common/_utilities.scss */\n\n  .u-md-height170 {\n    height: 170px;\n  }\n\n  /* line 307, src/styles/common/_utilities.scss */\n\n  .u-md-relative {\n    position: relative;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 310, src/styles/common/_utilities.scss */\n\n  .u-hide-before-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 313, src/styles/common/_utilities.scss */\n\n  .u-hide-after-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 315, src/styles/common/_utilities.scss */\n\n  .u-hide-after-lg {\n    display: none !important;\n  }\n}\n\n/* line 1, src/styles/components/_form.scss */\n\n.button {\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  box-sizing: border-box;\n  color: rgba(0, 0, 0, 0.44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n/* line 45, src/styles/components/_form.scss */\n\n.button--large {\n  font-size: 15px;\n  height: 44px;\n  line-height: 42px;\n  padding: 0 18px;\n}\n\n/* line 52, src/styles/components/_form.scss */\n\n.button--dark {\n  background: rgba(0, 0, 0, 0.84);\n  border-color: rgba(0, 0, 0, 0.84);\n  color: rgba(255, 255, 255, 0.97);\n}\n\n/* line 57, src/styles/components/_form.scss */\n\n.button--dark:hover {\n  background: #1C9963;\n  border-color: #1C9963;\n}\n\n/* line 65, src/styles/components/_form.scss */\n\n.button--primary {\n  border-color: #1C9963;\n  color: #1C9963;\n}\n\n/* line 111, src/styles/components/_form.scss */\n\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px;\n}\n\n/* line 124, src/styles/components/_form.scss */\n\n.tag-button {\n  background: rgba(0, 0, 0, 0.05);\n  border: none;\n  color: rgba(0, 0, 0, 0.68);\n  font-weight: 500;\n  margin: 0 8px 8px 0;\n}\n\n/* line 131, src/styles/components/_form.scss */\n\n.tag-button:hover {\n  background: rgba(0, 0, 0, 0.1);\n  color: rgba(0, 0, 0, 0.68);\n}\n\n/* line 139, src/styles/components/_form.scss */\n\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 500;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  width: 100%;\n}\n\n/* line 150, src/styles/components/_form.scss */\n\n.button--dark-line:hover {\n  color: #fff;\n  box-shadow: inset 0 -50px 8px -4px #000;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"./../fonts/mapache.eot\");\n  src: url(\"./../fonts/mapache.eot\") format(\"embedded-opentype\"), url(\"./../fonts/mapache.ttf\") format(\"truetype\"), url(\"./../fonts/mapache.woff\") format(\"woff\"), url(\"./../fonts/mapache.svg\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n/* line 17, src/styles/components/_icons.scss */\n\n.i-tag:before {\n  content: \"\\e911\";\n}\n\n/* line 20, src/styles/components/_icons.scss */\n\n.i-discord:before {\n  content: \"\\e90a\";\n}\n\n/* line 23, src/styles/components/_icons.scss */\n\n.i-arrow-round-next:before {\n  content: \"\\e90c\";\n}\n\n/* line 26, src/styles/components/_icons.scss */\n\n.i-arrow-round-prev:before {\n  content: \"\\e90d\";\n}\n\n/* line 29, src/styles/components/_icons.scss */\n\n.i-arrow-round-up:before {\n  content: \"\\e90e\";\n}\n\n/* line 32, src/styles/components/_icons.scss */\n\n.i-arrow-round-down:before {\n  content: \"\\e90f\";\n}\n\n/* line 35, src/styles/components/_icons.scss */\n\n.i-photo:before {\n  content: \"\\e90b\";\n}\n\n/* line 38, src/styles/components/_icons.scss */\n\n.i-send:before {\n  content: \"\\e909\";\n}\n\n/* line 41, src/styles/components/_icons.scss */\n\n.i-audio:before {\n  content: \"\\e901\";\n}\n\n/* line 44, src/styles/components/_icons.scss */\n\n.i-rocket:before {\n  content: \"\\e902\";\n  color: #999;\n}\n\n/* line 48, src/styles/components/_icons.scss */\n\n.i-comments-line:before {\n  content: \"\\e900\";\n}\n\n/* line 51, src/styles/components/_icons.scss */\n\n.i-globe:before {\n  content: \"\\e906\";\n}\n\n/* line 54, src/styles/components/_icons.scss */\n\n.i-star:before {\n  content: \"\\e907\";\n}\n\n/* line 57, src/styles/components/_icons.scss */\n\n.i-link:before {\n  content: \"\\e908\";\n}\n\n/* line 60, src/styles/components/_icons.scss */\n\n.i-star-line:before {\n  content: \"\\e903\";\n}\n\n/* line 63, src/styles/components/_icons.scss */\n\n.i-more:before {\n  content: \"\\e904\";\n}\n\n/* line 66, src/styles/components/_icons.scss */\n\n.i-search:before {\n  content: \"\\e905\";\n}\n\n/* line 69, src/styles/components/_icons.scss */\n\n.i-chat:before {\n  content: \"\\e910\";\n}\n\n/* line 72, src/styles/components/_icons.scss */\n\n.i-arrow-left:before {\n  content: \"\\e314\";\n}\n\n/* line 75, src/styles/components/_icons.scss */\n\n.i-arrow-right:before {\n  content: \"\\e315\";\n}\n\n/* line 78, src/styles/components/_icons.scss */\n\n.i-play:before {\n  content: \"\\e037\";\n}\n\n/* line 81, src/styles/components/_icons.scss */\n\n.i-location:before {\n  content: \"\\e8b4\";\n}\n\n/* line 84, src/styles/components/_icons.scss */\n\n.i-check-circle:before {\n  content: \"\\e86c\";\n}\n\n/* line 87, src/styles/components/_icons.scss */\n\n.i-close:before {\n  content: \"\\e5cd\";\n}\n\n/* line 90, src/styles/components/_icons.scss */\n\n.i-favorite:before {\n  content: \"\\e87d\";\n}\n\n/* line 93, src/styles/components/_icons.scss */\n\n.i-warning:before {\n  content: \"\\e002\";\n}\n\n/* line 96, src/styles/components/_icons.scss */\n\n.i-rss:before {\n  content: \"\\e0e5\";\n}\n\n/* line 99, src/styles/components/_icons.scss */\n\n.i-share:before {\n  content: \"\\e80d\";\n}\n\n/* line 102, src/styles/components/_icons.scss */\n\n.i-email:before {\n  content: \"\\f0e0\";\n}\n\n/* line 105, src/styles/components/_icons.scss */\n\n.i-google:before {\n  content: \"\\f1a0\";\n}\n\n/* line 108, src/styles/components/_icons.scss */\n\n.i-telegram:before {\n  content: \"\\f2c6\";\n}\n\n/* line 111, src/styles/components/_icons.scss */\n\n.i-reddit:before {\n  content: \"\\f281\";\n}\n\n/* line 114, src/styles/components/_icons.scss */\n\n.i-twitter:before {\n  content: \"\\f099\";\n}\n\n/* line 117, src/styles/components/_icons.scss */\n\n.i-github:before {\n  content: \"\\f09b\";\n}\n\n/* line 120, src/styles/components/_icons.scss */\n\n.i-linkedin:before {\n  content: \"\\f0e1\";\n}\n\n/* line 123, src/styles/components/_icons.scss */\n\n.i-youtube:before {\n  content: \"\\f16a\";\n}\n\n/* line 126, src/styles/components/_icons.scss */\n\n.i-stack-overflow:before {\n  content: \"\\f16c\";\n}\n\n/* line 129, src/styles/components/_icons.scss */\n\n.i-instagram:before {\n  content: \"\\f16d\";\n}\n\n/* line 132, src/styles/components/_icons.scss */\n\n.i-flickr:before {\n  content: \"\\f16e\";\n}\n\n/* line 135, src/styles/components/_icons.scss */\n\n.i-dribbble:before {\n  content: \"\\f17d\";\n}\n\n/* line 138, src/styles/components/_icons.scss */\n\n.i-behance:before {\n  content: \"\\f1b4\";\n}\n\n/* line 141, src/styles/components/_icons.scss */\n\n.i-spotify:before {\n  content: \"\\f1bc\";\n}\n\n/* line 144, src/styles/components/_icons.scss */\n\n.i-codepen:before {\n  content: \"\\f1cb\";\n}\n\n/* line 147, src/styles/components/_icons.scss */\n\n.i-facebook:before {\n  content: \"\\f230\";\n}\n\n/* line 150, src/styles/components/_icons.scss */\n\n.i-pinterest:before {\n  content: \"\\f231\";\n}\n\n/* line 153, src/styles/components/_icons.scss */\n\n.i-whatsapp:before {\n  content: \"\\f232\";\n}\n\n/* line 156, src/styles/components/_icons.scss */\n\n.i-snapchat:before {\n  content: \"\\f2ac\";\n}\n\n/* line 2, src/styles/components/_animated.scss */\n\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both;\n}\n\n/* line 6, src/styles/components/_animated.scss */\n\n.animated.infinite {\n  animation-iteration-count: infinite;\n}\n\n/* line 12, src/styles/components/_animated.scss */\n\n.bounceIn {\n  animation-name: bounceIn;\n}\n\n/* line 13, src/styles/components/_animated.scss */\n\n.bounceInDown {\n  animation-name: bounceInDown;\n}\n\n/* line 14, src/styles/components/_animated.scss */\n\n.pulse {\n  animation-name: pulse;\n}\n\n/* line 15, src/styles/components/_animated.scss */\n\n.slideInUp {\n  animation-name: slideInUp;\n}\n\n/* line 16, src/styles/components/_animated.scss */\n\n.slideOutDown {\n  animation-name: slideOutDown;\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    transform: none;\n  }\n}\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n}\n\n@keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes tooltip {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    transform: translate(-50%, 0);\n  }\n}\n\n@keyframes loading-bar {\n  0% {\n    transform: translateX(-100%);\n  }\n\n  40% {\n    transform: translateX(0);\n  }\n\n  60% {\n    transform: translateX(0);\n  }\n\n  100% {\n    transform: translateX(100%);\n  }\n}\n\n@keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n/* line 4, src/styles/layouts/_header.scss */\n\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15;\n}\n\n/* line 10, src/styles/layouts/_header.scss */\n\n.header {\n  box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: sticky;\n  top: 0;\n  transition: all .3s ease-in-out;\n  z-index: 10;\n}\n\n/* line 18, src/styles/layouts/_header.scss */\n\n.header-wrap {\n  height: 50px;\n}\n\n/* line 20, src/styles/layouts/_header.scss */\n\n.header-logo {\n  color: #fff !important;\n  height: 30px;\n}\n\n/* line 24, src/styles/layouts/_header.scss */\n\n.header-logo img {\n  max-height: 100%;\n}\n\n/* line 32, src/styles/layouts/_header.scss */\n\n.header-line {\n  height: 50px;\n  border-right: 1px solid rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  margin-right: 10px;\n}\n\n/* line 41, src/styles/layouts/_header.scss */\n\n.follow-more {\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0;\n}\n\n/* line 48, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-more {\n  width: auto;\n}\n\n/* line 49, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle {\n  color: var(--header-color-hover);\n}\n\n/* line 50, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle::before {\n  content: \"\\e5cd\";\n}\n\n/* line 56, src/styles/layouts/_header.scss */\n\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden;\n}\n\n/* line 62, src/styles/layouts/_header.scss */\n\n.nav ul {\n  display: flex;\n  margin-right: 20px;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n/* line 70, src/styles/layouts/_header.scss */\n\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 400;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle;\n}\n\n/* line 82, src/styles/layouts/_header.scss */\n\n.header-left a.active,\n.header-left a:hover,\n.nav ul li a.active,\n.nav ul li a:hover {\n  color: var(--header-color-hover);\n}\n\n/* line 89, src/styles/layouts/_header.scss */\n\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px;\n}\n\n/* line 95, src/styles/layouts/_header.scss */\n\n.menu--toggle span {\n  background-color: var(--header-color);\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  transition: .4s;\n  width: 20px;\n}\n\n/* line 106, src/styles/layouts/_header.scss */\n\n.menu--toggle span:first-child {\n  transform: translate(0, -6px);\n}\n\n/* line 107, src/styles/layouts/_header.scss */\n\n.menu--toggle span:last-child {\n  transform: translate(0, 6px);\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 115, src/styles/layouts/_header.scss */\n\n  .header-left {\n    flex-grow: 1 !important;\n  }\n\n  /* line 116, src/styles/layouts/_header.scss */\n\n  .header-logo span {\n    font-size: 24px;\n  }\n\n  /* line 119, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  /* line 122, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .sideNav {\n    transform: translateX(0);\n  }\n\n  /* line 124, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle {\n    border: 0;\n    transform: rotate(90deg);\n  }\n\n  /* line 128, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:first-child {\n    transform: rotate(45deg) translate(0, 0);\n  }\n\n  /* line 129, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:nth-child(2) {\n    transform: scaleX(0);\n  }\n\n  /* line 130, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:last-child {\n    transform: rotate(-45deg) translate(0, 0);\n  }\n\n  /* line 133, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    transform: translateX(-25%) !important;\n  }\n}\n\n/* line 4, src/styles/layouts/_footer.scss */\n\n.footer {\n  color: #888;\n}\n\n/* line 7, src/styles/layouts/_footer.scss */\n\n.footer a {\n  color: var(--footer-color-link);\n}\n\n/* line 9, src/styles/layouts/_footer.scss */\n\n.footer a:hover {\n  color: #fff;\n}\n\n/* line 12, src/styles/layouts/_footer.scss */\n\n.footer-links {\n  padding: 3em 0 2.5em;\n  background-color: #131313;\n}\n\n/* line 17, src/styles/layouts/_footer.scss */\n\n.footer .follow > a {\n  background: #333;\n  border-radius: 50%;\n  color: inherit;\n  display: inline-block;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 5px 8px;\n  text-align: center;\n  width: 40px;\n}\n\n/* line 28, src/styles/layouts/_footer.scss */\n\n.footer .follow > a:hover {\n  background: transparent;\n  box-shadow: inset 0 0 0 2px #333;\n}\n\n/* line 34, src/styles/layouts/_footer.scss */\n\n.footer-copy {\n  padding: 3em 0;\n  background-color: #000;\n}\n\n/* line 41, src/styles/layouts/_footer.scss */\n\n.footer-menu li {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 8px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 47, src/styles/layouts/_footer.scss */\n\n.footer-menu li a {\n  color: #888;\n}\n\n/* line 3, src/styles/layouts/_homepage.scss */\n\n.hmCover {\n  padding: 4px;\n}\n\n/* line 6, src/styles/layouts/_homepage.scss */\n\n.hmCover .st-cover {\n  padding: 4px;\n}\n\n/* line 9, src/styles/layouts/_homepage.scss */\n\n.hmCover .st-cover.firts {\n  height: 500px;\n}\n\n/* line 11, src/styles/layouts/_homepage.scss */\n\n.hmCover .st-cover.firts .st-cover-title {\n  font-size: 2rem;\n}\n\n/* line 18, src/styles/layouts/_homepage.scss */\n\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh;\n}\n\n/* line 22, src/styles/layouts/_homepage.scss */\n\n.hm-cover-title {\n  font-size: 2.5rem;\n  font-weight: 900;\n  line-height: 1;\n}\n\n/* line 28, src/styles/layouts/_homepage.scss */\n\n.hm-cover-des {\n  max-width: 600px;\n  font-size: 1.25rem;\n}\n\n/* line 34, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all .3s;\n  width: 100%;\n}\n\n/* line 49, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe:hover {\n  box-shadow: inset 0 0 0 2px #fff;\n}\n\n/* line 54, src/styles/layouts/_homepage.scss */\n\n.hm-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n/* line 65, src/styles/layouts/_homepage.scss */\n\n.hm-down svg {\n  display: block;\n  fill: currentcolor;\n  height: auto;\n  width: 100%;\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 77, src/styles/layouts/_homepage.scss */\n\n  .hmCover {\n    height: 70vh;\n  }\n\n  /* line 80, src/styles/layouts/_homepage.scss */\n\n  .hmCover .st-cover {\n    height: 50%;\n    width: 33.33333%;\n  }\n\n  /* line 84, src/styles/layouts/_homepage.scss */\n\n  .hmCover .st-cover.firts {\n    height: 100%;\n    width: 66.66666%;\n  }\n\n  /* line 87, src/styles/layouts/_homepage.scss */\n\n  .hmCover .st-cover.firts .st-cover-title {\n    font-size: 2.8rem;\n  }\n\n  /* line 93, src/styles/layouts/_homepage.scss */\n\n  .hm-cover-title {\n    font-size: 3.5rem;\n  }\n}\n\n/* line 6, src/styles/layouts/_post.scss */\n\n.post-title {\n  color: #000;\n  line-height: 1.2;\n  max-width: 1000px;\n}\n\n/* line 12, src/styles/layouts/_post.scss */\n\n.post-excerpt {\n  color: #555;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  letter-spacing: -.012em;\n  line-height: 1.6;\n}\n\n/* line 21, src/styles/layouts/_post.scss */\n\n.post-author-social {\n  vertical-align: middle;\n  margin-left: 2px;\n  padding: 0 3px;\n}\n\n/* line 27, src/styles/layouts/_post.scss */\n\n.post-image {\n  margin-top: 30px;\n}\n\n/* line 34, src/styles/layouts/_post.scss */\n\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle;\n}\n\n/* line 40, src/styles/layouts/_post.scss */\n\n.avatar-image--smaller {\n  width: 50px;\n  height: 50px;\n}\n\n/* line 48, src/styles/layouts/_post.scss */\n\n.post-inner {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n}\n\n/* line 54, src/styles/layouts/_post.scss */\n\n.post-inner a {\n  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.68) 50%, transparent 50%);\n  background-position: 0 1.12em;\n  background-repeat: repeat-x;\n  background-size: 2px .2em;\n  text-decoration: none;\n  word-break: break-word;\n}\n\n/* line 62, src/styles/layouts/_post.scss */\n\n.post-inner a:hover {\n  background-image: linear-gradient(to bottom, black 50%, transparent 50%);\n}\n\n/* line 65, src/styles/layouts/_post.scss */\n\n.post-inner img {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 71, src/styles/layouts/_post.scss */\n\n.post-inner h1,\n.post-inner h2,\n.post-inner h3,\n.post-inner h4,\n.post-inner h5,\n.post-inner h6 {\n  margin-top: 30px;\n  font-style: normal;\n  color: #000;\n  letter-spacing: -.02em;\n  line-height: 1.2;\n}\n\n/* line 79, src/styles/layouts/_post.scss */\n\n.post-inner h2 {\n  margin-top: 35px;\n}\n\n/* line 81, src/styles/layouts/_post.scss */\n\n.post-inner p {\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin-top: 25px;\n}\n\n/* line 89, src/styles/layouts/_post.scss */\n\n.post-inner ul,\n.post-inner ol {\n  counter-reset: post;\n  font-size: 1.125rem;\n  margin-top: 20px;\n}\n\n/* line 95, src/styles/layouts/_post.scss */\n\n.post-inner ul li,\n.post-inner ol li {\n  letter-spacing: -.003em;\n  margin-bottom: 14px;\n  margin-left: 30px;\n}\n\n/* line 100, src/styles/layouts/_post.scss */\n\n.post-inner ul li::before,\n.post-inner ol li::before {\n  box-sizing: border-box;\n  display: inline-block;\n  margin-left: -78px;\n  position: absolute;\n  text-align: right;\n  width: 78px;\n}\n\n/* line 111, src/styles/layouts/_post.scss */\n\n.post-inner ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n  padding-top: 3px;\n}\n\n/* line 118, src/styles/layouts/_post.scss */\n\n.post-inner ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px;\n}\n\n/* line 124, src/styles/layouts/_post.scss */\n\n.post-inner h1,\n.post-inner h2,\n.post-inner h3,\n.post-inner h4,\n.post-inner h5,\n.post-inner h6,\n.post-inner p,\n.post-inner ol,\n.post-inner ul,\n.post-inner hr,\n.post-inner pre,\n.post-inner dl,\n.post-inner blockquote,\n.post-inner table,\n.post-inner .kg-embed-card {\n  min-width: 100%;\n}\n\n/* line 129, src/styles/layouts/_post.scss */\n\n.post-inner > ul,\n.post-inner > iframe,\n.post-inner > img,\n.post-inner .kg-image-card,\n.post-inner .kg-card,\n.post-inner .kg-gallery-card,\n.post-inner .kg-embed-card {\n  margin-top: 30px !important;\n}\n\n/* line 142, src/styles/layouts/_post.scss */\n\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  transition: all .4s;\n  top: 30px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 150, src/styles/layouts/_post.scss */\n\n.sharePost a {\n  color: #fff;\n  margin: 8px 0 0;\n  display: block;\n}\n\n/* line 156, src/styles/layouts/_post.scss */\n\n.sharePost .i-chat {\n  background-color: #fff;\n  border: 2px solid #bbb;\n  color: #bbb;\n}\n\n/* line 162, src/styles/layouts/_post.scss */\n\n.sharePost .share-inner {\n  transition: visibility 0s linear 0s, opacity .3s 0s;\n}\n\n/* line 165, src/styles/layouts/_post.scss */\n\n.sharePost .share-inner.is-hidden {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0s linear .3s, opacity .3s 0s;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 176, src/styles/layouts/_post.scss */\n\n.mob-share .mapache-share {\n  height: 40px;\n  color: #fff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  box-shadow: none !important;\n}\n\n/* line 185, src/styles/layouts/_post.scss */\n\n.mob-share .share-title {\n  font-size: 14px;\n  margin-left: 10px;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 195, src/styles/layouts/_post.scss */\n\n.prev-next-span {\n  color: var(--composite-color);\n  font-weight: 700;\n  font-size: 13px;\n}\n\n/* line 200, src/styles/layouts/_post.scss */\n\n.prev-next-span i {\n  display: inline-flex;\n  transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n}\n\n/* line 206, src/styles/layouts/_post.scss */\n\n.prev-next-title {\n  margin: 0 !important;\n  font-size: 16px;\n  height: 2em;\n  overflow: hidden;\n  line-height: 1 !important;\n  text-overflow: ellipsis !important;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  display: -webkit-box !important;\n}\n\n/* line 219, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-right {\n  animation: arrow-move-right 0.5s ease-in-out forwards;\n}\n\n/* line 220, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-left {\n  animation: arrow-move-left 0.5s ease-in-out forwards;\n}\n\n/* line 226, src/styles/layouts/_post.scss */\n\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000;\n}\n\n/* line 231, src/styles/layouts/_post.scss */\n\n.cc-image-header {\n  right: 0;\n  bottom: 10%;\n  left: 0;\n}\n\n/* line 237, src/styles/layouts/_post.scss */\n\n.cc-image-figure img {\n  object-fit: cover;\n  width: 100%;\n}\n\n/* line 243, src/styles/layouts/_post.scss */\n\n.cc-image .post-header {\n  max-width: 800px;\n}\n\n/* line 245, src/styles/layouts/_post.scss */\n\n.cc-image .post-title,\n.cc-image .post-excerpt {\n  color: #fff;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);\n}\n\n/* line 254, src/styles/layouts/_post.scss */\n\n.cc-video {\n  background-color: #121212;\n  padding: 80px 0 30px;\n}\n\n/* line 258, src/styles/layouts/_post.scss */\n\n.cc-video .post-excerpt {\n  color: #aaa;\n  font-size: 1rem;\n}\n\n/* line 259, src/styles/layouts/_post.scss */\n\n.cc-video .post-title {\n  color: #fff;\n  font-size: 1.8rem;\n}\n\n/* line 260, src/styles/layouts/_post.scss */\n\n.cc-video .kg-embed-card,\n.cc-video .video-responsive {\n  margin-top: 0;\n}\n\n/* line 262, src/styles/layouts/_post.scss */\n\n.cc-video-subscribe {\n  background-color: #121212;\n  color: #fff;\n  line-height: 1;\n  padding: 0 10px;\n  z-index: 1;\n}\n\n/* line 273, src/styles/layouts/_post.scss */\n\nbody.is-article .main {\n  margin-bottom: 0;\n}\n\n/* line 274, src/styles/layouts/_post.scss */\n\nbody.share-margin .sharePost {\n  top: -60px;\n}\n\n/* line 276, src/styles/layouts/_post.scss */\n\nbody.has-cover .post-primary-tag {\n  display: block !important;\n}\n\n/* line 279, src/styles/layouts/_post.scss */\n\nbody.is-article-single .post-body-wrap {\n  margin-left: 0 !important;\n}\n\n/* line 280, src/styles/layouts/_post.scss */\n\nbody.is-article-single .sharePost {\n  left: -100px;\n}\n\n/* line 281, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-full .kg-image {\n  max-width: 100vw;\n}\n\n/* line 282, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-wide .kg-image {\n  max-width: 1040px;\n}\n\n/* line 284, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-gallery-container {\n  max-width: 1040px;\n  width: 100vw;\n}\n\n/* line 296, src/styles/layouts/_post.scss */\n\nbody.is-video .story-small h3 {\n  font-weight: 400;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 302, src/styles/layouts/_post.scss */\n\n  .post-inner q {\n    font-size: 20px !important;\n    letter-spacing: -.008em !important;\n    line-height: 1.4 !important;\n  }\n\n  /* line 308, src/styles/layouts/_post.scss */\n\n  .post-inner ol,\n  .post-inner ul,\n  .post-inner p {\n    font-size: 1rem;\n    letter-spacing: -.004em;\n    line-height: 1.58;\n  }\n\n  /* line 314, src/styles/layouts/_post.scss */\n\n  .post-inner iframe {\n    width: 100% !important;\n  }\n\n  /* line 318, src/styles/layouts/_post.scss */\n\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%;\n  }\n\n  /* line 324, src/styles/layouts/_post.scss */\n\n  .cc-image-header {\n    bottom: 24px;\n  }\n\n  /* line 325, src/styles/layouts/_post.scss */\n\n  .cc-image .post-excerpt {\n    font-size: 18px;\n  }\n\n  /* line 328, src/styles/layouts/_post.scss */\n\n  .cc-video {\n    padding: 20px 0;\n  }\n\n  /* line 331, src/styles/layouts/_post.scss */\n\n  .cc-video-embed {\n    margin-left: -16px;\n    margin-right: -15px;\n  }\n\n  /* line 336, src/styles/layouts/_post.scss */\n\n  .cc-video .post-header {\n    margin-top: 10px;\n  }\n\n  /* line 340, src/styles/layouts/_post.scss */\n\n  .kg-width-wide .kg-image {\n    width: 100% !important;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 345, src/styles/layouts/_post.scss */\n\n  body.is-article .col-left {\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 352, src/styles/layouts/_post.scss */\n\n  .cc-image .post-title {\n    font-size: 3.2rem;\n  }\n\n  /* line 353, src/styles/layouts/_post.scss */\n\n  .prev-next-link {\n    margin: 0 !important;\n  }\n\n  /* line 354, src/styles/layouts/_post.scss */\n\n  .prev-next-right {\n    text-align: right;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 358, src/styles/layouts/_post.scss */\n\n  body.is-article .post-body-wrap {\n    margin-left: 70px;\n  }\n\n  /* line 362, src/styles/layouts/_post.scss */\n\n  body.is-video .post-author,\n  body.is-image .post-author {\n    margin-left: 70px;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  /* line 369, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-embed {\n    bottom: 20px;\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    height: 203px;\n    padding-bottom: 0;\n    position: fixed;\n    right: 20px;\n    width: 360px;\n    z-index: 8;\n  }\n\n  /* line 380, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-close {\n    background: #000;\n    border-radius: 50%;\n    color: #fff;\n    cursor: pointer;\n    display: block !important;\n    font-size: 14px;\n    height: 24px;\n    left: -10px;\n    line-height: 1;\n    padding-top: 5px;\n    position: absolute;\n    text-align: center;\n    top: -10px;\n    width: 24px;\n    z-index: 5;\n  }\n\n  /* line 398, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-cont {\n    height: 465px;\n  }\n\n  /* line 400, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-image-header {\n    bottom: 20%;\n  }\n}\n\n/* line 3, src/styles/layouts/_story.scss */\n\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0;\n}\n\n/* line 10, src/styles/layouts/_story.scss */\n\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px;\n}\n\n/* line 15, src/styles/layouts/_story.scss */\n\n.media-type {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9;\n}\n\n/* line 33, src/styles/layouts/_story.scss */\n\n.image-hover {\n  transition: transform .7s;\n  transform: translateZ(0);\n}\n\n/* line 45, src/styles/layouts/_story.scss */\n\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 500;\n  margin-bottom: 10px;\n}\n\n/* line 50, src/styles/layouts/_story.scss */\n\n.flow-meta-cat {\n  color: rgba(0, 0, 0, 0.84);\n}\n\n/* line 51, src/styles/layouts/_story.scss */\n\n.flow-meta .point {\n  margin: 0 5px;\n}\n\n/* line 58, src/styles/layouts/_story.scss */\n\n.story-image {\n  flex: 0 0 44%;\n  height: 235px;\n  margin-right: 30px;\n}\n\n/* line 63, src/styles/layouts/_story.scss */\n\n.story-image:hover .image-hover {\n  transform: scale(1.03);\n}\n\n/* line 66, src/styles/layouts/_story.scss */\n\n.story-lower {\n  flex-grow: 1;\n}\n\n/* line 68, src/styles/layouts/_story.scss */\n\n.story-excerpt {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  line-height: 1.5;\n}\n\n/* line 75, src/styles/layouts/_story.scss */\n\n.story h2 a:hover {\n  opacity: .6;\n}\n\n/* line 89, src/styles/layouts/_story.scss */\n\n.story--grid .story {\n  flex-direction: column;\n  margin-bottom: 30px;\n}\n\n/* line 93, src/styles/layouts/_story.scss */\n\n.story--grid .story-image {\n  flex: 0 0 auto;\n  margin-right: 0;\n  height: 220px;\n}\n\n/* line 100, src/styles/layouts/_story.scss */\n\n.story--grid .media-type {\n  font-size: 24px;\n  height: 40px;\n  width: 40px;\n}\n\n/* line 110, src/styles/layouts/_story.scss */\n\n.st-cover {\n  overflow: hidden;\n  height: 300px;\n  width: 100%;\n}\n\n/* line 115, src/styles/layouts/_story.scss */\n\n.st-cover-inner {\n  height: 100%;\n}\n\n/* line 116, src/styles/layouts/_story.scss */\n\n.st-cover-img {\n  transition: all .25s;\n}\n\n/* line 117, src/styles/layouts/_story.scss */\n\n.st-cover .flow-meta-cat {\n  color: var(--story-cover-category-color);\n}\n\n/* line 118, src/styles/layouts/_story.scss */\n\n.st-cover .flow-meta {\n  color: #fff;\n}\n\n/* line 120, src/styles/layouts/_story.scss */\n\n.st-cover-header {\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding: 50px 3.846153846% 20px;\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 128, src/styles/layouts/_story.scss */\n\n.st-cover:hover .st-cover-img {\n  opacity: .8;\n}\n\n/* line 134, src/styles/layouts/_story.scss */\n\n.story--card {\n  /* stylelint-disable-next-line */\n}\n\n/* line 135, src/styles/layouts/_story.scss */\n\n.story--card .story {\n  margin-top: 0 !important;\n}\n\n/* line 140, src/styles/layouts/_story.scss */\n\n.story--card .story-image {\n  border: 1px solid rgba(0, 0, 0, 0.04);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  border-radius: 2px;\n  background-color: #fff !important;\n  transition: all 150ms ease-in-out;\n  overflow: hidden;\n  height: 200px !important;\n}\n\n/* line 149, src/styles/layouts/_story.scss */\n\n.story--card .story-image .story-img-bg {\n  margin: 10px;\n}\n\n/* line 151, src/styles/layouts/_story.scss */\n\n.story--card .story-image:hover {\n  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1);\n}\n\n/* line 154, src/styles/layouts/_story.scss */\n\n.story--card .story-image:hover .story-img-bg {\n  transform: none;\n}\n\n/* line 158, src/styles/layouts/_story.scss */\n\n.story--card .story-lower {\n  display: none !important;\n}\n\n/* line 160, src/styles/layouts/_story.scss */\n\n.story--card .story-body {\n  padding: 15px 5px;\n  margin: 0 !important;\n}\n\n/* line 164, src/styles/layouts/_story.scss */\n\n.story--card .story-body h2 {\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  color: rgba(0, 0, 0, 0.9);\n  display: -webkit-box !important;\n  max-height: 2.4em !important;\n  overflow: hidden;\n  text-overflow: ellipsis !important;\n  margin: 0;\n}\n\n/* line 181, src/styles/layouts/_story.scss */\n\n.story-small {\n  /* stylelint-disable-next-line */\n}\n\n/* line 182, src/styles/layouts/_story.scss */\n\n.story-small h3 {\n  color: #fff;\n  max-height: 2.5em;\n  overflow: hidden;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n}\n\n/* line 192, src/styles/layouts/_story.scss */\n\n.story-small-img {\n  height: 170px;\n}\n\n/* line 197, src/styles/layouts/_story.scss */\n\n.story-small .media-type {\n  height: 34px;\n  width: 34px;\n}\n\n/* line 206, src/styles/layouts/_story.scss */\n\n.story--hover {\n  /* stylelint-disable-next-line */\n}\n\n/* line 208, src/styles/layouts/_story.scss */\n\n.story--hover .lazy-load-image,\n.story--hover h2,\n.story--hover h3 {\n  transition: all .25s;\n}\n\n/* line 211, src/styles/layouts/_story.scss */\n\n.story--hover:hover .lazy-load-image {\n  opacity: .8;\n}\n\n/* line 212, src/styles/layouts/_story.scss */\n\n.story--hover:hover h3,\n.story--hover:hover h2 {\n  opacity: .6;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 222, src/styles/layouts/_story.scss */\n\n  .story--grid .story-lower {\n    max-height: 3em;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    display: -webkit-box;\n    line-height: 1.1;\n    text-overflow: ellipsis;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 237, src/styles/layouts/_story.scss */\n\n  .cover--firts .story-cover {\n    height: 500px;\n  }\n\n  /* line 240, src/styles/layouts/_story.scss */\n\n  .story {\n    flex-direction: column;\n    margin-top: 20px;\n  }\n\n  /* line 244, src/styles/layouts/_story.scss */\n\n  .story-image {\n    flex: 0 0 auto;\n    margin-right: 0;\n  }\n\n  /* line 245, src/styles/layouts/_story.scss */\n\n  .story-body {\n    margin-top: 10px;\n  }\n}\n\n/* line 4, src/styles/layouts/_author.scss */\n\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, 0.6);\n  min-height: 350px;\n}\n\n/* line 9, src/styles/layouts/_author.scss */\n\n.author-avatar {\n  height: 80px;\n  width: 80px;\n}\n\n/* line 14, src/styles/layouts/_author.scss */\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 25px 16px 0;\n  opacity: .8;\n  word-wrap: break-word;\n}\n\n/* line 23, src/styles/layouts/_author.scss */\n\n.author-bio {\n  max-width: 700px;\n  font-size: 1.2rem;\n  font-weight: 300;\n  line-height: 1.4;\n}\n\n/* line 30, src/styles/layouts/_author.scss */\n\n.author-name {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 31, src/styles/layouts/_author.scss */\n\n.author-meta a:hover {\n  opacity: .8 !important;\n}\n\n/* line 34, src/styles/layouts/_author.scss */\n\n.cover-opacity {\n  opacity: .5;\n}\n\n/* line 36, src/styles/layouts/_author.scss */\n\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n}\n\n/* line 40, src/styles/layouts/_author.scss */\n\n.author.has--image a,\n.author.has--image .author-name {\n  color: #fff;\n}\n\n/* line 43, src/styles/layouts/_author.scss */\n\n.author.has--image .author-follow a {\n  border: 2px solid;\n  border-color: rgba(255, 255, 255, 0.5) !important;\n  font-size: 16px;\n}\n\n/* line 49, src/styles/layouts/_author.scss */\n\n.author.has--image .u-accentColor--iconNormal {\n  fill: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 53, src/styles/layouts/_author.scss */\n\n  .author-meta span {\n    display: block;\n  }\n\n  /* line 54, src/styles/layouts/_author.scss */\n\n  .author-header {\n    display: block;\n  }\n\n  /* line 55, src/styles/layouts/_author.scss */\n\n  .author-avatar {\n    margin: 0 auto 20px;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 59, src/styles/layouts/_author.scss */\n\n  body.has-cover .author {\n    min-height: 600px;\n  }\n}\n\n/* line 4, src/styles/layouts/_search.scss */\n\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  transform: translateY(-100%);\n  transition: transform .3s ease;\n  z-index: 9;\n}\n\n/* line 16, src/styles/layouts/_search.scss */\n\n.search-form {\n  max-width: 680px;\n  margin-top: 80px;\n}\n\n/* line 20, src/styles/layouts/_search.scss */\n\n.search-form::before {\n  background: #eee;\n  bottom: 0;\n  content: '';\n  display: block;\n  height: 2px;\n  left: 0;\n  position: absolute;\n  width: 100%;\n  z-index: 1;\n}\n\n/* line 32, src/styles/layouts/_search.scss */\n\n.search-form input {\n  border: none;\n  display: block;\n  line-height: 40px;\n  padding-bottom: 8px;\n}\n\n/* line 38, src/styles/layouts/_search.scss */\n\n.search-form input:focus {\n  outline: 0;\n}\n\n/* line 43, src/styles/layouts/_search.scss */\n\n.search-results {\n  max-height: calc(100% - 100px);\n  max-width: 680px;\n  overflow: auto;\n}\n\n/* line 48, src/styles/layouts/_search.scss */\n\n.search-results a {\n  padding: 10px 20px;\n  background: rgba(0, 0, 0, 0.05);\n  color: rgba(0, 0, 0, 0.7);\n  text-decoration: none;\n  display: block;\n  border-bottom: 1px solid #fff;\n  transition: all 0.3s ease-in-out;\n}\n\n/* line 57, src/styles/layouts/_search.scss */\n\n.search-results a:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n/* line 62, src/styles/layouts/_search.scss */\n\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px;\n}\n\n/* line 68, src/styles/layouts/_search.scss */\n\nbody.is-search {\n  overflow: hidden;\n}\n\n/* line 71, src/styles/layouts/_search.scss */\n\nbody.is-search .search {\n  transform: translateY(0);\n}\n\n/* line 72, src/styles/layouts/_search.scss */\n\nbody.is-search .search-toggle {\n  background-color: rgba(255, 255, 255, 0.25);\n}\n\n/* line 2, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n}\n\n/* line 5, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title span {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n  padding-bottom: 10px;\n  margin-bottom: -1px;\n}\n\n/* line 14, src/styles/layouts/_sidebar.scss */\n\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, 0.2);\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n/* line 23, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n  min-height: 60px;\n}\n\n/* line 29, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post h3 {\n  padding: 10px;\n}\n\n/* line 31, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:hover .sidebar-border {\n  background-color: #e5eff5;\n}\n\n/* line 33, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n) .sidebar-border {\n  border-color: #f59e00;\n}\n\n/* line 34, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n+2) .sidebar-border {\n  border-color: #26a8ed;\n}\n\n/* line 2, src/styles/layouts/_sidenav.scss */\n\n.sideNav {\n  color: rgba(0, 0, 0, 0.8);\n  height: 100vh;\n  padding: 50px 20px;\n  position: fixed !important;\n  transform: translateX(100%);\n  transition: 0.4s;\n  will-change: transform;\n  z-index: 8;\n}\n\n/* line 13, src/styles/layouts/_sidenav.scss */\n\n.sideNav-menu a {\n  padding: 10px 20px;\n}\n\n/* line 15, src/styles/layouts/_sidenav.scss */\n\n.sideNav-wrap {\n  background: #eee;\n  overflow: auto;\n  padding: 20px 0;\n  top: 50px;\n}\n\n/* line 22, src/styles/layouts/_sidenav.scss */\n\n.sideNav-section {\n  border-bottom: solid 1px #ddd;\n  margin-bottom: 8px;\n  padding-bottom: 8px;\n}\n\n/* line 28, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow {\n  border-top: 1px solid #ddd;\n  margin: 15px 0;\n}\n\n/* line 32, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow a {\n  color: #fff;\n  display: inline-block;\n  height: 36px;\n  line-height: 20px;\n  margin: 0 5px 5px 0;\n  min-width: 36px;\n  padding: 8px;\n  text-align: center;\n  vertical-align: middle;\n}\n\n/* line 17, src/styles/layouts/helper.scss */\n\n.has-cover-padding {\n  padding-top: 100px;\n}\n\n/* line 20, src/styles/layouts/helper.scss */\n\nbody.has-cover .header {\n  position: fixed;\n}\n\n/* line 23, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header {\n  background: transparent;\n  box-shadow: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n/* line 29, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header-left a,\nbody.has-cover.is-transparency:not(.is-search) .nav ul li a {\n  color: #fff;\n}\n\n/* line 30, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .menu--toggle span {\n  background-color: #fff;\n}\n\n/* line 5, src/styles/layouts/subscribe.scss */\n\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%;\n}\n\n/* line 10, src/styles/layouts/subscribe.scss */\n\n.subscribe-card {\n  background-color: #D7EFEE;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  width: 900px;\n  height: 550px;\n  padding: 50px;\n  margin: 5px;\n}\n\n/* line 20, src/styles/layouts/subscribe.scss */\n\n.subscribe form {\n  max-width: 300px;\n}\n\n/* line 24, src/styles/layouts/subscribe.scss */\n\n.subscribe-form {\n  height: 100%;\n}\n\n/* line 28, src/styles/layouts/subscribe.scss */\n\n.subscribe-input {\n  background: 0 0;\n  border: 0;\n  border-bottom: 1px solid #cc5454;\n  border-radius: 0;\n  padding: 7px 5px;\n  height: 45px;\n  outline: 0;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n}\n\n/* line 38, src/styles/layouts/subscribe.scss */\n\n.subscribe-input::placeholder {\n  color: #cc5454;\n}\n\n/* line 43, src/styles/layouts/subscribe.scss */\n\n.subscribe .main-error {\n  color: #cc5454;\n  font-size: 16px;\n  margin-top: 15px;\n}\n\n/* line 65, src/styles/layouts/subscribe.scss */\n\n.subscribe-success .subscribe-card {\n  background-color: #E8F3EC;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 71, src/styles/layouts/subscribe.scss */\n\n  .subscribe-card {\n    height: auto;\n    width: auto;\n  }\n}\n\n/* line 4, src/styles/layouts/_comments.scss */\n\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  font-size: 14px;\n  transform: translateX(100%);\n  transition: .2s;\n  will-change: transform;\n}\n\n/* line 21, src/styles/layouts/_comments.scss */\n\n.post-comments-header {\n  padding: 20px;\n  border-bottom: 1px solid #ddd;\n}\n\n/* line 25, src/styles/layouts/_comments.scss */\n\n.post-comments-header .toggle-comments {\n  font-size: 24px;\n  line-height: 1;\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 17px;\n  cursor: pointer;\n}\n\n/* line 36, src/styles/layouts/_comments.scss */\n\n.post-comments-overlay {\n  position: fixed !important;\n  background-color: rgba(0, 0, 0, 0.2);\n  display: none;\n  transition: background-color .4s linear;\n  z-index: 8;\n  cursor: pointer;\n}\n\n/* line 46, src/styles/layouts/_comments.scss */\n\nbody.has-comments {\n  overflow: hidden;\n}\n\n/* line 49, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments-overlay {\n  display: block;\n}\n\n/* line 50, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments {\n  transform: translateX(0);\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 54, src/styles/layouts/_comments.scss */\n\n  .post-comments {\n    left: auto;\n    max-width: 700px;\n    min-width: 500px;\n    top: 50px;\n    z-index: 9;\n  }\n}\n\n/* line 2, src/styles/layouts/_topic.scss */\n\n.topic-img {\n  transition: transform .7s;\n  transform: translateZ(0);\n}\n\n/* line 7, src/styles/layouts/_topic.scss */\n\n.topic-items {\n  height: 320px;\n  padding: 30px;\n}\n\n/* line 12, src/styles/layouts/_topic.scss */\n\n.topic-items:hover .topic-img {\n  transform: scale(1.03);\n}\n\n/* line 16, src/styles/layouts/_topic.scss */\n\n.topic-c {\n  background-color: var(--primary-color);\n  color: #fff;\n}\n\n/* line 1, src/styles/common/_modal.scss */\n\n.modal {\n  opacity: 0;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden;\n}\n\n/* line 8, src/styles/common/_modal.scss */\n\n.modal-shader {\n  background-color: rgba(255, 255, 255, 0.65);\n}\n\n/* line 11, src/styles/common/_modal.scss */\n\n.modal-close {\n  color: rgba(0, 0, 0, 0.54);\n  position: absolute;\n  top: 0;\n  right: 0;\n  line-height: 1;\n  padding: 15px;\n}\n\n/* line 21, src/styles/common/_modal.scss */\n\n.modal-inner {\n  background-color: #E8F3EC;\n  border-radius: 4px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  max-width: 700px;\n  height: 100%;\n  max-height: 400px;\n  opacity: 0;\n  padding: 72px 5% 56px;\n  transform: scale(0.6);\n  transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  width: 100%;\n}\n\n/* line 36, src/styles/common/_modal.scss */\n\n.modal .form-group {\n  width: 76%;\n  margin: 0 auto 30px;\n}\n\n/* line 41, src/styles/common/_modal.scss */\n\n.modal .form--input {\n  display: inline-block;\n  margin-bottom: 10px;\n  vertical-align: top;\n  height: 40px;\n  line-height: 40px;\n  background-color: transparent;\n  padding: 17px 6px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n  width: 100%;\n}\n\n/* line 71, src/styles/common/_modal.scss */\n\nbody.has-modal {\n  overflow: hidden;\n}\n\n/* line 74, src/styles/common/_modal.scss */\n\nbody.has-modal .modal {\n  opacity: 1;\n  visibility: visible;\n  transition: opacity .3s ease;\n}\n\n/* line 79, src/styles/common/_modal.scss */\n\nbody.has-modal .modal-inner {\n  opacity: 1;\n  transform: scale(1);\n  transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n}\n\n/* line 4, src/styles/common/_widget.scss */\n\n.instagram-hover {\n  background-color: rgba(0, 0, 0, 0.3);\n  opacity: 0;\n}\n\n/* line 10, src/styles/common/_widget.scss */\n\n.instagram-img {\n  height: 264px;\n}\n\n/* line 13, src/styles/common/_widget.scss */\n\n.instagram-img:hover > .instagram-hover {\n  opacity: 1;\n}\n\n/* line 16, src/styles/common/_widget.scss */\n\n.instagram-name {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 3;\n}\n\n/* line 22, src/styles/common/_widget.scss */\n\n.instagram-name a {\n  background-color: #fff;\n  color: #000 !important;\n  font-size: 18px !important;\n  font-weight: 900 !important;\n  min-width: 200px;\n  padding-left: 10px !important;\n  padding-right: 10px !important;\n  text-align: center !important;\n}\n\n/* line 34, src/styles/common/_widget.scss */\n\n.instagram-col {\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n/* line 39, src/styles/common/_widget.scss */\n\n.instagram-wrap {\n  margin: 0 !important;\n}\n\n/* line 44, src/styles/common/_widget.scss */\n\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative;\n}\n\n/* line 50, src/styles/common/_widget.scss */\n\n.witget-subscribe::before {\n  content: \"\";\n  border: 5px solid #f5f5f5;\n  box-shadow: inset 0 0 0 1px #d7d7d7;\n  box-sizing: border-box;\n  display: block;\n  height: calc(100% + 10px);\n  left: -5px;\n  pointer-events: none;\n  position: absolute;\n  top: -5px;\n  width: calc(100% + 10px);\n  z-index: 1;\n}\n\n/* line 65, src/styles/common/_widget.scss */\n\n.witget-subscribe input {\n  background: #fff;\n  border: 1px solid #e5e5e5;\n  color: rgba(0, 0, 0, 0.54);\n  height: 41px;\n  outline: 0;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 75, src/styles/common/_widget.scss */\n\n.witget-subscribe button {\n  background: var(--composite-color);\n  border-radius: 0;\n  width: 100%;\n}\n\n","/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tcolor: black;\n\tbackground: none;\n\ttext-shadow: 0 1px white;\n\tfont-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\n@media print {\n\tcode[class*=\"language-\"],\n\tpre[class*=\"language-\"] {\n\t\ttext-shadow: none;\n\t}\n}\n\n/* Code blocks */\npre[class*=\"language-\"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n}\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tbackground: #f5f2f0;\n}\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: slategray;\n}\n\n.token.punctuation {\n\tcolor: #999;\n}\n\n.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #905;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #690;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n\tcolor: #9a6e3a;\n\tbackground: hsla(0, 0%, 100%, .5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n\tcolor: #07a;\n}\n\n.token.function,\n.token.class-name {\n\tcolor: #DD4A68;\n}\n\n.token.regex,\n.token.important,\n.token.variable {\n\tcolor: #e90;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n","pre[class*=\"language-\"].line-numbers {\n\tposition: relative;\n\tpadding-left: 3.8em;\n\tcounter-reset: linenumber;\n}\n\npre[class*=\"language-\"].line-numbers > code {\n\tposition: relative;\n\twhite-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n\tposition: absolute;\n\tpointer-events: none;\n\ttop: 0;\n\tfont-size: 100%;\n\tleft: -3.8em;\n\twidth: 3em; /* works for line-numbers below 1000 lines */\n\tletter-spacing: -1px;\n\tborder-right: 1px solid #999;\n\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\n}\n\n\t.line-numbers-rows > span {\n\t\tpointer-events: none;\n\t\tdisplay: block;\n\t\tcounter-increment: linenumber;\n\t}\n\n\t\t.line-numbers-rows > span:before {\n\t\t\tcontent: counter(linenumber);\n\t\t\tcolor: #999;\n\t\t\tdisplay: block;\n\t\t\tpadding-right: 0.8em;\n\t\t\ttext-align: right;\n\t\t}\n","%link {\r\n  color: inherit;\r\n  cursor: pointer;\r\n  text-decoration: none;\r\n}\r\n\r\n%link--accent {\r\n  color: var(--primary-color);\r\n  text-decoration: none;\r\n  // &:hover { color: $primary-color-hover; }\r\n}\r\n\r\n%content-absolute-bottom {\r\n  bottom: 0;\r\n  left: 0;\r\n  margin: 30px;\r\n  max-width: 600px;\r\n  position: absolute;\r\n  z-index: 2;\r\n}\r\n\r\n%u-absolute0 {\r\n  bottom: 0;\r\n  left: 0;\r\n  position: absolute;\r\n  right: 0;\r\n  top: 0;\r\n}\r\n\r\n%u-text-color-darker {\r\n  color: rgba(0, 0, 0, .8) !important;\r\n  fill: rgba(0, 0, 0, .8) !important;\r\n}\r\n\r\n%fonts-icons {\r\n  /* use !important to prevent issues with browser extensions that change fonts */\r\n  font-family: 'mapache' !important; /* stylelint-disable-line */\r\n  speak: none;\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  font-variant: normal;\r\n  text-transform: none;\r\n  line-height: inherit;\r\n\r\n  /* Better Font Rendering =========== */\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n","// stylelint-disable\r\nimg[data-action=\"zoom\"] {\r\n  cursor: zoom-in;\r\n}\r\n.zoom-img,\r\n.zoom-img-wrap {\r\n  position: relative;\r\n  z-index: 666;\r\n  -webkit-transition: all 300ms;\r\n       -o-transition: all 300ms;\r\n          transition: all 300ms;\r\n}\r\nimg.zoom-img {\r\n  cursor: pointer;\r\n  cursor: -webkit-zoom-out;\r\n  cursor: -moz-zoom-out;\r\n}\r\n.zoom-overlay {\r\n  z-index: 420;\r\n  background: #fff;\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  pointer-events: none;\r\n  filter: \"alpha(opacity=0)\";\r\n  opacity: 0;\r\n  -webkit-transition:      opacity 300ms;\r\n       -o-transition:      opacity 300ms;\r\n          transition:      opacity 300ms;\r\n}\r\n.zoom-overlay-open .zoom-overlay {\r\n  filter: \"alpha(opacity=100)\";\r\n  opacity: 1;\r\n}\r\n.zoom-overlay-open,\r\n.zoom-overlay-transitioning {\r\n  cursor: default;\r\n}\r\n",":root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d;\n}\n\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n\na {\n  color: inherit;\n  text-decoration: none;\n\n  &:active,\n  &:hover {\n    outline: 0;\n  }\n}\n\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: $secundary-font;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px;\n\n  p:first-of-type { margin-top: 0 }\n}\n\nbody {\n  color: $primary-text-color;\n  font-family: $primary-font;\n  font-size: $font-size-base;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden;\n}\n\n//Default styles\nhtml {\n  box-sizing: border-box;\n  font-size: $font-size-root;\n}\n\nfigure {\n  margin: 0;\n}\n\nfigcaption {\n  color: rgba(0, 0, 0, .68);\n  display: block;\n  font-family: $primary-font;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 0.9375rem;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n// Code\n// ==========================================================================\nkbd, samp, code {\n  background: $code-bg-color;\n  border-radius: 4px;\n  color: $code-color;\n  font-family: $code-font !important;\n  font-size: $font-size-code;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\npre {\n  background-color: $code-bg-color !important;\n  border-radius: 4px;\n  font-family: $code-font !important;\n  font-size: $font-size-code;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal;\n\n  code {\n    background: transparent;\n    color: $pre-code-color;\n    padding: 0;\n    text-shadow: 0 1px #fff;\n  }\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: $pre-code-color;\n  line-height: 1.4;\n\n  .token.comment { opacity: .8; }\n\n  &.line-numbers {\n    padding-left: 58px;\n\n    &::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0;\n      background: #F0EDEE;\n      width: 40px;\n      height: 100%;\n    }\n  }\n\n  .line-numbers-rows {\n    border-right: none;\n    top: -3px;\n    left: -58px;\n\n    & > span::before {\n      padding-right: 0;\n      text-align: center;\n      opacity: .8;\n    }\n  }\n}\n\n// hr\n// ==========================================================================\nhr:not(.hr-list) {\n  margin: 40px auto 10px;\n  height: 1px;\n  background-color: #ddd;\n  border: 0;\n  max-width: 100%;\n}\n\n.post-footer-hr {\n  // height: 1px;\n  margin: 32px 0;\n  // border: 0;\n  // background-color: #ddd;\n}\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n\n  &:not([src]) {\n    visibility: hidden;\n  }\n}\n\ni {\n  // display: inline-block;\n  vertical-align: middle;\n}\n\ninput {\n  border: none;\n  outline: 0;\n}\n\nol, ul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\nmark {\n  background-color: transparent !important;\n  background-image: linear-gradient(to bottom, rgba(215, 253, 211, 1), rgba(215, 253, 211, 1));\n  color: rgba(0, 0, 0, .8);\n}\n\nq {\n  color: rgba(0, 0, 0, .44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left;\n\n  &::before, &::after { display: none; }\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n\n  th,\n  td {\n    padding: 6px 13px;\n    border: 1px solid #dfe2e5;\n  }\n\n  tr:nth-child(2n) {\n    background-color: #f6f8fa;\n  }\n\n  th {\n    letter-spacing: 0.2px;\n    text-transform: uppercase;\n    font-weight: 600;\n  }\n}\n\n// Links color\n// ==========================================================================\n.link--accent { @extend %link--accent; }\n\n.link { @extend %link; }\n\n.link--underline {\n  &:active,\n  &:focus,\n  &:hover {\n    // color: inherit;\n    text-decoration: underline;\n  }\n}\n\n// Animation main page and footer\n// ==========================================================================\n.main { margin-bottom: 4em; min-height: 90vh }\n\n.main,\n.footer { transition: transform .5s ease; }\n\n// warning success and Note\n// ==========================================================================\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n  &::before { content: $i-warning; }\n}\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n  &::before { content: $i-star; }\n}\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n  &::before { color: #00bfa5; content: $i-check; }\n}\n\n.warning, .note, .success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px;\n\n  a {\n    color: inherit;\n    text-decoration: underline;\n  }\n\n  &::before {\n    @extend %fonts-icons;\n\n    float: left;\n    font-size: 24px;\n    margin-left: -36px;\n    margin-top: -5px;\n  }\n}\n\n// Page Tags\n// ==========================================================================\n.tag {\n  &-description {\n    max-width: 700px;\n    font-size: 1.2rem;\n    font-weight: 300;\n    line-height: 1.4;\n  }\n  &.has--image { min-height: 350px }\n}\n\n// toltip\n// ==========================================================================\n.with-tooltip {\n  overflow: visible;\n  position: relative;\n\n  &::after {\n    background: rgba(0, 0, 0, .85);\n    border-radius: 4px;\n    color: #fff;\n    content: attr(data-tooltip);\n    display: inline-block;\n    font-size: 12px;\n    font-weight: 600;\n    left: 50%;\n    line-height: 1.25;\n    min-width: 130px;\n    opacity: 0;\n    padding: 4px 8px;\n    pointer-events: none;\n    position: absolute;\n    text-align: center;\n    text-transform: none;\n    top: -30px;\n    will-change: opacity, transform;\n    z-index: 1;\n  }\n\n  &:hover::after {\n    animation: tooltip .1s ease-out both;\n  }\n}\n\n// Error page\n// ==========================================================================\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n\n  &-link {\n    left: -5px;\n    padding: 24px 60px;\n    top: -6px;\n  }\n\n  &-text {\n    margin-top: 60px;\n    white-space: pre-wrap;\n  }\n\n  &-wrap {\n    color: rgba(0, 0, 0, .4);\n    padding: 7vw 4vw;\n  }\n}\n\n// Video Responsive\n// ==========================================================================\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%;\n\n  iframe {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%;\n  }\n\n  video {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%;\n  }\n}\n\n.kg-embed-card .video-responsive { margin-top: 0 }\n\n// Gallery\n// ==========================================================================\n\n.kg-gallery {\n  &-container {\n    display: flex;\n    flex-direction: column;\n    max-width: 100%;\n    width: 100%;\n  }\n\n  &-row {\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n\n    &:not(:first-of-type) { margin: 0.75em 0 0 0 }\n  }\n\n  &-image {\n    img {\n      display: block;\n      margin: 0;\n      width: 100%;\n      height: 100%;\n    }\n\n    &:not(:first-of-type) { margin: 0 0 0 0.75em }\n  }\n}\n\n// Social Media Color\n// ==========================================================================\n@each $social-name, $color in $social-colors {\n  .c-#{$social-name} { color: $color !important; }\n  .bg-#{$social-name} { background-color: $color !important; }\n}\n\n// Facebook Save\n// ==========================================================================\n// .fbSave {\n//   &-dropdown {\n//     background-color: #fff;\n//     border: 1px solid #e0e0e0;\n//     bottom: 100%;\n//     display: none;\n//     max-width: 200px;\n//     min-width: 100px;\n//     padding: 8px;\n//     transform: translate(-50%, 0);\n//     z-index: 10;\n\n//     &.is-visible { display: block; }\n//   }\n// }\n\n// Rocket for return top page\n// ==========================================================================\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5;\n\n  &:hover svg path {\n    fill: rgba(0, 0, 0, .6);\n  }\n}\n\n.svgIcon {\n  display: inline-block;\n}\n\nsvg {\n  height: auto;\n  width: 100%;\n}\n\n// Pagination Infinite Scroll\n// ==========================================================================\n\n.load-more { max-width: 70% !important }\n\n// loadingBar\n// ==========================================================================\n\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  z-index: 800;\n}\n\n.is-loading .loadingBar {\n  animation: loading-bar 1s ease-in-out infinite;\n  animation-delay: .8s;\n  display: block;\n}\n\n// Media Query responsinve\n// ==========================================================================\n@media #{$md-and-down} {\n  blockquote { margin-left: -5px; font-size: 1.125rem }\n\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px;\n  }\n}\n","// Container\n.extreme-container {\n  box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 100%;\n}\n\n// @media #{$lg-and-up} {\n//   .content {\n//     // flex: 1 !important;\n//     max-width: calc(100% - 340px) !important;\n//     // order: 1;\n//     // overflow: hidden;\n//   }\n\n//   .sidebar {\n//     width: 340px !important;\n//     // flex: 0 0 340px !important;\n//     // order: 2;\n//   }\n// }\n\n.col-left,\n.cc-video-left {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px;\n}\n\n// @media #{$md-and-up} {\n// }\n\n@media #{$lg-and-up} {\n  .col-left { max-width: calc(100% - 340px) }\n  .cc-video-left { max-width: calc(100% - 320px) }\n  .cc-video-right { flex-basis: 320px !important; max-width: 320px !important; }\n  body.is-article .col-left { padding-right: 40px }\n}\n\n.col-right {\n  display: flex;\n  flex-direction: column;\n  padding-left: $container-gutter-width;\n  padding-right: $container-gutter-width;\n  width: 330px;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  flex: 0 1 auto;\n  margin-left: - $container-gutter-width;\n  margin-right: - $container-gutter-width;\n\n  .col {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n    padding-left: $container-gutter-width;\n    padding-right: $container-gutter-width;\n\n    $i: 1;\n\n    @while $i <= $num-cols {\n      $perc: unquote((100 / ($num-cols / $i)) + \"%\");\n\n      &.s#{$i} {\n        flex-basis: $perc;\n        max-width: $perc;\n      }\n\n      $i: $i + 1;\n    }\n\n    @media #{$md-and-up} {\n\n      $i: 1;\n\n      @while $i <= $num-cols {\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\n\n        &.m#{$i} {\n          flex-basis: $perc;\n          max-width: $perc;\n        }\n\n        $i: $i + 1;\n      }\n    }\n\n    @media #{$lg-and-up} {\n\n      $i: 1;\n\n      @while $i <= $num-cols {\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\n\n        &.l#{$i} {\n          flex-basis: $perc;\n          max-width: $perc;\n        }\n\n        $i: $i + 1;\n      }\n    }\n  }\n}\n","// Headings\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n  color: $headings-color;\r\n  font-family: $headings-font-family;\r\n  font-weight: $headings-font-weight;\r\n  line-height: $headings-line-height;\r\n  margin: 0;\r\n\r\n  a {\r\n    color: inherit;\r\n    line-height: inherit;\r\n  }\r\n}\r\n\r\nh1 { font-size: $font-size-h1; }\r\nh2 { font-size: $font-size-h2; }\r\nh3 { font-size: $font-size-h3; }\r\nh4 { font-size: $font-size-h4; }\r\nh5 { font-size: $font-size-h5; }\r\nh6 { font-size: $font-size-h6; }\r\n\r\np {\r\n  margin: 0;\r\n}\r\n","// color\n.u-textColorNormal {\n  // color: rgba(0, 0, 0, .44) !important;\n  // fill: rgba(0, 0, 0, .44) !important;\n  color: rgba(153, 153, 153, 1) !important;\n  fill: rgba(153, 153, 153, 1) !important;\n}\n\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important;\n}\n\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, .6);\n  fill: rgba(0, 0, 0, .6);\n}\n\n.u-accentColor--iconNormal {\n  color: $primary-color;\n  fill: $primary-color;\n}\n\n//  background color\n.u-bgColor { background-color: var(--primary-color); }\n\n.u-textColorDarker { @extend %u-text-color-darker; }\n\n// Positions\n.u-relative { position: relative; }\n.u-absolute { position: absolute; }\n.u-absolute0 { @extend %u-absolute0; }\n.u-fixed { position: fixed !important; }\n\n.u-block { display: block !important }\n.u-inlineBlock { display: inline-block }\n\n//  Background\n.u-backgroundDark {\n  // background: linear-gradient(to bottom, rgba(0, 0, 0, .3) 29%, rgba(0, 0, 0, .6) 81%);\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n.u-bgGradient { background: linear-gradient(to bottom, rgba(0, 0, 0, .3) 29%, rgba(0, 0, 0, .7) 81%) }\n\n.u-bgBlack { background-color: #000 }\n\n.u-gradient {\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1;\n}\n\n// zindex\n.zindex1 { z-index: 1 }\n.zindex2 { z-index: 2 }\n.zindex3 { z-index: 3 }\n.zindex4 { z-index: 4 }\n\n// .u-background-white { background-color: #eeefee; }\n.u-backgroundWhite { background-color: #fafafa }\n.u-backgroundColorGrayLight { background-color: #f0f0f0 !important; }\n\n// Clear\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n// font size\n.u-fontSizeMicro { font-size: 11px }\n.u-fontSizeSmallest { font-size: 12px }\n.u-fontSize13 { font-size: 13px }\n.u-fontSizeSmaller { font-size: 14px }\n.u-fontSize15 { font-size: 15px }\n.u-fontSizeSmall { font-size: 16px }\n.u-fontSizeBase { font-size: 18px }\n.u-fontSize20 { font-size: 20px }\n.u-fontSize21 { font-size: 21px }\n.u-fontSize22 { font-size: 22px }\n.u-fontSizeLarge { font-size: 24px }\n.u-fontSize26 { font-size: 26px }\n.u-fontSize28 { font-size: 28px }\n.u-fontSizeLarger { font-size: 32px }\n.u-fontSize36 { font-size: 36px }\n.u-fontSize40 { font-size: 40px }\n.u-fontSizeLargest { font-size: 44px }\n.u-fontSizeJumbo { font-size: 50px }\n\n@media #{$md-and-down} {\n  .u-md-fontSizeBase { font-size: 18px }\n  .u-md-fontSize22 { font-size: 22px }\n  .u-md-fontSizeLarger { font-size: 32px }\n}\n\n// @media (max-width: 767px) {\n//   .u-xs-fontSizeBase {font-size: 18px}\n//   .u-xs-fontSize13 {font-size: 13px}\n//   .u-xs-fontSizeSmaller {font-size: 14px}\n//   .u-xs-fontSizeSmall {font-size: 16px}\n//   .u-xs-fontSize22 {font-size: 22px}\n//   .u-xs-fontSizeLarge {font-size: 24px}\n//   .u-xs-fontSize40 {font-size: 40px}\n//   .u-xs-fontSizeLarger {font-size: 32px}\n//   .u-xs-fontSizeSmallest {font-size: 12px}\n// }\n\n// font weight\n.u-fontWeightThin { font-weight: 300 }\n.u-fontWeightNormal { font-weight: 400 }\n.u-fontWeightMedium { font-weight: 500 }\n.u-fontWeightSemibold { font-weight: 600 }\n.u-fontWeightBold { font-weight: 700 }\n\n.u-textUppercase { text-transform: uppercase }\n.u-textCapitalize { text-transform: capitalize }\n.u-textAlignCenter { text-align: center }\n\n.u-textShadow { text-shadow: 0 0 10px rgba(0, 0, 0, 0.33) }\n\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n// Margin\n.u-marginAuto { margin-left: auto; margin-right: auto; }\n.u-marginTop20 { margin-top: 20px }\n.u-marginTop30 { margin-top: 30px }\n.u-marginBottom10 { margin-bottom: 10px }\n.u-marginBottom15 { margin-bottom: 15px }\n.u-marginBottom20 { margin-bottom: 20px !important }\n.u-marginBottom30 { margin-bottom: 30px }\n.u-marginBottom40 { margin-bottom: 40px }\n\n// padding\n.u-padding0 { padding: 0 !important }\n.u-padding20 { padding: 20px }\n.u-padding15 { padding: 15px !important; }\n.u-paddingBottom2 { padding-bottom: 2px; }\n.u-paddingBottom30 { padding-bottom: 30px; }\n.u-paddingBottom20 { padding-bottom: 20px }\n.u-paddingRight10 { padding-right: 10px }\n.u-paddingLeft15 { padding-left: 15px }\n\n.u-paddingTop2 { padding-top: 2px }\n.u-paddingTop5 { padding-top: 5px; }\n.u-paddingTop10 { padding-top: 10px; }\n.u-paddingTop15 { padding-top: 15px; }\n.u-paddingTop20 { padding-top: 20px; }\n.u-paddingTop30 { padding-top: 30px; }\n\n.u-paddingBottom15 { padding-bottom: 15px; }\n\n.u-paddingRight20 { padding-right: 20px }\n.u-paddingLeft20 { padding-left: 20px }\n\n.u-contentTitle {\n  font-family: $primary-font;\n  font-style: normal;\n  font-weight: 700;\n  letter-spacing: -.028em;\n}\n\n// line-height\n.u-lineHeight1 { line-height: 1; }\n.u-lineHeightTight { line-height: 1.2 }\n\n// overflow\n.u-overflowHidden { overflow: hidden }\n\n// float\n.u-floatRight { float: right; }\n.u-floatLeft { float: left; }\n\n//  flex\n.u-flex { display: flex; }\n.u-flexCenter { align-items: center; display: flex; }\n.u-flexContentCenter { justify-content: center }\n// .u-flex--1 { flex: 1 }\n.u-flex1 { flex: 1 1 auto; }\n.u-flex0 { flex: 0 0 auto; }\n.u-flexWrap { flex-wrap: wrap }\n\n.u-flexColumn {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.u-flexEnd {\n  align-items: center;\n  justify-content: flex-end;\n}\n\n.u-flexColumnTop {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n}\n\n// Background\n.u-bgCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover;\n}\n\n// max widht\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 16px;\n  padding-right: 16px;\n}\n\n.u-maxWidth1200 { max-width: 1200px }\n.u-maxWidth1000 { max-width: 1000px }\n.u-maxWidth740 { max-width: 740px }\n.u-maxWidth1040 { max-width: 1040px }\n.u-sizeFullWidth { width: 100% }\n.u-sizeFullHeight { height: 100% }\n\n// border\n.u-borderLighter { border: 1px solid rgba(0, 0, 0, .15); }\n.u-round { border-radius: 50% }\n.u-borderRadius2 { border-radius: 2px }\n\n.u-boxShadowBottom {\n  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, .05);\n}\n\n// Heinght\n.u-height540 { height: 540px }\n.u-height280 { height: 280px }\n.u-height260 { height: 260px }\n.u-height100 { height: 100px }\n.u-borderBlackLightest { border: 1px solid rgba(0, 0, 0, .1) }\n\n// hide global\n.u-hide { display: none !important }\n\n// card\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, .09);\n  border-radius: 3px;\n  // box-shadow: 0 1px 4px rgba(0, 0, 0, .04);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px;\n}\n\n// title Line\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%;\n\n  &::before {\n    content: '';\n    background: rgba(255, 255, 255, .3);\n    display: inline-block;\n    position: absolute;\n    left: 0;\n    bottom: 50%;\n    width: 100%;\n    height: 1px;\n    z-index: 0;\n  }\n}\n\n// Obblique\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 15px;\n  font-weight: 500;\n  letter-spacing: 0.03em;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  transform: skewX(-15deg);\n}\n\n.no-avatar {\n  background-image: url('../images/avatar.png') !important\n}\n\n@media #{$md-and-down} {\n  .u-hide-before-md { display: none !important }\n  .u-md-heightAuto { height: auto; }\n  .u-md-height170 { height: 170px }\n  .u-md-relative { position: relative }\n}\n\n@media #{$lg-and-down} { .u-hide-before-lg { display: none !important } }\n\n// hide after\n@media #{$md-and-up} { .u-hide-after-md { display: none !important } }\n\n@media #{$lg-and-up} { .u-hide-after-lg { display: none !important } }\n",".button {\r\n  background: rgba(0, 0, 0, 0);\r\n  border: 1px solid rgba(0, 0, 0, .15);\r\n  border-radius: 4px;\r\n  box-sizing: border-box;\r\n  color: rgba(0, 0, 0, .44);\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  font-family: $primary-font;\r\n  font-size: 14px;\r\n  font-style: normal;\r\n  font-weight: 400;\r\n  height: 37px;\r\n  letter-spacing: 0;\r\n  line-height: 35px;\r\n  padding: 0 16px;\r\n  position: relative;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  text-rendering: optimizeLegibility;\r\n  user-select: none;\r\n  vertical-align: middle;\r\n  white-space: nowrap;\r\n\r\n  // &--chromeless {\r\n  //   border-radius: 0;\r\n  //   border-width: 0;\r\n  //   box-shadow: none;\r\n  //   color: rgba(0, 0, 0, .44);\r\n  //   height: auto;\r\n  //   line-height: inherit;\r\n  //   padding: 0;\r\n  //   text-align: left;\r\n  //   vertical-align: baseline;\r\n  //   white-space: normal;\r\n\r\n  //   &:active,\r\n  //   &:hover,\r\n  //   &:focus {\r\n  //     border-width: 0;\r\n  //     color: rgba(0, 0, 0, .6);\r\n  //   }\r\n  // }\r\n\r\n  &--large {\r\n    font-size: 15px;\r\n    height: 44px;\r\n    line-height: 42px;\r\n    padding: 0 18px;\r\n  }\r\n\r\n  &--dark {\r\n    background: rgba(0, 0, 0, .84);\r\n    border-color: rgba(0, 0, 0, .84);\r\n    color: rgba(255, 255, 255, .97);\r\n\r\n    &:hover {\r\n      background: $primary-color;\r\n      border-color: $primary-color;\r\n    }\r\n  }\r\n}\r\n\r\n// Primary\r\n.button--primary {\r\n  border-color: $primary-color;\r\n  color: $primary-color;\r\n}\r\n\r\n// .button--large.button--chromeless,\r\n// .button--large.button--link {\r\n//   padding: 0;\r\n// }\r\n\r\n// .buttonSet {\r\n//   > .button {\r\n//     margin-right: 8px;\r\n//     vertical-align: middle;\r\n//   }\r\n\r\n//   > .button:last-child {\r\n//     margin-right: 0;\r\n//   }\r\n\r\n//   .button--chromeless {\r\n//     height: 37px;\r\n//     line-height: 35px;\r\n//   }\r\n\r\n//   .button--large.button--chromeless,\r\n//   .button--large.button--link {\r\n//     height: 44px;\r\n//     line-height: 42px;\r\n//   }\r\n\r\n//   & > .button--chromeless:not(.button--circle) {\r\n//     margin-right: 0;\r\n//     padding-right: 8px;\r\n//   }\r\n\r\n//   & > .button--chromeless:last-child {\r\n//     padding-right: 0;\r\n//   }\r\n\r\n//   & > .button--chromeless + .button--chromeless:not(.button--circle) {\r\n//     margin-left: 0;\r\n//     padding-left: 8px;\r\n//   }\r\n// }\r\n\r\n.button--circle {\r\n  background-image: none !important;\r\n  border-radius: 50%;\r\n  color: #fff;\r\n  height: 40px;\r\n  line-height: 38px;\r\n  padding: 0;\r\n  text-decoration: none;\r\n  width: 40px;\r\n}\r\n\r\n// Btn for tag cloud or category\r\n// ==========================================================================\r\n.tag-button {\r\n  background: rgba(0, 0, 0, .05);\r\n  border: none;\r\n  color: rgba(0, 0, 0, .68);\r\n  font-weight: 500;\r\n  margin: 0 8px 8px 0;\r\n\r\n  &:hover {\r\n    background: rgba(0, 0, 0, .1);\r\n    color: rgba(0, 0, 0, .68);\r\n  }\r\n}\r\n\r\n// button dark line\r\n// ==========================================================================\r\n.button--dark-line {\r\n  border: 1px solid #000;\r\n  color: #000;\r\n  display: block;\r\n  font-weight: 500;\r\n  margin: 50px auto 0;\r\n  max-width: 300px;\r\n  text-transform: uppercase;\r\n  transition: color .3s ease, box-shadow .3s cubic-bezier(.455, .03, .515, .955);\r\n  width: 100%;\r\n\r\n  &:hover {\r\n    color: #fff;\r\n    box-shadow: inset 0 -50px 8px -4px #000;\r\n  }\r\n}\r\n","// stylelint-disable\r\n@font-face {\r\n  font-family: 'mapache';\r\n  src:  url('../fonts/mapache.eot?25764j');\r\n  src:  url('../fonts/mapache.eot?25764j#iefix') format('embedded-opentype'),\r\n    url('../fonts/mapache.ttf?25764j') format('truetype'),\r\n    url('../fonts/mapache.woff?25764j') format('woff'),\r\n    url('../fonts/mapache.svg?25764j#mapache') format('svg');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n}\r\n\r\n[class^=\"i-\"]::before, [class*=\" i-\"]::before {\r\n  @extend %fonts-icons;\r\n}\r\n\r\n.i-tag:before {\r\n  content: \"\\e911\";\r\n}\r\n.i-discord:before {\r\n  content: \"\\e90a\";\r\n}\r\n.i-arrow-round-next:before {\r\n  content: \"\\e90c\";\r\n}\r\n.i-arrow-round-prev:before {\r\n  content: \"\\e90d\";\r\n}\r\n.i-arrow-round-up:before {\r\n  content: \"\\e90e\";\r\n}\r\n.i-arrow-round-down:before {\r\n  content: \"\\e90f\";\r\n}\r\n.i-photo:before {\r\n  content: \"\\e90b\";\r\n}\r\n.i-send:before {\r\n  content: \"\\e909\";\r\n}\r\n.i-audio:before {\r\n  content: \"\\e901\";\r\n}\r\n.i-rocket:before {\r\n  content: \"\\e902\";\r\n  color: #999;\r\n}\r\n.i-comments-line:before {\r\n  content: \"\\e900\";\r\n}\r\n.i-globe:before {\r\n  content: \"\\e906\";\r\n}\r\n.i-star:before {\r\n  content: \"\\e907\";\r\n}\r\n.i-link:before {\r\n  content: \"\\e908\";\r\n}\r\n.i-star-line:before {\r\n  content: \"\\e903\";\r\n}\r\n.i-more:before {\r\n  content: \"\\e904\";\r\n}\r\n.i-search:before {\r\n  content: \"\\e905\";\r\n}\r\n.i-chat:before {\r\n  content: \"\\e910\";\r\n}\r\n.i-arrow-left:before {\r\n  content: \"\\e314\";\r\n}\r\n.i-arrow-right:before {\r\n  content: \"\\e315\";\r\n}\r\n.i-play:before {\r\n  content: \"\\e037\";\r\n}\r\n.i-location:before {\r\n  content: \"\\e8b4\";\r\n}\r\n.i-check-circle:before {\r\n  content: \"\\e86c\";\r\n}\r\n.i-close:before {\r\n  content: \"\\e5cd\";\r\n}\r\n.i-favorite:before {\r\n  content: \"\\e87d\";\r\n}\r\n.i-warning:before {\r\n  content: \"\\e002\";\r\n}\r\n.i-rss:before {\r\n  content: \"\\e0e5\";\r\n}\r\n.i-share:before {\r\n  content: \"\\e80d\";\r\n}\r\n.i-email:before {\r\n  content: \"\\f0e0\";\r\n}\r\n.i-google:before {\r\n  content: \"\\f1a0\";\r\n}\r\n.i-telegram:before {\r\n  content: \"\\f2c6\";\r\n}\r\n.i-reddit:before {\r\n  content: \"\\f281\";\r\n}\r\n.i-twitter:before {\r\n  content: \"\\f099\";\r\n}\r\n.i-github:before {\r\n  content: \"\\f09b\";\r\n}\r\n.i-linkedin:before {\r\n  content: \"\\f0e1\";\r\n}\r\n.i-youtube:before {\r\n  content: \"\\f16a\";\r\n}\r\n.i-stack-overflow:before {\r\n  content: \"\\f16c\";\r\n}\r\n.i-instagram:before {\r\n  content: \"\\f16d\";\r\n}\r\n.i-flickr:before {\r\n  content: \"\\f16e\";\r\n}\r\n.i-dribbble:before {\r\n  content: \"\\f17d\";\r\n}\r\n.i-behance:before {\r\n  content: \"\\f1b4\";\r\n}\r\n.i-spotify:before {\r\n  content: \"\\f1bc\";\r\n}\r\n.i-codepen:before {\r\n  content: \"\\f1cb\";\r\n}\r\n.i-facebook:before {\r\n  content: \"\\f230\";\r\n}\r\n.i-pinterest:before {\r\n  content: \"\\f231\";\r\n}\r\n.i-whatsapp:before {\r\n  content: \"\\f232\";\r\n}\r\n.i-snapchat:before {\r\n  content: \"\\f2ac\";\r\n}\r\n","// animated Global\r\n.animated {\r\n  animation-duration: 1s;\r\n  animation-fill-mode: both;\r\n\r\n  &.infinite {\r\n    animation-iteration-count: infinite;\r\n  }\r\n}\r\n\r\n// animated All\r\n.bounceIn { animation-name: bounceIn; }\r\n.bounceInDown { animation-name: bounceInDown; }\r\n.pulse { animation-name: pulse; }\r\n.slideInUp { animation-name: slideInUp }\r\n.slideOutDown { animation-name: slideOutDown }\r\n\r\n// all keyframes Animates\r\n// bounceIn\r\n@keyframes bounceIn {\r\n  0%,\r\n  20%,\r\n  40%,\r\n  60%,\r\n  80%,\r\n  100% { animation-timing-function: cubic-bezier(.215, .61, .355, 1); }\r\n  0% { opacity: 0; transform: scale3d(.3, .3, .3); }\r\n  20% { transform: scale3d(1.1, 1.1, 1.1); }\r\n  40% { transform: scale3d(.9, .9, .9); }\r\n  60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }\r\n  80% { transform: scale3d(.97, .97, .97); }\r\n  100% { opacity: 1; transform: scale3d(1, 1, 1); }\r\n}\r\n\r\n// bounceInDown\r\n@keyframes bounceInDown {\r\n  0%,\r\n  60%,\r\n  75%,\r\n  90%,\r\n  100% { animation-timing-function: cubic-bezier(215, 610, 355, 1); }\r\n  0% { opacity: 0; transform: translate3d(0, -3000px, 0); }\r\n  60% { opacity: 1; transform: translate3d(0, 25px, 0); }\r\n  75% { transform: translate3d(0, -10px, 0); }\r\n  90% { transform: translate3d(0, 5px, 0); }\r\n  100% { transform: none; }\r\n}\r\n\r\n@keyframes pulse {\r\n  from { transform: scale3d(1, 1, 1); }\r\n  50% { transform: scale3d(1.2, 1.2, 1.2); }\r\n  to { transform: scale3d(1, 1, 1); }\r\n}\r\n\r\n@keyframes scroll {\r\n  0% { opacity: 0; }\r\n  10% { opacity: 1; transform: translateY(0) }\r\n  100% { opacity: 0; transform: translateY(10px); }\r\n}\r\n\r\n@keyframes opacity {\r\n  0% { opacity: 0; }\r\n  50% { opacity: 0; }\r\n  100% { opacity: 1; }\r\n}\r\n\r\n//  spin for pagination\r\n@keyframes spin {\r\n  from { transform: rotate(0deg); }\r\n  to { transform: rotate(360deg); }\r\n}\r\n\r\n@keyframes tooltip {\r\n  0% { opacity: 0; transform: translate(-50%, 6px); }\r\n  100% { opacity: 1; transform: translate(-50%, 0); }\r\n}\r\n\r\n@keyframes loading-bar {\r\n  0% { transform: translateX(-100%) }\r\n  40% { transform: translateX(0) }\r\n  60% { transform: translateX(0) }\r\n  100% { transform: translateX(100%) }\r\n}\r\n\r\n// Arrow move left\r\n@keyframes arrow-move-right {\r\n  0% { opacity: 0 }\r\n  10% { transform: translateX(-100%); opacity: 0 }\r\n  100% { transform: translateX(0); opacity: 1 }\r\n}\r\n\r\n@keyframes arrow-move-left {\r\n  0% { opacity: 0 }\r\n  10% { transform: translateX(100%); opacity: 0 }\r\n  100% { transform: translateX(0); opacity: 1 }\r\n}\r\n\r\n@keyframes slideInUp {\r\n  from {\r\n    transform: translate3d(0, 100%, 0);\r\n    visibility: visible;\r\n  }\r\n\r\n  to {\r\n    transform: translate3d(0, 0, 0);\r\n  }\r\n}\r\n\r\n@keyframes slideOutDown {\r\n  from {\r\n    transform: translate3d(0, 0, 0);\r\n  }\r\n\r\n  to {\r\n    visibility: hidden;\r\n    transform: translate3d(0, 20%, 0);\r\n  }\r\n}\r\n","// Header\n// ==========================================================================\n\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15;\n}\n\n.header {\n  box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: sticky;\n  top: 0;\n  transition: all .3s ease-in-out;\n  z-index: 10;\n\n  &-wrap { height: $header-height; }\n\n  &-logo {\n    color: #fff !important;\n    height: 30px;\n\n    img { max-height: 100%; }\n  }\n}\n\n// not have logo\n// .not-logo .header-logo { height: auto !important }\n\n// Header line separate\n.header-line {\n  height: $header-height;\n  border-right: 1px solid rgba(255, 255, 255, .3);\n  display: inline-block;\n  margin-right: 10px;\n}\n\n// Header Follow More\n// ==========================================================================\n.follow-more {\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0;\n}\n\nbody.is-showFollowMore {\n  .follow-more { width: auto }\n  .follow-toggle { color: var(--header-color-hover) }\n  .follow-toggle::before { content: \"\\e5cd\" }\n}\n\n// Header menu\n// ==========================================================================\n\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden;\n\n  ul {\n    display: flex;\n    margin-right: 20px;\n    overflow: hidden;\n    white-space: nowrap;\n  }\n}\n\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 400;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle;\n\n  &.active,\n  &:hover {\n    color: var(--header-color-hover);\n  }\n}\n\n// button-nav\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px;\n\n  span {\n    background-color: var(--header-color);\n    display: block;\n    height: 2px;\n    left: 14px;\n    margin-top: -1px;\n    position: absolute;\n    top: 50%;\n    transition: .4s;\n    width: 20px;\n\n    &:first-child { transform: translate(0, -6px); }\n    &:last-child { transform: translate(0, 6px); }\n  }\n}\n\n// Header menu\n// ==========================================================================\n\n@media #{$lg-and-down} {\n  .header-left { flex-grow: 1 !important; }\n  .header-logo span { font-size: 24px }\n\n  // show menu mobile\n  body.is-showNavMob {\n    overflow: hidden;\n\n    .sideNav { transform: translateX(0); }\n\n    .menu--toggle {\n      border: 0;\n      transform: rotate(90deg);\n\n      span:first-child { transform: rotate(45deg) translate(0, 0); }\n      span:nth-child(2) { transform: scaleX(0); }\n      span:last-child { transform: rotate(-45deg) translate(0, 0); }\n    }\n\n    .main, .footer { transform: translateX(-25%) !important }\n  }\n}\n","// Footer\r\n// ==========================================================================\r\n\r\n.footer {\r\n  color: #888;\r\n\r\n  a {\r\n    color: var(--footer-color-link);\r\n    &:hover { color: #fff }\r\n  }\r\n\r\n  &-links {\r\n    padding: 3em 0 2.5em;\r\n    background-color: #131313;\r\n  }\r\n\r\n  .follow > a {\r\n    background: #333;\r\n    border-radius: 50%;\r\n    color: inherit;\r\n    display: inline-block;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    margin: 0 5px 8px;\r\n    text-align: center;\r\n    width: 40px;\r\n\r\n    &:hover {\r\n      background: transparent;\r\n      box-shadow: inset 0 0 0 2px #333;\r\n    }\r\n  }\r\n\r\n  &-copy {\r\n    padding: 3em 0;\r\n    background-color: #000;\r\n  }\r\n}\r\n\r\n.footer-menu {\r\n  li {\r\n    display: inline-block;\r\n    line-height: 24px;\r\n    margin: 0 8px;\r\n\r\n    /* stylelint-disable-next-line */\r\n    a { color: #888 }\r\n  }\r\n}\r\n","// Home Page - Story Cover\r\n// ==========================================================================\r\n.hmCover {\r\n  padding: 4px;\r\n\r\n  .st-cover {\r\n    padding: 4px;\r\n\r\n    &.firts {\r\n      height: 500px;\r\n      .st-cover-title { font-size: 2rem }\r\n    }\r\n  }\r\n}\r\n\r\n// Home Page Personal Cover page\r\n// ==========================================================================\r\n.hm-cover {\r\n  padding: 30px 0;\r\n  min-height: 100vh;\r\n\r\n  &-title {\r\n    font-size: 2.5rem;\r\n    font-weight: 900;\r\n    line-height: 1;\r\n  }\r\n\r\n  &-des {\r\n    max-width: 600px;\r\n    font-size: 1.25rem;\r\n  }\r\n}\r\n\r\n.hm-subscribe {\r\n  background-color: transparent;\r\n  border-radius: 3px;\r\n  box-shadow: inset 0 0 0 2px hsla(0, 0%, 100%, .5);\r\n  color: #fff;\r\n  display: block;\r\n  font-size: 20px;\r\n  font-weight: 400;\r\n  line-height: 1.2;\r\n  margin-top: 50px;\r\n  max-width: 300px;\r\n  padding: 15px 10px;\r\n  transition: all .3s;\r\n  width: 100%;\r\n\r\n  &:hover {\r\n    box-shadow: inset 0 0 0 2px #fff;\r\n  }\r\n}\r\n\r\n.hm-down {\r\n  animation-duration: 1.2s !important;\r\n  bottom: 60px;\r\n  color: hsla(0, 0%, 100%, .5);\r\n  left: 0;\r\n  margin: 0 auto;\r\n  position: absolute;\r\n  right: 0;\r\n  width: 70px;\r\n  z-index: 100;\r\n\r\n  svg {\r\n    display: block;\r\n    fill: currentcolor;\r\n    height: auto;\r\n    width: 100%;\r\n  }\r\n}\r\n\r\n// Media Query\r\n// ==========================================================================\r\n@media #{$lg-and-up} {\r\n  // Home Story-cover\r\n  .hmCover {\r\n    height: 70vh;\r\n\r\n    .st-cover {\r\n      height: 50%;\r\n      width: 33.33333%;\r\n\r\n      &.firts {\r\n        height: 100%;\r\n        width: 66.66666%;\r\n        .st-cover-title { font-size: 2.8rem }\r\n      }\r\n    }\r\n  }\r\n\r\n  // Home page\r\n  .hm-cover-title { font-size: 3.5rem }\r\n}\r\n","// post content\n// ==========================================================================\n\n.post {\n  // title\n  &-title {\n    color: #000;\n    line-height: 1.2;\n    max-width: 1000px;\n  }\n\n  &-excerpt {\n    color: #555;\n    font-family: $secundary-font;\n    font-weight: 300;\n    letter-spacing: -.012em;\n    line-height: 1.6;\n  }\n\n  // author\n  &-author-social {\n    vertical-align: middle;\n    margin-left: 2px;\n    padding: 0 3px;\n  }\n\n  &-image { margin-top: 30px }\n\n  // &-body-wrap { max-width: 700px }\n}\n\n// Avatar\n// ==========================================================================\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle;\n\n  @extend .u-round;\n\n  &--smaller {\n    width: 50px;\n    height: 50px;\n  }\n}\n\n// post content Inner\n// ==========================================================================\n.post-inner {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  font-family: $secundary-font;\n\n  a {\n    background-image: linear-gradient(to bottom, rgba(0, 0, 0, .68) 50%, rgba(0, 0, 0, 0) 50%);\n    background-position: 0 1.12em;\n    background-repeat: repeat-x;\n    background-size: 2px .2em;\n    text-decoration: none;\n    word-break: break-word;\n\n    &:hover { background-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 50%); }\n  }\n\n  img {\n    display: block;\n    margin-left: auto;\n    margin-right: auto;\n  }\n\n  h1, h2, h3, h4, h5, h6 {\n    margin-top: 30px;\n    font-style: normal;\n    color: #000;\n    letter-spacing: -.02em;\n    line-height: 1.2;\n  }\n\n  h2 { margin-top: 35px }\n\n  p {\n    font-size: 1.125rem;\n    font-weight: 400;\n    letter-spacing: -.003em;\n    line-height: 1.7;\n    margin-top: 25px;\n  }\n\n  ul,\n  ol {\n    counter-reset: post;\n    font-size: 1.125rem;\n    margin-top: 20px;\n\n    li {\n      letter-spacing: -.003em;\n      margin-bottom: 14px;\n      margin-left: 30px;\n\n      &::before {\n        box-sizing: border-box;\n        display: inline-block;\n        margin-left: -78px;\n        position: absolute;\n        text-align: right;\n        width: 78px;\n      }\n    }\n  }\n\n  ul li::before {\n    content: '\\2022';\n    font-size: 16.8px;\n    padding-right: 15px;\n    padding-top: 3px;\n  }\n\n  ol li::before {\n    content: counter(post) \".\";\n    counter-increment: post;\n    padding-right: 12px;\n  }\n\n  h1, h2, h3, h4, h5, h6, p,\n  ol, ul, hr, pre, dl, blockquote, table, .kg-embed-card {\n    min-width: 100%;\n  }\n\n  & > ul,\n  & > iframe,\n  & > img,\n  .kg-image-card,\n  .kg-card,\n  .kg-gallery-card,\n  .kg-embed-card {\n    margin-top: 30px !important\n  }\n}\n\n// Share Post\n// ==========================================================================\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  transition: all .4s;\n  top: 30px;\n\n  /* stylelint-disable-next-line */\n  a {\n    color: #fff;\n    margin: 8px 0 0;\n    display: block;\n  }\n\n  .i-chat {\n    background-color: #fff;\n    border: 2px solid #bbb;\n    color: #bbb;\n  }\n\n  .share-inner {\n    transition: visibility 0s linear 0s, opacity .3s 0s;\n\n    &.is-hidden {\n      visibility: hidden;\n      opacity: 0;\n      transition: visibility 0s linear .3s, opacity .3s 0s;\n    }\n  }\n}\n\n// Post mobile share\n/* stylelint-disable-next-line */\n.mob-share {\n  .mapache-share {\n    height: 40px;\n    color: #fff;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    box-shadow: none !important;\n  }\n\n  .share-title {\n    font-size: 14px;\n    margin-left: 10px\n  }\n}\n\n// Previus and next article\n// ==========================================================================\n/* stylelint-disable-next-line */\n.prev-next {\n  &-span {\n    color: var(--composite-color);\n    font-weight: 700;\n    font-size: 13px;\n\n    i {\n      display: inline-flex;\n      transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1)\n    }\n  }\n\n  &-title {\n    margin: 0 !important;\n    font-size: 16px;\n    height: 2em;\n    overflow: hidden;\n    line-height: 1 !important;\n    text-overflow: ellipsis !important;\n    -webkit-box-orient: vertical !important;\n    -webkit-line-clamp: 2 !important;\n    display: -webkit-box !important;\n  }\n\n  &-link:hover {\n    .arrow-right { animation: arrow-move-right 0.5s ease-in-out forwards }\n    .arrow-left { animation: arrow-move-left 0.5s ease-in-out forwards }\n  }\n}\n\n// Image post Format\n// ==========================================================================\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000;\n\n  &-header {\n    right: 0;\n    bottom: 10%;\n    left: 0;\n  }\n\n  &-figure img {\n    // opacity: .4;\n    object-fit: cover;\n    width: 100%\n  }\n\n  .post-header { max-width: 800px }\n  // .post-title { line-height: 1.1 }\n  .post-title, .post-excerpt {\n    color: #fff;\n    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);\n  }\n}\n\n// Video post Format\n// ==========================================================================\n\n.cc-video {\n  background-color: rgb(18, 18, 18);\n  padding: 80px 0 30px;\n\n  .post-excerpt { color: #aaa; font-size: 1rem }\n  .post-title { color: #fff; font-size: 1.8rem }\n  .kg-embed-card, .video-responsive { margin-top: 0 }\n  // .title-line span { font-size: 14px }\n  &-subscribe {\n    background-color: rgb(18, 18, 18);\n    color: #fff;\n    line-height: 1;\n    padding: 0 10px;\n    z-index: 1;\n  }\n}\n\n// change the design according to the classes of the body\nbody {\n  &.is-article .main { margin-bottom: 0 }\n  &.share-margin .sharePost { top: -60px }\n  // &.show-category .post-primary-tag { display: block !important }\n  &.has-cover .post-primary-tag { display: block !important }\n\n  &.is-article-single {\n    .post-body-wrap { margin-left: 0 !important }\n    .sharePost { left: -100px }\n    .kg-width-full .kg-image { max-width: 100vw }\n    .kg-width-wide .kg-image { max-width: 1040px }\n\n    .kg-gallery-container {\n      max-width: 1040px;\n      width: 100vw;\n    }\n  }\n\n  // Video\n  &.is-video {\n    // .header { background-color: rgb(35, 35, 35) }\n    // .header-left a, .nav ul li a { color: #fff; }\n    // .menu--toggle span { background-color: #fff }\n    // .post-primary-tag { display: block !important }\n    .story-small h3 { font-weight: 400 }\n  }\n}\n\n@media #{$md-and-down} {\n  .post-inner {\n    q {\n      font-size: 20px !important;\n      letter-spacing: -.008em !important;\n      line-height: 1.4 !important;\n    }\n\n    ol, ul, p {\n      font-size: 1rem;\n      letter-spacing: -.004em;\n      line-height: 1.58;\n    }\n\n    iframe { width: 100% !important; }\n  }\n\n  // Image post format\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%;\n  }\n\n  .cc-image-header { bottom: 24px }\n  .cc-image .post-excerpt { font-size: 18px; }\n\n  // video post format\n  .cc-video {\n    padding: 20px 0;\n\n    &-embed {\n      margin-left: -16px;\n      margin-right: -15px;\n    }\n\n    .post-header { margin-top: 10px }\n  }\n\n  // Image\n  .kg-width-wide .kg-image { width: 100% !important }\n}\n\n@media #{$lg-and-down} {\n  body.is-article {\n    .col-left { max-width: 100% }\n    // .sidebar { display: none; }\n  }\n}\n\n@media #{$md-and-up} {\n  // Image post Format\n  .cc-image .post-title { font-size: 3.2rem }\n  .prev-next-link { margin: 0 !important }\n  .prev-next-right { text-align: right }\n}\n\n@media #{$lg-and-up} {\n  body.is-article .post-body-wrap { margin-left: 70px; }\n\n  body.is-video,\n  body.is-image {\n    .post-author { margin-left: 70px }\n    // .sharePost { top: -85px }\n  }\n}\n\n@media #{$xl-and-up} {\n  body.has-video-fixed {\n    .cc-video-embed {\n      bottom: 20px;\n      box-shadow: 0 0 10px 0 rgba(0, 0, 0, .5);\n      height: 203px;\n      padding-bottom: 0;\n      position: fixed;\n      right: 20px;\n      width: 360px;\n      z-index: 8;\n    }\n\n    .cc-video-close {\n      background: #000;\n      border-radius: 50%;\n      color: #fff;\n      cursor: pointer;\n      display: block !important;\n      font-size: 14px;\n      height: 24px;\n      left: -10px;\n      line-height: 1;\n      padding-top: 5px;\n      position: absolute;\n      text-align: center;\n      top: -10px;\n      width: 24px;\n      z-index: 5;\n    }\n\n    .cc-video-cont { height: 465px; }\n\n    .cc-image-header { bottom: 20% }\n  }\n}\n","// styles for story\r\n\r\n.hr-list {\r\n  border: 0;\r\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\r\n  margin: 20px 0 0;\r\n  // &:first-child { margin-top: 5px }\r\n}\r\n\r\n.story-feed .story-feed-content:first-child .hr-list:first-child {\r\n  margin-top: 5px;\r\n}\r\n\r\n// media type icon ( video - image )\r\n.media-type {\r\n  // background-color: lighten($primary-color, 15%);\r\n  background-color: rgba(0, 0, 0, .7);\r\n  color: #fff;\r\n  height: 45px;\r\n  left: 15px;\r\n  top: 15px;\r\n  width: 45px;\r\n  opacity: .9;\r\n\r\n  // @extend .u-bgColor;\r\n  @extend .u-fontSizeLarger;\r\n  @extend .u-round;\r\n  @extend .u-flexCenter;\r\n  @extend .u-flexContentCenter;\r\n}\r\n\r\n// Image over\r\n.image-hover {\r\n  transition: transform .7s;\r\n  transform: translateZ(0)\r\n}\r\n\r\n// not image\r\n// .not-image {\r\n//   background: url('../images/not-image.png');\r\n//   background-repeat: repeat;\r\n// }\r\n\r\n// Meta\r\n.flow-meta {\r\n  color: rgba(0, 0, 0, 0.54);\r\n  font-weight: 500;\r\n  margin-bottom: 10px;\r\n\r\n  &-cat { color: rgba(0, 0, 0, 0.84) }\r\n  .point { margin: 0 5px }\r\n}\r\n\r\n// Story Default list\r\n// ==========================================================================\r\n\r\n.story {\r\n  &-image {\r\n    flex: 0 0  44% /*380px*/;\r\n    height: 235px;\r\n    margin-right: 30px;\r\n\r\n    &:hover .image-hover { transform: scale(1.03) }\r\n  }\r\n\r\n  &-lower { flex-grow: 1 }\r\n\r\n  &-excerpt {\r\n    color: rgba(0, 0, 0, 0.84);\r\n    font-family: $secundary-font;\r\n    font-weight: 300;\r\n    line-height: 1.5;\r\n  }\r\n\r\n  h2 a:hover {\r\n    // box-shadow: inset 0 -2px 0 rgba(0, 171, 107, .5);\r\n    // box-shadow: inset 0 -2px 0 rgba($primary-color, .5);\r\n    // box-shadow: inset 0 -2px 0 var(--story-color-hover);\r\n    // box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.4);\r\n    // transition: all .25s;\r\n    opacity: .6;\r\n  }\r\n}\r\n\r\n// Story Grid\r\n// ==========================================================================\r\n\r\n.story--grid {\r\n  .story {\r\n    flex-direction: column;\r\n    margin-bottom: 30px;\r\n\r\n    &-image {\r\n      flex: 0 0 auto;\r\n      margin-right: 0;\r\n      height: 220px;\r\n    }\r\n  }\r\n\r\n  .media-type {\r\n    font-size: 24px;\r\n    height: 40px;\r\n    width: 40px;\r\n  }\r\n}\r\n\r\n// sory cover -> .st-cover\r\n// ==========================================================================\r\n\r\n.st-cover {\r\n  overflow: hidden;\r\n  height: 300px;\r\n  width: 100%;\r\n\r\n  &-inner { height: 100% }\r\n  &-img { transition: all .25s; }\r\n  .flow-meta-cat { color: var(--story-cover-category-color) }\r\n  .flow-meta { color: #fff }\r\n\r\n  &-header {\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    padding: 50px 3.846153846% 20px;\r\n    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, .9) 100%);\r\n  }\r\n\r\n  &:hover .st-cover-img { opacity: .8 }\r\n}\r\n\r\n// Story Card\r\n// ==========================================================================\r\n\r\n.story--card {\r\n  .story {\r\n    margin-top: 0 !important;\r\n  }\r\n\r\n  /* stylelint-disable-next-line */\r\n  .story-image {\r\n    border: 1px solid rgba(0, 0, 0, .04);\r\n    box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\r\n    border-radius: 2px;\r\n    background-color: #fff !important;\r\n    transition: all 150ms ease-in-out;\r\n    overflow: hidden;\r\n    height: 200px !important;\r\n\r\n    .story-img-bg { margin: 10px }\r\n\r\n    &:hover {\r\n      box-shadow: 0 0 15px 4px rgba(0, 0, 0, .1);\r\n\r\n      .story-img-bg { transform: none }\r\n    }\r\n  }\r\n\r\n  .story-lower { display: none !important }\r\n\r\n  .story-body {\r\n    padding: 15px 5px;\r\n    margin: 0 !important;\r\n\r\n    h2 {\r\n      -webkit-box-orient: vertical !important;\r\n      -webkit-line-clamp: 2 !important;\r\n      color: rgba(0, 0, 0, .9);\r\n      display: -webkit-box !important;\r\n      // line-height: 1.1 !important;\r\n      max-height: 2.4em !important;\r\n      overflow: hidden;\r\n      text-overflow: ellipsis !important;\r\n      margin: 0;\r\n    }\r\n  }\r\n}\r\n\r\n// Story Small\r\n// ==========================================================================\r\n\r\n.story-small {\r\n  h3 {\r\n    color: #fff;\r\n    max-height: 2.5em;\r\n    overflow: hidden;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-line-clamp: 2;\r\n    text-overflow: ellipsis;\r\n    display: -webkit-box;\r\n  }\r\n\r\n  &-img {\r\n    height: 170px\r\n  }\r\n\r\n  /* stylelint-disable-next-line */\r\n  .media-type {\r\n    height: 34px;\r\n    width: 34px;\r\n  }\r\n}\r\n\r\n// All Story Hover\r\n// ==========================================================================\r\n\r\n.story--hover {\r\n  /* stylelint-disable-next-line */\r\n  .lazy-load-image, h2, h3 { transition: all .25s }\r\n\r\n  &:hover {\r\n    .lazy-load-image { opacity: .8 }\r\n    h3,h2 { opacity: .6 }\r\n  }\r\n}\r\n\r\n// Media query after medium\r\n// ==========================================================================\r\n\r\n@media #{$md-and-up} {\r\n  // story grid\r\n  .story--grid {\r\n    .story-lower {\r\n      max-height: 3em;\r\n      -webkit-box-orient: vertical;\r\n      -webkit-line-clamp: 2;\r\n      display: -webkit-box;\r\n      line-height: 1.1;\r\n      text-overflow: ellipsis;\r\n    }\r\n  }\r\n}\r\n\r\n// Media query before medium\r\n// ==========================================================================\r\n@media #{$md-and-down} {\r\n  // Story Cover\r\n  .cover--firts .story-cover { height: 500px }\r\n\r\n  // story default list\r\n  .story {\r\n    flex-direction: column;\r\n    margin-top: 20px;\r\n\r\n    &-image { flex: 0 0 auto; margin-right: 0 }\r\n    &-body { margin-top: 10px }\r\n  }\r\n}\r\n","// Author page\r\n// ==========================================================================\r\n\r\n.author {\r\n  background-color: #fff;\r\n  color: rgba(0, 0, 0, .6);\r\n  min-height: 350px;\r\n\r\n  &-avatar {\r\n    height: 80px;\r\n    width: 80px;\r\n  }\r\n\r\n  &-meta span {\r\n    display: inline-block;\r\n    font-size: 17px;\r\n    font-style: italic;\r\n    margin: 0 25px 16px 0;\r\n    opacity: .8;\r\n    word-wrap: break-word;\r\n  }\r\n\r\n  &-bio {\r\n    max-width: 700px;\r\n    font-size: 1.2rem;\r\n    font-weight: 300;\r\n    line-height: 1.4;\r\n  }\r\n\r\n  &-name { color: rgba(0, 0, 0, .8) }\r\n  &-meta a:hover { opacity: .8 !important }\r\n}\r\n\r\n.cover-opacity { opacity: .5 }\r\n\r\n.author.has--image {\r\n  color: #fff !important;\r\n  text-shadow: 0 0 10px rgba(0, 0, 0, .33);\r\n\r\n  a,\r\n  .author-name { color: #fff; }\r\n\r\n  .author-follow a {\r\n    border: 2px solid;\r\n    border-color: hsla(0, 0%, 100%, .5) !important;\r\n    font-size: 16px;\r\n  }\r\n\r\n  .u-accentColor--iconNormal { fill: #fff; }\r\n}\r\n\r\n@media #{$md-and-down} {\r\n  .author-meta span { display: block; }\r\n  .author-header { display: block; }\r\n  .author-avatar { margin: 0 auto 20px; }\r\n}\r\n\r\n@media #{$md-and-up} {\r\n  body.has-cover .author { min-height: 600px }\r\n}\r\n","// Search\r\n// ==========================================================================\r\n\r\n.search {\r\n  background-color: #fff;\r\n  height: 100%;\r\n  height: 100vh;\r\n  left: 0;\r\n  padding: 0 16px;\r\n  right: 0;\r\n  top: 0;\r\n  transform: translateY(-100%);\r\n  transition: transform .3s ease;\r\n  z-index: 9;\r\n\r\n  &-form {\r\n    max-width: 680px;\r\n    margin-top: 80px;\r\n\r\n    &::before {\r\n      background: #eee;\r\n      bottom: 0;\r\n      content: '';\r\n      display: block;\r\n      height: 2px;\r\n      left: 0;\r\n      position: absolute;\r\n      width: 100%;\r\n      z-index: 1;\r\n    }\r\n\r\n    input {\r\n      border: none;\r\n      display: block;\r\n      line-height: 40px;\r\n      padding-bottom: 8px;\r\n\r\n      &:focus { outline: 0; }\r\n    }\r\n  }\r\n\r\n  // result\r\n  &-results {\r\n    max-height: calc(100% - 100px);\r\n    max-width: 680px;\r\n    overflow: auto;\r\n\r\n    a {\r\n      padding: 10px 20px;\r\n      background: rgba(0, 0, 0, .05);\r\n      color: rgba(0, 0, 0, .7);\r\n      text-decoration: none;\r\n      display: block;\r\n      border-bottom: 1px solid #fff;\r\n      transition: all 0.3s ease-in-out;\r\n\r\n      &:hover { background: rgba(0, 0, 0, 0.1) }\r\n    }\r\n  }\r\n}\r\n\r\n.button-search--close {\r\n  position: absolute !important;\r\n  right: 50px;\r\n  top: 20px;\r\n}\r\n\r\nbody.is-search {\r\n  overflow: hidden;\r\n\r\n  .search { transform: translateY(0) }\r\n  .search-toggle { background-color: rgba(255, 255, 255, .25) }\r\n}\r\n",".sidebar {\n  &-title {\n    border-bottom: 1px solid rgba(0, 0, 0, .0785);\n\n    span {\n      border-bottom: 1px solid rgba(0, 0, 0, .54);\n      padding-bottom: 10px;\n      margin-bottom: -1px;\n    }\n  }\n}\n\n// border for post\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, .2);\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, .0785);\n  min-height: 60px;\n\n  h3 { padding: 10px }\n\n  &:hover { .sidebar-border { background-color: rgba(229, 239, 245, 1) } }\n\n  &:nth-child(3n) { .sidebar-border { border-color: darken(orange, 2%); } }\n  &:nth-child(3n+2) { .sidebar-border { border-color: #26a8ed } }\n}\n\n// Centered line and oblique content\n// ==========================================================================\n// .center-line {\n//   font-size: 16px;\n//   margin-bottom: 15px;\n//   position: relative;\n//   text-align: center;\n\n//   &::before {\n//     background: rgba(0, 0, 0, .15);\n//     bottom: 50%;\n//     content: '';\n//     display: inline-block;\n//     height: 1px;\n//     left: 0;\n//     position: absolute;\n//     width: 100%;\n//     z-index: 0;\n//   }\n// }\n\n// .oblique {\n//   background: #ff005b;\n//   color: #fff;\n//   display: inline-block;\n//   font-size: 16px;\n//   font-weight: 700;\n//   line-height: 1;\n//   padding: 5px 13px;\n//   position: relative;\n//   text-transform: uppercase;\n//   transform: skewX(-15deg);\n//   z-index: 1;\n// }\n","// Navigation Mobile\r\n.sideNav {\r\n  // background-color: $primary-color;\r\n  color: rgba(0, 0, 0, 0.8);\r\n  height: 100vh;\r\n  padding: $header-height 20px;\r\n  position: fixed !important;\r\n  transform: translateX(100%);\r\n  transition: 0.4s;\r\n  will-change: transform;\r\n  z-index: 8;\r\n\r\n  &-menu a { padding: 10px 20px; }\r\n\r\n  &-wrap {\r\n    background: #eee;\r\n    overflow: auto;\r\n    padding: 20px 0;\r\n    top: $header-height;\r\n  }\r\n\r\n  &-section {\r\n    border-bottom: solid 1px #ddd;\r\n    margin-bottom: 8px;\r\n    padding-bottom: 8px;\r\n  }\r\n\r\n  &-follow {\r\n    border-top: 1px solid #ddd;\r\n    margin: 15px 0;\r\n\r\n    a {\r\n      color: #fff;\r\n      display: inline-block;\r\n      height: 36px;\r\n      line-height: 20px;\r\n      margin: 0 5px 5px 0;\r\n      min-width: 36px;\r\n      padding: 8px;\r\n      text-align: center;\r\n      vertical-align: middle;\r\n    }\r\n\r\n    @each $social-name, $color in $social-colors {\r\n      .i-#{$social-name} {\r\n        @extend .bg-#{$social-name};\r\n      }\r\n    }\r\n  }\r\n}\r\n","//  Follow me btn is post\n// .mapache-follow {\n//   &:hover {\n//     .mapache-hover-hidden { display: none !important }\n//     .mapache-hover-show { display: inline-block !important }\n//   }\n\n//   &-btn {\n//     height: 19px;\n//     line-height: 17px;\n//     padding: 0 10px;\n//   }\n// }\n\n// Transparece header and cover img\n\n.has-cover-padding { padding-top: 100px }\n\nbody.has-cover {\n  .header { position: fixed }\n\n  &.is-transparency:not(.is-search) {\n    .header {\n      background: transparent;\n      box-shadow: none;\n      border-bottom: 1px solid hsla(0, 0%, 100%, .1);\n    }\n\n    .header-left a, .nav ul li a { color: #fff; }\n    .menu--toggle span { background-color: #fff }\n  }\n}\n","// .is-subscribe .footer {\r\n//   background-color: #f0f0f0;\r\n// }\r\n\r\n.subscribe {\r\n  min-height: 80vh !important;\r\n  height: 100%;\r\n  // background-color: #f0f0f0 !important;\r\n\r\n  &-card {\r\n    background-color: #D7EFEE;\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, .15);\r\n    border-radius: 4px;\r\n    width: 900px;\r\n    height: 550px;\r\n    padding: 50px;\r\n    margin: 5px;\r\n  }\r\n\r\n  form {\r\n    max-width: 300px;\r\n  }\r\n\r\n  &-form {\r\n    height: 100%;\r\n  }\r\n\r\n  &-input {\r\n    background: 0 0;\r\n    border: 0;\r\n    border-bottom: 1px solid #cc5454;\r\n    border-radius: 0;\r\n    padding: 7px 5px;\r\n    height: 45px;\r\n    outline: 0;\r\n    font-family: $primary-font;\r\n\r\n    &::placeholder {\r\n      color: #cc5454;\r\n    }\r\n  }\r\n\r\n  .main-error {\r\n    color: #cc5454;\r\n    font-size: 16px;\r\n    margin-top: 15px;\r\n  }\r\n}\r\n\r\n// .subscribe-btn {\r\n//   background: rgba(0, 0, 0, .84);\r\n//   border-color: rgba(0, 0, 0, .84);\r\n//   color: rgba(255, 255, 255, .97);\r\n//   box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\r\n//   letter-spacing: 1px;\r\n\r\n//   &:hover {\r\n//     background: #1C9963;\r\n//     border-color: #1C9963;\r\n//   }\r\n// }\r\n\r\n// Success\r\n.subscribe-success {\r\n  .subscribe-card {\r\n    background-color: #E8F3EC;\r\n  }\r\n}\r\n\r\n@media #{$md-and-down} {\r\n  .subscribe-card {\r\n    height: auto;\r\n    width: auto;\r\n  }\r\n}\r\n","// post Comments\n// ==========================================================================\n\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n  font-size: 14px;\n  transform: translateX(100%);\n  transition: .2s;\n  will-change: transform;\n\n  &-header {\n    padding: 20px;\n    border-bottom: 1px solid #ddd;\n\n    .toggle-comments {\n      font-size: 24px;\n      line-height: 1;\n      position: absolute;\n      left: 0;\n      top: 0;\n      padding: 17px;\n      cursor: pointer;\n    }\n  }\n\n  &-overlay {\n    position: fixed !important;\n    background-color: rgba(0, 0, 0, .2);\n    display: none;\n    transition: background-color .4s linear;\n    z-index: 8;\n    cursor: pointer;\n  }\n}\n\nbody.has-comments {\n  overflow: hidden;\n\n  .post-comments-overlay { display: block }\n  .post-comments { transform: translateX(0) }\n}\n\n@media #{$md-and-up} {\n  .post-comments {\n    left: auto;\n    max-width: 700px;\n    min-width: 500px;\n    top: $header-height;\n    z-index: 9;\n  }\n}\n",".topic {\n  &-img {\n    transition: transform .7s;\n    transform: translateZ(0)\n  }\n\n  &-items {\n    height: 320px;\n    padding: 30px;\n\n    &:hover {\n      .topic-img { transform: scale(1.03); }\n    }\n  }\n\n  &-c {\n    background-color: var(--primary-color);\n    color: #fff;\n  }\n}\n",".modal {\r\n  opacity: 0;\r\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\r\n  z-index: 100;\r\n  visibility: hidden;\r\n\r\n  // Shader\r\n  &-shader { background-color: rgba(255, 255, 255, .65) }\r\n\r\n  // modal close\r\n  &-close {\r\n    color: rgba(0, 0, 0, .54);\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    line-height: 1;\r\n    padding: 15px;\r\n  }\r\n\r\n  // Inner\r\n  &-inner {\r\n    background-color: #E8F3EC;\r\n    border-radius: 4px;\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, .15);\r\n    max-width: 700px;\r\n    height: 100%;\r\n    max-height: 400px;\r\n    opacity: 0;\r\n    padding: 72px 5% 56px;\r\n    transform: scale(.6);\r\n    transition: transform .3s cubic-bezier(.06, .47, .38, .99), opacity .3s cubic-bezier(.06, .47, .38, .99);\r\n    width: 100%;\r\n  }\r\n\r\n  // form\r\n  .form-group {\r\n    width: 76%;\r\n    margin: 0 auto 30px;\r\n  }\r\n\r\n  .form--input {\r\n    display: inline-block;\r\n    margin-bottom: 10px;\r\n    vertical-align: top;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    background-color: transparent;\r\n    padding: 17px 6px;\r\n    border-bottom: 1px solid rgba(0, 0, 0, .15);\r\n    width: 100%;\r\n  }\r\n\r\n  // .form--btn {\r\n  //   background-color: rgba(0, 0, 0, .84);\r\n  //   border: 0;\r\n  //   height: 37px;\r\n  //   border-radius: 3px;\r\n  //   line-height: 37px;\r\n  //   padding: 0 16px;\r\n  //   transition: background-color .3s ease-in-out;\r\n  //   letter-spacing: 1px;\r\n  //   color: rgba(255, 255, 255, .97);\r\n  //   cursor: pointer;\r\n\r\n  //   &:hover { background-color: #1C9963 }\r\n  // }\r\n}\r\n\r\n// if has modal\r\n\r\nbody.has-modal {\r\n  overflow: hidden;\r\n\r\n  .modal {\r\n    opacity: 1;\r\n    visibility: visible;\r\n    transition: opacity .3s ease;\r\n\r\n    &-inner {\r\n      opacity: 1;\r\n      transform: scale(1);\r\n      transition: transform .8s cubic-bezier(.26, .63, 0, .96);\r\n    }\r\n  }\r\n}\r\n","// Instagram Fedd\r\n// ==========================================================================\r\n.instagram {\r\n  &-hover {\r\n    background-color: rgba(0, 0, 0, .3);\r\n    // transition: opacity 1s ease-in-out;\r\n    opacity: 0;\r\n  }\r\n\r\n  &-img {\r\n    height: 264px;\r\n\r\n    &:hover > .instagram-hover { opacity: 1 }\r\n  }\r\n\r\n  &-name {\r\n    left: 50%;\r\n    top: 50%;\r\n    transform: translate(-50%, -50%);\r\n    z-index: 3;\r\n\r\n    a {\r\n      background-color: #fff;\r\n      color: #000 !important;\r\n      font-size: 18px !important;\r\n      font-weight: 900 !important;\r\n      min-width: 200px;\r\n      padding-left: 10px !important;\r\n      padding-right: 10px !important;\r\n      text-align: center !important;\r\n    }\r\n  }\r\n\r\n  &-col {\r\n    padding: 0 !important;\r\n    margin: 0 !important;\r\n  }\r\n\r\n  &-wrap { margin: 0 !important }\r\n}\r\n\r\n// Newsletter Sidebar\r\n// ==========================================================================\r\n.witget-subscribe {\r\n  background: #fff;\r\n  border: 5px solid transparent;\r\n  padding: 28px 30px;\r\n  position: relative;\r\n\r\n  &::before {\r\n    content: \"\";\r\n    border: 5px solid #f5f5f5;\r\n    box-shadow: inset 0 0 0 1px #d7d7d7;\r\n    box-sizing: border-box;\r\n    display: block;\r\n    height: calc(100% + 10px);\r\n    left: -5px;\r\n    pointer-events: none;\r\n    position: absolute;\r\n    top: -5px;\r\n    width: calc(100% + 10px);\r\n    z-index: 1;\r\n  }\r\n\r\n  input {\r\n    background: #fff;\r\n    border: 1px solid #e5e5e5;\r\n    color: rgba(0, 0, 0, .54);\r\n    height: 41px;\r\n    outline: 0;\r\n    padding: 0 16px;\r\n    width: 100%;\r\n  }\r\n\r\n  button {\r\n    background: var(--composite-color);\r\n    border-radius: 0;\r\n    width: 100%;\r\n  }\r\n}\r\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 19 */
/*!**************************************************!*\
  !*** ../node_modules/css-loader/lib/css-base.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 20 */
/*!*****************************************************!*\
  !*** ../node_modules/style-loader/lib/addStyles.js ***!
  \*****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ 21);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 21 */
/*!************************************************!*\
  !*** ../node_modules/style-loader/lib/urls.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 22 */,
/* 23 */
/*!***************************!*\
  !*** ./fonts/mapache.eot ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.eot";

/***/ }),
/* 24 */
/*!****************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/main.js ./styles/main.scss ***!
  \****************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\Smigol\Projects\ghost\content\themes\mapache\src\build\util/../helpers/hmr-client.js */2);
__webpack_require__(/*! ./scripts/main.js */25);
module.exports = __webpack_require__(/*! ./styles/main.scss */51);


/***/ }),
/* 25 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar__ = __webpack_require__(/*! theia-sticky-sidebar */ 26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__autoload_transition_js__ = __webpack_require__(/*! ./autoload/transition.js */ 27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__autoload_transition_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__autoload_transition_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__autoload_zoom_js__ = __webpack_require__(/*! ./autoload/zoom.js */ 28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__autoload_zoom_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__autoload_zoom_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mapache__ = __webpack_require__(/*! ./mapache */ 29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_Router__ = __webpack_require__(/*! ./util/Router */ 31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__routes_common__ = __webpack_require__(/*! ./routes/common */ 33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__routes_post__ = __webpack_require__(/*! ./routes/post */ 43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__routes_video__ = __webpack_require__(/*! ./routes/video */ 48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_app_pagination__ = __webpack_require__(/*! ./app/app.pagination */ 50);
// import external dependencies


// Import everything from autoload
 

// Impor main Script


// Pagination infinite scroll
// import './app/pagination';

// import local dependencies




// import isAudio from './routes/audio';



/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_4__util_Router__["a" /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_5__routes_common__["a" /* default */],

  // article
  isArticle: __WEBPACK_IMPORTED_MODULE_6__routes_post__["a" /* default */],

  // Pagination (home - tag - author) infinite scroll
  isPagination: __WEBPACK_IMPORTED_MODULE_8__app_app_pagination__["a" /* default */],

  // video post format
  isVideo: __WEBPACK_IMPORTED_MODULE_7__routes_video__["a" /* default */],

  // Audio post Format
  // isAudio,
});

// Load Events
jQuery(document).ready(function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 26 */
/*!*************************************************************************!*\
  !*** ../node_modules/theia-sticky-sidebar/dist/theia-sticky-sidebar.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*!
 * Theia Sticky Sidebar v1.7.0
 * https://github.com/WeCodePixels/theia-sticky-sidebar
 *
 * Glues your website's sidebars, making them permanently visible while scrolling.
 *
 * Copyright 2013-2016 WeCodePixels and other contributors
 * Released under the MIT license
 */

(function ($) {
    $.fn.theiaStickySidebar = function (options) {
        var defaults = {
            'containerSelector': '',
            'additionalMarginTop': 0,
            'additionalMarginBottom': 0,
            'updateSidebarHeight': true,
            'minWidth': 0,
            'disableOnResponsiveLayouts': true,
            'sidebarBehavior': 'modern',
            'defaultPosition': 'relative',
            'namespace': 'TSS'
        };
        options = $.extend(defaults, options);

        // Validate options
        options.additionalMarginTop = parseInt(options.additionalMarginTop) || 0;
        options.additionalMarginBottom = parseInt(options.additionalMarginBottom) || 0;

        tryInitOrHookIntoEvents(options, this);

        // Try doing init, otherwise hook into window.resize and document.scroll and try again then.
        function tryInitOrHookIntoEvents(options, $that) {
            var success = tryInit(options, $that);

            if (!success) {
                console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');

                $(document).on('scroll.' + options.namespace, function (options, $that) {
                    return function (evt) {
                        var success = tryInit(options, $that);

                        if (success) {
                            $(this).unbind(evt);
                        }
                    };
                }(options, $that));
                $(window).on('resize.' + options.namespace, function (options, $that) {
                    return function (evt) {
                        var success = tryInit(options, $that);

                        if (success) {
                            $(this).unbind(evt);
                        }
                    };
                }(options, $that))
            }
        }

        // Try doing init if proper conditions are met.
        function tryInit(options, $that) {
            if (options.initialized === true) {
                return true;
            }

            if ($('body').width() < options.minWidth) {
                return false;
            }

            init(options, $that);

            return true;
        }

        // Init the sticky sidebar(s).
        function init(options, $that) {
            options.initialized = true;

            // Add CSS
            var existingStylesheet = $('#theia-sticky-sidebar-stylesheet-' + options.namespace);
            if (existingStylesheet.length === 0) {
                $('head').append($('<style id="theia-sticky-sidebar-stylesheet-' + options.namespace + '">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'));
            }

            $that.each(function () {
                var o = {};

                o.sidebar = $(this);

                // Save options
                o.options = options || {};

                // Get container
                o.container = $(o.options.containerSelector);
                if (o.container.length == 0) {
                    o.container = o.sidebar.parent();
                }

                // Create sticky sidebar
                o.sidebar.parents().css('-webkit-transform', 'none'); // Fix for WebKit bug - https://code.google.com/p/chromium/issues/detail?id=20574
                o.sidebar.css({
                    'position': o.options.defaultPosition,
                    'overflow': 'visible',
                    // The "box-sizing" must be set to "content-box" because we set a fixed height to this element when the sticky sidebar has a fixed position.
                    '-webkit-box-sizing': 'border-box',
                    '-moz-box-sizing': 'border-box',
                    'box-sizing': 'border-box'
                });

                // Get the sticky sidebar element. If none has been found, then create one.
                o.stickySidebar = o.sidebar.find('.theiaStickySidebar');
                if (o.stickySidebar.length == 0) {
                    // Remove <script> tags, otherwise they will be run again when added to the stickySidebar.
                    var javaScriptMIMETypes = /(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;
                    o.sidebar.find('script').filter(function (index, script) {
                        return script.type.length === 0 || script.type.match(javaScriptMIMETypes);
                    }).remove();

                    o.stickySidebar = $('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());
                    o.sidebar.append(o.stickySidebar);
                }

                // Get existing top and bottom margins and paddings
                o.marginBottom = parseInt(o.sidebar.css('margin-bottom'));
                o.paddingTop = parseInt(o.sidebar.css('padding-top'));
                o.paddingBottom = parseInt(o.sidebar.css('padding-bottom'));

                // Add a temporary padding rule to check for collapsable margins.
                var collapsedTopHeight = o.stickySidebar.offset().top;
                var collapsedBottomHeight = o.stickySidebar.outerHeight();
                o.stickySidebar.css('padding-top', 1);
                o.stickySidebar.css('padding-bottom', 1);
                collapsedTopHeight -= o.stickySidebar.offset().top;
                collapsedBottomHeight = o.stickySidebar.outerHeight() - collapsedBottomHeight - collapsedTopHeight;
                if (collapsedTopHeight == 0) {
                    o.stickySidebar.css('padding-top', 0);
                    o.stickySidebarPaddingTop = 0;
                }
                else {
                    o.stickySidebarPaddingTop = 1;
                }

                if (collapsedBottomHeight == 0) {
                    o.stickySidebar.css('padding-bottom', 0);
                    o.stickySidebarPaddingBottom = 0;
                }
                else {
                    o.stickySidebarPaddingBottom = 1;
                }

                // We use this to know whether the user is scrolling up or down.
                o.previousScrollTop = null;

                // Scroll top (value) when the sidebar has fixed position.
                o.fixedScrollTop = 0;

                // Set sidebar to default values.
                resetSidebar();

                o.onScroll = function (o) {
                    // Stop if the sidebar isn't visible.
                    if (!o.stickySidebar.is(":visible")) {
                        return;
                    }

                    // Stop if the window is too small.
                    if ($('body').width() < o.options.minWidth) {
                        resetSidebar();
                        return;
                    }

                    // Stop if the sidebar width is larger than the container width (e.g. the theme is responsive and the sidebar is now below the content)
                    if (o.options.disableOnResponsiveLayouts) {
                        var sidebarWidth = o.sidebar.outerWidth(o.sidebar.css('float') == 'none');

                        if (sidebarWidth + 50 > o.container.width()) {
                            resetSidebar();
                            return;
                        }
                    }

                    var scrollTop = $(document).scrollTop();
                    var position = 'static';

                    // If the user has scrolled down enough for the sidebar to be clipped at the top, then we can consider changing its position.
                    if (scrollTop >= o.sidebar.offset().top + (o.paddingTop - o.options.additionalMarginTop)) {
                        // The top and bottom offsets, used in various calculations.
                        var offsetTop = o.paddingTop + options.additionalMarginTop;
                        var offsetBottom = o.paddingBottom + o.marginBottom + options.additionalMarginBottom;

                        // All top and bottom positions are relative to the window, not to the parent elemnts.
                        var containerTop = o.sidebar.offset().top;
                        var containerBottom = o.sidebar.offset().top + getClearedHeight(o.container);

                        // The top and bottom offsets relative to the window screen top (zero) and bottom (window height).
                        var windowOffsetTop = 0 + options.additionalMarginTop;
                        var windowOffsetBottom;

                        var sidebarSmallerThanWindow = (o.stickySidebar.outerHeight() + offsetTop + offsetBottom) < $(window).height();
                        if (sidebarSmallerThanWindow) {
                            windowOffsetBottom = windowOffsetTop + o.stickySidebar.outerHeight();
                        }
                        else {
                            windowOffsetBottom = $(window).height() - o.marginBottom - o.paddingBottom - options.additionalMarginBottom;
                        }

                        var staticLimitTop = containerTop - scrollTop + o.paddingTop;
                        var staticLimitBottom = containerBottom - scrollTop - o.paddingBottom - o.marginBottom;

                        var top = o.stickySidebar.offset().top - scrollTop;
                        var scrollTopDiff = o.previousScrollTop - scrollTop;

                        // If the sidebar position is fixed, then it won't move up or down by itself. So, we manually adjust the top coordinate.
                        if (o.stickySidebar.css('position') == 'fixed') {
                            if (o.options.sidebarBehavior == 'modern') {
                                top += scrollTopDiff;
                            }
                        }

                        if (o.options.sidebarBehavior == 'stick-to-top') {
                            top = options.additionalMarginTop;
                        }

                        if (o.options.sidebarBehavior == 'stick-to-bottom') {
                            top = windowOffsetBottom - o.stickySidebar.outerHeight();
                        }

                        if (scrollTopDiff > 0) { // If the user is scrolling up.
                            top = Math.min(top, windowOffsetTop);
                        }
                        else { // If the user is scrolling down.
                            top = Math.max(top, windowOffsetBottom - o.stickySidebar.outerHeight());
                        }

                        top = Math.max(top, staticLimitTop);

                        top = Math.min(top, staticLimitBottom - o.stickySidebar.outerHeight());

                        // If the sidebar is the same height as the container, we won't use fixed positioning.
                        var sidebarSameHeightAsContainer = o.container.height() == o.stickySidebar.outerHeight();

                        if (!sidebarSameHeightAsContainer && top == windowOffsetTop) {
                            position = 'fixed';
                        }
                        else if (!sidebarSameHeightAsContainer && top == windowOffsetBottom - o.stickySidebar.outerHeight()) {
                            position = 'fixed';
                        }
                        else if (scrollTop + top - o.sidebar.offset().top - o.paddingTop <= options.additionalMarginTop) {
                            // Stuck to the top of the page. No special behavior.
                            position = 'static';
                        }
                        else {
                            // Stuck to the bottom of the page.
                            position = 'absolute';
                        }
                    }

                    /*
                     * Performance notice: It's OK to set these CSS values at each resize/scroll, even if they don't change.
                     * It's way slower to first check if the values have changed.
                     */
                    if (position == 'fixed') {
                        var scrollLeft = $(document).scrollLeft();

                        o.stickySidebar.css({
                            'position': 'fixed',
                            'width': getWidthForObject(o.stickySidebar) + 'px',
                            'transform': 'translateY(' + top + 'px)',
                            'left': (o.sidebar.offset().left + parseInt(o.sidebar.css('padding-left')) - scrollLeft) + 'px',
                            'top': '0px'
                        });
                    }
                    else if (position == 'absolute') {
                        var css = {};

                        if (o.stickySidebar.css('position') != 'absolute') {
                            css.position = 'absolute';
                            css.transform = 'translateY(' + (scrollTop + top - o.sidebar.offset().top - o.stickySidebarPaddingTop - o.stickySidebarPaddingBottom) + 'px)';
                            css.top = '0px';
                        }

                        css.width = getWidthForObject(o.stickySidebar) + 'px';
                        css.left = '';

                        o.stickySidebar.css(css);
                    }
                    else if (position == 'static') {
                        resetSidebar();
                    }

                    if (position != 'static') {
                        if (o.options.updateSidebarHeight == true) {
                            o.sidebar.css({
                                'min-height': o.stickySidebar.outerHeight() + o.stickySidebar.offset().top - o.sidebar.offset().top + o.paddingBottom
                            });
                        }
                    }

                    o.previousScrollTop = scrollTop;
                };

                // Initialize the sidebar's position.
                o.onScroll(o);

                // Recalculate the sidebar's position on every scroll and resize.
                $(document).on('scroll.' + o.options.namespace, function (o) {
                    return function () {
                        o.onScroll(o);
                    };
                }(o));
                $(window).on('resize.' + o.options.namespace, function (o) {
                    return function () {
                        o.stickySidebar.css({'position': 'static'});
                        o.onScroll(o);
                    };
                }(o));

                // Recalculate the sidebar's position every time the sidebar changes its size.
                if (typeof ResizeSensor !== 'undefined') {
                    new ResizeSensor(o.stickySidebar[0], function (o) {
                        return function () {
                            o.onScroll(o);
                        };
                    }(o));
                }

                // Reset the sidebar to its default state
                function resetSidebar() {
                    o.fixedScrollTop = 0;
                    o.sidebar.css({
                        'min-height': '1px'
                    });
                    o.stickySidebar.css({
                        'position': 'static',
                        'width': '',
                        'transform': 'none'
                    });
                }

                // Get the height of a div as if its floated children were cleared. Note that this function fails if the floats are more than one level deep.
                function getClearedHeight(e) {
                    var height = e.height();

                    e.children().each(function () {
                        height = Math.max(height, $(this).height());
                    });

                    return height;
                }
            });
        }

        function getWidthForObject(object) {
            var width;

            try {
                width = object[0].getBoundingClientRect().width;
            }
            catch (err) {
            }

            if (typeof width === "undefined") {
                width = object.width();
            }

            return width;
        }

        return this;
    }
})(jQuery);

//# sourceMappingURL=maps/theia-sticky-sidebar.js.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 27 */
/*!****************************************!*\
  !*** ./scripts/autoload/transition.js ***!
  \****************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* eslint-disable */

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) { $($el).trigger($.support.transition.end) } }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) { return }

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) { return e.handleObj.handler.apply(this, arguments) }
      }
    }
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 28 */
/*!**********************************!*\
  !*** ./scripts/autoload/zoom.js ***!
  \**********************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* eslint-disable */

/**
 * zoom.js - It's the best way to zoom an image
 * @version v0.0.2
 * @link https://github.com/fat/zoom.js
 * @license MIT
 */

+function ($) { "use strict";

  /**
   * The zoom service
   */
  function ZoomService () {
    this._activeZoom            =
    this._initialScrollPosition =
    this._initialTouchPosition  =
    this._touchMoveListener     = null

    this._$document = $(document)
    this._$window   = $(window)
    this._$body     = $(document.body)

    this._boundClick = $.proxy(this._clickHandler, this)
  }

  ZoomService.prototype.listen = function () {
    this._$body.on('click', '[data-action="zoom"]', $.proxy(this._zoom, this))
  }

  ZoomService.prototype._zoom = function (e) {
    var target = e.target

    if (!target || target.tagName != 'IMG') { return }

    if (this._$body.hasClass('zoom-overlay-open')) { return }

    if (e.metaKey || e.ctrlKey) {
      return window.open((e.target.getAttribute('data-original') || e.target.src), '_blank')
    }

    if (target.width >= ($(window).width() - Zoom.OFFSET)) { return }

    this._activeZoomClose(true)

    this._activeZoom = new Zoom(target)
    this._activeZoom.zoomImage()

    // todo(fat): probably worth throttling this
    this._$window.on('scroll.zoom', $.proxy(this._scrollHandler, this))

    this._$document.on('keyup.zoom', $.proxy(this._keyHandler, this))
    this._$document.on('touchstart.zoom', $.proxy(this._touchStart, this))

    // we use a capturing phase here to prevent unintended js events
    // sadly no useCapture in jquery api (http://bugs.jquery.com/ticket/14953)
    if (document.addEventListener) {
      document.addEventListener('click', this._boundClick, true)
    } else {
      document.attachEvent('onclick', this._boundClick, true)
    }

    if ('bubbles' in e) {
      if (e.bubbles) { e.stopPropagation() }
    } else {
      // Internet Explorer before version 9
      e.cancelBubble = true
    }
  }

  ZoomService.prototype._activeZoomClose = function (forceDispose) {
    if (!this._activeZoom) { return }

    if (forceDispose) {
      this._activeZoom.dispose()
    } else {
      this._activeZoom.close()
    }

    this._$window.off('.zoom')
    this._$document.off('.zoom')

    document.removeEventListener('click', this._boundClick, true)

    this._activeZoom = null
  }

  ZoomService.prototype._scrollHandler = function (e) {
    if (this._initialScrollPosition === null) { this._initialScrollPosition = $(window).scrollTop() }
    var deltaY = this._initialScrollPosition - $(window).scrollTop()
    if (Math.abs(deltaY) >= 40) { this._activeZoomClose() }
  }

  ZoomService.prototype._keyHandler = function (e) {
    if (e.keyCode == 27) { this._activeZoomClose() }
  }

  ZoomService.prototype._clickHandler = function (e) {
    if (e.preventDefault) { e.preventDefault() }
    else { event.returnValue = false }

    if ('bubbles' in e) {
      if (e.bubbles) { e.stopPropagation() }
    } else {
      // Internet Explorer before version 9
      e.cancelBubble = true
    }

    this._activeZoomClose()
  }

  ZoomService.prototype._touchStart = function (e) {
    this._initialTouchPosition = e.touches[0].pageY
    $(e.target).on('touchmove.zoom', $.proxy(this._touchMove, this))
  }

  ZoomService.prototype._touchMove = function (e) {
    if (Math.abs(e.touches[0].pageY - this._initialTouchPosition) > 10) {
      this._activeZoomClose()
      $(e.target).off('touchmove.zoom')
    }
  }


  /**
   * The zoom object
   */
  function Zoom (img) {
    this._fullHeight      =
    this._fullWidth       =
    this._overlay         =
    this._targetImageWrap = null

    this._targetImage = img

    this._$body = $(document.body)
  }

  Zoom.OFFSET = 80
  Zoom._MAX_WIDTH = 2560
  Zoom._MAX_HEIGHT = 4096

  Zoom.prototype.zoomImage = function () {
    var img = document.createElement('img')
    img.onload = $.proxy(function () {
      this._fullHeight = Number(img.height)
      this._fullWidth = Number(img.width)
      this._zoomOriginal()
    }, this)
    img.src = this._targetImage.src
  }

  Zoom.prototype._zoomOriginal = function () {
    this._targetImageWrap           = document.createElement('div')
    this._targetImageWrap.className = 'zoom-img-wrap'

    this._targetImage.parentNode.insertBefore(this._targetImageWrap, this._targetImage)
    this._targetImageWrap.appendChild(this._targetImage)

    $(this._targetImage)
      .addClass('zoom-img')
      .attr('data-action', 'zoom-out')

    this._overlay           = document.createElement('div')
    this._overlay.className = 'zoom-overlay'

    document.body.appendChild(this._overlay)

    this._calculateZoom()
    this._triggerAnimation()
  }

  Zoom.prototype._calculateZoom = function () {
    this._targetImage.offsetWidth // repaint before animating

    var originalFullImageWidth  = this._fullWidth
    var originalFullImageHeight = this._fullHeight

    var scrollTop = $(window).scrollTop()

    var maxScaleFactor = originalFullImageWidth / this._targetImage.width

    var viewportHeight = ($(window).height() - Zoom.OFFSET)
    var viewportWidth  = ($(window).width() - Zoom.OFFSET)

    var imageAspectRatio    = originalFullImageWidth / originalFullImageHeight
    var viewportAspectRatio = viewportWidth / viewportHeight

    if (originalFullImageWidth < viewportWidth && originalFullImageHeight < viewportHeight) {
      this._imgScaleFactor = maxScaleFactor

    } else if (imageAspectRatio < viewportAspectRatio) {
      this._imgScaleFactor = (viewportHeight / originalFullImageHeight) * maxScaleFactor

    } else {
      this._imgScaleFactor = (viewportWidth / originalFullImageWidth) * maxScaleFactor
    }
  }

  Zoom.prototype._triggerAnimation = function () {
    this._targetImage.offsetWidth // repaint before animating

    var imageOffset = $(this._targetImage).offset()
    var scrollTop   = $(window).scrollTop()

    var viewportY = scrollTop + ($(window).height() / 2)
    var viewportX = ($(window).width() / 2)

    var imageCenterY = imageOffset.top + (this._targetImage.height / 2)
    var imageCenterX = imageOffset.left + (this._targetImage.width / 2)

    this._translateY = viewportY - imageCenterY
    this._translateX = viewportX - imageCenterX

    var targetTransform = 'scale(' + this._imgScaleFactor + ')'
    var imageWrapTransform = 'translate(' + this._translateX + 'px, ' + this._translateY + 'px)'

    if ($.support.transition) {
      imageWrapTransform += ' translateZ(0)'
    }

    $(this._targetImage)
      .css({
        '-webkit-transform': targetTransform,
            '-ms-transform': targetTransform,
                'transform': targetTransform
      })

    $(this._targetImageWrap)
      .css({
        '-webkit-transform': imageWrapTransform,
            '-ms-transform': imageWrapTransform,
                'transform': imageWrapTransform
      })

    this._$body.addClass('zoom-overlay-open')
  }

  Zoom.prototype.close = function () {
    this._$body
      .removeClass('zoom-overlay-open')
      .addClass('zoom-overlay-transitioning')

    // we use setStyle here so that the correct vender prefix for transform is used
    $(this._targetImage)
      .css({
        '-webkit-transform': '',
            '-ms-transform': '',
                'transform': ''
      })

    $(this._targetImageWrap)
      .css({
        '-webkit-transform': '',
            '-ms-transform': '',
                'transform': ''
      })

    if (!$.support.transition) {
      return this.dispose()
    }

    $(this._targetImage)
      .one($.support.transition.end, $.proxy(this.dispose, this))
      .emulateTransitionEnd(300)
  }

  Zoom.prototype.dispose = function () {
    if (this._targetImageWrap && this._targetImageWrap.parentNode) {
      $(this._targetImage)
        .removeClass('zoom-img')
        .attr('data-action', 'zoom')

      this._targetImageWrap.parentNode.replaceChild(this._targetImage, this._targetImageWrap)
      this._overlay.parentNode.removeChild(this._overlay)

      this._$body.removeClass('zoom-overlay-transitioning')
    }
  }

  // wait for dom ready (incase script included before body)
  $(function () {
    new ZoomService().listen()
  })

}(jQuery)

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 29 */
/*!****************************!*\
  !*** ./scripts/mapache.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_share__ = __webpack_require__(/*! ./app/app.share */ 30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_share___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_app_share__);
// Impornt


(function ($) {
  // Varibles
  var $win = $(window);
  var $body = $('body');
  // const $header = $('.header');
  var intersectSels = ['.kg-width-full', '.kg-width-wide'];
  var $shareBox = $('.share-inner')

  var observe = [];
  var didScroll = false;
  var lastScrollTop = 0;
  // let lastScroll = 0;
  var delta = 5;

  $(intersectSels.join(',')).map(function () {
    observe.push(this);
  });

  /**
   * Dpcument Ready
   */
  $( document ).ready(function() {
    /* Menu open and close for mobile */
    $('.menu--toggle').on('click', function (e) {
      e.preventDefault();
      $body.toggleClass('is-showNavMob').removeClass('is-search');
    });

    /* Share article in Social media */
    $('.mapache-share').bind('click', function (e) {
      e.preventDefault();
      var share = new __WEBPACK_IMPORTED_MODULE_0__app_app_share___default.a($(this));
      share.share();
    });

    /* Toggle show more social media */
    $('.follow-toggle').on('click', function (e) {
      e.preventDefault();
      $body.toggleClass('is-showFollowMore');
    });

    /* Modal Open for susbscribe */
    $('.modal-toggle').on('click', function (e) {
      e.preventDefault();
      $body.toggleClass('has-modal');
    });

    /* scroll link width click (ID)*/
    $('.scrolltop').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 60 }, 500, 'linear');
    });

    /* Toggle card for search Search */
    $('.search-toggle').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('is-search').removeClass('is-showNavMob');
    });

    // Open Post Comments
    $('.toggle-comments').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('has-comments').removeClass('is-showNavMob')
    });

  });

  /* Intersect share and image */
  var intersects = function (el1, el2) {
    var rect1 = el1.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();

    return !(rect1.top > rect2.bottom || rect1.right < rect2.left || rect1.bottom < rect2.top || rect1.left > rect2.right);
  }

  /* the floating fade sharing */
  function shareFadeHiden () {
    if( $win.width() < 1000 ){ return false }

    var ele = $shareBox.get(0);
    var isHidden = false;

    for( var i in observe) {
      if( intersects( ele, observe[i]) ) {
        isHidden = true;
        break;
      }
    }

    (isHidden ? $shareBox.addClass('is-hidden') : $shareBox.removeClass('is-hidden'));
  }

  // functions that are activated when scrolling
  function hasScrolled() {
    var st = $win.scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta) {
      return;
    }

    // Scroll down and Scroll up -> show and hide header
    // if (lastScroll <= st) {
    //   // Scroll Down
    //   $body.addClass('has-header-up');
    //   lastScroll = st;
    // } else {
    //   // Scroll UP
    //   $body.removeClass('has-header-up');
    //   lastScroll = st;
    // }

    // show background and transparency
    if ($body.hasClass('has-cover')) {
      if (st >= 100) {
        $body.removeClass('is-transparency');
      } else {
        $body.addClass('is-transparency');
      }
    }

    // Share Fade
    if ($body.hasClass('is-article-single')) {
      if (observe.length) { shareFadeHiden() }
    }

    lastScrollTop = st;
  }

  // Active Scroll
  $win.on('scroll', function () { return didScroll = true; } );

  // Windowns on load
  $win.on('load', function() {
    setInterval(function () {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);
  });

})(jQuery);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 30 */
/*!**********************************!*\
  !*** ./scripts/app/app.share.js ***!
  \**********************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

/*
* @package godofredoninja
* Share social media
*/

var mapacheShare = function mapacheShare(elem) {
  this.elem = elem;
  this.popWidth = 600;
  this.popHeight = 480;
  this.left = ((window.innerWidth / 2) - (this.popWidth / 2)) + window.screenX;
  this.top = ((window.innerHeight / 2) - (this.popHeight / 2)) + window.screenY;
};

/**
 * @description Helper to get the attribute of a DOM element
 * @param {String} attr DOM element attribute
 * @returns {String|Empty} returns the attr value or empty string
 */
mapacheShare.prototype.attributes = function attributes (a) {
  var val = this.elem.attr(("data-" + a));
  return (val === undefined || val === null) ? false : val;
};

/**
 * @description Main share event. Will pop a window or redirect to a link
 */
mapacheShare.prototype.share = function share () {
  var socialMediaName = this.attributes('share').toLowerCase();

  var socialMedia = {
    facebook: {
      shareUrl: 'https://www.facebook.com/sharer.php',
      params: {
        u: this.attributes('url'),
      },
    },
    twitter: {
      shareUrl: 'https://twitter.com/intent/tweet/',
      params: {
        text: this.attributes('title'),
        url: this.attributes('url'),
      },
    },
    reddit: {
      shareUrl: 'https://www.reddit.com/submit',
      params: {
        url: this.attributes('url'),
      },
    },
    pinterest: {
      shareUrl: 'https://www.pinterest.com/pin/create/button/',
      params: {
        url: this.attributes('url'),
        description: this.attributes('title'),
      },
    },
    linkedin: {
      shareUrl: 'https://www.linkedin.com/shareArticle',
      params: {
        url: this.attributes('url'),
        mini: true,
      },
    },
    whatsapp: {
      shareUrl: 'whatsapp://send',
      params: {
        text: this.attributes('title') + ' ' + this.attributes('url'),
      },
      isLink: true,
    },
    pocket: {
      shareUrl: 'https://getpocket.com/save',
      params: {
        url: this.attributes('url'),
      },
    },
  };

  var social = socialMedia[socialMediaName];

  return social !== undefined ? this.popup(social) : false;
};

/* windows Popup */
mapacheShare.prototype.popup = function popup (share) {
  var p = share.params || {};
  var keys = Object.keys(p);

  var socialMediaUrl = share.shareUrl;
  var str = keys.length > 0 ? '?' : '';

  Object.keys(keys).forEach(function (i) {
    if (str !== '?') {
      str += '&';
    }

    if (p[keys[i]]) {
      str += (keys[i]) + "=" + (encodeURIComponent(p[keys[i]]));
    }
  });

  socialMediaUrl += str;

  if (!share.isLink) {
    var popParams = "scrollbars=no, width=" + (this.popWidth) + ", height=" + (this.popHeight) + ", top=" + (this.top) + ", left=" + (this.left);
    var newWindow = window.open(socialMediaUrl, '', popParams);

    if (window.focus) {
      newWindow.focus();
    }
  } else {
    window.location.href = socialMediaUrl;
  }
};

/* Export Class */
module.exports = mapacheShare;


/***/ }),
/* 31 */
/*!********************************!*\
  !*** ./scripts/util/Router.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(/*! ./camelCase */ 32);


/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
var Router = function Router(routes) {
  this.routes = routes;
};

/**
 * Fire Router events
 * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
 * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
 * @param {string} [arg] Any custom argument to be passed to the event.
 */
Router.prototype.fire = function fire (route, event, arg) {
    if ( event === void 0 ) event = 'init';

  var fire = route !== '' && this.routes[route] && typeof this.routes[route][event] === 'function';
  if (fire) {
    this.routes[route][event](arg);
  }
};

/**
 * Automatically load and fire Router events
 *
 * Events are fired in the following order:
 ** common init
 ** page-specific init
 ** page-specific finalize
 ** common finalize
 */
Router.prototype.loadEvents = function loadEvents () {
    var this$1 = this;

  // Fire common init JS
  this.fire('common');

  // Fire page-specific init JS, and then finalize JS
  document.body.className
    .toLowerCase()
    .replace(/-/g, '_')
    .split(/\s+/)
    .map(__WEBPACK_IMPORTED_MODULE_0__camelCase__["a" /* default */])
    .forEach(function (className) {
      this$1.fire(className);
      this$1.fire(className, 'finalize');
    });

  // Fire common finalize JS
  this.fire('common', 'finalize');
};

/* harmony default export */ __webpack_exports__["a"] = (Router);


/***/ }),
/* 32 */
/*!***********************************!*\
  !*** ./scripts/util/camelCase.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * the most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */
/* harmony default export */ __webpack_exports__["a"] = (function (str) { return ("" + (str.charAt(0).toLowerCase()) + (str.replace(/[\W_]/g, '|').split('|')
  .map(function (part) { return ("" + (part.charAt(0).toUpperCase()) + (part.slice(1))); })
  .join('')
  .slice(1))); });;


/***/ }),
/* 33 */
/*!**********************************!*\
  !*** ./scripts/routes/common.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_follow__ = __webpack_require__(/*! ../app/app.follow */ 34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_app_footer_links__ = __webpack_require__(/*! ../app/app.footer.links */ 35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_search__ = __webpack_require__(/*! ../app/search */ 36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_search___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__app_search__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_lazy_load__ = __webpack_require__(/*! ../app/app.lazy-load */ 17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_twitter__ = __webpack_require__(/*! ../app/app.twitter */ 42);


// import simplyGhostSearch from '../app/app.search';




// Varibles
var urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

var mySearchSettings = {
  input: '#search-field',
  results: '#searchResults',
  on: {
    beforeFetch: function () {$('body').addClass('is-loading')},
    afterFetch: function () {setTimeout(function () {$('body').removeClass('is-loading')}, 4000)},
  },
}

/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // Change title HOME PAGE
    if (typeof homeTitle !== 'undefined') { $('#home-title').html(homeTitle); } // eslint-disable-line

    // change BTN ( Name - URL) in Home Page
    if (typeof homeBtnTitle !== 'undefined' && typeof homeBtnURL !== 'undefined') {
      $('#home-button').attr('href', homeBtnURL).html(homeBtnTitle); // eslint-disable-line
    }

    // Follow me
    if (typeof followSocialMedia !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_0__app_app_follow__["a" /* default */])(followSocialMedia, urlRegexp); } // eslint-disable-line

    /* Footer Links */
    if (typeof footerLinks !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_1__app_app_footer_links__["a" /* default */]) (footerLinks, urlRegexp); } // eslint-disable-line

    /* Lazy load for image */
    /* Lazy load for image */
    Object(__WEBPACK_IMPORTED_MODULE_3__app_app_lazy_load__["a" /* default */])();
    // $('.lazy-load-image').lazyload({effect : 'fadeIn'});
    // $('.lazy-load-image').lazyload({threshold : 200});
  }, // end Init

  finalize: function finalize() {
    /* sicky sidebar */
    $('.sidebar-sticky').theiaStickySidebar({
      additionalMarginTop: 70,
      minWidth: 970,
    });

    if (typeof searchSettings !== 'undefined') {
      Object.assign(mySearchSettings, searchSettings); // eslint-disable-line
    }

    // Search
    new __WEBPACK_IMPORTED_MODULE_2__app_search___default.a(mySearchSettings);

    // Twitter Widget
    if (typeof twitterUserName !== 'undefined' && typeof twitterNumber !== 'undefined') {
      Object(__WEBPACK_IMPORTED_MODULE_4__app_app_twitter__["a" /* default */])(twitterUserName, twitterNumber); // eslint-disable-line
    }

    // show comments count of disqus
    // if (typeof disqusShortName !== 'undefined') $('.mapache-disqus').removeClass('u-hide');

  }, //end => Finalize
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 34 */
/*!***********************************!*\
  !*** ./scripts/app/app.follow.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (links, urlRegexp) {

  $('.follow-toggle').removeClass('u-hide');

  return $.each(links, function (name, url) {
    if (typeof url === 'string' && urlRegexp.test(url)) {
      var template = "<a href=\"" + url + "\" title=\"Follow me in " + name + "\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"i-" + name + "\"></a>";

      $('.followMe').append(template);
    }
  });
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 35 */
/*!*****************************************!*\
  !*** ./scripts/app/app.footer.links.js ***!
  \*****************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (links, urlRegexp) {
  $('.footer-menu').removeClass('u-hide');

  return $.each(links, function (name, url) {
    if (typeof url === 'string' && urlRegexp.test(url)) {
      var template = "<li><a href=\"" + url + "\" title=\"" + name + "\">" + name + "</a></li>";

      $('.footer-menu').append(template);
    }
  });
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 36 */
/*!*******************************!*\
  !*** ./scripts/app/search.js ***!
  \*******************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Thanks => https://github.com/HauntedThemes/ghost-search
 */

// import fuzzysort from 'fuzzysort';
var fuzzysort = __webpack_require__(/*! fuzzysort */ 37);

var GhostSearch = function GhostSearch(args) {

  this.check = false;

  var defaults = {
    input: '#ghost-search-field',
    results: '#ghost-search-results',
    button: '',
    development: false,
    template: function (result) {
      var url = [location.protocol, '//', location.host].join('');
      return '<a href="' + url + '/' + result.slug + '/">' + result.title + '</a>';
    },
    trigger: 'focus',
    options: {
      keys: [
        'title' ],
      limit: 10,
      threshold: -3500,
      allowTypo: false,
    },
    api: {
      resource: 'posts',
      parameters: {
        limit: 'all',
        fields: ['title', 'slug'],
        filter: '',
        include: '',
        order: '',
        formats: '',
      },
    },
    on: {
      beforeDisplay: function () { },
      afterDisplay: function (results) { },// eslint-disable-line
      beforeFetch: function () { },
      afterFetch: function (results) { },// eslint-disable-line
    },
  }

  var merged = this.mergeDeep(defaults, args);
  Object.assign(this, merged);
  this.init();

};

GhostSearch.prototype.mergeDeep = function mergeDeep (target, source) {
    var this$1 = this;

  if ((target && typeof target === 'object' && !Array.isArray(target) && target !== null) && (source && typeof source === 'object' && !Array.isArray(source) && source !== null)) {
    Object.keys(source).forEach(function (key) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
        if (!target[key]) { Object.assign(target, ( obj = {}, obj[key] = {}, obj ));
            var obj; }
        this$1.mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, ( obj$1 = {}, obj$1[key] = source[key], obj$1 ));
          var obj$1;
      }
    });
  }
  return target;
};

GhostSearch.prototype.url = function url () {

  if (this.api.resource == 'posts' && this.api.parameters.include.match(/(tags|authors)/)) {
    delete this.api.parameters.fields;
  }

  var url = ghost.url.api(this.api.resource, this.api.parameters); //eslint-disable-line

  return url;

};

GhostSearch.prototype.fetch = function fetch$1 () {
    var this$1 = this;


  var url = this.url();

  this.on.beforeFetch();

  fetch(url)
    .then(function (response) { return response.json(); })
    .then(function (resource) { return this$1.search(resource); })
    .catch(function (error) { return console.error("Fetch Error =\n", error); });

};

GhostSearch.prototype.createElementFromHTML = function createElementFromHTML (htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

GhostSearch.prototype.cleanup = function cleanup (input) {
  return input.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
};

GhostSearch.prototype.displayResults = function displayResults (data) {
    var this$1 = this;


  if (document.querySelectorAll(this.results)[0].firstChild !== null && document.querySelectorAll(this.results)[0].firstChild !== '') {
    while (document.querySelectorAll(this.results)[0].firstChild) {
      document.querySelectorAll(this$1.results)[0].removeChild(document.querySelectorAll(this$1.results)[0].firstChild);
    }
  }

  var inputValue = document.querySelectorAll(this.input)[0].value;
  var results = fuzzysort.go(inputValue, data, {
    keys: this.options.keys,
    limit: this.options.limit,
    allowTypo: this.options.allowTypo,
    threshold: this.options.threshold,
  });
  for (var key in results) {
    if (key < results.length) {
      document.querySelectorAll(this$1.results)[0].appendChild(this$1.createElementFromHTML(this$1.template(results[key].obj)));
    }
  }

  this.on.afterDisplay(results)

};

GhostSearch.prototype.search = function search (resource) {
    var this$1 = this;


  var data = resource[this.api.resource];

  this.on.afterFetch(data);
  this.check = true;

  if (this.button != '') {
    var button = document.querySelectorAll(this.button)[0];
    if (button.tagName == 'INPUT' && button.type == 'submit') {
      button.closest('form').addEventListener("submit", function (e) {
        e.preventDefault()
      });
    }
    button.addEventListener('click', function (e) {
      e.preventDefault()
      this$1.on.beforeDisplay()
      this$1.displayResults(data)
    })
  } else {
    document.querySelectorAll(this.input)[0].addEventListener('keyup', function () {
      this$1.on.beforeDisplay()
      this$1.displayResults(data)
    })
  }

};

GhostSearch.prototype.checkGhostAPI = function checkGhostAPI () {
  if (typeof ghost === 'undefined') {
    console.log('Ghost API is not enabled');
    return false;
  }
  return true;
};

GhostSearch.prototype.checkElements = function checkElements () {
  if (!document.querySelectorAll(this.input).length) {
    console.log('Input not found.');
    return false;
  }
  if (!document.querySelectorAll(this.results).length) {
    console.log('Results not found.');
    return false;
  }
  if (this.button != '') {
    if (!document.querySelectorAll(this.button).length) {
      console.log('Button not found.');
      return false;
    }
  }
  return true;
};

GhostSearch.prototype.checkFields = function checkFields () {
    var this$1 = this;


  var validFields = [];

  if (this.api.resource == 'posts') {
    validFields = ['amp', 'authors', 'codeinjection_foot', 'codeinjection_head', 'comment_id', 'created_at', 'created_by', 'custom_excerpt', 'custom_template', 'feature_image', 'featured', 'html', 'id', 'locale', 'meta_description', 'meta_title', 'mobiledoc', 'og_description', 'og_image', 'og_title', 'page', 'plaintext', 'primary_author', 'primary_tag', 'published_at', 'published_by', 'slug', 'status', 'tags', 'title', 'twitter_description', 'twitter_image', 'twitter_title', 'updated_at', 'updated_by', 'url', 'uuid', 'visibility'];
  } else if (this.api.resource == 'tags') {
    validFields = ['count', 'created_at', 'created_by', 'description', 'feature_image', 'id', 'meta_description', 'meta_title', 'name', 'parent', 'slug', 'updated_at', 'updated_by', 'visibility']
  } else if (this.api.resource == 'users') {
    validFields = ['accessibility', 'bio', 'count', 'cover_image', 'facebook', 'id', 'locale', 'location', 'meta_description', 'meta_title', 'name', 'profile_image', 'slug', 'tour', 'twitter', 'visibility', 'website']
  }

  for (var i = 0; i < this.api.parameters.fields.length; i++) {
    if (!validFields.includes(this$1.api.parameters.fields[i])) {
      console.log('\'' + this$1.api.parameters.fields[i] + '\' is not a valid field for ' + this$1.api.resource + '. Valid fields for ' + this$1.api.resource + ': [\'' + validFields.join('\', \'') + '\']');
    }
  }

};

GhostSearch.prototype.checkFormats = function checkFormats () {
    var this$1 = this;

  if (this.api.resource == 'posts' && (this.api.parameters.fields && typeof this.api.parameters.fields === 'object' && this.api.parameters.fields.constructor === Array)) {
    for (var i = 0; i < this.api.parameters.fields.length; i++) {
      if (
        !this$1.api.parameters.formats.includes(this$1.api.parameters.fields[i]) && this$1.api.parameters.fields[i].match(/(plaintext|mobiledoc|amp)/) ||
        (this$1.api.parameters.fields[i] == 'html' && this$1.api.parameters.formats.length > 0 && !this$1.api.parameters.formats.includes('html'))
      ) {
        console.log(this$1.api.parameters.fields[i] + ' is not included in the formats parameter.');
      }
    }
  }
};

GhostSearch.prototype.checkKeys = function checkKeys () {
    var this$1 = this;

  if (!this.options.keys.every(function (elem) { return this$1.api.parameters.fields.indexOf(elem) > -1; })) {
    console.log('Not all keys are in fields. Please add them.');
  }
};

GhostSearch.prototype.validate = function validate () {

  if (!this.checkGhostAPI() || !this.checkElements()) {
    return false;
  }

  if (this.development) {
    this.checkFields();
    this.checkFormats();
    this.checkKeys();
  }

  return true;

};

GhostSearch.prototype.init = function init () {
    var this$1 = this;


  if (!this.validate()) {
    return;
  }

  if (this.trigger == 'focus') {
    document.querySelectorAll(this.input)[0].addEventListener('focus', function () {
      if (!this$1.check) {
        this$1.fetch()
      }
    })
  } else if (this.trigger == 'load') {
    window.onload = function () {
      if (!this$1.check) {
        this$1.fetch()
      }
    }
  }

};

/* Export Class */
module.exports = GhostSearch;


/***/ }),
/* 37 */
/*!**********************************************!*\
  !*** ../node_modules/fuzzysort/fuzzysort.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
WHAT: SublimeText-like Fuzzy Search

USAGE:
  fuzzysort.single('fs', 'Fuzzy Search') // {score: -16}
  fuzzysort.single('test', 'test') // {score: 0}
  fuzzysort.single('doesnt exist', 'target') // null

  fuzzysort.go('mr', ['Monitor.cpp', 'MeshRenderer.cpp'])
  // [{score: -18, target: "MeshRenderer.cpp"}, {score: -6009, target: "Monitor.cpp"}]

  fuzzysort.highlight(fuzzysort.single('fs', 'Fuzzy Search'), '<b>', '</b>')
  // <b>F</b>uzzy <b>S</b>earch
*/

// UMD (Universal Module Definition) for fuzzysort
;(function(root, UMD) {
  if(true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (UMD),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  else if(typeof module === 'object' && module.exports) module.exports = UMD()
  else root.fuzzysort = UMD()
})(this, function UMD() { function fuzzysortNew(instanceOptions) {

  var fuzzysort = {

    single: function(search, target, options) {
      if(!search) return null
      if(!isObj(search)) search = fuzzysort.getPreparedSearch(search)

      if(!target) return null
      if(!isObj(target)) target = fuzzysort.getPrepared(target)

      var allowTypo = options && options.allowTypo!==undefined ? options.allowTypo
        : instanceOptions && instanceOptions.allowTypo!==undefined ? instanceOptions.allowTypo
        : true
      var algorithm = allowTypo ? fuzzysort.algorithm : fuzzysort.algorithmNoTypo
      return algorithm(search, target, search[0])
      // var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -9007199254740991
      // var result = algorithm(search, target, search[0])
      // if(result === null) return null
      // if(result.score < threshold) return null
      // return result
    },

    go: function(search, targets, options) {
      if(!search) return noResults
      search = fuzzysort.prepareSearch(search)
      var searchLowerCode = search[0]

      var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -9007199254740991
      var limit = options && options.limit || instanceOptions && instanceOptions.limit || 9007199254740991
      var allowTypo = options && options.allowTypo!==undefined ? options.allowTypo
        : instanceOptions && instanceOptions.allowTypo!==undefined ? instanceOptions.allowTypo
        : true
      var algorithm = allowTypo ? fuzzysort.algorithm : fuzzysort.algorithmNoTypo
      var resultsLen = 0; var limitedCount = 0
      var targetsLen = targets.length

      // This code is copy/pasted 3 times for performance reasons [options.keys, options.key, no keys]

      // options.keys
      if(options && options.keys) {
        var scoreFn = options.scoreFn || defaultScoreFn
        var keys = options.keys
        var keysLen = keys.length
        for(var i = targetsLen - 1; i >= 0; --i) { var obj = targets[i]
          var objResults = new Array(keysLen)
          for (var keyI = keysLen - 1; keyI >= 0; --keyI) {
            var key = keys[keyI]
            var target = getValue(obj, key)
            if(!target) { objResults[keyI] = null; continue }
            if(!isObj(target)) target = fuzzysort.getPrepared(target)

            objResults[keyI] = algorithm(search, target, searchLowerCode)
          }
          objResults.obj = obj // before scoreFn so scoreFn can use it
          var score = scoreFn(objResults)
          if(score === null) continue
          if(score < threshold) continue
          objResults.score = score
          if(resultsLen < limit) { q.add(objResults); ++resultsLen }
          else {
            ++limitedCount
            if(score > q.peek().score) q.replaceTop(objResults)
          }
        }

      // options.key
      } else if(options && options.key) {
        var key = options.key
        for(var i = targetsLen - 1; i >= 0; --i) { var obj = targets[i]
          var target = getValue(obj, key)
          if(!target) continue
          if(!isObj(target)) target = fuzzysort.getPrepared(target)

          var result = algorithm(search, target, searchLowerCode)
          if(result === null) continue
          if(result.score < threshold) continue

          // have to clone result so duplicate targets from different obj can each reference the correct obj
          result = {target:result.target, _targetLowerCodes:null, _nextBeginningIndexes:null, score:result.score, indexes:result.indexes, obj:obj} // hidden

          if(resultsLen < limit) { q.add(result); ++resultsLen }
          else {
            ++limitedCount
            if(result.score > q.peek().score) q.replaceTop(result)
          }
        }

      // no keys
      } else {
        for(var i = targetsLen - 1; i >= 0; --i) { var target = targets[i]
          if(!target) continue
          if(!isObj(target)) target = fuzzysort.getPrepared(target)

          var result = algorithm(search, target, searchLowerCode)
          if(result === null) continue
          if(result.score < threshold) continue
          if(resultsLen < limit) { q.add(result); ++resultsLen }
          else {
            ++limitedCount
            if(result.score > q.peek().score) q.replaceTop(result)
          }
        }
      }

      if(resultsLen === 0) return noResults
      var results = new Array(resultsLen)
      for(var i = resultsLen - 1; i >= 0; --i) results[i] = q.poll()
      results.total = resultsLen + limitedCount
      return results
    },

    goAsync: function(search, targets, options) {
      var canceled = false
      var p = new Promise(function(resolve, reject) {
        if(!search) return resolve(noResults)
        search = fuzzysort.prepareSearch(search)
        var searchLowerCode = search[0]

        var q = fastpriorityqueue()
        var iCurrent = targets.length - 1
        var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -9007199254740991
        var limit = options && options.limit || instanceOptions && instanceOptions.limit || 9007199254740991
        var allowTypo = options && options.allowTypo!==undefined ? options.allowTypo
          : instanceOptions && instanceOptions.allowTypo!==undefined ? instanceOptions.allowTypo
          : true
        var algorithm = allowTypo ? fuzzysort.algorithm : fuzzysort.algorithmNoTypo
        var resultsLen = 0; var limitedCount = 0
        function step() {
          if(canceled) return reject('canceled')

          var startMs = Date.now()

          // This code is copy/pasted 3 times for performance reasons [options.keys, options.key, no keys]

          // options.keys
          if(options && options.keys) {
            var scoreFn = options.scoreFn || defaultScoreFn
            var keys = options.keys
            var keysLen = keys.length
            for(; iCurrent >= 0; --iCurrent) { var obj = targets[iCurrent]
              var objResults = new Array(keysLen)
              for (var keyI = keysLen - 1; keyI >= 0; --keyI) {
                var key = keys[keyI]
                var target = getValue(obj, key)
                if(!target) { objResults[keyI] = null; continue }
                if(!isObj(target)) target = fuzzysort.getPrepared(target)

                objResults[keyI] = algorithm(search, target, searchLowerCode)
              }
              objResults.obj = obj // before scoreFn so scoreFn can use it
              var score = scoreFn(objResults)
              if(score === null) continue
              if(score < threshold) continue
              objResults.score = score
              if(resultsLen < limit) { q.add(objResults); ++resultsLen }
              else {
                ++limitedCount
                if(score > q.peek().score) q.replaceTop(objResults)
              }

              if(iCurrent%1000/*itemsPerCheck*/ === 0) {
                if(Date.now() - startMs >= 10/*asyncInterval*/) {
                  isNode?setImmediate(step):setTimeout(step)
                  return
                }
              }
            }

          // options.key
          } else if(options && options.key) {
            var key = options.key
            for(; iCurrent >= 0; --iCurrent) { var obj = targets[iCurrent]
              var target = getValue(obj, key)
              if(!target) continue
              if(!isObj(target)) target = fuzzysort.getPrepared(target)

              var result = algorithm(search, target, searchLowerCode)
              if(result === null) continue
              if(result.score < threshold) continue

              // have to clone result so duplicate targets from different obj can each reference the correct obj
              result = {target:result.target, _targetLowerCodes:null, _nextBeginningIndexes:null, score:result.score, indexes:result.indexes, obj:obj} // hidden

              if(resultsLen < limit) { q.add(result); ++resultsLen }
              else {
                ++limitedCount
                if(result.score > q.peek().score) q.replaceTop(result)
              }

              if(iCurrent%1000/*itemsPerCheck*/ === 0) {
                if(Date.now() - startMs >= 10/*asyncInterval*/) {
                  isNode?setImmediate(step):setTimeout(step)
                  return
                }
              }
            }

          // no keys
          } else {
            for(; iCurrent >= 0; --iCurrent) { var target = targets[iCurrent]
              if(!target) continue
              if(!isObj(target)) target = fuzzysort.getPrepared(target)

              var result = algorithm(search, target, searchLowerCode)
              if(result === null) continue
              if(result.score < threshold) continue
              if(resultsLen < limit) { q.add(result); ++resultsLen }
              else {
                ++limitedCount
                if(result.score > q.peek().score) q.replaceTop(result)
              }

              if(iCurrent%1000/*itemsPerCheck*/ === 0) {
                if(Date.now() - startMs >= 10/*asyncInterval*/) {
                  isNode?setImmediate(step):setTimeout(step)
                  return
                }
              }
            }
          }

          if(resultsLen === 0) return resolve(noResults)
          var results = new Array(resultsLen)
          for(var i = resultsLen - 1; i >= 0; --i) results[i] = q.poll()
          results.total = resultsLen + limitedCount
          resolve(results)
        }

        isNode?setImmediate(step):step()
      })
      p.cancel = function() { canceled = true }
      return p
    },

    highlight: function(result, hOpen, hClose) {
      if(result === null) return null
      if(hOpen === undefined) hOpen = '<b>'
      if(hClose === undefined) hClose = '</b>'
      var highlighted = ''
      var matchesIndex = 0
      var opened = false
      var target = result.target
      var targetLen = target.length
      var matchesBest = result.indexes
      for(var i = 0; i < targetLen; ++i) { var char = target[i]
        if(matchesBest[matchesIndex] === i) {
          ++matchesIndex
          if(!opened) { opened = true
            highlighted += hOpen
          }

          if(matchesIndex === matchesBest.length) {
            highlighted += char + hClose + target.substr(i+1)
            break
          }
        } else {
          if(opened) { opened = false
            highlighted += hClose
          }
        }
        highlighted += char
      }

      return highlighted
    },

    prepare: function(target) {
      if(!target) return
      return {target:target, _targetLowerCodes:fuzzysort.prepareLowerCodes(target), _nextBeginningIndexes:null, score:null, indexes:null, obj:null} // hidden
    },
    prepareSlow: function(target) {
      if(!target) return
      return {target:target, _targetLowerCodes:fuzzysort.prepareLowerCodes(target), _nextBeginningIndexes:fuzzysort.prepareNextBeginningIndexes(target), score:null, indexes:null, obj:null} // hidden
    },
    prepareSearch: function(search) {
      if(!search) return
      return fuzzysort.prepareLowerCodes(search)
    },



    // Below this point is only internal code
    // Below this point is only internal code
    // Below this point is only internal code
    // Below this point is only internal code



    getPrepared: function(target) {
      if(target.length > 999) return fuzzysort.prepare(target) // don't cache huge targets
      var targetPrepared = preparedCache.get(target)
      if(targetPrepared !== undefined) return targetPrepared
      targetPrepared = fuzzysort.prepare(target)
      preparedCache.set(target, targetPrepared)
      return targetPrepared
    },
    getPreparedSearch: function(search) {
      if(search.length > 999) return fuzzysort.prepareSearch(search) // don't cache huge searches
      var searchPrepared = preparedSearchCache.get(search)
      if(searchPrepared !== undefined) return searchPrepared
      searchPrepared = fuzzysort.prepareSearch(search)
      preparedSearchCache.set(search, searchPrepared)
      return searchPrepared
    },

    algorithm: function(searchLowerCodes, prepared, searchLowerCode) {
      var targetLowerCodes = prepared._targetLowerCodes
      var searchLen = searchLowerCodes.length
      var targetLen = targetLowerCodes.length
      var searchI = 0 // where we at
      var targetI = 0 // where you at
      var typoSimpleI = 0
      var matchesSimpleLen = 0

      // very basic fuzzy match; to remove non-matching targets ASAP!
      // walk through target. find sequential matches.
      // if all chars aren't found then exit
      for(;;) {
        var isMatch = searchLowerCode === targetLowerCodes[targetI]
        if(isMatch) {
          matchesSimple[matchesSimpleLen++] = targetI
          ++searchI; if(searchI === searchLen) break
          searchLowerCode = searchLowerCodes[typoSimpleI===0?searchI : (typoSimpleI===searchI?searchI+1 : (typoSimpleI===searchI-1?searchI-1 : searchI))]
        }

        ++targetI; if(targetI >= targetLen) { // Failed to find searchI
          // Check for typo or exit
          // we go as far as possible before trying to transpose
          // then we transpose backwards until we reach the beginning
          for(;;) {
            if(searchI <= 1) return null // not allowed to transpose first char
            if(typoSimpleI === 0) { // we haven't tried to transpose yet
              --searchI
              var searchLowerCodeNew = searchLowerCodes[searchI]
              if(searchLowerCode === searchLowerCodeNew) continue // doesn't make sense to transpose a repeat char
              typoSimpleI = searchI
            } else {
              if(typoSimpleI === 1) return null // reached the end of the line for transposing
              --typoSimpleI
              searchI = typoSimpleI
              searchLowerCode = searchLowerCodes[searchI + 1]
              var searchLowerCodeNew = searchLowerCodes[searchI]
              if(searchLowerCode === searchLowerCodeNew) continue // doesn't make sense to transpose a repeat char
            }
            matchesSimpleLen = searchI
            targetI = matchesSimple[matchesSimpleLen - 1] + 1
            break
          }
        }
      }

      var searchI = 0
      var typoStrictI = 0
      var successStrict = false
      var matchesStrictLen = 0

      var nextBeginningIndexes = prepared._nextBeginningIndexes
      if(nextBeginningIndexes === null) nextBeginningIndexes = prepared._nextBeginningIndexes = fuzzysort.prepareNextBeginningIndexes(prepared.target)
      var firstPossibleI = targetI = matchesSimple[0]===0 ? 0 : nextBeginningIndexes[matchesSimple[0]-1]

      // Our target string successfully matched all characters in sequence!
      // Let's try a more advanced and strict test to improve the score
      // only count it as a match if it's consecutive or a beginning character!
      if(targetI !== targetLen) for(;;) {
        if(targetI >= targetLen) {
          // We failed to find a good spot for this search char, go back to the previous search char and force it forward
          if(searchI <= 0) { // We failed to push chars forward for a better match
            // transpose, starting from the beginning
            ++typoStrictI; if(typoStrictI > searchLen-2) break
            if(searchLowerCodes[typoStrictI] === searchLowerCodes[typoStrictI+1]) continue // doesn't make sense to transpose a repeat char
            targetI = firstPossibleI
            continue
          }

          --searchI
          var lastMatch = matchesStrict[--matchesStrictLen]
          targetI = nextBeginningIndexes[lastMatch]

        } else {
          var isMatch = searchLowerCodes[typoStrictI===0?searchI : (typoStrictI===searchI?searchI+1 : (typoStrictI===searchI-1?searchI-1 : searchI))] === targetLowerCodes[targetI]
          if(isMatch) {
            matchesStrict[matchesStrictLen++] = targetI
            ++searchI; if(searchI === searchLen) { successStrict = true; break }
            ++targetI
          } else {
            targetI = nextBeginningIndexes[targetI]
          }
        }
      }

      { // tally up the score & keep track of matches for highlighting later
        if(successStrict) { var matchesBest = matchesStrict; var matchesBestLen = matchesStrictLen }
        else { var matchesBest = matchesSimple; var matchesBestLen = matchesSimpleLen }
        var score = 0
        var lastTargetI = -1
        for(var i = 0; i < searchLen; ++i) { var targetI = matchesBest[i]
          // score only goes down if they're not consecutive
          if(lastTargetI !== targetI - 1) score -= targetI
          lastTargetI = targetI
        }
        if(!successStrict) {
          score *= 1000
          if(typoSimpleI !== 0) score += -20/*typoPenalty*/
        } else {
          if(typoStrictI !== 0) score += -20/*typoPenalty*/
        }
        score -= targetLen - searchLen
        prepared.score = score
        prepared.indexes = new Array(matchesBestLen); for(var i = matchesBestLen - 1; i >= 0; --i) prepared.indexes[i] = matchesBest[i]

        return prepared
      }
    },

    algorithmNoTypo: function(searchLowerCodes, prepared, searchLowerCode) {
      var targetLowerCodes = prepared._targetLowerCodes
      var searchLen = searchLowerCodes.length
      var targetLen = targetLowerCodes.length
      var searchI = 0 // where we at
      var targetI = 0 // where you at
      var matchesSimpleLen = 0

      // very basic fuzzy match; to remove non-matching targets ASAP!
      // walk through target. find sequential matches.
      // if all chars aren't found then exit
      for(;;) {
        var isMatch = searchLowerCode === targetLowerCodes[targetI]
        if(isMatch) {
          matchesSimple[matchesSimpleLen++] = targetI
          ++searchI; if(searchI === searchLen) break
          searchLowerCode = searchLowerCodes[searchI]
        }
        ++targetI; if(targetI >= targetLen) return null // Failed to find searchI
      }

      var searchI = 0
      var successStrict = false
      var matchesStrictLen = 0

      var nextBeginningIndexes = prepared._nextBeginningIndexes
      if(nextBeginningIndexes === null) nextBeginningIndexes = prepared._nextBeginningIndexes = fuzzysort.prepareNextBeginningIndexes(prepared.target)
      var firstPossibleI = targetI = matchesSimple[0]===0 ? 0 : nextBeginningIndexes[matchesSimple[0]-1]

      // Our target string successfully matched all characters in sequence!
      // Let's try a more advanced and strict test to improve the score
      // only count it as a match if it's consecutive or a beginning character!
      if(targetI !== targetLen) for(;;) {
        if(targetI >= targetLen) {
          // We failed to find a good spot for this search char, go back to the previous search char and force it forward
          if(searchI <= 0) break // We failed to push chars forward for a better match

          --searchI
          var lastMatch = matchesStrict[--matchesStrictLen]
          targetI = nextBeginningIndexes[lastMatch]

        } else {
          var isMatch = searchLowerCodes[searchI] === targetLowerCodes[targetI]
          if(isMatch) {
            matchesStrict[matchesStrictLen++] = targetI
            ++searchI; if(searchI === searchLen) { successStrict = true; break }
            ++targetI
          } else {
            targetI = nextBeginningIndexes[targetI]
          }
        }
      }

      { // tally up the score & keep track of matches for highlighting later
        if(successStrict) { var matchesBest = matchesStrict; var matchesBestLen = matchesStrictLen }
        else { var matchesBest = matchesSimple; var matchesBestLen = matchesSimpleLen }
        var score = 0
        var lastTargetI = -1
        for(var i = 0; i < searchLen; ++i) { var targetI = matchesBest[i]
          // score only goes down if they're not consecutive
          if(lastTargetI !== targetI - 1) score -= targetI
          lastTargetI = targetI
        }
        if(!successStrict) score *= 1000
        score -= targetLen - searchLen
        prepared.score = score
        prepared.indexes = new Array(matchesBestLen); for(var i = matchesBestLen - 1; i >= 0; --i) prepared.indexes[i] = matchesBest[i]

        return prepared
      }
    },

    prepareLowerCodes: function(str) {
      var strLen = str.length
      var lowerCodes = [] // new Array(strLen)    sparse array is too slow
      var lower = str.toLowerCase()
      for(var i = 0; i < strLen; ++i) lowerCodes[i] = lower.charCodeAt(i)
      return lowerCodes
    },
    prepareBeginningIndexes: function(target) {
      var targetLen = target.length
      var beginningIndexes = []; var beginningIndexesLen = 0
      var wasUpper = false
      var wasAlphanum = false
      for(var i = 0; i < targetLen; ++i) {
        var targetCode = target.charCodeAt(i)
        var isUpper = targetCode>=65&&targetCode<=90
        var isAlphanum = isUpper || targetCode>=97&&targetCode<=122 || targetCode>=48&&targetCode<=57
        var isBeginning = isUpper && !wasUpper || !wasAlphanum || !isAlphanum
        wasUpper = isUpper
        wasAlphanum = isAlphanum
        if(isBeginning) beginningIndexes[beginningIndexesLen++] = i
      }
      return beginningIndexes
    },
    prepareNextBeginningIndexes: function(target) {
      var targetLen = target.length
      var beginningIndexes = fuzzysort.prepareBeginningIndexes(target)
      var nextBeginningIndexes = [] // new Array(targetLen)     sparse array is too slow
      var lastIsBeginning = beginningIndexes[0]
      var lastIsBeginningI = 0
      for(var i = 0; i < targetLen; ++i) {
        if(lastIsBeginning > i) {
          nextBeginningIndexes[i] = lastIsBeginning
        } else {
          lastIsBeginning = beginningIndexes[++lastIsBeginningI]
          nextBeginningIndexes[i] = lastIsBeginning===undefined ? targetLen : lastIsBeginning
        }
      }
      return nextBeginningIndexes
    },

    cleanup: cleanup,
    new: fuzzysortNew,
  }
  return fuzzysort
} // fuzzysortNew

// This stuff is outside fuzzysortNew, because it's shared with instances of fuzzysort.new()
var isNode = "function" !== 'undefined' && typeof window === 'undefined'
// var MAX_INT = Number.MAX_SAFE_INTEGER
// var MIN_INT = Number.MIN_VALUE
var preparedCache = new Map()
var preparedSearchCache = new Map()
var noResults = []; noResults.total = 0
var matchesSimple = []; var matchesStrict = []
function cleanup() { preparedCache.clear(); preparedSearchCache.clear(); matchesSimple = []; matchesStrict = [] }
function defaultScoreFn(a) {
  var max = -9007199254740991
  for (var i = a.length - 1; i >= 0; --i) {
    var result = a[i]; if(result === null) continue
    var score = result.score
    if(score > max) max = score
  }
  if(max === -9007199254740991) return null
  return max
}

// prop = 'key'              2.5ms optimized for this case, seems to be about as fast as direct obj[prop]
// prop = 'key1.key2'        10ms
// prop = ['key1', 'key2']   27ms
function getValue(obj, prop) {
  var tmp = obj[prop]; if(tmp !== undefined) return tmp
  var segs = prop
  if(!Array.isArray(prop)) segs = prop.split('.')
  var len = segs.length
  var i = -1
  while (obj && (++i < len)) obj = obj[segs[i]]
  return obj
}

function isObj(x) { return typeof x === 'object' } // faster as a function

// Hacked version of https://github.com/lemire/FastPriorityQueue.js
var fastpriorityqueue=function(){var r=[],o=0,e={};function n(){for(var e=0,n=r[e],c=1;c<o;){var f=c+1;e=c,f<o&&r[f].score<r[c].score&&(e=f),r[e-1>>1]=r[e],c=1+(e<<1)}for(var a=e-1>>1;e>0&&n.score<r[a].score;a=(e=a)-1>>1)r[e]=r[a];r[e]=n}return e.add=function(e){var n=o;r[o++]=e;for(var c=n-1>>1;n>0&&e.score<r[c].score;c=(n=c)-1>>1)r[n]=r[c];r[n]=e},e.poll=function(){if(0!==o){var e=r[0];return r[0]=r[--o],n(),e}},e.peek=function(e){if(0!==o)return r[0]},e.replaceTop=function(o){r[0]=o,n()},e};
var q = fastpriorityqueue() // reuse this, except for async, it needs to make its own

return fuzzysortNew()
}) // UMD

// TODO: (performance) wasm version!?

// TODO: (performance) layout memory in an optimal way to go fast by avoiding cache misses

// TODO: (performance) preparedCache is a memory leak

// TODO: (like sublime) backslash === forwardslash

// TODO: (performance) i have no idea how well optizmied the allowing typos algorithm is

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../timers-browserify/main.js */ 38).setImmediate))

/***/ }),
/* 38 */
/*!*************************************************!*\
  !*** ../node_modules/timers-browserify/main.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ 39);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 16)))

/***/ }),
/* 39 */
/*!****************************************************!*\
  !*** ../node_modules/setimmediate/setImmediate.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 16), __webpack_require__(/*! ./../process/browser.js */ 40)))

/***/ }),
/* 40 */
/*!******************************************!*\
  !*** ../node_modules/process/browser.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 41 */
/*!****************************************************************!*\
  !*** ../node_modules/vanilla-lazyload/dist/lazyload.es2015.js ***!
  \****************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var getDefaultSettings = () => ({
	elements_selector: "img",
	container: window,
	threshold: 300,
	throttle: 150,
	data_src: "src",
	data_srcset: "srcset",
	data_sizes: "sizes",
	data_bg: "bg",
	class_loading: "loading",
	class_loaded: "loaded",
	class_error: "error",
	class_initial: "initial",
	skip_invisible: true,
	callback_load: null,
	callback_error: null,
	callback_set: null,
	callback_enter: null,
	callback_finish: null,
	to_webp: false
});

const dataPrefix = "data-";
const processedDataName = "was-processed";
const processedDataValue = "true";

const getData = (element, attribute) => {
	return element.getAttribute(dataPrefix + attribute);
};

const setData = (element, attribute, value) => {
	var attrName = dataPrefix + attribute;
	if (value === null) {
		element.removeAttribute(attrName);
		return;
	}
	element.setAttribute(attrName, value);
};

const setWasProcessedData = element =>
	setData(element, processedDataName, processedDataValue);

const getWasProcessedData = element =>
	getData(element, processedDataName) === processedDataValue;

const purgeProcessedElements = elements => {
	return elements.filter(element => !getWasProcessedData(element));
};

const purgeOneElement = (elements, elementToPurge) => {
	return elements.filter(element => element !== elementToPurge);
};

const getTopOffset = function(element) {
	return (
		element.getBoundingClientRect().top +
		window.pageYOffset -
		element.ownerDocument.documentElement.clientTop
	);
};

const isBelowViewport = function(element, container, threshold) {
	const fold =
		container === window
			? window.innerHeight + window.pageYOffset
			: getTopOffset(container) + container.offsetHeight;
	return fold <= getTopOffset(element) - threshold;
};

const getLeftOffset = function(element) {
	return (
		element.getBoundingClientRect().left +
		window.pageXOffset -
		element.ownerDocument.documentElement.clientLeft
	);
};

const isAtRightOfViewport = function(element, container, threshold) {
	const documentWidth = window.innerWidth;
	const fold =
		container === window
			? documentWidth + window.pageXOffset
			: getLeftOffset(container) + documentWidth;
	return fold <= getLeftOffset(element) - threshold;
};

const isAboveViewport = function(element, container, threshold) {
	const fold =
		container === window ? window.pageYOffset : getTopOffset(container);
	return fold >= getTopOffset(element) + threshold + element.offsetHeight;
};

const isAtLeftOfViewport = function(element, container, threshold) {
	const fold =
		container === window ? window.pageXOffset : getLeftOffset(container);
	return fold >= getLeftOffset(element) + threshold + element.offsetWidth;
};

function isInsideViewport(element, container, threshold) {
	return (
		!isBelowViewport(element, container, threshold) &&
		!isAboveViewport(element, container, threshold) &&
		!isAtRightOfViewport(element, container, threshold) &&
		!isAtLeftOfViewport(element, container, threshold)
	);
}

/* Creates instance and notifies it through the window element */
const createInstance = function(classObj, options) {
	var event;
	let eventString = "LazyLoad::Initialized";
	let instance = new classObj(options);
	try {
		// Works in modern browsers
		event = new CustomEvent(eventString, { detail: { instance } });
	} catch (err) {
		// Works in Internet Explorer (all versions)
		event = document.createEvent("CustomEvent");
		event.initCustomEvent(eventString, false, false, { instance });
	}
	window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of lazyload, depending on the 
    options passed in (plain object or an array) */
function autoInitialize(classObj, options) {
	if (!options) {
		return;
	}
	if (!options.length) {
		// Plain object
		createInstance(classObj, options);
	} else {
		// Array of objects
		for (let i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
			createInstance(classObj, optionsItem);
		}
	}
}

const replaceExtToWebp = (value, condition) =>
	condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;

const detectWebp = () => {
	var webpString = "image/webp";
	var canvas = document.createElement("canvas");

	if (canvas.getContext && canvas.getContext("2d")) {
		return canvas.toDataURL(webpString).indexOf(`data:${webpString}`) === 0;
	}

	return false;
};

const runningOnBrowser = typeof window !== "undefined";

const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

const supportsWebp = runningOnBrowser && detectWebp();

const addClass = (element, className) => {
	if (supportsClassList) {
		element.classList.add(className);
		return;
	}
	element.className += (element.className ? " " : "") + className;
};

const removeClass = (element, className) => {
	if (supportsClassList) {
		element.classList.remove(className);
		return;
	}
	element.className = element.className.
		replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").
		replace(/^\s+/, "").
		replace(/\s+$/, "");
};

const setSourcesInChildren = function(
	parentTag,
	attrName,
	dataAttrName,
	toWebpFlag
) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attrValue = getData(childTag, dataAttrName);
			setAttributeIfValue(childTag, attrName, attrValue, toWebpFlag);
		}
	}
};

const setAttributeIfValue = function(
	element,
	attrName,
	value,
	toWebpFlag
) {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, replaceExtToWebp(value, toWebpFlag));
};

const setSourcesImg = (element, settings) => {
	const toWebpFlag = supportsWebp && settings.to_webp;
	const srcsetDataName = settings.data_srcset;
	const parent = element.parentNode;

	if (parent && parent.tagName === "PICTURE") {
		setSourcesInChildren(parent, "srcset", srcsetDataName, toWebpFlag);
	}
	const sizesDataValue = getData(element, settings.data_sizes);
	setAttributeIfValue(element, "sizes", sizesDataValue);
	const srcsetDataValue = getData(element, srcsetDataName);
	setAttributeIfValue(element, "srcset", srcsetDataValue, toWebpFlag);
	const srcDataValue = getData(element, settings.data_src);
	setAttributeIfValue(element, "src", srcDataValue, toWebpFlag);
};

const setSourcesIframe = (element, settings) => {
	const srcDataValue = getData(element, settings.data_src);

	setAttributeIfValue(element, "src", srcDataValue);
};

const setSourcesVideo = (element, settings) => {
	const srcDataName = settings.data_src;
	const srcDataValue = getData(element, srcDataName);

	setSourcesInChildren(element, "src", srcDataName);
	setAttributeIfValue(element, "src", srcDataValue);
	element.load();
};

const setSourcesBgImage = (element, settings) => {
	const toWebpFlag = supportsWebp && settings.to_webp;
	const srcDataValue = getData(element, settings.data_src);
	const bgDataValue = getData(element, settings.data_bg);

	if (srcDataValue) {
		let setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
		element.style.backgroundImage = `url("${setValue}")`;
	}

	if (bgDataValue) {
		let setValue = replaceExtToWebp(bgDataValue, toWebpFlag);
		element.style.backgroundImage = setValue;
	}
};

const setSourcesFunctions = {
	IMG: setSourcesImg,
	IFRAME: setSourcesIframe,
	VIDEO: setSourcesVideo
};

const setSources = (element, instance) => {
	const settings = instance._settings;
	const tagName = element.tagName;
	const setSourcesFunction = setSourcesFunctions[tagName];
	if (setSourcesFunction) {
		setSourcesFunction(element, settings);
		instance._updateLoadingCount(1);
		instance._elements = purgeOneElement(instance._elements, element);
		return;
	}
	setSourcesBgImage(element, settings);
};

const callbackIfSet = function(callback, argument) {
	if (callback) {
		callback(argument);
	}
};

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const addEventListener = (element, eventName, handler) => {
	element.addEventListener(eventName, handler);
};

const removeEventListener = (element, eventName, handler) => {
	element.removeEventListener(eventName, handler);
};

const addAllEventListeners = (element, loadHandler, errorHandler) => {
	addEventListener(element, genericLoadEventName, loadHandler);
	addEventListener(element, mediaLoadEventName, loadHandler);
	addEventListener(element, errorEventName, errorHandler);
};

const removeAllEventListeners = (element, loadHandler, errorHandler) => {
	removeEventListener(element, genericLoadEventName, loadHandler);
	removeEventListener(element, mediaLoadEventName, loadHandler);
	removeEventListener(element, errorEventName, errorHandler);
};

const eventHandler = function(event, success, instance) {
	var settings = instance._settings;
	const className = success ? settings.class_loaded : settings.class_error;
	const callback = success ? settings.callback_load : settings.callback_error;
	const element = event.target;

	removeClass(element, settings.class_loading);
	addClass(element, className);
	callbackIfSet(callback, element);

	instance._updateLoadingCount(-1);
};

const addOneShotEventListeners = (element, instance) => {
	const loadHandler = event => {
		eventHandler(event, true, instance);
		removeAllEventListeners(element, loadHandler, errorHandler);
	};
	const errorHandler = event => {
		eventHandler(event, false, instance);
		removeAllEventListeners(element, loadHandler, errorHandler);
	};
	addAllEventListeners(element, loadHandler, errorHandler);
};

const managedTags = ["IMG", "IFRAME", "VIDEO"];

function revealElement(element, instance, force) {
	var settings = instance._settings;
	if (!force && getWasProcessedData(element)) {
		return; // element has already been processed and force wasn't true
	}
	callbackIfSet(settings.callback_enter, element);
	if (managedTags.indexOf(element.tagName) > -1) {
		addOneShotEventListeners(element, instance);
		addClass(element, settings.class_loading);
	}
	setSources(element, instance);
	setWasProcessedData(element);
	callbackIfSet(settings.callback_set, element);
}

const removeFromArray = (elements, indexes) => {
	while (indexes.length) {
		elements.splice(indexes.pop(), 1);
	}
};

/*
 * Constructor
 */

const LazyLoad = function(instanceSettings) {
	this._settings = Object.assign({}, getDefaultSettings(), instanceSettings);
	this._loadingCount = 0;
	this._queryOriginNode =
		this._settings.container === window
			? document
			: this._settings.container;

	this._previousLoopTime = 0;
	this._loopTimeout = null;
	this._boundHandleScroll = this.handleScroll.bind(this);

	this._isFirstLoop = true;
	window.addEventListener("resize", this._boundHandleScroll);
	this.update();
};

LazyLoad.prototype = {
	_loopThroughElements: function(forceDownload) {
		const settings = this._settings,
			elements = this._elements,
			elementsLength = !elements ? 0 : elements.length;
		let i,
			processedIndexes = [],
			isFirstLoop = this._isFirstLoop;

		if (isFirstLoop) {
			this._isFirstLoop = false;
		}

		if (elementsLength === 0) {
			this._stopScrollHandler();
			return;
		}

		for (i = 0; i < elementsLength; i++) {
			let element = elements[i];
			/* If must skip_invisible and element is invisible, skip it */
			if (settings.skip_invisible && element.offsetParent === null) {
				continue;
			}

			if (
				forceDownload ||
				isInsideViewport(
					element,
					settings.container,
					settings.threshold
				)
			) {
				if (isFirstLoop) {
					addClass(element, settings.class_initial);
				}
				this.load(element);
				processedIndexes.push(i);
			}
		}

		// Removing processed elements from this._elements.
		removeFromArray(elements, processedIndexes);
	},

	_startScrollHandler: function() {
		if (!this._isHandlingScroll) {
			this._isHandlingScroll = true;
			this._settings.container.addEventListener(
				"scroll",
				this._boundHandleScroll
			);
		}
	},

	_stopScrollHandler: function() {
		if (this._isHandlingScroll) {
			this._isHandlingScroll = false;
			this._settings.container.removeEventListener(
				"scroll",
				this._boundHandleScroll
			);
		}
	},

	_updateLoadingCount: function(plusMinus) {
		this._loadingCount += plusMinus;
		if (this._elements.length === 0 && this._loadingCount === 0) {
			callbackIfSet(this._settings.callback_finish);
		}
	},

	handleScroll: function() {
		const throttle = this._settings.throttle;

		if (throttle !== 0) {
			let now = Date.now();
			let remainingTime = throttle - (now - this._previousLoopTime);
			if (remainingTime <= 0 || remainingTime > throttle) {
				if (this._loopTimeout) {
					clearTimeout(this._loopTimeout);
					this._loopTimeout = null;
				}
				this._previousLoopTime = now;
				this._loopThroughElements();
			} else if (!this._loopTimeout) {
				this._loopTimeout = setTimeout(
					function() {
						this._previousLoopTime = Date.now();
						this._loopTimeout = null;
						this._loopThroughElements();
					}.bind(this),
					remainingTime
				);
			}
		} else {
			this._loopThroughElements();
		}
	},

	loadAll: function() {
		this._loopThroughElements(true);
	},

	update: function(elements) {
		const settings = this._settings;
		const nodeSet =
			elements ||
			this._queryOriginNode.querySelectorAll(settings.elements_selector);

		this._elements = purgeProcessedElements(
			Array.prototype.slice.call(nodeSet) // NOTE: nodeset to array for IE compatibility
		);

		if (isBot) {
			this.loadAll();
			return;
		}

		this._loopThroughElements();
		this._startScrollHandler();
	},

	destroy: function() {
		window.removeEventListener("resize", this._boundHandleScroll);
		if (this._loopTimeout) {
			clearTimeout(this._loopTimeout);
			this._loopTimeout = null;
		}
		this._stopScrollHandler();
		this._elements = null;
		this._queryOriginNode = null;
		this._settings = null;
	},

	load: function(element, force) {
		revealElement(element, this, force);
	}
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
	autoInitialize(LazyLoad, window.lazyLoadOptions);
}

/* harmony default export */ __webpack_exports__["a"] = (LazyLoad);


/***/ }),
/* 42 */
/*!************************************!*\
  !*** ./scripts/app/app.twitter.js ***!
  \************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (name, number) {
  $('.widget-twitter').removeClass('u-hide');
  var twitterBlock = "<a class=\"twitter-timeline\"  href=\"https://twitter.com/" + name + "\" data-chrome=\"nofooter noborders noheader\" data-tweet-limit=\"" + number + "\">Tweets by " + name + "</a><script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>"; // eslint-disable-line
  $('.widget-twitter').append(twitterBlock);
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 43 */
/*!********************************!*\
  !*** ./scripts/routes/post.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs__ = __webpack_require__(/*! prismjs */ 44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prismjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__ = __webpack_require__(/*! prismjs/plugins/autoloader/prism-autoloader */ 45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__ = __webpack_require__(/*! prismjs/plugins/line-numbers/prism-line-numbers */ 46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_instagram__ = __webpack_require__(/*! ../app/app.instagram */ 47);
/* global instagramFeed */

// import facebookShareCount from '../app/app.facebook-share-count';






/* Iframe SRC video */
var iframeVideo = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="vid.me"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]' ];

/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    var $allMedia = $('.post-body').find(iframeVideo.join(','));

    // Video responsive
    // allMedia.map((key, value) => $(value).wrap('<aside class="video-responsive"></aside>'));
    $allMedia.each(function () {
      $(this).wrap('<aside class="video-responsive"></aside>').parent('.video-responsive');
    });
  },
  finalize: function finalize() {
    // Add data action zoom FOR IMG
    $('.post-inner img').not('.kg-width-full img').attr('data-action', 'zoom');
    $('.post-inner').find('a').find('img').removeAttr("data-action")

    // sticky share post in left
    $('.sharePost').theiaStickySidebar({
      additionalMarginTop: 120,
      minWidth: 970,
    });

    // Instagram Feed
    if (typeof instagramFeed === 'object' && instagramFeed !== null) {
      var url = "https://api.instagram.com/v1/users/" + (instagramFeed.userId) + "/media/recent/?access_token=" + (instagramFeed.token) + "&count=10&callback=?";
      var user = "<a href=\"https://www.instagram.com/" + (instagramFeed.userName) + "\" class=\"button button--large button--chromeless\" target=\"_blank\"><i class=\"i-instagram\"></i> " + (instagramFeed.userName) + "</a>";

      Object(__WEBPACK_IMPORTED_MODULE_3__app_app_instagram__["a" /* default */])(url, user);
    }

    // Gallery
    var images = document.querySelectorAll('.kg-gallery-image img');

    images.forEach(function (image) {
        var container = image.closest('.kg-gallery-image');
        var width = image.attributes.width.value;
        var height = image.attributes.height.value;
        var ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    })

    /* Prism autoloader */
    __WEBPACK_IMPORTED_MODULE_0_prismjs___default.a.highlightAll();

    // Prism.plugins.autoloader.languages_path = `${$('body').attr('data-page')}/assets/scripts/components/`; // eslint-disable-line
  }, // end finalize
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 44 */
/*!****************************************!*\
  !*** ../node_modules/prismjs/prism.js ***!
  \****************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-([\w-]+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o, visited) {
			var type = _.util.type(o);
			visited = visited || {};

			switch (type) {
				case 'Object':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = {};
					visited[_.util.objId(o)] = clone;

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key], visited);
						}
					}

					return clone;

				case 'Array':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = [];
					visited[_.util.objId(o)] = clone;

					o.forEach(function (v, i) {
						clone[i] = _.util.clone(v, visited);
					});

					return clone;
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		_.highlightAllUnder(document, async, callback);
	},

	highlightAllUnder: function(container, async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || container.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		if (element.parentNode) {
			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				_.hooks.run('before-highlight', env);
				env.element.textContent = env.code;
				_.hooks.run('after-highlight', env);
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var env = {
			code: text,
			grammar: grammar,
			language: language
		};
		_.hooks.run('before-tokenize', env);
		env.tokens = _.tokenize(env.code, env.grammar);
		_.hooks.run('after-tokenize', env);
		return Token.stringify(_.util.encode(env.tokens), env.language);
	},

	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
		var Token = _.Token;

		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			if (token == target) {
				return;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					if (greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						var match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						if (strarr[i] instanceof Token) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					} else {
						pattern.lastIndex = 0;

						var match = pattern.exec(str),
							delNum = 1;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1] ? match[1].length : 0;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

					if (oneshot)
						break;
				}
			}
		}
	},

	tokenize: function(text, grammar, language) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}

	if (!_.disableWorkerMessageHandler) {
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
				lang = message.language,
				code = message.code,
				immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	}

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (!_.manual && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\s\S]*?-->/,
	'prolog': /<\?[\s\S]+?\?>/,
	'doctype': /<!DOCTYPE[\s\S]+?>/i,
	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		greedy: true,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
				inside: {
					'punctuation': [
						/^=/,
						{
							pattern: /(^|[^\\])["']/,
							lookbehind: true
						}
					]
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
	Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\s\S]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^{}\s][^{};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css',
			greedy: true
		}
	});

	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true
		}
	],
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /[.\\]/
		}
	},
	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
		alias: 'function'
	},
	'constant': /\b[A-Z][A-Z\d_]*\b/
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\${[^}]+}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\${|}$/,
						alias: 'punctuation'
					},
					rest: null // See below
				}
			},
			'string': /[\s\S]+/
		}
	}
});
Prism.languages.javascript['template-string'].inside['interpolation'].inside.rest = Prism.languages.javascript;

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript',
			greedy: true
		}
	});
}

Prism.languages.js = Prism.languages.javascript;


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
			var src = pre.getAttribute('data-src');

			var language, parent = pre;
			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (pre.className.match(lang) || [, ''])[1];
			}

			if (!language) {
				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
				language = Extensions[extension] || extension;
			}

			var code = document.createElement('code');
			code.className = 'language-' + language;

			pre.textContent = '';

			code.textContent = 'Loading…';

			pre.appendChild(code);

			var xhr = new XMLHttpRequest();

			xhr.open('GET', src, true);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {

					if (xhr.status < 400 && xhr.responseText) {
						code.textContent = xhr.responseText;

						Prism.highlightElement(code);
					}
					else if (xhr.status >= 400) {
						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
					}
					else {
						code.textContent = '✖ Error: File does not exist or is empty';
					}
				}
			};

			xhr.send(null);
		});

		if (Prism.plugins.toolbar) {
			Prism.plugins.toolbar.registerButton('download-file', function (env) {
				var pre = env.element.parentNode;
				if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
					return;
				}
				var src = pre.getAttribute('data-src');
				var a = document.createElement('a');
				a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
				a.setAttribute('download', '');
				a.href = src;
				return a;
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 16)))

/***/ }),
/* 45 */
/*!**********************************************************************!*\
  !*** ../node_modules/prismjs/plugins/autoloader/prism-autoloader.js ***!
  \**********************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports) {

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.createElement) {
		return;
	}

	// The dependencies map is built automatically with gulp
	var lang_dependencies = /*languages_placeholder[*/{"javascript":"clike","actionscript":"javascript","arduino":"cpp","aspnet":["markup","csharp"],"bison":"c","c":"clike","csharp":"clike","cpp":"c","coffeescript":"javascript","crystal":"ruby","css-extras":"css","d":"clike","dart":"clike","django":"markup","erb":["ruby","markup-templating"],"fsharp":"clike","flow":"javascript","glsl":"clike","go":"clike","groovy":"clike","haml":"ruby","handlebars":"markup-templating","haxe":"clike","java":"clike","jolie":"clike","kotlin":"clike","less":"css","markdown":"markup","markup-templating":"markup","n4js":"javascript","nginx":"clike","objectivec":"c","opencl":"cpp","parser":"markup","php":["clike","markup-templating"],"php-extras":"php","plsql":"sql","processing":"clike","protobuf":"clike","pug":"javascript","qore":"clike","jsx":["markup","javascript"],"tsx":["jsx","typescript"],"reason":"clike","ruby":"clike","sass":"css","scss":"css","scala":"java","smarty":"markup-templating","soy":"markup-templating","swift":"clike","tap":"yaml","textile":"markup","tt2":["clike","markup-templating"],"twig":"markup","typescript":"javascript","vbnet":"basic","velocity":"markup","wiki":"markup","xeora":"markup","xquery":"markup"}/*]*/;

	var lang_data = {};

	var ignored_language = 'none';

	var script = document.getElementsByTagName('script');
	script = script[script.length - 1];
	var languages_path = 'components/';
	if(script.hasAttribute('data-autoloader-path')) {
		var path = script.getAttribute('data-autoloader-path').trim();
		if(path.length > 0 && !/^[a-z]+:\/\//i.test(script.src)) {
			languages_path = path.replace(/\/?$/, '/');
		}
	} else if (/[\w-]+\.js$/.test(script.src)) {
		languages_path = script.src.replace(/[\w-]+\.js$/, 'components/');
	}
	var config = Prism.plugins.autoloader = {
		languages_path: languages_path,
		use_minified: true
	};

	/**
	 * Lazy loads an external script
	 * @param {string} src
	 * @param {function=} success
	 * @param {function=} error
	 */
	var script = function (src, success, error) {
		var s = document.createElement('script');
		s.src = src;
		s.async = true;
		s.onload = function() {
			document.body.removeChild(s);
			success && success();
		};
		s.onerror = function() {
			document.body.removeChild(s);
			error && error();
		};
		document.body.appendChild(s);
	};

	/**
	 * Returns the path to a grammar, using the language_path and use_minified config keys.
	 * @param {string} lang
	 * @returns {string}
	 */
	var getLanguagePath = function (lang) {
		return config.languages_path +
			'prism-' + lang
			+ (config.use_minified ? '.min' : '') + '.js'
	};

	/**
	 * Tries to load a grammar and
	 * highlight again the given element once loaded.
	 * @param {string} lang
	 * @param {HTMLElement} elt
	 */
	var registerElement = function (lang, elt) {
		var data = lang_data[lang];
		if (!data) {
			data = lang_data[lang] = {};
		}

		// Look for additional dependencies defined on the <code> or <pre> tags
		var deps = elt.getAttribute('data-dependencies');
		if (!deps && elt.parentNode && elt.parentNode.tagName.toLowerCase() === 'pre') {
			deps = elt.parentNode.getAttribute('data-dependencies');
		}

		if (deps) {
			deps = deps.split(/\s*,\s*/g);
		} else {
			deps = [];
		}

		loadLanguages(deps, function () {
			loadLanguage(lang, function () {
				Prism.highlightElement(elt);
			});
		});
	};

	/**
	 * Sequentially loads an array of grammars.
	 * @param {string[]|string} langs
	 * @param {function=} success
	 * @param {function=} error
	 */
	var loadLanguages = function (langs, success, error) {
		if (typeof langs === 'string') {
			langs = [langs];
		}
		var i = 0;
		var l = langs.length;
		var f = function () {
			if (i < l) {
				loadLanguage(langs[i], function () {
					i++;
					f();
				}, function () {
					error && error(langs[i]);
				});
			} else if (i === l) {
				success && success(langs);
			}
		};
		f();
	};

	/**
	 * Load a grammar with its dependencies
	 * @param {string} lang
	 * @param {function=} success
	 * @param {function=} error
	 */
	var loadLanguage = function (lang, success, error) {
		var load = function () {
			var force = false;
			// Do we want to force reload the grammar?
			if (lang.indexOf('!') >= 0) {
				force = true;
				lang = lang.replace('!', '');
			}

			var data = lang_data[lang];
			if (!data) {
				data = lang_data[lang] = {};
			}
			if (success) {
				if (!data.success_callbacks) {
					data.success_callbacks = [];
				}
				data.success_callbacks.push(success);
			}
			if (error) {
				if (!data.error_callbacks) {
					data.error_callbacks = [];
				}
				data.error_callbacks.push(error);
			}

			if (!force && Prism.languages[lang]) {
				languageSuccess(lang);
			} else if (!force && data.error) {
				languageError(lang);
			} else if (force || !data.loading) {
				data.loading = true;
				var src = getLanguagePath(lang);
				script(src, function () {
					data.loading = false;
					languageSuccess(lang);

				}, function () {
					data.loading = false;
					data.error = true;
					languageError(lang);
				});
			}
		};
		var dependencies = lang_dependencies[lang];
		if(dependencies && dependencies.length) {
			loadLanguages(dependencies, load);
		} else {
			load();
		}
	};

	/**
	 * Runs all success callbacks for this language.
	 * @param {string} lang
	 */
	var languageSuccess = function (lang) {
		if (lang_data[lang] && lang_data[lang].success_callbacks && lang_data[lang].success_callbacks.length) {
			lang_data[lang].success_callbacks.forEach(function (f) {
				f(lang);
			});
		}
	};

	/**
	 * Runs all error callbacks for this language.
	 * @param {string} lang
	 */
	var languageError = function (lang) {
		if (lang_data[lang] && lang_data[lang].error_callbacks && lang_data[lang].error_callbacks.length) {
			lang_data[lang].error_callbacks.forEach(function (f) {
				f(lang);
			});
		}
	};

	Prism.hooks.add('complete', function (env) {
		if (env.element && env.language && !env.grammar) {
			if (env.language !== ignored_language) {
				registerElement(env.language, env.element);
			}
		}
	});

}());

/***/ }),
/* 46 */
/*!**************************************************************************!*\
  !*** ../node_modules/prismjs/plugins/line-numbers/prism-line-numbers.js ***!
  \**************************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports) {

(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	/**
	 * Plugin name which is used as a class name for <pre> which is activating the plugin
	 * @type {String}
	 */
	var PLUGIN_NAME = 'line-numbers';
	
	/**
	 * Regular expression used for determining line breaks
	 * @type {RegExp}
	 */
	var NEW_LINE_EXP = /\n(?!$)/g;

	/**
	 * Resizes line numbers spans according to height of line of code
	 * @param {Element} element <pre> element
	 */
	var _resizeElement = function (element) {
		var codeStyles = getStyles(element);
		var whiteSpace = codeStyles['white-space'];

		if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
			var codeElement = element.querySelector('code');
			var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
			var lineNumberSizer = element.querySelector('.line-numbers-sizer');
			var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

			if (!lineNumberSizer) {
				lineNumberSizer = document.createElement('span');
				lineNumberSizer.className = 'line-numbers-sizer';

				codeElement.appendChild(lineNumberSizer);
			}

			lineNumberSizer.style.display = 'block';

			codeLines.forEach(function (line, lineNumber) {
				lineNumberSizer.textContent = line || '\n';
				var lineSize = lineNumberSizer.getBoundingClientRect().height;
				lineNumbersWrapper.children[lineNumber].style.height = lineSize + 'px';
			});

			lineNumberSizer.textContent = '';
			lineNumberSizer.style.display = 'none';
		}
	};

	/**
	 * Returns style declarations for the element
	 * @param {Element} element
	 */
	var getStyles = function (element) {
		if (!element) {
			return null;
		}

		return window.getComputedStyle ? getComputedStyle(element) : (element.currentStyle || null);
	};

	window.addEventListener('resize', function () {
		Array.prototype.forEach.call(document.querySelectorAll('pre.' + PLUGIN_NAME), _resizeElement);
	});

	Prism.hooks.add('complete', function (env) {
		if (!env.code) {
			return;
		}

		// works only for <code> wrapped inside <pre> (not inline)
		var pre = env.element.parentNode;
		var clsReg = /\s*\bline-numbers\b\s*/;
		if (
			!pre || !/pre/i.test(pre.nodeName) ||
			// Abort only if nor the <pre> nor the <code> have the class
			(!clsReg.test(pre.className) && !clsReg.test(env.element.className))
		) {
			return;
		}

		if (env.element.querySelector('.line-numbers-rows')) {
			// Abort if line numbers already exists
			return;
		}

		if (clsReg.test(env.element.className)) {
			// Remove the class 'line-numbers' from the <code>
			env.element.className = env.element.className.replace(clsReg, ' ');
		}
		if (!clsReg.test(pre.className)) {
			// Add the class 'line-numbers' to the <pre>
			pre.className += ' line-numbers';
		}

		var match = env.code.match(NEW_LINE_EXP);
		var linesNum = match ? match.length + 1 : 1;
		var lineNumbersWrapper;

		var lines = new Array(linesNum + 1);
		lines = lines.join('<span></span>');

		lineNumbersWrapper = document.createElement('span');
		lineNumbersWrapper.setAttribute('aria-hidden', 'true');
		lineNumbersWrapper.className = 'line-numbers-rows';
		lineNumbersWrapper.innerHTML = lines;

		if (pre.hasAttribute('data-start')) {
			pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
		}

		env.element.appendChild(lineNumbersWrapper);

		_resizeElement(pre);

		Prism.hooks.run('line-numbers', env);
	});

	Prism.hooks.add('line-numbers', function (env) {
		env.plugins = env.plugins || {};
		env.plugins.lineNumbers = true;
	});
	
	/**
	 * Global exports
	 */
	Prism.plugins.lineNumbers = {
		/**
		 * Get node for provided line number
		 * @param {Element} element pre element
		 * @param {Number} number line number
		 * @return {Element|undefined}
		 */
		getLine: function (element, number) {
			if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
				return;
			}

			var lineNumberRows = element.querySelector('.line-numbers-rows');
			var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
			var lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

			if (number < lineNumberStart) {
				number = lineNumberStart;
			}
			if (number > lineNumberEnd) {
				number = lineNumberEnd;
			}

			var lineIndex = number - lineNumberStart;

			return lineNumberRows.children[lineIndex];
		}
	};

}());

/***/ }),
/* 47 */
/*!**************************************!*\
  !*** ./scripts/app/app.instagram.js ***!
  \**************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_lazy_load__ = __webpack_require__(/*! ./app.lazy-load */ 17);
// user id => 1397790551
// token => 1397790551.1aa422d.37dca7d33ba34544941e111aa03e85c7
// user nname => GodoFredoNinja
// http://instagram.com/oauth/authorize/?client_id=YOURCLIENTIDHERE&redirect_uri=HTTP://YOURREDIRECTURLHERE.COM&response_type=token



/* Template for images */
var templateInstagram = function (data) {
  return ("<div class=\"instagram-col col s6 m4 l2\">\n    <a href=\"" + (data.link) + "\" class=\"instagram-img u-relative u-overflowHidden u-sizeFullWidth u-block\" target=\"_blank\">\n      <span class=\"u-absolute0 u-bgCover u-backgroundColorGrayLight lazy-load-image\" data-src=\"" + (data.images.standard_resolution.url) + "\" style:\"z-index:2\"></span>\n      <div class=\"instagram-hover u-absolute0 u-flexColumn\" style=\"z-index:3\">\n        <div class=\"u-textAlignCenter u-fontWeightBold u-textColorWhite u-fontSize20\">\n          <span style=\"padding-right:10px\"><i class=\"i-favorite\"></i> " + (data.likes.count) + "</span>\n          <span style=\"padding-left:10px\"><i class=\"i-comments\"></i> " + (data.comments.count) + "</span>\n        </div>\n      </div>\n    </a>\n  </div>");
}

// Shuffle Array
var shuffleInstagram = function (arr) { return arr
  .map(function (a) { return [Math.random(), a]; })
  .sort(function (a, b) { return a[0] - b[0]; })
  .map(function (a) { return a[1]; }); };

// Display Instagram Images
var displayInstagram = function (res, user) {
  var shuffle = shuffleInstagram(res.data);
  var sf = shuffle.slice(0, 6);

  return sf.map(function (img) {
    var images = templateInstagram(img);
    $('.instagram').removeClass('u-hide');
    $('.instagram-wrap').append(images);
    $('.instagram-name').html(user);
  });
}

/* harmony default export */ __webpack_exports__["a"] = (function (url, user) {
  fetch(url)
  .then(function (response) { return response.json(); })
  .then(function (resource) { return displayInstagram(resource, user); })
  .then(function () { return Object(__WEBPACK_IMPORTED_MODULE_0__app_lazy_load__["a" /* default */])().update(); })
  .catch( function () { return $('.instagram').remove(); });
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 48 */
/*!*********************************!*\
  !*** ./scripts/routes/video.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_youtube_subscribe__ = __webpack_require__(/*! ../app/app.youtube-subscribe */ 49);


/* Iframe SRC video */
var iframeVideo = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="vid.me"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]' ];

/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    var $videoEmbed = $('.cc-video-embed');
    var firstVideo = $('.post-body-wrap').find(iframeVideo.join(','))[0];

    if (typeof firstVideo === 'undefined') {
      return;
    }

    var $video = $(firstVideo);
    var $firstParentVideo = $video.parent('.video-responsive');
    var $secondParentVideo = $firstParentVideo.parent('.kg-embed-card');

    // Append Video
    if ($secondParentVideo.hasClass('kg-embed-card')) {
      $secondParentVideo.appendTo($videoEmbed);
    } else {
      $firstParentVideo.appendTo($videoEmbed);
    }
  },

  finalize: function finalize() {
    //  Dnot scroll
    var didScroll = false;

    // Youtube subscribe
    if (typeof youtubeChannelID !== 'undefined') {
      Object(__WEBPACK_IMPORTED_MODULE_0__app_app_youtube_subscribe__["a" /* default */])(youtubeChannelID); /* eslint-disable-line */
    }

    // Fixed video in te footer of page
    function fixedVideo() {
      var scrollTop = $(window).scrollTop();
      var elementOffset = $('.post').offset().top;

      if (scrollTop > elementOffset){
        $('body').addClass('has-video-fixed');
      } else {
        $('body').removeClass('has-video-fixed');
      }
    }

    // Close video fixed
    $('.cc-video-close').on('click', function () {
      $('body').removeClass('has-video-fixed');
      $(window).off('scroll.video');
    });

    if( $(window).width() > 1200 ) {
      // Active Scroll
      $(window).on('scroll.video', function () { return didScroll = true; } );

      setInterval(function () {
        if (didScroll) {
          fixedVideo();
          didScroll = false;
        }
      }, 500);
    }
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 49 */
/*!**********************************************!*\
  !*** ./scripts/app/app.youtube-subscribe.js ***!
  \**********************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (ChannelId) {
  var template = "<span class=\"u-paddingLeft15\"><div class=\"g-ytsubscribe\" data-channelid=\"" + ChannelId + "\" data-layout=\"default\" data-count=\"default\"></div></span>";

  $('.cc-video-subscribe').append(template);

  var go = document.createElement('script');
  go.type = 'text/javascript';
  go.async = true;
  go.src = 'https://apis.google.com/js/platform.js';
  document.body.appendChild(go);
  // const s = document.getElementsByTagName('script')[0];
  // s.parentNode.insertBefore(go, s);
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 50 */
/*!***************************************!*\
  !*** ./scripts/app/app.pagination.js ***!
  \***************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_lazy_load__ = __webpack_require__(/*! ../app/app.lazy-load */ 17);
/* global maxPages */

/**
 * @package godofredoninja
 * pagination
 * the code only runs on the first home page, author, tag
 *
 * the page is inspired by the casper code theme for ghost
 */



/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // Variables
    var $buttonLoadMore = $('.load-more');
    var $result = $('.story-feed');
    // const $win = $(window);

    var pathname = window.location.pathname;
    var currentPage = 1;
    // let lastScroll = 0;

    // show button for load more
    if (maxPages >= 2){
      $buttonLoadMore.removeClass('u-hide');
    }

    function sanitizePathname(path) {
      var paginationRegex = /(?:page\/)(\d)(?:\/)$/i;

      // remove hash params from path
      path = path.replace(/#(.*)$/g, '').replace('////g', '/');

      // remove pagination from the path and replace the current pages
      // with the actual requested page. E. g. `/page/3/` indicates that
      // the user actually requested page 3, so we should request page 4
      // next, unless it's the last page already.
      if (path.match(paginationRegex)) {
        currentPage = parseInt(path.match(paginationRegex)[1]);

        path = path.replace(paginationRegex, '');
      }

      return path;
    }

    function mapachePagination (e) {
      var this$1 = this;

      e.preventDefault();

      // sanitize the pathname from possible pagination or hash params
      pathname = sanitizePathname(pathname);

      /**
      * maxPages is defined in default.hbs and is the value
      * of the amount of pagination pages.
      * If we reached the last page or are past it,
      * we return and disable the listeners.
      */
      if (currentPage >= maxPages) {
        $(this).remove();

        return;
      }

      // next page
      currentPage += 1;

      // Load more
      var nextPage = pathname + "page/" + currentPage + "/";

      /* Fetch Page */
      $.get(nextPage, function (content) {
        var parse = document.createRange().createContextualFragment(content);
        var posts = parse.querySelector('.story-feed-content');

        $result[0].appendChild(posts);

      }).fail( function (xhr) {
        // 404 indicates we've run out of pages
        if (xhr.status === 404) {
          $(this$1).remove();
        }
      }).always( function () {
        /* Lazy load for image */
        Object(__WEBPACK_IMPORTED_MODULE_0__app_app_lazy_load__["a" /* default */])().update();
      });
    }

    //  Click Load More
    $buttonLoadMore.on('click', mapachePagination);
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 51 */
/*!**************************!*\
  !*** ./styles/main.scss ***!
  \**************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 18);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ 20)(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 18, function() {
		var newContent = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 18);

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 52 */
/*!****************************************************!*\
  !*** ../node_modules/css-loader/lib/url/escape.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 53 */
/*!***************************!*\
  !*** ./images/avatar.png ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAACbCAMAAABCvxm+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMERFNUY2MzE4Q0QxMUUzODE4RkFDREMyNzVDMjRDQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMERFNUY2NDE4Q0QxMUUzODE4RkFDREMyNzVDMjRDQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkIwREU1RjYxMThDRDExRTM4MThGQUNEQzI3NUMyNENDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkIwREU1RjYyMThDRDExRTM4MThGQUNEQzI3NUMyNENDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+gkOp7wAAAjFQTFRFzN7oJCYo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"

/***/ }),
/* 54 */
/*!***************************!*\
  !*** ./fonts/mapache.ttf ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.ttf";

/***/ }),
/* 55 */
/*!****************************!*\
  !*** ./fonts/mapache.woff ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.woff";

/***/ }),
/* 56 */
/*!***************************!*\
  !*** ./fonts/mapache.svg ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.svg";

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map