import { getMetadataArgsStorage } from "../..";
/**
 * This column will store a delete flag of the soft-deleted object.
 * This flag is being updated each time you soft-delete the object.
 */
export function DeleteColumn(options) {
    return function (object, propertyName) {
        getMetadataArgsStorage().columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: "delete",
            options: options || {}
        });
    };
}

//# sourceMappingURL=DeleteColumn.js.map
