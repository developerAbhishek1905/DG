import {
  ArrowLeft,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppSelector,
} from "../../../app/hooks";

import {
  getReport,
} from "../services/reportApi";

import type {
  ReportData,
  ReportType,
} from "../types/report.types";

import ExportButtons from "./ExportButtons";
import ReportChart from "./ReportChart";
import ReportFilters from "./ReportFilters";
import ReportSummary from "./ReportSummary";
import ReportTable from "./ReportTable";

interface Props {
  type: ReportType;

  statuses?: string[];
}

export default function ReportPageLayout({
  type,
  statuses,
}: Props) {
  const navigate =
    useNavigate();

  const { filters } =
    useAppSelector(
      (state) =>
        state.reports
    );

  const [
    data,
    setData,
  ] =
    useState<
      ReportData | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    const load =
      async () => {
        try {
          setLoading(
            true
          );

          const response =
            await getReport({
              type,
              filters,
            });

          setData(
            response
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    load();
  }, [
    type,
    filters.period,
    filters.dateFrom,
    filters.dateTo,
  ]);

  const filteredRows =
    useMemo(() => {
      if (!data) {
        return [];
      }

      const query =
        filters.search
          .trim()
          .toLowerCase();

      return data.rows.filter(
        (row) => {
          const matchesSearch =
            !query ||
            Object.values(
              row
            ).some(
              (value) =>
                String(
                  value ??
                    ""
                )
                  .toLowerCase()
                  .includes(
                    query
                  )
            );

          const matchesStatus =
            filters.status ===
              "ALL" ||
            String(
              row.status ??
                ""
            ) ===
              filters.status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      data,
      filters.search,
      filters.status,
    ]);

  if (
    loading &&
    !data
  ) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Loading report...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center text-sm text-red-600">
        Unable to load
        report.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate(
            "/reports"
          )
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft
          size={17}
        />

        All Reports
      </button>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {
              data.title
            }
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {
              data.description
            }
          </p>
        </div>

        <ExportButtons
          title={
            data.title
          }
          columns={
            data.columns
          }
          rows={
            filteredRows
          }
        />
      </div>

      <ReportSummary
        items={
          data.summary
        }
      />

      <ReportFilters
        statuses={
          statuses
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ReportTable
            columns={
              data.columns
            }
            rows={
              filteredRows
            }
          />
        </div>

        <ReportChart
          title={`${data.title} Overview`}
          data={
            data.chart
          }
        />
      </div>
    </div>
  );
}