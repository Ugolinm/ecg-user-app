<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager()
				updateManager.onCheckForUpdate(function (res) {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function () {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function (res) {
									if (res.confirm) {
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(function () {
							uni.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							})
						})
					}
				})
			} else {
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	// /* #ifndef APP-NVUE */
	// @import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}
	
	/* #endif */
	
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	
	
</style>
