/**
 * 一个 javascript 分页控件，基于 bootstrap v5 样式。
 * version：1.1.0
 * last change：2022-12-24
 * projects url：https://github.com/thinksea/bootstrap-pagination
 */
declare class BootstrapPagination {
    /**
     * 用于承载分页控件的 HTML 元素。
     */
    private obj;
    /**
     * 参数设置。
     */
    private options;
    /**
     * 当分页更改后引发此事件。
     * @param sender 引发此事件的对象实例。
     */
    onPageChanged: (sender: BootstrapPagination) => void;
    /**
     * 获取记录总数。
     */
    get total(): GLint;
    /**
     * 设置记录总数。
     * @param value 记录总数。从0开始的整数。
     */
    set total(value: GLint);
    /**
     * 获取分页索引。
     */
    get pageIndex(): GLint;
    /**
     * 设置分页索引。
     * @param value 分页索引编号。从0开始的整数。
     */
    set pageIndex(value: GLint);
    /**
     * 获取分页尺寸。
     */
    get pageSize(): GLint;
    /**
     * 设置分页尺寸。
     * @param value 分页尺寸。
     */
    set pageSize(value: GLint);
    /**
     * 获取分页导航栏中最多显示的页索引数量。
     */
    get pageGroupSize(): GLint;
    /**
     * 设置分页导航栏中最多显示的页索引数量。
     * @param value 分页导航栏中最多显示的页索引数量。
     */
    set pageGroupSize(value: GLint);
    /**
     * 获取一个值，指示控件是否为禁用状态。
     */
    get disabled(): boolean;
    /**
     * 设置一个值，指示控件是否为禁用状态。默认值为 false。
     * @param value 设置为 true 禁用控件；否则为 false。
     */
    set disabled(value: boolean);
    /**
     * 获取分页总数。
     */
    private getTotalPages;
    /**
     * 获取当前页实际显示的记录数量。
     */
    private getCurrentCount;
    /**
     * 创建分页按钮。
     */
    private createPageButton;
    /**
     * 创建文本标签。
     */
    private createLabel;
    /**
     * 执行格式化字符串。
     */
    private formateString;
    /**
     * 创建分页尺寸列表控件。
     */
    private createPageSizeList;
    /**
     * 创建页码输入框。
     */
    private createPageInput;
    /**
     * 当分页索引更改后引发此事件。
     * @param newPageIndex 新的分页索引编号。
     */
    private onPageIndexChanged;
    /**
     * 当分页尺寸更改后引发此事件。
     * @param newPageSize 新的分页尺寸。
     */
    private onPageSizeChanged;
    /**
     * 延迟计时器ID，这个延迟计时器用于延迟执行用户输入跳转页码的工作。
     */
    private timeoutId;
    /**
     * 处理输入页码事件。
     */
    private onPageInputChanged;
    /**
     * 修复页码索引，避免超出有效取值范围。
     */
    private fixPageIndex;
    /**
     * 呈现控件。
     */
    private render;
    /**
     * 初始化。
     * @param obj 用于承载分页控件的 HTML 元素。
     * @param option 配置参数。
     * @description 配置参数“option”的优先级高于 HTML 标签上的 data- 属性。
     */
    constructor(obj: HTMLElement, option?: BootstrapPagination.Options);
}
declare namespace BootstrapPagination {
    /**
     * 定义选项数据结构。
     */
    interface Options {
        /**
         * 记录总数。从0开始的整数。
         */
        total?: GLint;
        /**
         * 分页尺寸。指示每页最多显示的记录数量。
         */
        pageSize?: GLint;
        /**
         * 当前页索引编号。从0开始的整数。
         */
        pageIndex?: GLint;
        /**
         * 指示分页导航栏中最多显示的页索引数量。
         */
        pageGroupSize?: GLint;
        /**
         * 位于导航条左侧的输出信息格式化字符串
         */
        leftFormateString?: string;
        /**
         * 位于导航条右侧的输出信息格式化字符串
         */
        rightFormateString?: string;
        /**
         * 页码文本格式化字符串。
         */
        pageNumberFormateString?: string;
        /**
         * 分页尺寸输出格式化字符串
         */
        pageSizeListFormateString?: string;
        /**
         * 上一页导航按钮文本。
         */
        prevPageText?: string;
        /**
         * 下一页导航按钮文本。
         */
        nextPageText?: string;
        /**
         * 上一组分页导航按钮文本。
         */
        prevGroupPageText?: string;
        /**
         * 下一组分页导航按钮文本。
         */
        nextGroupPageText?: string;
        /**
         * 首页导航按钮文本。
         */
        firstPageText?: string;
        /**
         * 尾页导航按钮文本。
         */
        lastPageText?: string;
        /**
         * 页码输入框中显示的提示文本。
         */
        pageInputPlaceholder?: string;
        /**
         * 接受用户输入内容的延迟时间。单位：毫秒
         */
        pageInputTimeout?: GLint;
        /**
         * 分页尺寸列表。
         */
        pageSizeList?: GLint[];
        /**
         * 当分页更改后引发此事件。
         * @param sender 引发此事件的控件。
         */
        onPageChanged?: (sender: BootstrapPagination) => void;
        /**
         * 布局方案。指示按照什么样的排列顺序显示哪些元素。
         */
        layoutScheme?: string;
        /**
         * 一个 bool 值，指示控件是否为禁用状态。默认值为 false。
         */
        disabled?: boolean;
    }
    /**
     * 判断用户端访问环境是否移动电话浏览器。
     * @returns 如果是移动电话则返回 true；否则返回 false。
     * @see  http://detectmobilebrowsers.com/ 以此站点提供的解决方案为基础进行了修改。
     */
    function isMobile(): boolean;
    namespace isMobile {
        let _isMobile: boolean;
    }
}
