
/*--------------------------------------摄像头对象----------------------------------------*/
function CameraData(cameraurl,name,permitValue) {
    this.url	= cameraurl;
    this.name	= name;
}

/*---------------------------------------监控器对象(控件)---------------------------------------------*/
function Monitor(serverIP,serverPort,username,password,activexObject,index,doStatusFunction,doErrorFunction) {
    this.serverIP	= serverIP;
    this.serverPort	= serverPort;
    this.username	    = username;			/* 监控员注册账号 */
    this.password	    = password;			/* 监控员注册密码 */
    this.controller	    = activexObject;	/* 控件对象 */
    this.index		    = index;			/* 在分屏中的序号，从1开始 */
    this.onStatusChange	= doStatusFunction;	/* 处理状态变化以后的外部函数指针 */
    this.onError	    = doErrorFunction;	/* 处理错误的外部函数指针 */



    /* 当前的camera对象 */
    this.camera	= null;

    /* 画面尺寸、帧率 */
    this.videoWidth		= 320;
    this.videoHeight	= 240;
    this.videoFps		= 25;

    /**
     * 记录用户的登录状态。
     *     Monitor.OFFLINE: 未登录
     *     Monitor.ONLINE:  已登录
     */
    this.isOnline	= Monitor.OFFLINE;

    /**
     *  会话状态跟踪
     *  -9,未登陆
     *  -1,正在登陆
     *	0,空闲（还未呼叫或者呼叫失败或者断开了）
     *	1,正在呼叫
     *	2,正在取消呼叫
     *	3,正在通话
     *	4,正在断开
     *	5,正在登出
     */
    this.status	= Monitor.UNREGISTERED;

    this.isAutoCall	= true;

    this.locationFlag = Monitor.LOCATION_OFF;	//是否在获取播放位置	
    this.recordingFlag = Monitor.RECORDING_OFF;	//是否在录像

    /**
     * 播放文件列表
     */
    this.playList = null;

    /**
     * 当前的播放时间
     * 如果是直播, 直接采用本地时间
     * 如果是回放, 定时调用接口取得回放录像的时间
     */
    this.currentVideoTime = 0;

    /**
     * 当前播放进度条控制录像的日期
     */
    this.currentDate = '';

    /* 最后的错误 */
    this.lastErrCode	= 0;
    this.lastErrString	= "";
}

Monitor.ONLINE 		 	= 1;	/* 在线 */
Monitor.OFFLINE 	 	= 0;	/* 离线 */

Monitor.UNREGISTERED 	= -9;	/* 未登录 */
Monitor.REGISTERING  	= -1;	/* 正在登录 */
Monitor.REGISTERED   	= 0;	/* 空闲（还未呼叫或者呼叫失败或者断开了）*/
Monitor.INVITING        = 1;	/* 正在呼叫 */
Monitor.CANCELINGINVITE = 2;	/* 正在取消呼叫 */
Monitor.ONSESSON 		= 3;	/* 通话中 */
Monitor.DOINGBYE 		= 4;	/* 正在断开 */
Monitor.UNREGISTERING 	= 5;	/* 正在登出 */

Monitor.RECORDING_ON = 1;	//正在录制
Monitor.RECORDING_OFF = 0;	//没有录制

Monitor.DOWNFILE_FINISH = 0;//下载完成

// 获取状态
Monitor.getStatusName = function(statusCode) {
    statusCode	= parseInt(statusCode, 10);
    switch(statusCode) {
        case Monitor.UNREGISTERED:
            return "未登录";
        case Monitor.REGISTERING:
            return "正在登录...";
        case Monitor.REGISTERED:
            return "空闲";
        case Monitor.INVITING:
            return "正在呼叫...";
        case Monitor.CANCELINGINVITE:
            return "正在取消呼叫...";
        case Monitor.ONSESSON:
            return "通话中";
        case Monitor.DOINGBYE:
            return "正在断开...";
        case Monitor.RECORD_PLAYPREV:
            return "正在登出...";
        default:
            return "未知";
    }
};


// 设置当前的camera。如果是更换，可以先调用bye方法关闭之前的摄像头
Monitor.prototype.setCamera  = function(cameraObject) {
    if (cameraObject instanceof CameraData) {
        this.camera	= cameraObject;
    } else {
//        alert("Invalid camera object");
        return false;
    }
    return true;
};
Monitor.prototype.getCamera  = function() {

    return this.camera;
};

// 设置控件对象
Monitor.prototype.setController = function(activexObject) {
    this.controller	= activexObject;
};


// register,发出注册
Monitor.prototype.register  = function(serverIP,serverPort) {
    try{
//        alert("register");
        this.controller.setServerInfo(serverIP,serverPort,"","");
        this.controller.SIPRegister(this.username,this.password,"MT",1,1);
        this.status	= Monitor.REGISTERING;
        this.onStatusChange(this);
    }catch(e){
        alert("控件初始化失败:" + e.message);
    }
};

//queryfiles,从存储服务器或设备上查询设备录像文件
Monitor.prototype.queryfiles = function(sessionID,targetSipID,RequestXml){
    //alert("sessionID:" + sessionID+"targetSipID:" + targetSipID+"RequestXml:" + RequestXml);
    if(this.isOnline = Monitor.ONLINE){
        this.controller.QueryDVRFiles(sessionID,targetSipID,RequestXml);
        this.onStatusChange(this);
    }
}

//downftpfiles,下载FTP服务器录像文件
Monitor.prototype.downftpfiles = function(taskID,ftpUrl,localDirPath,bFromBreakPoint){

    if(this.isOnline = Monitor.ONLINE){
        this.controller.StartDownFtpFile(taskID,ftpUrl,0,localDirPath,bFromBreakPoint);
        this.onStatusChange(this);
    }
}

//downdvrfiles 下载车载设备上录像文件
Monitor.prototype.downdvrfiles = function(taskID,nrdsSipID,dvrSipID,fileFullPath,localDirPath,bFromBreakPoint){
    if(this.isOnline = Monitor.ONLINE){
        this.controller.StartDownDvrFile (taskID,nrdsSipID,dvrSipID, fileFullPath,0,localDirPath,bFromBreakPoint);
        this.onStatusChange(this);
    }
}

Monitor.prototype.stopdowntask = function(taskID,bDelLocalFile){
    if(this.isOnline = Monitor.ONLINE){
        this.controller.StopDownTask (taskID,bDelLocalFile);
        this.onStatusChange(this);
    }
}

// invite,连接并打开监控视频
Monitor.prototype.invite	= function() {

    if (this.isOnline) {
        if(this.status==Monitor.ONSESSON) return;

        //this.controller.SIPInvite(this.camera.url,0);
        this.controller.SIPInvite_Encrypt(this.camera.url,0);
        this.status	= Monitor.INVITING;
        this.onStatusChange(this);
    } else {
        this.register(this.serverIP,this.serverPort);
        this.isAutoCall	= true;
        //alert("注册中"+this.serverIP+this.serverPort);
    }
};
// bye,关闭监控视频
Monitor.prototype.bye	= function() {
    this.controller.SIPBye(this.camera.url);
    this.status = Monitor.DOINGBYE;
    this.onStatusChange(this);
};

// 登出,退出用户会话，在bye之后
Monitor.prototype.unregister	= function() {
    if (this.isOnline == Monitor.ONLINE) {
        this.controller.SIPUnregister();
        this.status = Monitor.UNREGISTERING;
        this.isOnline = Monitor.OFFLINE;
        this.onStatusChange(this);
    }
};


/**
 * 开始录像
 * format是视频格式，包括：avi
 * filepath是存储完整路径，如：e:\test.avi
 */
Monitor.prototype.recordStart	= function(format,filepath) {

    this.controller.SIPRecord(filepath,this.camera.url, format);
    this.recordingFlag = Monitor.RECORDING_ON;
};

// 停止录像
Monitor.prototype.recordStop	= function() {
    this.controller.SIPStopRecord(this.camera.url);
    this.recordingFlag = Monitor.RECORDING_OFF;
};


/*-------------------事件处理 ------------------*/
Monitor.prototype.doStatusEvent	= function(name,status) {
    //alert(this.camera.name + ": " + name + " :"  +  status);
    switch (name) {
        case "register":	//等待处理register响应
            this.responseRegister(status);
            break;
        case "invite":		//等待处理invite响应
            this.responseInvite(status);
            break;
        case "bye":			//等待处理bye响应
            this.responseBye(status);
            break;
        case "notify":		//等待处理subscribe后的响应
            this.responseNotify(status);
            break;
        case "unregister":	//等待处理register响应
            this.responseUnregister(status);
            break;
        case "fps":
            break;

        default:
            break;
    }
};
//Xml事件处理
Monitor.prototype.doXmlEvent = function(sessionID, resultCode, ResponsetXml)
{

}

//下载任务状态和进度处理
Monitor.prototype.doTaskEvent = function(taskID, taskState, errorCode, uploadSize, downSize)
{
//	alert("staskID:"+taskID+";taskState:"+taskState+";errorCode:"+errorCode+";downSize"+downSize);
    if(taskState == 0){
        this.taskState = Monitor.DOWNFILE_FINISH;
        this.onStatusChange(this);
    }

}

// 处理注册以后的结果
Monitor.prototype.responseRegister = function(status) {
    if (status == 200) {	//注册成功
        this.isOnline = Monitor.ONLINE;
        this.status = Monitor.REGISTERED;
        this.onStatusChange(this);
//		this.bye();
        if(this.isAutoCall){
            this.invite();		//自动呼叫
            this.isAutoCall	= false;
        }
    } else if (status != 100) {	//认证失败，或者会话超时等
        this.lastErrString	= "注册失败或自动退出";
        this.status	= Monitor.UNREGISTERED;
        this.onStatusChange(this);
        this.onError(this);
    }
};
// 处理invite以后的结果
Monitor.prototype.responseInvite = function(status) {
    if (status == 200) {
        this.status = Monitor.ONSESSON;
        this.onStatusChange(this);
    } else if (status >= 300) {
        this.status = Monitor.REGISTERED;
        this.lastErrString	= "呼叫失败";
        this.onStatusChange(this);
        this.onError(this);
    }
};
// 处理bye以后的结果
Monitor.prototype.responseBye = function(status) {
    if (status == 200) {
        // if (this.status == Monitor.ONSESSON) {
        this.status	= Monitor.REGISTERED;
        this.onStatusChange(this);
        // }
    } else if (status >= 300) {
        this.lastErrString	="关闭失败";
        this.status	= Monitor.ONSESSON;
        this.onStatusChange(this);
        this.onError(this);
    }
};

Monitor.prototype.responseUnregister	= function(status) {
    if(status==200){
        this.isOnline	= Monitor.OFFLINE;
        this.status	= Monitor.UNREGISTERED;
        this.onStatusChange(this);
    } else if (status >= 300) {
        this.lastErrString	="登出失败";
        this.status = Monitor.REGISTERED;
        this.onStatusChange(this);
        this.onError(this);
    }
};


