import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Balancer from "react-wrap-balancer";
import DropDown, { RewardType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<number>(0);
    const [reward, setReward] = useState<RewardType>("1X");
    const [generatedRewards, setGeneratedRewards] = useState<String>("");

    const checkRewards = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const spendThreshold = 200; // Threshold amount for earning reward points
        const rewardRate = {
            "1X": 12, // Reward points earned per multiple of the spend threshold for 1X
            "3X": 36, // Reward points earned per multiple of the spend threshold for 3X
            "5X": 60, // Reward points earned per multiple of the spend threshold for 5X
            "10X": 120 // Reward points earned per multiple of the spend threshold for 10X
        };

        const multiples = Math.floor(amount / spendThreshold); // Calculate the number of multiples
        const selectedRewardRate = rewardRate[reward] as number; // Cast the reward rate to number type
        const rewardPoints = multiples * selectedRewardRate; // Calculate the total reward points

        setGeneratedRewards(rewardPoints.toString());
        setLoading(false);
    };

    return (
        <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            <Head>
                <title></title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
                <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
                    <Balancer>Maximize Your Reward Points</Balancer>
                </h1>
                <p className="text-sm mt-4 mb-6 text-center font-medium text-slate-500">
                    (Currently in Beta for Axis Magnus users)
                </p>
                <div className="max-w-xl w-full">
                    <div className="flex mt-10 items-center space-x-3">
                        <Image
                            src="/1-black.png"
                            width={30}
                            height={30}
                            alt="1 icon"
                            className="mb-5 sm:mb-0"
                        />
                        <p className="text-left font-medium">Enter the amount.</p>
                    </div>
                    <input
                        name="amount"
                        type="text"
                        value={amount.toString()}
                        onChange={e => setAmount(parseInt(e.target.value, 10))}
                        className="block w-full my-5 rounded-md border border-gray-300 text-gray-900 text-md placeholder-gray-300 hover:bg-gray-50 focus:outline-none focus:border-black focus:ring-black focus:ring-1"
                        placeholder={"10000"}
                    />
                    <div className="flex mb-5 items-center space-x-3">
                        <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
                        <p className="text-left font-medium">Rewards.</p>
                    </div>
                    <div className="block">
                        <DropDown reward={reward} setReward={newReward => setReward(newReward)} />
                    </div>

                    {!loading && (
                        <button
                            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                            onClick={e => checkRewards(e)}
                        >
                            Check your reward &rarr;
                        </button>
                    )}
                    {loading && (
                        <button
                            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                            disabled
                        >
                            <LoadingDots color="white" style="large" />
                        </button>
                    )}
                </div>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{ duration: 2000 }}
                />
                <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
                <div className="space-y-10 my-10">
                    {generatedRewards && (
                        <>
                            <div>
                                <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                                    Total Reward Points
                                </h2>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-8">
                                <p className="text-6xl font-bold">{generatedRewards}</p>
                            </div>
                        </>
                    )}
                </div>
            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default Home;
