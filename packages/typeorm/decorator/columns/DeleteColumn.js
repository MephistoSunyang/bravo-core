"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
/**
 * This column will store a delete flag of the soft-deleted object.
 * This flag is being updated each time you soft-delete the object.
 */
function DeleteColumn(options) {
    return function (object, propertyName) {
        __1.getMetadataArgsStorage().columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: "delete",
            options: options || {}
        });
    };
}
exports.DeleteColumn = DeleteColumn;

//# sourceMappingURL=DeleteColumn.js.map
