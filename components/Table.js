import React from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import {
    ChevronDoubleLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleRightIcon
} from "@heroicons/react/20/solid";
import { Button, PageButton } from "./Button";
import { classNames } from "../utils";
import { SortIcon, SortUpIcon, SortDownIcon } from "./Icons";

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id, render }
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach(row => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <label className="flex items-baseline gap-x-2">
            <span className="text-gray-700">{render("Header")}: </span>
            <select
                className="rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                name={id}
                id={id}
                value={filterValue}
                onChange={e => {
                    setFilter(e.target.value || undefined);
                }}
            >
                <option value="">All</option>
                {options.map((option, i) => (
                    <option key={i} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}

export function StatusPill({ value }) {
    const status = value ? value.toLowerCase() : "unknown";

    return (
        <span
            className={classNames(
                "leading-wide rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm",
                status.startsWith("active") ? "bg-green-100 text-green-800" : null,
                status.startsWith("inactive") ? "bg-yellow-100 text-yellow-800" : null,
                status.startsWith("offline") ? "bg-red-100 text-red-800" : null
            )}
        >
            {status}
        </span>
    );
}

export function AvatarCell({ value, column, row }) {
    return (
        <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
                <img
                    className="h-10 w-10 rounded-full"
                    src={row.original[column.imgAccessor]}
                    alt=""
                />
            </div>
            <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{value}</div>
                <div className="text-sm text-gray-500">{row.original[column.emailAccessor]}</div>
            </div>
        </div>
    );
}

function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        footerGroups,
        state
    } = useTable(
        {
            columns,
            data
        },
        useFilters, // useFilters!
        useSortBy,
        usePagination // new
    );

    // Render the UI for your table
    return (
        <>
            <div className="sm:flex sm:gap-x-2">
                {headerGroups.map(headerGroup =>
                    headerGroup.headers.map(column =>
                        column.Filter ? (
                            <div className="mt-2 sm:mt-0" key={column.id}>
                                {column.render("Filter")}
                            </div>
                        ) : null
                    )
                )}
            </div>
            {/* table */}
            <div className="mt-2 flex flex-col">
                <div className="overflow-x-auto lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                            <table
                                {...getTableProps()}
                                className="relative w-full table-auto border-collapse overflow-hidden rounded-lg bg-slate-50 shadow-md shadow-gray-200"
                            >
                                <thead className="bg-gray-50">
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th
                                                    scope="col"
                                                    className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                                    {...column.getHeaderProps(
                                                        column.getSortByToggleProps()
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        {column.render("Header")}
                                                        {/* Add a sort direction indicator */}
                                                        <span>
                                                            {column.isSorted ? (
                                                                column.isSortedDesc ? (
                                                                    <SortDownIcon className="h-4 w-4 text-gray-400" />
                                                                ) : (
                                                                    <SortUpIcon className="h-4 w-4 text-gray-400" />
                                                                )
                                                            ) : (
                                                                <SortIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                                            )}
                                                        </span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody
                                    {...getTableBodyProps()}
                                    className="divide-y divide-gray-200 bg-white"
                                >
                                    {page.map((row, i) => {
                                        // new
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()}>
                                                {row.cells.map(cell => {
                                                    return (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            className="whitespace-nowrap px-6 py-4"
                                                            role="cell"
                                                        >
                                                            <div className="text-left text-sm text-gray-500">
                                                                {cell.render("Cell")}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    {footerGroups.map(group => (
                                        <tr {...group.getFooterGroupProps()}>
                                            {group.headers.map(column => (
                                                <td
                                                    {...column.getFooterProps()}
                                                    className="whitespace-nowrap px-6 py-4 text-left"
                                                    role="cell"
                                                >
                                                    {column.render("Footer")}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between py-3">
                <div className="flex flex-1 justify-between sm:hidden">
                    <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </Button>
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div className="flex items-baseline gap-x-2">
                        <span className="text-sm text-gray-700">
                            Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
                            <span className="font-medium">{pageOptions.length}</span>
                        </span>
                        <label>
                            <span className="sr-only">Items Per Page</span>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-300 focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                                value={state.pageSize}
                                onChange={e => {
                                    setPageSize(Number(e.target.value));
                                }}
                            >
                                {[5, 10, 20].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <nav
                            className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                            aria-label="Pagination"
                        >
                            <PageButton
                                className="rounded-l-md"
                                onClick={() => gotoPage(0)}
                                disabled={!canPreviousPage}
                            >
                                <span className="sr-only">First</span>
                                <ChevronDoubleLeftIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </PageButton>
                            <PageButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </PageButton>
                            <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </PageButton>
                            <PageButton
                                className="rounded-r-md"
                                onClick={() => gotoPage(pageCount - 1)}
                                disabled={!canNextPage}
                            >
                                <span className="sr-only">Last</span>
                                <ChevronDoubleRightIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </PageButton>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Table;
