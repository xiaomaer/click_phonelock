var openlock = (function() {
	var doc = document,
		list = doc.getElementById("list"),
		info = doc.getElementById("info"),
		show = doc.getElementById("show"),
		currtarget = "", //当前鼠标按下元素或上一个鼠标移动元素
		istouch = false, //判断鼠标是否按下，假如不判断是否鼠标按下，就会出现，鼠标随意移动就会画线，并且不可以判断密码是否正确等，因为鼠标不按下就没有mouseup事件
		pwd = "", //保存密码
		targets = [], //保存mousedown到mouseup之间的所有li元素
		startX, startY, endX, endY,
		count,
		xys = [{
			x: 50,
			y: 85
		}, {
			x: 150,
			y: 85
		}, {
			x: 250,
			y: 85
		}, {
			x: 50,
			y: 185
		}, {
			x: 150,
			y: 185
		}, {
			x: 250,
			y: 185
		}, {
			x: 50,
			y: 285
		}, {
			x: 150,
			y: 285
		}, {
			x: 250,
			y: 285
		}];
	//判断类是否存在

	function hasClass(elem, cname) {
			return elem.className.match(new RegExp("(\\s|^)" + cname + "(\\s|$)"));
		}
		//添加类

	function addClass(elem, cname) {
			if (!hasClass(elem, cname)) {
				elem.className += " " + cname;
			}
		}
		//移除或替换类

	function replaceClass(elem, cname, newname) {
		if (hasClass(elem, cname)) {
			elem.className = elem.className.replace(new RegExp("(\\s|^)" + cname + "(\\s|$)"), " " + newname);
		}
	}

	function removeClass(elem, cname) {
			if (hasClass(elem, cname)) {
				elem.className = elem.className.replace(new RegExp("(\\s|^)" + cname + "(\\s|$)"), "");
			}
		}
		//画线

	function drawLine(sx, sy, ex, ey) {
			if (sx == ex) //竖线
			{
				if (sy > ey) //如果开始节点的y坐标大于结束节点的y坐标，则将两者位置互换
				{
					var temp = sy;
					sy = ey;
					ey = temp;
				}
				var elemy = document.createElement("div");
				elemy.className = "line";
				elemy.style.width = "10px";
				elemy.style.height = Math.abs(ey - sy) + "px";
				elemy.style.left = (sx - 5) + "px";
				elemy.style.top = (sy + 5) + "px";
				show.appendChild(elemy);
			} else if (sy == ey) //横线
			{
				if (sx > ex) //如果开始节点的x坐标大于结束节点的x坐标，则将两者位置互换
				{
					var temp = sx;
					sx = ex;
					ex = temp;
				}
				var elemx = document.createElement("div");
				elemx.className = "line";
				elemx.style.width = Math.abs(ex - sx) + "px";
				elemx.style.height = 10 + "px";
				elemx.style.left = sx + "px";
				elemx.style.top = sy + "px";
				show.appendChild(elemx);
			} else { //斜线
				//起点坐标大于终点坐标就互换坐标
				if (sx > ex) //如果开始节点的x坐标大于结束节点的x坐标，则将两者位置互换
				{
					var tempx = sx;
					sx = ex;
					ex = tempx;
					var tempy = sy;
					sy = ey;
					ey = tempy;
				}
				var feq = ((sy - ey) / (sx - ex)).toFixed(2),
					radian = Math.atan(feq),
					angle = radian * 180 / Math.PI,
					len = Math.sqrt(Math.pow((sy - ey), 2) + Math.pow((sx - ex), 2)),
					mytop = sy + len / 2 * Math.sin(radian),
					myleft = sx - len / 2 * (1 - Math.cos(radian));
				var tmp = document.createElement("div");
				tmp.className = "line";
				tmp.style.width = len + "px";
				tmp.style.height = "10px";
				tmp.style.left = myleft + "px";
				tmp.style.top = mytop + "px";
				tmp.style.transform = "rotate(" + angle + "deg)";
				show.appendChild(tmp);
			}
			startX = endX;
			startY = endY;
		}
		//鼠标按下事件

	function handlebg(event) {
		var e = event || window.event,
			target = e.target || e.srcElement; //事件目标
		e.preventDefault();
		istouch = true; //该事件触发了
		if (target.tagName.toLowerCase() === "li") { //事件目标是li
			addClass(target, "right"); //li背景背景变白，边框显示
			currtarget = target; //记录按下目标
			pwd = target.getAttribute("data-key"); //获取组成密码的值
			targets.push(target); //保存事件目标
			count = parseInt(pwd);
			startX = xys[count].x;
			startY = xys[count].y;
		}
		if (target.tagName.toLowerCase() === "div") { //事件目标为div时
			target = target.parentElement; //获取父级元素li
			addClass(target, "right");
			currtarget = target;
			pwd = target.getAttribute("data-key");
			count = parseInt(pwd);
			startX = xys[count].x;
			startY = xys[count].y;
			targets.push(target);
		}
	}

	function handlemove(event) {
		var e = event || window.event,
			target = e.target || e.srcElement;
		//鼠标移动到li上，并且已触发mousedown事件
		if (target.tagName.toLowerCase() === "li" && istouch) {
			//mousedown事件的目标不是li
			if (currtarget === "") {
				addClass(target, "right"); //li背景背景变白，边框显示
				currtarget = target; //记录按下目标
				pwd = target.getAttribute("data-key"); //获取组成密码的值
				count = parseInt(pwd);
				startX = xys[pwd].x;
				startY = xys[pwd].y;
				targets.push(target); //保存事件目标
			} else { //mousedown事件的目标是li或mousemove已经移动了一次并事件目标为li
				if (target !== currtarget) { //鼠标移动事件目标和上一个事件目标不一致
					addClass(target, "right");
					count = target.getAttribute("data-key");
					pwd += count;
					currtarget = target;
					targets.push(target);
					count = parseInt(count);
					endX = xys[count].x;
					endY = xys[count].y;
					drawLine(startX, startY, endX, endY);

				}
			}

		}
	}

	function handle(event) {
		//判断密码是否正确，如果正确进入界面，否则大圆点变红，然后过几秒钟消失。
		if (pwd === "0126") {
			info.innerHTML = "密码正确！";
			var divs = doc.getElementsByClassName("line");
			setTimeout(function() {
				for (var i = 0, len = targets.length; i < len; i++) {
					removeClass(targets[i], "right");
				}
				for (var j = 0, len = divs.length; j < len; j++) {
					show.removeChild(divs[0]);
				}
				info.innerHTML = "";
				targets = [];
			}, 1000);
		} else {
			if (targets.length !== 0) {
				info.innerHTML = "密码错误！";
				var divs = doc.getElementsByClassName("line");
				for (var i = 0, len = targets.length; i < len; i++) {
					replaceClass(targets[i], "right", "err");
				}
				setTimeout(function() {
					for (var i = 0, len = targets.length; i < len; i++) {
						removeClass(targets[i], "err");
					}
					for (var j = 0, len = divs.length; j < len; j++) {
						show.removeChild(divs[0]);
					}
					info.innerHTML = "";
					targets = [];
				}, 1000);
			}

		}
		currtarget = "";
		istouch = false;
		pwd = "";
	}
	return {
		handlebg: handlebg,
		handlemove: handlemove,
		handle: handle
	};

})();

list.addEventListener("mousedown", openlock.handlebg, false);
list.addEventListener("mousemove", openlock.handlemove, false);
document.addEventListener("mouseup", openlock.handle, false);