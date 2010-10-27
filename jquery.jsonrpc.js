(function($) {
  $.extend({
    jsonRPC: {
      // RPC Version Number
      version: '2.0',

      // End point URL, sets default in requests if not
      // specified with the request call
      endPoint: null,

      // Default namespace for methods
      namespace: null,

      // Setup the endPoint and namespace params
      setup: function(params) {
        this._validateConfigParams(params);
        this.endPoint = params.endPoint;
        this.namespace = params.namespace;
        return this;
      },

      // Convenience wrapper method to allow you to temporarily set a config parameter
      // (endPoint or namespace) and ensure it gets set back to what it was before
      withOptions: function(params, callback) {
        this._validateConfigParams(params);
        // No point in running if there isn't a callback received to run
        if(typeof(callback) === 'undefined') throw("No callback specified");

        origParams = {endPoint: this.endPoint, namespace: this.namespace};
        this.setup(params);
        callback.call(this);
        this.setup(origParams);
      },

      // Performas a single RPC request
      request: function(method, params, callbacks, url) {
        // Validate or method arguments
        this._validateRequestMethod(method);
        this._validateRequestParams(params);
        this._validateRequestCallbacks(callbacks);

        // Perform the actual request
        this._doRequest(JSON.stringify(this._requestDataObj(method, params, 1)),
                        callbacks,
                        url);
        
        return true;
      },

      // Submits multiple requests
      // Takes an array of objects that contain a method and params
      batchRequest: function(requests, callbacks, url) {
        // Ensure our requests come in as an array
        if(!$.isArray(requests) || requests.length === 0) throw("Invalid requests supplied for jsonRPC batchRequest. Must be an array object that contain at least a method attribute");
        
        // Make sure each of our request objects are valid
        var _that = this;
        $.each(requests, function(i, req) {
          _that._validateRequestMethod(req.method);
          _that._validateRequestParams(req.params);
        });
        this._validateRequestCallbacks(callbacks);

        var data = [],
            request;

        // Prepare our request object
        for(var i = 0; i<requests.length; i++) {
          request = requests[i];
          data.push(this._requestDataObj(request.method, request.params, i+1));
        }

        this._doRequest(JSON.stringify(data), callbacks, url);
      },

      // Validate a params hash
      _validateConfigParams: function(params) {
        if(typeof(params) === 'undefined') {
          throw("No params specified");
        }
        else {
          if(params.endPoint && typeof(params.endPoint) !== 'string'){
            throw("endPoint must be a string");
          }
          if(params.namespace && typeof(params.namespace) !== 'string'){
            throw("namespace must be a string");
          }
        }
      },
      
      // Request method must be a string
      _validateRequestMethod: function(method) {
        if(typeof(method) !== 'string') throw("Invalid method supplied for jsonRPC request")
        return true;
      },

      // Validate request params.  Must be a) empty, b) an object (e.g. {}), or c) an array
      _validateRequestParams: function(params) {
        if(!(params === null ||
             typeof(params) === 'undefined' ||
             typeof(params) === 'object' ||
             $.isArray(params))) {
          throw("Invalid params supplied for jsonRPC request. It must be empty, an object or an array.");
        }
        return true;
      },

      _validateRequestCallbacks: function(callbacks) {
        // Make sure callbacks are either empty or a function
        if(typeof(callbacks) !== 'undefined') {
          if(typeof(callbacks.error) !== 'undefined' &&
             typeof(callbacks.error) !== 'function') throw("Invalid error callback supplied for jsonRPC request");
          if(typeof(callbacks.success) !== 'undefined' &&
             typeof(callbacks.success) !== 'function') throw("Invalid success callback supplied for jsonRPC request");
        }
        return true;
      },

      // Internal method used for generic ajax requests
      _doRequest: function(data, callbacks, url) {
        var _that = this;
        $.ajax({
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          url: this._requestUrl(url),
          data: data,
          cache: false,
          processData: false,
          error: function(json) {
            _that._requestError.call(_that, callbacks, json);
          },
          success: function(json) {
            _that._requestSuccess.call(_that, callbacks, json);
          }
        })
      },

      // Determines the appropriate request URL to call for a request
      _requestUrl: function(url) {
        url = url || this.endPoint;
        return url + '?tm=' + new Date().getTime()
      },

      // Creates an RPC suitable request object
      _requestDataObj: function(method, params, id) {
        return {
          jsonrpc: this.version,
          method: this.namespace ? this.namespace +'.'+ method : method,
          params: params,
          id: id
        }
      },

      // Handles calling of error callback function
      _requestError: function(callbacks, json) {
        if (typeof(callbacks) !== 'undefined' && typeof(callbacks.error) === 'function') {
            callbacks.error(this._response());
        }
      },

      // Handles calling of RPC success, calls error callback
      // if the response contains an error
      // TODO: Handle error checking for batch requests
      _requestSuccess: function(callbacks, json) {
        var response = this._response(json);

        // If we've encountered an error in the response, trigger the error callback if it exists
        if(response.error && typeof(callbacks) !=='undefined' && typeof(callbacks.error) !== 'undefined') {
          callbacks.error(response);
          return;
        }

        // Otherwise, successful request, run the success request if it exists
        if(typeof(callbacks) !== 'undefined' && typeof(callbacks.success) !== 'undefined') {
          callbacks.success ? callbacks.success(response) : null;
        }
      },

      // Returns a generic RPC 2.0 compatible response object
      _response: function(json) {
        if (typeof(json) === 'undefined') {
          return {
            error: 'Internal server error',
            version: '2.0'
          };
        }
        else {
          try {
            if(typeof(json) === 'string') {
              json = eval ( '(' + json + ')' );
            }

            if (($.isArray(json) && json.length > 0 && json[0].jsonrpc !== '2.0') || 
                (!$.isArray(json) && json.jsonrpc !== '2.0')) {
              throw 'Version error';
            }

            return json;
          }
          catch (e) {
            return {
              error: 'Internal server error: ' + e,
              version: '2.0'
            }
          }
        }
      }

    }
  });
})(jQuery);
