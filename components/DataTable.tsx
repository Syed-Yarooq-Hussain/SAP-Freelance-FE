"use client";

import * as React from "react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export type DataTableProps<T> = {
    title: string;
    columns: GridColDef[];
    rows: T[];
    pageSize?: number;
    autoHeight?: boolean;
};

export default function DataTable<T>({
    title,
    columns,
    rows,
    pageSize = 10,
}: DataTableProps<T>) {
    return (
        <Card>
            <CardHeader title={title} />
            <CardContent>
                <div style={{ width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[pageSize]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize },
                            },
                        }}
                        disableRowSelectionOnClick
                    />
                </div>
            </CardContent>
        </Card>
    );
}
