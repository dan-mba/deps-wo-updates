import './sourcemap-register.cjs';import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 642:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderTable = exports.printTable = exports.Table = void 0;
const console_table_printer_1 = __importDefault(__nccwpck_require__(369));
exports.Table = console_table_printer_1.default;
const internal_table_printer_1 = __nccwpck_require__(960);
Object.defineProperty(exports, "printTable", ({ enumerable: true, get: function () { return internal_table_printer_1.printSimpleTable; } }));
Object.defineProperty(exports, "renderTable", ({ enumerable: true, get: function () { return internal_table_printer_1.renderSimpleTable; } }));


/***/ }),

/***/ 369:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const internal_table_1 = __importDefault(__nccwpck_require__(159));
const table_helpers_1 = __nccwpck_require__(205);
class Table {
    constructor(options) {
        this.table = new internal_table_1.default(options);
    }
    addColumn(column) {
        this.table.addColumn(column);
        return this;
    }
    addColumns(columns) {
        this.table.addColumns(columns);
        return this;
    }
    addRow(text, rowOptions) {
        this.table.addRow(text, (0, table_helpers_1.convertRawRowOptionsToStandard)(rowOptions));
        return this;
    }
    addRows(toBeInsertedRows, rowOptions) {
        this.table.addRows(toBeInsertedRows, (0, table_helpers_1.convertRawRowOptionsToStandard)(rowOptions));
        return this;
    }
    printTable() {
        const tableRendered = this.table.renderTable();
        console.log(tableRendered);
    }
    render() {
        return this.table.renderTable();
    }
}
exports["default"] = Table;


/***/ }),

/***/ 319:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rawColumnToInternalColumn = exports.objIfExists = void 0;
const table_constants_1 = __nccwpck_require__(393);
const objIfExists = (key, val) => {
    if (!val) {
        return {};
    }
    return {
        [key]: val,
    };
};
exports.objIfExists = objIfExists;
const rawColumnToInternalColumn = (column) => {
    var _a;
    return (Object.assign(Object.assign(Object.assign(Object.assign({ name: column.name, title: (_a = column.title) !== null && _a !== void 0 ? _a : column.name }, (0, exports.objIfExists)('color', column.color)), (0, exports.objIfExists)('maxLen', column.maxLen)), (0, exports.objIfExists)('minLen', column.minLen)), { alignment: column.alignment || table_constants_1.DEFAULT_ROW_ALIGNMENT }));
};
exports.rawColumnToInternalColumn = rawColumnToInternalColumn;


/***/ }),

/***/ 960:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.printSimpleTable = exports.renderSimpleTable = exports.renderTable = void 0;
const colored_console_line_1 = __importDefault(__nccwpck_require__(702));
const string_utils_1 = __nccwpck_require__(204);
const table_constants_1 = __nccwpck_require__(393);
const table_helpers_1 = __nccwpck_require__(205);
const internal_table_1 = __importDefault(__nccwpck_require__(159));
const table_pre_processors_1 = __nccwpck_require__(607);
// ║ Index ║         ║        ║
const renderOneLine = (tableStyle, columns, currentLineIndex, widthLimitedColumnsArray, isHeader, row, colorMap, charLength) => {
    const line = new colored_console_line_1.default(colorMap);
    line.addCharsWithColor('', tableStyle.vertical); // dont Color the Column borders
    columns.forEach((column) => {
        const thisLineHasText = currentLineIndex < widthLimitedColumnsArray[column.name].length;
        const textForThisLine = thisLineHasText
            ? (0, table_helpers_1.cellText)(widthLimitedColumnsArray[column.name][currentLineIndex])
            : '';
        line.addCharsWithColor(table_constants_1.DEFAULT_ROW_FONT_COLOR, ' ');
        line.addCharsWithColor((isHeader && table_constants_1.DEFAULT_HEADER_FONT_COLOR) || column.color || row.color, (0, string_utils_1.textWithPadding)(textForThisLine, column.alignment || table_constants_1.DEFAULT_ROW_ALIGNMENT, column.length || table_constants_1.DEFAULT_COLUMN_LEN, charLength));
        line.addCharsWithColor('', ` ${tableStyle.vertical}`); // dont Color the Column borders
    });
    return line.renderConsole();
};
// ║ Bold  ║    text ║  value ║
// ║ Index ║         ║        ║
const renderWidthLimitedLines = (tableStyle, columns, row, colorMap, isHeader, charLength) => {
    // { col1: ['How', 'Is', 'Going'], col2: ['I am', 'Tom'],  }
    const widthLimitedColumnsArray = (0, table_helpers_1.getWidthLimitedColumnsArray)(columns, row, charLength);
    const totalLines = Object.values(widthLimitedColumnsArray).reduce((a, b) => Math.max(a, b.length), 0);
    const ret = [];
    for (let currentLineIndex = 0; currentLineIndex < totalLines; currentLineIndex += 1) {
        const singleLine = renderOneLine(tableStyle, columns, currentLineIndex, widthLimitedColumnsArray, isHeader, row, colorMap, charLength);
        ret.push(singleLine);
    }
    return ret;
};
// ║ 1     ║     I would like some red wine please ║ 10.212 ║
const renderRow = (table, row) => {
    let ret = [];
    ret = ret.concat(renderWidthLimitedLines(table.tableStyle, table.columns, row, table.colorMap, undefined, table.charLength));
    return ret;
};
/*
                  The analysis Result
 ╔═══════╦═══════════════════════════════════════╦════════╗
*/
const renderTableTitle = (table) => {
    const ret = [];
    if (table.title === undefined) {
        return ret;
    }
    const getTableWidth = () => {
        const reducer = (accumulator, currentValue) => 
        // ║ cell ║, 2 spaces + cellTextSize + one border on the left
        accumulator + currentValue + 2 + 1;
        return table.columns
            .map((m) => m.length || table_constants_1.DEFAULT_COLUMN_LEN)
            .reduce(reducer, 1);
    };
    const titleWithPadding = (0, string_utils_1.textWithPadding)(table.title, table_constants_1.DEFAULT_HEADER_ALIGNMENT, getTableWidth());
    const styledText = new colored_console_line_1.default(table.colorMap);
    styledText.addCharsWithColor(table_constants_1.DEFAULT_HEADER_FONT_COLOR, titleWithPadding);
    //                  The analysis Result
    ret.push(styledText.renderConsole());
    return ret;
};
/*
 ╔═══════╦═══════════════════════════════════════╦════════╗
 ║ index ║                                  text ║  value ║
 ╟═══════╬═══════════════════════════════════════╬════════╢
*/
const renderTableHeaders = (table) => {
    let ret = [];
    // ╔═══════╦═══════════════════════════════════════╦════════╗
    ret.push((0, table_helpers_1.renderTableHorizontalBorders)(table.tableStyle.headerTop, table.columns.map((m) => m.length || table_constants_1.DEFAULT_COLUMN_LEN)));
    // ║ index ║                                  text ║  value ║
    const row = (0, table_helpers_1.createHeaderAsRow)(table_helpers_1.createRow, table.columns);
    ret = ret.concat(renderWidthLimitedLines(table.tableStyle, table.columns, row, table.colorMap, true));
    // ╟═══════╬═══════════════════════════════════════╬════════╢
    ret.push((0, table_helpers_1.renderTableHorizontalBorders)(table.tableStyle.headerBottom, table.columns.map((m) => m.length || table_constants_1.DEFAULT_COLUMN_LEN)));
    return ret;
};
const renderTableEnding = (table) => {
    const ret = [];
    // ╚═══════╩═══════════════════════════════════════╩════════╝
    ret.push((0, table_helpers_1.renderTableHorizontalBorders)(table.tableStyle.tableBottom, table.columns.map((m) => m.length || table_constants_1.DEFAULT_COLUMN_LEN)));
    return ret;
};
const renderRowSeparator = (table, row) => {
    const ret = [];
    const lastRowIndex = table.rows.length - 1;
    const currentRowIndex = table.rows.indexOf(row);
    if (currentRowIndex !== lastRowIndex && row.separator) {
        // ╟═══════╬═══════════════════════════════════════╬════════╢
        ret.push((0, table_helpers_1.renderTableHorizontalBorders)(table.tableStyle.rowSeparator, table.columns.map((m) => m.length || table_constants_1.DEFAULT_COLUMN_LEN)));
    }
    return ret;
};
const renderTable = (table) => {
    (0, table_pre_processors_1.preProcessColumns)(table); // enable / disable cols, find maxLn of each col/ computed Columns
    (0, table_pre_processors_1.preProcessRows)(table); // sort and filter
    const ret = [];
    renderTableTitle(table).forEach((row) => ret.push(row));
    renderTableHeaders(table).forEach((row) => ret.push(row));
    table.rows.forEach((row) => {
        renderRow(table, row).forEach((row_) => ret.push(row_));
        renderRowSeparator(table, row).forEach((row_) => ret.push(row_));
    });
    renderTableEnding(table).forEach((row) => ret.push(row));
    return ret.join('\n');
};
exports.renderTable = renderTable;
const renderSimpleTable = (rows) => {
    const table = new internal_table_1.default();
    table.addRows(rows);
    return (0, exports.renderTable)(table);
};
exports.renderSimpleTable = renderSimpleTable;
const printSimpleTable = (rows) => {
    console.log((0, exports.renderSimpleTable)(rows));
};
exports.printSimpleTable = printSimpleTable;


/***/ }),

/***/ 159:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const colored_console_line_1 = __nccwpck_require__(702);
const table_constants_1 = __nccwpck_require__(393);
const table_helpers_1 = __nccwpck_require__(205);
const input_converter_1 = __nccwpck_require__(319);
const internal_table_printer_1 = __nccwpck_require__(960);
const DEFAULT_ROW_SORT_FUNC = () => 0;
const DEFAULT_ROW_FILTER_FUNC = () => true;
class TableInternal {
    initSimple(columns) {
        this.columns = columns.map((column) => ({
            name: column,
            title: column,
            alignment: table_constants_1.DEFAULT_ROW_ALIGNMENT,
        }));
    }
    initDetailed(options) {
        var _a;
        this.title = (options === null || options === void 0 ? void 0 : options.title) || this.title;
        this.tableStyle = (options === null || options === void 0 ? void 0 : options.style) || this.tableStyle;
        this.sortFunction = (options === null || options === void 0 ? void 0 : options.sort) || this.sortFunction;
        this.filterFunction = (options === null || options === void 0 ? void 0 : options.filter) || this.filterFunction;
        this.enabledColumns = (options === null || options === void 0 ? void 0 : options.enabledColumns) || this.enabledColumns;
        this.disabledColumns = (options === null || options === void 0 ? void 0 : options.disabledColumns) || this.disabledColumns;
        this.computedColumns = (options === null || options === void 0 ? void 0 : options.computedColumns) || this.computedColumns;
        this.columns =
            ((_a = options === null || options === void 0 ? void 0 : options.columns) === null || _a === void 0 ? void 0 : _a.map(input_converter_1.rawColumnToInternalColumn)) || this.columns;
        this.rowSeparator = (options === null || options === void 0 ? void 0 : options.rowSeparator) || this.rowSeparator;
        this.charLength = (options === null || options === void 0 ? void 0 : options.charLength) || this.charLength;
        if (options === null || options === void 0 ? void 0 : options.shouldDisableColors) {
            this.colorMap = {};
        }
        else if (options === null || options === void 0 ? void 0 : options.colorMap) {
            this.colorMap = Object.assign(Object.assign({}, this.colorMap), options.colorMap);
        }
        if (options.rows !== undefined) {
            this.addRows(options.rows);
        }
    }
    constructor(options) {
        // default construction
        this.rows = [];
        this.columns = [];
        this.title = undefined;
        this.tableStyle = table_constants_1.DEFAULT_TABLE_STYLE;
        this.filterFunction = DEFAULT_ROW_FILTER_FUNC;
        this.sortFunction = DEFAULT_ROW_SORT_FUNC;
        this.enabledColumns = [];
        this.disabledColumns = [];
        this.computedColumns = [];
        this.rowSeparator = table_constants_1.DEFAULT_ROW_SEPARATOR;
        this.colorMap = colored_console_line_1.DEFAULT_COLOR_MAP;
        this.charLength = {};
        if (options instanceof Array) {
            this.initSimple(options);
        }
        else if (typeof options === 'object') {
            this.initDetailed(options);
        }
    }
    createColumnFromRow(text) {
        const colNames = this.columns.map((col) => col.name);
        Object.keys(text).forEach((key) => {
            if (!colNames.includes(key)) {
                this.columns.push((0, table_helpers_1.createColumFromOnlyName)(key));
            }
        });
    }
    addColumn(textOrObj) {
        if (typeof textOrObj === 'string') {
            this.columns.push((0, table_helpers_1.createColumFromOnlyName)(textOrObj));
        }
        else {
            this.columns.push((0, table_helpers_1.createColumFromComputedColumn)(textOrObj));
        }
    }
    addColumns(toBeInsertedColumns) {
        toBeInsertedColumns.forEach((toBeInsertedColumn) => {
            this.addColumn(toBeInsertedColumn);
        });
    }
    addRow(text, options) {
        this.createColumnFromRow(text);
        this.rows.push((0, table_helpers_1.createRow)((options === null || options === void 0 ? void 0 : options.color) || table_constants_1.DEFAULT_ROW_FONT_COLOR, text, (options === null || options === void 0 ? void 0 : options.separator) !== undefined
            ? options === null || options === void 0 ? void 0 : options.separator
            : this.rowSeparator));
    }
    addRows(toBeInsertedRows, options) {
        toBeInsertedRows.forEach((toBeInsertedRow) => {
            this.addRow(toBeInsertedRow, options);
        });
    }
    renderTable() {
        return (0, internal_table_printer_1.renderTable)(this);
    }
}
exports["default"] = TableInternal;


/***/ }),

/***/ 607:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.preProcessRows = exports.preProcessColumns = void 0;
const table_helpers_1 = __nccwpck_require__(205);
const createComputedColumnsIfNecessary = (table) => {
    if (table.computedColumns.length) {
        table.computedColumns.forEach((computedColumn) => {
            table.addColumn(computedColumn);
            table.rows.forEach((row) => {
                row.text[computedColumn.name] = computedColumn.function(row.text);
            });
        });
    }
};
const disableColumnsIfNecessary = (table) => {
    if (table.enabledColumns.length) {
        table.columns = table.columns.filter((col) => table.enabledColumns.includes(col.name));
    }
};
const enableColumnsIfNecessary = (table) => {
    if (table.disabledColumns.length) {
        table.columns = table.columns.filter((col) => !table.disabledColumns.includes(col.name));
    }
};
const findColumnWidth = (table) => {
    table.columns.forEach((column) => {
        column.length = (0, table_helpers_1.findLenOfColumn)(column, table.rows, table.charLength);
    });
};
const preProcessColumns = (table) => {
    createComputedColumnsIfNecessary(table);
    enableColumnsIfNecessary(table);
    disableColumnsIfNecessary(table);
    findColumnWidth(table);
};
exports.preProcessColumns = preProcessColumns;
const preProcessRows = (table) => {
    const newRows = table.rows
        .filter((r) => table.filterFunction(r.text))
        .sort((r1, r2) => table.sortFunction(r1.text, r2.text));
    table.rows = newRows;
};
exports.preProcessRows = preProcessRows;


/***/ }),

/***/ 702:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_COLOR_MAP = void 0;
exports.DEFAULT_COLOR_MAP = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    white_bold: '\x1b[01m',
    reset: '\x1b[0m',
};
class ColoredConsoleLine {
    constructor(colorMap = exports.DEFAULT_COLOR_MAP) {
        this.text = '';
        this.colorMap = colorMap;
    }
    addCharsWithColor(color, text) {
        const colorAnsi = this.colorMap[color];
        this.text +=
            colorAnsi !== undefined
                ? `${colorAnsi}${text}${this.colorMap.reset}`
                : text;
    }
    renderConsole() {
        return this.text;
    }
}
exports["default"] = ColoredConsoleLine;


/***/ }),

/***/ 285:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findWidthInConsole = exports.stripAnsi = void 0;
const simple_wcswidth_1 = __nccwpck_require__(294);
/* eslint-disable no-control-regex */
const colorRegex = /\x1b\[\d{1,3}(;\d{1,3})*m/g; // \x1b[30m \x1b[305m \x1b[38;5m
const stripAnsi = (str) => str.replace(colorRegex, '');
exports.stripAnsi = stripAnsi;
const findWidthInConsole = (str, charLength) => {
    let strLen = 0;
    str = (0, exports.stripAnsi)(str);
    if (charLength) {
        Object.entries(charLength).forEach(([key, value]) => {
            // count appearance of the key in the string and remove from original string
            let regex = new RegExp(key, 'g');
            strLen += (str.match(regex) || []).length * value;
            str = str.replace(key, '');
        });
    }
    strLen += (0, simple_wcswidth_1.wcswidth)(str);
    return strLen;
};
exports.findWidthInConsole = findWidthInConsole;


/***/ }),

/***/ 204:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.biggestWordInSentence = exports.textWithPadding = exports.splitTextIntoTextsOfMinLen = void 0;
const console_utils_1 = __nccwpck_require__(285);
// ("How are you?",10) => ["How are ", "you?"]
const splitTextIntoTextsOfMinLen = (inpStr, width, charLength) => {
    const ret = [];
    const spaceSeparatedStrings = inpStr.split(' ');
    let now = [];
    let cnt = 0;
    spaceSeparatedStrings.forEach((strWithoutSpace) => {
        const consoleWidth = (0, console_utils_1.findWidthInConsole)(strWithoutSpace, charLength);
        if (cnt + consoleWidth <= width) {
            cnt += consoleWidth + 1; // 1 for the space
            now.push(strWithoutSpace);
        }
        else {
            ret.push(now.join(' '));
            now = [strWithoutSpace];
            cnt = consoleWidth + 1;
        }
    });
    ret.push(now.join(' '));
    return ret;
};
exports.splitTextIntoTextsOfMinLen = splitTextIntoTextsOfMinLen;
// ("How are you?",center, 20) => "    How are you?    "
// ("How are you?",right, 20)  => "        How are you?"
// ("How are you?",center, 4)  => "How\nare\nyou?"
const textWithPadding = (text, alignment, columnLen, charLength) => {
    const curTextSize = (0, console_utils_1.findWidthInConsole)(text, charLength);
    // alignments for center padding case
    const leftPadding = Math.floor((columnLen - curTextSize) / 2);
    const rightPadding = columnLen - leftPadding - curTextSize;
    // handle edge cases where the text size is larger than the column length
    if (columnLen < curTextSize) {
        const splittedLines = (0, exports.splitTextIntoTextsOfMinLen)(text, columnLen);
        if (splittedLines.length === 1) {
            return text;
        }
        return splittedLines
            .map((singleLine) => (0, exports.textWithPadding)(singleLine, alignment, columnLen, charLength))
            .join('\n');
    }
    // console.log(text, columnLen, curTextSize);
    switch (alignment) {
        case 'left':
            return text.concat(' '.repeat(columnLen - curTextSize));
        case 'center':
            return ' '
                .repeat(leftPadding)
                .concat(text)
                .concat(' '.repeat(rightPadding));
        case 'right':
        default:
            return ' '.repeat(columnLen - curTextSize).concat(text);
    }
};
exports.textWithPadding = textWithPadding;
// ("How are you?",10) => ["How are ", "you?"]
const biggestWordInSentence = (inpStr, charLength) => inpStr
    .split(' ')
    .reduce((a, b) => Math.max(a, (0, console_utils_1.findWidthInConsole)(b, charLength)), 0);
exports.biggestWordInSentence = biggestWordInSentence;


/***/ }),

/***/ 393:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_HEADER_ALIGNMENT = exports.DEFAULT_ROW_ALIGNMENT = exports.DEFAULT_HEADER_FONT_COLOR = exports.DEFAULT_ROW_FONT_COLOR = exports.COLORS = exports.ALIGNMENTS = exports.DEFAULT_TABLE_STYLE = exports.DEFAULT_ROW_SEPARATOR = exports.DEFAULT_COLUMN_LEN = void 0;
exports.DEFAULT_COLUMN_LEN = 20;
exports.DEFAULT_ROW_SEPARATOR = false;
exports.DEFAULT_TABLE_STYLE = {
    /*
        Default Style
        ┌────────────┬─────┬──────┐
        │ foo        │ bar │ baz  │
        │ frobnicate │ bar │ quuz │
        └────────────┴─────┴──────┘
        */
    headerTop: {
        left: '┌',
        mid: '┬',
        right: '┐',
        other: '─',
    },
    headerBottom: {
        left: '├',
        mid: '┼',
        right: '┤',
        other: '─',
    },
    tableBottom: {
        left: '└',
        mid: '┴',
        right: '┘',
        other: '─',
    },
    vertical: '│',
    rowSeparator: {
        left: '├',
        mid: '┼',
        right: '┤',
        other: '─',
    },
};
exports.ALIGNMENTS = ['right', 'left', 'center'];
exports.COLORS = [
    'red',
    'green',
    'yellow',
    'white',
    'blue',
    'magenta',
    'cyan',
    'white_bold',
    'reset',
];
exports.DEFAULT_ROW_FONT_COLOR = 'white';
exports.DEFAULT_HEADER_FONT_COLOR = 'white_bold';
exports.DEFAULT_ROW_ALIGNMENT = 'right';
exports.DEFAULT_HEADER_ALIGNMENT = 'center';


/***/ }),

/***/ 205:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWidthLimitedColumnsArray = exports.createHeaderAsRow = exports.renderTableHorizontalBorders = exports.findLenOfColumn = exports.createRow = exports.createColumFromComputedColumn = exports.createColumFromOnlyName = exports.createTableHorizontalBorders = exports.convertRawRowOptionsToStandard = exports.cellText = void 0;
const input_converter_1 = __nccwpck_require__(319);
const console_utils_1 = __nccwpck_require__(285);
const string_utils_1 = __nccwpck_require__(204);
const table_constants_1 = __nccwpck_require__(393);
const max = (a, b) => Math.max(a, b);
// takes any input that is given by user and converts to string
const cellText = (text) => text === undefined || text === null ? '' : `${text}`;
exports.cellText = cellText;
const convertRawRowOptionsToStandard = (options) => {
    if (options) {
        return {
            color: options.color,
            separator: options.separator || table_constants_1.DEFAULT_ROW_SEPARATOR,
        };
    }
    return undefined;
};
exports.convertRawRowOptionsToStandard = convertRawRowOptionsToStandard;
const createTableHorizontalBorders = ({ left, mid, right, other, }, column_lengths) => {
    // ╚
    let ret = left;
    // ╚═══════╩═══════════════════════════════════════╩════════╩
    column_lengths.forEach((len) => {
        ret += other.repeat(len + 2);
        ret += mid;
    });
    // ╚═══════╩═══════════════════════════════════════╩════════
    ret = ret.slice(0, -mid.length);
    // ╚═══════╩═══════════════════════════════════════╩════════╝
    ret += right;
    return ret;
};
exports.createTableHorizontalBorders = createTableHorizontalBorders;
const createColumFromOnlyName = (name) => ({
    name,
    title: name,
});
exports.createColumFromOnlyName = createColumFromOnlyName;
const createColumFromComputedColumn = (column) => {
    var _a;
    return (Object.assign(Object.assign(Object.assign(Object.assign({ name: column.name, title: (_a = column.title) !== null && _a !== void 0 ? _a : column.name }, (0, input_converter_1.objIfExists)('color', column.color)), (0, input_converter_1.objIfExists)('maxLen', column.maxLen)), (0, input_converter_1.objIfExists)('minLen', column.minLen)), { alignment: column.alignment || table_constants_1.DEFAULT_ROW_ALIGNMENT }));
};
exports.createColumFromComputedColumn = createColumFromComputedColumn;
const createRow = (color, text, separator) => ({
    color,
    separator,
    text,
});
exports.createRow = createRow;
const findLenOfColumn = (column, rows, charLength) => {
    const columnId = column.name;
    const columnTitle = column.title;
    let length = max(0, (column === null || column === void 0 ? void 0 : column.minLen) || 0);
    if (column.maxLen) {
        // if customer input is mentioned a max width, lets see if all other can fit here
        // if others cant fit find the max word length so that at least the table can be printed
        length = max(length, max(column.maxLen, (0, string_utils_1.biggestWordInSentence)(columnTitle, charLength)));
        length = rows.reduce((acc, row) => max(acc, (0, string_utils_1.biggestWordInSentence)((0, exports.cellText)(row.text[columnId]), charLength)), length);
        return length;
    }
    length = max(length, (0, console_utils_1.findWidthInConsole)(columnTitle, charLength));
    rows.forEach((row) => {
        length = max(length, (0, console_utils_1.findWidthInConsole)((0, exports.cellText)(row.text[columnId]), charLength));
    });
    return length;
};
exports.findLenOfColumn = findLenOfColumn;
const renderTableHorizontalBorders = (style, column_lengths) => {
    const str = (0, exports.createTableHorizontalBorders)(style, column_lengths);
    return str;
};
exports.renderTableHorizontalBorders = renderTableHorizontalBorders;
const createHeaderAsRow = (createRowFn, columns) => {
    const headerColor = table_constants_1.DEFAULT_HEADER_FONT_COLOR;
    const row = createRowFn(headerColor, {}, false);
    columns.forEach((column) => {
        row.text[column.name] = column.title;
    });
    return row;
};
exports.createHeaderAsRow = createHeaderAsRow;
// { col1: ['How', 'Is', 'Going'], col2: ['I am', 'Tom'],  }
const getWidthLimitedColumnsArray = (columns, row, charLength) => {
    const ret = {};
    columns.forEach((column) => {
        ret[column.name] = (0, string_utils_1.splitTextIntoTextsOfMinLen)((0, exports.cellText)(row.text[column.name]), column.length || table_constants_1.DEFAULT_COLUMN_LEN, charLength);
    });
    return ret;
};
exports.getWidthLimitedColumnsArray = getWidthLimitedColumnsArray;


/***/ }),

/***/ 294:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wcswidth = exports.wcwidth = void 0;
const wcswidth_1 = __importDefault(__nccwpck_require__(717));
exports.wcswidth = wcswidth_1.default;
const wcwidth_1 = __importDefault(__nccwpck_require__(665));
exports.wcwidth = wcwidth_1.default;


/***/ }),

/***/ 508:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/* auxiliary function for binary search in interval table */
const bisearch = (ucs, table, tableSize) => {
    let min = 0;
    let mid;
    let max = tableSize;
    if (ucs < table[0].first || ucs > table[max].last)
        return 0;
    while (max >= min) {
        mid = Math.floor((min + max) / 2);
        if (ucs > table[mid].last) {
            min = mid + 1;
        }
        else if (ucs < table[mid].first) {
            max = mid - 1;
        }
        else {
            return 1;
        }
    }
    return 0;
};
exports["default"] = bisearch;


/***/ }),

/***/ 288:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/* sorted list of non-overlapping intervals of non-spacing characters */
/* generated by "uniset +cat=Me +cat=Mn +cat=Cf -00AD +1160-11FF +200B c" */
const combining = [
    { first: 0x0300, last: 0x036f },
    { first: 0x0483, last: 0x0486 },
    { first: 0x0488, last: 0x0489 },
    { first: 0x0591, last: 0x05bd },
    { first: 0x05bf, last: 0x05bf },
    { first: 0x05c1, last: 0x05c2 },
    { first: 0x05c4, last: 0x05c5 },
    { first: 0x05c7, last: 0x05c7 },
    { first: 0x0600, last: 0x0603 },
    { first: 0x0610, last: 0x0615 },
    { first: 0x064b, last: 0x065e },
    { first: 0x0670, last: 0x0670 },
    { first: 0x06d6, last: 0x06e4 },
    { first: 0x06e7, last: 0x06e8 },
    { first: 0x06ea, last: 0x06ed },
    { first: 0x070f, last: 0x070f },
    { first: 0x0711, last: 0x0711 },
    { first: 0x0730, last: 0x074a },
    { first: 0x07a6, last: 0x07b0 },
    { first: 0x07eb, last: 0x07f3 },
    { first: 0x0901, last: 0x0902 },
    { first: 0x093c, last: 0x093c },
    { first: 0x0941, last: 0x0948 },
    { first: 0x094d, last: 0x094d },
    { first: 0x0951, last: 0x0954 },
    { first: 0x0962, last: 0x0963 },
    { first: 0x0981, last: 0x0981 },
    { first: 0x09bc, last: 0x09bc },
    { first: 0x09c1, last: 0x09c4 },
    { first: 0x09cd, last: 0x09cd },
    { first: 0x09e2, last: 0x09e3 },
    { first: 0x0a01, last: 0x0a02 },
    { first: 0x0a3c, last: 0x0a3c },
    { first: 0x0a41, last: 0x0a42 },
    { first: 0x0a47, last: 0x0a48 },
    { first: 0x0a4b, last: 0x0a4d },
    { first: 0x0a70, last: 0x0a71 },
    { first: 0x0a81, last: 0x0a82 },
    { first: 0x0abc, last: 0x0abc },
    { first: 0x0ac1, last: 0x0ac5 },
    { first: 0x0ac7, last: 0x0ac8 },
    { first: 0x0acd, last: 0x0acd },
    { first: 0x0ae2, last: 0x0ae3 },
    { first: 0x0b01, last: 0x0b01 },
    { first: 0x0b3c, last: 0x0b3c },
    { first: 0x0b3f, last: 0x0b3f },
    { first: 0x0b41, last: 0x0b43 },
    { first: 0x0b4d, last: 0x0b4d },
    { first: 0x0b56, last: 0x0b56 },
    { first: 0x0b82, last: 0x0b82 },
    { first: 0x0bc0, last: 0x0bc0 },
    { first: 0x0bcd, last: 0x0bcd },
    { first: 0x0c3e, last: 0x0c40 },
    { first: 0x0c46, last: 0x0c48 },
    { first: 0x0c4a, last: 0x0c4d },
    { first: 0x0c55, last: 0x0c56 },
    { first: 0x0cbc, last: 0x0cbc },
    { first: 0x0cbf, last: 0x0cbf },
    { first: 0x0cc6, last: 0x0cc6 },
    { first: 0x0ccc, last: 0x0ccd },
    { first: 0x0ce2, last: 0x0ce3 },
    { first: 0x0d41, last: 0x0d43 },
    { first: 0x0d4d, last: 0x0d4d },
    { first: 0x0dca, last: 0x0dca },
    { first: 0x0dd2, last: 0x0dd4 },
    { first: 0x0dd6, last: 0x0dd6 },
    { first: 0x0e31, last: 0x0e31 },
    { first: 0x0e34, last: 0x0e3a },
    { first: 0x0e47, last: 0x0e4e },
    { first: 0x0eb1, last: 0x0eb1 },
    { first: 0x0eb4, last: 0x0eb9 },
    { first: 0x0ebb, last: 0x0ebc },
    { first: 0x0ec8, last: 0x0ecd },
    { first: 0x0f18, last: 0x0f19 },
    { first: 0x0f35, last: 0x0f35 },
    { first: 0x0f37, last: 0x0f37 },
    { first: 0x0f39, last: 0x0f39 },
    { first: 0x0f71, last: 0x0f7e },
    { first: 0x0f80, last: 0x0f84 },
    { first: 0x0f86, last: 0x0f87 },
    { first: 0x0f90, last: 0x0f97 },
    { first: 0x0f99, last: 0x0fbc },
    { first: 0x0fc6, last: 0x0fc6 },
    { first: 0x102d, last: 0x1030 },
    { first: 0x1032, last: 0x1032 },
    { first: 0x1036, last: 0x1037 },
    { first: 0x1039, last: 0x1039 },
    { first: 0x1058, last: 0x1059 },
    { first: 0x1160, last: 0x11ff },
    { first: 0x135f, last: 0x135f },
    { first: 0x1712, last: 0x1714 },
    { first: 0x1732, last: 0x1734 },
    { first: 0x1752, last: 0x1753 },
    { first: 0x1772, last: 0x1773 },
    { first: 0x17b4, last: 0x17b5 },
    { first: 0x17b7, last: 0x17bd },
    { first: 0x17c6, last: 0x17c6 },
    { first: 0x17c9, last: 0x17d3 },
    { first: 0x17dd, last: 0x17dd },
    { first: 0x180b, last: 0x180d },
    { first: 0x18a9, last: 0x18a9 },
    { first: 0x1920, last: 0x1922 },
    { first: 0x1927, last: 0x1928 },
    { first: 0x1932, last: 0x1932 },
    { first: 0x1939, last: 0x193b },
    { first: 0x1a17, last: 0x1a18 },
    { first: 0x1b00, last: 0x1b03 },
    { first: 0x1b34, last: 0x1b34 },
    { first: 0x1b36, last: 0x1b3a },
    { first: 0x1b3c, last: 0x1b3c },
    { first: 0x1b42, last: 0x1b42 },
    { first: 0x1b6b, last: 0x1b73 },
    { first: 0x1dc0, last: 0x1dca },
    { first: 0x1dfe, last: 0x1dff },
    { first: 0x200b, last: 0x200f },
    { first: 0x202a, last: 0x202e },
    { first: 0x2060, last: 0x2063 },
    { first: 0x206a, last: 0x206f },
    { first: 0x20d0, last: 0x20ef },
    { first: 0x302a, last: 0x302f },
    { first: 0x3099, last: 0x309a },
    { first: 0xa806, last: 0xa806 },
    { first: 0xa80b, last: 0xa80b },
    { first: 0xa825, last: 0xa826 },
    { first: 0xfb1e, last: 0xfb1e },
    { first: 0xfe00, last: 0xfe0f },
    { first: 0xfe20, last: 0xfe23 },
    { first: 0xfeff, last: 0xfeff },
    { first: 0xfff9, last: 0xfffb },
    { first: 0x10a01, last: 0x10a03 },
    { first: 0x10a05, last: 0x10a06 },
    { first: 0x10a0c, last: 0x10a0f },
    { first: 0x10a38, last: 0x10a3a },
    { first: 0x10a3f, last: 0x10a3f },
    { first: 0x1d167, last: 0x1d169 },
    { first: 0x1d173, last: 0x1d182 },
    { first: 0x1d185, last: 0x1d18b },
    { first: 0x1d1aa, last: 0x1d1ad },
    { first: 0x1d242, last: 0x1d244 },
    { first: 0xe0001, last: 0xe0001 },
    { first: 0xe0020, last: 0xe007f },
    { first: 0xe0100, last: 0xe01ef },
];
exports["default"] = combining;


/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const wcwidth_1 = __importDefault(__nccwpck_require__(665));
const mk_wcswidth = (pwcs) => {
    let width = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < pwcs.length; i++) {
        const charCode = pwcs.charCodeAt(i);
        const w = wcwidth_1.default(charCode);
        if (w < 0) {
            return -1;
        }
        width += w;
    }
    return width;
};
exports["default"] = mk_wcswidth;


/***/ }),

/***/ 665:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const non_spacing_chars_1 = __importDefault(__nccwpck_require__(288));
const binary_search_1 = __importDefault(__nccwpck_require__(508));
/* The following two functions define the column width of an ISO 10646
 * character as follows:
 *
 *    - The null character (U+0000) has a column width of 0.
 *
 *    - Other C0/C1 control characters and DEL will lead to a return
 *      value of -1.
 *
 *    - Non-spacing and enclosing combining characters (general
 *      category code Mn or Me in the Unicode database) have a
 *      column width of 0.
 *
 *    - SOFT HYPHEN (U+00AD) has a column width of 1.
 *
 *    - Other format characters (general category code Cf in the Unicode
 *      database) and ZERO WIDTH SPACE (U+200B) have a column width of 0.
 *
 *    - Hangul Jamo medial vowels and final consonants (U+1160-U+11FF)
 *      have a column width of 0.
 *
 *    - Spacing characters in the East Asian Wide (W) or East Asian
 *      Full-width (F) category as defined in Unicode Technical
 *      Report #11 have a column width of 2.
 *
 *    - All remaining characters (including all printable
 *      ISO 8859-1 and WGL4 characters, Unicode control characters,
 *      etc.) have a column width of 1.
 *
 * This implementation assumes that wchar_t characters are encoded
 * in ISO 10646.
 */
const mk_wcwidth = (ucs) => {
    /* test for 8-bit control characters */
    if (ucs === 0) {
        return 0;
    }
    if (ucs < 32 || (ucs >= 0x7f && ucs < 0xa0)) {
        return -1;
    }
    /* binary search in table of non-spacing characters */
    if (binary_search_1.default(ucs, non_spacing_chars_1.default, non_spacing_chars_1.default.length - 1)) {
        return 0;
    }
    /* if we arrive here, ucs is not a combining or C0/C1 control character */
    return (1 +
        Number(ucs >= 0x1100 &&
            (ucs <= 0x115f /* Hangul Jamo init. consonants */ ||
                ucs === 0x2329 ||
                ucs === 0x232a ||
                (ucs >= 0x2e80 && ucs <= 0xa4cf && ucs !== 0x303f) /* CJK ... Yi */ ||
                (ucs >= 0xac00 && ucs <= 0xd7a3) /* Hangul Syllables */ ||
                (ucs >= 0xf900 && ucs <= 0xfaff) /* CJK Compatibility Ideographs */ ||
                (ucs >= 0xfe10 && ucs <= 0xfe19) /* Vertical forms */ ||
                (ucs >= 0xfe30 && ucs <= 0xfe6f) /* CJK Compatibility Forms */ ||
                (ucs >= 0xff00 && ucs <= 0xff60) /* Fullwidth Forms */ ||
                (ucs >= 0xffe0 && ucs <= 0xffe6) ||
                (ucs >= 0x20000 && ucs <= 0x2fffd) ||
                (ucs >= 0x30000 && ucs <= 0x3fffd))));
};
exports["default"] = mk_wcwidth;


/***/ }),

/***/ 409:
/***/ ((__unused_webpack_module, __webpack_exports__, __nccwpck_require__) => {

/* harmony export */ __nccwpck_require__.d(__webpack_exports__, {
/* harmony export */   "S": () => (/* binding */ checkDependency)
/* harmony export */ });
const npmApi = 'https://registry.npmjs.org';
async function checkDependency(dependency) {
    try {
        const res = await fetch(`${npmApi}/${dependency}`);
        if (!res.ok) {
            return {
                package: dependency,
                latest: "unknown",
                date: "unknown"
            };
        }
        const metadata = await res.json();
        const latest = metadata["dist-tags"].latest;
        const date = metadata.time[latest];
        const next = metadata["dist-tags"].next;
        if (date) {
            if (next && metadata.time[next]) {
                return {
                    package: dependency,
                    latest,
                    date: date.split('T')[0] || "unknown",
                    next: next.length > 10 ? next.slice(0, 11) : next,
                    nextDate: metadata.time[next]?.split('T')[0]
                };
            }
            return {
                package: dependency,
                latest,
                date: date.split('T')[0] || "unknown"
            };
        }
    }
    catch {
        //fall through to return
    }
    return {
        package: dependency,
        latest: "unknown",
        date: "unknown"
    };
}


/***/ }),

/***/ 144:
/***/ ((module, __unused_webpack___webpack_exports__, __nccwpck_require__) => {

__nccwpck_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nccwpck_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(282);
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nccwpck_require__.n(process__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(17);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nccwpck_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _check_js__WEBPACK_IMPORTED_MODULE_4__ = __nccwpck_require__(409);
/* harmony import */ var _output_js__WEBPACK_IMPORTED_MODULE_3__ = __nccwpck_require__(768);





const filename = __nccwpck_require__.ab + "package.json";
let dependencies = [];
try {
    const data = (0,fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync)(__nccwpck_require__.ab + "package.json").toString();
    const pkg = JSON.parse(data);
    if (pkg.dependencies) {
        dependencies = [...Object.keys(pkg.dependencies)];
    }
    if (pkg.devDependencies) {
        dependencies = [...dependencies, ...Object.keys(pkg.devDependencies)];
    }
}
catch (e) {
    console.error('Error reading package.json', e);
    (0,process__WEBPACK_IMPORTED_MODULE_1__.exit)(1);
}
let metadata = await Promise.all(dependencies.map(async (dep) => await (0,_check_js__WEBPACK_IMPORTED_MODULE_4__/* .checkDependency */ .S)(dep)));
//filter out dependencies that failed lookup
metadata = metadata.filter((d) => d.date != "undefined");
if (metadata.length == 0) {
    console.error('Dependency lookup failed');
    (0,process__WEBPACK_IMPORTED_MODULE_1__.exit)(1);
}
(0,_output_js__WEBPACK_IMPORTED_MODULE_3__/* .outputTable */ .c)(metadata);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ 768:
/***/ ((__unused_webpack_module, __webpack_exports__, __nccwpck_require__) => {

/* harmony export */ __nccwpck_require__.d(__webpack_exports__, {
/* harmony export */   "c": () => (/* binding */ outputTable)
/* harmony export */ });
/* harmony import */ var console_table_printer__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(642);
/* harmony import */ var console_table_printer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nccwpck_require__.n(console_table_printer__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nccwpck_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);


function outputTable(metadata) {
    const table = new console_table_printer__WEBPACK_IMPORTED_MODULE_0__.Table({
        columns: [
            { name: 'package', alignment: 'left' },
            { name: 'latest' },
            { name: 'date' },
            { name: 'next' },
            { name: 'nextDate' }
        ],
        sort: (row1, row2) => row1.package.localeCompare(row2.package)
    });
    const colorize = (dep, cutoff) => {
        const d = new Date(dep.date);
        if (d > cutoff) {
            return 'green';
        }
        if (dep.nextDate) {
            const n = new Date(dep.nextDate);
            if (n > cutoff) {
                return 'cyan';
            }
        }
        return 'red';
    };
    let lstYear = new Date(Date.now());
    lstYear.setFullYear(lstYear.getFullYear() - 1);
    metadata.forEach((dep) => {
        table.addRow(dep, { color: colorize(dep, lstYear) });
    });
    const tableOutput = table.render();
    if (process.env.GITHUB_STEP_SUMMARY) {
        const summary = "```\n" + tableOutput + "\n```\n";
        (0,fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync)(process.env.GITHUB_STEP_SUMMARY, summary);
    }
    else {
        console.log(tableOutput);
    }
}


/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 282:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("process");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && !queue.d) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__nccwpck_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = 1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nccwpck_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__nccwpck_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __nccwpck_require__(144);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 

//# sourceMappingURL=index.js.map