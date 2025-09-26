import { WaterMeterData } from "@srms/lib/watermeters/types";
import { FunctionComponent, useEffect } from "react";
import { Button } from "@srms/components/ui/Button";
import { MapPinned } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@srms/components/ui-custom/Tables/DataTable/DataTable";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useTableStore } from "@srms/components/stores/useTableStore";
import { isEmpty } from "@srms/utils/isEmpty";
import { DataTableColumnFilter } from "@srms/components/ui-custom/Tables/DataTable/DataTableColumnFilter";
import { useWaterMeterStore } from "@srms/components/stores/useWaterMeterStore";
import { useFleetMap } from "./contexts/useFleetMapContext";
import { View } from "ol";
import { useCardStore } from "@srms/components/stores/useCardStore";
import React from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { Point } from "ol/geom";
import { createMarkerStyles } from "./utils/createMarkerStyles";
import { MarkerStyles } from "@srms/server/types";

interface WaterMeterTableProps {
  open: boolean;
}

const featureManager = new FeatureManager();

const WaterMeterTable: FunctionComponent<WaterMeterTableProps> = ({ open }) => {
  const {
    paginationState,
    columnFiltersState,
    setColumnFiltersState,
    tableLoadingState,
    setTableLoadingState,
  } = useTableStore();

  const { waterMeters, setWaterMeters, setSelectedWaterMeter } = useWaterMeterStore();

  const {
    waterMeterDetailsCardOpen,
    setWaterMeterDetailsCardOpen,
    waterMeterTableCardOpen,
    setWaterMeterTableCardOpen,
  } = useCardStore();

  const fleetMap = useFleetMap();

  // Get location details of device. Success will set the marker and add to map.
  const waterMeterMutation = useMutation({
    mutationKey: ["water-meters"],
    mutationFn: async () => {
      if (!isEmpty(columnFiltersState)) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumers/water-meters/${paginationState.pageIndex}/${paginationState.pageSize}`,
          columnFiltersState,
        );

        return response.data;
      } else {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumers/water-meters/0/${paginationState.pageSize}`,
        );

        return response.data;
      }
    },
    onMutate: () => {
      setTableLoadingState(true);
    },
    onSuccess: async (data) => {
      setWaterMeters(data);

      const timer = setTimeout(() => {
        setTableLoadingState(false);
      }, 1000);

      return () => clearTimeout(timer);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });

  // Action after clicking the location button in each row
  const panToMeterLocation = (row: WaterMeterData) => {
    // set value of water meter details card
    setSelectedWaterMeter(row);

    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer();

    const feature = featureManager.createFeature(new Point(row.geometry.coordinates));

    vectorSource.addFeature(feature);

    const wmStyles = {
      radius: 5,
      fillColor: "rgb(245, 73, 39, 1.0)",
      strokeColor: "rgb(191, 36, 0, 1.0)",
      strokeWidth: 1,
    };

    const featureStyle = createMarkerStyles(wmStyles as MarkerStyles);
    feature.setStyle(featureStyle.markerStyle);

    vectorLayer.setSource(vectorSource);

    vectorLayer.setVisible(true);

    vectorLayer.setZIndex(996);

    vectorLayer.setProperties({ id: row.id });

    fleetMap.mapManager.getLayerManager().addLayer(`water-meter-${row.id}`, vectorLayer);

    // move the screen view to the vehicle location as center
    const wmCoordinates = new View({
      center: [row.geometry.coordinates[0]!, row.geometry.coordinates[1]!],
      zoom: 18,
    });
    fleetMap.mapManager.getMap().setView(wmCoordinates);

    // clear table column filters
    setColumnFiltersState([]);

    // close the table card and open the details card
    setWaterMeterTableCardOpen(!waterMeterTableCardOpen);
    setWaterMeterDetailsCardOpen(!waterMeterDetailsCardOpen);
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
    if (open) {
      waterMeterMutation.mutate();
    }
  }, [open, columnFiltersState, paginationState]);

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        data={waterMeters?.features || []}
        title={""}
        enableGlobalFilter={false}
        enablePagination={true}
        loading={tableLoadingState}
        manualPagination={true}
        manualFiltering={true}
        rowCount={waterMeters?.totalFeatures || 0}
        pageSize={50}
        sticky={true}
        fixedHeight={"h-80"}
      />
    </React.Fragment>
  );
};

export default WaterMeterTable;
