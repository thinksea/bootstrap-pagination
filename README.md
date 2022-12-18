﻿# bootstrap-pagination
一个 javascript 分页控件，基于 bootstrap 样式。

![demo.png](images/demo.png)

---

###### version：1.0.0

+ 从此版本开始采用 bootstrap v5 样式
+ 重要的：与之前的版本不兼容，调用方式略作改动，具体请参考 demo.htm

###### version：0.6.3

+ 合并其他朋友（bsqql123，penggy）提交的修复内容：#1cf8317，#2c408e2

###### version：0.6.2

+ 1、支持当控件在移动设备中呈现时，页码输入控件的默认输入法为输入数字模式。

###### version：0.6.1

+ 1、支持分页尺寸选择框呈现内容格式化。

###### version：0.6.0

+ 1、支持选择分页尺寸。

###### version：0.5

+ 1、支持布局方案设置，控制元素排列顺序，显示/隐藏元素。

###### version：0.4.0

+ 1、支持通过程序代码设置参数。
+ 2、支持通过HTML元素属性设置参数。
+ 3、支持多个控件联动效果
+ 4、支持输入页码跳转
+ 5、支持元素隐藏/显示控制

---

# 开始使用控件

使用控件的第一步是在你的网页 HTML 代码中添加下面引用，更加详细的代码示例可以参考项目文件“demo.htm”。

```html
<link type="text/css" href="https://cdn.staticfile.org/twitter-bootstrap/5.2.3/css/bootstrap.min.css" rel="stylesheet" />
<script type="text/javascript" charset="utf-8" src="https://cdn.staticfile.org/twitter-bootstrap/5.2.3/js/bootstrap.bundle.min.js"></script>
<!--为了支持下拉菜单控件，如果此处引用“bootstrap.min.js”则需要在之前引入：https://cdn.staticfile.org/popper.js/2.11.6/umd/popper.min.js-->
<link type="text/css" href="bootstrap-pagination.min.css" rel="stylesheet" />
<script type="text/javascript" charset="utf-8" src="bootstrap-pagination.min.js"></script>
```

---

# 最简短代码示例

###### html代码

```html
<nav>
    <ul id="demo1" class="pagination">
    </ul>
</nav>
```

###### javascript代码

```javascript
<script type="text/javascript">
    var demo1 = new BootstrapPagination(document.getElementById("demo1"), {
        //记录总数。
        total: 101,
        //当前页索引编号。从其开始（从0开始）的整数。
        pageIndex: 2,
        //当分页更改后引发此事件。
        onPageChanged: function (sender: BootstrapPagination) {
            alert("page changed. pageIndex:" + sender.pageIndex + ",pageSize:" + sender.pageSize)
        },
    });
</script>
```

# 通过程序代码设置参数

###### html代码

```html
<nav>
    <ul id="demo2" class="pagination">
    </ul>
</nav>
```

###### javascript代码

```javascript
<script type="text/javascript">
    var demo2 = new BootstrapPagination(document.getElementById("demo1"), {
        layoutScheme: "lefttext,pagesizelist,firstpage,prevgrouppage,prevpage,pagenumber,nextpage,nextgrouppage,lastpage,pageinput,righttext",
        //记录总数。
        total: 101,
        //分页尺寸。指示每页最多显示的记录数量。
        pageSize: 20,
        //当前页索引编号。从其开始（从0开始）的整数。
        pageIndex: 2,
        //指示分页导航栏中最多显示的页索引数量。
        pageGroupSize: 5,
        //位于导航条左侧的输出信息格式化字符串
        leftFormateString: "本页{count}条记录/共{total}条记录",
        //位于导航条右侧的输出信息格式化字符串
        rightFormateString: "第{pageNumber}页/共{totalPages}页",
        //页码文本格式化字符串。
        pageNumberFormateString: "{pageNumber}",
        //分页尺寸输出格式化字符串
        pageSizeListFormateString: "每页显示{pageSize}条记录",
        //上一页导航按钮文本。
        prevPageText: "上一页",
        //下一页导航按钮文本。
        nextPageText: "下一页",
        //上一组分页导航按钮文本。
        prevGroupPageText: "上一组",
        //下一组分页导航按钮文本。
        nextGroupPageText: "下一组",
        //首页导航按钮文本。
        firstPageText: "首页",
        //尾页导航按钮文本。
        lastPageText: "尾页",
        //设置页码输入框中显示的提示文本。
        pageInputPlaceholder: "GO",
        //接受用户输入内容的延迟时间。单位：毫秒
        pageInputTimeout: 800,
        //分页尺寸列表。
        pageSizeList: [5, 10, 20, 50, 100, 200],
        //当分页更改后引发此事件。
        onPageChanged: function (sender: BootstrapPagination) {
            alert("page changed. pageIndex:" + sender.pageIndex + ",pageSize:" + sender.pageSize)
        },
    });
</script>
```

# 通过HTML元素属性设置参数

###### html代码

```html
<nav>
    <ul class="pagination demo3" data-total="101" data-pageindex="1" data-pagesize="20" data-pagegroupsize="5"
        data-leftformatestring="本页{count}条记录/共{total}条记录"
        data-rightformatestring="第{pageNumber}页/共{totalPages}页"
        data-pagenumberformatestring="{pageNumber}"
        data-pagesizelistformatestring="每页显示{pageSize}条记录"
        data-prevpagetext="上一页" data-nextpagetext="下一页"
        data-prevgrouppagetext="上一组" data-nextgrouppagetext="下一组"
        data-firstpagetext="首页" data-lastpagetext="尾页"
        data-pageinput-placeholder="GO" data-pageinput-timeout="800"
        data-pagesizelist="[5, 10, 20, 50, 100, 200]"
        data-onpagechanged='alert("page changed. pageIndex:" + sender.pageIndex + ",pageSize:" + sender.pageSize);'
        data-layoutscheme="lefttext,pagesizelist,firstpage,prevgrouppage,prevpage,pagenumber,nextpage,nextgrouppage,lastpage,pageinput,righttext">
    </ul>
</nav>
```

###### javascript代码

```javascript
<script type="text/javascript">
    var demo3 = new BootstrapPagination(document.querySelector(".demo3"));
</script>
```

# 多个控件具有联动效果

###### html代码

```html
<nav>
    <ul class="pagination demo4" data-total="101" data-pageindex="1" data-pagesize="20" data-pagegroupsize="5"
        data-leftformatestring="本页{count}条记录/共{total}条记录"
        data-rightformatestring="第{pageNumber}页/共{totalPages}页"
        data-pagenumberformatestring="{pageNumber}"
        data-pagesizelistformatestring="每页显示{pageSize}条记录"
        data-prevpagetext="上一页" data-nextpagetext="下一页"
        data-prevgrouppagetext="上一组" data-nextgrouppagetext="下一组"
        data-firstpagetext="首页" data-lastpagetext="尾页"
        data-pageinput-placeholder="GO" data-pageinput-timeout="800"
        data-pagesizelist="[5, 10, 20, 50, 100, 200]"
        data-onpagechanged='alert("page changed. pageIndex:" + sender.pageIndex + ",pageSize:" + sender.pageSize);'
        data-layoutscheme="lefttext,pagesizelist,firstpage,prevgrouppage,prevpage,pagenumber,nextpage,nextgrouppage,lastpage,pageinput,righttext">
    </ul>
</nav>
一般情况这里显示你的数据列表
<nav>
    <ul class="pagination demo4">
    </ul>
</nav>
```

###### javascript代码

```javascript
<script type="text/javascript">
    var demo4 = new BootstrapPagination(document.querySelector(".demo4"));
</script>
```
