<template>
	<view class="MainHeader">
		<view class="box" :style="{height:scrollerHeight+'rpx'}">
			<ul>
				<li v-for="(item,index) in num">{{item}}</li>
			</ul>
		</view>
		<scroll-view scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
			<view id="demo1" class="scroll-view-item uni-bg-red">A</view>
			<view id="demo2" class="scroll-view-item uni-bg-green">B</view>
			<view id="demo3" class="scroll-view-item uni-bg-blue">C</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"MainHeader",
		data() {
			return {
				scrollerHeight: '200',
				num: 6,
			};
		},
		methods:{
			scroll() {
				this.num = 3;
				this.scrollerHeight = '100'
			},
			upper() {
				setTimeout(() => {
				  this.num = 6;
				  this.scrollerHeight = '200'
				}, 200);
			},
		}
	}
</script>

<style lang="scss">
.box {
		padding-top: 20rpx;
		background-color: pink;
		width: 80%;
		display: flex;
		align-items: initial;

		ul {
			flex: 1;
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;

			li {
				width: 32%;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				background-color: #fff;
			}
		}
	}
	.scroll-Y {
		white-space: nowrap;
		width: 100%;
		height: 300rpx;
	}
	
	.scroll-view-item {
		width: 100%;
		height: 100%;
	}
</style>