(function(){
	
	// 显示标题处理
	document.title = chrome.i18n.getMessage("optionName") + " - " + chrome.i18n.getMessage("extName")
	$("#showCols").html(chrome.i18n.getMessage("showCols"));
	$("#iconSize").html(chrome.i18n.getMessage("iconSize"));
	$("#speedManageName").html(chrome.i18n.getMessage("speedManageName"));
	$("#speedManageDesc").html(chrome.i18n.getMessage("speedManageDesc"));
	$("#speedManageLock").html(chrome.i18n.getMessage("speedManageLock"));
	$("#rankName").html(chrome.i18n.getMessage("rankName"));
	$("#rankDesc").html(chrome.i18n.getMessage("rankDesc"));
	$("#rankBtn").html(chrome.i18n.getMessage("rankBtn"));
	$("#uninstallName").html(chrome.i18n.getMessage("uninstallName"));
	$("#uninstallDesc").html(chrome.i18n.getMessage("uninstallDesc"));
	$("#otherName").html(chrome.i18n.getMessage("otherName"));
	$("#otherDesc").html(chrome.i18n.getMessage("otherDesc"));
	$("#showBadgeName").html(chrome.i18n.getMessage("showBadgeName"));
	$("#showBadgeDesc").html(chrome.i18n.getMessage("showBadgeDesc"));
	$("#showExtName").html(chrome.i18n.getMessage("showExtName"));
	$("#showExtNameDesc").html(chrome.i18n.getMessage("showExtNameDesc"));
	$("#rightMoreName").html(chrome.i18n.getMessage("rightMoreName"))
	$("#rightMoreDesc").html(chrome.i18n.getMessage("rightMoreDesc"))
	
	// 默认的图标大小文案
	$("#js-icon-size-show").html(chrome.i18n.getMessage("sizeNormal"));
	

	/**
	 * [showTips 显示提示]
	 */
	var __tips = $('#_TOOLS_STATUS__');
	function showTips(text){
		if(text){
			__tips.html(text).css({
				'opacity' : '1',
				'top' : '0px'
			});
			setTimeout(function(){
				__tips.css({
					'opacity' : '0',
					'top' : '-38px'
				});
			},1000);
		}
	}



	/**
	 * [选择扩展显示的列数]
	 */
	var setColumnTimer = null,
		setColumnShow = $('#js-sel-column-show'),
		setColumnRange = $('#js-sel-column');
	function setColumn(num){
		localStorage.setItem("_showColumn_", num);
		setColumnShow.html(num)
		if(setColumnTimer){
			clearTimeout(setColumnTimer);
			setColumnTimer = null;
		}
		setColumnTimer = setTimeout(function(){
			showTips(chrome.i18n.getMessage("tipSetSuc"));
		}, 600)
	}
	setColumnRange.on("input chnage", function(){
		setColumn($(this).val());
	});
	var _column_ = localStorage.getItem("_showColumn_");
	if(_column_){
		setColumnRange.val(_column_);
		setColumnShow.html(_column_)
	}


	
	var setIconSizeTimer = null,
		setIconShow = $('#js-icon-size-show'),
		setIconRange = $('#js-icon-size'),
		iconSizeShowText = {
			1: chrome.i18n.getMessage("sizeSmall"),
			2: chrome.i18n.getMessage("sizeNormal"),
			3: chrome.i18n.getMessage("sizeBig")
		};
	function setIconSize(num){
		localStorage.setItem("_showIconSize_", num);
		setIconShow.html(iconSizeShowText[num])
		if(setIconSizeTimer){
			clearTimeout(setIconSizeTimer);
			setIconSizeTimer = null;
		}
		setIconSizeTimer = setTimeout(function(){
			showTips(chrome.i18n.getMessage("tipSetSuc"));
		}, 600)
	}
	setIconRange.on("input chnage", function(){
		setIconSize($(this).val());
	});
	var _iconSize_ = localStorage.getItem("_showIconSize_");
	if(_iconSize_){
		setIconRange.val(_iconSize_);
		setIconShow.html(iconSizeShowText[_iconSize_])
	}


	// [扩展排序]清除rank存储数据
	$('.js-clear-rank').click(function(){
		localStorage.removeItem('_rankList_');
		showTips(chrome.i18n.getMessage("tipResetRank"));
	});




	// 遍历查询哪些功能被禁用
	$('[data-switch-id]').each(function(){
		var t = $(this),
			switch_id = t.data("switch-id"),
			id = "_switch_" + switch_id + "_";

		if(localStorage.getItem(id) === "close"){
			t.closest(".list").addClass("switch-btn-close")
		}
	})




	/**
	 * [点击switch开关开启或关闭该功能]
	 * @param  {[type]} '.switch-btn' [description]
	 * @return {[type]}               [description]
	 */
	$('.switch-btn').click(function(){
		var t = $(this),
			wrap = t.closest(".list"),
			id = "_switch_" + t.data("switch-id") + "_";

		// 切换开关样式
		wrap.toggleClass("switch-btn-close");
		showTips(chrome.i18n.getMessage("tipSetSuc"));

		if(wrap.hasClass("switch-btn-close")){
			localStorage.setItem(id, "close")
		}else{
			localStorage.removeItem(id)
		}
	})





	chrome.management.getAll(function(list){
		var listArr = [];
		var listArrLocked = getPluginsByLocked();
		for (var i = 0; i < list.length; i++) {
			var obj = list[i];

			// console.log(obj);

			// 将当前扩展排除在外
			if(obj.id === chrome.app.getDetails().id || obj.type === "theme"){
				continue;
			}


			// 统一处理图标
			var img = "";
			if(obj.icons){
				img = obj.icons[obj.icons.length-1].url;
			}

			// 查看是否已经被锁定
			var lockAttr = "";
			if(listArrLocked){
				if(listArrLocked[obj.id] == "1"){
					lockAttr = "locked";
				}
			}

			var objStr = '<li data-id="'+ obj.id +'" title="'+ obj.name +'" '+lockAttr+'><img src="'+ img +'" alt="'+ obj.name +'"></li>';

			// 插入到队列中
			listArr.push(objStr);
		};
		$('#_PLUGINS_LIST_').html(listArr.join(""));
	});



	/**
	 * [getPluginsByLocked 取出存储的锁定id列表]
	 * @return {[type]} [description]
	 */
	function getPluginsByLocked(){
		var idListStorage = localStorage.getItem("_lockList_");

		if(idListStorage){
			return JSON.parse(idListStorage);
		}else{
			return {};
		}
	}



	/**
	 * 点击扩展，进行解锁与锁定
	 * @param  {[type]} ){		var t             [description]
	 * @return {[type]}          [description]
	 */
	$('#_PLUGINS_LIST_').on("click", "li", function(){
		var t = $(this);
		var id = t.data('id');

		// 取出存储的锁定id列表
		var idListObj = getPluginsByLocked();

		// 判断当前扩展是否进行了加锁
		if(t.attr("locked") === undefined){	// 当前未被加锁
			t.attr("locked", "");
			idListObj[id] = "1";
		}else{
			t.removeAttr("locked");
			delete idListObj[id];
		}

		// 存储加锁内容
		localStorage.setItem("_lockList_", JSON.stringify(idListObj));
	})



	/**
	 * [选择图标右击操作]
	 * @return {[type]} [description]
	 */
	var rightClickStorage = localStorage.getItem("_rightClick_") || "uninstall";
	$("#js-rightclick").val(rightClickStorage).change(function(){
		var val = $(this).val();
		
		// 存储右击选项内容
		localStorage.setItem("_rightClick_", val);
		showTips(chrome.i18n.getMessage("tipSetSuc"));
	});
	
	
	$('[data-switch-id="show_badge"]').click(function(){
		setTimeout(function(){
			var status = localStorage.getItem("_switch_show_badge_");
			if(status === "close"){
				chrome.browserAction.setBadgeText({text: ""});
			}else{
				try{
					var unlockCount = 0;
					var lockListObj = JSON.parse(localStorage.getItem("_lockList_"));
					chrome.management.getAll(function(list) {
						var showListIdArr = [];
						for (var i = 0; i < list.length; i++) {
							var obj = list[i];

							// 将当前扩展排除在外
							if (obj.id !== chrome.app.getDetails().id && obj.type !== "theme" && obj.enabled) {
								if(lockListObj[obj.id] !== "1"){
									unlockCount++;
								}
							}
						}
						if(unlockCount === 0){
							chrome.browserAction.setBadgeText({text: ""});
						}else{
							chrome.browserAction.setBadgeBackgroundColor({color: "#f44336"})
							chrome.browserAction.setBadgeText({text: unlockCount+""});
						}
					});
				}catch(ex){}
			}
		}, 100);
	})
	
	
	// 演示demo
	var $playDemo = $("#playDemo");
	var playDemoMark = 0;
	$playDemo.click(function(){
		var t = $(this);
		var playObj = {
			"0": {
				width: 200,
				src: "icon/play-demo.png"
			},
			"1": {
				width: 600,
				src: "http://7lrypv.com1.z0.glb.clouddn.com/2017-02-08%2011_15_26.gif"
			}
		};
		var playCon = playDemoMark === 0 ? 1: 0;
		
		t.css("width", playObj[playCon].width).attr("src", playObj[playCon].src);
		
		playDemoMark = playCon;
	});
})();