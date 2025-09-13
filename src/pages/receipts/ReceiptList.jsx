import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit, IconEye } from "@tabler/icons-react";
import moment from "moment";

import { navigateToReceiptEdit, navigateToReceiptView } from "../../api";

const ReceiptList = () => {
  const [receiptList, setReceiptList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type_id");

  useEffect(() => {
    const fetchReciptList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://agsrb.online/api1/public/api/fetch-event-receipts-register-list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReceiptList(response.data.data || []);
      } catch (error) {
        console.error("error while fetching receipt list ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReciptList();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Receipt No",
        size: 80,
      },
      {
        accessorKey: "receipt_date",
        header: "Date",
        size: 120,
        Cell: ({ row }) => {
          const date = row.original.receipt_date;
          return <>{date ? moment.utc(date).format("DD-MM-YYYY") : "N/A"}</>;
        },
      },
      {
        accessorKey: "indicomp_full_name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "indicomp_mobile_phone",
        header: "Mobile",
        size: 120,
      },
      {
        accessorKey: "indicomp_email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "indicomp_dob_annualday",
        header: "DOB / Annual Day",
        size: 150,
        Cell: ({ row }) => {
          const date = row.original.indicomp_dob_annualday;
          return <>{date ? moment.utc(date).format("DD-MM-YYYY") : "N/A"}</>;
        },
      },
      {
        accessorKey: "receipt_donation_type",
        header: "Donation Type",
        size: 120,
      },
      {
        accessorKey: "receipt_exemption_type",
        header: "Exemption Type",
        size: 120,
      },
      {
        accessorKey: "receipt_tran_pay_mode",
        header: "Payment Mode",
        size: 120,
      },
      {
        accessorKey: "receipt_tran_pay_details",
        header: "Payment Details",
        size: 200,
        Cell: ({ row }) => (
          <>{row.original.receipt_tran_pay_details || "N/A"}</>
        ),
      },
      {
        accessorKey: "receipt_total_amount",
        header: "Amount",
        size: 100,
      },
      {
        accessorKey: "indicomp_pan_no",
        header: "PAN No",
        size: 150,
        Cell: ({ row }) => <>{row.original.indicomp_pan_no || "N/A"}</>,
      },
      {
        accessorKey: "print_status",
        header: "Print Status",
        size: 120,
        Cell: ({ row }) => <>{row.original.print_status || "N/A"}</>,
      },
      {
        id: "id",
        header: "Action",
        size: 100,
        Cell: ({ row }) => {
          const id = row.original.id;
          return (
            <div className="flex gap-2">
              <div
                onClick={() => {
                  navigateToReceiptView(navigate, id);
                }}
                title="Receipt View"
                className="flex items-center space-x-2"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
              {userType === "2" && (
                <div
                  title="Receipt Edit"
                  onClick={() => {
                    navigateToReceiptEdit(navigate, id);
                  }}
                  className="flex items-center space-x-2"
                >
                  <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [navigate, userType]
  );

  const table = useMantineReactTable({
    columns,
    data: receiptList || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    state: {
      isLoading: loading,
    },
    mantineTableContainerProps: {
      sx: {
        maxHeight: "400px",
        position: "relative",
      },
    },
    mantineProgressProps: {
      color: "blue",
      variant: "bars",
    },
    renderTopToolbarCustomActions: () => (
      <h2 className="text-lg font-bold text-black px-4">
        Donation Receipt List
      </h2>
    ),
  });

  return (
    <Layout>
      <div className="max-w-screen">
        <MantineReactTable table={table} />
      </div>
    </Layout>
  );
};

export default ReceiptList;
