import { useConsumerStore } from "@srms/components/stores/useConsumerStore";
import { useWaterMeterStore } from "@srms/components/stores/useWaterMeterStore";
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@srms/components/ui/Table";
import { ConsumerLedger, ConsumerLedgerEntry } from "@srms/lib/tcms/types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { FunctionComponent, useEffect } from "react";

interface ConsumerLedgerCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}

const ConsumerLedgerCard: FunctionComponent<ConsumerLedgerCardProps> = ({ open, onOpenChange }) => {
  // zustand initialization
  const { selectedWaterMeter } = useWaterMeterStore();
  const {
    consumerInformation,
    consumerLedger,
    setConsumerLedger,
    ledgerPrevYearLastEntry,
    setLedgerPrevYearLastEntry,
  } = useConsumerStore();

  // Get the selected customers previous year carry-over bill
  const { mutateAsync: getConsumerLedger } = useMutation({
    mutationKey: ["consumer-ledger"],
    mutationFn: async (accountNo: string) => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumer/ledger?accountNo=${accountNo}&year=${dayjs().year()}`,
        {},
      );

      return response.data;
    },
    onSuccess: async (data) => {
      console.log(data);
      setConsumerLedger(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });

  // Get the selected customers current billing
  const { mutateAsync: getLedgerPrevYearLastEntry } = useMutation({
    mutationKey: ["ledger-previous-year-last-entry"],
    mutationFn: async (accountNo: string) => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumer/last-ledger-entry?accountNo=${accountNo}&year=${dayjs().year() - 1}`,
        {},
      );

      return response.data;
    },
    onSuccess: async (data) => {
      console.log(data);
      setLedgerPrevYearLastEntry(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });

  useEffect(() => {
    setConsumerLedger([] as ConsumerLedger);
    setLedgerPrevYearLastEntry({} as ConsumerLedgerEntry);

    if (open) {
      getConsumerLedger(selectedWaterMeter.properties?.accountno);
      getLedgerPrevYearLastEntry(selectedWaterMeter.properties?.accountno);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-9/12">
        <DialogHeader>
          <DialogTitle>Customer Ledger</DialogTitle>
          <DialogDescription>
            Account No: {consumerInformation.account_no || "--"} | Meter No:{" "}
            {consumerInformation.meter_no || "--"}
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Ref No</TableHead>
              <TableHead>Ref Date</TableHead>
              <TableHead>Particulars</TableHead>
              <TableHead>Executed</TableHead>
              <TableHead className="text-right">Present</TableHead>
              <TableHead className="text-right">Previous</TableHead>
              <TableHead className="text-right">Usage</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Forwarded Balance from previous year */}
            <TableRow key="0">
              <TableCell className="font-medium">xxx0</TableCell>
              <TableCell>
                {ledgerPrevYearLastEntry.billing_year + "/" + ledgerPrevYearLastEntry.billing_month}
              </TableCell>
              <TableCell>Forwarded Balance&#40;{ledgerPrevYearLastEntry.billing_year}&#41;</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">xx</TableCell>
              <TableCell className="text-right">xx</TableCell>
              <TableCell className="text-right">{ledgerPrevYearLastEntry.usage}</TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right">{ledgerPrevYearLastEntry.payment}</TableCell>
              <TableCell className="text-right">{ledgerPrevYearLastEntry.total_balance}</TableCell>
            </TableRow>

            {consumerLedger.map((ledgerEntry, index) => (
              <TableRow key={index + 1}>
                <TableCell className="font-medium">xxx{index + 1}</TableCell>
                <TableCell>{ledgerEntry.billing_year + "/" + ledgerEntry.billing_month}</TableCell>
                <TableCell>Particulars details</TableCell>
                <TableCell>Executed by Employee XXXX</TableCell>
                <TableCell className="text-right">xx</TableCell>
                <TableCell className="text-right">xx</TableCell>
                <TableCell className="text-right">{ledgerEntry.usage}</TableCell>
                <TableCell className="text-right">{ledgerEntry.payment}</TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-right">{ledgerEntry.total_balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="text-xl">
              <TableCell className="text-right font-medium" colSpan={8}>
                TOTAL
              </TableCell>
              <TableCell className="text-right" colSpan={2}>
                ₱ {Number(consumerLedger[consumerLedger.length - 1]?.total_balance).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsumerLedgerCard;
