// antd と React 19 の型互換性問題を解決するための型定義
declare module 'antd' {
  import * as React from 'react';

  // Button
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    icon?: React.ReactNode;
    loading?: boolean;
    danger?: boolean;
    ghost?: boolean;
    size?: 'large' | 'middle' | 'small';
    htmlType?: 'button' | 'submit' | 'reset';
    block?: boolean;
    href?: string;
    target?: string;
    rel?: string;
  }
  export const Button: React.FC<ButtonProps>;

  // Input
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    allowClear?: boolean;
    size?: 'large' | 'middle' | 'small';
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
  }
  export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    rows?: number;
    allowClear?: boolean;
    autoSize?: boolean | { minRows?: number; maxRows?: number };
    showCount?: boolean;
    maxLength?: number;
  }
  export const Input: React.FC<InputProps> & {
    TextArea: React.FC<TextAreaProps>;
    Search: React.FC<InputProps & { onSearch?: (value: string) => void; enterButton?: React.ReactNode }>;
    Password: React.FC<InputProps>;
  };

  // Form
  export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    form?: any;
    layout?: 'horizontal' | 'vertical' | 'inline';
    onFinish?: (values: any) => void;
    onFinishFailed?: (errorInfo: any) => void;
    initialValues?: Record<string, any>;
    labelCol?: { span?: number };
    wrapperCol?: { span?: number };
  }
  export interface FormItemProps {
    name?: string | number | (string | number)[];
    label?: React.ReactNode;
    rules?: Array<{
      required?: boolean;
      message?: string;
      min?: number;
      max?: number;
      pattern?: RegExp;
      validator?: (rule: any, value: any) => Promise<void>;
      type?: string;
      whitespace?: boolean;
    }>;
    children?: React.ReactNode;
    valuePropName?: string;
    extra?: React.ReactNode;
    dependencies?: (string | number | (string | number)[])[];
    noStyle?: boolean;
    hidden?: boolean;
    initialValue?: any;
    getValueFromEvent?: (...args: any[]) => any;
    normalize?: (value: any, prevValue: any, allValues: any) => any;
    shouldUpdate?: boolean | ((prevValues: any, curValues: any) => boolean);
    key?: number;
    fieldKey?: number;
    [key: string]: any;
  }
  export interface FormListProps {
    name: string | number | (string | number)[];
    rules?: any[];
    initialValue?: any[];
    children: (fields: { key: number; name: number; fieldKey?: number }[], operations: {
      add: (defaultValue?: any, insertIndex?: number) => void;
      remove: (index: number | number[]) => void;
      move: (from: number, to: number) => void;
    }, meta: { errors: React.ReactNode[]; warnings: React.ReactNode[] }) => React.ReactNode;
  }
  export const Form: React.FC<FormProps> & {
    Item: React.FC<FormItemProps>;
    List: React.FC<FormListProps>;
    useForm: <T = any>() => [any];
  };

  // Select
  export interface SelectProps {
    value?: any;
    defaultValue?: any;
    onChange?: (value: any) => void;
    options?: Array<{ value: any; label: React.ReactNode; disabled?: boolean }>;
    placeholder?: string;
    size?: 'large' | 'middle' | 'small';
    mode?: 'multiple' | 'tags';
    allowClear?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    tokenSeparators?: string[];
    showSearch?: boolean;
    filterOption?: boolean | ((input: string, option: any) => boolean);
    notFoundContent?: React.ReactNode;
    loading?: boolean;
    maxTagCount?: number | 'responsive';
    onSearch?: (value: string) => void;
    onClick?: (e: any) => void;
    onFocus?: (e: any) => void;
    onBlur?: (e: any) => void;
    open?: boolean;
    onDropdownVisibleChange?: (open: boolean) => void;
    dropdownRender?: (menu: React.ReactNode) => React.ReactNode;
    popupMatchSelectWidth?: boolean | number;
  }
  export const Select: React.FC<SelectProps> & {
    Option: React.FC<{ value: any; children?: React.ReactNode; disabled?: boolean }>;
  };

  // Card
  export interface CardProps {
    title?: React.ReactNode;
    extra?: React.ReactNode;
    bordered?: boolean;
    hoverable?: boolean;
    size?: 'default' | 'small';
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    cover?: React.ReactNode;
    actions?: React.ReactNode[];
    type?: 'inner';
    headStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
  }
  export interface CardMetaProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    avatar?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  export const Card: React.FC<CardProps> & {
    Meta: React.FC<CardMetaProps>;
    Grid: React.FC<{ style?: React.CSSProperties; className?: string; hoverable?: boolean; children?: React.ReactNode }>;
  };

  // Modal
  export interface ModalProps {
    title?: React.ReactNode;
    open?: boolean;
    visible?: boolean;
    onOk?: () => void | Promise<void>;
    onCancel?: () => void;
    footer?: React.ReactNode;
    width?: number | string;
    centered?: boolean;
    children?: React.ReactNode;
    confirmLoading?: boolean;
    okText?: string;
    cancelText?: string;
    destroyOnClose?: boolean;
    closable?: boolean;
    maskClosable?: boolean;
    keyboard?: boolean;
    forceRender?: boolean;
    afterClose?: () => void;
    afterOpenChange?: (open: boolean) => void;
    style?: React.CSSProperties;
    className?: string;
    wrapClassName?: string;
    bodyStyle?: React.CSSProperties;
    maskStyle?: React.CSSProperties;
    zIndex?: number;
  }
  export const Modal: React.FC<ModalProps> & {
    confirm: (config: {
      title?: React.ReactNode;
      content?: React.ReactNode;
      onOk?: () => void | Promise<void>;
      onCancel?: () => void;
      okText?: string;
      cancelText?: string;
      okType?: 'primary' | 'danger';
    }) => void;
    info: (config: any) => void;
    success: (config: any) => void;
    error: (config: any) => void;
    warning: (config: any) => void;
  };

  // Tag
  export interface TagProps {
    color?: string;
    closable?: boolean;
    onClose?: () => void;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    bordered?: boolean;
  }
  export const Tag: React.FC<TagProps>;

  // Spin
  export interface SpinProps {
    spinning?: boolean;
    size?: 'small' | 'default' | 'large';
    tip?: React.ReactNode;
    children?: React.ReactNode;
  }
  export const Spin: React.FC<SpinProps>;

  // List
  export interface ListProps<T = any> {
    dataSource?: T[];
    renderItem?: (item: T, index: number) => React.ReactNode;
    loading?: boolean;
    pagination?: any;
    grid?: { gutter?: number; column?: number; xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number };
    size?: 'default' | 'large' | 'small';
    bordered?: boolean;
    split?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    itemLayout?: 'horizontal' | 'vertical';
    locale?: { emptyText?: React.ReactNode };
  }
  export interface ListItemProps {
    actions?: React.ReactNode[];
    extra?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    key?: any;
  }
  export interface ListItemMetaProps {
    avatar?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
  }
  export const List: React.FC<ListProps> & {
    Item: React.FC<ListItemProps> & {
      Meta: React.FC<ListItemMetaProps>;
    };
  };

  // Empty
  export interface EmptyProps {
    description?: React.ReactNode;
    image?: React.ReactNode;
    children?: React.ReactNode;
    imageStyle?: React.CSSProperties;
    className?: string;
    style?: React.CSSProperties;
  }
  export const Empty: React.FC<EmptyProps> & {
    PRESENTED_IMAGE_DEFAULT: React.ReactNode;
    PRESENTED_IMAGE_SIMPLE: React.ReactNode;
  };

  // Divider
  export interface DividerProps {
    type?: 'horizontal' | 'vertical';
    orientation?: 'left' | 'right' | 'center';
    dashed?: boolean;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    plain?: boolean;
    orientationMargin?: number | string;
  }
  export const Divider: React.FC<DividerProps>;

  // Space
  export interface SpaceProps {
    direction?: 'horizontal' | 'vertical';
    size?: 'small' | 'middle' | 'large' | number | [number, number];
    align?: 'start' | 'end' | 'center' | 'baseline';
    wrap?: boolean;
    children?: React.ReactNode;
    split?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export interface SpaceCompactProps {
    block?: boolean;
    direction?: 'horizontal' | 'vertical';
    size?: 'small' | 'middle' | 'large';
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  export const Space: React.FC<SpaceProps> & {
    Compact: React.FC<SpaceCompactProps>;
  };

  // DatePicker
  export interface DatePickerProps {
    value?: any;
    defaultValue?: any;
    onChange?: (date: any, dateString: string) => void;
    format?: string;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    style?: React.CSSProperties;
    className?: string;
    picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  }
  export const DatePicker: React.FC<DatePickerProps>;

  // Avatar
  export interface AvatarProps {
    src?: string;
    icon?: React.ReactNode;
    size?: 'large' | 'small' | 'default' | number;
    shape?: 'circle' | 'square';
    alt?: string;
    children?: React.ReactNode;
  }
  export const Avatar: React.FC<AvatarProps>;

  // Upload
  export interface UploadProps {
    name?: string;
    action?: string | ((file: any) => string | Promise<string>);
    headers?: Record<string, string>;
    accept?: string;
    multiple?: boolean;
    showUploadList?: boolean | { showPreviewIcon?: boolean; showRemoveIcon?: boolean; showDownloadIcon?: boolean };
    listType?: 'text' | 'picture' | 'picture-card';
    beforeUpload?: (file: any, fileList: any[]) => boolean | Promise<any> | void;
    onChange?: (info: any) => void;
    onRemove?: (file: any) => boolean | Promise<boolean> | void;
    onPreview?: (file: any) => void;
    customRequest?: (options: any, info?: any) => void;
    fileList?: any[];
    defaultFileList?: any[];
    children?: React.ReactNode;
    maxCount?: number;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    directory?: boolean;
    openFileDialogOnClick?: boolean;
    itemRender?: (originNode: React.ReactNode, file: any, fileList: any[], actions: any) => React.ReactNode;
    [key: string]: any;
  }
  export interface DraggerProps {
    [key: string]: any;
  }
  export const Upload: React.FC<UploadProps> & {
    Dragger: React.FC<DraggerProps>;
  };

  // message
  export const message: {
    success: (content: string, duration?: number) => void;
    error: (content: string, duration?: number) => void;
    info: (content: string, duration?: number) => void;
    warning: (content: string, duration?: number) => void;
    loading: (content: string, duration?: number) => void;
  };

  // Tabs
  export interface TabsProps {
    activeKey?: string;
    defaultActiveKey?: string;
    onChange?: (key: string) => void;
    type?: 'line' | 'card' | 'editable-card';
    items?: Array<{
      key: string;
      label: React.ReactNode;
      children?: React.ReactNode;
      disabled?: boolean;
    }>;
    children?: React.ReactNode;
  }
  export const Tabs: React.FC<TabsProps>;

  // Progress
  export interface ProgressProps {
    percent?: number;
    type?: 'line' | 'circle' | 'dashboard';
    status?: 'success' | 'exception' | 'normal' | 'active';
    showInfo?: boolean;
    strokeColor?: string;
    trailColor?: string;
    strokeWidth?: number;
    width?: number;
    format?: (percent?: number) => React.ReactNode;
  }
  export const Progress: React.FC<ProgressProps>;

  // Tooltip
  export interface TooltipProps {
    title?: React.ReactNode;
    placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
    children?: React.ReactNode;
  }
  export const Tooltip: React.FC<TooltipProps>;

  // Badge
  export interface BadgeProps {
    count?: React.ReactNode;
    showZero?: boolean;
    overflowCount?: number;
    dot?: boolean;
    status?: 'success' | 'processing' | 'default' | 'error' | 'warning';
    text?: React.ReactNode;
    offset?: [number, number];
    children?: React.ReactNode;
    size?: 'default' | 'small';
    color?: string;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
  }
  export const Badge: React.FC<BadgeProps>;

  // Alert
  export interface AlertProps {
    type?: 'success' | 'info' | 'warning' | 'error';
    message?: React.ReactNode;
    description?: React.ReactNode;
    showIcon?: boolean;
    closable?: boolean;
    onClose?: () => void;
    banner?: boolean;
  }
  export const Alert: React.FC<AlertProps>;

  // Typography
  export interface TypographyTextProps {
    type?: 'secondary' | 'success' | 'warning' | 'danger';
    disabled?: boolean;
    mark?: boolean;
    code?: boolean;
    keyboard?: boolean;
    underline?: boolean;
    delete?: boolean;
    strong?: boolean;
    italic?: boolean;
    copyable?: boolean | { text?: string; onCopy?: () => void };
    editable?: boolean | { onChange?: (value: string) => void };
    ellipsis?: boolean | { rows?: number; expandable?: boolean; suffix?: string };
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  export interface TypographyTitleProps {
    level?: 1 | 2 | 3 | 4 | 5;
    type?: 'secondary' | 'success' | 'warning' | 'danger';
    disabled?: boolean;
    mark?: boolean;
    code?: boolean;
    underline?: boolean;
    delete?: boolean;
    copyable?: boolean | { text?: string; onCopy?: () => void };
    editable?: boolean | { onChange?: (value: string) => void };
    ellipsis?: boolean | { rows?: number; expandable?: boolean; suffix?: string };
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  export interface TypographyParagraphProps {
    type?: 'secondary' | 'success' | 'warning' | 'danger';
    disabled?: boolean;
    mark?: boolean;
    code?: boolean;
    underline?: boolean;
    delete?: boolean;
    strong?: boolean;
    copyable?: boolean | { text?: string; onCopy?: () => void };
    editable?: boolean | { onChange?: (value: string) => void };
    ellipsis?: boolean | { rows?: number; expandable?: boolean; suffix?: string };
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  export interface TypographyLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    type?: 'secondary' | 'success' | 'warning' | 'danger';
    disabled?: boolean;
    children?: React.ReactNode;
  }
  export const Typography: {
    Text: React.FC<TypographyTextProps>;
    Title: React.FC<TypographyTitleProps>;
    Paragraph: React.FC<TypographyParagraphProps>;
    Link: React.FC<TypographyLinkProps>;
  };

  // Switch
  export interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    loading?: boolean;
    size?: 'default' | 'small';
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  export const Switch: React.FC<SwitchProps>;

  // Checkbox
  export interface CheckboxProps {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (e: any) => void;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  export const Checkbox: React.FC<CheckboxProps> & {
    Group: React.FC<{
      options?: Array<{ label: React.ReactNode; value: any; disabled?: boolean }>;
      value?: any[];
      defaultValue?: any[];
      onChange?: (checkedValue: any[]) => void;
      disabled?: boolean;
      children?: React.ReactNode;
    }>;
  };

  // Radio
  export interface RadioProps {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    value?: any;
    onChange?: (e: any) => void;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  export const Radio: React.FC<RadioProps> & {
    Group: React.FC<{
      options?: Array<{ label: React.ReactNode; value: any; disabled?: boolean }>;
      value?: any;
      defaultValue?: any;
      onChange?: (e: any) => void;
      disabled?: boolean;
      buttonStyle?: 'outline' | 'solid';
      optionType?: 'default' | 'button';
      children?: React.ReactNode;
    }>;
    Button: React.FC<RadioProps>;
  };

  // Dropdown
  export interface DropdownProps {
    menu?: { items: Array<{ key: string; label: React.ReactNode; onClick?: () => void; danger?: boolean; disabled?: boolean }> };
    trigger?: Array<'click' | 'hover' | 'contextMenu'>;
    placement?: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';
    disabled?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }
  export const Dropdown: React.FC<DropdownProps>;

  // Table
  export interface TableProps<T = any> {
    dataSource?: T[];
    columns?: Array<{
      title?: React.ReactNode;
      dataIndex?: string;
      key?: string;
      render?: (text: any, record: T, index: number) => React.ReactNode;
      width?: number | string;
      fixed?: 'left' | 'right' | boolean;
      sorter?: boolean | ((a: T, b: T) => number);
      filters?: Array<{ text: React.ReactNode; value: any }>;
      onFilter?: (value: any, record: T) => boolean;
      align?: 'left' | 'right' | 'center';
      ellipsis?: boolean;
    }>;
    rowKey?: string | ((record: T) => string);
    loading?: boolean;
    pagination?: any;
    bordered?: boolean;
    size?: 'large' | 'middle' | 'small';
    scroll?: { x?: number | string; y?: number | string };
    rowSelection?: {
      type?: 'checkbox' | 'radio';
      selectedRowKeys?: any[];
      onChange?: (selectedRowKeys: any[], selectedRows: T[]) => void;
    };
    onChange?: (pagination: any, filters: any, sorter: any) => void;
    locale?: { emptyText?: React.ReactNode };
  }
  export const Table: React.FC<TableProps>;

  // Popconfirm
  export interface PopconfirmProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    okText?: string;
    cancelText?: string;
    okType?: 'primary' | 'danger';
    okButtonProps?: { danger?: boolean; loading?: boolean; disabled?: boolean };
    cancelButtonProps?: { disabled?: boolean };
    disabled?: boolean;
    placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
    children?: React.ReactNode;
    icon?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
  export const Popconfirm: React.FC<PopconfirmProps>;

  // InputNumber
  export interface InputNumberProps {
    value?: number;
    defaultValue?: number;
    onChange?: (value: number | null) => void;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    disabled?: boolean;
    size?: 'large' | 'middle' | 'small';
    placeholder?: string;
    style?: React.CSSProperties;
    className?: string;
    controls?: boolean;
    formatter?: (value: number | undefined) => string;
    parser?: (displayValue: string | undefined) => number;
  }
  export const InputNumber: React.FC<InputNumberProps>;

  // TimePicker
  export interface TimePickerProps {
    value?: any;
    defaultValue?: any;
    onChange?: (time: any, timeString: string) => void;
    format?: string;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    style?: React.CSSProperties;
    className?: string;
    use12Hours?: boolean;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
  }
  export const TimePicker: React.FC<TimePickerProps>;

  // Skeleton
  export interface SkeletonProps {
    active?: boolean;
    avatar?: boolean | { size?: 'large' | 'small' | 'default' | number; shape?: 'circle' | 'square' };
    paragraph?: boolean | { rows?: number; width?: number | string | Array<number | string> };
    title?: boolean | { width?: number | string };
    loading?: boolean;
    round?: boolean;
    children?: React.ReactNode;
  }
  export const Skeleton: React.FC<SkeletonProps>;

  // Image
  export interface ImageProps {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    preview?: boolean | { visible?: boolean; onVisibleChange?: (visible: boolean) => void };
    fallback?: string;
    placeholder?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export const Image: React.FC<ImageProps>;

  // Row and Col
  export interface RowProps {
    gutter?: number | [number, number] | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number };
    align?: 'top' | 'middle' | 'bottom' | 'stretch';
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
    wrap?: boolean;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export const Row: React.FC<RowProps>;

  export interface ColProps {
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
    flex?: string | number;
    xs?: number | { span?: number; offset?: number };
    sm?: number | { span?: number; offset?: number };
    md?: number | { span?: number; offset?: number };
    lg?: number | { span?: number; offset?: number };
    xl?: number | { span?: number; offset?: number };
    xxl?: number | { span?: number; offset?: number };
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export const Col: React.FC<ColProps>;

  // Menu
  export interface MenuProps {
    mode?: 'vertical' | 'horizontal' | 'inline';
    theme?: 'light' | 'dark';
    selectedKeys?: string[];
    defaultSelectedKeys?: string[];
    openKeys?: string[];
    defaultOpenKeys?: string[];
    onClick?: (info: { key: string }) => void;
    onOpenChange?: (openKeys: string[]) => void;
    items?: Array<{
      key: string;
      label?: React.ReactNode;
      icon?: React.ReactNode;
      children?: any[];
      type?: 'group' | 'divider';
      disabled?: boolean;
      danger?: boolean;
    }>;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export const Menu: React.FC<MenuProps>;

  // Layout
  export interface LayoutProps {
    hasSider?: boolean;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export interface SiderProps {
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    onCollapse?: (collapsed: boolean) => void;
    collapsible?: boolean;
    breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    width?: number | string;
    collapsedWidth?: number | string;
    trigger?: React.ReactNode;
    theme?: 'light' | 'dark';
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export interface HeaderFooterContentProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export const Layout: React.FC<LayoutProps> & {
    Header: React.FC<HeaderFooterContentProps>;
    Footer: React.FC<HeaderFooterContentProps>;
    Content: React.FC<HeaderFooterContentProps>;
    Sider: React.FC<SiderProps>;
  };

  // Breadcrumb
  export interface BreadcrumbProps {
    items?: Array<{ title?: React.ReactNode; href?: string; onClick?: () => void }>;
    separator?: React.ReactNode;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }
  export const Breadcrumb: React.FC<BreadcrumbProps>;

  // Pagination
  export interface PaginationProps {
    current?: number;
    defaultCurrent?: number;
    total?: number;
    pageSize?: number;
    defaultPageSize?: number;
    onChange?: (page: number, pageSize: number) => void;
    onShowSizeChange?: (current: number, size: number) => void;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
    size?: 'default' | 'small';
    simple?: boolean;
    disabled?: boolean;
  }
  export const Pagination: React.FC<PaginationProps>;

  // notification
  export const notification: {
    success: (config: { message: React.ReactNode; description?: React.ReactNode; duration?: number; placement?: string }) => void;
    error: (config: { message: React.ReactNode; description?: React.ReactNode; duration?: number; placement?: string }) => void;
    info: (config: { message: React.ReactNode; description?: React.ReactNode; duration?: number; placement?: string }) => void;
    warning: (config: { message: React.ReactNode; description?: React.ReactNode; duration?: number; placement?: string }) => void;
    open: (config: { message: React.ReactNode; description?: React.ReactNode; duration?: number; placement?: string; type?: string }) => void;
  };

  // ConfigProvider
  export interface ConfigProviderProps {
    theme?: any;
    locale?: any;
    children?: React.ReactNode;
  }
  export const ConfigProvider: React.FC<ConfigProviderProps>;
}
