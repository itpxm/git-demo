import {
	routerTo,
	cache,
	pageContext
} from './common.js'

const baseUrl = '';
const socketUrl="";

const IMG = baseUrl + '';
let ajaxTimes = 0; //请求维护变量，防止请求loading闪烁

function throwErr(res) {
		if(res.data.message.indexOf('登录')!=-1){
			uni.login({
				provider: 'weixin',
				success: res1 => {
					post(`/index/smapp/base/login?code=${res1.code}`).then(res2 => {
						if(res2.newUser){
							cache.put('sessionId',null);.
							uni.showModal({
								confirmColor:'#1677FF',
								content:'请注册后使用小程序',
								confirmText:'去注册',
								success:res3=>{
									if(res3.confirm){
										uni.switchTab({
											url:'/pages/mine/mine'
										})
									}else{
										uni.navigateBack({
											delta:1
										})
									}
								},
							})
						}else{
							cache.put('sessionId',res2.sessionId);
							uni.reLaunch({
								url:pageContext.get().$page.fullPath
							})
						}
					})
				}
			});
		}else{
			uni.showModal({
				content:res.data.message,
				confirmColor:'#1677FF',
				showCancel:false,
				success:res1=>{
					if(res.data.message.indexOf('不存在')!=-1){
						uni.navigateBack({
							delta:1
						})
					}
				},
			})
		}
}
const get = (url, data, showLoading = true) => {
	ajaxTimes++
	if (showLoading) {
		uni.showLoading({
			mask: true,
			title: '加载中',
		})
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request({
			url: baseUrl + url,
			data: data,
			method: 'GET',
			header: {
				'X-Requested-With': 'XMLHttpRequest',
				"Accept": "application/json",
				"Content-Type": 'application/json',
				'sessionId': cache.get('sessionId')
			},
			success: function(res) {
				if (res.data.success) {
					resolve(res.data.data);
				} else {
					throwErr(res)
					reject(res.data)
				}
			},
			fail: function(err) {
				reject(err)
			},
			complete: function() {
				ajaxTimes--;
				if (ajaxTimes == 0) {
					uni.hideLoading();
				}
			},
		})
	})
	return promise
};



const post = (url, data, showLoading = true) => {
	ajaxTimes++
	if (showLoading) {
		uni.showLoading({
			mask: true,
			title: '加载中',
		})
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request({
			url: baseUrl + url,
			data: data,
			method: 'POST',
			header: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json',
				'sessionId': cache.get('sessionId')
			},
			dataType: 'json',
			success: function(res) {
				if (res.data.success) {
					resolve(res.data.data);
				} else {
					throwErr(res)
					reject(res.data);
				}
			},
			fail: function(err) {
				reject(err)
			},
			complete: function(res) {
				ajaxTimes--;
				if (ajaxTimes == 0) {
					uni.hideLoading();
				}
			},
		})
	})
	return promise
};


export {
	get,
	post,
	baseUrl,
	socketUrl,
	IMG
}
