import React from "react";
import { FunctionComponent, useEffect } from "react";
import { Button } from "@srms/components/ui/Button";
import { MapPinned } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@srms/components/ui-custom/Tables/DataTable/DataTable";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useTableStore } from "@srms/components/stores/useTableStore";
import { DataTableColumnFilter } from "@srms/components/ui-custom/Tables/DataTable/DataTableColumnFilter";
// import { useFleetMap } from "./contexts/useFleetMapContext";
// import { View } from "ol";
// import VectorSource from "ol/source/Vector";
// import VectorLayer from "ol/layer/Vector";
// import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
// import { Point } from "ol/geom";
// import { createMarkerStyles } from "./utils/createMarkerStyles";
// import { MarkerStyles } from "@srms/server/types";
import { ConsumerTcms } from "@srms/lib/tcms/types";
import { useConsumerStore } from "@srms/components/stores/useConsumerStore";
import { DateFormatter } from "@srms/utils/dateFormatter";
import { useWaterMeterStore } from "@srms/components/stores/useWaterMeterStore";
import { useCardStore } from "@srms/components/stores/useCardStore";

interface WaterMeterTableProps {
  open: boolean;
}

// const featureManager = new FeatureManager();

const ConsumersTable: FunctionComponent<WaterMeterTableProps> = ({ open }) => {
  const {
    paginationState,
    columnFiltersState,
    // setColumnFiltersState,
    tableLoadingState,
    setTableLoadingState,
  } = useTableStore();

  const { setSelectedWaterMeter } = useWaterMeterStore();

  const { consumers, setConsumers, setConsumerTcms } = useConsumerStore();

  const {
    consumerDetailsCardOpen,
    setConsumerDetailsCardOpen,
    consumersTableCardOpen,
    setConsumersTableCardOpen,
  } = useCardStore();

  // Get list of customers from TCMS
  const consumersMutation = useMutation({
    mutationKey: ["consumer-list"],
    mutationFn: async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumers/${paginationState?.pageIndex}/${paginationState?.pageSize}`,
        columnFiltersState,
      );

      return response.data;
    },
    onMutate: () => {
      setTableLoadingState(true);
    },
    onSuccess: async (data) => {
      setConsumers(data);

      const timer = setTimeout(() => {
        setTableLoadingState(false);
      }, 1000);

      return () => clearTimeout(timer);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setTableLoadingState(false);
      console.log(error);
    },
  });

  // Get water meter details from geoserver
  const waterMeterLocationMutation = useMutation({
    mutationKey: ["water-meter-location"],
    mutationFn: async (accountNo: string) => {
      const filter = [
        {
          value: accountNo,
          id: "accountno",
        },
      ];

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumers/water-meters/0/1`,
        filter,
      );

      return response.data;
    },
    onSuccess: async (data) => {
      setSelectedWaterMeter(data.features[0]);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });

  // Action after clicking the location button in each row
  const panToMeterLocation = (row: ConsumerTcms) => {
    // set initial details of consumer
    setConsumerTcms(row);

    // look up location of water meter
    waterMeterLocationMutation.mutate(row.account_no);

    // close the table card and open the details card
    setConsumersTableCardOpen(!consumersTableCardOpen);
    setConsumerDetailsCardOpen(!consumerDetailsCardOpen);
  };

  const columns: ColumnDef<ConsumerTcms>[] = [
    {
      header: " ",
      cell: ({ row }) => {
        return (
          <Button onClick={() => panToMeterLocation(row.original)}>
            <MapPinned />
          </Button>
        );
      },
    },
    {
      accessorKey: "account_no",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Account No." />,
    },
    {
      accessorKey: "meter_no",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Meter No." />,
    },
    {
      accessorKey: "consumer_name",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Consumer" />,
    },
    {
      accessorKey: "address",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Address" />,
    },
    {
      accessorKey: "date_connected",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Date of Connection" />,
      cell: ({ cell }) => {
        return (
          <div className="text-left">
            {DateFormatter(cell.row.original.date_connected, "YYYY-MM-DD", "--")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Status" />,
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnFilter column={column} title="Consumer Type" />,
    },
  ];

  useEffect(() => {
    if (open) {
      consumersMutation.mutate();
    }
  }, [open, columnFiltersState, paginationState]);

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        data={consumers.consumers || []}
        title={""}
        enableGlobalFilter={false}
        enablePagination={true}
        loading={tableLoadingState}
        manualPagination={true}
        manualFiltering={true}
        rowCount={consumers.totalPages || 0}
        pageSize={100}
        sticky={true}
        fixedHeight={"h-85"}
        autoResetPageIndex={false}
      />
    </React.Fragment>
  );
};

export default ConsumersTable;
