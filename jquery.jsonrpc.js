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
        if(typeof(params) !== 'undefined') {
          if (typeof(params.endPoint) !== 'endPoint') this.endPoint = params.endPoint;
          if (typeof(params.namespace) !== 'undefined') this.namespace = params.namespace;
        }
      },

      // Convenience wrapper method to allow you to temporarily set a config parameter
      // (endPoint or namespace) and ensure it gets set back to what it was before
      withOptions: function(params, callback) {
        origParams = {endPoint: this.endPoint, namespace: this.namespace};
        this.setup(params);
        callback.call(this);
        this.setup(origParams);
      },

      // Performas a single RPC request
      request: function(method, params, callbacks, url) {
        if (typeof(method) !== 'undefined') {
          this._doRequest(JSON.stringify(this._requestDataObj(method, params, 1)),
                          callbacks,
                          url);
        }
        else {
          throw "Invalid method supplied for jsonRPC request";
        }
      },

      // Submits multiple requests
      // Takes an array of objects that contain a method and params
      batchRequest: function(requests, callbacks, url) {
        if(typeof(requests) === 'undefined' || !requests || !requests.length) return this._response();

        var data = [],
            request;

        for(var i = 0; i<requests.length; i++) {
          request = requests[i];
          data.push(this._requestDataObj(request.method, request.params, i+1));
        }
        console.log(JSON.stringify(data));

        this._doRequest(JSON.stringify(data), callbacks, url);
      },

      // Internal method used for generic ajax requests
      _doRequest: function(data, callbacks, url) {
        var _that = this;
        $.ajax({
          type: 'POST',
          url: this._requestUrl(url),
          data: data,
          cache: false,
          processData: false,
          contentType: 'application/json',
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
        if (typeof(callbacks) !== 'undefined' && typeof(callbacks.error) !== 'undefined') {
            callbacks.error(this._response());
        }
      },

      // Handles calling of RPC success, calls error callback
      // if the response contains an error
      _requestSuccess: function(callbacks, json) {
        var response = this._response(json);
        response.error && callbacks.error ? callbacks.error(response) : null;
        callbacks.success ? callbacks.success(response) : null;
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

            if (json.jsonrpc != '2.0') {
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
