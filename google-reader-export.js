var url = require('url')
, http = require('http')
, querystring = require('querystring')
exports.authURI = function(scope,clientId,redirectURI){
  return "https://accounts.google.com/o/oauth2/auth?redirect_uri="+encodeURIComponent(redirectURI)+"&response_type=code&client_id="+encodeURIComponent(clientId)+"&approval_prompt=force&scope=http://www.google.com/reader/"+scope+"&access_type=offline"
}
exports.authCode = function(path){
  return url.parse(path).query.code
}
exports.getTokens = function(authCode,clientId,clientSecret,redirectURI,callback) {
  var data = querystring.stringify({
    'code':authCode
    , 'redirect_uri':redirectURI
    , 'client_id':clientId
    , 'client_secret':clientSecret
    , 'grant_type':'authorization_code'
  })
  , options = {
    method:'POST'
    , port:'80'
    , hostname:'accounts.google.com'
    , path:'/o/oauth2/token'
    , headers:{
      'Content-length':data.length
      , 'content-type':'application/x-www-form-urlencoded'
    }
  }
  , req = http.request(options,function(res){
    res.setEncoding('utf8')
    res.on('data',function(d){
      callback(false,JSON.parse(d))
  })
  req.on('error',function(e){
    callback(e)
  })
  req.write(data)
  req.end()
}
exports.refreshToken = function(refreshToken,clientId,clientSecret,callback){
  var data = querystring.stringify({
    'refresh_token':refreshToken
    , 'client_id':clientId
    , 'client_secret':clientSecret
    , 'grant_type':'refresh_token'
  })
  , options = {
    method:'POST'
    , port:'80'
    , hostname:'accounts.google.com'
    , path:'/o/oauth2/token'
    , headers:{
      'Content-length':data.length
      , 'content-type':'application/x-www-form-urlencoded'
    }
  }
  , req = http.request(options,function(res){
    res.setEncoding('utf8')
    res.on('data',function(d){
      callback(false,JSON.parse(d))
  })
  req.on('error',function(e){
    callback(e)
  })
  req.write(data)
  req.end()
}
exports.getSubscriptions = function(accessToken,callback){
  var options = {
    hostname:'www.google.com'
    , path:'/reader/api/0/subscription/list?output=json'
    , headers:{'Authorization':'OAuth '+accessToken}
  }
  , req = http.get(options,function(res){
    res.setEncoding('utf8')
    res.on('data',function(d){
      callback(false,JSON.parse(d))
  })
  req.on('error',function(e){
    callback(e)
  })
  req.write(data)
  req.end()
}

