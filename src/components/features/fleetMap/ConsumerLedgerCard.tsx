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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@srms/components/ui/Table";
import { ConsumerLedger } from "@srms/lib/tcms/types";
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
  const { setConsumerLedger, consumerLedger } = useConsumerStore();

  const { mutateAsync: getConsumerLedger } = useMutation({
    mutationKey: ["consumer-ledger"],
    mutationFn: async (accountNo: string) => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumer/ledger?accountNo=${accountNo}&year=${dayjs().year() - 1}`,
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

  useEffect(() => {
    setConsumerLedger([] as ConsumerLedger);

    if (open) {
      getConsumerLedger(selectedWaterMeter.properties?.accountno);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>Ledger</DialogTitle>
          <DialogDescription>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref No</TableHead>
                  <TableHead>Ref Date</TableHead>
                  <TableHead>Particulars</TableHead>
                  <TableHead className="text-right">Present</TableHead>
                  <TableHead className="text-right">Previous</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Executed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Forwarded Balance from previous year */}
                <TableRow key="1">
                  <TableCell className="font-medium">1</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell className="text-right">4</TableCell>
                </TableRow>

                {/* {invoices.map((invoice) => ( */}
                <TableRow key="2">
                  <TableCell className="font-medium">1</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell className="text-right">4</TableCell>
                </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
            {JSON.stringify(consumerLedger)}
          </DialogDescription>
        </DialogHeader>
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
