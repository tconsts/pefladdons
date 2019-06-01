function changeSlider(a,b){
    var c,e,d;
    void 0==b?(d=$("#"+a).slider("value"),$("#"+a).slider("value",d==$("#"+a).slider("option","max")?$("#"+a).slider("option","min"):d+1)):(d=$("#"+a).slider("values",b),0==b?(c=$("#"+a).slider("option","min"),e=$("#"+a).slider("values",1),c=d==c?e-1:d-1):(c=$("#"+a).slider("values",0),e=$("#"+a).slider("option","max"),c=d==e?c+1:d+1),$("#"+a).slider("values",b,c))

}