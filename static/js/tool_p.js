
//前端渲染方法，暂时弃用
function aa(){
    end_time = (new Date()).getTime();
    var cars = {
        '解析dom树耗时' : window.performance.timing.domComplete - window.performance.timing.domInteractive,
        'request请求耗时' : window.performance.timing.responseEnd - window.performance.timing.responseStart,
        '白屏时间' : window.performance.timing.domLoading - window.performance.timing.fetchStart,
        'domready时间' : window.performance.timing.domContentLoadedEventEnd - window.performance.timing.fetchStart,
        'onload时间' : window.performance.timing.loadEventEnd - window.performance.timing.fetchStart
    };
    // clearInterval(t);
    let content=''
    for(let a in cars){
        content += a + ': ' +cars[a] + 'ms' + '<br>'
    }
    console.log(content)
}

//响应时间测试方法
function retime()
{
    var url = document.getElementById("test_url").value
    if (url != ""){
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        var data = '{"url": "' + url +'"}';
        xmlhttp.open("POST", "time_test_rt", true);
        xmlhttp.send(data);
        if (sleep(1000)){}
        document.getElementById("myrame").src = url
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var a = document.getElementById("time")
                let content=''
                var d = JSON.parse(xmlhttp.responseText)
                for(let v in d){
                    content += '<b>' + v + '</b>' + ': ' + d[v] + '<br>'
                }
                a.innerHTML=content
                // aa()
            }
        }
    }else{
        alert('请输入url');
    }
}

//休眠、等待执行
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return true;
    }
}


    //
    function loadXMLDoc(e){
        var td = e.parentNode.previousElementSibling;
        var value = td.querySelector('div').innerHTML;
        var url_id = td.querySelector('div').getAttribute('value');
        // console.log(value)
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        if (value == 0)
        {
            value = 1
        }
        else
        {
            value = 0
        }
        var data ='{ "status" :'+ value +', "url_id" : ' + url_id + '}';
        xmlhttp.open("POST","test_ajax",true);
        xmlhttp.send(data);
        xmlhttp.onreadystatechange = function()
        {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ) 
            {
            if (xmlhttp.responseText == 'ok')
            {
              location.reload();
            }
            else
            {
              alert('请求出错，请重试')
            }
          // document.getElementById("test_button").innerHTML = xmlhttp.responseText
          }
        }
    }

    function task_del(e) {
        if (window.confirm("确定要删除吗")) {
           var task_id = e.parentNode.parentNode.firstElementChild.querySelector('div').innerHTML
            var xmlhttp;
            xmlhttp = new XMLHttpRequest();
            var data = '{  "task_id" : ' + task_id + '}';
            xmlhttp.open("POST", "task_del", true);
            xmlhttp.send(data);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    if (xmlhttp.responseText == 'ok') {
                        location.reload();
                    } else {
                        alert('请求出错，请重试')
                    }
                    // document.getElementById("test_button").innerHTML = xmlhttp.responseText
                }
            }
        }
    }

    function task_edit(e) {
        var task_id = e.parentNode.parentNode.firstElementChild.querySelector('div').innerHTML
        window.location.href="http://192.168.2.92:5001/monitor/task_edit?task_id="+task_id
    }
    function task_res(e) {
    var task_id = e.parentNode.parentNode.firstElementChild.querySelector('div').innerHTML
    window.location.href="http://192.168.2.92:5001/monitor/report?task_id="+task_id
    }
    //test  
    function loadXMLDoc1()
        {
        var xmlhttp;
        if (window.XMLHttpRequest)
            {
            xmlhttp=new XMLHttpRequest();
            }
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
            document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
            }
        }
        xmlhttp.open("POST","test_ajax",true)
        x = document.getElementById("abc").innerHTML;
        var v
        xmlhttp.send("v="+x)
    }

    function task_status(e){
        var task_id = e.parentNode.parentNode.firstElementChild.querySelector('div').innerHTML;
        // console.log(value)
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        var data ='{  "task_id" : ' + task_id + '}';
        xmlhttp.open("POST","task_status",true);
        xmlhttp.send(data);
        xmlhttp.onreadystatechange = function()
        {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 )
            {
            if (xmlhttp.responseText == 'ok')
            {
              location.reload();
            }
            else
            {
              alert('请求出错，请重试')
            }
          // document.getElementById("test_button").innerHTML = xmlhttp.responseText
          }
        }
    }
    
    //生成左侧已有项目列表
    function get_list(){
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET","ajax_get_list",true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function()
        {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ) 
            {
            var c = JSON.parse(xmlhttp.responseText)
            var ele = ''
            for (var i in c)
                {
                ele = ele + "<li><a href=" + c[i] + " title=" + i + " style='color:#A1A9B3'>" + i +"</a></li>"
                }
            }
            document.getElementById('list').innerHTML=ele
        }
    }

    //删除任务
    function deltask(e) {
        if(window.confirm("确定要删除吗,删除之后此任务下所有接口都将被删除？"))
        {
            var td = e.parentNode.previousElementSibling;
            var task_id = td.querySelector('div').getAttribute('value');
            var xmlhttp;
            xmlhttp = new XMLHttpRequest();
            var data = '{ "status" : ' + 2 + ', "task_id" : ' + task_id + '}';
            xmlhttp.open("POST", "EditTaskStatus", true);
            xmlhttp.send(data);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    if (xmlhttp.responseText == 'ok') {
                        location.reload();
                    } else {
                        alert('请求出错，请重试')
                    }
                    // document.getElementById("test_button").innerHTML = xmlhttp.responseText
                    }
                }
            }
        }

    //启用关闭任务
    function loadXMLDocTask(e){
        var td = e.parentNode.previousElementSibling;
        var value = td.querySelector('div').innerHTML;
        var task_id = td.querySelector('div').getAttribute('value');
        // console.log(value)
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        if (value == 0)
            {
              value = 1
            }
            else
            {
              value = 0
            }
        var data ='{ "status" :'+ value +', "task_id" : ' + task_id + '}';
        xmlhttp.open("POST","EditTaskStatus",true);
        xmlhttp.send(data);
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200 )
                {
                if (xmlhttp.responseText == 'ok')
                {
                    location.reload();
                }
                else
                {
                    alert('请求出错，请重试')
                }
          // document.getElementById("test_button").innerHTML = xmlhttp.responseText
            } 
        }
    }


    /*编辑设备*/
    function editdev(e){
        window.location.href="http://192.168.1.59:5000/editdev?devid="+e.dataset.id
    }

    //删除设备
    function deldev(e){
        var devid = e.dataset.id;
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        var data ='{ "status" : '+ 1 +', "devid" : ' + devid + '}';
        xmlhttp.open("POST","deldev",true);
        xmlhttp.send(data);
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ) 
                {
                if (xmlhttp.responseText == 'ok')
                {
                  location.reload();
                }
                else
                {
                  alert('请求出错，请重试')
                }
            }
        }
    }


    function lc(e){
        if (e.classList.contains('disabled')) {
            return
        }
        document.getElementById('loading').style.display='';
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        // {#var data ='{  "url_id" :' + url_id + '}';#}
        xmlhttp.open("POST","login",true);
        xmlhttp.send();
        setTimeout(function(){
            document.getElementById("oImg").src = "/static/pic/QR.png";
            var img_src="/static/pic/QR.png?"+Math.random()
            document.getElementById("oImg").src = img_src;
            document.getElementById('oImg').style.display = "block";
            document.getElementById('loading').style.display = "none";
        },3000)
        btn[1].classList.remove('disabled');
        btn[0].classList.add('disabled')
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ){
                var c = JSON.parse(xmlhttp.responseText)
                if(c.code==1000){
                    alert("登陆成功！")
                    document.getElementById("oImg").src = "";
                    for (let i = 0; i < btn.length; i++) {
                        if (btn[i].classList.contains('disabled')){
                            btn[i].classList.remove('disabled')
                        } else{
                             btn[i].classList.add('disabled')
                        }
                    }
                    btn[0].classList.add('disabled')
                    btn[3].classList.add('disabled')
                }
            }
        }
    }
    

    function refurbish(e){
        if (e.classList.contains('disabled')) {
            return
        }
        var img_src="/static/pic/QR.png?"+Math.random()
        document.getElementById("oImg").src = img_src;
    } 


    function  ec(e){
        if (e.classList.contains('disabled')) {
                return
            }
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        // {#var data ='{  "url_id" :' + url_id + '}';#}
        xmlhttp.open("POST","exit",true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function()
        {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 )
            {
            location.reload()

            }
        }
    }

    
    function  statistic(e){
        if (e.classList.contains('disabled')) {
                return
            }
        // document.getElementById('loading').style.visibility='hidden';
        document.getElementById('loading').style.display='';

        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        // {#var data ='{  "url_id" :' + url_id + '}';#}
        xmlhttp.open("POST","statistic",true);
        xmlhttp.send();

        xmlhttp.onreadystatechange = function()
        {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 )
            {
            var c = JSON.parse(xmlhttp.responseText)
                // {#alert(c.code)#}
                if (c.code == 1001){
                    alert("未登录")
                }else {
                // {#var obj = JSON.parse(xmlhttp.responseText)#}
                // {#var data=obj['city']#}
                    document.getElementById('loading').style.display = "none";
                    btn[1].classList.add('disabled')
                    btn[2].classList.add('disabled')
                    btn[3].classList.remove('disabled')
                    document.getElementById("oImg").src =""
                    optionsex.series[0].data= c.sex
                    optioncity.series[0].data=c.Province
                    myCharsex.setOption(optionsex);
                    myCharcity.setOption(optioncity);
                }
            }
        }
    }


    function  wc(e) {
        if (e.classList.contains('disabled')) {
            return
        }
        var img_RemarkName="/static/pic/RemarkName.png?"+Math.random()
        document.getElementById("RemarkName").src = img_RemarkName;
        // {#document.getElementById("RemarkName").src = "/static/pic/RemarkName.png";#}
        document.getElementById('RemarkName').style.display = "block";
    }

    function isShowTd() {
            var xmlhttp;
                    xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("POST","token_check",true);
                    xmlhttp.send();
                    xmlhttp.onreadystatechange = function()
                    {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ){
                        var c = JSON.parse(xmlhttp.responseText)
                            if (c.code == 1000){
                                document.getElementById('t1').style.display = '';
                                document.getElementById('add1').style.display = '';
                                var t2List = document.querySelectorAll('.t2');
                                for (var i = 0; i < t2List.length; i++) {
                                    t2List[i].style.display = 'inline-block';
                                }
                            }
                        }
                    }
    }
    function devtype(e){
        var devtype = e.dataset.id;
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        var data ='{ "devtype" : '+ devtype +'}';
        xmlhttp.open("POST","typedev",true);
        xmlhttp.send(data);
        xmlhttp.onreadystatechange = function()
        {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ) 
            {
            document.getElementById("123").innerHTML=xmlhttp.responseText
                        isShowTd()
            }
        }
    }
    //校验token
    function token_check(){
        var xmlhttp;
        var token = form1.token.value
        xmlhttp = new XMLHttpRequest();
        var data ='{  "token" :"' + token + '"}';
        xmlhttp.open("POST","token_check",true);
        xmlhttp.send(data);
        xmlhttp.onreadystatechange = function()
        {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ){
            var c = JSON.parse(xmlhttp.responseText)
                if (c.code == 1000){
                    var token=form1.token.value;//获取表单form1的token值
                    setCookie("token",token);
                    window.location.href="http://192.168.2.92:5001"
                    }else {
                    alert("token校验失败")
                }

                }
            }
    }
    //设置cookie
    function setCookie(name,value) {
    var Days = 7;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    //获取cookie
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
        if(arr=document.cookie.match(reg)){
          return unescape(arr[2]);
        }
        else{
         return null;
        }
    }

    //启用停用接口
    function apistatus(e){
        var apiid = e.dataset.id;
        // console.log(value)
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        var data ='{ "apiid" : ' + apiid + '}';
        xmlhttp.open("POST","editstatus",true);
        xmlhttp.send(data);
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200 )
                {
                if (xmlhttp.responseText == 'ok')
                {
                    location.reload()
                }
                else
                {
                    alert('请求出错，请重试')
                }
            }
        }
    }

    //删除接口
    function delapi(e) {
        if(window.confirm("删除之后接口将不再显示，确定要删除吗？"))
        {
            var apiid = e.dataset.id;
            var xmlhttp;
            xmlhttp = new XMLHttpRequest();
            var data = '{ "apiid" : ' + apiid + '}';
            xmlhttp.open("POST", "apishow", true);
            xmlhttp.send(data);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    if (xmlhttp.responseText == 'ok') {
                        location.reload();
                    } else {
                        alert('请求出错，请重试')
                    }
                    }
                }
            }
        }

    /*编辑接口*/
    function editapi(e){
        window.location.href="http://192.168.2.92:5001/monitor/api?apiid="+e.dataset.id
    }
    /*编辑接口*/
    function ret(e){
        alert("暂不支持此功能，接口异常会在钉钉群发通知，请注意查收！")
    }