import { useState, useMemo, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { ArrowUpTrayIcon, ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";
import Papa from "papaparse";
import { format, parse } from "date-fns";
import Header from "../components/Header";
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from "../components/Table"; // new

const Tracker = () => {
    const [rewardData, setRewardData] = useState([]);

    const handleVerified = (value, row) => {
        const updatedData = [...rewardData]; // Copy the original array
        const rowIndex = row.id; // Get the index of the current row
        updatedData[rowIndex].verified = !value; // Update the 'verified' property of the specific object

        // Update the data in local storage
        localStorage.setItem("rewardData", JSON.stringify(updatedData));

        setRewardData(updatedData);
    };

    const columns = [
        {
            Header: "Date",
            accessor: "date"
        },
        {
            Header: "Amount",
            accessor: "amount",
            Footer: spendAmount => {
                const total = useMemo(
                    () =>
                        spendAmount.rows.reduce(
                            (sum, row) => parseInt(row.values.amount, 10) + sum,
                            0
                        ),
                    [spendAmount.rows]
                );

                return <span className="text-left text-lg font-bold text-black">{total}</span>;
            }
        },
        {
            Header: "Reward Rate",
            accessor: "rewardRate"
        },
        {
            Header: "Reward Points",
            accessor: "rewardPoints",
            Footer: spendAmount => {
                const total = useMemo(
                    () =>
                        spendAmount.rows.reduce(
                            (sum, row) => parseInt(row.values.rewardPoints, 10) + sum,
                            0
                        ),
                    [spendAmount.rows]
                );

                return <span className="text-left text-lg font-bold text-black">{total}</span>;
            }
        },
        {
            Header: "Verified",
            accessor: "verified",
            Cell: ({ value, row }) => {
                return (
                    <div className="text-left">
                        <input
                            type="checkbox"
                            className="rounded-sm border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                            checked={value}
                            onChange={() => handleVerified(value, row)}
                        />
                    </div>
                );
            },
            Footer: ({ rows }) => {
                const total = useMemo(() => {
                    return rows.reduce((sum, row) => {
                        const { rewardPoints, verified } = row.values;
                        return verified ? sum + parseInt(rewardPoints, 10) : sum;
                    }, 0);
                }, [rows]);

                return <span className="text-left text-lg font-bold text-black">{total || 0}</span>;
            },
            sortType: (a, b, id) => {
                const valueA = a.original[id];
                const valueB = b.original[id];

                if (valueA === valueB) {
                    return 0;
                } else if (valueA) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }
    ];
    const importFileInputRef = useRef(null);

    const triggerImportFileInput = () => {
        importFileInputRef.current.click();
    };

    const handleUploadTransaction = event => {
        event.preventDefault();
        const { files } = event.target;
        if (files?.length > 0) {
            const reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = () => {
                Papa.parse(reader.result, {
                    header: true,
                    skipEmptyLines: true,
                    beforeFirstChunk: chunk => {
                        const lines = chunk.split("\n");

                        // Check if the header row is valid
                        const header = lines[0].split(",").map(item => item.trim()); // Trim whitespace from each item
                        const expectedHeaders = ["Reward Points", "Amount", "Date", "Reward Rate"];

                        const isValidHeader = expectedHeaders.every(expectedHeader =>
                            header.includes(expectedHeader)
                        );
                        if (!isValidHeader) {
                            return toast.error("Invalid CSV header");
                        }

                        // Clean up any extra characters in each header
                        const cleanedHeader = header.map(item => item.replace(/\r$/, ""));

                        // Replace the header row with the cleaned header
                        lines[0] = cleanedHeader.join(",");

                        // Return the modified chunk
                        return lines.join("\n");
                    },
                    transformHeader: header => {
                        // Perform the header transformation as needed
                        if (header === "Reward Points" || header === "RP") {
                            return "rewardPoints";
                        }
                        if (header === "Amount") {
                            return "amount";
                        }
                        if (header === "Date") {
                            return "date";
                        }
                        if (header === "Reward Rate") {
                            return "rewardRate";
                        }
                        // Return the original header if no transformation is needed
                        return header;
                    },
                    complete: results => {
                        if (results.data?.length > 0) {
                            // const parsedData = results.data;
                            const parsedData = results.data.map(row => ({
                                ...row,
                                verified: false // Add the new column with the initial value
                            }));
                            // Store the updated data in local storage
                            const existingData = localStorage.getItem("rewardData");
                            let rewardData = [];
                            if (existingData) {
                                // If data exists, parse it from JSON to an array
                                rewardData = JSON.parse(existingData);
                            }
                            rewardData.push(...parsedData);
                            // Store the updated data in local storage
                            localStorage.setItem("rewardData", JSON.stringify(rewardData));

                            setRewardData(prevData => [...prevData, ...parsedData]);

                            importFileInputRef.current.value = "";
                            return toast.success("File uploaded");
                        }
                    },
                    error: error => {
                        toast.error("Please try again!");
                    }
                });
            };
        }
    };

    const handleDownloadTransaction = event => {
        event.preventDefault();

        // Define the custom column names
        const columnNames = ["Amount", "Reward Points", "Date", "Reward Rate"];

        const modifiedData = rewardData.map(row => {
            const modifiedRow = {};
            Object.keys(row).forEach((key, index) => {
                modifiedRow[columnNames[index]] = row[key];
            });
            return modifiedRow;
        });

        const csv = Papa.unparse(modifiedData);
        const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(csvData);
        link.download = "transactions.csv";
        link.click();

        return toast.success("Your file is ready to download");
    };

    useEffect(() => {
        const storedData = localStorage.getItem("rewardData");
        if (storedData) {
            setRewardData(JSON.parse(storedData));
        }
    }, []);

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
            <Head>
                <title>Tracker | RP Calculator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="my-12 w-full flex-1 flex-col items-center px-4 text-center sm:my-20 sm:px-6 lg:px-8">
                <h1 className="font-display mx-auto mb-5 max-w-4xl text-4xl font-bold tracking-normal text-slate-900 sm:text-6xl">
                    <Balancer>Track Your Rewards</Balancer>
                </h1>
                {rewardData?.length > 0 ? (
                    <>
                        <div className="mt-16 flex justify-center">
                            <div className="mr-2">
                                <input
                                    className="hidden"
                                    type="file"
                                    accept=".csv"
                                    onChange={handleUploadTransaction}
                                    ref={importFileInputRef}
                                />
                                <button
                                    onClick={triggerImportFileInput}
                                    className="font-xs inline-flex items-center rounded-md border border-gray-300 bg-white px-[8px] py-[6px] text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                                >
                                    {" "}
                                    <ArrowUpTrayIcon
                                        width={20}
                                        height={20}
                                        title="Upload"
                                        className="max-xs:mr-0 mr-[1px] mt-[0px] h-4 w-4 text-black"
                                    />
                                    <span className="sr-only">Upload transitions</span>
                                    <span className="hidden sm:ml-1 sm:inline-block">
                                        Import as CSV
                                    </span>
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={handleDownloadTransaction}
                                    className="font-xs inline-flex items-center rounded-md border border-gray-300 bg-white px-[8px] py-[6px] text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                                >
                                    {" "}
                                    <ArrowDownTrayIcon
                                        width={20}
                                        height={20}
                                        title="Upload"
                                        className="max-xs:mr-0 mr-[1px] mt-[0px] h-4 w-4 text-black"
                                    />
                                    <span className="sr-only">Download transitions</span>
                                    <span className="hidden sm:ml-1 sm:inline-block">
                                        Export as CSV
                                    </span>
                                </button>
                            </div>
                        </div>
                        <Table columns={columns} data={rewardData} />
                    </>
                ) : (
                    <div className="mt-20">
                        <h2 className="text-xl font-semibold text-gray-700">
                            You haven't saved any points yet.{" "}
                            <Link
                                href="/"
                                className="font-medium underline underline-offset-4 transition-colors hover:text-black"
                            >
                                Calculate points.
                            </Link>
                        </h2>
                        <Image
                            alt="Empty rewards"
                            src="/no-rewards.svg"
                            className="pointer-events-none m-auto mt-4"
                            width={400}
                            height={400}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Tracker;
