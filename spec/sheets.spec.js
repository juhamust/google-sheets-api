var fs = require('fs');
var path = require('path');
var proxyquire = require('proxyquire');


describe('Sheets', function() {

  // Load test JSON
  var raw = fs.readFileSync(path.join(__dirname, 'cells.json')).toString();
  var cells = Promise.resolve(JSON.parse(raw));

  // Mock googleapis
  var Sheets = proxyquire('../lib/sheets', {
    googleapis: {
      auth: {
        JWT: function() {
          return {
            authorize: function(cb) {
              return cb();
            },
            credentials: {
              expiry_date: 0
            }
          }
        }
      }
    },
    request: function(params, cb) {
      cb(null, { statusCode: 200 }, cells);
    }
  });

  var sheets = new Sheets({
    email: 'test@company.com',
    key: 'testkey'
  });


  it('should get cells', function(done) {
    sheets.get()
    .then(function(cells){
      expect(cells.length).toBe(6);
      done();
    });
  });

  it('should parse range', function() {
    sheets.parseRangeInfo('A1:B2');
  });

});