
let url = '/xxxxx';
let params = {
  a: 1,
  b: 2,
  c: 3
};

location.href = url + (/\?/.test(url) ? '&' : '?') + Object.keys(params).map(function(k){
  return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
}).join('&');
    
