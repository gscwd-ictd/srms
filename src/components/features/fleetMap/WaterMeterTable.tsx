import { WaterMeterData } from "@srms/lib/watermeters/types";
import { FunctionComponent, useEffect } from "react";
import { Button } from "@srms/components/ui/Button";
import { MapPinned } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@srms/components/ui-custom/Tables/DataTable/DataTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTableStore } from "@srms/components/stores/useTableStore";
import { isEmpty } from "@srms/utils/isEmpty";
import { DataTableColumnFilter } from "@srms/components/ui-custom/Tables/DataTable/DataTableColumnFilter";

interface WaterMeterTableProps {
  open: boolean;
}

const WaterMeterTable: FunctionComponent<WaterMeterTableProps> = ({ open }) => {
  const { paginationState, columnFiltersState } = useTableStore();

  const { data: consumersWaterMeter, fetchStatus: fStatusConsumersWaterMeter } = useQuery({
    queryKey: ["consumers-water-meter-details", paginationState?.pageIndex, paginationState?.pageSize],
    refetchOnReconnect: false,
    enabled: open && !isEmpty(paginationState) ? true : false,
    retry: 5,
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumers/water-meters/${paginationState.pageIndex}/${paginationState.pageSize}`,
      );

      return response.data;
    },
    throwOnError: true,
  });

  const panToMeterLocation = (row: WaterMeterData) => {
    console.log(row.geometry.coordinates);
  };

  const columns: ColumnDef<WaterMeterData>[] = [
    {
      accessorKey: "geometry",
      header: "",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ cell }) => {
        if (cell.row.original.geometry.coordinates === null) {
          return <div> -- </div>;
        } else {
          return (
            <Button onClick={() => panToMeterLocation(cell.row.original)}>
              <MapPinned />
            </Button>
          );
        }
      },
    },
    {
      accessorKey: "properties.accountno",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Account No." />,
    },
    {
      accessorKey: "properties.meterno",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Meter No." />,
    },
    {
      accessorKey: "properties.consumern",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Consumer" />,
    },
    {
      accessorKey: "properties.address",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Address" />,
    },
    {
      accessorKey: "properties.datecon",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Date of Connection" />,
      cell: ({ cell }) => {
        if (cell.row.original.properties.datecon === null) {
          return <div> -- </div>;
        } else {
          return <div className="text-left">{cell.row.original.properties.datecon}</div>;
        }
      },
    },
    {
      accessorKey: "properties.status",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Address" />,
    },
    {
      accessorKey: "properties.consumert",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Consumer Type" />,
    },
  ];

  useEffect(() => {
    if (!isEmpty(columnFiltersState)) {
      console.log(columnFiltersState);
    }
  }, [columnFiltersState]);

  return (
    <DataTable
      columns={columns}
      data={consumersWaterMeter?.features || []}
      title={""}
      enableGlobalFilter={false}
      enablePagination={true}
      loading={fStatusConsumersWaterMeter === "fetching" ? true : false}
      manualPagination={true}
      manualFiltering={false}
      rowCount={consumersWaterMeter?.totalFeatures || 0}
      pageSize={500}
    />
  );
};

export default WaterMeterTable;
