/**
 * 一个 javascript 分页控件，基于 bootstrap v5 样式。
 * version：1.1.0
 * last change：2022-12-24
 * projects url：https://github.com/thinksea/bootstrap-pagination
 */
class BootstrapPagination {
    /**
     * 用于承载分页控件的 HTML 元素。
     */
    private obj: HTMLElement;

    /**
     * 参数设置。
     */
    private options: BootstrapPagination.Options = {
        total: 0,
        pageSize: 20,
        pageIndex: 0,
        pageGroupSize: 10,
        leftFormateString: "本页{count}条记录/共{total}条记录",
        rightFormateString: "第{pageNumber}页/共{totalPages}页",
        pageNumberFormateString: "{pageNumber}",
        pageSizeListFormateString: "每页显示{pageSize}条记录",
        prevPageText: "上一页",
        nextPageText: "下一页",
        prevGroupPageText: "上一组",
        nextGroupPageText: "下一组",
        firstPageText: "首页",
        lastPageText: "尾页",
        pageInputPlaceholder: "GO",
        pageInputTimeout: 800,
        pageSizeList: [5, 10, 20, 50, 100, 200],
        layoutScheme: "lefttext,pagesizelist,firstpage,prevgrouppage,prevpage,pagenumber,nextpage,nextgrouppage,lastpage,pageinput,righttext",
    };

    /**
     * 当分页更改后引发此事件。
     * @param sender 引发此事件的对象实例。
     */
    public onPageChanged: (sender: BootstrapPagination) => void;

    /**
     * 获取记录总数。
     */
    public get total(): GLint {
        return this.options.total;
    }

    /**
     * 设置记录总数。
     * @param value 记录总数。从0开始的整数。
     */
    public set total(value: GLint) {
        if (value < 0) {
            throw 'The value of "value" is out of range. It must be >= 0.';
        }
        if (this.options.total !== value) {
            this.options.total = value;
            this.fixPageIndex();
            this.render();
        }
    }

    /**
     * 获取分页索引。
     */
    public get pageIndex(): GLint {
        return this.options.pageIndex;
    }

    /**
     * 设置分页索引。
     * @param value 分页索引编号。从0开始的整数。
     */
    public set pageIndex(value: GLint) {
        if (value < 0) {
            throw 'The value of "value" is out of range. It must be >= 0.';
        }
        if (this.options.pageIndex !== value) {
            this.options.pageIndex = value;
            this.fixPageIndex();
            this.render();
        }
    }

    /**
     * 获取分页尺寸。
     */
    public get pageSize(): GLint {
        return this.options.pageSize;
    }

    /**
     * 设置分页尺寸。
     * @param value 分页尺寸。
     */
    public set pageSize(value: GLint) {
        if (value < 1) {
            throw 'The value of "value" is out of range. It must be >= 1.';
        }
        if (this.options.pageSize !== value) {
            this.options.pageSize = value;
            this.fixPageIndex();
            this.render();
        }
    }

    /**
     * 获取分页导航栏中最多显示的页索引数量。
     */
    public get pageGroupSize(): GLint {
        return this.options.pageGroupSize;
    }

    /**
     * 设置分页导航栏中最多显示的页索引数量。
     * @param value 分页导航栏中最多显示的页索引数量。
     */
    public set pageGroupSize(value: GLint) {
        if (value < 1) {
            throw 'The value of "value" is out of range. It must be >= 1.';
        }
        if (this.options.pageGroupSize !== value) {
            this.options.pageGroupSize = value;
            this.render();
        }
    }

    /**
     * 获取一个值，指示控件是否为禁用状态。
     */
    public get disabled(): boolean {
        return this.options.disabled;
    }

    /**
     * 设置一个值，指示控件是否为禁用状态。默认值为 false。
     * @param value 设置为 true 禁用控件；否则为 false。
     */
    public set disabled(value: boolean) {
        if (this.options.disabled !== value) {
            this.options.disabled = value;
            this.render();
        }
    }

    /**
     * 获取分页总数。
     */
    private getTotalPages(): GLint {
        return Math.floor((this.options.total + this.options.pageSize - 1) / this.options.pageSize);
    }

    /**
     * 获取当前页实际显示的记录数量。
     */
    private getCurrentCount(): GLint {
        let rCount = this.options.total - this.options.pageSize * this.options.pageIndex;
        if (rCount > this.options.pageSize) {
            return this.options.pageSize;
        }
        else {
            return rCount;
        }
    }

    /**
     * 创建分页按钮。
     */
    private createPageButton(text: string, pageNum?: GLint): HTMLLIElement {
        let li = document.createElement('li');
        li.className = 'page-item';
        let a = document.createElement('a');
        a.className = 'page-link';
        a.href = 'javascript:;';
        a.innerHTML = this.options.pageNumberFormateString.replace("{pageNumber}", text);
        if (typeof (pageNum) !== 'undefined' && pageNum != this.options.pageIndex) {
            a.onclick = this.onPageIndexChanged.bind(this, pageNum);
        }
        li.append(a);
        if (typeof (pageNum) !== 'undefined' && pageNum == this.options.pageIndex) {
            li.classList.add("active");
            li.ariaCurrent = 'page';
        }
        if (this.options.disabled === true || typeof (pageNum) === 'undefined') {
            li.classList.add("disabled");
        }
        return li;
    }

    /**
     * 创建文本标签。
     */
    private createLabel(text: string): HTMLLIElement {
        let li = document.createElement('li');
        li.innerHTML = '<span class="page-link">' + text + '</span>';
        li.className = 'page-item disabled';
        return li;
    }

    /**
     * 执行格式化字符串。
     */
    private formateString(formateString: string): string {
        return formateString.replace("{count}", this.getCurrentCount().toString())
            .replace("{total}", this.options.total.toString())
            .replace("{pageNumber}", (this.options.total > 0 ? this.options.pageIndex + 1 : 0).toString())
            .replace("{totalPages}", this.getTotalPages().toString());
    }

    /**
     * 创建分页尺寸列表控件。
     */
    private createPageSizeList(): HTMLLIElement {
        let li = document.createElement('li');
        li.className = 'page-item dropdown';
        let el2 = document.createElement('a');
        el2.className = 'page-link dropdown-toggle';
        el2.href = 'javascript:;';
        el2.setAttribute('data-bs-toggle', 'dropdown');
        el2.setAttribute('aria-expanded', 'false');
        el2.innerHTML = this.options.pageSizeListFormateString.replace("{pageSize}", '<span class="pagesize">' + this.options.pageSize + '</span>');

        let el3 = document.createElement('ul');
        el3.className = 'dropdown-menu';
        li.append(el2);
        li.append(el3);
        for (let i = 0; i < this.options.pageSizeList.length; i++) {
            let tmp = this.options.pageSizeList[i];
            let liItem = document.createElement('li');
            let a = document.createElement('a');
            a.className = 'dropdown-item';
            a.setAttribute('role', 'menuitem');
            a.tabIndex = -1;
            a.href = 'javascript:;';
            a.innerHTML = tmp.toString();
            if (tmp == this.options.pageSize) {
                a.classList.add('active');
            }
            a.onclick = this.onPageSizeChanged.bind(this, tmp);
            liItem.append(a);
            el3.append(liItem);
        }
        if (this.options.disabled === true) {
            el2.classList.add('disabled');
            li.classList.add('disabled');
        }
        return li;
    }

    /**
     * 创建页码输入框。
     */
    private createPageInput(): HTMLLIElement {
        let li = document.createElement('li');
        li.className = 'page-item';
        let input = document.createElement('input');
        if (BootstrapPagination.isMobile()) {
            input.type = "number";
            input.min = '0';
            input.max = '99999999';
        }
        else {
            input.type = "text";
            input.maxLength = 8;
        }
        input.pattern = '^\\d+$';
        input.className = 'page-link page-input';
        //input.style.borderRadius = 'unset';
        if (this.options.pageInputPlaceholder) {
            input.setAttribute("placeholder", this.options.pageInputPlaceholder);
        }
        li.append(input);

        input.onkeyup = this.onPageInputChanged.bind(this);

        if (this.options.disabled === true) {
            input.disabled = true;
            li.classList.add('disabled');
        }
        return li;
    }

    //#region 事件。

    /**
     * 当分页索引更改后引发此事件。
     * @param newPageIndex 新的分页索引编号。
     */
    private onPageIndexChanged(newPageIndex: GLint): void {
        if (typeof (newPageIndex) === 'undefined') {
            return;
        }
        else {
            this.options.pageIndex = newPageIndex;
            this.fixPageIndex();
            this.render();
            if (this.onPageChanged) {
                this.onPageChanged(this);
            }
        }
    }

    /**
     * 当分页尺寸更改后引发此事件。
     * @param newPageSize 新的分页尺寸。
     */
    private onPageSizeChanged(newPageSize: GLint): void {
        if (typeof (newPageSize) === 'undefined') {
            return;
        }
        else {
            this.options.pageSize = newPageSize;
            this.fixPageIndex();
            this.render();
            if (this.onPageChanged) {
                this.onPageChanged(this);
            }
        }
    }

    /**
     * 延迟计时器ID，这个延迟计时器用于延迟执行用户输入跳转页码的工作。
     */
    private timeoutId = 0;
    /**
     * 处理输入页码事件。
     */
    private onPageInputChanged(ev: KeyboardEvent) {
        clearTimeout(this.timeoutId);

        let ctl = ev.target as HTMLInputElement;
        let sNum = ctl.value;
        let reg = new RegExp(ctl.pattern, 'gi');
        if (!reg.test(sNum)) {
            //alert("输入的页码格式无效。");
            return false;
        }
        let pageNum = parseInt(sNum) - 1;
        //if (pageNum > (this.getTotalPages() - 1)) {
        //    pageNum = this.getTotalPages() - 1;
        //}
        //if (pageNum < 0) {
        //    pageNum = 0;
        //}
        this.timeoutId = setTimeout(function (_this: BootstrapPagination) {
            _this.onPageIndexChanged(pageNum);
        }, this.options.pageInputTimeout, this);
    }

    //#endregion

    /**
     * 修复页码索引，避免超出有效取值范围。
     */
    private fixPageIndex(): void {
        {
            let totalPages = this.getTotalPages();
            if (this.options.pageIndex > totalPages - 1) {
                this.options.pageIndex = totalPages - 1;
            }
            if (this.options.pageIndex < 0) {
                this.options.pageIndex = 0;
            }
        }
    }

    /**
     * 呈现控件。
     */
    private render(): void {
        let lis = new Array<HTMLLIElement>();

        let layoutItems = this.options.layoutScheme.split(",");
        for (let i_layout = 0; i_layout < layoutItems.length; i_layout++) {
            switch (layoutItems[i_layout]) {
                case "lefttext":
                    //#region 处理左侧输出信息格式化字符串
                    if (this.options.leftFormateString) {
                        lis[lis.length] = this.createLabel(this.formateString(this.options.leftFormateString));
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
                            let pageNum = 0;
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
                            let pageNum = (this.options.pageIndex - this.options.pageGroupSize < 0) ? 0 : this.options.pageIndex - this.options.pageGroupSize;
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
                            let pageNum = this.options.pageIndex - 1;
                            lis[lis.length] = this.createPageButton(this.options.prevPageText, pageNum);
                        }
                    }
                    //#endregion
                    break;
                case "pagenumber":
                    //#region 页索引
                    if (this.options.pageNumberFormateString) {
                        let pageNum = this.options.pageIndex - Math.floor((this.options.pageGroupSize - 1) / 2); //分页页码。
                        if (pageNum + this.options.pageGroupSize > this.getTotalPages() - 1) {
                            pageNum = this.getTotalPages() - this.options.pageGroupSize;
                        }
                        if (pageNum < 0) {
                            pageNum = 0;
                        }
                        for (let i = 0; i < this.options.pageGroupSize && pageNum < this.getTotalPages(); i++) {
                            lis[lis.length] = this.createPageButton((pageNum + 1).toString(), pageNum);
                            pageNum++;
                        }
                    }
                    //#endregion
                    break;
                case "nextpage":
                    //#region 下一页按钮
                    if (this.options.nextPageText) {
                        if (this.options.pageIndex < this.getTotalPages() - 1) {
                            let pageNum = this.options.pageIndex + 1;
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
                        if (this.options.pageIndex < this.getTotalPages() - 1) {
                            let pageNum = (this.options.pageIndex + this.options.pageGroupSize > this.getTotalPages() - 1) ? this.getTotalPages() - 1 : this.options.pageIndex + this.options.pageGroupSize;
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
                        if (this.options.pageIndex < this.getTotalPages() - 1) {
                            let pageNum = this.getTotalPages() - 1;
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
                        lis[lis.length] = this.createPageSizeList();
                    }
                    //#endregion
                    break;
                case "righttext":
                    //#region 处理右侧输出信息格式化字符串
                    if (this.options.rightFormateString) {
                        lis[lis.length] = this.createLabel(this.formateString(this.options.rightFormateString));
                    }
                //#endregion
            }
        }

        this.obj.innerHTML = ''; //清除控件中的全部项目。
        for (let i = 0; i < lis.length; i++) {
            this.obj.append(lis[i]);
        }
    }

    /**
     * 初始化。
     * @param obj 用于承载分页控件的 HTML 元素。
     * @param option 配置参数。
     * @description 配置参数“option”的优先级高于 HTML 标签上的 data- 属性。
     */
    public constructor(obj: HTMLElement, option?: BootstrapPagination.Options) {
        this.obj = obj;

        //#region 根据 HTML 标签上的 data- 属性初始化参数。
        if (obj.getAttribute("data-layoutscheme") !== null)
            this.options.layoutScheme = obj.getAttribute("data-layoutscheme");
        if (obj.getAttribute("data-total") !== null)
            this.options.total = parseInt(obj.getAttribute("data-total"));
        if (obj.getAttribute("data-pagesize") !== null)
            this.options.pageSize = parseInt(obj.getAttribute("data-pagesize"));
        if (obj.getAttribute("data-pagegroupsize") !== null)
            this.options.pageGroupSize = parseInt(obj.getAttribute("data-pagegroupsize"));
        if (obj.getAttribute("data-pageindex") !== null)
            this.options.pageIndex = parseInt(obj.getAttribute("data-pageindex"));
        if (obj.getAttribute("data-leftformatestring") !== null)
            this.options.leftFormateString = obj.getAttribute("data-leftformatestring");
        if (obj.getAttribute("data-rightformatestring") !== null)
            this.options.rightFormateString = obj.getAttribute("data-rightformatestring");
        if (obj.getAttribute("data-pagenumberformatestring") !== null)
            this.options.pageNumberFormateString = obj.getAttribute("data-pagenumberformatestring");
        if (obj.getAttribute("data-pagesizelistformatestring") !== null)
            this.options.pageSizeListFormateString = obj.getAttribute("data-pagesizelistformatestring");
        if (obj.getAttribute("data-prevpagetext") !== null)
            this.options.prevPageText = obj.getAttribute("data-prevpagetext");
        if (obj.getAttribute("data-nextpagetext") !== null)
            this.options.nextPageText = obj.getAttribute("data-nextpagetext");
        if (obj.getAttribute("data-prevgrouppagetext") !== null)
            this.options.prevGroupPageText = obj.getAttribute("data-prevgrouppagetext");
        if (obj.getAttribute("data-nextgrouppagetext") !== null)
            this.options.nextGroupPageText = obj.getAttribute("data-nextgrouppagetext");
        if (obj.getAttribute("data-firstpagetext") !== null)
            this.options.firstPageText = obj.getAttribute("data-firstpagetext");
        if (obj.getAttribute("data-lastpagetext") !== null)
            this.options.lastPageText = obj.getAttribute("data-lastpagetext");
        if (obj.getAttribute("data-pageinput-placeholder") !== null)
            this.options.pageInputPlaceholder = obj.getAttribute("data-pageinput-placeholder");
        if (obj.getAttribute("data-pageinput-timeout") !== null)
            this.options.pageInputTimeout = parseInt(obj.getAttribute("data-pageinput-timeout"));
        if (obj.getAttribute("data-pagesizelist") !== null) {
            this.options.pageSizeList = JSON.parse(obj.getAttribute("data-pagesizelist"));
        }
        if (obj.getAttribute("data-disabled") !== null)
            this.options.disabled = obj.getAttribute("data-disabled") !== 'false';

        if (typeof (option?.onPageChanged) !== "undefined") { //优先通过代码指定事件处理逻辑。
            this.onPageChanged = option.onPageChanged;
        }
        else if (obj.getAttribute("data-onpagechanged") !== null) { //尝试从 HTML 元素的 data-onpagechanged 属性加载事件。
            let attrPageChanged = obj.getAttribute("data-onpagechanged");
            if (typeof (attrPageChanged) == "function") {
                this.onPageChanged = attrPageChanged;
            }

            //#region 由于不符合 HTML 标准，所以不再支持此调用规则。
            //            else if (attrPageChanged.trim().substr(0, 8) == "function") {
            //                this.onPageChanged = function (sender: BootstrapPagination) {
            //                    eval("let fn = " + attrPageChanged + '\
            //fn(' + sender.pageIndex + ', ' + sender.pageSize + ');');
            //                };
            //            }
            //#endregion

            else {
                this.onPageChanged = new Function('sender', attrPageChanged) as any; // 动态创建函数，格式类似于 function (pageIndex: GLint, pageSize: GLint) {......}
            }
        }
        //#endregion

        if (typeof (option) !== 'undefined') {
            for (let attr in option) { //合并由用户代码设置的参数
                this.options[attr] = option[attr];
            }
        }

        this.fixPageIndex();
        this.render();
    }

}

namespace BootstrapPagination {
    /**
     * 定义选项数据结构。
     */
    export interface Options {
        /**
         * 记录总数。从0开始的整数。
         */
        total?: GLint,
        /**
         * 分页尺寸。指示每页最多显示的记录数量。
         */
        pageSize?: GLint,
        /**
         * 当前页索引编号。从0开始的整数。
         */
        pageIndex?: GLint,
        /**
         * 指示分页导航栏中最多显示的页索引数量。
         */
        pageGroupSize?: GLint,
        /**
         * 位于导航条左侧的输出信息格式化字符串
         */
        leftFormateString?: string,
        /**
         * 位于导航条右侧的输出信息格式化字符串
         */
        rightFormateString?: string,
        /**
         * 页码文本格式化字符串。
         */
        pageNumberFormateString?: string,
        /**
         * 分页尺寸输出格式化字符串
         */
        pageSizeListFormateString?: string,
        /**
         * 上一页导航按钮文本。
         */
        prevPageText?: string,
        /**
         * 下一页导航按钮文本。
         */
        nextPageText?: string,
        /**
         * 上一组分页导航按钮文本。
         */
        prevGroupPageText?: string,
        /**
         * 下一组分页导航按钮文本。
         */
        nextGroupPageText?: string,
        /**
         * 首页导航按钮文本。
         */
        firstPageText?: string,
        /**
         * 尾页导航按钮文本。
         */
        lastPageText?: string,
        /**
         * 页码输入框中显示的提示文本。
         */
        pageInputPlaceholder?: string,
        /**
         * 接受用户输入内容的延迟时间。单位：毫秒
         */
        pageInputTimeout?: GLint,
        /**
         * 分页尺寸列表。
         */
        pageSizeList?: GLint[],
        /**
         * 当分页更改后引发此事件。
         * @param sender 引发此事件的控件。
         */
        onPageChanged?: (sender: BootstrapPagination) => void,
        /**
         * 布局方案。指示按照什么样的排列顺序显示哪些元素。
         */
        layoutScheme?: string,
        /**
         * 一个 bool 值，指示控件是否为禁用状态。默认值为 false。
         */
        disabled?: boolean,
    };

    //#region 检测移动设备浏览器。
    /**
     * 判断用户端访问环境是否移动电话浏览器。
     * @returns 如果是移动电话则返回 true；否则返回 false。
     * @see  http://detectmobilebrowsers.com/ 以此站点提供的解决方案为基础进行了修改。
     */
    export function isMobile(): boolean {
        if (isMobile._isMobile === null) {
            let a = navigator.userAgent || navigator.vendor || (window as any).opera;
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                if (/MI PAD/i.test(a)) { //过滤掉小米PAD
                    isMobile._isMobile = false;
                }
                else {
                    isMobile._isMobile = true;
                }
            }
            else {
                isMobile._isMobile = false;
            }
        }
        return isMobile._isMobile;
    }
    export namespace isMobile {
        export let _isMobile: boolean = null; //用于缓冲结果，避免冗余计算过程。
    }

    //#endregion

}
