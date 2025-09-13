import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Tooltip, Dialog } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import numWords from "num-words";

import { toast } from "react-toastify";
import { MdHighlightOff } from "react-icons/md";
import Logo1 from "../../../assets/receipt/fts_log.png";
import Logo2 from "../../../assets/receipt/top.png";
import Logo3 from "../../../assets/receipt/ekal.png";
import moment from "moment";
import { IconFileTypePdf, IconMail, IconPrinter } from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";

import { IconArrowBack } from "@tabler/icons-react";


import {

  fetchReceiptViewById,

} from "../../../api";
import { FileText, Loader, MailPlus } from "lucide-react";
import mailSentGif from "../../../assets/mail-sent.gif";
import BASE_URL from "../../../base/BaseUrl";
import { decryptId } from "../../../utils/encyrption/Encyrption";
import axios from "axios";

const ReceiptOne = () => {
  const tableRef = useRef(null);
  const containerRef = useRef();

  const [receipts, setReceipts] = useState({});
  const [chapter, setChapter] = useState({});
  const [authsign, setSign] = useState({});
  const [authsign1, setSign1] = useState({});
  const [theId, setTheId] = useState(0);
  const [loader, setLoader] = useState(true);
  const [country, setCountry] = useState({});
  const { id } = useParams();
  const decryptedId = decryptId(id);
 const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const amountInWords = numWords(receipts.receipt_total_amount);
  const receiptStatus = (receipts.print_status);
 
  const [isPrintingReceipt, setIsPrintingReceipt] = useState(false);
  const [isPrintingLetter, setIsPrintingLetter] = useState(false);

  const navigate = useNavigate();

 
  const [donor1, setDonor1] = useState({
    indicomp_email: "",
  });

  const [open, setOpen] = useState(false);
 
  const handlPrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "letter-view",
    pageStyle: `
         @page {
         size: auto;
         margin: 1mm;
         
       }
       @media print {
         body {
           border: 0px solid #000;
           margin: 2mm;
           padding: 2mm;
           min-height: 100vh;
         }
         .print-hide {
           display: none;
         }
        
       
      
       .page-break {
         page-break-before: always;
   
            
       }
 
       }
       `,
    onBeforeGetContent: () => setIsPrintingLetter(true),
    onAfterPrint: () => setIsPrintingLetter(false),
  });
  

  const fetchData = async () => {
    try {
      const data = await fetchReceiptViewById(id);
      setReceipts(data.data);
      setChapter(data.chapter);
      setSign(data.auth_sign);
      setSign1(data.auth_sign);
      setCountry(data.country);
      setLoader(false);
    } catch (error) {
      toast.error("Failed to fetch viewer details");
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  
 const handlePrintWithSubmit = async (e) => {
    e.preventDefault();
    
    setIsButtonDisabled(true);

    try {
      const response = await axios.put(
        `${BASE_URL}/api/update-event-receipts-register-print-status/${decryptedId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data.code == 200) {
             
               fetchData(); 
               toast.success(response?.data.msg);
                 handlPrintPdf();
              
             } else {
               toast.error(response?.data.msg);
             }
    } catch (error) {
      console.error("Error updating Data :", error);
      toast.error("Error updating Data ");
    } finally {
      setIsButtonDisabled(false);
    }
  };

 
  return (
    <>
      <div className="  flex flex-col md:flex-row justify-between items-center bg-white px-4 py-2 mb-2 rounded-lg shadow-md gap-2">
        <div className="border-b-2 font-normal border-dashed border-orange-800 flex items-center">
          <IconArrowBack
            onClick={() => navigate("/receipt-list")}
            className="cursor-pointer hover:text-red-600 mr-2"
          />
          <p className="flex flex-row items-center gap-2">
            {" "}
            <span>Receipt View  <span className="rounded-md shadow-lg bg-blue-600 text-xs p-1">{receiptStatus || "Pending"} </span> </span>
           
          </p>
        </div>
        <div className="">
        
            <>
             
                <div className="flex flex-wrap justify-end gap-3 sm:gap-5">
                 
                  <button
                    title="Print Receipt"
                    className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-xs"
                    onClick={handlePrintWithSubmit}
                    disabled={isPrintingReceipt}
                  >
                    {isPrintingReceipt ? (
                      <Loader
                        strokeWidth={1.5}
                        className="h-7 w-7 text-black animate-spin"
                      />
                    ) : (
                      <>
                        <IconPrinter
                          strokeWidth={1.5}
                          className="h-7 w-7 text-black"
                        />
                      </>
                    )}
                    {/* <span> Receipt</span> */}
                  </button>

              
                </div>
             
            </>
          
        </div>
      </div>

      {/* main receipt */}
    <div className="overflow-x-auto grid md:grid-cols-1 1fr">
  {"2022-04-01" <= receipts.receipt_date && (
    <div className="flex justify-center">
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        <div ref={containerRef}>
          <div className="relative">
            <img
              src={Logo1}
              alt="water mark"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 w-auto h-56"
            />

            <div className="flex justify-between items-center border-t border-r border-l border-black">
              <img
                src={Logo1}
                alt="FTS logo"
                className="m-3 ml-12 w-auto h-16"
              />

              <div className="flex-1 text-center mr-24">
                <img
                  src={Logo2}
                  alt="Top banner"
                  className="mx-auto mb-0 w-80"
                />
                <h2 className="text-xl font-bold mt-1">
                  { "Friends of Tribals Society"}
                </h2>
              </div>

              <img
                src={Logo3}
                alt="Ekal logo"
                className="m-3 mr-12 w-16 h-16"
              />
            </div>

            <div className="text-center border-x border-b border-black p-1 h-14">
              <p className="text-sm font-semibold mx-auto max-w-[90%]">
                Ekal Bhawan, 123/A, Harish Mukherjee Road, Kolkata - 700026, West Bengal Email: fts.kolkata@ekal.org | Ph: 3324544510 | Mob: 6291858535
              </p>
            </div>

            <div className="text-center border-x h-7 border-black p-1">
              <p className="text-[11px] font-medium mx-auto">
                Head Office: Ekal Bhawan, 123/A, Harish Mukherjee Road,
                Kolkata-26. Web: www.ftsindia.com Ph: 033 - 2454
                4510/11/12/13 PAN: AAAAF0290L
              </p>
            </div>

            <table className="w-full border-t border-black border-collapse text-[12px]">
              <tbody>
                <tr>
                  <td className="border-l border-black p-1">
                    Received with thanks from :
                  </td>
                  <td className="border-l border-black p-1">
                    Receipt No.
                  </td>
                  <td className="p-2">:</td>
                  <td className="border-r border-black p-1">
                    <span className="font-bold">
                      {receipts.receipt_ref_no || "-"}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="border-l border-black" rowSpan="2">
                    {Object.keys(receipts).length !== 0 && (
                      <div className="ml-6 font-bold">
                        <p className="text-sm leading-tight">
                          {receipts.indicomp_full_name}
                        </p>
                        <p className="text-sm leading-tight">
                          {receipts.indicomp_email}
                        </p>
                        <p className="text-sm leading-tight">
                          Mobile: {receipts.indicomp_mobile_phone}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="border-l border-t border-black p-1">
                    Date
                  </td>
                  <td className="p-1 border-t border-black">:</td>
                  <td className="border-r border-t border-black p-1">
                    <span className="font-bold">
                      {moment(receipts.receipt_date).format("DD-MM-YYYY")}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="border-l border-t border-black p-1">
                    On account of
                  </td>
                  <td className="p-1 border-t border-black">:</td>
                  <td className="border-r border-t border-black p-1">
                    <span className="font-bold">
                      {receipts.receipt_donation_type || "General Donation"}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="border-l border-black p-1">
                    <div className="flex items-center">
                      <span>PAN No :</span>
                      <span className="font-bold ml-2">
                        {receipts.indicomp_pan_no || "Not Provided"}
                      </span>
                    </div>
                  </td>

                  <td className="border-l border-t border-black p-1">
                    Pay Mode
                  </td>
                  <td className="p-1 border-t border-black">:</td>
                  <td className="border-r border-t border-black p-1">
                    <span className="font-bold">
                      {receipts.receipt_tran_pay_mode || "N/A"}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="border-l border-t border-b border-black p-1">
                    Amount in words :
                    <span className="font-bold capitalize">
                      {amountInWords} Only
                    </span>
                  </td>
                  <td className="border-l border-b border-t border-black p-1">
                    Amount
                  </td>
                  <td className="p-1 border-b border-t border-black">:</td>
                  <td className="border-r border-b border-t border-black p-1">
                    Rs.{" "}
                    <span className="font-bold">
                      {receipts.receipt_total_amount}
                    </span>{" "}
                    /-
                  </td>
                </tr>

                <tr>
                  <td
                    className="border-l border-b border-r border-black p-1"
                    colSpan="4"
                  >
                    Reference :
                    <span className="font-bold text-xs">
                      {receipts.receipt_tran_pay_details || "No reference provided"}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td
                    className="border-l border-b border-black p-1"
                    colSpan="1"
                  >
                    {receipts.receipt_exemption_type === "80G" && (
                      <div className="text-[12px]">
                        {receipts.receipt_date > "2021-05-27" ? (
                          <>
                            Donation is exempt U/Sec.80G of the
                            <br />
                            Income Tax Act 1961 vide Order No.
                            AAAAF0290LF20214 Dt. 28-05-2021.
                          </>
                        ) : (
                          <>
                            This donation is eligible for deduction U/S
                            80(G) of the
                            <br />
                            Income Tax Act 1961 vide order
                            NO:DIT(E)/3260/8E/73/89-90 Dt. 13-12-2011.
                          </>
                        )}
                      </div>
                    )}
                    {receipts.receipt_exemption_type !== "80G" && (
                      <div className="text-[12px]">
                        This donation is not eligible for tax exemption under 80G.
                      </div>
                    )}
                  </td>
                  <td
                    className="border-b border-r border-black p-1 text-right text-[12px]"
                    colSpan="3"
                  >
                    For Friends of Tribals Society
                    <br />
                    <br />
                    <br />
                   
                      <div className="text-center">
                        <div className="h-12 mb-1 border-b border-black"></div>
                        <span className="font-semibold">Authorized Signatory</span>
                        <div className="text-sm text-gray-500">
                          Friends of Tribals Society
                        </div>
                      </div>
                   
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
    </>
  );
};

export default ReceiptOne;
