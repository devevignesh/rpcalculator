import { useState, useMemo, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";
import Papa from "papaparse";
import Header from "../components/Header";
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from "../components/Table"; // new

const Tracker = () => {
    const [rewardData, setRewardData] = useState([]);
    const columns = useMemo(
        () => [
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
            }
        ],
        []
    );
    const fileInputRef = useRef();

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleUploadTransaction = async event => {
        const { files } = event.target;
        if (files?.length > 0) {
            const reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = () => {
                Papa.parse(reader.result, {
                    header: true,
                    skipEmptyLines: true,
                    complete: results => {
                        const parsedData = results.data;
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
                        toast.success("File uploaded");
                    },
                    error: error => {
                        toast.error("Please try again!");
                    }
                });
            };
        }
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
                        <div className="mt-10 flex justify-center">
                            <div>
                                <input
                                    className="hidden"
                                    type="file"
                                    accept=".csv"
                                    onChange={handleUploadTransaction}
                                    ref={fileInputRef}
                                />
                                <button
                                    onClick={triggerFileInput}
                                    className="font-xs inline-flex items-center border border-gray-300 bg-white px-[8px] py-[6px] text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 rounded-md"
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
