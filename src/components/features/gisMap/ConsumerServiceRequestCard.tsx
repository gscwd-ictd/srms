import { useConsumerStore } from "@srms/components/stores/useConsumerStore";
import { useWaterMeterStore } from "@srms/components/stores/useWaterMeterStore";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { Button } from "@srms/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@srms/components/ui/Dialog";
import { Field, FieldLabel } from "@srms/components/ui/Field";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@srms/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@srms/components/ui/Table";
import { ConsumerServiceRequests } from "@srms/lib/tcms/types";
import { DateFormatter } from "@srms/utils/dateFormatter";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { FunctionComponent, useEffect, useState } from "react";

interface ConsumerServiceRequestCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}

type CSRParamsType = {
  accountNo: string;
  selectedYear: string;
};

const ConsumerServiceRequestCard: FunctionComponent<ConsumerServiceRequestCardProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>(dayjs().year().toString());
  const [loadingServiceRequests, setLoadingServiceRequests] = useState<boolean>(false);

  // zustand initialization
  const { selectedWaterMeter } = useWaterMeterStore();
  const { consumerInformation, consumerServiceRequests, setConsumerServiceRequests } = useConsumerStore();

  // Get the selected customers previous year carry-over bill
  const { mutateAsync: getConsumerServiceRequests } = useMutation({
    mutationKey: ["consumer-service-requests"],
    mutationFn: async (params: CSRParamsType) => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumer/service-request?accountNo=${params.accountNo}&year=${params.selectedYear}`,
        {},
      );

      return response.data;
    },
    onMutate: () => {
      setLoadingServiceRequests(true);
    },
    onSuccess: async (data) => {
      console.log(data);
      setConsumerServiceRequests(data);
      setLoadingServiceRequests(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });

  const changeSRYear = (year: string) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    setConsumerServiceRequests([] as ConsumerServiceRequests);

    if (open) {
      const params: CSRParamsType = {
        accountNo: `${selectedWaterMeter.properties?.accountno}`,
        selectedYear: `${selectedYear}`,
      };
      getConsumerServiceRequests(params);
    } else {
      setSelectedYear(dayjs().year().toString());
    }
  }, [open, selectedYear]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ui-color-base primary-text-color z-80 sm:max-w-9/12">
        <DialogHeader>
          <DialogTitle>Customer Service Requests</DialogTitle>
          <DialogDescription>
            Account No: {consumerInformation.account_no || "--"} | Meter No:{" "}
            {consumerInformation.meter_no || "--"}
          </DialogDescription>
        </DialogHeader>
        <div className="pb-5">
          <div className="flex justify-end">
            <Field className="w-30">
              <FieldLabel htmlFor="year-field">Year</FieldLabel>
              <Select defaultValue={selectedYear} onValueChange={changeSRYear}>
                <SelectTrigger id="year-field">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  {/* previous 15 years */}
                  {[...Array(15).keys()].map((key) => (
                    <SelectItem key={key} value={(dayjs().year() - key).toString()}>
                      {dayjs().year() - key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>

        {loadingServiceRequests ? (
          <Spinner className="text-primary my-4 size-20" size={"lg"} />
        ) : (
          <ScrollArea className="h-120 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Ref No</TableHead>
                  <TableHead>Timestamp Received</TableHead>
                  <TableHead>Particulars</TableHead>
                  <TableHead>Executed By</TableHead>
                  <TableHead>Timestamp Started</TableHead>
                  <TableHead>Timestamp Finished</TableHead>
                  <TableHead className="text-right">Hours Consumed</TableHead>
                  <TableHead>Action Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumerServiceRequests.length == 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="p-6 text-center">
                      No Records Found
                    </TableCell>
                  </TableRow>
                ) : (
                  consumerServiceRequests.map((serviceRequest, index) => (
                    <TableRow key={index + 1}>
                      <TableCell className="font-medium">{serviceRequest.jo_no}</TableCell>
                      <TableCell>{DateFormatter(serviceRequest.datetime_received, "", "")}</TableCell>
                      <TableCell>{serviceRequest.particulars}</TableCell>
                      <TableCell>{serviceRequest.prepared_by}</TableCell>
                      <TableCell>{DateFormatter(serviceRequest.datetime_start_acc, "", "")}</TableCell>
                      <TableCell>{DateFormatter(serviceRequest.datetime_finish_acc, "", "")}</TableCell>
                      <TableCell className="text-right">{serviceRequest.time_consumed_HOUR}</TableCell>
                      <TableCell>{serviceRequest.action_taken}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        <DialogFooter>
          {/* <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose> */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="default">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsumerServiceRequestCard;
