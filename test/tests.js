$(document).ready(function(){
    
  module("parameter validation");

  test("when empty", function() {
    var errMsg = '';
    try {
      $.jsonRPC.setup();
    }
    catch(e) {
      errMsg = e;
    }
    equal(errMsg, "No params specified", "Should raise error about no params being specified");
  });

  test("with invalid endpoint", function() {
    var errMsg = '';
    try {
      $.jsonRPC.setup({endPoint: []});
    }
    catch(e) {
      errMsg = e;
    }
    equal(errMsg, "endPoint must be a string", "Should raise an error about endPoint not being a string");
  });

  test("with invalid namespace", function() {
    var errMsg = '';
    try {
      $.jsonRPC.setup({namespace: []});
    }
    catch(e) {
      errMsg = e;
    }
    equal(errMsg, "namespace must be a string", "Should raise an error about namespace not being a string");
  });

  module("setup");

  test("with no args", function() {
    var errMsg = false;
    try {
      $.jsonRPC.setup();
    }
    catch(e) {
      errMsg = e;
    }
    ok(errMsg, "should raise an error");
  });

  test("with a valid params hash", function() {
    var rpc = $.jsonRPC.setup({endPoint: '/rpc', namespace: 'datagraph'});
    equal('/rpc', rpc.endPoint, "Should set the endPoint");
    equal('datagraph', rpc.namespace, "Should set the namespace");
  });

  module("withOptions");

  test("with no callback", function() {
    var errMsg = false;
    try {
      $.jsonRPC.withOptions({namespace:"test"});
    }
    catch(e) {
      errMsg = e;
    }
    ok(errMsg, "should raise an error"); 
  });

  test("with a callback and namespace param set", function() {
    $.jsonRPC.namespace = 'test';
    $.jsonRPC.withOptions({namespace:"testWithOptions"}, function() {
      equal('testWithOptions', this.namespace, "should temporarily set namespace");
    });
    equal('test', $.jsonRPC.namespace, "should set namespace back after execution");
  });

  test("with a callback and endPoint param set", function() {
    $.jsonRPC.endPoint = '/test';
    $.jsonRPC.withOptions({endPoint:"/testWithOptions"}, function() {
      equal('/testWithOptions', this.endPoint, "should temporarily set endPoint");
    });
    equal('/test', $.jsonRPC.endPoint, "should set endPoint back after execution");
  });

  test("with callback, namespace and endPoint params set", function() {
    $.jsonRPC.namespace = 'test';
    $.jsonRPC.endPoint = '/test';
    $.jsonRPC.withOptions({namespace: "testWithOptions", endPoint:"/testWithOptions"}, function() {
      equal('testWithOptions', this.namespace, "should temporarily set namespace");
      equal('/testWithOptions', this.endPoint, "should temporarily set endPoint");
    });
    equal('test', $.jsonRPC.namespace, "should set namespace back after execution");
    equal('/test', $.jsonRPC.endPoint, "should set endPoint back after execution");
  });

  module("request")

  test("without a method", function() {
    var errMsg = false;
    try {
      $.jsonRPC.request();
    }
    catch(e) {
      errMsg = e;
    }
    ok(errMsg, "should raise an error");
  });

  test("with an invalid method", function() {
    expect(3);
    var params = [[], {}, function(){}],
        errMsg;
    $.each(params, function(i, param) {
      errMsg = false;
      try {
        $.jsonRPC.request([]);
      }
      catch(e) {
        errMsg = e;
      }
      ok(errMsg, "should raise an error");
    });
  });

  test("with a valid method and invalid params", function() {
    var errMsg = false;
    try {
      $.jsonRPC.request('test', {params: ''});
    }
    catch(e) {
      errMsg = e;
    }
    ok(errMsg, "should raise an error");
  });

  test("with a valid method, no params, and no callbacks", function() {
    stop();
    $.jsonRPC.endPoint = 'data/valid.js'
    ok($.jsonRPC.request('test'));
    start();
  });

  test("with a valid method and param and no callbacks", function() {
    stop();
    $.jsonRPC.endPoint = 'data/valid.js'
    ok($.jsonRPC.request('test'), {params: []});
    ok($.jsonRPC.request('test'), {params: {}});
    ok($.jsonRPC.request('test'), {params: null});
    start();
  });

  test("with a valid method, no params, and invalid callbacks", function() {
    expect(6);

    var callbacks = [null, '', []],
        errMsg;

    $.each(callbacks, function(i, callbackFunction) {
      errMsg = false;
      try {
        $.jsonRPC.request('test', {error:callbackFunction});
      }
      catch(e) {
        errMsg = e;
      }
      ok(errMsg, "should raise an error");
    });
    $.each(callbacks, function(i, callbackFunction) {
      errMsg = false;
      try {
        $.jsonRPC.request('test', {success:callbackFunction});
      }
      catch(e) {
        errMsg = e;
      }
      ok(errMsg, "should raise an error");
    });
  });

  test("with a valid method, no params, and valid callbacks on success", function() {
    expect(1);
    stop();
    $.jsonRPC.endPoint = 'data/valid.js'
    $.jsonRPC.request('test', {
      error: function(json) {
        ok(false, "should not execute this");
        start();
      },
      success: function(json) {
        ok(json, "should execute success callback");
        start();
      }
    });
  });

  test("with a valid method, no params, and valid callbacks on error", function() {
    expect(1);
    stop();
    $.jsonRPC.endPoint = 'data/invalid.js'
    $.jsonRPC.request('test', {
      error: function(json) {
        ok(json, "should execute error callback");
        start();
      },
      success: function(json) {
        ok(false, "should not execute success callback");
        start();
      }
    });
  });

  test("with a valid method, valid params, valid callbacks, and an overriden url", function() {
    expect(1);
    stop();
    $.jsonRPC.endPoint = 'data/invalid.js'
    $.jsonRPC.request('test', {
      params: ['param'],
      url: 'data/valid.js',
      error: function(json) {
        ok(false, "should not execute error callback");
        start();
      },
      success: function(json) {
        ok(true, "should execute success callback");
        start();
      }
    });
    
  });

  module("batchRequest");

  test("with invalid requests object", function() {
    expect(7);
    var requests = [
          'some string',
          function(){},
          {},
          [],
          [1],
          [{method:null}],
          [{method:'test', params:''}],
        ],
        errMsg;

    $.each(requests, function(i, request) {
      errMsg = false;
      try {
        $.jsonRPC.batchRequest(request);
      }
      catch(e) {
        errMsg = e;
      }
      ok(errMsg, "should raise an error");
    });
  });

  test("with a valid method, valid params, valid callbacks, and an overriden url", function() {
    expect(1);
    stop();
    $.jsonRPC.endPoint = 'data/invalid_batch.js'
    $.jsonRPC.batchRequest([
      {method: 'test', params: ['param']}
      ], {
      url: 'data/valid_batch.js',
      error: function(json) {
        ok(false, "should not execute error callback");
        start();
      },
      success: function(json) {
        ok(true, "should execute success callback");
        start();
      }
    });
    
  });

});
