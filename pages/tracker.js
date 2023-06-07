import { useState, useMemo, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
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
                        () => spendAmount.rows.reduce((sum, row) => row.values.amount + sum, 0),
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
                            spendAmount.rows.reduce((sum, row) => row.values.rewardPoints + sum, 0),
                        [spendAmount.rows]
                    );

                    return <span className="text-left text-lg font-bold text-black">{total}</span>;
                }
            }
        ],
        []
    );

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
                    <Table columns={columns} data={rewardData} />
                ) : (
                    <Image
                        alt="Empty rewards"
                        src="/rewards.svg"
                        className="mt-20 m-auto"
                        width={400}
                        height={400}
                    />
                )}
            </main>
        </div>
    );
};

export default Tracker;
