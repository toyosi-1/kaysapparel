"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ruler } from "lucide-react";

const DEFAULT_SIZE_GUIDE = [
  { size: "S", bust: "34-36", waist: "26-28", hip: "36-38", length: "38-40" },
  { size: "M", bust: "36-38", waist: "28-30", hip: "38-40", length: "39-41" },
  { size: "L", bust: "38-40", waist: "30-32", hip: "40-42", length: "40-42" },
  { size: "XL", bust: "40-42", waist: "32-34", hip: "42-44", length: "41-43" },
];

interface SizeGuideProps {
  sizes?: string[];
}

export function SizeGuide({ sizes }: SizeGuideProps) {
  const guide = sizes
    ? DEFAULT_SIZE_GUIDE.filter((row) => sizes.map((s) => s.toUpperCase()).includes(row.size))
    : DEFAULT_SIZE_GUIDE;

  return (
    <Dialog>
      <DialogTrigger>
        <span className="text-xs text-[#6B4C3B] underline underline-offset-2 hover:text-[#5a3f31] font-medium cursor-pointer">
          Size Guide
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Ruler className="h-4 w-4" />
            Size Guide
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground mb-3">
          Measurements are in inches. If you are between sizes, we recommend sizing up.
        </p>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-xs font-semibold">Size</TableHead>
                <TableHead className="text-xs font-semibold">Bust</TableHead>
                <TableHead className="text-xs font-semibold">Waist</TableHead>
                <TableHead className="text-xs font-semibold">Hip</TableHead>
                <TableHead className="text-xs font-semibold">Length</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guide.map((row) => (
                <TableRow key={row.size}>
                  <TableCell className="text-xs font-semibold">{row.size}</TableCell>
                  <TableCell className="text-xs">{row.bust}</TableCell>
                  <TableCell className="text-xs">{row.waist}</TableCell>
                  <TableCell className="text-xs">{row.hip}</TableCell>
                  <TableCell className="text-xs">{row.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
