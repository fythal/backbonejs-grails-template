// (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.

// Backbone may be freely distributed under the MIT license.

(function(){var e=this,t=e.Backbone,n=Array.prototype.slice,r=Array.prototype.splice,i;i="undefined"!=typeof exports?exports:e.Backbone={},i.VERSION="0.9.2";var s=e._;!s&&"undefined"!=typeof require&&(s=require("underscore"));var o=e.jQuery||e.Zepto||e.ender;i.setDomLibrary=function(e){o=e},i.noConflict=function(){return e.Backbone=t,this},i.emulateHTTP=!1,i.emulateJSON=!1;var u=/\s+/,a=i.Events={on:function(e,t,n){var r,i,s,o,a;if(!t)return this;e=e.split(u);for(r=this._callbacks||(this._callbacks={});i=e.shift();)s=(a=r[i])?a.tail:{},s.next=o={},s.context=n,s.callback=t,r[i]={tail:o,next:a?a.next:s};return this},off:function(e,t,n){var r,i,o,a,f,l;if(i=this._callbacks){if(!e&&!t&&!n)return delete this._callbacks,this;for(e=e?e.split(u):s.keys(i);r=e.shift();)if(o=i[r],delete i[r],o&&(t||n))for(a=o.tail;(o=o.next)!==a;)(f=o.callback,l=o.context,t&&f!==t||n&&l!==n)&&this.on(r,f,l);return this}},trigger:function(e){var t,r,i,s,o,a;if(!(i=this._callbacks))return this;o=i.all,e=e.split(u);for(a=n.call(arguments,1);t=e.shift();){if(r=i[t])for(s=r.tail;(r=r.next)!==s;)r.callback.apply(r.context||this,a);if(r=o){s=r.tail;for(t=[t].concat(a);(r=r.next)!==s;)r.callback.apply(r.context||this,t)}}return this}};a.bind=a.on,a.unbind=a.off;var f=i.Model=function(e,t){var n;e||(e={}),t&&t.parse&&(e=this.parse(e));if(n=T(this,"defaults"))e=s.extend({},n,e);t&&t.collection&&(this.collection=t.collection),this.attributes={},this._escapedAttributes={},this.cid=s.uniqueId("c"),this.changed={},this._silent={},this._pending={},this.set(e,{silent:!0}),this.changed={},this._silent={},this._pending={},this._previousAttributes=s.clone(this.attributes),this.initialize.apply(this,arguments)};s.extend(f.prototype,a,{changed:null,_silent:null,_pending:null,idAttribute:"id",initialize:function(){},toJSON:function(){return s.clone(this.attributes)},get:function(e){return this.attributes[e]},escape:function(e){var t;return(t=this._escapedAttributes[e])?t:(t=this.get(e),this._escapedAttributes[e]=s.escape(null==t?"":""+t))},has:function(e){return null!=this.get(e)},set:function(e,t,n){var r,i;s.isObject(e)||null==e?(r=e,n=t):(r={},r[e]=t),n||(n={});if(!r)return this;r instanceof f&&(r=r.attributes);if(n.unset)for(i in r)r[i]=void 0;if(!this._validate(r,n))return!1;this.idAttribute in r&&(this.id=r[this.idAttribute]);var t=n.changes={},o=this.attributes,u=this._escapedAttributes,a=this._previousAttributes||{};for(i in r){e=r[i];if(!s.isEqual(o[i],e)||n.unset&&s.has(o,i))delete u[i],(n.silent?this._silent:t)[i]=!0;n.unset?delete o[i]:o[i]=e,!s.isEqual(a[i],e)||s.has(o,i)!=s.has(a,i)?(this.changed[i]=e,n.silent||(this._pending[i]=!0)):(delete this.changed[i],delete this._pending[i])}return n.silent||this.change(n),this},unset:function(e,t){return(t||(t={})).unset=!0,this.set(e,null,t)},clear:function(e){return(e||(e={})).unset=!0,this.set(s.clone(this.attributes),e)},fetch:function(e){var e=e?s.clone(e):{},t=this,n=e.success;return e.success=function(r,i,s){if(!t.set(t.parse(r,s),e))return!1;n&&n(t,r)},e.error=i.wrapError(e.error,t,e),(this.sync||i.sync).call(this,"read",this,e)},save:function(e,t,n){var r,o;s.isObject(e)||null==e?(r=e,n=t):(r={},r[e]=t),n=n?s.clone(n):{};if(n.wait){if(!this._validate(r,n))return!1;o=s.clone(this.attributes)}e=s.extend({},n,{silent:!0});if(r&&!this.set(r,n.wait?e:n))return!1;var u=this,a=n.success;return n.success=function(e,t,i){t=u.parse(e,i),n.wait&&(delete n.wait,t=s.extend(r||{},t));if(!u.set(t,n))return!1;a?a(u,e):u.trigger("sync",u,e,n)},n.error=i.wrapError(n.error,u,n),t=this.isNew()?"create":"update",t=(this.sync||i.sync).call(this,t,this,n),n.wait&&this.set(o,e),t},destroy:function(e){var e=e?s.clone(e):{},t=this,n=e.success,r=function(){t.trigger("destroy",t,t.collection,e)};if(this.isNew())return r(),!1;e.success=function(i){e.wait&&r(),n?n(t,i):t.trigger("sync",t,i,e)},e.error=i.wrapError(e.error,t,e);var o=(this.sync||i.sync).call(this,"delete",this,e);return e.wait||r(),o},url:function(){var e=T(this,"urlRoot")||T(this.collection,"url")||N();return this.isNew()?e:e+("/"==e.charAt(e.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(e){return e},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},change:function(e){e||(e={});var t=this._changing;this._changing=!0;for(var n in this._silent)this._pending[n]=!0;var r=s.extend({},e.changes,this._silent);this._silent={};for(n in r)this.trigger("change:"+n,this,this.get(n),e);if(t)return this;for(;!s.isEmpty(this._pending);){this._pending={},this.trigger("change",this,e);for(n in this.changed)!this._pending[n]&&!this._silent[n]&&delete this.changed[n];this._previousAttributes=s.clone(this.attributes)}return this._changing=!1,this},hasChanged:function(e){return arguments.length?s.has(this.changed,e):!s.isEmpty(this.changed)},changedAttributes:function(e){if(!e)return this.hasChanged()?s.clone(this.changed):!1;var t,n=!1,r=this._previousAttributes,i;for(i in e)s.isEqual(r[i],t=e[i])||((n||(n={}))[i]=t);return n},previous:function(e){return!arguments.length||!this._previousAttributes?null:this._previousAttributes[e]},previousAttributes:function(){return s.clone(this._previousAttributes)},isValid:function(){return!this.validate(this.attributes)},_validate:function(e,t){if(t.silent||!this.validate)return!0;var e=s.extend({},this.attributes,e),n=this.validate(e,t);return n?(t&&t.error?t.error(this,n,t):this.trigger("error",this,n,t),!1):!0}});var l=i.Collection=function(e,t){t||(t={}),t.model&&(this.model=t.model),t.comparator&&(this.comparator=t.comparator),this._reset(),this.initialize.apply(this,arguments),e&&this.reset(e,{silent:!0,parse:t.parse})};s.extend(l.prototype,a,{model:f,initialize:function(){},toJSON:function(e){return this.map(function(t){return t.toJSON(e)})},add:function(e,t){var n,i,o,u,a,f={},l={},c=[];t||(t={}),e=s.isArray(e)?e.slice():[e],n=0;for(i=e.length;n<i;n++){if(!(o=e[n]=this._prepareModel(e[n],t)))throw Error("Can't add an invalid model to a collection");u=o.cid,a=o.id,f[u]||this._byCid[u]||null!=a&&(l[a]||this._byId[a])?c.push(n):f[u]=l[a]=o}for(n=c.length;n--;)e.splice(c[n],1);n=0;for(i=e.length;n<i;n++)(o=e[n]).on("all",this._onModelEvent,this),this._byCid[o.cid]=o,null!=o.id&&(this._byId[o.id]=o);this.length+=i,r.apply(this.models,[null!=t.at?t.at:this.models.length,0].concat(e)),this.comparator&&this.sort({silent:!0});if(t.silent)return this;n=0;for(i=this.models.length;n<i;n++)f[(o=this.models[n]).cid]&&(t.index=n,o.trigger("add",o,this,t));return this},remove:function(e,t){var n,r,i,o;t||(t={}),e=s.isArray(e)?e.slice():[e],n=0;for(r=e.length;n<r;n++)if(o=this.getByCid(e[n])||this.get(e[n]))delete this._byId[o.id],delete this._byCid[o.cid],i=this.indexOf(o),this.models.splice(i,1),this.length--,t.silent||(t.index=i,o.trigger("remove",o,this,t)),this._removeReference(o);return this},push:function(e,t){return e=this._prepareModel(e,t),this.add(e,t),e},pop:function(e){var t=this.at(this.length-1);return this.remove(t,e),t},unshift:function(e,t){return e=this._prepareModel(e,t),this.add(e,s.extend({at:0},t)),e},shift:function(e){var t=this.at(0);return this.remove(t,e),t},get:function(e){return null==e?void 0:this._byId[null!=e.id?e.id:e]},getByCid:function(e){return e&&this._byCid[e.cid||e]},at:function(e){return this.models[e]},where:function(e){return s.isEmpty(e)?[]:this.filter(function(t){for(var n in e)if(e[n]!==t.get(n))return!1;return!0})},sort:function(e){e||(e={});if(!this.comparator)throw Error("Cannot sort a set without a comparator");var t=s.bind(this.comparator,this);return 1==this.comparator.length?this.models=this.sortBy(t):this.models.sort(t),e.silent||this.trigger("reset",this,e),this},pluck:function(e){return s.map(this.models,function(t){return t.get(e)})},reset:function(e,t){e||(e=[]),t||(t={});for(var n=0,r=this.models.length;n<r;n++)this._removeReference(this.models[n]);return this._reset(),this.add(e,s.extend({silent:!0},t)),t.silent||this.trigger("reset",this,t),this},fetch:function(e){e=e?s.clone(e):{},void 0===e.parse&&(e.parse=!0);var t=this,n=e.success;return e.success=function(r,i,s){t[e.add?"add":"reset"](t.parse(r,s),e),n&&n(t,r)},e.error=i.wrapError(e.error,t,e),(this.sync||i.sync).call(this,"read",this,e)},create:function(e,t){var n=this,t=t?s.clone(t):{},e=this._prepareModel(e,t);if(!e)return!1;t.wait||n.add(e,t);var r=t.success;return t.success=function(i,s){t.wait&&n.add(i,t),r?r(i,s):i.trigger("sync",e,s,t)},e.save(null,t),e},parse:function(e){return e},chain:function(){return s(this.models).chain()},_reset:function(){this.length=0,this.models=[],this._byId={},this._byCid={}},_prepareModel:function(e,t){return t||(t={}),e instanceof f?e.collection||(e.collection=this):(t.collection=this,e=new this.model(e,t),e._validate(e.attributes,t)||(e=!1)),e},_removeReference:function(e){this==e.collection&&delete e.collection,e.off("all",this._onModelEvent,this)},_onModelEvent:function(e,t,n,r){("add"==e||"remove"==e)&&n!=this||("destroy"==e&&this.remove(t,r),t&&e==="change:"+t.idAttribute&&(delete this._byId[t.previous(t.idAttribute)],this._byId[t.id]=t),this.trigger.apply(this,arguments))}}),s.each("forEach,each,map,reduce,reduceRight,find,detect,filter,select,reject,every,all,some,any,include,contains,invoke,max,min,sortBy,sortedIndex,toArray,size,first,initial,rest,last,without,indexOf,shuffle,lastIndexOf,isEmpty,groupBy".split(","),function(e){l.prototype[e]=function(){return s[e].apply(s,[this.models].concat(s.toArray(arguments)))}});var c=i.Router=function(e){e||(e={}),e.routes&&(this.routes=e.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},h=/:\w+/g,p=/\*\w+/g,d=/[-[\]{}()+?.,\\^$|#\s]/g;s.extend(c.prototype,a,{initialize:function(){},route:function(e,t,n){return i.history||(i.history=new v),s.isRegExp(e)||(e=this._routeToRegExp(e)),n||(n=this[t]),i.history.route(e,s.bind(function(r){r=this._extractParameters(e,r),n&&n.apply(this,r),this.trigger.apply(this,["route:"+t].concat(r)),i.history.trigger("route",this,t,r)},this)),this},navigate:function(e,t){i.history.navigate(e,t)},_bindRoutes:function(){if(this.routes){var e=[],t;for(t in this.routes)e.unshift([t,this.routes[t]]);t=0;for(var n=e.length;t<n;t++)this.route(e[t][0],e[t][1],this[e[t][1]])}},_routeToRegExp:function(e){return e=e.replace(d,"\\$&").replace(h,"([^/]+)").replace(p,"(.*?)"),RegExp("^"+e+"$")},_extractParameters:function(e,t){return e.exec(t).slice(1)}});var v=i.History=function(){this.handlers=[],s.bindAll(this,"checkUrl")},m=/^[#\/]/,g=/msie [\w.]+/;v.started=!1,s.extend(v.prototype,a,{interval:50,getHash:function(e){return(e=(e?e.location:window.location).href.match(/#(.*)$/))?e[1]:""},getFragment:function(e,t){if(null==e)if(this._hasPushState||t){var e=window.location.pathname,n=window.location.search;n&&(e+=n)}else e=this.getHash();return e.indexOf(this.options.root)||(e=e.substr(this.options.root.length)),e.replace(m,"")},start:function(e){if(v.started)throw Error("Backbone.history has already been started");v.started=!0,this.options=s.extend({},{root:"/"},this.options,e),this._wantsHashChange=!1!==this.options.hashChange,this._wantsPushState=!!this.options.pushState,this._hasPushState=!(!this.options.pushState||!window.history||!window.history.pushState);var e=this.getFragment(),t=document.documentMode;if(t=g.exec(navigator.userAgent.toLowerCase())&&(!t||7>=t))this.iframe=o('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(e);this._hasPushState?o(window).bind("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!t?o(window).bind("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=e,e=window.location,t=e.pathname==this.options.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!t)return this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0;this._wantsPushState&&this._hasPushState&&t&&e.hash&&(this.fragment=this.getHash().replace(m,""),window.history.replaceState({},document.title,e.protocol+"//"+e.host+this.options.root+this.fragment));if(!this.options.silent)return this.loadUrl()},stop:function(){o(window).unbind("popstate",this.checkUrl).unbind("hashchange",this.checkUrl),clearInterval(this._checkUrlInterval),v.started=!1},route:function(e,t){this.handlers.unshift({route:e,callback:t})},checkUrl:function(){var e=this.getFragment();e==this.fragment&&this.iframe&&(e=this.getFragment(this.getHash(this.iframe)));if(e==this.fragment)return!1;this.iframe&&this.navigate(e),this.loadUrl()||this.loadUrl(this.getHash())},loadUrl:function(e){var t=this.fragment=this.getFragment(e);return s.any(this.handlers,function(e){if(e.route.test(t))return e.callback(t),!0})},navigate:function(e,t){if(!v.started)return!1;if(!t||!0===t)t={trigger:t};var n=(e||"").replace(m,"");this.fragment!=n&&(this._hasPushState?(0!=n.indexOf(this.options.root)&&(n=this.options.root+n),this.fragment=n,window.history[t.replace?"replaceState":"pushState"]({},document.title,n)):this._wantsHashChange?(this.fragment=n,this._updateHash(window.location,n,t.replace),this.iframe&&n!=this.getFragment(this.getHash(this.iframe))&&(t.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,n,t.replace))):window.location.assign(this.options.root+e),t.trigger&&this.loadUrl(e))},_updateHash:function(e,t,n){n?e.replace(e.toString().replace(/(javascript:|#).*$/,"")+"#"+t):e.hash=t}});var y=i.View=function(e){this.cid=s.uniqueId("view"),this._configure(e||{}),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},b=/^(\S+)\s*(.*)$/,w="model,collection,el,id,attributes,className,tagName".split(",");s.extend(y.prototype,a,{tagName:"div",$:function(e){return this.$el.find(e)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this},make:function(e,t,n){return e=document.createElement(e),t&&o(e).attr(t),n&&o(e).html(n),e},setElement:function(e,t){return this.$el&&this.undelegateEvents(),this.$el=e instanceof o?e:o(e),this.el=this.$el[0],!1!==t&&this.delegateEvents(),this},delegateEvents:function(e){if(e||(e=T(this,"events"))){this.undelegateEvents();for(var t in e){var n=e[t];s.isFunction(n)||(n=this[e[t]]);if(!n)throw Error('Method "'+e[t]+'" does not exist');var r=t.match(b),i=r[1],r=r[2],n=s.bind(n,this),i=i+(".delegateEvents"+this.cid);""===r?this.$el.bind(i,n):this.$el.delegate(r,i,n)}}},undelegateEvents:function(){this.$el.unbind(".delegateEvents"+this.cid)},_configure:function(e){this.options&&(e=s.extend({},this.options,e));for(var t=0,n=w.length;t<n;t++){var r=w[t];e[r]&&(this[r]=e[r])}this.options=e},_ensureElement:function(){if(this.el)this.setElement(this.el,!1);else{var e=T(this,"attributes")||{};this.id&&(e.id=this.id),this.className&&(e["class"]=this.className),this.setElement(this.make(this.tagName,e),!1)}}}),f.extend=l.extend=c.extend=y.extend=function(e,t){var n=x(this,e,t);return n.extend=this.extend,n};var E={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};i.sync=function(e,t,n){var r=E[e];n||(n={});var u={type:r,dataType:"json"};return n.url||(u.url=T(t,"url")||N()),!n.data&&t&&("create"==e||"update"==e)&&(u.contentType="application/json",u.data=JSON.stringify(t.toJSON())),i.emulateJSON&&(u.contentType="application/x-www-form-urlencoded",u.data=u.data?{model:u.data}:{}),i.emulateHTTP&&("PUT"===r||"DELETE"===r)&&(i.emulateJSON&&(u.data._method=r),u.type="POST",u.beforeSend=function(e){e.setRequestHeader("X-HTTP-Method-Override",r)}),"GET"!==u.type&&!i.emulateJSON&&(u.processData=!1),o.ajax(s.extend(u,n))},i.wrapError=function(e,t,n){return function(r,i){i=r===t?i:r,e?e(t,i,n):t.trigger("error",t,i,n)}};var S=function(){},x=function(e,t,n){var r;return r=t&&t.hasOwnProperty("constructor")?t.constructor:function(){e.apply(this,arguments)},s.extend(r,e),S.prototype=e.prototype,r.prototype=new S,t&&s.extend(r.prototype,t),n&&s.extend(r,n),r.prototype.constructor=r,r.__super__=e.prototype,r},T=function(e,t){return!e||!e[t]?null:s.isFunction(e[t])?e[t]():e[t]},N=function(){throw Error('A "url" property or function must be specified')}}).call(this)