<template>
	<view class="content">
		<MainHeader style="width: 100%;"></MainHeader>
		<u-button type="success" @click="btn">按钮</u-button>
		 <u-transition :show="show" mode='fade-up'>
		        <view class="transition"></view>
		    </u-transition>
		<view class="demo01">
			11
		</view>
		<view class="demo02">
			22
		</view>
	</view>
</template>

<script>
	import MainHeader from '@/components/MainHeader.vue';
	export default {
		components:{
			MainHeader,
		},
		data() {
			return {
				height:null,
				show: true,
			}
		},
		onLoad() {
			
		},
		onReady() {
			
		},
		methods: {
			btn(){
				// this.obtainHeight()
				// uni.pageScrollTo({
				// 	scrollTop: this.height,
				// 	duration: 300
				// });
				
				this.show = !this.show
				console.log(this.show)
			},
			obtainHeight(){
				let _this=this
				const query = uni.createSelectorQuery();
				query.select('.demo02').boundingClientRect() 
				query.selectViewport().scrollOffset() 
				query.exec(function(res){
					console.log(res[0].top)
					_this.height = res[0].top
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.demo01,.demo02{
		width: 100%;
		height: 1200rpx;
		background-color: pink;
	}
	.demo02{
		background-color: orange;
	}
	.transition{
		position: fixed;
		width: 200rpx;
		height: 200rpx;
		background-color: red;
	}
</style>
