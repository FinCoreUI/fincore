import React from "react";
import type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
} from "../types";

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="fc-table-container">
        <table ref={ref} className={["fc-table", className].filter(Boolean).join(" ")} {...props}>
          {children}
        </table>
      </div>
    );
  },
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead ref={ref} className={["fc-table__header", className].filter(Boolean).join(" ")} {...props}>
        {children}
      </thead>
    );
  },
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    );
  },
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr ref={ref} className={["fc-table__row", className].filter(Boolean).join(" ")} {...props}>
        {children}
      </tr>
    );
  },
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <th ref={ref} className={["fc-table__th", className].filter(Boolean).join(" ")} {...props}>
        {children}
      </th>
    );
  },
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <td ref={ref} className={["fc-table__td", className].filter(Boolean).join(" ")} {...props}>
        {children}
      </td>
    );
  },
);
TableCell.displayName = "TableCell";

export default Table;

