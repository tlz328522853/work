//---------------窗口参数
var g_containerHeight	= 615;	//多窗口容器高度，必须和网页中的div容器高度保持一致
var g_containerWidth	= 584;	//多窗口容器宽度，必须和网页中的div容器宽度保持一致
var g_videoWinStatusBarHeight	= 20;	//每个视频窗口的状态栏高度

var g_sessionID = "";
var g_resultCode = "";
var g_ResponsetXml = "";
var g_taskID = "";
var g_taskState = "";
var g_errorCode = "";
var g_uploadSize = "";
var g_downSize = "";


//---------------------------窗口对象定义，一个窗口包括一个视频控件窗口和状态栏
function MonitorWindow(monitor) {
    this.monitor = monitor;		//窗口监控器对象
    this.windowObject = null;	//窗口HTML元素容器
    this.mediaObject = null;	//控件对象
    this.index	= -1;			//此窗口序号
}

MonitorWindow.instance = null;
MonitorWindow.ObjectClassIdBase = "B5CDA5F0-7677-4326-9A9B-D33BBAAA0102";	//控件UUID
MonitorWindow.getObjectClassId = function(i) {
    return MonitorWindow.ObjectClassIdBase;
};

//设置监控器对象
MonitorWindow.prototype.setMonitor = function(monitor) {
    this.monitor = monitor;
};

//窗口容器html
MonitorWindow.prototype.getWindowHtml = function(classid, index) {
    var strWindowHtml = ""+
        "    <div >" +	//视频窗口
        "      <object id=\"CamAX_" + index + "\" classid=\"clsid:" + classid + "\" border=1></object>" +
        "    </div>" +
        "    <div align=left >" +	//视频窗口状态栏
        "      <span >" + (index+1) + "</span>" + "&nbsp;<span id='channelName_"+index+"' style='color:red'></span>" +
        "		&nbsp;<span id='winStatus_"+index+"'>空闲</span>" +
        "		<span style='cursor:hand;display:none' onclick='inviteCamByIndex("+index+")'>呼</span>"+
        "		<span style='cursor:hand;display:none' onclick='byeCam("+index+")'>挂</span>" +
        "    </div>" + "";
    return strWindowHtml;
};

//生成窗口容器
MonitorWindow.prototype.getWindow = function(i) {
    var box = document.createElement("div");
    box.style.display = "none";
//	box.align	= 'left';
    box.style.position='absolute';
    box.innerHTML = this.getWindowHtml(MonitorWindow.getObjectClassId(i), i);
    this.windowObject = box;
    this.index	= i;
    this.mediaObject = this.windowObject.getElementsByTagName("object")[0];
    if (this.mediaObject.attachEvent) {

        this.mediaObject.attachEvent("onfocus", function(e) {
            if (!e) e = window.event;
            elm = e.srcElement;
            setFocusStyle(elm);
            var winIndex = getWindowIndex(elm);
            g_currentWindowIndex	= winIndex;
        });

        this.mediaObject.attachEvent("Notify", function(name,status) {
            dispatchEvent(i, name, status);
        });

        this.mediaObject.attachEvent("NotifyXml", function(g_sessionID,g_resultCode, g_ResponsetXml) {
            dispatchXmlEvent(i, g_sessionID, g_resultCode, g_ResponsetXml);
        });


        this.mediaObject.attachEvent("NotifyTask", function(g_taskID,g_taskState,g_errorCode,g_uploadSize,g_downSize) {
            dispatchTaskEvent(i, g_taskID,g_taskState,g_errorCode,g_uploadSize,g_downSize);
        });

    }  else {
//        alert("failed to attach event");
    }
    return box;
};



//显示此窗口
MonitorWindow.prototype.show = function() {
    this.windowObject.style.display = "block";
};
//隐藏此窗口
MonitorWindow.prototype.hide = function() {
    this.windowObject.style.display = "none";
};

//窗口重定位及大小设置
MonitorWindow.prototype.resizeTo = function(left,top,w,h) {
    //var topDiv	= this.windowObject.getElementsByTagName("div")[0];
    var startLeft	= getElementLeft(g_container);
    var startTop	= getElementTop(g_container);
    //alert(startLeft+"-"+startTop);
    //alert("pos:"+left+":"+top+":"+w+":"+h);
    this.windowObject.style.left		= startLeft+left+2;	//2包括边框1和间距1
    this.windowObject.style.top		= startTop+top;
    this.windowObject.style.height	= h;
    this.windowObject.style.width	= w;

    this.mediaObject.style.height	= h -g_videoWinStatusBarHeight;
    this.mediaObject.style.width	= w;
};


//设置通道名
MonitorWindow.prototype.setCamera	= function(camName)
{
    if(!this.windowObject) return;
    var channelNameTag = this.windowObject.getElementsByTagName("span")[1];
    channelNameTag.innerText	= camName;
}

//设置监控状态
MonitorWindow.prototype.setStatus	= function(name)
{
    if(!this.windowObject) return;
    var targetag = this.windowObject.getElementsByTagName("span")[2];
    targetag.innerText	= name;
}

//设置打开按钮的显示状态。 0表示隐藏，非0表示显示
MonitorWindow.prototype.setOpenButtonStatus	= function(s)
{
    if(!this.windowObject) return;
    var targetag = this.windowObject.getElementsByTagName("span")[3];
    if(s==0)
        targetag.style.display = 'none';
    else
        targetag.style.display = '';
}

//设置关闭按钮的显示状态。 0表示隐藏，非0表示显示
MonitorWindow.prototype.setCloseButtonStatus	= function(s)
{
    if(!this.windowObject) return;
    var targetag = this.windowObject.getElementsByTagName("span")[4];
    if(s==0)
        targetag.style.display = 'none';
    else
        targetag.style.display = '';
}


//------------------------------------多窗口控制全局函数
function changeScreenMulti(winNum) {
    var videoWinW	= 0;	//窗口宽度
    var videoWinH	= 0;	//窗口高度
    var	multiple = 1;
    if(winNum==9 || winNum==6)
    {
        multiple	= 3;
    }
    if(winNum==4 || winNum==8)
    {
        multiple	= 2;
    }
    if(winNum==16)
    {
        multiple	= 4;
    }
    videoWinW	= Math.floor(g_containerWidth/multiple);
    videoWinH	= Math.floor(g_containerHeight/multiple);//  - g_videoWinStatusBarHeight;
    for (var i = 0; i < g_arrMonitorWin.length; i++) {
        if(i<winNum){
            var left	= (i % multiple) * videoWinW;
            var top		= Math.floor(i/multiple) * videoWinH;
            g_arrMonitorWin[i].resizeTo(left,top,videoWinW-4,videoWinH);	//4,间距
            g_arrMonitorWin[i].show();
        }
        else
            g_arrMonitorWin[i].hide();
    }

    g_currentWindowNum	= winNum;
}
//设置窗口激活样式
function setFocusStyle(elm) {
    for (var i = 0; i < g_arrMonitorWin.length; i++) {
        var controller;
        if (g_arrMonitorWin[i] && g_arrMonitorWin[i].mediaObject) {
            controller = g_arrMonitorWin[i].mediaObject;
            if (controller == elm) {
                //controller.style.borderWidth = 1;
                controller.style.borderColor = "#ff0000";
            } else {

                //controller.style.borderWidth = 0;
                controller.style.borderColor = "#000000";

            }
        }
    }
}
function getWindowIndex(obj) {
    if (typeof g_arrMonitorWin != "undefined") {
        for (var i = 0; i < g_arrMonitorWin.length; i++) {
            if (g_arrMonitorWin[i] && g_arrMonitorWin[i].mediaObject && g_arrMonitorWin[i].mediaObject == obj) {
                return i;
            }
        }
    }
    return 0;
}

//分配事件
function dispatchEvent(index, name, status) {
    g_arrMonitorWin[index].monitor.doStatusEvent(name, status);
//	document.getElementById("currentTips").innerHTML = "[窗口"+(index+1) + "]" + "key="+name+";value="+status;
//    if(name!="durtime" && name!="bps" && name!="kbits" && name!="fps" && name!="register")
//        document.getElementById("currentTips").innerHTML = "[窗口"+(index+1) + "]" + "key="+name+";value="+status+ "<BR>" + document.getElementById("currentTips").innerHTML;
};

//XML事件
function dispatchXmlEvent(index,g_sessionID,g_resultCode,g_ResponsetXml) {
    g_arrMonitorWin[index].monitor.doXmlEvent(g_sessionID,g_resultCode,g_ResponsetXml);

    document.getElementById("currentTips").innerHTML = "[窗口"+(index+1) + "]" + "sessionid="+g_sessionID+";resultcode="+g_resultCode+"<BR>" + document.getElementById("currentTips").innerHTML;
    document.getElementById("textarea").value = g_ResponsetXml;
}

//下载任务状态和进度事件
function dispatchTaskEvent(index, g_taskID, g_taskState, g_errorCode, g_uploadSize, g_downSize)
{
    g_arrMonitorWin[index].monitor.doTaskEvent(g_taskID, g_taskState, g_errorCode, g_uploadSize, g_downSize);
    document.getElementById("currentTips").innerHTML = "[窗口"+(index+1) + "]" + "taskID="+g_taskID+";taskState="+g_taskState+";errorCode="+g_errorCode+";uploadSize="+g_uploadSize+";downSize="+g_downSize+"<BR>" + document.getElementById("currentTips").innerHTML;
    if(g_taskState == 0){
        document.getElementById("button1").value = "从服务器下载";
        document.getElementById("button2").value = "从设备下载";
    }
}

//在激活窗口打开目标通道视频
function inviteCam(camSipUri,camName)
{
    var cam1	= new CameraData("sip:"+camSipUri,camName);

    //判断是否在通话中
    var monitor	= g_arrMonitorWin[g_currentWindowIndex].monitor;

    if(	monitor.isOnline==Monitor.ONLINE && monitor.status!=Monitor.REGISTERED){//在线且非空闲
        if(monitor.getCamera().url!=("sip:"+camSipUri))
            monitor.bye();
    }

    monitor.setCamera(cam1);
    g_arrMonitorWin[g_currentWindowIndex].setCamera(camName);
    monitor.invite();

    //显示挂断按钮
    g_arrMonitorWin[g_currentWindowIndex].setCloseButtonStatus(1);
}


//打开指定窗口的视频（必须事先分配好通道）
function inviteCamByIndex(index)
{
    if( g_arrMonitorWin[index].monitor.getCamera()!=null ){
        g_arrMonitorWin[index].monitor.invite();
        //显示挂断按钮
        g_arrMonitorWin[g_currentWindowIndex].setCloseButtonStatus(1);
    }
    else{
        alert("未选择视频通道");
    }
}

//关闭指定窗口的视频预览
function byeCam(index)
{
    var monitor	= g_arrMonitorWin[index].monitor;
    if(	monitor.isOnline==Monitor.ONLINE)
    {
        g_arrMonitorWin[index].monitor.bye();
    }
}

//监控器状态发生变化
function onMonitorStatusChange(monitor)
{
    if(!(monitor instanceof Monitor)){
        return;
    }
    g_arrMonitorWin[monitor.index].setStatus(Monitor.getStatusName(monitor.status));

    if(monitor.status==Monitor.ONSESSON)	//通话中。显示关闭按钮
    {
        g_arrMonitorWin[monitor.index].setCloseButtonStatus(1);
    }

    if(monitor.status!=Monitor.ONSESSON)	//空闲
    {
        g_arrMonitorWin[monitor.index].setCloseButtonStatus(0);
        if(g_arrMonitorWin[monitor.index].monitor.getCamera() != null)	//分配了通道
            g_arrMonitorWin[monitor.index].setOpenButtonStatus(1);
    }
}

//监控器发生错误
function onMonitorErrors(monitor)
{
    onMonitorStatusChange(monitor);
}

function getElementLeft(element){
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null){
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}
function getElementTop(element){
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null){
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}