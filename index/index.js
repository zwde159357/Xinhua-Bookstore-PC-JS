var data = JSON.parse(sessionStorage.getItem('data'));

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
		document.querySelector('.top-mid-left').innerHTML = `
			<span>因疫情影响，北京市物流暂无法保证时效，具体恢复时间待定，给您带来不便敬请谅解！</span>
			<a href="../login/login.html">请登录</a>
			<a href="../register/register.html">免费注册</a>
		`;
	}
})();

//购物车
(function() {
	var pcount = Cookies.get('pcount');
	var productCount = document.querySelector('span.product-count');
	productCount.innerText = typeof pcount === 'undefined'? 0 : pcount ;
})();

// 分类
var categoryList = data.categoryList;
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
	subUlEl.style.top = this.i*50 <= 600 ? `${ this.i*50 }px` : "300px";
	
	if(subCategoryList.length === 0){
		subUlEl.innerHTML = "<li>暂无相关信息</li>"
	} else {
		subCategoryList.forEach(function(item2,i) {
			var subLiEl = document.createElement('li');
			if(item2.id === 12)
				subLiEl.innerHTML = `<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>`;
			else if(item2.id === 16)
				subLiEl.innerHTML = `<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>`;
			else
				subLiEl.innerHTML = `<a href='#'>${ item2.name }</a>`;
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

// 排行榜
(function() {
	var rankingList = data.rankingList;
	var liEls = document.querySelectorAll('ul.ranking-mid-title>li');
	var ulEl = document.querySelector('ul.ranking-bottom');
	liEls.forEach(function(item) {
		if( item.className.indexOf('active') !== -1 ){
			rankingList.filter(function(item2) {  return item2.fid === parseInt(item.id); }).forEach(function(item2,i) {
				ulEl.innerHTML += `
					<li class=${ i === 0 ? 'active' : ''}>
						<a>
							<img src='${ item2.images }' alt=""/>
							<span class='sp-title'>${ item2.name }</span>
							<span class='sp-name'>${ item2.author }</span>
							<span class='sp-price'>￥${ item2.price.toFixed(2) }</span>
							<span class='sp-icon'>${ i+1 }</span>
						</a>
					</li>
				`;
				(function() {
					var lis = document.querySelectorAll('ul.ranking-bottom>li');
					 lis.forEach(function(item3) {
						 item3.onmouseover = function() {
							 lis.forEach(function(item4) {
								 item4.classList.remove('active');
							 });
							 this.classList.add('active');
						 };
					 });
				})();
			});
		}
		
		item.onmouseover = function() {
			document.querySelector('ul.ranking-mid-title>li.active').style.borderBottom = '';
			this.style.borderBottom = '2px solid #C62E2D';
			document.querySelectorAll('ul.ranking-mid-title>li').forEach(function(li) {
				li.classList.remove('active');
			});
			this.classList.add('active');
			ulEl.innerHTML = ``;
			rankingList.filter(function(item2) {  return item2.fid === parseInt(item.id); }).forEach(function(item2,i) {
				ulEl.innerHTML += `
					<li class=${ i === 0 ? 'active' : ''}>
						<a>
							<img src='${ item2.images }' alt=""/>
							<span class='sp-title'>${ item2.name }</span>
							<span class='sp-name'>${ item2.author }</span>
							<span class='sp-price'>￥${ item2.price.toFixed(2) }</span>
							<span class='sp-icon'>${ i+1 }</span>
						</a>
					</li>
				`;
			});
			(function() {
				var lis = document.querySelectorAll('ul.ranking-bottom>li');
				 lis.forEach(function(item3) {
					 item3.onmouseover = function() {
						 lis.forEach(function(item4) {
							 item4.classList.remove('active');
						 });
						 this.classList.add('active');
					 };
				 });
			})();
			
		};
	});
})();	

// 新华推荐
(function() {
	var recommendList = data.recommendList;
	var publicUlEl = document.querySelector('.recommend>ul.public-ul');
	var recommendLiEls = document.querySelectorAll('.recommend-top>ul>li');
	recommendLiEls.forEach(function(item) {
		if(item.className.indexOf('active') !== -1 ) {
			recommendList.filter(function(item2) { return parseInt(item.id) === item2.fid; }).forEach(function(item2) {
				publicUlEl.innerHTML += `
					<li>
						<a>
							<img src='${ item2.image }' alt='' />
							<span class='span-text'>${ item2.name }</span>
							<span class='span-price'>￥${ item2.price.toFixed(2) }</span>
							<span class='span-line'>￥${ item2.prev.toFixed(2) }</span>
						</a>
					</li>
				`;
			});
		}
		item.onclick = function() {
			document.querySelector('.recommend-top>ul>li.active').style.borderBottom = '';
			item.style.borderBottom = '2px solid  #1E1E1E';
			publicUlEl.innerHTML = ``;
			document.querySelector('.recommend-top>ul>li.active').className = '';
			this.className = 'active';
			recommendList.filter(function(item2) { return parseInt(item.id) === item2.fid; }).forEach(function(item2) {
				publicUlEl.innerHTML += `
					<li>
						<a>
							<img src='${ item2.image }' alt='' />
							<span class='span-text'>${ item2.name }</span>
							<span class='span-price'>￥${ item2.price.toFixed(2) }</span>
							<span class='span-line'>￥${ item2.prev.toFixed(2) }</span>
						</a>
					</li>
				`;
			});
		};
	});
})();

// 导航栏
(function() {
	var topAreas = [];
	var parts = document.querySelectorAll('.part');
	var partNavs = document.querySelectorAll('.part-nav>ul>li');
	var navEl = document.querySelector('.return-top');
	var scrollTimer = null;
	var scrollTimer1 = null;
	imagesLoaded(document.body,function() {
		parts.forEach(function(item,i) {
			//获取区域
			var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
			topAreas.push(Math.floor(nowTop + item.getBoundingClientRect().top));
		});
	});
	
	function scroll(top) {
		var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
		var diffTop = top -nowTop;
		if(Math.abs(diffTop)<= 30) {
			window.scrollTo(0,top);
			setTimeout(function() {
				clearInterval(scrollTimer);
				scrollTimer = null;
				clearInterval(scrollTimer1);
				scrollTimer1= null;
			}, 20);
		}
		else {
			window.scrollTo(0, diffTop > 0 ? nowTop + 30 : nowTop -30);
		}
	}
	
	partNavs.forEach(function(item, i) {
		item.i = i;
		item.onclick = function() {
			//如果已经激活，则返回
			if(this.className === 'active') return;
			//如果上个任务还没结束，则直接结束上个滚动任务，开始最新的命令
			if(scrollTimer !== null) {
				clearInterval(scrollTimer);
				scrollTimer = null;
			}
			if(scrollTimer1 !== null) {
				clearInterval(scrollTimer1);
				scrollTimer1 = null;
			}
		
			partNavs.forEach(function(item2) { item2.className = '' });
			this.className = 'active';
			var top = topAreas[this.i];
			//滑动到
			scrollTimer = setInterval(function() { scroll(top); }, 10);
		}
	});
	
	navEl.onclick = function() {
		if(scrollTimer !== null) {
			clearInterval(scrollTimer);
			scrollTimer = null;
		}
		if(scrollTimer1 !== null) {
			clearInterval(scrollTimer1);
			scrollTimer1 = null;
		}
		
		var top = 0; 
		scrollTimer1 = setInterval(function() { scroll(top); }, 10);
		
	};
	
	window.onmousewheel = function() {
		//如果滚动鼠标滚轮时，存在左边点击激活的滚动任务时，将滚动任务取消
		if(scrollTimer) { clearInterval(scrollTimer); scrollTimer = null; }
		if(scrollTimer1) { clearInterval(scrollTimer1); scrollTimer1 = null; }
	};			
	
	//监听窗口滚动事件
	window.onscroll = function() {
		//情况一 点击左边出发的滚动，不做处理
		if(scrollTimer) return;
		
		if(scrollTimer1) {
			var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
			for(var i = topAreas.length - 1; i >= 0; i--) {
				if(nowTop >= topAreas[i]) break;
			}
			//循环结束后i值非常关键
			partNavs.forEach(function(item) { item.className = ''; });
			if(i >= 0) partNavs[i].className = 'active';
		};
		
		//情况二：滚动鼠标滚轮触发的滚动，要联动左边的激活状态
		var nowTop = document.documentElement.scrollTop || document.body.scrollTop;

		//for循环算出哪个part正处于激活
		for(var i = topAreas.length - 1; i >= 0; i--) {
			if(nowTop >= topAreas[i]) break;
		}
		//循环结束后i值非常关键
		partNavs.forEach(function(item) { item.className = ''; });
		if(i >= 0) partNavs[i].className = 'active';
		if(nowTop > topAreas[0]) {
			document.querySelector('.part-nav').classList.add('active');
		}
		else {
			document.querySelector('.part-nav').classList.remove('active');
		}
	};
	
})();