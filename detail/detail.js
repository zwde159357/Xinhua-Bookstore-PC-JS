// 商品id
var did = parseInt(window.location.search.slice(window.location.search.indexOf('=')+1));
var data = JSON.parse(sessionStorage.getItem('data'));
var categoryList = data.categoryList;

// 头部
(function() {
	if(Cookies.get('user')) {
		document.querySelector('.top-mid-left').innerHTML = `
			<span>您好! <span class="user-name">${ Cookies.get('user') }  </span>因疫情影响，北京市物流暂无法保证时效，具体恢复时间待定，给您带来不便敬请谅解！</span>
			<a href="#" class='exit-login'>退出登录</a>
		`;
		document.querySelector('a.exit-login').onclick = function() {
			Cookies.remove('user');
			Cookies.remove('pcount');
			window.location.href = window.location.href;
		};
	}
	else
	{
		Cookies.set('backUrl',window.location.href);
		document.querySelector('.top-mid-left').innerHTML = `
			<span>因疫情影响，北京市物流暂无法保证时效，具体恢复时间待定，给您带来不便敬请谅解！</span>
			<a href="../login/login.html">请登录</a>
			<a href="../register/register.html">免费注册</a>
		`;
	}
})();

// 购物车件数
var pcount = 0;

// 分类
categoryList.filter(function(item) { return item.fid === 0; }).forEach(function(item,i) {
	this.i = i;
	var liEl = document.createElement('li');
	liEl.className = 'v-middle';
	liEl.innerHTML = `
		<a href='#'>
			${ item.name }
		</a>
	`;
	
	//一级菜单下面小标题
	var tCategoryList = categoryList.filter(function(item2) { return item2.tid; });
	var tUlEl = document.createElement('ul');
	tUlEl.className = 'category-bott';
	tCategoryList.filter(function(item2) { return item2.tid === item.id; }).forEach(function(item2) {
		tUlEl.innerHTML += `
			<li>
				<a href='#'>${ item2.name }</a>
			</li>
		`;
	});

	
	var subCategoryList = categoryList.filter(function(item2) { return item2.fid === item.id; });
	var subUlEl = document.createElement('ul');
	subUlEl.className = 'category-sub';
	subUlEl.style.top = this.i*50 <= 450 ? `${ this.i*50 }px` : "300px";
	if(subCategoryList.length === 0){
		subUlEl.innerHTML = "<li>暂无相关信息</li>"
	}
	else {
		subCategoryList.forEach(function(item2,i) {
			var subLiEl = document.createElement('li');
			if(item2.id === 12) {
				subLiEl.innerHTML = `
					<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>
				`;
			}
			else if(item2.id === 16) {
				subLiEl.innerHTML = `
					<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>
				`;
			}
			else {
				subLiEl.innerHTML = `
					<a href='#'>${ item2.name }</a>
				`;
			}
			var minUlEl = document.createElement('ul');
			categoryList.filter(function(item3) { return item3.fid === item2.id; }).forEach(function(item3) {
				minUlEl.innerHTML += `
					<li>
						<a href='#'>${ item3.name }</a>
					</li>
				`;
			});
			subLiEl.appendChild(minUlEl);
			subUlEl.appendChild(subLiEl);
		});
	}
	liEl.appendChild(tUlEl);
	liEl.appendChild(subUlEl);
	document.querySelector('ul.category-main').appendChild(liEl);
});

// 根据id获取要展示商品的详细信息
var count = 1;

// 数量控制
(function() {
	var btnDecreasse = document.querySelector('span.btn-decrease');
	var btnIncreasse = document.querySelector('span.btn-increase');
	var inputCount = document.querySelector('input.count');
	var maxCount = 6;
	btnDecreasse.onclick = function() {
		// 不管+能不能用,想让+可用
		btnIncreasse.classList.remove('disabled');
		btnDecreasse.classList.toggle('disabled', count === 1);
		if(count === 1) return;
		inputCount.value = --count;
		
	};
	btnIncreasse.onclick = function() {
		// 不管-能不能用,想让-可用
		btnDecreasse.classList.remove('disabled');
		btnIncreasse.classList.toggle('disabled', count === maxCount);
		if(count === maxCount) return;
		inputCount.value = ++count;
	};

	inputCount.onfocus = function() {
		this.oldValue = this.value;
	};
	
	inputCount.onkeyup = function(e) {
		if((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) {
			this.value = this.oldValue;
		}
		else this.oldValue = this.value;
	};
	
	inputCount.onblur = function() {
		if(this.value.length === 0) this.value = 1;
		if(parseInt(this.value) < 1) this.value = 1;
		if(parseInt(this.value) > maxCount) this.value = maxCount;
		count = parseInt(this.value);
		btnDecreasse.classList.toggle('disabled', count === 1);
		btnIncreasse.classList.toggle('disabled', count === maxCount);
	};
})();

// 先登录
var userName = Cookies.get('user');
data.cartList.filter(function(item) {
		return item.name === userName;
	}).forEach(function(item) { pcount += item.count ; });
Cookies.set('pcount', pcount);

// 新华书店
(function() {
	// 加入购物车
	document.querySelector('span.btn-buy').onclick = function() {
		// 判断用户有没有登录,若无则跳转登录页面
		// cookies只能默认存4k左右的东西,生命周期可以控制，若不控制则浏览器关闭就消失,storage则存5M左右的东西
		if(typeof userName === 'undefined') {
			// 代码跳转之前 将当前页面路径放回cookies中，以便登录后返回
			Cookies.set('backUrl',window.location.href);
			// 代码跳转页面
			window.location.href = '../login/login.html';
		}
		
		// 如果登录了
		// 数据整体取出,修改后再放回
	    var data = JSON.parse(sessionStorage.getItem('data'));
		//数组findindex()找到了返回下标，没有则返回-1
		var index = data.cartList.findIndex(function(item) {
			return item.name === userName && item.pid === did;
		});
		// -1味这个商品当前用户对应的购物城中没有该商品
		if(index === -1) {
			var obj = {
				id: data.cartList[data.cartList.length - 1].id + 1,
				name: userName,
				pid: did,
				count: count,
			};
			data.cartList.push(obj);
		} else {
			if(data.cartList[index].count + count > 6) {
				Message.alert('已达购买上限');
				return;
			}
			data.cartList[index].count += count;
		}
		
		document.querySelector('span.text>span.product-count').innerText = pcount + count;
		Cookies.set('pcount', pcount+count);
		// window.location.href = window.location.href;
		sessionStorage.setItem('data',JSON.stringify(data));
		Message.alert('成功加入购物车');
	};
	
})();

// 搜索结果
(function() {
	var product = data.productList.find(function(item) { return item.id === did; }),
		list = data.categoryList.find(function(item) { return item.id === product.cid; }),
		category = data.categoryList.find(function(item) { return item.id === list.fid; }),
		result = document.querySelector('.end-result>.result'),
		resultSecond = result.querySelector('span.result-second'),
		resultThird = result.querySelector('span.result-third'),
		resultFourth = result.querySelector('span.result-fourth');
	resultFourth.innerText = product.name;
	resultThird.innerText = list.name;
	resultSecond.innerText = category.name;
})();

// 重要右边部分
(function() {
	var product = data.productList.find(function(item) { return item.id === did; }),
		detailContent = document.querySelector('.detail-content'),
		detailTitle = detailContent.querySelector('.detail-title'),
		detailAuthorSchool = detailContent.querySelector('.detail-author>a.school'),
		detailAuthorAuthor = detailContent.querySelector('.detail-author>a.author'),
		detailPriceB = detailContent.querySelector('.detail-price>.sell span.sell-b'),
		detailPriceD = detailContent.querySelector('.detail-price>.sell span.sell-d');
	detailTitle.innerText = product.name;
	detailAuthorSchool.innerText = product.plait;
	detailAuthorAuthor.innerText = product.book;
	detailPriceB.innerText += product.price.toFixed(2);
	detailPriceD.innerText += product.prev.toFixed(2);
})();

// 重要左边部分
(function() {
	var product = data.productList.find(function(item) { return item.id === did; });
	var big = product.big.split(',');
	var small = product.small.split(',');
	var ulBigImage = document.querySelector('ul.big-image-list');
	big.forEach(function(item,i) {
		ulBigImage.innerHTML += `
			<li class='${ i === 0 ? 'show' : '' }'>
				<div class='image-wrap'>
					<img src='${ item }' alt='' />
				</div>
			</li>
		`;
	});
	var ulImage = document.querySelector('ul.image-list');
	small.forEach(function(item) {
		ulImage.innerHTML += `
			<li>
				<div class='image-wrap'>
					<img src='${ item }' alt='' />
				</div>
			</li>
		`;
	});
})();

// 放大镜
(function() {
	var pSpanEl = document.querySelector('span.prev');
	var nSpanEl = document.querySelector('span.next');
	var ulEl = document.querySelector('.image-list-wrap>.image-list');
	var liEls = ulEl.querySelectorAll('li');
	var count = 0;
	
	pSpanEl.onclick = function() {
		if(count === 0) return;
		else {
			count = count - 1;
			ulEl.style.transform = `translateX(-${ count*25 }%)`;
		}
	};
	nSpanEl.onclick = function() {
		if(count >= liEls.length - 4) return;
		else {
			count = count + 1;
			ulEl.style.transform = `translateX(-${ count*25 }%)`;
		}
	};
	
	liEls.forEach(function(item,i) {
		item.i = i;
		item.onclick = function() {
			document.querySelector('ul.big-image-list>li.show').className = '';
			document.querySelectorAll('ul.big-image-list>li')[this.i].className = 'show';
		};
	});
	
	document.querySelector('.big-image-list-wrap').onmouseover = function() {
		var zoomEl = this.querySelector('.zoom');
		var zoomBigEl = this.parentNode.querySelector('.zoom-big');
		var imagePath = this.querySelector('li.show img').src;
		zoomBigEl.style.backgroundImage = `url(${ imagePath })`;
		zoomEl.style.backgroundImage = `url(${ imagePath })`;
		var width = this.getBoundingClientRect().width;  //width包含边框
		var height = this.getBoundingClientRect().height;
		//求比率		
		var ratio = width / zoomEl.getBoundingClientRect().width;
		zoomEl.style.backgroundSize = `${ width - 2 }px ${ height - 2 }px`;
		zoomBigEl.style.backgroundSize = `${ ratio * width - 2 }px ${ ratio * height - 2 }px`;
	};
	
	//鼠标移动事件
	document.querySelector('.big-image-list-wrap').onmousemove = function(e) {
		var zoomEl = this.querySelector('.zoom');
		var zoomBigEl = this.parentNode.querySelector('.zoom-big');
		var x,
			y,
			mouseX = e.clientX - this.getBoundingClientRect().left,  //e.offsetX存在兼容性问题
			mouseY = e.clientY - this.getBoundingClientRect().top,
			minX = zoomEl.getBoundingClientRect().width / 2,
			minY = zoomEl.getBoundingClientRect().height / 2,
			maxX = this.getBoundingClientRect().width - minX,
			maxY = this.getBoundingClientRect().height - minY;
		var ratio = this.getBoundingClientRect().width / zoomEl.getBoundingClientRect().width;
		if(mouseX <= minX) x = 0;
		else if(mouseX >= maxX) x = maxX - minX;
		else x = mouseX - minX;
		
		if(mouseY <= minY) y = 0;
		else if(mouseY >= maxY) y = maxY - minY;
		else y = mouseY - minY;
		
		zoomEl.style.left = `${ x }px`;
		zoomEl.style.top = `${ y }px`;
		zoomEl.style.backgroundPosition = `-${ x }px -${ y }px`;
		zoomBigEl.style.backgroundPosition = `-${ ratio * x }px -${ ratio * y }px`;
	};
})();

// 相关推荐
(function() {
	var recommendUl = document.querySelector('.recommend-end>ul.public-ul');
	data.recommendList.filter(function(item) { return item.pid === did; }).forEach(function(item) {
		recommendUl.innerHTML += `
			<li>
				<a href="#">
					<img src="${ item.image  }" alt="" />
					<span class="span-text">${ item.name }</span>
					<span class="span-price">￥${ item.price.toFixed(2) }</span>
				</a>
			</li>
		`;
	});
})();

//最后商品中的新华推荐
(function() {
	var recommendList = data.recommendList;
	var publicUl = document.querySelector('.end-box>.end-left>.content>ul');
	for(var i = 0; i < 6; i++) {
		var randomItem = recommendList[Math.floor(Math.random() * recommendList.length)];
		publicUl.innerHTML += `
			<li>
				<a href="#">
					<img src="${ randomItem.image }" alt="" />
					<span class="name">${ randomItem.name }</span>
					<span class="price">￥${ randomItem.price.toFixed(2) }</span>
				</a>
			</li>
		`;
	}
})();

// 动态展示最后商品中的数据
(function() {
	var div = document.querySelector('.end-right>.middle');
	var productList = data.productList;
	var product = productList.find(function(item) { return item.id = did; });
	var arr = product.end.split(',');
	div.innerHTML = `
		<div class="middle-a public active">
			<div class="middle-a-top">
				<img src="${ arr[0] }" alt="" />
			</div>
			<div class="middle-a-bottom">
				<img src="${ arr[1] }" alt="" />
				<img src="${ arr[2] }" alt="" />
			</div>
		</div>
		
		<div class="middle-b public">
			<div class="middle-b-content">
				<img src="${ arr[3] }" alt="" />
				<img src="${ arr[4] }" alt="" />
				<img src="${ arr[5] }" alt="" />
				<img src="${ arr[6] }" alt="" />
			</div>
		</div>
		
		<div class="middle-c public">
			<div class="middle-c-content">
				<img src="${ arr[7] }" alt="" />
			</div>
		</div>
		
		<div class="middle-d public">
			<div class="middle-d-content">
				<i class="iconfont icon-pingjia"></i>
				<span>该商品还没有评价~</span>
			</div>
		</div>
	`;
})();

//最后商品中的选项卡切换
(function() {
	var lis = document.querySelectorAll('.end-right>.top>ul>li');
	var div = document.querySelectorAll('.end-right>.middle>.public');
	lis.forEach(function(li,i) {
		li.onclick = function() {
			document.querySelector('.end-right>.top>ul>li.active').classList.remove('active');
			this.classList.add('active');
			document.querySelector('.end-right>.middle>.public.active').classList.remove('active');
			div[i].classList.add('active');
		};
	});
})();


var navEl = document.querySelector('.return-top');
var scrollTimer = null;
function scroll(top) {
	var newTop = document.documentElement.scrollTop || document.body.scrollTop;
	var diff = newTop-top;
	if(Math.abs(diff) <= 30) {
		window.scrollTo(0, top);
		clearInterval(scrollTimer);
		scrollTimer = null;
	}
	else {
		window.scrollTo(0, diff > 0 ? diff - 30 : diff + 30);
	}
}

navEl.onclick = function() { 
	var top = 0;
	scrollTimer = setInterval(function() { scroll(top); }, 10);
};

window.onmousewheel = function() {
	//如果滚动鼠标滚轮时，存在左边点击激活的滚动任务时，将滚动任务取消
	if(scrollTimer) { clearInterval(scrollTimer); scrollTimer = null; }
};		

//购物车
(function() {
	var pcount = Cookies.get('pcount');
	var productCount = document.querySelector('span.product-count');
	productCount.innerText = typeof pcount === 'undefined'? 0 : pcount ;
})();


























