/// <reference path="Scripts/jquery-1.11.0.min.js" />

/*
定义一个 javascript 分页插件，基于 bootstrap 样式。
*/
var BootstrapPagination = function (obj, option) {
    this.options = {
        total: 0, //记录总数。
        pageSize: 20, //指示每页最多显示的记录数量。
        pageIndex: 0, //当前页索引编号。从其开始（从0开始）的整数。
        pageGroupSize: 10, //指示分页导航栏中最多显示的页索引数量。
        leftFormateString: "本页{count}条记录/共{total}条记录", //位于导航条左侧的输出信息格式化字符串
        rightFormateString: "第{pageNumber}页/共{pageCount}页", //位于导航条右侧的输出信息格式化字符串
        pageNumberText: "{pageNumber}", //页码文本格式。
        prevPageText: "上一页", //上一页导航按钮文本。
        nextPageText: "下一页", //下一页导航按钮文本。
        prevGroupPageText: "上一组", //上一组分页导航按钮文本。
        nextGroupPageText: "下一组", //下一组分页导航按钮文本。
        firstPageText: "首页", //首页导航按钮文本。
        lastPageText: "尾页", //尾页导航按钮文本。
        pageChanged: function () { }, //当分页更改时引发此事件。
    };

    ////验证页码输入控件。
    //function Validate(InputPageNumberControlID) {
    //    var pnCtl = document.getElementById(InputPageNumberControlID);
    //    if (pnCtl.showErrorMessage == true) {
    //        return false;
    //    }
    //    var reg = /^\d+$/gi;
    //    if (!reg.test(pnCtl.value)) {
    //        pnCtl.showErrorMessage = true;
    //        alert("输入的页码格式无效。");
    //        pnCtl.showErrorMessage = false;
    //        pnCtl.focus();
    //        return false;
    //    }
    //    return true;
    //}


    ///*
    //功能：为指定的 URI 设置参数。
    //参数：
    //    uri：一个可能包含参数的 uri 字符串。
    //    Name：参数名。
    //    Value：新的参数值。
    //返回值：处理后的 uri。
    //备注：如果参数存在则更改它的值，否则添加这个参数。
    //*/
    //this.SetUriParameter=function (uri, Name, Value) {
    //    uri = uri.replace(/(\s|\?)*$/g, "");//消除 URI 中无参数但存在问号“...?”这种 URI 中的问号。
    //    if (uri.indexOf("?") == -1) {//如果无参数。
    //        return uri + "?" + Name + "=" + encodeURIComponent(Value);
    //    }
    //    else {//如果有参数。
    //        var reg = new RegExp("(\\?|&)" + Name.replace(/\$/gi, "\\$") + "=([^&]*)", "gi");//测试可能被替换的参数的正则表达式。
    //        if (reg.test(uri)) {//如果存在同名参数。
    //            return uri.replace(reg, "$1" + Name.replace(/\$/gi, "$$$$") + "=" + encodeURIComponent(Value));
    //        }
    //        else {//如果无同名参数。
    //            return uri + "&" + Name + "=" + encodeURIComponent(Value);
    //        }
    //    }
    //}

    ////跳转到指定的页码。
    //this.GotoPage=function (PageIndexParameter, InputPageNumberControlID) {
    //    if (!Validate(InputPageNumberControlID)) {
    //        return;
    //    }
    //    var pnCtl = document.getElementById(InputPageNumberControlID);
    //    var pageIndex = parseInt(pnCtl.value) - 1;
    //    document.location.href = this.SetUriParameter(document.location.href, PageIndexParameter, pageIndex);
    //}

    // 获取分页总数。
    this.getPageCount = function()
    {
        return Math.floor((this.options.total + this.options.pageSize - 1) / this.options.pageSize);
    }

    // 获取当前页实际显示的记录数量。
    this.getCurrentRecordsCount = function()
    {
        var rCount = this.options.total - this.options.pageSize * this.options.pageIndex;
        if (rCount > this.options.pageSize)
        {
            return this.options.pageSize;
        }
        else
        {
            return rCount;
        }
    }

    // 创建分页按钮数据。
    this.createPageButton = function (text, pageNum) {
        var li = $("<li></li>");
        var a = $("<a href='javascript:;'>" + this.options.pageNumberText.replace("{pageNumber}", text) + "</a>");
        if (pageNum !== undefined && pageNum != this.options.pageIndex) {
            a.off('click').on('click', $.proxy(this.doPageChanged, this, pageNum, this.options.pageSize));
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
        var li = $("<li><span>" + text + "</span></li>");
        li.addClass("disabled");
        return li;
    }

    //执行格式化字符串。
    this.doFormateString = function (formateString) {
        return formateString.replace("{count}", this.getCurrentRecordsCount())
                .replace("{total}", this.options.total)
                .replace("{pageNumber}", this.options.total > 0 ? this.options.pageIndex + 1 : 0)
                .replace("{pageCount}", this.getPageCount());
    }

    //将控件的内容呈现到指定的编写器中。此方法主要由控件开发人员使用。
    this.render = function () {
        var lis = [];
        //#region 处理左侧输出信息格式化字符串
        if (this.options.leftFormateString) {
            lis[lis.length] = this.createLabel(this.doFormateString(this.options.leftFormateString));
        }
        //#endregion

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

        //#region 页索引
        if (this.options.pageNumberText) {
            var pageNum = this.options.pageIndex - Math.floor((this.options.pageGroupSize - 1) / 2); //分页页码。
            if (pageNum + this.options.pageGroupSize > this.getPageCount() - 1) {
                pageNum = this.getPageCount() - this.options.pageGroupSize;
            }
            if (pageNum < 0) {
                pageNum = 0;
            }
            for (var i = 0; i < this.options.pageGroupSize && pageNum < this.getPageCount() ; i++) {
                lis[lis.length] = this.createPageButton(pageNum + 1, pageNum);
                pageNum++;
            }
        }
        //#endregion

        //#region 下一页按钮
        if (this.options.nextPageText) {
            if (this.options.pageIndex < this.getPageCount() - 1) {
                var pageNum = this.options.pageIndex + 1;
                lis[lis.length] = this.createPageButton(this.options.nextPageText, pageNum);
            }
            else {
                lis[lis.length] = this.createPageButton(this.options.nextPageText);
            }
        }
        //#endregion

        //#region 下一组分页按钮
        if (this.options.nextGroupPageText) {
            if (this.options.pageIndex < this.getPageCount() - 1) {
                var pageNum = (this.options.pageIndex + this.options.pageGroupSize > this.getPageCount() - 1) ? this.getPageCount() - 1 : this.options.pageIndex + this.options.pageGroupSize;
                lis[lis.length] = this.createPageButton(this.options.nextGroupPageText, pageNum);
            }
            else {
                lis[lis.length] = this.createPageButton(this.options.nextGroupPageText);
            }
        }
        //#endregion

        //#region 尾页按钮
        if (this.options.lastPageText) {
            if (this.options.pageIndex < this.getPageCount() - 1) {
                var pageNum = this.getPageCount() - 1;
                lis[lis.length] = this.createPageButton(this.options.lastPageText, pageNum);
            }
            else {
                lis[lis.length] = this.createPageButton(this.options.lastPageText);
            }
        }
        //#endregion

        //#region 处理右侧输出信息格式化字符串
        if (this.options.rightFormateString) {
            lis[lis.length] = this.createLabel(this.doFormateString(this.options.rightFormateString));
        }
        //#endregion

        //#region 显示页码输入控件。
        //if (this.ShowInputPageNumber)
        //{
        //    string[] spInputPageNumberTitle = this.InputPageNumberTitle.Split(new string[] { "{0}" }, StringSplitOptions.None);
        //if (spInputPageNumberTitle.Length > 0 && string.IsNullOrEmpty(spInputPageNumberTitle[0]) == false)
        //{
        //    System.Web.UI.WebControls.Literal lInputPageNumberTitle = new System.Web.UI.WebControls.Literal();
        //    lInputPageNumberTitle.Text = spInputPageNumberTitle[0];
        //    this.AddContentControl(lInputPageNumberTitle);
        //}

        //{
        //    this.tbInputPageNumber.Text = (this.options.pageIndex + 1).ToString();
        //    this.tbInputPageNumber.ReadOnly = !this.Enabled;
        //    this.tbInputPageNumber.ApplyStyle(this.InputPageNumberTextBoxStyle);
        //    if (!this.Enabled)
        //    {
        //        this.tbInputPageNumber.ApplyStyle(this.InputPageNumberTextBoxDisabledStyle);
        //    }
        //    this.AddContentControl(this.tbInputPageNumber);
        //    this.tbInputPageNumber.Attributes["onblur"] = "PageNavigate_Validate('" + this.tbInputPageNumber.ClientID + "');";
        //}

        //if (spInputPageNumberTitle.Length > 1 && string.IsNullOrEmpty(spInputPageNumberTitle[1]) == false)
        //{
        //    System.Web.UI.WebControls.Literal lInputPageNumberTitle = new System.Web.UI.WebControls.Literal();
        //    lInputPageNumberTitle.Text = spInputPageNumberTitle[1];
        //    this.AddContentControl(lInputPageNumberTitle);
        //}

        //if (string.IsNullOrEmpty(this.InputPageNumberButtonText) == false)
        //{
        //    System.Web.UI.WebControls.HyperLink btnGotoInputPageNumberButton = new System.Web.UI.WebControls.HyperLink();
        //    btnGotoInputPageNumberButton.ID = "GotoInputPageNumberButton";
        //    btnGotoInputPageNumberButton.Text = this.InputPageNumberButtonText;
        //    btnGotoInputPageNumberButton.ApplyStyle(this.PageButtonStyle);
        //    btnGotoInputPageNumberButton.ApplyStyle(this.InputPageNumberButtonStyle);
        //    this.AddContentControl(btnGotoInputPageNumberButton);
        //    if (this.Enabled)
        //    {
        //        btnGotoInputPageNumberButton.NavigateUrl = "javascript:void(0)";
        //        if (this.EnableURLPage)
        //        {
        //            //btnGotoInputPageNumberButton.NavigateUrl = "javascript:PageNavigate_GotoPage('" + Thinksea.Web.ConvertToJavaScriptString(this.PageIndexParameter) + "', '" + this.tbInputPageNumber.ClientID + "');";
        //            btnGotoInputPageNumberButton.Attributes["onclick"] = "PageNavigate_GotoPage('" + Thinksea.Web.ConvertToJavaScriptString(this.PageIndexParameter) + "', '" + this.tbInputPageNumber.ClientID + "');";
        //        }
        //        else
        //        {
        //            //btnGotoInputPageNumberButton.NavigateUrl = "javascript:" + this.Page.ClientScript.GetPostBackEventReference(this, "GotoInputPageNumber");
        //            btnGotoInputPageNumberButton.Attributes["onclick"] = "if(PageNavigate_Validate('" + this.tbInputPageNumber.ClientID + "')){" + this.Page.ClientScript.GetPostBackEventReference(this, "GotoInputPageNumber") + ";}";
        //        }
        //        this.tbInputPageNumber.Attributes["onkeydown"] = @"if(event.keyCode==13){var btn=document.getElementById('" + btnGotoInputPageNumberButton.ClientID + @"'); if(document.all){btn.click();} else if(document.createEvent){var ev = document.createEvent('HTMLEvents'); ev.initEvent('click', false, true); btn.dispatchEvent(ev);}return false;}";
        //    }
        //    else
        //    {
        //        this.SetButtonDisabled(btnGotoInputPageNumberButton);
        //        btnGotoInputPageNumberButton.ApplyStyle(this.InputPageNumberButtonDisabledStyle);
        //    }
        //}
        //else
        //{
        //    if (this.Enabled)
        //    {
        //        if (this.EnableURLPage)
        //        {
        //            this.tbInputPageNumber.Attributes["onkeydown"] = @"if(event.keyCode==13){PageNavigate_GotoPage('" + Thinksea.Web.ConvertToJavaScriptString(this.PageIndexParameter) + "', '" + this.tbInputPageNumber.ClientID + "'); return false;}";
        //        }
        //        else
        //        {
        //            this.tbInputPageNumber.Attributes["onkeydown"] = @"if(event.keyCode==13){if(PageNavigate_Validate('" + this.tbInputPageNumber.ClientID + "')){" + this.Page.ClientScript.GetPostBackEventReference(this, "GotoInputPageNumber") + ";} return false;}";
        //        }
        //    }
        //}
        //}
        //else
        //{
        //    this.tbInputPageNumber.Visible = false;
        //}
        //            #endregion

        obj = $(obj);
        obj.children().remove();
        obj.append(lis);
    }

    //引发分页更改事件。
    this.doPageChanged = function (pageIndex, pageSize) {
        if (this.options.pageChanged) {
            $.extend(true, this.options, {
                pageIndex: pageIndex,
                pageSize: pageSize,
            });
            this.render();
            this.options.pageChanged(pageIndex, pageSize);
        }
    }

    $.extend(true, this.options, option)
    this.render();
    return this;
}
