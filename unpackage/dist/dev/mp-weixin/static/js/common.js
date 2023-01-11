import {
	baseUrl
} from './request.js'
/**
 * 获取当前页面的上下文
 * @param {Number}} index 默认为0，表示当前页面。1表示上一个页面。
 */
const getPageContext = (index = 0) => {
	const pages = getCurrentPages();
	let pageSize = pages.length;
	if (index > pageSize) {
		index = pageSize;
	}
	const pageContext = pages[pageSize - index - 1];
	return pageContext;
}
/**
 * 获得上一个页面的上下文，并执行回调。回调函数接受该上下文。
 * 主要用于两个页面之前的数据传递
 * @param {Function} callback 
 */
const pageContext_prev = (callback) => {
	let context = getPageContext(1);
	callback && callback(context);
}
const pageContext = {
	get: getPageContext,
	prev: pageContext_prev
}


/**
 * 放入缓存
 * @param {String} key 缓存的key
 * @param {String|Number|Boolean|Object|Array} value 缓存的值
 * @param {Number} expired 缓存有效期
 * @param {String} expiredType 缓存有效期的类型，单位可以是S（秒），MS（毫秒）,M（分钟），H（小时），T（次数）
 */
const cache_put = (key, value, expired, expiredType = 'S') => {
	uni.setStorageSync(key, value);
	if (expired && /^\d+$/g.test(expired)) {
		uni.setStorageSync(key + '_expired', {
			expired,
			expiredType,
			time: new Date().valueOf(),
			accessTimes: 0
		});
	}
}
/**
 * 取出指定key的缓存.在取出的时候会判断一次是否过期。
 * @param {String} key 
 */
const cache_get = (key) => {
	// 先获取一次缓存是否有过期规则
	let expiredReg = uni.getStorageSync(key + '_expired');
	if (expiredReg) {
		let expired = expiredReg.expired;
		let expiredType = expiredReg.expiredType;
		let time = expiredReg.time;
		let now = new Date().valueOf();
		// 是否过期
		let flag = false;
		//  过期单位是毫秒
		if (expiredType === 'MS') {
			if (time + expired < now) {
				flag = true;
			}
		}
		// 过期单位是秒
		if (expiredType === 'S') {
			if (time + expired * 1000 < now) {
				flag = true;
			}
		}
		// 过期单位是分钟
		if (expiredType === 'M') {
			if (time + expired * 1000 * 60 < now) {
				flag = true;
			}
		}
		// 过期单位是小时
		if (expiredType === 'H') {
			if (time + expired * 1000 * 60 * 60 < now) {
				flag = true;
			}
		}
		// 过期单位是次数
		if (expiredType === 'T') {
			let times = expiredReg.accessTimes;
			// 如果次数过期了，则标记状态
			if (times > expired) {
				flag = true;
			}
			// 如果次数相等，则表示是最后一次了，取出结果后要清理缓存
			if (times === expired) {
				uni.removeStorageSync(key);
				uni.removeStorageSync(key + '_expired');
				return uni.getStorageSync(key);
			}
			// 如果还没过期，则增加次数
			if (times < expired) {
				expiredReg.accessTimes++;
				uni.setStorageSync(key + '_expired', expiredReg)
			}
		}

		if (flag) {
			uni.removeStorageSync(key);
			uni.removeStorageSync(key + '_expired');
			return null;
		}
		return uni.getStorageSync(key);
	}
	return uni.getStorageSync(key);
}
/**
 * 移除指定key的缓存
 * @param {String} key 
 */
const cache_remove = (key) => {
	uni.removeStorageSync(key);
}
/**
 * 清空所有缓存
 */
const cache_clear = () => {
	uni.clearStorageSync();
}

const cache = {
	put: cache_put,
	get: cache_get,
	remove: cache_remove,
	clear: cache_clear,
}


//格式化时间
const formatTime = (date, type = 1) => {
	if (!(date instanceof Date)) {
		date = new Date(date)
	}
	const curDate = new Date()
	const curYear = curDate.getFullYear()
	const curMonth = curDate.getMonth() + 1
	const curDay = curDate.getDate()
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	// yyyy-MM-dd HH:mm:ss
	if (type === 1) {
		return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(
			':')
	}
	// yyyy-MM-dd
	if (type === 2) {
		return [year, month, day].map(formatNumber).join('-')
	}
	// yyyy-MM-dd HH:mm
	if (type === 3) {
		return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
	}
	// yyyy.MM
	if (type === 4) {
		return [year, month].map(formatNumber).join('.');
	}
	if (type === 5) {
		return year + '年' + month + '月'
	}
	if (type === 6) {
		return year + '年' + month + '月' + day + '日'
	}
	if (type === 7) {
		return [hour, minute].map(formatNumber).join(':')
	}
}
//格式化数字
const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}
/**
 * 经纬度计算距离
 * @param{Number|String}lat1,lng1,lat2,lng2**/
const space = (lat1, lng1, lat2, lng2) => {
	var radLat1 = lat1 * Math.PI / 180.0;
	var radLat2 = lat2 * Math.PI / 180.0;
	var a = radLat1 - radLat2;
	var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
		Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * 6378.137;
	s = Math.round(s * 10000) / 10000;
	return s.toFixed(2) // 单位千米
}
const uploadImage = (imgList, max = 1, btype) => {
	let promise = new Promise((resolve, reject) => {
		uni.chooseImage({
			count: max - imgList.length,
			success: (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				if ((imgList.length + tempFilePaths.length) <= max || max == 1) {
					let imgList = [];
					for (let i in tempFilePaths) {
						uni.uploadFile({
							url: baseUrl +
								`/index/attachment/upload${btype?'?btype='+btype:''}`,
							filePath: tempFilePaths[i],
							name: 'file',
							success: (uploadFileRes) => {
								let res = JSON.parse(uploadFileRes.data)
								if (res.error) {
									uni.showModal({
										content: res.message
									})
								} else {
									imgList.push(...res.data)
								}
								if (tempFilePaths.length == imgList.length) {
									resolve(imgList);
								}
							},
						})
					}
				} else {
					uni.showModal({
						content: `最多上传${max}张照片`,
						showCancel: false
					})
				}
			}
		});
	})
	return promise
}
/**
 * 支付*/
const pay = function(obj) {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: obj.timeStamp,
			nonceStr: obj.nonceStr,
			package: obj.package,
			signType: obj.signType,
			paySign: obj.paySign,
			success: function(res) {
				resolve(res)
			},
			fail: function(err) {
				reject(err)
			}
		});
	})
}
const toPath = function(path) {
	uni.navigateTo({
		url: path
	})
}

/** 获取年龄
 * @param 日期/时间戳
 */
const parseAge = function(res) {
	if (!res) {
		return 0;
	}
	var date;
	if (typeof res === 'number') {
		date = new Date(res);
	} else {
		date = res;
	}

	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var now = new Date();
	var nowYear = now.getFullYear();
	var nowMonth = now.getMonth();
	var nowDay = now.getDate();
	if (nowYear <= year) {
		return 0;
	}
	if (nowMonth < month) {
		return nowYear - year - 1;
	}
	if (nowMonth === month && nowDay < day) {
		return nowYear - year - 1;
	}
	if (nowMonth === month && nowDay >= day) {
		return nowYear - year;
	}
	return nowYear - year;
}

// 数据四舍五入格式化
const numberFix = function(value, length) {
	if (!value) {
		return '--';
	}
	if (!length) {
		length = 2;
	}

	var result = value * Math.pow(10, length);
	return parseInt(Math.round(result)) / Math.pow(10, length);
}
export {
	pageContext,
	cache,
	formatTime,
	space,
	uploadImage,
	toPath,
	pay,
	parseAge,
	numberFix,
	formatNumber
}
