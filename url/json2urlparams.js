//示例

  $("#query").click(function(){
    let url = "<{url r='stat/flowrecord' page=$pages type=$type}>";
    let params = {
      startTime: $('#startTime').val(),
      endTime: $('#endTime').val(),
      kw: $('#kw').val()
    };
    
    location.href = url + (/\?/.test(url) ? '&' : '?') + Object.keys(params).map(function(k){
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    
  });