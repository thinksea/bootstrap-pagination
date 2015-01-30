/// <reference path="Scripts/jquery-1.11.0.min.js" />

/*
定义一个 javascript 分页控件，基于 bootstrap 样式。
version：0.6.1
last change：2015-1-26
projects url:https://github.com/thinksea/bootstrap-pagination
*/
var BootstrapPagination = function (obj, option) {
    var innerBootstrapPagination = function (obj, option) {
        // 参数设置。
        this.options = {
            //记录总数。
            total: 0,
            //分页尺寸。指示每页最多显示的记录数量。
            pageSize: 20,
            //当前页索引编号。从其开始（从0开始）的整数。
            pageIndex: 0,
            //指示分页导航栏中最多显示的页索引数量。
            pageGroupSize: 10,
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
            pageChanged: function (pageIndex, pageSize) { },
            //布局方案。指示按照什么样的排列顺序显示哪些元素。
            layoutScheme: "lefttext,pagesizelist,firstpage,prevgrouppage,prevpage,pagenumber,nextpage,nextgrouppage,lastpage,pageinput,righttext",
        };

        // 获取或设置分页索引。
        this.pageIndex = function (newPageIndex) {
            if (newPageIndex === undefined) {
                return this.options.pageIndex;
            }
            else {
                this.options.pageIndex = newPageIndex;
                //$.extend(true, this.options, {
                //    pageIndex: newPageIndex,
                //});
                this.fixPageIndex();
                this.render();
                if (this.options.pageChanged) {
                    this.options.pageChanged(this.options.pageIndex, this.options.pageSize);
                }
            }
        }

        // 获取或设置分页尺寸。
        this.pageSize = function (newPageSize) {
            if (newPageSize === undefined) {
                return this.options.pageSize;
            }
            else {
                this.options.pageSize = newPageSize;
                this.fixPageIndex();
                this.render();
                if (this.options.pageChanged) {
                    this.options.pageChanged(this.options.pageIndex, this.options.pageSize);
                }
            }
        }

        // 获取分页总数。
        this.totalPages = function () {
            return Math.floor((this.options.total + this.options.pageSize - 1) / this.options.pageSize);
        }

        // 获取当前页实际显示的记录数量。
        this.currentCount = function () {
            var rCount = this.options.total - this.options.pageSize * this.options.pageIndex;
            if (rCount > this.options.pageSize) {
                return this.options.pageSize;
            }
            else {
                return rCount;
            }
        }

        // 创建分页按钮。
        this.createPageButton = function (text, pageNum) {
            var li = $("<li></li>");
            var a = $("<a href='javascript:;'>" + this.options.pageNumberFormateString.replace("{pageNumber}", text) + "</a>");
            if (pageNum !== undefined && pageNum != this.options.pageIndex) {
                a.off('click').on('click', $.proxy(this.pageIndex, this, pageNum));
            }
            li.append(a);
            if (pageNum !== undefined && pageNum == this.options.pageIndex) {
                li.addClass("active");
            }
            if (pageNum === undefined) {
                li.addClass("disabled");
            }
            return li;
        }

        // 创建文本标签。
        this.createLabel = function (text) {
            var li = $('<li><span>' + text + '</span></li>');
            li.addClass("disabled");
            return li;
        }

        // 执行格式化字符串。
        this.doFormateString = function (formateString) {
            return formateString.replace("{count}", this.currentCount())
                    .replace("{total}", this.options.total)
                    .replace("{pageNumber}", this.options.total > 0 ? this.options.pageIndex + 1 : 0)
                    .replace("{totalPages}", this.totalPages());
        }

        // 创建分页尺寸列表控件。
        this.createPageSizeList = function (align) {
            var li = $('<li></li>');
            var el1 = $('<div class="input-group dropup" style="float: left;"></div>');
            var el2 = $('<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">' +
                this.options.pageSizeListFormateString.replace("{pageSize}", '<span class="pagesize">' + this.options.pageSize + '</span>') +
                '<span class="caret"></span></button>');
            switch (align) {
                case 1:
                    el2.removeClass("pagesize-fix-center").removeClass("pagesize-fix-right").addClass("pagesize-fix-left");
                    break;
                case 2:
                    el2.removeClass("pagesize-fix-left").removeClass("pagesize-fix-right").addClass("pagesize-fix-center");
                    break;
                case 3:
                    el2.removeClass("pagesize-fix-left").removeClass("pagesize-fix-center").addClass("pagesize-fix-right");
                    break;
            }
            var el3 = $('<ul class="dropdown-menu" role="menu"></ul>');
            li.append(el1);
            el1.append(el2);
            el1.append(el3);
            for (var i = 0; i < this.options.pageSizeList.length; i++) {
                var tmp = this.options.pageSizeList[i];
                var liItem = $('<li role="presentation"></li>');
                if (tmp == this.options.pageSize) {
                    liItem.attr("class", "active");
                }
                var a = $('<a role="menuitem" tabindex="-1" href="javascript:;">' + tmp + '</a>');
                a.off('click').on('click', $.proxy(this.pageSize, this, tmp));
                liItem.append(a);
                el3.append(liItem);
            }
            return li;
        }

        // 创建页码输入框。
        this.createPageInput = function () {
            var li = $('<li></li>');
            var inputgroup = $('<div class="input-group page-input"></div>');
            li.append(inputgroup);
            var input = $('<input type="text" class="form-control" />');
            if (this.options.pageInputPlaceholder) {
                input.attr("placeholder", this.options.pageInputPlaceholder);
            }
            inputgroup.append(input);

            input.off('keyup').on('keyup', $.proxy(this.pageInputEvents, this));

            //<input type="text" class="form-control" placeholder="GO" />
            //    <div class="input-group-btn">
            //        <button type="button" class="btn btn-default">GO</button>
            //    </div>
            return li;
        }

        // 延迟计时器ID，这个延迟计时器用于延迟执行用户输入跳转页码的工作。
        this.timeoutId = 0;
        // 处理输入页码事件。
        this.pageInputEvents = function (event) {
            var ctl = $(event.target);
            var sNum = ctl.val();
            var reg = /^\d+$/gi;
            if (!reg.test(sNum)) {
                //alert("输入的页码格式无效。");
                ctl.parent().addClass("has-error");
                return false;
            }
            ctl.parent().removeClass("has-error");
            var pageNum = parseInt(sNum) - 1;
            //if (pageNum > (this.totalPages() - 1)) {
            //    pageNum = this.totalPages() - 1;
            //}
            //if (pageNum < 0) {
            //    pageNum = 0;
            //}
            var that = this;
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(function () {
                that.pageIndex(pageNum);
            }, this.options.pageInputTimeout);
        }

        // 调整页码索引。
        this.fixPageIndex = function () {
            {
                var tp = this.totalPages();
                if (this.options.pageIndex > tp - 1) {
                    this.options.pageIndex = tp - 1;
                }
                if (this.options.pageIndex < 0) {
                    this.options.pageIndex = 0;
                }
            }
        }

        // 呈现控件。
        this.render = function () {
            var lis = new Array();

            var layoutItems = this.options.layoutScheme.split(",");
            for (var i_layout = 0; i_layout < layoutItems.length; i_layout++) {
                switch (layoutItems[i_layout]) {
                    case "lefttext":
                        //#region 处理左侧输出信息格式化字符串
                        if (this.options.leftFormateString) {
                            lis[lis.length] = this.createLabel(this.doFormateString(this.options.leftFormateString));
                        }
                        //#endregion
                        break;
                    case "firstpage":
                        //#region 首页按钮
                        if (this.options.firstPageText) {
                            if (this.options.pageIndex == 0) {
                                lis[lis.length] = this.createPageButton(this.options.firstPageText);
                            }
                            else {
                                var pageNum = 0;
                                lis[lis.length] = this.createPageButton(this.options.firstPageText, pageNum);
                            }
                        }
                        //#endregion
                        break;
                    case "prevgrouppage":
                        //#region 上一组分页按钮
                        if (this.options.prevGroupPageText) {
                            if (this.options.pageIndex == 0) {
                                lis[lis.length] = this.createPageButton(this.options.prevGroupPageText);
                            }
                            else {
                                var pageNum = (this.options.pageIndex - this.options.pageGroupSize < 0) ? 0 : this.options.pageIndex - this.options.pageGroupSize;
                                lis[lis.length] = this.createPageButton(this.options.prevGroupPageText, pageNum);
                            }
                        }
                        //#endregion
                        break;
                    case "prevpage":
                        //#region 上一页按钮
                        if (this.options.prevPageText) {
                            if (this.options.pageIndex <= 0) {
                                lis[lis.length] = this.createPageButton(this.options.prevPageText);
                            }
                            else {
                                var pageNum = this.options.pageIndex - 1;
                                lis[lis.length] = this.createPageButton(this.options.prevPageText, pageNum);
                            }
                        }
                        //#endregion
                        break;
                    case "pagenumber":
                        //#region 页索引
                        if (this.options.pageNumberFormateString) {
                            var pageNum = this.options.pageIndex - Math.floor((this.options.pageGroupSize - 1) / 2); //分页页码。
                            if (pageNum + this.options.pageGroupSize > this.totalPages() - 1) {
                                pageNum = this.totalPages() - this.options.pageGroupSize;
                            }
                            if (pageNum < 0) {
                                pageNum = 0;
                            }
                            for (var i = 0; i < this.options.pageGroupSize && pageNum < this.totalPages() ; i++) {
                                lis[lis.length] = this.createPageButton(pageNum + 1, pageNum);
                                pageNum++;
                            }
                        }
                        //#endregion
                        break;
                    case "nextpage":
                        //#region 下一页按钮
                        if (this.options.nextPageText) {
                            if (this.options.pageIndex < this.totalPages() - 1) {
                                var pageNum = this.options.pageIndex + 1;
                                lis[lis.length] = this.createPageButton(this.options.nextPageText, pageNum);
                            }
                            else {
                                lis[lis.length] = this.createPageButton(this.options.nextPageText);
                            }
                        }
                        //#endregion
                        break;
                    case "nextgrouppage":
                        //#region 下一组分页按钮
                        if (this.options.nextGroupPageText) {
                            if (this.options.pageIndex < this.totalPages() - 1) {
                                var pageNum = (this.options.pageIndex + this.options.pageGroupSize > this.totalPages() - 1) ? this.totalPages() - 1 : this.options.pageIndex + this.options.pageGroupSize;
                                lis[lis.length] = this.createPageButton(this.options.nextGroupPageText, pageNum);
                            }
                            else {
                                lis[lis.length] = this.createPageButton(this.options.nextGroupPageText);
                            }
                        }
                        //#endregion
                        break;
                    case "lastpage":
                        //#region 尾页按钮
                        if (this.options.lastPageText) {
                            if (this.options.pageIndex < this.totalPages() - 1) {
                                var pageNum = this.totalPages() - 1;
                                lis[lis.length] = this.createPageButton(this.options.lastPageText, pageNum);
                            }
                            else {
                                lis[lis.length] = this.createPageButton(this.options.lastPageText);
                            }
                        }
                        //#endregion
                        break;
                    case "pageinput":
                        //#region 处理页码输入框
                        lis[lis.length] = this.createPageInput();
                        //#endregion
                        break;
                    case "pagesizelist":
                        //#region 处理分页尺寸列表控件
                        if (this.options.pageSizeList) {
                            var align = 0;
                            if (layoutItems.length > 1) {
                                if (i_layout > 0 && i_layout < layoutItems.length - 1) { //在中间
                                    align = 2;
                                }
                                else if (i_layout == 0) { //在左侧
                                    align = 1;
                                }
                                else if (i_layout == layoutItems.length - 1) { //在右侧
                                    align = 3;
                                }
                            }
                            lis[lis.length] = this.createPageSizeList(align);
                        }
                        //#endregion
                        break;
                    case "righttext":
                        //#region 处理右侧输出信息格式化字符串
                        if (this.options.rightFormateString) {
                            lis[lis.length] = this.createLabel(this.doFormateString(this.options.rightFormateString));
                        }
                        //#endregion
                }
            }

            obj.children().remove();
            obj.append(lis);
        }

        // 初始化。
        this.init = function () {
            //obj = $(obj);
            //#region 根据 HTML 标签上的 data- 属性初始化参数。
            if (obj.data("layoutscheme") !== undefined)
                this.options.layoutScheme = obj.data("layoutscheme");
            if (obj.data("total") !== undefined)
                this.options.total = parseInt(obj.data("total"));
            if (obj.data("pagesize") !== undefined)
                this.options.pageSize = parseInt(obj.data("pagesize"));
            if (obj.data("pagegroupsize") !== undefined)
                this.options.pageGroupSize = parseInt(obj.data("pagegroupsize"));
            if (obj.data("pageindex") !== undefined)
                this.options.pageIndex = parseInt(obj.data("pageindex"));
            if (obj.data("leftformatestring") !== undefined)
                this.options.leftFormateString = obj.data("leftformatestring");
            if (obj.data("rightformatestring") !== undefined)
                this.options.rightFormateString = obj.data("rightformatestring");
            if (obj.data("pagenumberformatestring") !== undefined)
                this.options.pageNumberFormateString = obj.data("pagenumberformatestring");
            if (obj.data("pagesizelistformatestring") !== undefined)
                this.options.pageSizeListFormateString = obj.data("pagesizelistformatestring");
            if (obj.data("prevpagetext") !== undefined)
                this.options.prevPageText = obj.data("prevpagetext");
            if (obj.data("nextpagetext") !== undefined)
                this.options.nextPageText = obj.data("nextpagetext");
            if (obj.data("prevgrouppagetext") !== undefined)
                this.options.prevGroupPageText = obj.data("prevgrouppagetext");
            if (obj.data("nextgrouppagetext") !== undefined)
                this.options.nextGroupPageText = obj.data("nextgrouppagetext");
            if (obj.data("firstpagetext") !== undefined)
                this.options.firstPageText = obj.data("firstpagetext");
            if (obj.data("lastpagetext") !== undefined)
                this.options.lastPageText = obj.data("lastpagetext");
            if (obj.data("pageinput-placeholder") !== undefined)
                this.options.pageInputPlaceholder = obj.data("pageinput-placeholder");
            if (obj.data("pageinput-timeout") !== undefined)
                this.options.pageInputTimeout = parseInt(obj.data("pageinput-timeout"));
            if (obj.data("pagesizelist") !== undefined) {
                this.options.pageSizeList = eval(obj.data("pagesizelist"));
            }
            if (obj.data("pagechanged") !== undefined) {
                var attrPageChanged = obj.data("pagechanged");
                if (typeof (attrPageChanged) == "function") {
                    this.options.pageChanged = attrPageChanged;
                }
                else if (attrPageChanged.trim().substr(0, 8) == "function") {
                    this.options.pageChanged = function (pageIndex, pageSize) {
                        eval("var fn = " + attrPageChanged);
                        fn(pageIndex, pageSize);
                    };
                }
                else {
                    this.options.pageChanged = function (pageIndex, pageSize) {
                        eval(attrPageChanged);
                    };
                }
            }
            //#endregion

            if (option !== undefined) {
                $.extend(true, this.options, option); //合并由用户代码设置的参数
                if (option.pageSizeList) {
                    this.options.pageSizeList = option.pageSizeList;
                }
            }

            this.fixPageIndex();
        }

        this.init();
        this.render();
    }

    return new innerBootstrapPagination(obj, option);
}
